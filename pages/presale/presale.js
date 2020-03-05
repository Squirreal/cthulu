// pages/presale/presale.js
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
        scrollToViewId: '',
        presaleId: '',
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
        }
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
    handleFeatureTap: function (event) {
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
        // let id = event.currentTarget.dataset.id;
        // this.data.scrollToViewId = id;
        // this.setData(this.data);
    },
    handleScroll: function (event) {
        // let that = this;
        // let showTabbar = false;
        // if (event.detail.scrollTop > 200) {
        //     showTabbar = true;
        // } else {
        //     showTabbar = false;
        // }
        // if (showTabbar != that.data.showTabbar) {
        //     this.data.showTabbar = showTabbar;
        //     this.data.scrollToViewId = "";
        //     that.setData(this.data);
        // }

    },
    handleShowCalc: function () {
        this.data.calc.show = true;
        this.setData(this.data);
    },
    handleCloseCalc: function () {
        this.handleCalcReset();
        this.data.calc.show = false;
        this.setData(this.data);
    },
    handleAmountInput: function (event) {
        this.data.calc.amount = event.detail.value;
    },
    handleYearPickerChange: function (event) {
        this.data.yearIndex = event.detail.value;
        this.setData(this.data);
    },
    handlePaymentRatioInput: function (event) {
        this.data.calc.paymentRatio = event.detail.value;
    },
    handleLendingRateInput: function (event) {
        this.data.calc.lendingRate = event.detail.value;
    },
    handleCalcConfirm: function (event) {
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
    amountFormat: function (s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    },
    loadPresale: function () {
        let that = this;
        wx.showLoading();
        wx.request({
            url: app.apiConfig.host,
            data: {
                service: 'presale',
                id: that.data.presaleId
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
    onLoad: function (options) {
        if (app.langReady) {
            this.data.lang = app.globalData.lang;
            this.setData(this.data);

            this.data.presaleId = options.id;
            this.loadPresale();
        } else {
            app.checkLangReadyCallback = res => {
                this.data.lang = app.globalData.lang;
                this.setData(this.data);
                this.data.presaleId = options.id;
                this.loadPresale();
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
            path: '/pages/index/index?from=share&type=presale&id=' + this.data.presaleId
        }
    }
})