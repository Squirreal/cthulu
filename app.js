//app.js
const CryptoJS = require('./utils/aes/public.js');

App({
    onLaunch: function() {
        let that = this;

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        //获取状态栏高度
        wx.getSystemInfo({
            success: res => {
                //console.log(res);
                that.windowHeight = res.windowHeight;
                that.statusBarHeight = res.statusBarHeight;
                that.navigationBarHeight = that.statusBarHeight + 44;

                that.apiConfig.header['x-lang'] = res.language;
            }
        })
    },

    //跳转
    navigateTo:(type, id) => {
        let app = getApp();
        if (!app.hasLogined) {
            let navData = {};
            navData.type = type;
            navData.id = id;
            wx.setStorage({
                key: app.storageKey.navigateTo,
                data: JSON.stringify(navData)
            });

            wx.navigateTo({
                url: '/pages/login/login'
            });

            return;
        }

        if (type == 'country') {
            wx.navigateTo({
                url: '/pages/country/country?id=' + id
            });
        } else if (type == 'city') {
            wx.navigateTo({
                url: '/pages/city/city?id=' + id
            });
        } else if (type == 'cityBuildings') {
            wx.navigateTo({
                url: '/pages/city/buildings?id=' + id
            });
        } else if (type == 'building') {
            wx.navigateTo({
                url: '/pages/building/building?id=' + id
            });
        } else if (type == 'presales') {
            wx.navigateTo({
                url: '/pages/presales/presales?id=' + id
            });
        } else if (type == 'presale') {
            wx.navigateTo({
                url: '/pages/presale/presale?id=' + id
            });
        }
    },

    hasLogined: false,
    globalData: {
        userInfo: null,
        lang: {}
    },
    windowHeight: 0,
    statusBarHeight: 0,
    navigationBarHeight: 0,

    //Stroage Key
    storageKey: {
        navigateTo: '_wx_navigate_to'
    },

    //API设置
    apiConfig: {
        host: 'https://www.squirreal.cn/api',
        method: 'POST',
        dataType: 'json',
        header: {
            'Content-Type': 'application/json',
            'x-lang': '',
        },
        
    },
    getApiHeader() {
        let header = this.apiConfig.header;
        let timestamp = new Date().getTime();
        header['x-authorization'] = wx.getStorageSync('Authorization');
        header['x-req-time'] = timestamp;
        header['x-req-key'] = CryptoJS.encrypt(timestamp - 2048);
        return header;
    }
})