//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        navigationBarTitle: '',
        navigationBarHeight: getApp().navigationBarHeight,
    },
   
    onLoad: function (options) {
        wx.hideShareMenu();
        
        if (app.langReady) {
            this.data.navigationBarTitle = app.globalData.lang.SQUIRREAL;
            this.data.lang = app.globalData.lang;
            this.setData(this.data);
            //分享点过来的链接
            if (options.from && options.from == 'share') {
                let navData = {};
                navData.type = options.type;
                navData.id = options.id;
                wx.setStorage({
                    key: app.storageKey.navigateTo,
                    data: JSON.stringify(navData)
                });
            }
            wx.redirectTo({
              url: '/pages/home/home',
            });
        } else {
            app.checkLangReadyCallback = res => {
                this.data.navigationBarTitle = app.globalData.lang.SQUIRREAL;
                this.data.lang = app.globalData.lang;
                this.setData(this.data);
                //分享点过来的链接
                if (options.from && options.from == 'share') {
                    let navData = {};
                    navData.type = options.type;
                    navData.id = options.id;
                    wx.setStorage({
                        key: app.storageKey.navigateTo,
                        data: JSON.stringify(navData)
                    });
                }
                wx.redirectTo({
                  url: '/pages/home/home',
                });
            }
        }
       
    },
    onShow: function () {
        
    }
})