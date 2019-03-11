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
    var that = this;
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindinput(e){
    console.log(e,"e")
    if (e.detail.value.length<8){
      this.setData({
        value: e.detail.value
      })
    }else{
      App.toast("充值金额过大，你想搞事情吗？",2500)
      this.setData({
        value: e.detail.value.substring(0, e.detail.value.length-1)
      })
    }
  },
  nextBtn(){
    let _this = this;
    App._post_form('extract/charge', { value: _this.data.value }, function (result) {
      console.log(result, 'result')
      if (result.code == 1) {
        wx.requestPayment({
          timeStamp: result.data.payment.timeStamp,
          nonceStr: result.data.payment.nonceStr,
          package: 'prepay_id=' + result.data.payment.prepay_id,
          signType: 'MD5',
          paySign: result.data.payment.paySign,
          success: function (res) {
            wx.redirectTo({
              url: './success?value=' + _this.data.value,
            })
          },
          fail: function (res) {
            
          },
        });
        
      }
    });
    
  }
});