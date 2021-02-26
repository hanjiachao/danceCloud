// pages/my-collage/my-collage.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
     arraySrc:['全部','待付款','待成团', '已成团','未成团'],
     cur_index:0,
      info:{
          type:"课程",
          last_id:'',
          limit:10,
          status:'',
          start:0
      },
      class_list:[],
      goods_list:[],
      isshow:true,
      refresh_class:true,
      refresh_goods:true,
      isload:'加载中',
      showDel:false,
      order_no:'',
      curr_index:'',
      showgoods: false,
      goodsstatus:false,
      show:false,
      menuSta:false,
      sharebtn: false,
      share_image:'',
      share_message:'',
      dg_id:'',
      go_id:'',
      isshare: false,
      isdelgoods:false,
      ajaxshoping:true
  },
    shareGroupGoods: function () {
        var that = this
        common.ajax({
            url: 'Community/shareCommunity',
            data: {
                go_id:that.data.go_id
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    isshare: false
                })
                wx.showToast({
                    title: res.result.msg,
                    icon: 'none'
                })
            }
        })
    },
    shareGoods: function (e) {
       this.setData({
           isshare:true,
           go_id:e.currentTarget.dataset.id
       })
    },
    shareCourse: function (e) {
        this.setData({
            sharebtn:true,
            dg_id:e.currentTarget.dataset.id
        })
    },
    shareSta: function () {
        this.setData({
            sharebtn:false,
            isshare:false
        })
    },
    lessonVideo: function (e) {
        var id = e.target.dataset.id
        // wx.navigateTo({
        //     url: '../lessonVideo/lessonVideo?id=' + id
        // })
        wx.navigateTo({
            url: '../coursesList/coursesList?order=' + id
        })
    },
    pay: function (e) {
        var order = e.target.dataset.id
        wx.navigateTo({
            url: '../payLesson/payLesson?order=' + order + '&type=' + '团购'
        })
    },
    hideMenu: function () {
      this.setData({
          menuSta:false
      })
    },
    menuSure: function () {
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
                    menuSta:false
                })
                if (res.status == 'SUCCESS') {
                    that.data.goods_list.splice(that.data.curr_index,1)
                    if (that.data.goods_list.length == 0) {
                        that.setData({
                            isshow:false
                        });
                    }
                    that.setData({
                        goods_list:that.data.goods_list
                    });
                } else {

                }
            }
        })
    },
    delmenu: function (e) {
        this.setData({
            menuSta:true,
            curr_index:e.currentTarget.dataset.index,
            order_no:e.currentTarget.dataset.id
        })
    },
    cancelpay: function (e) {
      this.setData({
          curr_index:e.currentTarget.dataset.index,
          order_no:e.currentTarget.dataset.id,
          goodsstatus:true
      })
    },
    hidegoods: function () {
        this.setData({
            showgoods:false
        })
        console.log(this.data.showgoods)
    },
    payclass: function (e) {
      console.log(e.currentTarget.dataset.id)
    },
    cancelgoods:function (){
        var that = this
        common.ajax({
            url: 'User/delDanceGroupOrder',
            data: {
                order_no:that.data.order_no
            },
            loading: '加载中',
            userinfo: true,
            success: function (res) {

                that.setData({
                    goodsstatus:false
                })
                if (res.status == 'SUCCESS') {
                    common.info('取消成功')
                    that.data.class_list.splice(that.data.curr_index,1)
                    that.setData({
                        class_list:that.data.class_list
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    detail: function (e) {
        var order = e.currentTarget.dataset.order
        this.setData({
            curr_index:e.currentTarget.dataset.index
        })
        wx.navigateTo({
            url: '../coll-detail/coll-detail?order=' + order +'&status=' + e.currentTarget.dataset.status
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
                    that.data.goods_list[that.data.curr_index].gor_status = '已收货'
                    that.setData({
                        goods_list:that.data.goods_list
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
                    that.data.goods_list.splice(that.data.curr_index,1)
                    that.setData({
                        goods_list:that.data.goods_list
                    })
                } else {

                }
            }
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
    paymoney: function (e) {
        wx.navigateTo({
            url:'../ordersure/ordersure?order_no=' + e.currentTarget.dataset.id
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  delgoods: function (e) {
      this.setData({
          isdelgoods:true,
          order_no:e.currentTarget.dataset.id,
          curr_index:e.currentTarget.dataset.index
      })
  },
    canceldelgoods: function () {
      this.setData({
          isdelgoods:false
      })
    },
    suredelgoods: function () {
        var that = this
        common.ajax({
            url: 'Goods/delMyOrder',
            data: {
                order_no:that.data.order_no
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                common.info(res.result.msg)
                that.setData({
                    isdelgoods:false
                })
                if (res.status == 'SUCCESS') {
                    that.data.goods_list.splice(that.data.curr_index,1)
                    if (that.data.goods_list.length == 0) {
                        that.setData({
                            isshow:false
                        });
                    }
                    that.setData({
                        goods_list:that.data.goods_list
                    });
                } else {

                }
            }
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
  onLoad: function (options) {
      var that = this;
      common.ajax({
          url:'Index/getShareMessage',
          success: function (res) {
              that.setData({
                  share_image:res.result.share_image,
                  share_message:res.result.share_message
              })
          }
      })
      if (!that.data.ajaxshoping) {
          return false
      }
      that.setData({
          ajaxshoping:false
      })
      common.ajax({
          url: 'User/getMyGroupOrder',
          data: that.data.info,
          loading: that.data.isload,
          userinfo: true,
          success: function (res) {
              that.setData({
                  show:true,
                  ajaxshoping:true
              })
              if (that.data.isload == '') {
                  wx.stopPullDownRefresh()
              }
              if (res.status == 'SUCCESS') {
                if (that.data.info.type == '课程') {
                  if (res.result.class_list.length == 0 && that.data.info.start == 0) {
                      that.setData({
                          isshow:false
                      })
                      return false
                  }
                  if (res.result.class_list.length < that.data.info.limit) {
                     that.setData({
                         refresh_class:false
                     })
                  }
                    that.data.class_list = that.data.class_list.concat(res.result.class_list)
                    that.data.info.start = that.data.info.start + 1
                    var start = 'info.start'
                    that.setData({
                        class_list:that.data.class_list,
                        [start]:that.data.class_list.length
                    })
                } else {
                    if (res.result.goods_list.length == 0 && that.data.info.last_id == '') {
                        that.setData({
                            isshow:false
                        })
                        return false
                    }
                    if (res.result.goods_list.length < that.data.info.limit) {
                        that.setData({
                            refresh_goods:false
                        })
                    }
                    that.data.goods_list = that.data.goods_list.concat(res.result.goods_list)
                    var last_id = 'info.last_id'
                    that.data.info.last_id = that.data.goods_list[that.data.goods_list.length - 1].gor_id
                    that.setData({
                        goods_list:that.data.goods_list,
                        [last_id]:that.data.info.last_id
                    })
                }
              } else {
                  common.info(res.result.msg)
              }
          }
      })
  },
    menudetail: function (e) {
    console.log(e.currentTarget.dataset.status)
        this.setData({
            curr_index:e.currentTarget.dataset.index
        })
       var status = ''
        if (e.currentTarget.dataset.status == '已评价') {
            status = '已完成'
        } else if (e.currentTarget.dataset.status == '已完成'){
            status = '待发货'
        } else if(e.currentTarget.dataset.status == '已支付'){
            status = '待成团'
        } else if(e.currentTarget.dataset.status == '待支付'){
            status = '待付款'
        } else if (e.currentTarget.dataset.status == '已发货'){
            status = '待收货'
        } else if (e.currentTarget.dataset.status == '已收货'){
            status = '待评价'
        }else if (e.currentTarget.dataset.status == '已退款'){
            status = '未成团'
        } else if (e.currentTarget.dataset.status == '已取消'){
            status = '已取消'
        }
        wx.navigateTo({
            url:'../order-detail/order-detail?order_no=' + e.currentTarget.dataset.id + '&status='+ status +'&curr_index=' + e.currentTarget.dataset.index
        })
    },
  collageClick: function (e) {
    var type ='info.type'
    var last_id ='info.last_id'
    var start ='info.start'
      if (e.currentTarget.dataset.index == 1) {
        this.setData({
            [type]:"课程",
            goods_list:[],
            class_list:[],
            refresh_goods:true,
            isshow:true,
            [start]:0
        })
      } else {
          this.setData({
              [type]:"商品",
              class_list:[],
              goods_list:[],
              refresh_class:true,
              isshow:true,
              [last_id]:''
          })
      }
      this.onLoad();
  },
  menuSrc:function (e) {
      var status = 'info.status';
      var staname = '';
      var last_id ='info.last_id'
      var start ='info.start'
      if (e.currentTarget.dataset.item == '全部') {
        staname = ''
      } else {
        staname = e.currentTarget.dataset.item
      }
      this.setData({
          cur_index:e.currentTarget.dataset.index,
          [status]: staname,
          class_list:[],
          goods_list:[],
          refresh_goods:true,
          refresh_class:true,
          isshow:true,
          [last_id]:'',
          [start]:0
      })
      this.onLoad();
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
      var last_id ='info.last_id'
      var start ='info.start'
      this.setData({
          class_list:[],
          goods_list:[],
          refresh_goods:true,
          refresh_class:true,
          isshow:true,
          [last_id]:'',
          [start]:0,
          isload:''
      })
      this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this;
      if (that.data.info.type == '商品') {
          if (that.data.refresh_goods) {
              that.setData({
                  isload:'加载中...'
              })
              that.onLoad();
          }
      } else {
          if (that.data.refresh_class) {
              that.setData({
                  isload:'加载中...'
              })
              that.onLoad();
          }
      }
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