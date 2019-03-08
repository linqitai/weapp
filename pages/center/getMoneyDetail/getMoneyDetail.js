let App = getApp();
var listArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{name:'张三'}],
    page:1,
    windowHeight: '',
    isLastPage: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //设置scroll-view高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res,"res")
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    // 获取当前订单信息
    listArr = []
    this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  scroll(e){
    // console.log(e.detail)
  },
  scrollToBottom() {
    console.log('scrollToBottom')
    var _this = this;
    console.log(_this.data.isLastPage, "_this.data.isLastPage")
    if (_this.data.isLastPage == false) {
      _this.setData({
        page: _this.data.page + 1
      })
      _this.getList();
    }
    if (_this.data.page == _this.data.last_page && _this.data.isLastPage == false){
      _this.data.isLastPage = true;
      // App.toast("数据已经加载完毕")
      return;
    }
  },
  getList() {
    var _this = this;
    App._get('extract/index', {
      page: _this.data.page
    }, function (result) {
      var list = result.data.data
      for(var i=0;i<list.length;i++) {
        var time = list[i].create_time;
        // console.log(time.split(' ')[0],"time.split(' ')[0]")
        list[i].create_time = time.split(' ')[0]
        listArr.push(list[i])
      }
      _this.setData({
        list: listArr,
        last_page: result.data.last_page
      })
    });
  },
  toUseBtn(){
    console.log("you click me")
    wx.switchTab({
      url: '/pages/category/index',
    })
  },
  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function () {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function (e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index';
        break;
      case 'fenlei':
        url = '../category/index';
        break;
      case 'cart':
        url = '../flow/index';
        break;
      case 'profile':
        url = '../user/index';
        break;
    }
    wx.switchTab({
      url
    });
  }
});