// pages/login/login.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitle: '',
        navigationBarHeight: getApp().navigationBarHeight,
        windowHeight: app.windowHeight,
        lang: {},
        openid: '',
        session_key: ''
    },

    handleLogin: function(type, wechatData) {
        let that = this;
        wx.showLoading();
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'login.wechat',
                openid: that.data.openid,
                session_key: that.data.session_key,
                type: type,
                wechat: wechatData
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    wx.setStorage({
                        key: "Authorization",
                        data: data.data
                    });
                    app.hasLogined = true;
                    app.globalData.userInfo = wechatData;
                    wx.navigateBack({
                        delta: 1
                    });
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
                wx.hideLoading();
            }
        })
    },

    getUserInfo: function (res) {
        let that = this;
        console.log(res);
        if (res.detail && res.detail.userInfo) {
            let userInfo = res.detail.userInfo;
            that.handleLogin("wechat", userInfo);
        } else {
            wx.showToast({
                title: "获取手机号码失败",
                icon: 'none',
                duration: 2000
            });
        }
    },

    getPhoneNumber: function (res) {
        let that = this;
        console.log(res);
        if (res.detail) {
            let data = {
                encryptedData: res.detail.encryptedData,
                iv: res.detail.iv
            }
            that.handleLogin("mobile", data);
        } else {
            wx.showToast({
                title: "获取用户信息失败",
                icon: 'none',
                duration: 2000
            });
        }
    },

    getOpenId: function() {
        let that = this;
        wx.login({
            success: res => {
                wx.request({
                    url: app.apiConfig.host,
                    data: {
                        service: 'login.getWechatOpenId',
                        code: res.code
                    },
                    header: app.getApiHeader(),
                    method: app.apiConfig.method,
                    dataType: app.apiConfig.dataType,
                    success: (res => {
                        const data = res.data;
                      console.log(res.data);
                        if (data.status == 'y') {
                            that.data.openid = data.data.openid;
                            that.data.session_key = data.data.session_key;
                        } else {
                            wx.navigateBack();
                        }
                    }),
                    fail: (err => {
                        wx.navigateBack();
                    }),
                    complete: () => {
                        
                    }
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (app.langReady) {
            this.data.lang = app.globalData.lang;
            this.setData(this.data);
            wx.hideShareMenu();
        } else {
            app.checkLangReadyCallback = res => {
                this.data.lang = app.globalData.lang;
                this.setData(this.data);
                wx.hideShareMenu();
            }
        }
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getOpenId();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})