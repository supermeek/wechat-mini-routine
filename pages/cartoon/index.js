// pages/cartoon/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    isFixedTop: false,
    list:[],
    nextPage: null,
    lasttPage: null,
  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.pullup = this.selectComponent("#pullup");
    this.loadList();
  },

  /**
   * 监听页面滚动
   */
  onPageScroll: function (e) {
    if ( e.scrollTop > 100 ){
      this.setData({
        isFixedTop: true
      })
    }else{
      this.setData({
        isFixedTop: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('----下拉刷新列表----')
    wx.showNavigationBarLoading()
    this.loadList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("-----加载更多-----")
    this.pullup.loadMore()
    if (this.data.nextPage == null){
      this.pullup.loadMoreComplete("已全部加载")
    }else{
      setTimeout(() => {
        this.loadList(null, this.data.nextPage);
      }, 1000)
    }
  },

  /**
   * 加载列表
   * parameter：name:搜索名称，api:下一页的api地址
   */
  loadList: function (name, api ) {
    var that = this
    app.service.getCartoonList(name, api )
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].item_string = JSON.stringify(res.data[i]);
        }
        if( api == null ){
          that.setData({
            list: res.data,
            nextPage: res.links.next,
            lastPage: res.links.previous
          })
        }else{
          that.setData({
            list: that.data.list.concat(res.data),
            nextPage: res.links.next,
            lastPage: res.links.previous
          })
        }
        that.pullup.loadMoreComplete("加载成功")
      })
      .catch(res => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
        that.pullup.loadMoreComplete("加载失败")
      })
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
    this.loadList()
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    // this.loadList()
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.loadList(e.detail.value, null)
    console.log(e.detail)
    this.setData({
      inputVal: e.detail.value
    });
  }


})

