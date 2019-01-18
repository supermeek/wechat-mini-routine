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
    nextCid: null,
    lastCid: null,
    imageDefault: "/images/loading4.gif",
    arr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pullup = this.selectComponent("#pullup");
    this.pulldown = this.selectComponent("#pulldown");
    this.setData({
      title: options.title,
      cid: options.cid,
      arr: []
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
    this.data.arr[0] = true
    this.setData({
      arr: this.data.arr
    })      
  },


  /**
   * 监控页面滚动
   */
  onPageScroll: function(e){
    
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pulldown.loadMore()
    if (this.data.lasttPage == null) {
      if (this.data.lastCid == null) {
        this.pulldown.loadMoreComplete("没有上一页")
        setTimeout(() => {
          wx.stopPullDownRefresh();
        }, 500)
      } else {
        this.pulldown.loadMoreComplete("跳转至上一章...")
        setTimeout(() => {
          this.loadContent(this.data.lastCid, null, 1);
        }, 1000)
      }
    } else {
      this.pulldown.loadMoreComplete("跳转至上一页...")
      setTimeout(() => {
        this.loadContent(this.data.cid, this.data.lasttPage, 1);
      }, 1000)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullup.loadMore()
    if (this.data.nextPage == null) {
      if( this.data.nextCid == null ){
        this.pullup.loadMoreComplete("没有下一页")
      }else{
        setTimeout(() => {
          this.loadContent(this.data.nextCid, null, 2);
        }, 1000)
      }
    } else {
      setTimeout(() => {
        this.loadContent(this.data.cid, this.data.nextPage, 2);
      }, 1000)
    }
  },

  // 图片加载完成事件
  loadImg: function(e){
    // console.log(e)
    var index = e.currentTarget.dataset.id;
    if (this.data.arr[index - 1] === false){
      this.data.arr[index - 1] = true
    } else if (this.data.arr[index + 1] === false ){
      this.data.arr[index + 1] = true
    }
    this.setData({
      arr: this.data.arr
    })
  },


  //图片点击事件
  previewImg: function(event) {
    console.log(event)
    var src = event.currentTarget.dataset.src;//获取data-src
    var list = []
    for (var key in this.data.contents){
      list.push(this.data.contents[key].url)
    }
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },

  /**
   * 加载内容
   * parameter:{ cid：每一章的识别id， api：翻页的url }
   * remark: type: 0=首次加载 / 1=加载上一页 / 2=加载下一页
   */
  loadContent: function (cid, api, type) {
    var that = this;
    app.service.getCartoonContent(cid, api)
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        for (var i = 0; i < res.data.length; i++) {
          if (type == 0 || type == 2){
            that.data.arr.push(false)
          }else{
            that.data.arr.unshift(false)
          }
        }
        

        if (type == 0) {
          that.setData({
            contents: res.data
          })
        } else {
          if ( type == 1 ){
            that.setData({
              contents: res.data.concat(that.data.contents)
            })
          } else if ( type == 2 ){
            that.setData({
              contents: that.data.contents.concat(res.data),
            })
          }
        }
        that.setData({
          nextPage: res.links.next,
          lastPage: res.links.previous,
          nextCid: res.chapter_link.next_cid,
          lastCid: res.chapter_link.previous_cid
        })

      })
      .catch(res => {
        if (type == 1) {
          that.pulldown.loadMoreComplete("加载失败")
        }else{
          that.pullup.loadMoreComplete("加载失败")
        }
      })
  }
})