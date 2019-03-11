//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  onShow(){
    // 获取当前用户信息
    this.getUserDetail();
  },
  getMoneyBtn(){
    wx.navigateTo({
      url: './getMoney/getMoney',
    })
  },
  /**
 * 获取当前用户信息
 */
  getUserDetail: function () {
    let _this = this;
    App._get('expand/index', {}, function (result) {
      _this.setData(result.data);
      // wx.setStorageSync("my_info", JSON.stringify(result.data))
    });
  },
})
