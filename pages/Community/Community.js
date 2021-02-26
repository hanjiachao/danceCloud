// pages/Community/Community.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameid:'',
        po_ids:'',
        limit: 10,
        endId: '',
        list: [],
        info: {},
        percent: 0,
        refresh: true,
        inputStatus: false,
        text: '',
        tid: '',
        rid: '',
        likeStatus: true,
        name: '',
        index: '',
        rName: '',
        isShow: false,
        width: 0,
        videoWidth: 0,
        ban_status:'',
        share_image:'',
        share_message:'',
        videoStatus:[],
        ajaxshoping:true,
        nameids:'',
        nameindex: '',
        isindex:'',
        flag:true,
        isdel: false,
        po_ids:'',
        po_index: ''
    },
    canceldel: function () {
       this.setData({
           isdel: false
       })
    },
    delAjax: function () {
        var that = this;
        common.ajax({
            url: 'Community/deletePost',
            data: {
                po_id: that.data.po_ids
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    console.log(that.data.po_index)
                    that.data.list.splice(that.data.po_index,1)
                    that.setData({
                        isdel: false,
                        list: that.data.list
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    groupshare: function (e) {
        if (e.currentTarget.dataset.po_dcid != 0) {
            wx.navigateTo({
                url: '../liveDetail/liveDetail?dc_id=' + e.currentTarget.dataset.po_dcid
            })
        } else if(e.currentTarget.dataset.po_dgid != 0){
            wx.navigateTo({
                url: '../groupDetail/groupDetail?dg_id=' + e.currentTarget.dataset.po_dgid
            })
        } else if(e.currentTarget.dataset.po_goid != 0){
            wx.navigateTo({
                url: '../shoppingDetail/shoppingDetail?go_id=' + e.currentTarget.dataset.po_goid
            })
        } else {
            return false
        }
    },
    endVideo: function (e) {
        var index = e.target.dataset.i
        var status = 'videoStatus[' + index + '].status'
        var time = 'videoStatus[' + index + '].time'
        this.setData({
            [status]: false,
            [time]: 0
        })
    },
    pauseVideo: function (e) {
        var index = e.target.dataset.i
        var timeStamp = e.timeStamp
        var status = 'videoStatus['+index+'].status'
        var time = 'videoStatus['+index+'].time'
        this.setData({
            [status]: false,
            [time]: timeStamp,
            nameids: ''
        })
    },
    startVideo: function (e) {
    },
    playVideo: function (e) {
        var index = e.target.dataset.i
        var item = 'videoStatus['+index+'].status'
        for(var i = 0;i < this.data.videoStatus.length;i++){
            if(this.data.videoStatus[i]){
                var video = 'videoStatus['+i+'].status'
                this.setData({
                    [video]: false
                })
            }
        }
        console.log(index)
        this.setData({
            [item]: true,
            nameids: e.target.dataset.id,
            nameindex: index
        })
    },
    comment: function () {
        var that = this;
        common.ajax({
            url: 'Community/comment',
            data: {
                po_id: that.data.tid,
                content: that.data.text,
                co_id: that.data.rid
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    if(res.result.score != ''){
                        var score = 'info.us_score'
                        var scorenum = parseInt(that.data.info.us_score) + parseInt(res.result.score)
                        that.setData({
                            [score]:scorenum
                        })
                        common.info('获得' +res.result.score + '分成长值')
                    } else {
                        common.info(res.result.msg)
                    }
                    var index = that.data.index
                    that.data.list[index].comment_list.push({
                        "co_id":  res.result.co_id,
                        "us_name": that.data.name,
                        "be_us_name": that.data.rName,
                        "content": that.data.text
                    })
                    that.setData({
                        list:that.data.list
                    })
                    console.log(res)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    hideInput: function () {
        this.setData({
            inputStatus: false
        })
    },
    delcommuntiy: function (e) {
        var po_id = e.target.dataset.id
        var po_index = e.target.dataset.index
        this.setData({
            po_ids: po_id,
            isdel: true,
            po_index: po_index
        })
    },
    showInput: function (e) {
        var tid = e.target.dataset.tid
        var rid = e.target.dataset.rid
        var index = e.target.dataset.index
        var name = e.target.dataset.name
        this.setData({
            inputStatus: true,
            tid: tid == undefined ? '' : tid,
            rid: rid == undefined ? '' : rid,
            index: index,
            rName: name == undefined ? '' : name
        })
    },
    like: function (e) {
        if (this.data.ban_status) {
            common.info('您已被禁言，禁止操作')
            return false
        }
        if(!this.data.likeStatus){
            return false
        }
        this.setData({
            likeStatus: false
        })
        var id = e.target.dataset.id
        var index = e.target.dataset.index
        var item = 'list['+index+'].zan_status'
        var num = 'list['+index+'].po_zan_num'
        var that = this;
        common.ajax({
            url: 'Community/postZan',
            data: {
                po_id: id
            },
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        [num]: that.data.list[index].zan_status ? parseInt(that.data.list[index].po_zan_num) - 1 : parseInt(that.data.list[index].po_zan_num) + 1,
                        [item]: !that.data.list[index].zan_status,
                        likeStatus: true
                    })
                    if (res.result.score != '') {
                        var score = 'info.us_score'
                        var scorenum = parseInt(that.data.info.us_score) + parseInt(res.result.score)
                        that.setData({
                            [score]:scorenum
                        })
                        common.info('获得' +res.result.score + '分成长值')
                    } else {
                        common.info(res.result.msg)
                    }
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    seeImg: function (e) {
        if (e.currentTarget.dataset.po_dcid != 0) {
            wx.navigateTo({
                url: '../liveDetail/liveDetail?dc_id=' + e.currentTarget.dataset.po_dcid
            })
        } else if(e.currentTarget.dataset.po_dgid != 0){
            wx.navigateTo({
                url: '../groupDetail/groupDetail?dg_id=' + e.currentTarget.dataset.po_dgid
            })
        } else if(e.currentTarget.dataset.po_goid != 0){
            wx.navigateTo({
                url: '../shoppingDetail/shoppingDetail?go_id=' + e.currentTarget.dataset.po_goid
            })
        } else {
            wx.previewImage({
                current: e.currentTarget.dataset.item,
                urls: e.currentTarget.dataset.src
            })
        }
    },
    release: function () {
        if (this.data.ban_status) {
            common.info('您已被禁言，禁止操作')
            return false
        }
        wx.navigateTo({
            url: '../release/release'
        })
    },
    clock: function () {
        wx.navigateTo({
            url: '../clock/clock'
        })
    },
    communityRule: function () {
        wx.navigateTo({
            url: '../communityRule/communityRule'
        })
    },
    getName: function () {
        var that = this;
        common.ajax({
            url: 'User/getUserData',
            data: {},
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        name: res.result.nickname
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    reload: function () {
        this.setData({
            endId: '',
            refresh: true
        })
        this.getList()
    },
    getList: function () {
        var that = this;
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        // common.info(that.data.nameid)
        common.ajax({
            url: 'Community/getPostList',
            data: {
                limit: that.data.limit,
                end_id: that.data.endId,
                po_id: that.data.nameid
            },
            // loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    that.setData({
                        ban_status:res.result.ban_status
                    })
                    if (that.data.endId == '') {
                        var percent = res.result.grade_info.us_score / res.result.grade_info.next_grade_score * 100
                        if(percent > 100){
                            percent = 100
                        }
                        if (res.result.list.length > 0) {
                            that.setData({
                                endId: res.result.list[res.result.list.length - 1].po_id
                            })
                        }
                        var videoStatus = []
                        for(var i = 0;i < res.result.list.length;i++){
                            if (res.result.list[i].imagevideo == undefined) {
                                var strlength = res.result.list[i].po_video.length;
                                res.result.list[i].imagevideo = res.result.list[i].po_video.substring(0,strlength-3) + 'png'
                            }
                            videoStatus.push({status: false,time: 0})
                        }

                        that.setData({
                            list: res.result.list,
                            info: res.result.grade_info,
                            percent: percent,
                            videoStatus: videoStatus
                        })
                        if (that.data.isindex != ''){
                            var index = that.data.isindex
                            var video = 'videoStatus['+ index+'].status'
                            that.setData({
                                [video]: true
                            })
                        }
                    } else {
                        if (res.result.list.length > 0) {
                            that.setData({
                                endId: res.result.list[res.result.list.length - 1].po_id
                            })
                            var list = that.data.list
                            for (var i = 0; i < res.result.list.length; i++) {
                                list.push(res.result.list[i])
                            }
                            var videoStatus = that.data.videoStatus
                            for(var i = 0;i < res.result.list.length;i++){
                                videoStatus.push({status: false,time: 0})
                            }
                            that.setData({
                                list: list,
                                videoStatus: videoStatus
                            })
                        }
                    }
                    if (res.result.list.length < that.data.limit) {
                        that.setData({
                            refresh: false
                        })
                    }
                } else {
                    return false
                    common.info(res.result.msg)
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        if (options.id) {
          that.setData({
            nameid: options.id
          })
        }
        if (options.tindex) {
          that.setData({
            isindex: options.tindex
          })
        }
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
        wx.getSystemInfo({
            success: function (res) {
                var width = (res.windowWidth - 90) * 0.297
                var videoWidth = (res.windowWidth - 90) * 0.665
                that.setData({
                    width: width,
                    videoWidth: videoWidth,
                    isShow: true
                })
            }
        })

        this.getName()
        // this.reload()
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
        // wx.getLaunchOptionsSync()
        this.reload()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      this.setData({
        nameid: '',
        isindex: ''
      })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.reLaunch()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.reload()
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
    onShareAppMessage: function (e) {
      var that = this
      var tid = ''
      var tindex = ''
      if (that.data.nameids != ''){
        tid = ''
        tindex = that.data.nameindex
      } else {
        tid = e.target.dataset.id
        tindex = ''
      }
      return {
        title: that.data.share_message,
        path: "/pages/Community/Community?id="  + tid + '&tindex=' + tindex,
        imageUrl: that.data.share_image
      }
    }
})