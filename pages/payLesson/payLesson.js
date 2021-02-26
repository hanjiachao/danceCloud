// pages/payLesson/payLesson.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        detail: {},
        remark: '',
        type:'',
        show:false,
        confirmshow:false,
        courseinfo:{
            dc_id: '',
            integral: '',
            coupon_id: '',
            remark: ''
        },
        groupinfo: {
            dg_id: '',
            integral: '',
            coupon_id: '',
            remark: ''
        },
        order_no:''
    },

    submit: function () {
       this.setData({
           confirmshow:true
       })
    },
    cancelpay: function () {
        this.setData({
            confirmshow:false
        })
    },
    surepay:function () {
        var that = this
        var url = ''
        // if (that.data.type == '直播') {
        //     url = 'DanceCourse/pay'
        //     data = that.data.courseinfo
        // } else {
        //     url = 'DanceGroup/pay'
        //     data = that.data.groupinfo
        // }
        url = 'Pay/ordernoPay'
        common.ajax({
            url: url,
            data: {
                order_no: that.data.order_no
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                if (res.status != 'SUCCESS') {
                    wx.showToast({
                        title: res.result.msg,
                        icon: 'none'
                    })
                } else {
                    that.setData({
                        confirmshow: false
                    })
                    if (res.result.order_status == '已支付') {
                        wx.reLaunch({
                            url:'../ordersuccess/ordersuccess?integral=' + res.result.can_get_integral + '&type=' + that.data.type  + '&order_no=' + res.result.order_no
                        })
                    } else {
                        var can_get_integral = res.result.can_get_integral
                        var order_no = res.result.order_no
                        wx.requestPayment(
                            {
                                'timeStamp': '' + res.result.wxpay_data.timeStamp,
                                'nonceStr': res.result.wxpay_data.nonceStr,
                                'package': res.result.wxpay_data.package,
                                'signType': 'MD5',
                                'paySign': res.result.wxpay_data.paySign,
                                'success':function(res){
                                    wx.reLaunch({
                                        url:'../ordersuccess/ordersuccess?integral=' + can_get_integral + '&type=' + that.data.type + '&order_no=' + order_no
                                    })
                                },
                                'fail':function(res){},
                                'complete':function(res){}
                            })
                    }
                }
            }
        })
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
        var cour = 'courseinfo.remark'
        var group = 'groupinfo.remark'
        this.setData({
            [cour]:e.detail.value,
            [group]:e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var url = ''
        if (options.type == '团购'){
            that.setData({
                type:'拼团'
            })
            url = 'DanceGroup/getDetailByOrderNo'
        } else {
            that.setData({
                type:'直播'
            })
            url = 'DanceCourse/getDetailByOrderNo'
        }
        that.setData({
            order_no: options.order
        })
        common.ajax({
            url: url,
            data: {
                order_no: options.order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    show:true
                })
                if (res.status == 'SUCCESS') {
                    that.setData({
                        info: res.result,
                        detail: res.result.dance_detail
                    })
                    if (that.data.type == '直播') {
                       var dc_id = 'courseinfo.dc_id'
                        var integral = 'courseinfo.integral'
                        that.setData({
                            [dc_id]:res.result.dance_detail.dc_id,
                            [integral]:res.result.can_use_integral
                        })
                    } else {
                        var dg_id = 'groupinfo.dg_id'
                        var integral = 'groupinfo.integral'
                        that.setData({
                            [dg_id]:res.result.dance_detail.dg_id,
                            [integral]:res.result.can_use_integral
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