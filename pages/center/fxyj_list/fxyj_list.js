let App = getApp();
var listArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
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
        console.log(res, "res")
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
  onPullDownRefresh: function () {
    // 获取当前订单信息
    listArr = []
    this.getList();
  },
  scroll(e) {
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
    if (_this.data.page == _this.data.last_page && _this.data.isLastPage == false) {
      _this.data.isLastPage = true;
      // App.toast("数据已经加载完毕")
      return;
    }
  },
  getList() {
    var _this = this;
    App._get('expand/integral_list', {
      page: _this.data.page
    }, function (result) {
      var list = result.data.data
      if (list){
        for (var i = 0; i < list.length; i++) {
          var time = list[i].update_time;
          // console.log(time.split(' ')[0],"time.split(' ')[0]")
          list[i].update_time = time.split(' ')[0]
          listArr.push(list[i])
        }
      }
      _this.setData({
        list: listArr,
        last_page: result.data.last_page
      })
      wx.stopPullDownRefresh()
    });
  },
  toUseBtn() {
    console.log("you click me")
    wx.switchTab({
      url: '/pages/category/index',
    })
  }
});