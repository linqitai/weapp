//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
    active:0,
    userInfo: {},
    orderCount: {},
    phone:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(){
    this.getPhone();
  },
  onShow: function () {
    wx.setStorageSync("_from","")
    wx.setStorageSync('type', "")
    // 获取当前用户信息
    this.getUserDetail();
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
  call(){
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.phone,
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
  },
})
