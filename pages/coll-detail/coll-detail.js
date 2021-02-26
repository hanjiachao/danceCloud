// pages/class-detail/class-detail.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail:{},
        showDel: false,
        showCancel: false,
        order: '',
        status:'',
        show:false,
        dg_id:'',
        sharebtn:false,
        share_image:'',
        share_message:''
    },
    shareSta: function () {
        this.setData({
            sharebtn:false
        })
    },
    shareGroup: function () {
        var that = this
        common.ajax({
            url: 'Community/shareCommunity',
            data: {
                dg_id:that.data.dg_id
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    sharebtn: false
                })
                wx.showToast({
                    title: res.result.msg,
                    icon: 'none'
                })
            }
        })
    },
    shareCourse: function () {
        this.setData({
            sharebtn:true
        })
    },
    pay: function (e) {
        var order = e.target.dataset.id
        wx.navigateTo({
            url: '../payLesson/payLesson?order=' + order + '&type=' + '团购'
        })
    },
    lessonVideo: function (e) {
        var id = e.target.dataset.id
        wx.navigateTo({
            url: '../coursesList/coursesList?order=' + id
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    showDel: function () {
        this.setData({
            showDel: true
        })
    },
    del: function () {
        var that = this;
        common.ajax({
            url: 'User/delDanceGroupOrder',
            data: {
                order_no: that.data.order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    that.setData({
                        showDel: false
                    })
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    if (prevPage.route == 'pages/my-collage/my-collage') {
                        prevPage.data.class_list.splice(prevPage.data.curr_index,1)
                        prevPage.setData({
                            class_list: prevPage.data.class_list
                        });
                    }
                    setTimeout(function () {
                        wx.navigateBack()
                    },1500)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    hideCancel: function () {
        this.setData({
            showCancel: false
        })
    },
    showCancel: function () {
        this.setData({
            showCancel: true
        })
    },
    cancel: function () {
        var that = this;
        common.ajax({
            url: 'User/cancelDanceOrder',
            data: {
                order_no: that.data.order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    that.setData({
                        showCancel: false
                    })
                    setTimeout(function () {
                        wx.navigateBack()
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
        var order = options.order
        this.setData({
            status:options.status
        })
        var that = this;
        common.ajax({
            url:'Index/getShareMessage',
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    share_image:res.result.share_image,
                    share_message:res.result.share_message
                })
            }
        })
        common.ajax({
            url: 'User/getMyDanceGroupDetail',
            data: {
                order_no: order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    show:true
                })
                if (res.status == 'SUCCESS') {
                    that.setData({
                        detail: res.result.detail,
                        dg_id:res.result.detail.dg_id,
                        order: order
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
        return {
            title: this.data.share_message,
            path: '/pages/groupDetail/groupDetail?dg_id=' + this.data.dg_id,
            imageUrl:this.data.share_image
        }
    }
})