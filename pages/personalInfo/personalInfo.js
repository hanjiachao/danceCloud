// pages/personalInfo/personalInfo.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        showMobile: '',
        name: '',
        imgUrl: ''
    },
    name: function () {
        wx.navigateTo({
            url: '../name/name'
        })
    },
    myAddress: function () {
        wx.navigateTo({
            url: '../addressBook/addressBook'
        })
    },
    bindmobile: function () {
        wx.navigateTo({
            url: '../login/login'
        })
    },
    setPhoto: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    tempFilePaths: res.tempFilePaths,
                    imgUrl: res.tempFilePaths[0]
                });
                // console.log(res.tempFilePaths)
                wx.setStorage({ key: "card", data: tempFilePaths[0] })
                common.ajax({
                    url: 'Index/uploadFileSingle',
                    data: {},
                    file: {
                        name: 'image',
                        path: that.data.tempFilePaths[0]
                    },
                    loading: '加载中...',
                    userinfo: true,
                    success: function (res) {
                        that.setData({
                            cardImg: JSON.parse(res).result.image_absolute_path
                        });
                        //     //新ajax
                        common.ajax({
                            url: 'User/editUserData',
                            data: {
                                headimg: that.data.cardImg
                            },
                            loading: '',
                            userinfo: true,
                            success: function (res) {
                                if (res.status != 'SUCCESS') {
                                } else {
                                }
                            }
                        })

                    }
                })

            }
        })
    },
    editer: function () {
        wx.navigateTo({
            url: '../editerpersonal/editerpersonal'
        })
    },
    changeMobile: function () {
        wx.navigateTo({
            url: '../change-phone-number/change-phone-number?mobile=' + this.data.mobile + '&showMobile=' + this.data.showMobile
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            mobile: options.mobile,
            showMobile: options.showMobile,
            imgUrl: options.headimg
        })
        console.log(options.headimg)
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