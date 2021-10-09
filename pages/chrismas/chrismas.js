// pages/chrismas/chrismas.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgPic:null,
        scale:1,
        rotate:0,
        hat_center_x:0,
        hat_center_x:0,
        currentHatId:1,
        picChoosed:false,
        userInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
              bgPic: app.globalData.userInfo.avatarUrl,
            });
            this.assignPicChoosed();
          }
    },

    assignPicChoosed() {
        if (this.data.bgPic) {
          this.setData({
            picChoosed: true
          })
        } else {
          this.setData({
            picChoosed: false
          })
        }
      },


    getAvatar(e) {
        if (app.globalData.userInfo) {
            this.setData({
              bgPic: app.globalData.userInfo.avatarUrl,
            });
            this.assignPicChoosed();
          }
         else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          this.getUserProfile(e);
        }
      },

      getUserProfile(e) {
        if(!app.globalData.userInfo){
          wx.getUserProfile({
            desc: '仅用于生成头像使用', 
            success: (res) => {
              //获取高清用户头像
              var url = res.userInfo.avatarUrl;
              while (!isNaN(parseInt(url.substring(url.length - 1, url.length)))) {
                url = url.substring(0, url.length - 1)
              }
              url = url.substring(0, url.length - 1) + "/0";
              res.userInfo.avatarUrl = url;
              app.globalData.userInfo = res.userInfo;
              this.setData({
                userInfo: res.userInfo,
                bgPic:  res.userInfo.avatarUrl
              })
  
              this.assignPicChoosed();
            }
          });
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
  


})