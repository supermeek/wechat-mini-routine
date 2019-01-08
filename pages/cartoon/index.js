// pages/cartoon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    list:[],
    src: '/images/luffy.jpg',
  },

  /**
   * 搜索框
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("到顶啦")
    console.log('--------下拉刷新-------')
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("到底啦")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 加载列表
   */
  loadList: function () {
    var that = this;
    wx.request({
      url: 'http://yueyatianchong.cn/api/spider/books/',
      data: {},
      header: {
        'content-type': 'json',
        'Authorization': "Token 7f0ea9def8943bac7f343b63d38bfab194609ac5"
      },
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].item_string = JSON.stringify(res.data.data[i]);
        }
        that.setData({
          list: that.data.list.concat(res.data.data)
        });
        console.log(res.data)
      },
      fail: function () {
        console.log("列表加载失败");
      }
    })
  }
})

