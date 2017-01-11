var examService = require("../../service/exam-service.js");
var us = require("../../lib/underscore.js");


var app = getApp();
Page({
  data:{

  },
  onLoad:function(args){
    console.log(args);
    var param = JSON.parse(args.param);
    _fn.init(param);

  },
  goCheckError:function(){
    inCorrect=us.compact(this.data.record.inCorrect);
    model=this.data.model;
    subject=this.data.subject;
    testType="error";
    var paramStr = "?model="+model+"&subject="+subject+"&testType="+testType+"&inCorrect="+JSON.stringify(inCorrect);
    wx.redirectTo({
        url:"../test/test"+paramStr,
      });
  }
});
var _fn = {
  init:function(param){
    _fn.renderFinish(param);
  },
  renderFinish:function(param){
  	var record;
  	if(param.testType==='rand'){
  		record = param.randRecord;
  	}else{
  		record = examService.readExamRecord({
  		  model:param.model,
  		  subject:param.subject,
  		});
  	}
    if(!record){
      us.last(getCurrentPages()).setData({
        noRecord:true
      });
    }else{
    	var total = record.total;
      var correctNum = record.correct.length;//回答正确的题目数量
      var percentage = (correctNum * 100 / total).toFixed(2)+'%';//正确率
      var renderData = {
        model : param.model,
        subject : param.subject,
        testType: param.testType==='rand'?"随机测试":"顺序学习",
        isGood:(correctNum * 100 / total).toFixed(2)>90?true:false,
        total:total,
        percentage:percentage,
        correct:correctNum,
        record:record
      };
      us.last(getCurrentPages()).setData(renderData);
    }
  },
  // renderRandTest:function(param){
  //   var randRecord = param.randRecord;
  //   var correctNum = randRecord.correct.length;//回答正确的题目数量
  //   var total = param.testType==="4"?50:100;//科目4有50道，科目1有100道
  //   var percentage = (correctNum * 100 / total).toFixed(2)+'%';//正确率
  //   var renderData = {
  //     model : param.model,
  //     subject : param.subject,
  //     testType: param.testType==='rand'?"随机测试":"顺序学习",
  //     title:_fn.getTitle(testType,percentage),//给用户一个总结语
  //     total:total,
  //     percentage:percentage,
  //     correct:correctNum,
  //     record:randRecord
  //   };
  //    us.last(getCurrentPages()).setData(renderData);
  // },
  // renderOrderTest:function(param){
  //   examService.readExamRecord({
  //     model:param.model,
  //     subject:param.subject,
  //   },function(data){
  //     var orderRecord = data.data;
  //     var correctNum = us.compact(orderRecord.correct).length;
  //     var total = orderRecord.total;
  //     var percentage = (correctNum * 100 / total).toFixed(2)+'%';

  //     var renderData = {
  //       model : param.model,
  //       subject : param.subject,
  //       testType: param.testType==='rand'?"随机测试":"顺序学习",
  //       title:_fn.getTitle(),
  //       total:total,
  //       percentage:percentage,
  //       correct:correctNum,
  //       record:orderRecord
  //     };
  //     us.last(getCurrentPages()).setData(renderData);
  //   });
  // },
  getTitle:function(){
    return "aaaa";
  }

};