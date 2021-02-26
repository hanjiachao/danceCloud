
var common = require("../../utils/util.js");
Page({
    data:{
        content:'授权登录',
        show: true,
        share_code:''
    },
    onLoad: function(options) {
        // 查看是否授权
        console.log(options)
        var that = this;
        var url = ''
        if (options.share_code == '' || options.share_code == undefined) {
            that.setData({
                share_code:''
            })
        } else {
            that.setData({
                share_code:options.share_code
            })
        }
        if (common.get_userinfo()) {
            that.setData({
                content:'授权中···'
            })
            setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
            }, 400)
        }
    },
    bindGetUserInfo: function(e) {
        var userinfo = e.detail.userInfo
        if (userinfo != undefined) {
            var that = this;
            getApp().globalData.userInfo = e.detail.userInfo;
            getApp().getOpenid(that.data.share_code);
          } else {
        }
    },
    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    },
})