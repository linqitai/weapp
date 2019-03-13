let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    phone:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      value: parseFloat(options.value).toFixed(2)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPhone();
  },
  getPhone(){
    let _this = this;
    App._post_form('extract/get_phone', {}, function (result) {
      console.log(result, 'result')
      if (result.code == 1) {
        _this.setData({
          phone:result.data
        })
      }
    });
  },
  completeBtn(){
    wx.navigateBack()
  }
});