//index.js
//获取应用实例
var app = getApp();
Page({
	onLoad:function(args){
		var videoSrc = decodeURIComponent(args.videoSrc);
		this.setData({videoSrc:videoSrc});
	}
  
});
