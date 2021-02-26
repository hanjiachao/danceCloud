// pages/evaluate/evaluate.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:[],
      show: false,
      star:[1,2,3,4,5],
      curr_index: 5,
      eva:{
          star:5,
          is_show:'否',
          content: '',
          order_no:''
      },
      image:[],
      lengthimage: '',
      uploadList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  showName: function () {
      var is_show = 'eva.is_show'
      if (this.data.eva.is_show == '否') {
         this.setData({
             [is_show]:'是'
         })
     } else {
          this.setData({
              [is_show]:'否'
          })
     }
  },
    submit: function () {
        var that = this
        if (that.data.uploadList.length > 0){
            for(var i = 0;i < that.data.uploadList.length;i++){
                var item = 'eva.image_'+(i+1)
                that.setData({
                    [item]: that.data.uploadList[i]
                })
            }
        }
        common.ajax({
            url: 'Goods/evaluationOrder',
            data: that.data.eva,
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                common.info(res.result.msg)
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                if (prevPage.route == 'pages/order-detail/order-detail') {
                    var prevPages = pages[pages.length - 3];
                    if(prevPages.route == 'pages/my-collage/my-collage'){
                        prevPages.data.goods_list[prevPages.data.curr_index].gor_status = '已评价'
                        prevPages.setData({
                            goods_list: prevPages.data.goods_list
                        });
                    } else {
                        prevPages.data.list.splice(prevPages.data.curr_index,1)
                        if (prevPages.data.list.length == 0) {
                            prevPages.setData({
                                isShow: false
                            });
                        }
                        prevPages.setData({
                            list: prevPages.data.list
                        })
                    }
                    setTimeout(function () {
                        wx.navigateBack({
                            delta:2
                        })
                    },1500)
                }
                if (prevPage.route == 'pages/my-collage/my-collage') {
                    prevPage.data.goods_list[prevPage.data.curr_index].gor_status = '已评价'
                    prevPage.setData({
                        goods_list: prevPage.data.goods_list
                    });
                    setTimeout(function () {
                        wx.navigateBack({})
                    },1500)
                }
                if (prevPage.route == 'pages/my-order/my-order') {
                    prevPage.data.list.splice(prevPage.data.curr_index,1)
                    if (prevPage.data.list.length == 0) {
                        prevPage.setData({
                            isShow: false
                        });
                    }
                    prevPage.setData({
                        list: prevPage.data.list
                    });
                    setTimeout(function () {
                        wx.navigateBack({})
                    },1500)
                }

            }
        })
        // console.log(that.data.eva)
    },
    uploadFile: function () {
        if (this.data.eva.content == '') {
            common.info('请输入评价内容')
            return false
        }
        if(this.data.image.length == 0){
            this.submit()
            return false
        }
        var length = this.data.image.length
        var num = 0
        var that = this;
        for(var i = 0;i < length;i++){
            common.ajax({
                url: 'Index/uploadFileSingle',
                data: {},
                file: {
                    name: 'image',
                    path: that.data.image[i].toString()
                },
                loading: '加载中...',
                userinfo: true,
                success: function (res) {
                    num++
                    var list = that.data.uploadList
                    list.push(JSON.parse(res).result.image_relative_path)
                    that.setData({
                        uploadList: list
                    })
                    if(num == length){
                        that.submit()
                    }
                }
            })
        }
    },
    delimage: function (e) {
        var curr_index = e.currentTarget.dataset.index
        this.data.image.splice(curr_index,1)
        this.setData({
            image:this.data.image
        })
    },
    selectimage: function () {
      var that = this
        var num = 9 - that.data.image.length
        wx.chooseImage({
            count: num, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.data.image = that.data.image.concat(tempFilePaths)
                that.setData({
                    image:that.data.image,
                    lengthimage:that.data.image.length
                })

            }
        })
    },
    evaluteinput: function (e) {
        var content = 'eva.content'
        this.setData({
            [content]:e.detail.value
        })
    },
  selectStar: function (e) {
      var star = 'eva.star'
     this.setData({
         curr_index:e.currentTarget.dataset.index,
         [star]:e.currentTarget.dataset.index
     })
  },
  onLoad: function (options) {
    var that = this;
    var order_no = 'eva.order_no'
    that.setData({
        info:JSON.parse(options.info),
        show: true,
        [order_no]:options.order_no
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