//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
    windowHeight:'',
    best:[],
    list:[],
    searchValue:'',
    imgUrls: [
      'http://xywl-1256946438.cos.ap-chengdu.myqcloud.com/storage%2Fapp%2Fimages%2F20190105%2F9fb500b1a09c4de572cd089dfacb33ba.jpg',
      'http://xywl-1256946438.cos.ap-chengdu.myqcloud.com/storage%2Fapp%2Fimages%2F20190105%2F9fb500b1a09c4de572cd089dfacb33ba.jpg',
      'http://xywl-1256946438.cos.ap-chengdu.myqcloud.com/storage%2Fapp%2Fimages%2F20190105%2F9fb500b1a09c4de572cd089dfacb33ba.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针
    //tabbar
    active: 0,
    icon: {
      normal: '//img.yzcdn.cn/icon-normal.png',
      active: '//img.yzcdn.cn/icon-active.png'
    }
  },
  onLoad: function () {
    let _this = this;
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    this.getList();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res, "res")
        _this.setData({
          windowHeight: res.windowHeight
        });
      }
    });
  },
  //触摸开始
  handletouchstart: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function (event) {
    // console.log("触摸结束")
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function (event) {
    // console.log("触摸取消")
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function (event) {
    // console.log("页面滚动", event)
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    // setTimeout(() => { this.refreshView.stopPullRefresh() }, 2000)
    // 获取首页数据
    wx.stopPullDownRefresh()
    this.getList();
  },
  scroll(e) {
    // console.log(e.detail)
  },
  _pullState: function (e) {
    console.log(e, "_pullState")
  },
  toDetailView(e){
    let url = e.currentTarget.dataset.url
    console.log(url,"url")
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 计算图片高度
   */
  imagesHeight: function (e) {
    let imgId = e.target.dataset.id,
      index = e.target.dataset.index,
      ratio = e.detail.width / e.detail.height, // 宽高比
      viewHeight = 750 / ratio, // 计算的高度值
      imgHeights = this.data.imgHeights;

    // 把每一张图片的对应的高度记录到数组里
    if (typeof imgHeights[index] === 'undefined') {
      imgHeights[index] = {};
    }
    imgHeights[index][imgId] = viewHeight;
    // 第一种方式
    let imgCurrent = this.data.imgCurrent;
    if (typeof imgCurrent[index] === 'undefined') {
      imgCurrent[index] = Object.keys(this.data.list[index])[0];
    }
    this.setData({
      imgHeights,
      imgCurrent
    });
  },
  getList(){
    let _this = this;
    App._get('index/index', {}, function (result) {
      console.log(result,"result")
      _this.setData(result.data)
      _this.refreshView.stopPullRefresh();
    });
  },
  onSearch(e){
    console.log(e.detail,"detail")
  },
  onCancel(){

  },
  onChange(event) {
    console.log(event.detail);
  },
  toView(){
    
  }
})
