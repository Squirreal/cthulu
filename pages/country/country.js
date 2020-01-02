// pages/country/country.js
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
        swiperConfig: {
            vertical: false,
            autoplay: true,
            interval: 3000,
            duration: 1000
        },
        showLoadMore: true,
        hasMore: true,
        pageIndex: 1,
        countryId: '',
        countryInfo: {},
        targetVideo: '',
        banner: [],
        hotCity: [],
        buildings: [],
    },
    handleTap: function(event) {
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
    loadCountry: function () {
        let that = this;
        wx.showLoading();
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'country',
                id: that.data.countryId
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    that.data.navigationBarTitle = data.data.info.name;
                    that.data.countryInfo = data.data.info;
                    that.data.banner = data.data.banner;
                    that.data.hotCity = data.data.hot_city;

                    //console.log(that.data);
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
                wx.hideLoading();
            }
        })
    },

    loadBuildings: function () {
        let that = this;
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'country.buildings',
                id: that.data.countryId,
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
                            that.data.buildings.push(item);
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
    onLoad: function(options) {
        this.data.lang = app.globalData.lang;
        this.setData(this.data);

        this.data.countryId = options.id;
        this.loadCountry();
        this.loadBuildings();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let desc = this.data.lang.PROGRAM_INTRO;
        return {
            title: this.data.navigationBarTitle,
            desc: desc,
            path: '/pages/index/index?from=share&type=country&id=' + this.data.countryId
        }
    }
})