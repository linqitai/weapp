let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderCount: {},
    phone:''
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
    this.getUserDetail();
    this.getPhone();
  },
  toApplyView() {
    wx.navigateTo({
      url: '../../center/apply/apply?active=0',
    })
  },
  getPhone() {
    let _this = this;
    App._post_form('extract/get_phone', {}, function (result) {
      console.log(result, 'result')
      if (result.code == 1) {
        _this.setData({
          phone: result.data
        })
      }
    });
  },
  toInputView(){
    wx.navigateTo({
      url: './input',
    })
  },
  /**
* 获取当前用户信息
*/
  getUserDetail: function () {
    let _this = this;
    App._get('user.index/detail', {}, function (result) {
      _this.setData(result.data);
    });
  }
});