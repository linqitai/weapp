let App = getApp();
var couponList = [];
var post_pay_typeCouponList = [];
var my_intergal, my_money, order_total_price, sub_jf, sub_ye,result_price;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数
    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {}, // 商品信息
    distribution_time : null, //配送时间
    pay_type:{},
    pay_type_arr:'',
    time_type: 0,//默认今天送
    time_value:'',
    time_value_index:0,
    time_type_arr: [{ name: "即时送", value: 0, checked: true }, { name: "明日达",value:1,checked:false }],
    time_list:[],
    disabled: false,
    post_pay_type :10,
    post_dis_type :0,
    hasError: false,
    couponOptions: [],
    couponIndex: 0,
    couponId: '',
    error: '',
    time_number: "",
    couponShow: false,
    windowHeight:'',
    windowWidth:'',
    page: 1,
    isLastPage: false,
    isHiddenCounpon:false,
    integral_checked:false,
    integral_status:0,
    sub_jf: 0,
    sub_ye:'0.00',
    result_price:'0.00'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
    console.log(options, "options");
    console.log(this.data.time_number,"time_number");
    let timeString = new Date().getTime().toString();
    let newTimeString = timeString.substr(0, timeString.length-3);
    this.setData({
      time_number:newTimeString
    })
    this.getWindowsInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("==========================onShow===========================");
    // 获取当前订单信息
    this.getOrderData();
    this.setData({
      couponIndex:0
    })
  },
  calculate_my_money(){
    if (!this.data.integral_checked){
      let p = '', sub_ye = ''
      if (this.data.my_money >= this.data.order_total_price) {
        p = 0;
        sub_ye = this.data.order_total_price
      } else {
        p = (this.data.order_total_price - this.data.my_money)
        sub_ye = this.data.my_money
      }
      result_price = p
      this.setData({
        result_price: p,
        sub_ye
      })
    }
  },
  calculate_my_money2(pay,my_money){
    let p = '', sub_ye = ''
    if (my_money >= pay) {//余额大于所需支付金额
      p = 0;
      sub_ye = pay
    } else {
      p = (pay - my_money)
      sub_ye = my_money
    }
    this.setData({
      order_pay_price: p,
      sub_ye
    })
  },
  onChangeIntegral() { // my_intergal 积分 my_money余额
    let _this = this;
    _this.setData({
      integral_checked: !_this.data.integral_checked
    })
    if (_this.data.integral_checked){//选择积分抵扣
      if(my_intergal>=order_total_price){
        result_price = '0.00';
        sub_jf = order_total_price;
        sub_ye = '0.00'
      }else{
        result_price = order_total_price - my_intergal
        console.log(result_price, 'result_price')
        sub_jf = my_intergal;
        if (my_money >= result_price) {
          sub_ye = result_price
          result_price = '0.00';
        }else{
          result_price = result_price - my_money
          sub_ye = my_money
        }
      }
    } else {// 不选择积分抵扣
      if (my_money >= order_total_price){
        result_price = '0.00';
        sub_jf = 0;
        sub_ye = order_total_price
      }else{
        result_price = order_total_price - my_money;
        sub_jf = 0;
        sub_ye = my_money
      }
    }
    _this.setData({
      result_price,
      sub_jf,
      sub_ye
    })
  },
  toGetAddress(){
    // wx.setStorageSync('_from', 'flow')
    // wx.navigateTo({
    //   url: '../address/index',
    // })
    let _this = this;
    wx.setStorageSync('_from', 'flow');// 记得在我的页面要清空
    console.log(wx.getStorageSync('_from'), "wx.getStorageSync('_from')")
    let url = ''
    if (_this.data.exist_address){
      url = '../address/index?from=flow'
    }else{
      url = '../address/create'
      wx.setStorageSync('operate', 'add')
    }
    wx.navigateTo({
      url: url
    });
  },
  scrollToBottom() {
    console.log('scrollToBottom')
    var _this = this;
    console.log(_this.data.isLastPage, "_this.data.isLastPage")
    if (_this.data.isLastPage == false) {
      _this.setData({
        page: _this.data.page + 1
      })
      _this.getList();
    }
    if (_this.data.page == _this.data.last_page && _this.data.isLastPage == false) {
      _this.data.isLastPage = true;
      // App.toast("数据已经加载完毕")
      return;
    }
  },
  toUseBtn() {
    console.log("you click me")
    wx.switchTab({
      url: '/pages/category/index',
    })
  },
  getWindowsInfo(){
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        _this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  openPopup(){
    this.setData({ couponShow: true });
  },
  onClose(){
    this.setData({ couponShow: false });
  },
  getCouponOptions(post_pay_typeCouponList){
    var couponOptions = [];
    if (post_pay_typeCouponList.length>0){
      for (var i = 0; i < post_pay_typeCouponList.length; i++) {
        if (post_pay_typeCouponList[i].c_type.type == 1) {// c_type 里面 type 1是优惠券 2是折扣券
          // console.log(post_pay_typeCouponList,"post_pay_typeCouponList")
          let counpon = `满${post_pay_typeCouponList[i].invest_money}减${post_pay_typeCouponList[i].money}`
          let reason = post_pay_typeCouponList[i].not_reason ? '(' + post_pay_typeCouponList[i].not_reason+')':''
          couponOptions.push(counpon + reason)
          
        } else if (post_pay_typeCouponList[i].c_type.type == 2) {
          var zhekou = '';
          var money = post_pay_typeCouponList[i].money.split('');
          for (var j = 0; j < money.length; j++) {
            if (money[j] == '0' || money[j] == '.') {

            } else {
              zhekou = zhekou + money[j]
            }
          }
          couponOptions.push(`满${post_pay_typeCouponList[i].invest_money}打${zhekou}折`)
        }else{
          if (post_pay_typeCouponList[i].money == 0 || post_pay_typeCouponList[i].money == '0.00') {
            // couponOptions.push(`不使用优惠券`)
            if (post_pay_typeCouponList.length == 1){
              couponOptions.push('您还没有优惠券')
            }else{
              couponOptions.push(`不使用优惠券`)
            }
          }
        }
      }
    }
    return couponOptions
  },
  time_typeRadioChange(e){
    var _this = this
    this.setData({
      time_type: e.detail.value,
      time_value_index:0,
      time_value: _this.data.time_list[e.detail.value][0]
    })
    console.log(this.data.time_type, "time_type")
  },
  /**
   * 获取优惠券列表
   */
  getCouponList() {
    var _this = this;
    App._get('coupon/lists', {
      money: this.data.order_total_price
    }, function (result) {
      // console.log(result,"conponResult")
      couponList = result.data.data;// 接口中拿到的初始数据
      if (couponList[0]){
        if (couponList[0].length == 0) {
          _this.setData({
            isHiddenCounpon: true
          })
        }
      }
      console.log(couponList, "couponList")
      console.log(_this.data.post_pay_type,"post_pay_type")
      _this.masterMethod4getSubMoney()
    });
  },
  selectCoupons(list,post_pay_type){
    // console.log(list,'list')
    console.log(post_pay_type, 'post_pay_type')
    if (!list){
      return;
    }
    var _this = this;
    var couponOptions = [];
    for (var i = 0; i < list.length;i++) {
      // console.log(list[i].c_type.pay_status?'yes':'no')
      // console.log(list[i].c_type.pay_status,"list[i].c_type.pay_status")
      if (list[i].c_type.pay_status.value == post_pay_type || list[i].c_type.pay_status.value == 0){
        couponOptions.push(list[i])
      }
    }
    return couponOptions;
  },
  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    wx.showLoading()
    let _this = this,
      options = _this.data.options;

    // 获取订单信息回调方法
    let callback = function(result) {
      wx.hideLoading()
      if (result.code !== 1) {
        console.log(result.msg,"result.msg")
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      }
      _this.setData(result.data);
      my_intergal = parseInt(result.data.my_intergal);
      my_money = parseFloat(result.data.my_money);
      order_total_price = parseFloat(result.data.order_total_price)
      _this.setData({
        my_intergal: parseInt(result.data.my_intergal),
        my_money: parseFloat(result.data.my_money)
      });
      _this.calculate_my_money();
      // _this.setData({
      //   order_pay_price: _this.data.order_pay_price - _this.data.my_money
      // })
      if(result.data.address){
        _this.setData({
          exist_address:true
        })
      }
      // _this.getCouponList();// 获取优惠券列表
    };

    // 立即购买
    if (wx.getStorageSync('order_type') === 'buyNow') {
      App._get('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        pay_type: options.pay_type,
        dis_type: options.dis_type,
        coupon_id:_this.data.couponId,
        time_type: _this.data.time_type,
        time_value: _this.data.time_value,
        time_number: _this.data.time_number,
        key: wx.getStorageSync('key')
      }, function(result) {
        callback(result);
      });
    }

    // 购物车结算
    else if (wx.getStorageSync('order_type') === 'cart') {
      App._get('order/cart', {key:wx.getStorageSync('key')}, function(result) {
        // console.log("===============cart======================2")
        callback(result);
      });
    }
  },
  // 根据当前page_type获取所减免的价格或者折扣
  getSubMoney(post_pay_typeCouponList){
    var _this = this;
    var subMoney = [];
    var type = '';
    var money = '';
    for (var i = 0; i < post_pay_typeCouponList.length;i++) {
      // console.log(`id:${post_pay_typeCouponList[i].id},coupon_id:${_this.data.couponId}`)
      if (post_pay_typeCouponList[i].id == _this.data.couponId) {
        type = post_pay_typeCouponList[i].c_type.type
        if (type == 1) {// c_type 里面 type 1是优惠券 2是折扣券
          money = post_pay_typeCouponList[i].money
        } else if (type == 2) {
          var zhekou = '';
          var moneyArr = post_pay_typeCouponList[i].money.split('');
          for (var j = 0; j < moneyArr.length; j++) {
            if (moneyArr[j] == '0' || moneyArr[j] == '.') {

            } else {
              zhekou = zhekou + moneyArr[j]
            }
          }
          money = zhekou
        }else{
          type = 0
          money = 0
        }
        // console.log(type,"type")
        // console.log(money,"money")
        subMoney.push(type)
        subMoney.push(money)
        return subMoney;
      }
    }
  },
  masterMethod4getSubMoney() {
    var _this = this;
    
    post_pay_typeCouponList = _this.selectCoupons(couponList[_this.data.post_pay_type==10?0:1], _this.data.post_pay_type) //当前所选post_pay_type所对应的数据
    if (!post_pay_typeCouponList){
      return;
    }
    // console.log(_this.data.post_pay_type, "_this.data.post_pay_type")
    // console.log(post_pay_typeCouponList,"post_pay_typeCouponList")
    var showCouponOptions = _this.getCouponOptions(post_pay_typeCouponList) //把数据改造成所要显示的数据
    _this.setData({
      couponOptions: showCouponOptions,
      couponId: post_pay_typeCouponList.length>0?post_pay_typeCouponList[0].id:0
    })
    // console.log(this.data.couponId, "couponId")
    var subMoney = _this.getSubMoney(post_pay_typeCouponList)
    // console.log(subMoney, 'subMoney')
    // =======================================
    _this.getReal_pay_price(subMoney)
  },
  getReal_pay_price(subMoney) {
    var _this = this
    var real_pay_price = ''
    var order_total_price = _this.data.order_total_price
    // console.log(subMoney,"subMoneysubMoneysubMoneysubMoney")
    if (subMoney){
      if (subMoney[0] == 1) {
        // console.log(_this.data.order_total_price, "order_total_price")
        real_pay_price = order_total_price - subMoney[1]
      } else if (subMoney[0] == 2) {
        // console.log(_this.data.order_total_price, "order_total_price")
        real_pay_price = (order_total_price * subMoney[1] * (subMoney[1].length == 1 ? 0.1 : subMoney[1].length == 2 ? 0.01 : 1)).toFixed(2)
      }else{
        // console.log(_this.data.order_total_price, "order_total_price")
        real_pay_price = order_total_price
      }
      // console.log(real_pay_price, "real_pay_price")
      _this.setData({
        order_pay_price: real_pay_price
      })
    }
  },
  showCouponAction() {
    this.setData({
      visible1: true
    });
  },
  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  handleClickItem1({ detail }) {
    const index = detail.index + 1;

    $Message({
      content: '点击了选项' + index
    });
  },
  bindCouponPickerChange: function (e) {
    var _this = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(post_pay_typeCouponList[e.detail.value],"post_pay_typeCouponList[e.detail.value]")
    if (post_pay_typeCouponList[e.detail.value].not_reason) {
      App.showError(`${post_pay_typeCouponList[e.detail.value].not_reason}`)
      return;
    }
    this.setData({
      couponIndex: e.detail.value,
      couponId: post_pay_typeCouponList[e.detail.value].id
    })
    // console.log(this.data.couponId, "couponId")
    var subMoney = _this.getSubMoney(post_pay_typeCouponList)
    // console.log(subMoney, 'subMoney')
    // =======================================
    _this.getReal_pay_price(subMoney)
  },
  
  radioChange: function (e) {
    var _this = this
    this.setData({
      post_pay_type: e.detail.value
    })
    if (e.detail.value == 20){
      _this.setData({
        isHiddenCounpon:true
      })
    }
    console.log(this.data.post_pay_type,"post_pay_type")
    this.masterMethod4getSubMoney()
    this.setData({
      couponIndex: 0,
      order_pay_price:_this.data.order_total_price
    })
  },
  // 配送时间的选择
  bindTimePickerChange(e) {
    let _this = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time_value_index: e.detail.value,
      time_value: _this.data.time_list[_this.data.time_type][e.detail.value]
    })
    // console.log(this.data.time_value, "time_value")
  },
  /**
   * 选择收货地址
   */
  selectAddress: function() {
    wx.setStorageSync('operate', 'add');
    wx.setStorageSync('_from', 'flow');// 记得在我的页面要清空
    console.log(wx.getStorageSync('_from'), "wx.getStorageSync('_from')")
    wx.navigateTo({
      url: '../address/' + (this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
      options = _this.data.options,
      post_pay_type = _this.data.post_pay_type,
      post_dis_type = _this.data.post_dis_type;
    if (_this.data.disabled) {
      console.log(_this.data.disabled, "_this.data.disabled")
      return false;
    }
    if (_this.data.hasError) {
      console.log(_this.data.hasError,"_this.data.hasError")
      console.log(_this.data.error,"_this.data.error")
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function (result) {
      console.log(result, "result")
      let pay_type_arr = _this.data.pay_type_arr;
      let time_list =_this.data.time_list;
      console.log(time_list,"time_list")
      // _this.init_get_time_list(time_list)
      console.log('---------------------')
      // _this.init_post_pay_type(pay_type_arr)
      console.log('---------------------')
      if (result.code === -10) {
        App.showError(result.msg, function() {
          // 跳转到未付款订单
          wx.navigateTo({
            url: '../order/index?type=payment',
          });
        });
        return false;
      }
      console.log(result_price,"result_price")
      if (result_price == '0.00' || result_price==0){
        // 跳转到订单详情
        wx.setStorageSync('type', 'delivery')
        wx.setStorageSync('to_view', 'person')
        wx.navigateTo({
          url: '../order/detail?order_id=' + result.data.order_id
        });
      }else{
        //条件为线上支付 
        if (post_pay_type == 10) {
          // 发起微信支付
          wx.requestPayment({
            timeStamp: result.data.payment.timeStamp,
            nonceStr: result.data.payment.nonceStr,
            package: 'prepay_id=' + result.data.payment.prepay_id,
            signType: 'MD5',
            paySign: result.data.payment.paySign,
            success: function (res) {
              // 跳转到订单详情
              wx.setStorageSync('type', 'delivery')
              wx.setStorageSync('to_view', 'person')
              wx.navigateTo({
                url: '../order/detail?order_id=' + result.data.order_id,
              });
            },
            fail: function (res) {
              wx.navigateTo({
                url: '../order/index?type=payment',
              })
            },
          });
        } else {
          console.log(post_pay_type, "post_pay_type else redirectTo")
          wx.setStorageSync('to_view', 'person')
          wx.navigateTo({
            url: '../order/detail?order_id=' + result.data.order_id,
          });
        }
      }
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    // wx.showLoading({
    //   title: '正在处理...'
    // });
    if (_this.data.time_value=="今天已过配送时间"){
      App.showError('今天已过配送时间，请选择明天送',function(){
        _this.setData({
          disabled:false
        })
      });
      return;
    }
    if(_this.data.integral_checked){
      _this.setData({
        integral_status: 1
      })
    }else{
      _this.setData({
        integral_status: 0
      })
    }
    // 创建订单-立即购买
    if (wx.getStorageSync('order_type') === 'buyNow') {
      console.log("=============buyNow==============")
      App._post_form('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        pay_type: post_pay_type,
        dis_type: post_dis_type,
        coupon_id: _this.data.couponId,
        time_type: _this.data.time_type,
        time_value: _this.data.time_value,
        time_number: _this.data.time_number,
        key: wx.getStorageSync('key'),
        integral_status: _this.data.integral_status
      }, function(result) {
        // success
        console.log('===================success============================');
        callback(result);
      }, function(result) {
        // fail
        console.log('fail');
        if (result.data.code == 0) {
          if (result.data.msg.indexOf('商户') > -1) {
            wx.navigateTo({
              url: "../join/join",
            })
          } else {
            _this.onShow();
          }

        }
      }, function() {
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

    // 创建订单-购物车结算
    else if (wx.getStorageSync('order_type') === 'cart') {
      console.log("===============cart======================1")
      let prams = {
        pay_type: post_pay_type,
        dis_type: post_dis_type,
        coupon_id: _this.data.couponId,
        time_type: _this.data.time_type,
        time_value: _this.data.time_value,
        time_number: _this.data.time_number,
        key: wx.getStorageSync('key'),
        integral_status: _this.data.integral_status
      }
      console.log(prams,"prams")
      App._post_form('order/cart', prams, function(result) {
        // success
        console.log('success');
        
        callback(result);
      }, function(result) {
        // fail
        console.log(result,'==fail==');
        if (result.data.msg.indexOf('收货地址')>-1){
          _this.toGetAddress()
        }
        if (result.data.code==0) {
          if (result.data.msg.indexOf('商户')>-1){
            wx.navigateTo({
              url: "../join/join",
            })
          }else{
            _this.onShow();
          }
          
        }
      }, function() {
        console.log('==========complete=============');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }
  },
  toJoin() {
    wx.navigateTo({
      url: "../join/join",
    })
  },
  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function() {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function(e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index';
        break;
      case 'fenlei':
        url = '../category/index';
        break;
      case 'cart':
        url = '../flow/index';
        break;
      case 'profile':
        url = '../user/index';
        break;
    }
    wx.switchTab({
      url
    });
  }
});

