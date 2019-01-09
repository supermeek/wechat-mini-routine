//app.js
import service from './service/service.js'

App({
  service: new service(),

  onLaunch: function () {
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    var that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      },
    })
  },

  globalData: {
    userInfo: null,
    windowWidth: 0,
    windowHeight: 0
  }

})