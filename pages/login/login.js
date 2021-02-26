// pages/login/login.js
var common = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [
            {value: '国内', checked: 'true'},
            {value: '海外'}
        ],
        openid: '',
        mobile: '',
        password: '',
        old_path: '/pages/personal/personal',
        info: {
            type: '国内',
            province: '',
            city: '',
            county: '',
            address: '',
            mobile: '',
            code: ''
        },
        phoname:'请选择所在地区',
        time: 0
    },
    radioChange: function (e) {
      var type = 'info.type';
      var province = 'info.province';
      var city = 'info.city';
      var county = 'info.county';
      var address = 'info.address';
      var mobile = 'info.mobile';
      var code = 'info.code';
      var that = this
      this.setData({
        [type]:e.detail.value,
        [province]:'',
        [city]:'',
        [county]:'',
        [address]:'',
        [mobile]:'',
        [code]:'',
        phoname:'请选择所在地区',
        time: 0
      })
      clearInterval(getApp().globalData.timer)
    },
    selectCity: function () {
        wx.navigateTo({
            url: '../selectCity/selectCity'
        })
    },
    send_code: function(){
        if(this.data.time > 0){
            return false
        }
        if (this.data.info.type == '国内') {
            if(this.data.info.mobile == ''){
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                })
                return false
            }
            if(!common.is_mobile(this.data.info.mobile)){
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return false
            }
        }
        var that = this
        common.ajax({
            url: 'Login/sendRegisterCode',
            data: {
                mobile: this.data.info.mobile
            },
            loading: '发送中...',
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info('发送成功')
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
            fail: function(){
                common.info('发送失败，请重试')
            }
        })

    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={}
        var data = 'info.' + field
        temp_data[data]=e.detail.value
        this.setData(temp_data)
        console.log(this.data.info.mobile)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var openid = 'info.openid'
        var share_code = 'info.share_code'
        console.log(options.share_code)
        if (options.share_code == '' || options.share_code == undefined) {
            that.setData({
                [share_code]:''
            })
        } else {
            that.setData({
                [share_code]:options.share_code
            })
        }
        that.setData({
            [openid]:getApp().globalData.openid
        })
        console.log(that.data.info.openid)
        wx.setNavigationBarTitle({
            title: '绑定手机号'
        });
        if(options.openid){
            that.setData({
                openid: options.openid
            })
        }
        if(options.old_path){
            that.setData({
                old_path: options.old_path
            })
        }
    },
    login: function(){
        if (this.data.info.type == '国内' && this.data.phoname =='请选择所在地区') {
            wx.showToast({
                title: '请选择所在地区',
                icon: 'none'
            })
            return false
        }
        if (this.data.info.address == '') {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none'
            })
            return false
        }
        if (this.data.info.mobile == '') {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            })
            return false
        }
        if (this.data.info.type == '国内') {
            if (!/^1[34578]\d{9}$/.test(this.data.info.mobile)){
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return false
            }
            if(this.data.info.code==''){
                wx.showToast({
                    title: '请输入验证码',
                    icon: 'none'
                })
                return false
            }
        }
        var that = this
        common.ajax({
            url: 'Login/miniBindMobile',
            data: that.data.info,
            userinfo: true,
            loading: '登录中...',
            success: function (res) {
                if (res.status != 'SUCCESS') {
                    common.info(res.result.msg)
                } else {
                    common.info(res.result.info)
                    setTimeout(function(){
                        wx.navigateBack({
                            delta:2
                        })
                    }, 300)
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