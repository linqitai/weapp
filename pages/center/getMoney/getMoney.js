let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前用户信息
    this.getUserDetail();
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
  toDetaiView(){
    wx.navigateTo({
      url: '../getMoneyDetail/getMoneyDetail',
    })
  },
  toApplyView(){
    wx.navigateTo({
      url: '../apply/apply',
    })
  }
});