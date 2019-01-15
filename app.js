//app.js
import service from './service/service.js'


App({
  service: new service(),
  
  onLaunch: function () {

    


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)



    // 检查登录态是否过期
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() // 重新登录
      }
    })

    


    // 获取用户信息
    wx.getSetting({
      success: res => {
          // 判断用户是否授权，授权可直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // console.log(res);
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取窗口宽高 => 图片懒加载
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      },
    })
    
  },


  onShow: function () {
    var that = this;
    wx.login({
      success: res => {
        // console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 登录获取token
        this.service.wxlogin(res.code).then(res => {
          // console.log(res);
          this.service.setHeader(res.data)
        }).catch(res => {
          wx.showToast({
            title: '出错了！',
            icon: 'none'
          })
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