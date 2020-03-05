// pages/building/building.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitle: '',
        navigationBarHeight: app.navigationBarHeight,
        windowHeight: app.windowHeight,
        lang: {},
        swiperConfig: {
            vertical: false,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            indicatorColor: '#D8D8D8',
            indicatorActiveColor: '#A1887F',
        },
        showTabbar: false,
        showSpace: false,
        currentTab: '',
        scrollToViewId:'',
        buildingId: '',
        targetVideo: '',
        data: {},
        yearIndex: 0,
        calc: {
            show: false,
            hasResult: false,
            paymentRatio: '',
            lendingRate: '',
            amount: "",
            monthlyPayment: 0,
            yearlyPayment: 0,
        },
        viewProjectTop: 0,
        viewProcessTop: 0,
        viewLoansTop: 0
    },
    handleTap: function (event) {
        let type = event.currentTarget.dataset.type;
        let id = event.currentTarget.dataset.id;
        app.navigateTo(type, id);
    },
    handlePreview: function (event) {
        let current = event.currentTarget.dataset.file;
        let images = [];
        this.data.data.banner.forEach((item) => {
            if (item.type == 1) {
                images.push(item.file);
            }
        });
        //console.log(images);
        wx.previewImage({
            current: current,  
            urls: images  
        });
    },
    handleDownload: function(event) {
        let file = event.currentTarget.dataset.file;
        console.log(file);
        wx.showLoading();
        wx.downloadFile({
            url: file,
            success: function (res) {
                let path = res.tempFilePath;
                wx.openDocument({
                    filePath: path,
                    success: function (res) {
                        console.log('打开成功');
                    }
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: res.errMsg,
                    icon: 'none',
                    duration: 2000
                });
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    },
    handleFeatureTap: function(event) {
        let that = this;
        let itemIndex = event.currentTarget.dataset.itemindex;
        let cellIndex = event.currentTarget.dataset.cellindex;
        this.data.data.tags[itemIndex].forEach((item, index) => {
            if (index == cellIndex) {
                item.active = "active";
            } else {
                item.active = "";
            }
        });
        that.setData(this.data);
    },
    handleTalkTap: function(event) {

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
    scrollToView: function (event) {
        let id = event.currentTarget.dataset.id;
        let that = this;
        that.data.scrollToViewId = id;
        that.data.currentTab = id;
        that.setData(that.data);
    },
    handleScroll: function(event) {
        let that = this;
        let showTabbar = false;
        let currentTab = '';

        if (event.detail.scrollTop > that.data.viewProjectTop) {
            currentTab = 'viewProject';
            that.data.scrollTop = that.data.viewProjectTop;
        }
        if (event.detail.scrollTop > that.data.viewProcessTop) {
            currentTab = 'viewProcess';
            that.data.scrollTop = that.data.viewProcessTop;
        }
        if (event.detail.scrollTop > that.data.viewLoansTop) {
            currentTab = 'viewLoans';
            that.data.scrollTop = that.data.viewLoansTop;
        }

        if (currentTab != '') {
            showTabbar = true;
        } else {
            showTabbar = false;
        }

        if (currentTab != that.data.currentTab) {
            that.data.currentTab = currentTab;
            that.data.scrollToViewId = "";
            that.setData(that.data);
        }

        if (showTabbar != that.data.showTabbar) {
            that.data.showTabbar = showTabbar;
            that.data.scrollToViewId = "";
            that.setData(that.data);
        }
    },
    handleShowCalc: function() {
        this.data.calc.show = true;
        this.setData(this.data);
    },
    handleCloseCalc: function () {
        this.handleCalcReset();
        this.data.calc.show = false;
        this.setData(this.data);
    },
    handleAmountInput: function(event) {
        this.data.calc.amount = event.detail.value;
    },
    handleYearPickerChange: function(event) {
        this.data.yearIndex = event.detail.value;
        this.setData(this.data);
    },
    handlePaymentRatioInput: function (event) {
        this.data.calc.paymentRatio = event.detail.value;
    },
    handleLendingRateInput: function (event) {
        this.data.calc.lendingRate = event.detail.value;
    },
    handleCalcConfirm: function(event) {
        let that = this;
        let amount = parseInt(that.data.calc.amount, 10);
        let paymentRatio = parseInt(that.data.calc.paymentRatio, 10);
        let lendingRate = parseFloat(that.data.calc.lendingRate);

        //amount = 1000000;
        if (isNaN(amount) || amount <= 0) {
            wx.showToast({
                title: that.data.lang.PLEASE_ENTER_PURCHASE_AMOUNT,
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (isNaN(paymentRatio) || paymentRatio <= 0) {
            wx.showToast({
                title: that.data.lang.PLEASE_ENTER_PAYMENT_RATIO,
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (isNaN(lendingRate) || lendingRate <= 0) {
            wx.showToast({
                title: that.data.lang.PLEASE_ENTER_INTEREST_RATE,
                icon: 'none',
                duration: 2000
            });
            return;
        }

        //贷款金额
        let loadAmount = amount - amount * paymentRatio * 0.01;

        //月利率
        let monthlyRate = lendingRate * 0.01 / 12;

        //月
        let month = that.data.data.loan_year[that.data.yearIndex].year * 12;

        //月还款
        //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        var monthlyPayment = (loadAmount * monthlyRate * Math.pow((1 + monthlyRate), month)) / (Math.pow((1 + monthlyRate), month) - 1);

        that.data.calc.hasResult = true;
        that.data.calc.loanAmount = that.amountFormat(loadAmount);
        that.data.calc.monthlyPayment = that.amountFormat(Math.round(monthlyPayment));
        that.data.calc.yearlyPayment = that.amountFormat(Math.round(monthlyPayment * 12));

        this.setData(that.data);
    },
    handleCalcReset: function (event) {
        let that = this;
        that.data.calc.amount = "";
        that.data.calc.paymentRatio = that.data.data.info.payment_ratio;
        that.data.calc.lendingRate = that.data.data.info.lending_rate;
        that.data.calc.hasResult = false;
        that.data.yearIndex = that.data.data.loan_year.length - 1;
        this.setData(that.data);
    },
    amountFormat: function(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        var t = "";
        for(var i = 0; i<l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;  
    },

    loadBuilding: function() {
        let that = this;
        wx.showLoading();
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'building',
                id: that.data.buildingId
            },
            header: app.getApiHeader(),
            method: app.apiConfig.method,
            dataType: app.apiConfig.dataType,
            success: (res => {
                const data = res.data;
                if (data.status == 'y') {
                    that.data.navigationBarTitle = data.data.info.name;
                    that.data.data = data.data;
                    that.data.yearIndex = data.data.loan_year.length - 1;
                    that.data.calc.paymentRatio = data.data.info.payment_ratio;
                    that.data.calc.lendingRate = data.data.info.lending_rate;
                    that.setData(that.data);

                    let query = wx.createSelectorQuery();

                    query.select('#viewProject').boundingClientRect((res) => {
                        that.data.viewProjectTop = Math.abs(res.top - that.data.navigationBarHeight) - 60;
                    }).exec();

                    query.select('#viewProcess').boundingClientRect((res) => {
                        that.data.viewProcessTop = Math.abs(res.top - that.data.navigationBarHeight) - 60;
                    }).exec();

                    setTimeout(function () {
                        query.select('#viewLoans').boundingClientRect((res) => {
                            that.data.viewLoansTop = Math.abs(res.top - that.data.navigationBarHeight) - 60;
                        }).exec();
                    }, 1000);
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (app.langReady) {
            this.data.lang = app.globalData.lang;
            this.setData(this.data);
    
            this.data.buildingId = options.id;
            this.loadBuilding();
        } else {
            app.checkLangReadyCallback = res => {
                this.data.lang = app.globalData.lang;
                this.setData(this.data);
    
                this.data.buildingId = options.id;
                this.loadBuilding();
            }
        }
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
    onShareAppMessage: function () {
        let desc = this.data.lang.PROGRAM_INTRO;
        return {
            title: this.data.navigationBarTitle,
            desc: desc,
            path: '/pages/index/index?from=share&type=building&id=' + this.data.buildingId
        }
    }
})