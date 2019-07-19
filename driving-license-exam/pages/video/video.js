var app = getApp();
Page({
  onLoad: function (args) {
    var videoSrc = decodeURIComponent(args.videoSrc);
    this.setData({ videoSrc: videoSrc });
  }

});
