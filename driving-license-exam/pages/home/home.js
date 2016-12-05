var examService = require('../../service/exam-service.js');
var answerService = require('../../service/answer-service.js');
var wxService = require("../../common/js/wx.js");
var constant = require("../../common/js/constant.js");
var us = require("../../lib/underscore.js");

var app = getApp();
Page({
  data: {
  },
  goTest:function(args){
    console.log(args);
    var testParam = args.currentTarget.dataset;
    var testType = testParam.testtype;
    var subject=testParam.subject;
    var model=wxService.getStorage(constant.storageKey.userModel);
    var inCorrect=us.compact(examService.readExamRecord({
      model:model,
      subject:subject
    }).inCorrect);
    var paramStr = "?model="+model+"&subject="+subject+"&testType="+testType;
    if(testType==='error'){
      paramStr = paramStr + "&inCorrect="+JSON.stringify(inCorrect);
    }
    wx.navigateTo({
      url:"../test/test"+paramStr,
    });

  },
  updateExam:function(args){
     var updateParam = args.currentTarget.dataset;
     var subject=updateParam.subject;
     var model = wxService.getStorage(constant.storageKey.userModel);
     examService.queryAndSaveExam(subject,model);
  },
  clearCache:function(){
    wxService.clearStorage();
    this.onLoad();
  },
  changeModel:function(){//修改用户的考试车型
    var context = this;
    wx.showActionSheet({
      itemList:constant.models,
      success:function(result){
        _fn.changeModelSuccess(result,context);
      }
    });
  },
  //事件处理函数
  onLoad: function () {
    var data = {
      title: '首页',
      userModel:wxService.getStorage(constant.storageKey.userModel),
      examlist2:{items:constant.exam2},
      examlist3:{items:constant.exam3}
    };
    console.log(111,data);
    this.setData(data);
    initSystem.init(this);
  }
});

var systemInfo = {};
var initSystem = {
  init:function(context){
    this.checkSystem();
    if(systemInfo.updateExam){
      this.initExam(context);
    }
    this.initRecord();
  },
  checkSystem:function(){//检查当前系统，获取需要更新的项目
    var subjectList = constant.subjects;
    var modelList = constant.models;
    systemInfo = {
      updateExam : true
    };
  },
  initExam:function(){//更新试题库
    // examService.queryAndSaveAllExam();
    answerService.initAnswerMap();
  },
  initRecord:function(){//初始化统计
    var model=wxService.getStorage(constant.storageKey.userModel);
    var doRecord = function(result){
      if(result.errMsg === "getStorage:ok"){
        var correct = result.data.correct.length;
        var inCorrect = result.data.inCorrect.length;
        var total = result.data.total;
        var lastIndex = result.data.lastIndex;
        var record = {
          correct : ((correct / (correct + inCorrect))*100).toFixed(1)+"%",
          complete: ((lastIndex / total)*100).toFixed(1) + "%"
        };
        return record;
      }

    };
    if(!model){
      return;
    }
    examService.readExamRecord({
      model:model,
      subject:1
    },function(e1Result){
      var e1Record = doRecord(e1Result);
      us.last(getCurrentPages()).setData({
        e1Record : e1Record
      });
    });
    examService.readExamRecord({
      model:model,
      subject:4
    },function(e4Result){
      var e4Record = doRecord(e4Result);
      us.last(getCurrentPages()).setData({
        e4Record : e4Record
      });
      
    });

  }
};
var _fn = {
  changeModelSuccess:function(result,context){
    if(result.cancel){
      return;
    }else{
      var userSelectIndex = result.tapIndex;
      var selectModel = constant.models[userSelectIndex];
      wxService.setStorage(constant.storageKey.userModel,selectModel);
      var userModel = wxService.getStorage(constant.storageKey.userModel);
      context.setData({userModel:userModel});
    }
  }
};
