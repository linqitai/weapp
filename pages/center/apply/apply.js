let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    hasInfo:false,
    value:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.getAccountInfo();
  },
  getValue(e){
    console.log(e, "e")
    let name = e.target.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  submit: function () {
    let _this = this;
    let prams = {
      type: _this.data.type, // 1是银行卡 2是支付宝
      bankname: _this.data.bankname,
      bankcard: _this.data.bankcard,
      deposit_bank: _this.data.deposit_bank ? _this.data.deposit_bank:'',
      mobile: _this.data.mobile,
      value: _this.data.value,
      extract_type: _this.data.active == 1 ? 1 : 2 // 提现类别 1是佣金提现 2是余额提现
    }
    App._post_form('extract/money_extract_post', prams, function (res) {
      // type 1银行卡 2支付宝
      // let result = res.data
      console.log(res,"res")
      if(res.code == 1){
        App.showSuccess(res.msg)
      }
    });
  },
  tabOnChange(event){
    var _this = this;
    _this.setData({
      active: event.detail.index,
      value:''
    })
    console.log(_this.data.active,'active')
    _this.getAccountInfo();
  },
  getAccountInfo: function () {
    let _this = this;
    let prams = {
      money_type: _this.data.active == 1 ? 2 : 1
    }
    App._post_form('extract/money_extract_view', prams, function (res) {
      // type 1银行卡 2支付宝
      let result = res.data
      _this.setData({
        money: result.money
      });
      if (result.bank.bankname || result.alipay.bankname) {
        _this.setData({
          hasInfo: true
        })
      }
      if (result.bank.bankname){
        _this.setData(result.bank);
      } else if ((!result.bank.bankname) && result.alipay.bankname){
        _this.setData(result.alipay);
      }
      console.log(_this.data.type,"type")
    });
  },
  getGetBank: function () {
    let _this = this;
    App._post_form('extract/get_bank', {type:1}, function (result) {
      if (result.data.bankname){
        _this.setData({
          hasInfo:true
        })
      }
      _this.setData(result.data);
    });
  },
  toBindView(){
    wx.navigateTo({
      url: '../bind/bind',
    })
  }
});