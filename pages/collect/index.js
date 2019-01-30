// pages/collect/index.js
const app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 180, //删除按钮宽度单位（rpx）
    list: [],
    tabs: ["漫画", "书籍", "影视"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEleWidth();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCollectList();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getCollectList();
  },

  // tab切换
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /** 左滑删除 */
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var type = e.target.dataset.type;
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[type][index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      // console.log(e.target);
      var index = e.target.dataset.index;
      var type = e.target.dataset.type;
      var list = this.data.list;
      list[type][index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },


  /**获取元素自适应后的实际宽度*/
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2)
      // 以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },




  /** 获取收藏列表 */
  getCollectList: function(){
    app.service.getCollectList()
      .then(res => {
        console.log(res)
        this.setData({
          list: res.data
        });
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      })
  },

  //点击删除按钮事件
  delItem: function (e) {
    var that = this;
    wx.showModal({
      title: '移除收藏',
      content: '确定删除' + e.target.dataset.name+'吗？',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.removeCollect(e.target.dataset.mid, e.target.dataset.type, function(){
            var index = e.target.dataset.index;
            var list = that.data.list;
            list[e.target.dataset.type].splice(index, 1);
            that.setData({ list: list });
          });
        }
      }
    });    
  },


  /**
   * 移除收藏
   */
  removeCollect: function (mid, source_type, callback) {
    app.service.removeCollect(mid, source_type)
      .then(res => {
        console.log(res);
        if (res.code == 0) {
          this.setData({ is_favourite: false });
          callback();
          wx.showToast({
            title: '已删除收藏',
            icon: 'none'
          })
        }
      })
  },


  // 开始阅读
  continue_read: function (e) {
    var detail_url = e.target.dataset.url;
    var url = "/pages/cartoon/canvas?title={{item.last_read_chapter_title}}&mid={{item.mid}}&cid={{item.last_read_cid}}"
    wx.navigateTo({
      url: detail_url
    })
  }

})