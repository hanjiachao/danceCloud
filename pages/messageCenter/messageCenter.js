var common = require("../../utils/util.js");
Page({
    data: {
        startX: 0, //开始坐标
        startY: 0,
        lastId: '',
        limit: 15,
        list: [],
        refresh: true,
        isShow: false,
        ajaxshoping:true
    },

    detail: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../news-detail/news-detail?id=' + id
        })
    },
    reload: function () {
        this.setData({
            lastId: '',
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
        common.ajax({
            url: 'User/getMyNewsList',
            data: {
                last_id: that.data.lastId,
                limit: that.data.limit
            },
            // loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    if (that.data.lastId == '') {
                        that.setData({
                            list: res.result.list,
                            isShow: true
                        })
                        if (res.result.list.length > 0) {
                            that.setData({
                                lastId: res.result.list[res.result.list.length - 1].ne_id
                            })
                        }
                    } else {
                        if (res.result.list.length > 0) {
                            var list = that.data.list
                            for (var i = 0; i < res.result.list.length; i++) {
                                list.push(res.result.list[i])
                            }
                            that.setData({
                                list: list,
                                lastId: res.result.list[res.result.list.length - 1].ne_id
                            })
                        }
                    }
                    if (res.result.list.length < that.data.limit) {
                        that.setData({
                            refresh: false
                        })
                    }
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    onLoad: function () {

    },
    onShow: function () {
        this.reload()
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.list.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            list: this.data.list
        })
    },
    //滑动事件处理
    touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index,//当前索引
            startX = that.data.startX,//开始X坐标
            startY = that.data.startY,//开始Y坐标
            touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
            //获取滑动角度
            angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        that.data.list.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        //更新数据
        that.setData({
            list: that.data.list
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    //删除事件
    del: function (e) {
        var id = e.target.dataset.id
        var index = e.currentTarget.dataset.index
        var list = this.data.list
        var that = this;
        common.ajax({
            url: 'User/delNews',
            data: {
                ne_id: id
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    list.splice(index, 1)
                    that.setData({
                        list: list
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            refresh: true,
            lastId: ''
        });
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
})