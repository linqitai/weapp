let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      value:options.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  completeBtn(){
    wx.navigateBack()
  }
});