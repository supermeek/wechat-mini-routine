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
          res.data[i].item_string = JSON.stringify(res.data[i]);
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


    // var that = this;
    // wx.request({
    //   url: 'http://yueyatianchong.cn/api/spider/chapters/' + cid +'/pages/',
    //   data: {},
    //   header: {
    //     'content-type': 'json',
    //     'Authorization': "Token e336203a71ad99e42a02cc0e41e1fa00610ec98a"
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       contents: that.data.contents.concat(res.data.data)
    //     });
    //   },
    //   fail: function () {
    //     console.log("详情加载失败");
    //   }
    // })
  }
})