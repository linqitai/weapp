let App = getApp();
let is_select_arr = []
let total_price = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_select_all: false,
    goods_list: [], // 商品列表
    order_total_num: 0,
    total_price: 0,
    is_select_arr:[],
    total_price:0.00,
    submit_disable:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.init_data();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init_data();
  },
  init_data(){
    wx.showLoading()
    total_price = 0;
    this.setData({
      is_select_all: false,
      total_price: total_price
    })
    this.getCartList();
  },
  judge_is_selected_all(is_select_arr){
    for(let i in is_select_arr){
      if (is_select_arr[i]==false){
        return false;
      }
    }
    return true;
  },
  click_radio_event(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    console.log(index,"index")
    is_select_arr[index] = !is_select_arr[index];
    console.log(is_select_arr[index], "is_select_arr[index]")
    console.log(is_select_arr,"is_select_arr")
    _this.setData({
      is_select_arr: is_select_arr
    })
    console.log(_this.data.is_select_arr, "_this.data.is_select_arr")
    _this.setData({
      is_select_all:_this.judge_is_selected_all(is_select_arr)
    })
    _this.calculate_total_price(index)
    _this.judge_submit_isdisable()
  },
  calculate_total_price(index){
    let _this = this;
    // 计算价格
    console.log(index,"indexindexindex")
    let single_price = _this.data.goods_list[index].goods_sku.goods_price
    let number = _this.data.goods_list[index].total_num
    if (is_select_arr[index]) {
      total_price += single_price * number * 100
    } else {
      total_price -= single_price * number * 100
    }
    console.log(total_price, "total_price")
    _this.setData({
      total_price
    })
  },
  is_select_all_change(e){
    let _this = this;
    _this.setData({
      is_select_all: !_this.data.is_select_all
    })
    console.log(_this.data.is_select_all, "is_select_all", is_select_arr.length)
    for (let i in is_select_arr) {
      if (is_select_arr[i] != _this.data.is_select_all){
        is_select_arr[i] = _this.data.is_select_all
        _this.calculate_total_price(i) //计算价格
      }
    }
    _this.setData({
      is_select_arr
    })
    console.log(is_select_arr, "is_select_arr")
    console.log(_this.data.is_select_arr, "_this.data.is_select_arr")
    _this.judge_submit_isdisable()
  },
  judge_submit_isdisable(){
    let _this = this;
    if (_this.data.is_select_all) {
      _this.setData({
        submit_disable: false
      })
    }else{
      _this.setData({
        submit_disable: true
      })
    }
  },
  /**
   * 获取购物车列表
   */
  getCartList: function () {
    let _this = this;
    is_select_arr = []
    App._get('cart/lists', {}, function (result) {
      _this.setData(result.data);
      console.log(result.data.goods_list,"result.data.goods_list")
      for(let i in result.data.goods_list){
        console.log(i,'i')
        is_select_arr.push(false)
      }
      _this.setData({
        is_select_arr: is_select_arr
      })
      console.log(is_select_arr,"is_select_arr")
      wx.hideLoading()
    });
  },

  /**
   * 递增指定的商品数量
   */
  addCount: function (e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index]
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    App._post_form('cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1,
      goods_sku_id: goodsSkuId
    }, function () {
      goods.total_num++;
      _this.setData({
        ['goods_list[' + index + ']']: goods
      });
      if (total_price){
        total_price = _this.mathadd(total_price, goods.goods_price * 100)
        _this.setData({
          total_price: total_price
        })
      }
    });
  },

  /**
   * 递减指定的商品数量
   */
  minusCount: function (e) {
    let _this = this, 
      goods_id = e.currentTarget.dataset.goodsId,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index]
    if (goods.total_num == 1) {
      wx.showModal({
        title: "提示",
        content: "您确定要移除当前商品吗?",
        success: function (e) {
          e.confirm && App._post_form('cart/delete', {
            goods_id,
            goods_sku_id: goodsSkuId
          }, function (result) {
            // if (total_price) {
            //   total_price = _this.mathsub(total_price, goods.goods_price * 100)
            //   _this.setData({
            //     total_price: total_price
            //   })
            // }
            _this.init_data();
            
          });
        }
      });
    }
    if (goods.total_num > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('cart/sub', {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, function () {
        goods.total_num--;
        goods.total_num > 0 &&
          _this.setData({
            ['goods_list[' + index + ']']: goods
          });
        if (total_price) {
          total_price = _this.mathsub(total_price, goods.goods_price * 100)
          _this.setData({
            total_price: total_price
          })
        }
      });

    }
  },

  /**
   * 删除商品
   */
  del: function (e) {
    let _this = this,
      goods_id = e.currentTarget.dataset.goodsId,
      goodsSkuId = e.currentTarget.dataset.skuId;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前商品吗?",
      success: function (e) {
        e.confirm && App._post_form('cart/delete', {
          goods_id,
          goods_sku_id: goodsSkuId
        }, function (result) {
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 购物车结算
   */
  submit: function (t) {
    wx.setStorageSync('order_type', 'cart')
    let key = []
    for(let i in is_select_arr) {
      if (is_select_arr[i]) {
        key.push(i)
      }
    }
    console.log(key,"key")
    wx.setStorageSync('key', key)
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart'
    });
  },

  /**
   * 加法
   */
  mathadd: function (arg1, arg2) {
    return (Number(arg1) + Number(arg2));
  },

  /**
   * 减法
   */
  mathsub: function (arg1, arg2) {
    return (Number(arg1) - Number(arg2));
  },

  /**
   * 去购物
   */
  goShopping: function () {
    wx.switchTab({
      url: '../index/index',
    });
  }
})