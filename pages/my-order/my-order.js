// pages/my-order/my-order.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: ['全部','待付款','待发货','待收货','待评价','已完成','已取消'],
        submitList: ['','待支付','已支付','已发货','已收货','已评价','已取消'],
        navIndex: 0,
        lastId: '',
        limit: 10,
        status: '',
        refresh: true,
        list: [],
        isShow: true,
        isload:'加载中...',
        showDel: false,
        order_no:'',
        curr_index:'',
        showgoods: false,
        show:false,
        ajaxshoping:true,
        delSta:false
    },
    delMenu: function (e) {
       this.setData({
           order_no:e.currentTarget.dataset.id,
           curr_index:e.currentTarget.dataset.index,
           delSta:true
       })
    },
    delcancel: function () {
      this.setData({
          delSta:false
      })
    },
    delmenusure: function () {
        var that = this
        common.ajax({
            url: 'Goods/delMyOrder',
            data: {
                order_no:that.data.order_no
            },
            loading: '加载中',
            userinfo: true,
            success: function (res) {
                common.info(res.result.msg)
                that.setData({
                    delSta:false
                })
                if (res.status == 'SUCCESS') {
                    that.data.list.splice(that.data.curr_index,1)
                    that.setData({
                        list:that.data.list
                    })
                } else {

                }
            }
        })
    },
    eva:function (e) {
        var info = JSON.stringify(e.currentTarget.dataset.info.detail)
        var order_no = e.currentTarget.dataset.id
        this.setData({
            curr_index:e.currentTarget.dataset.index
        })
        wx.navigateTo({
            url:'../evaluate/evaluate?info=' + info + '&order_no=' + order_no
        })
    },
    hidegoods:function () {
       this.setData({
           showgoods:false
       })
    },
    sure: function () {
        var that = this
        common.ajax({
            url: 'Goods/receiveMyOrder',
            data: {
                order_no:that.data.order_no
            },
            loading: '加载中',
            userinfo: true,
            success: function (res) {
                common.info(res.result.msg)
                that.setData({
                    showgoods:false
                })
                if (res.status == 'SUCCESS') {
                    that.data.list.splice(that.data.curr_index,1)
                    that.setData({
                        list:that.data.list
                    })
                } else {

                }
            }
        })
    },
    logistics: function (e) {
        wx.navigateTo({
            url:'../Logistics/Logistics?order_no=' + e.currentTarget.dataset.id
        })
    },
    suregoods: function (e) {
       this.setData({
           showgoods:true,
           order_no:e.currentTarget.dataset.id,
           curr_index:e.currentTarget.dataset.index
       })
    },
    cancelmoney:function (e) {
        this.setData({
            showDel:true,
            order_no:e.currentTarget.dataset.id,
            curr_index:e.currentTarget.dataset.index
        })
    },
    hideDel:function () {
        this.setData({
            showDel:false
        })
    },
    cancelmenu : function () {
        var that = this
        common.ajax({
            url: 'Goods/cancelMyOrder',
            data: {
                order_no:that.data.order_no
            },
            loading: '加载中',
            userinfo: true,
            success: function (res) {
                common.info(res.result.msg)
                that.setData({
                    showDel:false
                })
                if (res.status == 'SUCCESS') {
                   that.data.list.splice(that.data.curr_index,1)
                    that.setData({
                        list:that.data.list
                    })
                } else {

                }
            }
        })
    },
    changeNav: function (e) {
        var index = e.target.dataset.i
        this.setData({
            navIndex: index
        })
        this.reload()
    },
    reload: function () {
        this.setData({
            lastId: '',
            list:[],
            refresh: true,
            isload:'',
            isShow:true
        })
        this.onLoad()
    },
    mdzz: function (ret,callback) {
        for(var i = 0;i < ret.length;i++){
            var gor_status = 'ret['+i+'].gor_status'
            if(ret[i].gor_status == '待支付'){
                ret[i].gor_status = '待付款'
            }else if(ret[i].gor_status == '已支付'){
                ret[i].gor_status = '待发货'
            }else if(ret[i].gor_status == '已发货'){
                ret[i].gor_status = '待收货'
            }else if(ret[i].gor_status == '已收货'){
                ret[i].gor_status = '待评价'
            }else if(ret[i].gor_status == '已评价'){
                ret[i].gor_status = '已完成'
            }else if(ret[i].gor_status == '已取消'){
                ret[i].gor_status = '已取消'
            }
            if (i == ret.length-1) {
                callback(ret)
            }
        }
    },
    paymoney: function (e) {
        wx.navigateTo({
            url:'../ordersure/ordersure?order_no=' + e.currentTarget.dataset.id
        })
    },
    menudetail: function (e) {
        wx.navigateTo({
            url:'../order-detail/order-detail?order_no=' + e.currentTarget.dataset.id + '&status='+ e.currentTarget.dataset.status +'&curr_index=' + e.currentTarget.dataset.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        common.ajax({
            url: 'Goods/getMyOrderList',
            data: {
                last_id: that.data.lastId,
                limit: that.data.limit,
                status: that.data.submitList[that.data.navIndex],
                type:'商品'
            },
            loading: that.data.isload,
            userinfo: true,
            success: function (res) {
                that.setData({
                    show:true,
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    if (that.data.isload == '') {
                        wx.stopPullDownRefresh()
                    }
                    if (res.result.list.length == 0 && that.data.lastId == '') {
                        that.setData({
                            isShow: false
                        })
                        return false
                    }
                    if (res.result.list.length < that.data.limit) {
                        that.setData({
                            refresh: false
                        })
                    }
                    that.mdzz(res.result.list,function (list) {
                        that.data.list = that.data.list.concat(list)
                        that.setData({
                            list: that.data.list,
                            isShow: true
                        })
                        if (that.data.list.length>0) {
                            that.setData({
                                lastId:that.data.list[that.data.list.length - 1].gor_id
                            })
                        }
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
       this.reload();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
        if (that.data.refresh) {
            that.setData({
                isload:'加载中...'
            })
            that.onLoad();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})