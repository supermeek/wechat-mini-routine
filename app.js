import service from './service/service.js'

App({

  service: new service(),
  
  onLaunch: function () {

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    this.appload();
    
  },


  // 登录获取token
  appload: function () {
    var that = this;
    wx.login({
      success: res => {
        // console.log(res)
        this.service.wxlogin(res.code).then(res => {
          // console.log(res);
          this.service.setHeader(res.data)
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 500)
        })
      }
    });
  },
  

  globalData: {
    userInfo: null,
    windowWidth: 0,
    windowHeight: 0
  }

})