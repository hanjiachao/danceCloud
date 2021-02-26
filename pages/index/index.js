// pages/aboutUs/aboutUs.js
var common = require("../../utils/util.js");
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background_music: '',
        banner_list: [],
        dance_course_list: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        show: false,
        dance_group_list:[],
        limit: 3,
        start:0,
        refresh: true,
        animationData: {},
        musicStatus: false,
        rotate: 0,
        ajaxshoping:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    startMusic: function () {
        backgroundAudioManager.title = '舞云'
        backgroundAudioManager.src = this.data.background_music
        backgroundAudioManager.startTime = backgroundAudioManager.currentTime
        backgroundAudioManager.onEnded(()=>{
             this.startMusic()
        })
    },
    pauseMusic: function () {
        backgroundAudioManager.pause()
    },
    startAnimation: function () {
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear'
        })
        var n = 0;
        var m = true;
        var rotate = this.data.rotate
        var music = setInterval(function () {
            if(!this.data.musicStatus){
                clearInterval(music)
                return false
            }
            n++;
            if(m){
                animation.rotate(rotate + 36 * (n)).step()
                m = !m;
                this.setData({
                    rotate: rotate + 36 * n
                })
            } else {
                animation.rotate(rotate + 36 * (n)).step()
                m = !m;
                this.setData({
                    rotate: rotate + 36 * n
                })
            }
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 300)
    },
    music: function () {
        if(this.data.musicStatus){
            this.setData({
                musicStatus: false
            })
            this.pauseMusic()
            return false
        }else{
            this.setData({
                musicStatus: true
            })
            this.startAnimation()
            this.startMusic()
        }
    },
    searchlive:function () {
        wx.navigateTo({
            url:'../searchlive/searchlive'
        })
    },
    collagedetail: function (e) {
        wx.navigateTo({
            url:'../collagedetail/collagedetail?dg_id=' + e.currentTarget.dataset.id
        })
    },
    courseDetail: function (e) {
        if (e.currentTarget.dataset.type == '课程') {
            wx.navigateTo({
                url:'../liveDetail/liveDetail?dc_id=' + e.currentTarget.dataset.id
            })
        } else {
            if (e.currentTarget.dataset.dg_status == '已参团'){
                wx.navigateTo({
                    url:'../coll-detail/coll-detail?order=' + e.currentTarget.dataset.order_no
                })
            } else {
                wx.navigateTo({
                    url:'../groupDetail/groupDetail?dg_id=' + e.currentTarget.dataset.id
                })
            }
        }
    },
    groupdance: function (slience) {
        var that = this
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        common.ajax({
            url: 'DanceCourse/index',
            data: {
                limit: that.data.limit,
                start: that.data.start
            },
            loading: slience,
            userinfo:true,
            success: function (res) {
                that.setData({
                    show: true,
                    ajaxshoping:true
                })
                if (slience == ''){
                    wx.stopPullDownRefresh()
                }
                if (res.status != 'SUCCESS') {
                    wx.showToast({
                        title: res.result.msg,
                        icon: 'none'
                    })
                } else {
                    if (that.data.start == 0) {
                        var bannerimg = []
                        for (var i=0;i<res.result.banner_list.length;i++) {
                            bannerimg[i] = res.result.banner_list[i].ba_image
                        }
                        that.setData({
                            background_music:res.result.background_music,
                            banner_list:bannerimg,
                            dance_course_list:res.result.dance_course_list
                        })
                    }
                    if (res.result.dance_group_list.length < that.data.limit) {
                       that.setData({
                           refresh: false
                       })
                    }
                    that.data.dance_group_list = that.data.dance_group_list.concat(res.result.dance_group_list)

                    that.setData({
                        dance_group_list: that.data.dance_group_list,
                        start:that.data.dance_group_list.length
                    })

                }
            }
        })
    },
    onLoad: function (options) {
        var that = this
        wx.setNavigationBarTitle({
            title: '首页'
        });
        that.groupdance('加载中...');
    },
    loadmore: function () {
        wx.navigateTo({
            url:'../liveClass/liveClass'
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
            refresh:true,
            start: 0,
            dance_group_list:[]
        })
        this.groupdance('');
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
       if (this.data.refresh) {
          this.groupdance('加载中....');
       }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
    }
})
