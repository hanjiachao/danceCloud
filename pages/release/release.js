// pages/release/release.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList: [],
        uploadList: [],
        data: {},
        showChoice: false,
        type: '',
        width: 0,
        isShow: false,
        numList: []
    },

    submit: function () {
        if(this.data.type == 'img'){
            for(var i = 0;i < this.data.uploadList.length;i++){
                var item = 'data.image_'+(i+1)
                this.setData({
                    [item]: this.data.uploadList[i]
                })
            }
        }else if(this.data.type == 'video'){
            var item = 'data.video'
            this.setData({
                [item]: this.data.uploadList[0]
            })
        }
        var that = this
        console.log(that.data.data)
        common.ajax({
            url: 'Community/releasePost',
            data: that.data.data,
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    setTimeout(function () {
                        wx.navigateBack({})
                    }, 1500)
                }else{
                    common.info(res.result.msg)
                }
            }
        })
    },
    uploadFile: function () {
        if(!this.data.data.title){
            common.info('请输入内容')
            return false
        }
        if(this.data.imgList.length == 0){
            this.submit()
            return false
        }
        var length = this.data.imgList.length
        var num = 0
        var that = this;
        for(var index = 0;index < length;index++){
            common.ajax({
                url: 'Index/uploadFileSingle',
                data: {},
                file: {
                    name: 'image',
                    path: that.data.imgList[index]
                },
                loading: '加载中...',
                userinfo: true,
                success: function (res) {
                  console.log(res)
                    num++
                    var list = that.data.uploadList
                    list.push(JSON.parse(res).result.image_relative_path)
                    that.setData({
                        uploadList: list
                    })
                    if (num == length) {
                        that.submit()
                    }
                }
            })
        }
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={}
        var data = 'data.'+field
        temp_data[data]=e.detail.value
        this.setData(temp_data)
    },
    clear: function () {
        this.setData({
            imgList: [],
            data: {},
            type: ''
        })
    },
    choiceImg: function () {
        var that = this
        wx.chooseImage({
            count: 9 - that.data.imgList.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var list = that.data.imgList
                for(var i = 0;i < tempFilePaths.length;i++){
                    list.push(tempFilePaths[i])
                }
                that.setData({
                    imgList: list,
                    showChoice: false,
                    type: 'img'
                })
            }
        })
    },
    choiceVideo: function () {
        var that = this
        wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: 'back',
            success: function(res) {
                var tempFilePath = res.tempFilePath
                var list = that.data.imgList
                list.push(tempFilePath)
                that.setData({
                    imgList: list,
                    showChoice: false,
                    type: 'video'
                })
            }
        })
    },
    choice: function () {
        if(this.data.imgList.length > 0){
            this.choiceImg()
            return false
        }
        this.setData({
            showChoice: true
        })
    },
    hideChoice: function () {
        this.setData({
            showChoice: false
        })
    },
    del: function (e) {
        var index = e.target.dataset.index
        var list = this.data.imgList
        list.splice(index,1)
        this.setData({
            imgList: list
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                var width = (res.windowWidth - 60) * 0.297
                that.setData({
                    width: width,
                    isShow: true
                })
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