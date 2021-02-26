var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:{},
      show: false,
      list:{},
      order_no: '',
      status:'',
      showDel: false,
      curr_index:'',
      showgoods: false,
      star:[1,2,3,4,5],
      delmenusta:false,
      isshare:false,
      go_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  share: function () {
      this.setData({
          isshare:true
      })
  },
    shareSta: function () {
        this.setData({
            isshare:false
        })
    },
    shareGroup: function () {
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
  paymoney: function () {
      wx.navigateTo({
          url:'../ordersure/ordersure?order_no=' + this.data.order_no
      })
  },
    delmenu: function () {
       this.setData({
           delmenusta:true
       })
    },
    hidemenu: function () {
       this.setData({
           delmenusta:false
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
                    delmenusta:false
                })
                if (res.status == 'SUCCESS') {
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    if (prevPage.route == 'pages/my-collage/my-collage') {
                        prevPage.data.goods_list.splice(prevPage.data.curr_index,1)
                        if (prevPage.data.goods_list.length == 0) {
                            prevPage.setData({
                                isshow:false
                            });
                        }
                        prevPage.setData({
                            goods_list:prevPage.data.goods_list
                        });
                    } else {
                        prevPage.data.list.splice(that.data.curr_index,1)
                        if (prevPage.data.list.length == 0) {
                            prevPage.setData({
                                isShow:false
                            });
                        }
                        prevPage.setData({
                            list:prevPage.data.list
                        });
                    }
                    setTimeout(function () {
                        wx.navigateBack({
                            delta:1
                        })
                    }, 500)
                } else {

                }
            }
        })

    },
  hideDel: function () {
     this.setData({
         showDel:false
     })
  },
    eva: function () {
        var info = JSON.stringify(this.data.list.detail)
        wx.navigateTo({
            url:'../evaluate/evaluate?info=' + info + '&order_no=' + this.data.order_no
        })
    },
  cancelmoney:function () {
      this.setData({
          showDel:true
      })
  },
    logistics: function () {
        wx.navigateTo({
            url:'../Logistics/Logistics?order_no=' + this.data.order_no
        })
    },
    hidegoods: function () {
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
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    if (prevPage.route == 'pages/my-collage/my-collage') {
                        console.log(prevPage.data.goods_list)
                        console.log(that.data.curr_index)
                        prevPage.data.goods_list[that.data.curr_index].gor_status = '已收货'
                        prevPage.setData({
                            goods_list:prevPage.data.goods_list
                        });
                    } else {
                        prevPage.data.list.splice(that.data.curr_index,1)
                        prevPage.setData({
                            list:prevPage.data.list
                        });
                    }
                    setTimeout(function () {
                        wx.navigateBack({
                            delta:1
                        })
                    }, 500)
                } else {

                }
            }
        })
    },
    suregoods: function () {
        this.setData({
            showgoods:true
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
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];
                  if (prevPage.route == 'pages/my-collage/my-collage') {
                      prevPage.data.goods_list.splice(that.data.curr_index,1)
                      prevPage.setData({
                          goods_list:prevPage.data.goods_list
                      });
                  } else {
                      prevPage.data.list.splice(that.data.curr_index,1)
                      prevPage.setData({
                          list:prevPage.data.list
                      });
                  }
                 setTimeout(function () {
                     wx.navigateBack({
                         delta:1
                     })
                 }, 500)
              } else {

              }
          }
      })
  },
    addressmanger: function () {
        wx.navigateTo({
            url:'../addressBook/addressBook'
        })
    },
  onLoad: function (options) {
      var that = this;
      console.log(options.curr_index)
      that.setData({
          order_no:options.order_no,
          status: options.status,
          curr_index:options.curr_index
      })
      common.ajax({
          url: 'Goods/getGoodsOrderDetail',
          data: {
              order_no: options.order_no
          },
          loading: '加载中',
          userinfo: true,
          success: function (res) {
              if (res.status == 'SUCCESS') {
                  that.setData({
                      address:res.result.address,
                      show: true,
                      list: res.result.list,
                      go_id: res.result.list.go_id
                  })
              } else {
                that.setData({
                    show: true
                })
                  common.info(res.result.msg)
              }
          }
      })
  },
    lookImage:function (e) {
      console.log(e.currentTarget.dataset.item)
        wx.previewImage({
            current: e.currentTarget.dataset.item, // 当前显示图片的http链接
            urls: this.data.list.image // 需要预览的图片http链接列表
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