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
    this.getEwmInfo();
  },
  /**
   * 获取当前用户信息
   */
  getEwmInfo: function () {
    let _this = this;
    App._get('expand/wechat_code', {}, function (result) {
      _this.setData(result.data);
    });
  }
});