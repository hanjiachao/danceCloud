// pages/myPurse/myPurse.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: '',
        list: [],
        showWithdraw: false,
        price: 0,
        start: 0,
        limit: 10,
        refresh: true,
        isShow: false,
        ajaxshoping:true
    },

    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    showWithdraw: function () {
        this.setData({
            showWithdraw: true,
            price: 0
        })
    },
    hideWithdraw: function () {
        this.setData({
            showWithdraw: false
        })
    },
    submit: function () {
        if(this.data.price <= 0){
            return false
        }
        var that = this
        common.ajax({
            url: 'User/withdraw',
            data: {
                price: that.data.price
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        showWithdraw: false
                    })
                    common.info(res.result.msg)
                } else {
                    that.setData({
                        showWithdraw: false
                    })
                    common.info(res.result.msg)
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        common.ajax({
            url: 'User/getUserWallet',
            data: {
                start: that.data.start,
                limit: that.data.limit
            },
            userinfo: true,
            success: function (res) {
                that.setData({
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    if (that.data.start == 0) {
                        if (res.result.list.length > 0) {
                            that.setData({
                                start: res.result.list.length
                            })
                        }
                        that.setData({
                            list: res.result.list,
                            total: res.result.account,
                            isShow: true
                        })
                    } else {
                        if (res.result.list.length > 0) {
                            that.setData({
                                start: that.data.start + res.result.list.length
                            })
                            var list = that.data.list
                            for (var i = 0; i < res.result.list.length; i++) {
                                list.push(res.result.list[i])
                            }
                            that.setData({
                                list: list
                            })
                        }
                    }
                    if (res.result.list.length < that.data.limit) {
                        that.setData({
                            refresh: false
                        })
                    }
                } else {
                    common.info(res.result.msg)
                }
            }
        })
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
        this.setData({
            refresh: true,
            start: 0
        });
        this.onLoad()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.refresh) {
            this.onLoad()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})