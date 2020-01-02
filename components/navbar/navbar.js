const app = getApp()

Component({

    properties: {
        text: {
            type: String,
            value: 'Wechat'
        },
        back: {
            type: Boolean,
            value: false
        },
        home: {
            type: Boolean,
            value: false
        }
    },

    data: {
        statusBarHeight: app.statusBarHeight,
        navigationBarHeight: (app.statusBarHeight + 44),
    },

    methods: {
        backHome: function() {
            wx.reLaunch({
                url: '/pages/home/home',
            })
        },
        back: function() {
            wx.navigateBack({
                delta: 1
            })
        }
    }
})