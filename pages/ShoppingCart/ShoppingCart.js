// pages/ShoppingCart/ShoppingCart.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        editStatus: false,
        editBtn: '编辑',
        total: '0.00',
        allStatus: false,
        count: 0,
        isShow: false,
        showDel: false
    },

    shop: function () {
        wx.switchTab({
            url: '../Shopping/Shopping'
        })
    },
    pay: function () {
        if (this.data.count == 0) {
            return false
        }
        var list = this.data.list
        var idList = []
        for (var i = 0; i < list.length; i++) {
            if (list[i].ca_choose) {
                idList.push(list[i].ca_id)
            }
        }
        var that = this
        common.ajax({
            url: 'Goods/balanceCart',
            data: {
                ca_id: idList
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    wx.navigateTo({
                        url:'../ordersure/ordersure?order_no=' + res.result.order_no
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    showDel: function () {
        this.setData({
            showDel: true
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    remove: function () {
        var that = this
        var list = that.data.list
        var idList = []
        for (var i = 0; i < list.length; i++) {
            if (list[i].ca_choose) {
                idList.push(list[i].ca_id)
            }
        }
        common.ajax({
            url: 'Goods/delCart',
            data: {
                ca_id: idList
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    that.setData({
                        showDel: false
                    })
                    that.onLoad()
                } else {
                    common.info(res.result.msg)
                }
            }
        })

    },
    inputChange: function (e) {
        var num = parseInt(e.detail.value)
        var max = parseInt(e.target.dataset.max)
        var id = parseInt(e.target.dataset.id)
        var index = e.target.dataset.i
        var item = 'list[' + index + '].ca_number'
        if (num < 1) {
            num = 1
        } else if (num > max) {
            num = max
        }
        var that = this
        common.ajax({
            url: 'Goods/updateCartNumber',
            data: {
                ca_id: id,
                number: num
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        [item]: num
                    })
                    that.total()
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    total: function () {
        var list = this.data.list
        var price = 0
        var total = 0
        var count = 0
        for (var i = 0; i < list.length; i++) {
            if (list[i].ca_choose) {
                price = parseInt(list[i].ca_number) * parseFloat(list[i].go_price)
                total += price
                count++
            }
        }
        this.setData({
            total: total.toFixed(2),
            count: count
        })
    },
    changeNum: function (e) {
        var index = e.target.dataset.i
        var type = e.target.dataset.type
        var list = this.data.list
        var num = parseInt(list[index].ca_number)
        var item = 'list[' + index + '].ca_number'
        var max = parseInt(e.target.dataset.max)
        var id = parseInt(e.target.dataset.id)
        if (type == 'del') {
            if (num == 1) {
                return false
            }
            num--
        } else if (type == 'add') {
            if (num == max) {
                return false
            }
            num++
        }
        var that = this
        common.ajax({
            url: 'Goods/updateCartNumber',
            data: {
                ca_id: id,
                number: num
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        [item]: num
                    })
                    that.total()
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    choiceAll: function () {
        if (!this.data.allStatus) {
            var list = this.data.list
            var price = 0
            var total = 0
            for (var i = 0; i < list.length; i++) {
                var item = 'list[' + i + '].ca_choose'
                price = parseInt(list[i].ca_number) * parseFloat(list[i].go_price)
                total += price
                this.setData({
                    [item]: true
                })
            }
            this.setData({
                total: total.toFixed(2),
                allStatus: true,
                count: list.length
            })
        } else {
            var total = 0
            var list = this.data.list
            for (var i = 0; i < list.length; i++) {
                var item = 'list[' + i + '].ca_choose'
                this.setData({
                    [item]: false
                })
            }
            this.setData({
                total: total.toFixed(2),
                allStatus: false,
                count: 0
            })
        }
    },
    choice: function (e) {
        var index = e.target.dataset.i
        var choice = e.target.dataset.choice
        var item = 'list[' + index + '].ca_choose'
        var length = this.data.list.length
        var num = 0
        this.setData({
            [item]: !choice
        })
        this.total()
        for(var i = 0;i < length;i++){
            if(this.data.list[i].ca_choose){
                num++
            }
            if(num == length){
                this.setData({
                    allStatus: true
                })
            }else{
                this.setData({
                    allStatus: false
                })
            }
        }
    },
    edit: function () {
        if (this.data.editStatus) {
            this.setData({
                editStatus: !this.data.editStatus,
                editBtn: '编辑'
            })
        } else {
            this.setData({
                editStatus: !this.data.editStatus,
                editBtn: '完成'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        common.ajax({
            url: 'Goods/getGoodsCartList',
            data: {},
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    var total = 0
                    that.setData({
                        list: res.result.list,
                        total: total.toFixed(2),
                        count: 0,
                        isShow: true
                    })
                    for (var i = 0; i < res.result.list.length; i++) {
                        var item = 'list[' + i + '].ca_choose'
                        that.setData({
                            [item]: false
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
        this.setData({
            allStatus: false
        })
        this.onLoad()
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