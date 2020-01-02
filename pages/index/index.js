//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        navigationBarTitle: '',
        navigationBarHeight: getApp().navigationBarHeight,
    },
   
    loadLang: function() {
        let _this = this;
        //加载全局语言
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'common.lang'
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    app.globalData.lang = data.data;
                    _this.data.navigationBarTitle = data.data.SQUIRREAL;
                    _this.setData(_this.data);
                    wx.reLaunch({
                        url: '/pages/home/home',
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }),
            fail: (err => {
                wx.showToast({
                    title: err.errMsg,
                    icon: 'none',
                    duration: 2000
                });
            }),
            complete: () => {

            }
        })
    },
    loadUserInfo: function () {
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'user.getInfo'
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    app.hasLogined = true;
                    app.globalData.userInfo = data.data;
                } else {
                    app.hasLogined = false;
                    app.globalData.userInfo = null;
                }
            }),
            fail: (err => {
                
            }),
            complete: () => {

            }
        })
    },
    onLoad: function (options) {
        wx.hideShareMenu();

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
    },
    onShow: function () {
        this.loadLang();
        this.loadUserInfo();
    }
})