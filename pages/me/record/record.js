// pages/me/record/record.js
let interstitialAd = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        records:[],
        windowWidth : wx.getSystemInfoSync().windowWidth,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.processAd();
        
    },

    processAd(){
        if(wx.createInterstitialAd){
            interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-5af1c3dd76e063af' })
            interstitialAd.onLoad(() => {
              console.log('onLoad event emit');
              // 在适合的场景显示插屏广告
                if (interstitialAd) {
                    interstitialAd.show().catch((err) => {
                    console.error(err)
                })
  }
            })
            interstitialAd.onError((err) => {
              console.log('onError event emit', err)
            })
            interstitialAd.onClose((res) => {
              console.log('onClose event emit', res);
              this.setData({
                records: wx.getStorageSync('records') || []
            })
            })
          }
    },

    viewPicture(e){
        console.log(e);
        wx.previewImage({
          urls: [this.data.records[e.currentTarget.dataset.index]],
        })
    },

    jumpToHome(){
        wx.switchTab({
          url: '/pages/companyanniversary/companyanniversary',
        })
    }
})