// pages/me/record/record.js

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
        this.setData({
            records: wx.getStorageSync('records') || []
        })
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