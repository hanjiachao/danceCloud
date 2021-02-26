// pages/shoppingDetail/shoppingDetail.js
var common = require("../../utils/util.js");
var WxParse = require("../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:{},
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      go_id:'',
      show:false,
      cartSta: false,
      specs: '',
      num: '',
      current_index:0,
      number: 1,
      specename: '',
      evaluation:[],
      count_evaluation: '',
      star:[1,2,3,4,5],
      isshare:false,
      common_price:'',
      ismembershow:false,
      order_no:'',
      isorder:false,
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
                    isShare: false
                })
                common.info(res.result.msg)
            }
        })
    },
    shareSta: function () {
      this.setData({
          isshare:false
      })
    },
    share: function () {
       this.setData({
           isshare:true
       })
    },
    evaAll: function () {
        wx.navigateTo({
            url:'../myEvaluate/myEvaluate?go_id=' + this.data.go_id
        })
    },
    lookImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.dataset.item, // 当前显示图片的http链接
            urls: e.currentTarget.dataset.src // 需要预览的图片http链接列表
        })
    },
    paycancel: function () {
        this.setData({
            isorder:false
        })
    },
    payorder:function () {
        this.setData({
            isorder:false
        })
        wx.navigateTo({
            url:'../ordersure/ordersure?order_no=' + this.data.order_no
        })
    },
    purchasebtn: function () {
      if (this.data.order_no != '' && this.data.list.go_type == '拼团') {
          this.setData({
              cartSta: false,
              isorder:true
          })
          return false
      }
        this.generatingmenu();
        this.setData({
            cartSta: false
        })
    },
    cart: function () {
        wx.switchTab({
            url: '/pages/ShoppingCart/ShoppingCart'
        })
    },
    purchase: function () {
      var that = this
        if (that.data.specename == '') {
           that.setData({
               cartSta: true
           })
        } else {
           that.generatingmenu();
        }
    },
    generatingmenu: function () {
        var that = this
        common.ajax({
            url: 'Goods/balanceGoods',
            data: {
                go_id:that.data.go_id,
                specs: that.data.specs,
                number: that.data.number
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                if (res.status != 'SUCCESS') {
                    common.info(res.result.msg)
                } else {
                    that.setData({
                        order_no:res.result.order_no
                    })
                    wx.navigateTo({
                        url:'../ordersure/ordersure?order_no=' + res.result.order_no
                    })
                }
            }
        })
    },
    joinShop: function () {
        var that = this
        common.ajax({
            url: 'Goods/updateGoodsCart',
            data: {
                go_id:that.data.go_id,
                specs: that.data.specs,
                number: that.data.number
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                if (res.status != 'SUCCESS') {
                    common.info(res.result.msg)
                } else {
                    that.setData({
                        cartSta: false,
                        specename: that.data.specs
                    })
                    that.cancelCart();
                    that.shoopdetail('no');
                }
            }
        })
    },
    addtitle: function (e) {
        var price = ''
        if (this.data.list.go_type == '商品') {
            price = parseFloat(this.data.list.go_price)
        } else {
            price = parseFloat(this.data.list.go_group_price)
        }
        if (e.detail.value == '') {
            this.setData({
                number: 0,
                common_price:0.00
            })
        } else {
            var value = e.detail.value
            var numvalue = value.replace(/\b(0+)/gi,"")
            this.data.common_price = (price * numvalue).toFixed(2)
            this.setData({
                number: numvalue,
                common_price: this.data.common_price
            })
        }
    },
    numchange: function (e) {
        var price = ''
        if (this.data.list.go_type == '商品') {
            price = parseFloat(this.data.list.go_price)
        } else {
            price = parseFloat(this.data.list.go_group_price)
        }
       if (e.detail.value == 0) {
           this.setData({
               number: 1,
               common_price:price
           })
       }
    },
    addnum: function (e) {
        var price = ''
        if (this.data.list.go_type == '商品') {
            price = parseFloat(this.data.list.go_price)
        } else {
            price = parseFloat(this.data.list.go_group_price)
        }
        if (e.currentTarget.dataset.type == '2') {
            console.log(parseInt(this.data.num))
            console.log(parseInt(this.data.number))
            if (parseInt(this.data.number) >= parseInt(this.data.num)) {
                common.info('库存不足')
                return false
            }
            this.data.number =  parseInt(parseInt(this.data.number) + 1)
            this.data.common_price = (price * this.data.number).toFixed(2)
           this.setData({
               number: this.data.number,
               common_price:this.data.common_price
           })
        } else {
            if (this.data.number == 1) {
               return false
            }
            this.data.number =  parseInt(parseInt(this.data.number) - 1)
            this.data.common_price = (price * this.data.number).toFixed(2)
            this.setData({
                number: this.data.number,
                common_price:this.data.common_price
            })
        }
    },
    selectcolor: function (e) {
       this.setData({
           specs: e.currentTarget.dataset.specs,
           num: e.currentTarget.dataset.num,
           current_index: e.currentTarget.dataset.index
       })
    },
    cancel: function () {
       this.setData({
           ismembershow:false
       })
    },
    next_two: function () {
        this.setData({
            ismembershow:false
        })
        wx.navigateTo({
            url:'../myVip/myVip'
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  shoopdetail: function (sta) {
      var that = this
      common.ajax({
          url: 'Goods/getGoodsDetail',
          data: {
              go_id:that.data.go_id
          },
          userinfo:true,
          loading: '加载中...',
          success: function (res) {
              that.setData({
                  show:true
              })
              if (res.status != 'SUCCESS') {
                  common.info(res.result.msg)
              } else {
                  if (res.result.list.go_type == '商品') {
                      that.setData({
                          common_price:res.result.list.go_price
                      })
                  } else {
                      that.setData({
                          common_price:res.result.list.go_group_price
                      })
                  }

                  // if (res.result.member == 1) {
                  //   that.setData({
                  //       ismembershow:false
                  //   })
                  // } else {
                  //     that.setData({
                  //         ismembershow:true
                  //     })
                  // }
                  // if (sta == 'no') {
                  //     that.setData({
                  //         ismembershow:false
                  //     })
                  // }
                  that.setData({
                      order_no:res.result.order_no,
                      count_evaluation:res.result.count_evaluation,
                      evaluation:res.result.evaluation,
                      list: res.result.list,
                      num: res.result.list.list.length ? res.result.list.list[0].number : '',
                      specs: res.result.list.list.length ? res.result.list.list[0].specs : ''
                  })
                  WxParse.wxParse('article', 'html', that.data.list.go_detail, that,5);
              }
          }
      })
  },
  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: '详情'
      });
      console.log(options.go_id)
      var that = this
      that.setData({
          go_id:options.go_id
      })
      that.shoopdetail('yes');

  },
    joincart: function () {
      if (this.data.list.go_type == '拼团' && this.data.list.status == '已拼团') {
          return false
      }
        this.setData({
            cartSta: true
        })
    },
    cancelCart: function () {
        var price = ''
        if (this.data.list.go_type == '商品') {
            price = parseFloat(this.data.list.go_price)
        } else {
            price = parseFloat(this.data.list.go_group_price)
        }
        this.setData({
            cartSta: false,
            current_index: 0,
            number: 1,
            num: this.data.list.list.length ? this.data.list.list[0].number : '',
            specs: this.data.list.list.length ? this.data.list.list[0].specs : '',
            common_price:price
        })
    },
    getCollect: function (e) {
      if (e.currentTarget.dataset.type == '未收藏') {
         var url = 'Goods/getGoodsCollect'
      } else {
          var url = 'Goods/delGoodsCollect'
      }
      var that = this
      common.ajax({
          url: url,
          data: {
              go_id:that.data.go_id
          },
          userinfo:true,
          loading: '加载中...',
          success: function (res) {
              if (res.status != 'SUCCESS') {
                  common.info(res.result.msg)
              } else {
                  common.info(res.result.msg)
                  var collect = 'list.collect'
                 if (that.data.list.collect == '未收藏') {
                     that.setData({
                         [collect]:'已收藏'
                     })
                 } else{
                     that.setData({
                         [collect]:'未收藏'
                     })
                 }
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
  }
})