let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    bankname: '',
    bankcard: '',
    deposit_bank: '',
    mobile: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    
    this.getAccountInfo(_this.data.active)
  },
  getAccountInfo: function (active) { // 1银行卡 2支付宝
    let _this = this;
    let prams = {
      type: (active + 1)
    }
    App._post_form('extract/get_bank', prams, function (result) {
      _this.setData(result.data);
    });
  },
  tabOnChange(event) {
    var _this = this;
    _this.setData({
      active: event.detail.index,
      bankname: '',
      bankcard: '',
      deposit_bank: '',
      mobile: ''
    })
    console.log(_this.data.active, 'active')
    _this.getAccountInfo(_this.data.active);
  },
  getValue(e) {
    console.log(e, "e")
    let name = e.target.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  submit: function () {
    let _this = this;

    let prams = {
      bankname: _this.data.bankname,
      bankcard: _this.data.bankcard,
      mobile: _this.data.mobile
    }
    if (_this.data.deposit_bank){
      prams.deposit_bank = _this.data.deposit_bank
    }
    if (App.hasNull(prams)){
      App.showToast("请填写完整信息")
      return;
    }
    let url = _this.data.active == 0 ? 'extract/bingding_bankcard' :'extract/bingding_alipay'
    App._post_form(url, prams, function (res) {
      // type 1银行卡 2支付宝
      // let result = res.data
      console.log(res, "res")
      if (res.code == 1) {
        App.showSuccess(res.msg)
      }
    });
  }
});