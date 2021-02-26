// pages/my-collection/my-collection.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: ['课程', '商品','音乐'],
        navIndex: 0,
        limit: 5,
        lastId: '',
        type: '',
        courseList: [],
        goodsList: [],
        musicList: [],
        refresh: true,
        isShow: false,
        showDel: false,
        id: 0,
        ajaxshoping:true
    },

    courseDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../liveDetail/liveDetail?dc_id=' + id
        })
    },
    goodsDetail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../shoppingDetail/shoppingDetail?go_id=' + id
        })
    },
    showDel: function (e) {
        var id = e.target.dataset.id
        this.setData({
            showDel: true,
            id: id
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    cancelCollection: function (e) {
        var that = this
        var id = that.data.id
        if (that.data.navIndex == 0) {
            var ajaxUrl = 'DanceCourse/collect'
        } else if (that.data.navIndex == 1) {
            var ajaxUrl = 'Goods/delGoodsCollect'
        }
        common.ajax({
            url: ajaxUrl,
            data: {
                dc_id: id,
                go_id: id
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        refresh: true,
                        lastId: '',
                        showDel: false
                    });
                    that.onLoad()
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    changeNav: function (e) {
        var index = e.target.dataset.i
        this.setData({
            navIndex: index,
            refresh: true,
            lastId: ''
        })
        this.onLoad()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isShow: false
        })
        var that = this;
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        common.ajax({
            url: 'User/getMyCollect',
            data: {
                last_id: that.data.lastId,
                limit: that.data.limit,
                type: that.data.navList[that.data.navIndex]
            },
            // loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    if (that.data.lastId == '') {
                        if (res.result.class_list.length + res.result.goods_list.length > 0) {
                            if (that.data.navIndex == 0) {
                                that.setData({
                                    lastId: res.result.class_list[res.result.class_list.length - 1].uc_id
                                })
                            } else if (that.data.navIndex == 1) {
                                that.setData({
                                    lastId: res.result.goods_list[res.result.goods_list.length - 1].uc_id
                                })
                            }
                        }
                        that.setData({
                            courseList: res.result.class_list,
                            goodsList: res.result.goods_list
                        })
                    } else {
                        if (res.result.class_list.length + res.result.goods_list.length > 0) {
                            if (that.data.navIndex == 0) {
                                var list = that.data.courseList
                                for (var i = 0; i < res.result.class_list.length; i++) {
                                    list.push(res.result.class_list[i])
                                }
                                that.setData({
                                    lastId: res.result.class_list[res.result.class_list.length - 1].uc_id,
                                    courseList: list
                                })
                            } else if (that.data.navIndex == 1) {
                                var list = that.data.goodsList
                                for (var i = 0; i < res.result.goods_list.length; i++) {
                                    list.push(res.result.goods_list[i])
                                }
                                that.setData({
                                    lastId: res.result.goods_list[res.result.goods_list.length - 1].uc_id,
                                    goodsList: list
                                })
                            }
                        }
                    }
                    if (res.result.class_list.length + res.result.goods_list.length < that.data.limit) {
                        that.setData({
                            refresh: false
                        })
                    }
                    that.setData({
                        isShow: true
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
        this.setData({
            refresh: true,
            lastId: ''
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