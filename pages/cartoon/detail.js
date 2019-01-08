// pages/cartoon/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    last_read :{
      title: "adsa 2话",
      chapter: 12,
      url: "",
    },
    chapters: [],
    array: [
      {
        mode: 'scaleToFill',
        text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
      }, {
        mode: 'aspectFit',
        text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
      }, {
        mode: 'aspectFill',
        text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
      }
    ],
    src: '/images/luffy.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      item: JSON.parse(options.item)
    });
    wx.setNavigationBarTitle({
      title: this.data.item.title,
    })
    this.loadDetail(this.data.item.mid);
    console.log(JSON.parse(options.item));
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
   * 加载章节
   */
  loadDetail: function (mid) {
    var that = this;
    wx.request({
      url: 'http://yueyatianchong.cn/api/spider/books/'+mid+'/chapters/',
      data: {},
      header: {
        'content-type': 'json',
        'Authorization': "Token 7f0ea9def8943bac7f343b63d38bfab194609ac5"
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          chapters: res.data.data
        })
      },
      fail: function () {
        console.log("详情加载失败");
      }
    })
  }


})