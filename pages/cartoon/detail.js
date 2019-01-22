// pages/cartoon/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: null,
    item: null,
    reverse: false,
    is_favourite: false,
    nextPage: null,
    lasttPage: null,
    last_read :{
      title: "",
      chapter: 12,
      url: "",
    },
    chapters: [],
  },


  /**
   * 添加收藏/取消收藏
   */
  add_collect: function(){
    this.addCollect(this.data.mid, "comic")
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.pullup = this.selectComponent("#pullup");
    this.setData({
      mid: options.mid
    });
    
    this.loadInfo( options.mid, null);
    this.loadDetail( options.mid, null );
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadInfo(this.data.mid, null);
    this.loadDetail(this.data.mid, null);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullup.loadMore()
    if (this.data.nextPage == null) {
      this.pullup.loadMoreComplete("已全部加载")
    } else {
      setTimeout(() => {
        this.loadDetail(this.data.mid, this.data.nextPage);
      }, 1000)
    }
  },


  // 章节排序
  sort_list:function(){
    this.setData({
      reverse: !this.data.reverse
    });
    this.loadDetail(this.data.mid, null, this.data.reverse);
  },


  /**
   * 加载详情信息
   */
  loadInfo: function (mid, api) {
    var that = this;
    app.service.getCartoonInfo(mid, api)
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        that.setData({
          item: res.data,
          is_favourite: res.data.is_favourite
        })
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
      })
  },


  /**
   * 加载章节
   */
  loadDetail: function (mid, api, reverse) {
    var that = this;
    app.service.getCartoonDetail(mid, api, reverse)
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        if (api == null) {
          that.setData({
            chapters: res.data,
            nextPage: res.links.next,
            lastPage: res.links.previous
          })
        } else {
          that.setData({
            chapters: that.data.chapters.concat(res.data),
            nextPage: res.links.next,
            lastPage: res.links.previous
          })
          that.pullup.loadMoreComplete("加载成功")
        }
      })
      .catch(res => {
        that.pullup.loadMoreComplete("加载失败")
      })
  },



  /**
   * 添加收藏
   */
  addCollect: function (mid, source_type) {
    app.service.addCollect(mid, source_type)
      .then(res => {
        console.log(res);
        if(res.code == 0){
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        }
      })
  },


})