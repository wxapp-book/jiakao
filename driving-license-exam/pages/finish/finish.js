var examService = require("../../service/exam-service.js");
var us = require("../../lib/underscore.js");


var app = getApp();
Page({
  data: {

  },
  onLoad: function (args) {
    var param = JSON.parse(args.param);
    _fn.init(param);
  },
  goHome:function(){
    wx.redirectTo({
      url:"../index/index"
    });
  },
  goCheckError: function () {
    var inCorrect = us.compact(this.data.record.inCorrect);
    var model = this.data.model;
    var subject = this.data.subject;
    var testType = "error";
    var paramStr = "?model=" + model + "&subject=" + subject + "&testType=" + testType + "&inCorrect=" + JSON.stringify(inCorrect);
    wx.redirectTo({
      url: "../test/test" + paramStr,
    });
  }
});
var _fn = {
  init: function (param) {
    _fn.renderFinish(param);
  },
  renderFinish: function (param) {
    var record;
    if (param.testType === 'rand') {
      record = param.randRecord;
    } else {
      record = examService.readExamRecord({
        model: param.model,
        subject: param.subject,
      });
    }
    if (!record) {
      us.last(getCurrentPages()).setData({
        noRecord: true
      });
    } else {
      var total = record.total;
      var correctNum = record.correct.length;//回答正确的题目数量
      var percentage = (correctNum * 100 / total).toFixed(2) + '%';//正确率
      var renderData = {
        model: param.model,
        subject: param.subject,
        testType: param.testType === 'rand' ? "随机测试" : "顺序学习",
        isGood: (correctNum * 100 / total).toFixed(2) > 90 ? true : false,
        total: total,
        percentage: percentage,
        correct: correctNum,
        record: record
      };
      us.last(getCurrentPages()).setData(renderData);
    }
  },
  getTitle: function () {
    return "成绩单";
  }
};