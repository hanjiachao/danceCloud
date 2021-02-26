// pages/addressBook/addressBook.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lastId: '',
        limit: 5,
        list: [],
        refresh: true,
        showDel: false,
        id: [],
        index: 0,
        isShow: false,
        ajaxgetList:true
    },

    changeDefault: function (e) {
        var id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        var that = this;
        common.ajax({
            url: 'User/saveDefaultAddress',
            data: {
                ua_id: id
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    console.log(JSON.stringify(res))
                    var item = 'list[' + index + '].ua_default'
                    if (that.data.list[index].ua_default == '是') {
                        that.setData({
                            [item]: ''
                        })
                    } else {
                        for (var i = 0; i < that.data.list.length; i++) {
                            if (that.data.list[i].ua_default == '是') {
                                var old = 'list[' + i + '].ua_default'
                            }
                        }
                        that.setData({
                            [item]: '是',
                            [old]: ''
                        })
                    }
                    common.info(res.result.msg)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    address: function (e) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (prevPage.route == 'pages/ordersure/ordersure') {
            prevPage.setData({
                address: e.currentTarget.dataset.item
            });
            wx.navigateBack({})
        }
    },
    edit: function (e) {
        var id = e.currentTarget.dataset.id
        // var index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '../addAddress/addAddress?id=' + id
            // url: '../addAddress/addAddress?data=' + this.data.list[index]
        })
    },
    showDel: function (e) {
        var id = []
        id.push(e.currentTarget.dataset.id)
        var index = e.currentTarget.dataset.index
        this.setData({
            showDel: true,
            id: id,
            index: index
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    del: function () {
        var id = this.data.id
        var index = this.data.index
        var that = this
        common.ajax({
            url: 'User/delAddress',
            data: {
                ua_id: id
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    var list = that.data.list
                    list.splice(index, 1)
                    that.setData({
                        list: list,
                        showDel: false
                    })
                    common.info(res.result.msg)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    addAddress: function () {
        wx.navigateTo({
            url: '../addAddress/addAddress'
        })
    },
    getList: function () {
        var that = this;
        if (!that.data.ajaxgetList) {
           return false
        }
        that.setData({
            ajaxgetList:false
        })
        common.ajax({
            url: 'User/getUserAddressList',
            data: {
                last_id: that.data.lastId,
                limit: that.data.limit
            },
            // loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        ajaxgetList:true
                    })
                    if (that.data.lastId == '') {
                        if (res.result.list.length > 0) {
                            that.setData({
                                lastId: res.result.list[res.result.list.length - 1].ua_id
                            })
                        }
                        that.setData({
                            list: res.result.list,
                            isShow: true
                        })
                    } else {
                        if (res.result.list.length > 0) {
                            that.setData({
                                lastId: res.result.list[res.result.list.length - 1].ua_id
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

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
        this.setData({
            refresh: true,
            lastId: ''
        })
        this.getList()
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
        this.getList()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.refresh) {
            this.getList()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})