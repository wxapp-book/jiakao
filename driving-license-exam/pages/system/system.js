var wxService = require("../../common/js/wx.js");
var constant = require("../../common/js/constant.js");
var app = getApp();
Page({
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
});
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