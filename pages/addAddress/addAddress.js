// pages/addAdress/addAdress.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        mobile:'',
        address:'',
        cityDetail:'',
        provinceId:'',
        cityId:'',
        countyId:'',
        id:'',
        defaultStatus:'',
        data:{}
    },
    selectCity: function () {
        wx.navigateTo({
            url:'../selectCity/selectCity'
        })
    },
    changeDefault: function () {
        if(this.data.defaultStatus == '是'){
            this.setData({
                defaultStatus: ''
            })
        }else{
            this.setData({
                defaultStatus: '是'
            })
        }
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    submit: function () {
        if(this.data.name == ''){
            common.info('请输入姓名')
            return false
        }
        if(this.data.mobile == ''){
            common.info('请输入手机号码')
            return false
        }
        if(!common.is_mobile(this.data.mobile)){
            common.info('手机号码格式错误')
            return false
        }
        if(this.data.cityDetail == ''){
            common.info('请选择所在地区')
            return false
        }
        if(this.data.address == ''){
            common.info('请输入详细地址')
            return false
        }
        var that = this;
        common.ajax({
            url: 'User/editUserAddress',
            data: {
                name: that.data.name,
                mobile: that.data.mobile,
                province: that.data.provinceId,
                city: that.data.cityId,
                county: that.data.countyId,
                address: that.data.address,
                ua_id : that.data.id,
                default: that.data.defaultStatus
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    setTimeout(function() {
                        wx.navigateBack({})
                    },1500)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.id){
            var id = options.id
            var that = this;
            common.ajax({
                url: 'User/getUseAddressDeatil',
                data: {
                    ua_id: id
                },
                loading: '加载中...',
                userinfo: true,
                success: function (res) {
                    if (res.status == 'SUCCESS') {
                        that.setData({
                            name: res.result.list.ua_name,
                            mobile: res.result.list.ua_mobile,
                            provinceId: res.result.list.ua_province_id,
                            cityId: res.result.list.ua_city_id,
                            countyId: res.result.list.ua_county_id,
                            address: res.result.list.ua_address,
                            id : id,
                            cityDetail: res.result.list.ua_province + res.result.list.ua_city + res.result.list.ua_county,
                            defaultStatus: res.result.list.ua_default
                        })
                    } else {
                        common.info(res.result.msg)
                    }
                }
            })
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

    }
})