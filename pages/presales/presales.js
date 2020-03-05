// pages/presales/presales.js
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
        showLoadMore: true,
        hasMore: true,
        pageIndex: 1,
        targetVideo: '',
        cityId: '',
        presales: []
    },
    handleTap: function (event) {
        let type = event.currentTarget.dataset.type;
        let id = event.currentTarget.dataset.id;
        app.navigateTo(type, id);
    },
    handleScrollToLower: function (event) {
        if (this.data.hasMore) {
            this.data.showLoadMore = true;
            this.setData(this.data);
            this.loadBuildings();
        }
    },
    handlePlayVideo: function (event) {
        let video = event.currentTarget.dataset.video;
        this.data.targetVideo = video;
        this.setData(this.data);
    },
    handleCloseVideo: function (event) {
        this.data.targetVideo = "";
        this.setData(this.data);
    },
    loadPresales: function () {
        let that = this;
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'city.presales',
                id: that.data.cityId,
                page: that.data.pageIndex
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    if (data.data.length > 0) {
                        that.data.hasMore = true;
                        that.data.pageIndex++;
                        data.data.forEach(item => {
                            that.data.presales.push(item);
                        });
                    } else {
                        that.data.hasMore = false;
                    }

                    that.setData(that.data);


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
                that.data.showLoadMore = false;
                that.setData(that.data);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.langReady) {
            this.data.lang = app.globalData.lang;
            this.data.navigationBarTitle = this.data.lang.PRESALES_LIST;
            this.setData(this.data);

            this.data.cityId = options.id;
            this.loadPresales();
        } else {
            app.checkLangReadyCallback = res => {
                this.data.lang = app.globalData.lang;
                this.data.navigationBarTitle = this.data.lang.PRESALES_LIST;
                this.setData(this.data);

                this.data.cityId = options.id;
                this.loadPresales();
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
        let desc = this.data.lang.PROGRAM_INTRO;
        return {
            title: this.data.navigationBarTitle,
            desc: desc,
            path: '/pages/index/index?from=share&type=presales&id=' + this.data.cityId
        }
    }
})