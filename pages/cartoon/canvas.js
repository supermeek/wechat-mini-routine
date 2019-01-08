// pages/cartoon/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    cid: null,
    contents: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      cid: options.cid
    });
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.loadContent(this.data.cid);
    // console.log(JSON.parse(options.item));
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 加载内容
   */
  loadContent: function (cid) {
    var that = this;
    wx.request({
      url: 'http://yueyatianchong.cn/api/spider/chapters/' + cid +'/pages/?page=3',
      data: {},
      header: {
        'content-type': 'json',
        'Authorization': "Token 7f0ea9def8943bac7f343b63d38bfab194609ac5"
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          contents: that.data.contents.concat(res.data.data)
        });
      },
      fail: function () {
        console.log("详情加载失败");
      }
    })
  }
})