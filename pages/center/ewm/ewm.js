let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:''
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
    this.getEwmInfo();
  },
  savePhoto() {
    this.getPhotosAuth();
  },
  //获取相册授权
  getPhotosAuth: function () {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('writePhotosAlbum授权成功')
              that.savePhotoEvent()
            }
          })
        } else {
          that.savePhotoEvent()
        }
      }
    })
  },
  savePhotoEvent() {
    let _this = this;
    wx.downloadFile({
      url: _this.data.image,
      success: function (res) {

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            console.log(result, "result")
            // App.showSuccess(`保存成功`)
          }
        })

        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log(res.savedFilePath, "savedFilePath")
            App.showSuccess(`保存成功`)
            // App.showToast(`图片保存到${res.savedFilePath}`)
          }
        })

      }
    })
  },
  /**
   * 获取当前用户信息
   */
  getEwmInfo: function () {
    let _this = this;
    App._get('expand/wechat_code', {}, function (result) {
      _this.setData(result.data);
    });
  }
});