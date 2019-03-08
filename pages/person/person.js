//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
    active:0,
    userInfo: {},
    orderCount: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    // 获取当前用户信息
    this.getUserDetail();
  },
  /**
 * 获取当前用户信息
 */
  getUserDetail: function () {
    let _this = this;
    App._get('user.index/detail', {}, function (result) {
      _this.setData(result.data);
    });
  },
})
