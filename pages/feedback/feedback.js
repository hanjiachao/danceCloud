// pages/feekback/feekback.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: '',
        contact: ''
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    submit: function () {
        if(this.data.content == ''){
            common.info('请输入内容')
            return false
        }
        if(this.data.contact == ''){
            common.info('请输入联系方式')
            return false
        }
        var isQQ = /^[1-9]\d{4,10}$/;
        var isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
        if(!isQQ.test(this.data.contact) && !isEmail.test(this.data.contact) && !isMobile.test(this.data.contact)){
            common.info('联系方式格式错误')
            return false
        }
        var that = this;
        common.ajax({
            url: 'User/sendFeedback',
            data: {
                content: that.data.content,
                contact: that.data.contact
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    setTimeout(function() {
                        wx.navigateBack({
                            delta:2
                        })
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