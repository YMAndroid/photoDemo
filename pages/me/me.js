// pages/me/me.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:"yang418000",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
    },

    copyInfo(){ 
    wx.setClipboardData({
        data: this.data.info//需要复制的文本
      })
    },

    jumpRecords(){
        wx.navigateTo({
          url: '/pages/me/record/record',
        })
    }
})