// index.js
// 获取应用实例
const app = getApp();
const route = require('../../config/route');
// 在页面中定义插屏广告
let interstitialAd = null
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    menuitems: [
        { text: '生成头像记录', url: route.PICTURE_HISTORY_PAGE_ROUTE,  tips: '' },
        { text: '关于', url: route.ABOUT_PAGE_ROUTE,  tips: '' }
      ]

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  jumpToOther(){
      this.advertise();
  },

  advertise(){
        
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-5af1c3dd76e063af'
    })
    interstitialAd.onLoad(() => {
        

    })
    interstitialAd.onError((err) => {})
    interstitialAd.onClose(() => {
        wx.navigateTo({
           url: '/pages/me/about/about',
        })
    })
  }
  
  // 在适合的场景显示插屏广告
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err)
    })
  }
    },

})
