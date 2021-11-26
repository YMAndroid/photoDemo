// pages/companyanniversary/companyanniversary.js
// pages/guoqing/guoqing.js
const ctx = wx.createCanvasContext('shareImg');
const app = getApp();
const windowWidth = wx.getSystemInfoSync().windowWidth;
const windowHeight = wx.getSystemInfoSync().windowHeight;
const pc = wx.createCanvasContext('myCanvas');
const distense = 400 / 750 * wx.getSystemInfoSync().windowWidth;
const size = 260;
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
        0, 1, 2, 3, 4
      ],
      scale:1,
      rotate:0,
      hat_center_x:0,
      hat_center_y:0,
      currentHatId:1,
      hatCenterX:wx.getSystemInfoSync().windowWidth/2,
      hatCenterY:130+distense,
      cancelCenterX:wx.getSystemInfoSync().windowWidth/2-50-2,
      cancelCenterY:80+distense,
      handleCenterX:wx.getSystemInfoSync().windowWidth/2+50-2,
      handleCenterY:180+distense,
      hatSize:100,
      isSave:false,
      windowHeight:wx.getSystemInfoSync().windowHeight,
      isAuthSavePhoto:false
    },
  
    selectImg: function(e){
      if(!this.data.userInfo.avatarUrl) {
          wx.showToast({
              icon:"none",
            title: '请先获取头像!',
          })
          return;
      }
      var current = e.target.dataset.id;
      console.log(current);
      this.setData({
        defaultImg: current,
        prurl: ''
      });
      //个性化头像
      if(current > 2){
          //this.draw();
      } else {
        //简易操作
        if(this.data.userInfo.avatarUrl){
            this.drawImg(this.data.userInfo.avatarUrl);
          } else {
            this.initCanvas(this.data.defaultImg);
          }
      }

    },
  
    // 初始化
    initCanvas(index){
      let that = this;
      //主要就是计算好各个图文的位置
      // ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage(`../../images/hat${index}.png`, 0, 0, size, size)
      ctx.stroke()
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: size,
          height: size,
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
      console.log(e);
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
       
        ctx.drawImage(res[0].path, 0, 0, size, size)
        ctx.drawImage('../../' + res[1].path, 0, 0, size, size)
        ctx.stroke()
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: size,
            height: size,
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
      if(!this.data.hasUserInfo){
        wx.showToast({
          icon:'none',
          title: '请先获取头像！',
        })
        return;
      }
      //this.saveImage();
      this.saveAuthCheck();
    },
  

    saveAuthCheck(){
      this.getSetting().then((res) => {
        // 判断用户是否授权了保存到本地的权限
        if (!res.authSetting['scope.writePhotosAlbum']) {
          this.authorize().then(() => {
            this.saveImage();
            this.setData({
              isAuthSavePhoto: false
            })
          }).catch(() => {
            wx.showToast({
              title: '您拒绝了保存图片到相册的授权！',
              icon: 'none',
              duration: 1500
            })
            this.setData({
              isAuthSavePhoto: true
            })
          })
        } else {
          this.saveImage()
        }
      })
    },

     // 弹出模态框提示用户是否要去设置页授权
  showModal(){
    wx.showModal({
      title: '检测到您没有打开保存图片到相册的权限，是否前往设置打开？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.onOpenSetting() // 打开设置页面          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //打开设置，引导用户授权
  onOpenSetting() {
    wx.openSetting({
      success:(res) => {
        console.log(res.authSetting)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showToast({
            title: '您未授权',
            icon: 'none',
            duration: 1500
          })
          this.setData({// 拒绝授权
            isAuthSavePhoto: true
          })

        } else {// 接受授权
          this.setData({
            isAuthSavePhoto: false
          })
          this.saveImage() // 接受授权后保存图片

        }

      }
    })
   
  },


  // 发起首次授权请求
  authorize() {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          resolve()
        },
        fail: res => { //这里是用户拒绝授权后的回调
          console.log('拒绝授权')
          reject()
        }
      })
    })
  },

    // 获取用户已经授予了哪些权限
  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          resolve(res)
        }
      })
    })
  },

    saveImage(){
      var that = this;
      if(this.data.defaultImg > 2){
        this.setData({
          isSave: true
        })
        this.draw();
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.prurl,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册，请前往微信去设置哟!',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }, 
          fail(res){
            wx.showToast({
              title: '拒绝访问相册，无法保存头像！',
            })
          }
        })
      }
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
        title: '领取你的周年庆专属头像',
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
  
          
  onReady(){
    this.hat_center_x=this.data.hatCenterX;
    this.hat_center_y=this.data.hatCenterY;
    this.cancel_center_x=this.data.cancelCenterX;
    this.cancel_center_y=this.data.cancelCenterY;
    this.handle_center_x=this.data.handleCenterX;
    this.handle_center_y=this.data.handleCenterY;

    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
    
    this.touch_target="";
    this.start_x=0;
    this.start_y=0;
  },
  touchStart(e){
    console.log("e:",e);
    if(e.target.id=="hat"){
      this.touch_target="hat";
    }else if(e.target.id=="handle"){
      this.touch_target="handle"
    }else{
      this.touch_target=""
    };
    
    if(this.touch_target!=""){
      this.start_x=e.touches[0].clientX;
      this.start_y=e.touches[0].clientY;
    }
  },
  touchEnd(e){
      this.hat_center_x=this.data.hatCenterX;
      this.hat_center_y=this.data.hatCenterY;
      this.cancel_center_x=this.data.cancelCenterX;
      this.cancel_center_y=this.data.cancelCenterY;
      this.handle_center_x=this.data.handleCenterX;
      this.handle_center_y=this.data.handleCenterY;
    // }
    this.touch_target="";
    this.scale=this.data.scale;
    this.rotate=this.data.rotate;
  },
  touchMove(e){
    console.log("移动e:",e," ; this.startX,",this.start_x);
      var current_x=e.touches[0].clientX;
      var current_y=e.touches[0].clientY;
      
      var moved_x=current_x-this.start_x;
      var moved_y=current_y-this.start_y;
      if(this.touch_target=="hat"){
        this.setData({
          hatCenterX:this.data.hatCenterX+moved_x,
          hatCenterY:this.data.hatCenterY+moved_y,
          cancelCenterX:this.data.cancelCenterX+moved_x,
          cancelCenterY:this.data.cancelCenterY+moved_y,
          handleCenterX:this.data.handleCenterX+moved_x,
          handleCenterY:this.data.handleCenterY+moved_y
        })
      };
      if(this.touch_target=="handle"){
        this.setData({
          handleCenterX:this.data.handleCenterX+moved_x,
          handleCenterY:this.data.handleCenterY+moved_y,
          cancelCenterX:2*this.data.hatCenterX-this.data.handleCenterX,
          cancelCenterY:2*this.data.hatCenterY-this.data.handleCenterY
        });
        let diff_x_before=this.handle_center_x-this.hat_center_x;
        let diff_y_before=this.handle_center_y-this.hat_center_y;
        let diff_x_after=this.data.handleCenterX-this.hat_center_x;
        let diff_y_after=this.data.handleCenterY-this.hat_center_y;
        let distance_before=Math.sqrt(diff_x_before*diff_x_before+diff_y_before*diff_y_before);
        let distance_after=Math.sqrt(diff_x_after*diff_x_after+diff_y_after*diff_y_after);
        let angle_before=Math.atan2(diff_y_before,diff_x_before)/Math.PI*180;
        let angle_after=Math.atan2(diff_y_after,diff_x_after)/Math.PI*180;
        this.setData({
          scale:distance_after/distance_before*this.scale,
          rotate:angle_after-angle_before+this.rotate,
        })
      }
      this.start_x=current_x;
      this.start_y=current_y;
  },

    
  draw() {
    wx.showLoading({
      title: '生成头像中...',
    })
    wx.getImageInfo({
      src:this.data.userInfo.avatarUrl,
      success: res => {
          this.bgPic = res.path;
          const hat_size = (100) * this.data.scale;
          pc.clearRect(0, 0, windowWidth, size);
          pc.drawImage(this.bgPic, windowWidth/2-130, 0, size, size);
          pc.translate(this.data.hatCenterX,this.data.hatCenterY-distense);
          pc.rotate(this.data.rotate * Math.PI / 180);
          
          pc.drawImage(`../../images/hat${this.data.defaultImg}.png`, -hat_size / 2, -hat_size / 2, hat_size, hat_size);
                    
          pc.draw(false,()=>{
            wx.canvasToTempFilePath({
              x: windowWidth/2-130,
              y: 0,
              height: size,
              width: size,
              canvasId: 'myCanvas',
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (res) => {
                    this.setData({
                      isSave: false
                    })
                    wx.hideLoading();
                    wx.showModal({
                      content: '图片已保存到相册,请前往微信去设置哟!',
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          console.log('用户点击确定');
                        }
                      }
                    })
                    console.log("success:" + res);
                  }, fail(e) {
                    wx.hideLoading();
                    console.log("err:" + e);
                  }
                })
              }
            });
          });
      }
    })


  },
  })