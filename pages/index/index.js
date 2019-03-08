//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
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
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getList();
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
