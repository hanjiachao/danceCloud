// pages/change-phone-number/change-phone-number.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        showMobile: '',
        code: '',
        time: 0,
        type:''
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    submit: function () {
        if(this.data.type == '海外'){
            wx.navigateTo({
                url: '../change-phone-end/change-phone-end?type=' + '海外'
            })
            return false
        }
        if(this.data.code == '' && this.data.type == '国内'){
            common.info('请输入验证码')
            return false
        }
        var that = this
        common.ajax({
            url: 'Login/checkCode',
            data: {
                mobile: that.data.mobile,
                code: that.data.code
            },
            loading: '加载中...',
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    wx.navigateTo({
                        url: '../change-phone-end/change-phone-end?type=' + '国内'
                    })
                }else{
                    common.info(res.result.msg)
                }
            }
        })
    },
    sendCode: function () {
        if (this.data.time > 0) {
            return false
        }
        var that = this
        common.ajax({
            url: 'Login/sendLoginCode',
            data: {
                mobile: that.data.mobile
            },
            loading: '发送中...',
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        time: 60
                    })
                    getApp().globalData.timer = setInterval(function () {
                        that.data.time--
                        if (that.data.time == 0) {
                            clearInterval(getApp().globalData.timer)
                        }
                        that.setData({
                            time: that.data.time
                        })
                    }, 1000)
                } else {
                    common.info(res.result.msg)
                }
            },
            fail: function () {
                common.info('发送失败，请重试')
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            mobile: options.mobile,
            showMobile: options.showMobile
        })
        var that = this;
        common.ajax({
            url: 'User/getUserData',
            data: {},
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        type: res.result.type,
                    })
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