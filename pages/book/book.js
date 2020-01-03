// pages/cartoon/canvas.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    mid: null,
    cid: null,
    contents: [],
    nextCid: null,
    lastCid: null,
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
      mid: options.mid,
    });
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.loadContent(this.data.mid, this.data.cid, null, 0);
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pulldown.loadMore()
    if (this.data.lastCid == null) {
      this.pulldown.loadMoreComplete("已经到顶啦")
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 500)
    } else {
      this.pulldown.loadMoreComplete("跳转至上一章...")
      setTimeout(() => {
        this.loadContent(this.data.mid, this.data.lastCid, null, 1);
        wx.setNavigationBarTitle({
          title: this.data.lastTitle
        })
      }, 1000)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullup.loadMore()
    if (this.data.nextCid == null) {
      this.pullup.loadMoreComplete("已经到底啦")
    } else {
      setTimeout(() => {
        this.loadContent(this.data.mid, this.data.nextCid, null, 2);
        wx.setNavigationBarTitle({
          title: this.data.nextTitle
        })
      }, 1000)
    }
  },


  /**
   * 加载内容
   * parameter:
        cid：每一章的识别id， 
        api：翻页的url
   * remark: 
        type:
          0 = 首次加载
          1 = 加载上一页
          2 = 加载下一页
   */
  loadContent: function (mid, cid, api, type) {
    var that = this;
    app.service.getNovelContent(mid, cid, api)
      .then(res => {
        console.log(res);
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()

        if (type == 0 || type == 1) {
          that.setData({
            contents: [res.data.content]
          })
        } else {
          that.setData({
            contents: that.data.contents.concat(res.data.content),
          })
        }
        that.setData({
          lastCid: res.chapter_link.previous_cid.cid ? res.chapter_link.previous_cid.cid : null,
          nextCid: res.chapter_link.next_cid.cid ? res.chapter_link.next_cid.cid : null,
          lastTitle: res.chapter_link.previous_cid.title ? res.chapter_link.previous_cid.title : null,
          nextTitle: res.chapter_link.next_cid.title ? res.chapter_link.next_cid.title : null
        })

      })
      .catch(res => {
        if (type == 1) {
          that.pulldown.loadMoreComplete("加载失败")
        } else {
          that.pullup.loadMoreComplete("加载失败")
        }
      })
  }
})