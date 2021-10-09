// pages/guoqing/guoqing.js
const ctx = wx.createCanvasContext('shareImg');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
      prurl: '',
  
      defaultImg: 0,
  
      userInfo: {},
      hasUserInfo: false,
  
      list: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
      ]
    },
  
    selectImg: function(e){
      var current = e.target.dataset.id;
      console.log(current);
      this.setData({
        defaultImg: current,
        prurl: ''
      });
      console.log("this:",this.data.userInfo);
      if(this.data.userInfo.avatarUrl){
        this.drawImg(this.data.userInfo.avatarUrl);
      } else {
        this.initCanvas(this.data.defaultImg);
      }
    },
  
    // 初始化
    initCanvas(index){
      let that = this;
      // console.log("Promise.all", res)
      //主要就是计算好各个图文的位置
      let num = 150;
      // ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage(`../../images/hat${index}.png`, 0, 0, num, num)
      ctx.stroke()
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: 960,
          destHeight: 960,
          canvasId: 'shareImg',
          success: function(res) {
            that.setData({
              prurl: res.tempFilePath
            })
            // wx.hideLoading()
          },
          fail: function(res) {
            wx.hideLoading()
          }
        })
      })
    },
  
  
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    getUserProfile(e) {
      let that = this;
      if(!that.data.userInfo.avatarUrl){
        console.log('-- 1 --');
        wx.getUserProfile({
          desc: '仅用于生成头像使用', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            //获取高清用户头像
            var url = res.userInfo.avatarUrl;
            while (!isNaN(parseInt(url.substring(url.length - 1, url.length)))) {
              url = url.substring(0, url.length - 1)
            }
            url = url.substring(0, url.length - 1) + "/0";
            res.userInfo.avatarUrl = url;
            console.log(JSON.stringify(res.userInfo));
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })

            that.drawImg(res.userInfo.avatarUrl);
            app.globalData.userInfo = res.userInfo;
          }
        });
      }else if(that.data.userInfo.avatarUrl){
        console.log('-- 2 --');
        that.drawImg(that.data.userInfo.avatarUrl);
      }
  
    },
    
  
    drawImg(avatarUrl){
      let that = this;
      console.log("-- drawImg --");
      // `${that.data.userInfo.avatarUrl}`
      let promise1 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
          src: avatarUrl,
          success: function(res) {
            console.log("promise1", res)
            resolve(res);
          }
        })
      });
      var index = that.data.defaultImg;
      // ../../images/head${index}.png
      // hat0.png  avg.jpg
      let promise2 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
          src: `../../images/hat${index}.png`,
          success: function(res) {
            console.log(res)
            resolve(res);
          }
        })
      });
      Promise.all([
        promise1, promise2
      ]).then(res => {
        console.log("Promise.all", res)
        //主要就是计算好各个图文的位置
        let num = 150;
        ctx.drawImage(res[0].path, 0, 0, num, num)
        ctx.drawImage('../../' + res[1].path, 0, 0, num, num)
        ctx.stroke()
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: num,
            height: num,
            destWidth: 960,
            destHeight: 960,
            canvasId: 'shareImg',
            success: function(res) {
              that.setData({
                prurl: res.tempFilePath
              })
              // wx.hideLoading()
            },
            fail: function(res) {
              wx.hideLoading()
            }
          })
        })
      })
  
    },
  
    handleShare: function(){
      console.log('handleShare method');
      this.onShareAppMessage();
    },
  
    save: function() {
      var that = this;
      if(!that.data.prurl){
        wx.showToast({
          title: '请先生成专属头像',
        })
        return;
      }
      wx.saveImageToPhotosAlbum({
        filePath: that.data.prurl,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，请前往微信去设置头像!',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          })
        }
      })
    },
  
  
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.initCanvas(this.data.defaultImg);
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: '领取你的国庆专属头像',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    },
  
    /**
     * 用户点击右上角分享朋友圈
     */
    onShareTimeline(){
      
    }
  })