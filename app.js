// app.js
App({
  onLaunch() {
    let first = wx.getStorageSync('isFirst');
    if(!first){
      wx.setStorageSync("isFirst",true);
      wx.setStorageSync("count",3);
    }
  },
  globalData: {
  }
})
