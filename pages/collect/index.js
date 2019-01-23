// pages/collect/index.js
const app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"/images/201.jpg",
    delBtnWidth: 180, //删除按钮宽度单位（rpx）
    list: [
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      },
      {
        id: 0,
        txtStyle: "",
        title: "火影忍者啊",
        icon: "http://img.1whour.com/xpic/hacklink.jpg",
        txt: "阅读至第12话",
        status: "连载中",
        speed: "更新至248话"
      }
    ],

    tabs: ["漫画", "书籍", "电影"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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

    this.getCollectList();

  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },


  /** 
   * 左滑删除
   */
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
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    console.log("***********")
    console.log(e)
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
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
      // console.log(scale);
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


  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index, 1);
    //更新列表的状态
    this.setData({
      list: list
    });
  },


  /** 获取收藏列表 */
  getCollectList: function(){
    app.service.getCollectList()
      .then(res => {
        console.log(res)
      })
  }





})