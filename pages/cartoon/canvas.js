// pages/cartoon/canvas.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    cid: null,
    contents: [],
    nextPage: null,
    lasttPage: null,
    imageDefault: "/images/loading4.gif",
    arr: [],
    arrTop: [],
    itemHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pullup = this.selectComponent("#pullup");
    this.pulldown = this.selectComponent("#pulldown");
    this.setData({
      title: options.title,
      cid: options.cid
    });
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.loadContent(this.data.cid, null, 0);
  },

  /**
   * 页面渲染完成之后
   */
  onReady: function(){
    setTimeout(()=>{
      this.getRect();
    }, 1000)
  },

  // 获取单张图片的高度
  getRect: function(){
    var that = this;
    wx.createSelectorQuery().select(".item").boundingClientRect(function(rect){
      that.setData({ itemHeight: rect.height })
      that.init(rect.height)
    }).exec()
  },

  init: function (itemHeight){
    let index = parseFloat(app.globalData.windowHeight / itemHeight)
    for (let i = 0; i < index; i++) {
      this.data.arr[i] = true
    }
    this.setData({arr: this.data.arr})
    // 遍历每个图片相对于顶部的高度值
    for(let i = 0; i < this.data.arr.length; i++){
      this.data.arrTop[i] = Math.floor(i * itemHeight)
    }
    this.setData({ arrTop: this.data.arrTop })
  },

  /**
   * 监控页面滚动
   */
  onPageScroll: function(e){
    // 滚动监听每个图片高度值是否小于滚动条高度，从而改变数值arr里对应的布尔值
    for(var i = 0; i < this.data.arrTop.length; i++){
      if( this.data.arrTop[i] < e.scrollTop + app.globalData.windowHeight ){
        if( this.data.arr[i] === false ){
          this.data.arr[i] = true
        }
      }
    }
    this.setData({ arr: this.data.arr })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('----下拉刷新列表----')
    this.pulldown.loadMore()
    if (this.data.lasttPage == null) {
      this.pulldown.loadMoreComplete("没有上一页")
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 500)
    } else {
      setTimeout(() => {
        this.loadContent(this.data.cid, this.data.lasttPage, 1);
      }, 1000)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("-----加载更多-----")
    this.pullup.loadMore()
    if (this.data.nextPage == null) {
      this.pullup.loadMoreComplete("没有下一页")
    } else {
      setTimeout(() => {
        this.loadContent(this.data.cid, this.data.nextPage, 2);
      }, 1000)
    }
  },

  /**
   * 加载内容
   */
  loadContent: function (cid, api, type) {
    var that = this;
    console.log(api);
    app.service.getCartoonContent(cid, api)
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        for (var i = 0; i < res.data.length; i++) {
          if (api == null) {
            that.data.arr.push(false)
          }else{
            if( type == 1 ){
              that.data.arr.unshift(false)
            }else if( type == 2 ){
              that.data.arr.push(false)
            }
          }
        }
        if (api == null) {
          that.setData({
            contents: res.data,
            nextPage: res.links.next,
            lastPage: res.links.previous
          })
        } else {
          if ( type == 1 ){
            that.setData({
              contents: res.data.concat(that.data.contents),
              nextPage: res.links.next,
              lastPage: res.links.previous
            })
            that.pulldown.loadMoreComplete("加载成功")
          } else if ( type == 2 ){
            that.setData({
              contents: that.data.contents.concat(res.data),
              nextPage: res.links.next,
              lastPage: res.links.previous
            })
            that.pullup.loadMoreComplete("加载成功")
          }
        }
      })
      .catch(res => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
        if (type == 1) {
          that.pulldown.loadMoreComplete("加载失败")
        }else{
          that.pullup.loadMoreComplete("加载失败")
        }
      })
  }
})