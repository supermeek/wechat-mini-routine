//app.js
import service from './service/service.js'

App({
  onLaunch: function () {
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  service: new service()
})