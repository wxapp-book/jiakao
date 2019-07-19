var queue=require("queue.js");
var constant=require("constant.js");
var us=require("../../lib/underscore.js")

var callNum=0;
var ajaxQueue=queue.getQueue("wxAjaxQueue");
var fire=function(){
  if(callNum<5 && ajaxQueue.callbackArray.length>0){
    ajaxQueue.fire();
    callNum++;
  }
};
var query=function(args){
  var appKey=constant.appKey;
  var url=args.url;
  var data=args.data||{};
  var complete=args.complete;
  var fail=args.fail;
  data.key=appKey;
  wx.request({
    url: url,
    data:data,
    complete:function(resp){
      fire();
      if(typeof complete==="function"){
        complete(resp);
      }
      if(ajaxQueue.getSize()<=0){
        wx.hideToast();
      }
      callNum--;
    }
  });
};
var handle={
  queryJH:function(args){
    wx.showToast({
      title: '数据加载中',
      icon:"loading",
      duration:10000
    });
    if(ajaxQueue && ajaxQueue.callbackArray.length>=0){
      ajaxQueue.add(args,query);
      fire();
    }
  },
  setStorage: function () {
    var key, data, complete, fail;
    if (arguments.length === 1 && us.isObject(arguments[0]) 
      && !us.isArray(arguments[0])) {//异步
      key = arguments[0].key;
      data = arguments[0].data;
      complete = arguments[0].complete;
      fail = arguments[0].fail;
      wx.setStorage({
        key: key,
        data: data,
        complete: function (data) {
          if (us.isFunction(complete)) {
            complete(data);
          }
        }
      });
    } else {//同步
      key = arguments[0];
      data = arguments[1];
      try {
        return wx.setStorageSync(key, data);
      } catch (e) {
        console.error(e);
      }
    }
  },
  getStorage: function () {
    var key, complete, fail;
    if (arguments.length === 2) {//异步
      key = arguments[0];
      complete = arguments[1];
      wx.getStorage({
        key: key,
        complete: function (data) {
          if (us.isFunction(complete)) {
            complete(data);
          }
        }
      });
    } else {//同步
      key = arguments[0];
      try {
        return wx.getStorageSync(key);
      } catch (e) {
        console.error(e);
      }
    }
  },
  clearStorage: function () {
    try {
      return wx.clearStorageSync();
    } catch (e) {
      console.error(e);
    }
  }

};

module.exports = handle;