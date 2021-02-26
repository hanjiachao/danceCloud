// pages/liveClass/liveClass.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show:false,
      menuSta: false,
      info: {
          start: 0,
          limit: 4,
          type_id: '',
          content_id: '',
          teacher_id: '',
          key: ''
      },
      dance_type_list: [],
      training_content_list: [],
      teacher_list: [],
      dance_course_list: [],
      dancetypeSta: false,
      trainingSta: false,
      teacherSta: false,
      typename: '舞种',
      dancename:'训练内容',
      teachername:'教师',
      refreash: true,
      nolivesta: true
  },
    menuHiden: function () {
        this.setData({
            dancetypeSta:false,
            trainingSta: false,
            teacherSta: false
        })
    },
    danceClick: function (e) {
        var start ='info.start'
        this.setData({
            [start]: 0,
            refreash: true,
            nolivesta:true
        })
        if (e.currentTarget.dataset.name == '舞种') {
            var type_id = 'info.type_id'
            this.setData({
                [type_id]: e.currentTarget.dataset.id,
                typename: e.currentTarget.dataset.classname,
                dance_course_list: []
            })
            if (e.currentTarget.dataset.id == 0) {
               this.setData({
                   typename:'舞种'
               })
            }
            this.liveclass()
        } else if (e.currentTarget.dataset.name == '训练内容') {
            var content_id = 'info.content_id'
            this.setData({
                [content_id]: e.currentTarget.dataset.id,
                dancename:e.currentTarget.dataset.classname,
                dance_course_list: []
            })
            if (e.currentTarget.dataset.id == 0) {
                this.setData({
                    dancename:'训练内容'
                })
            }
            this.liveclass()
        } else{
            var teacher_id = 'info.teacher_id'
            this.setData({
                [teacher_id]: e.currentTarget.dataset.id,
                teachername: e.currentTarget.dataset.classname,
                dance_course_list: []
            })
            if (e.currentTarget.dataset.id == 0) {
                this.setData({
                    teachername:'教师'
                })
            }
            this.liveclass()
        }
    },
  dancetype: function (e) {
    console.log(e.currentTarget.dataset.name)
    if (e.currentTarget.dataset.name == '舞种') {
       this.setData({
           dancetypeSta: true,
           trainingSta: false,
           teacherSta: false
       })
    } else if (e.currentTarget.dataset.name == '训练内容') {
        this.setData({
            dancetypeSta: false,
            trainingSta: true,
            teacherSta: false
        })
    } else{
        this.setData({
            dancetypeSta: false,
            trainingSta: false,
            teacherSta: true
        })
    }
  },
  liveclass: function () {
      var that = this
      common.ajax({
          url: 'DanceCourse/getList',
          data: that.data.info,
          loading: '加载中...',
          success: function (res) {
              that.setData({
                  show:true
              })
              if (res.status != 'SUCCESS') {
                  wx.showToast({
                      title: res.result.msg,
                      icon: 'none'
                  })
              } else {
                  if (that.data.info.start == 0) {
                    that.setData({
                        dance_type_list:res.result.dance_type_list,
                        training_content_list:res.result.training_content_list,
                        teacher_list:res.result.teacher_list,
                    })
                      that.data.dance_type_list.unshift({
                          type_id:'',
                          type_name: '全部'
                      })
                      that.data.training_content_list.unshift({
                          content_id:'',
                          content_name: '全部'
                      })
                      that.data.teacher_list.unshift({
                          teacher_id:'',
                          content_name: '全部'
                      })
                      that.setData({
                          dance_type_list:that.data.dance_type_list,
                          training_content_list:that.data.training_content_list,
                          teacher_list:that.data.teacher_list,
                      })
                      if (res.result.dance_course_list.length == 0) {
                          that.setData({
                              nolivesta:false,
                              refreash: false
                          })
                      }
                  }
                  if (res.result.dance_course_list.length < that.data.info.limit) {
                     that.setData({
                         refreash: false
                     })
                  }
                  that.data.dance_course_list = that.data.dance_course_list.concat(res.result.dance_course_list)
                  var start = 'info.start'
                  that.setData({
                      dance_course_list: that.data.dance_course_list,
                      [start]:that.data.dance_course_list.length
                  })
              }
          }
      })
  },
    courseDetail: function (e) {
        wx.navigateTo({
            url:'../liveDetail/liveDetail?dc_id=' + e.currentTarget.dataset.id
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      wx.setNavigationBarTitle({
          title: '直播课程'
      });
      that.liveclass()
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
    console.log(this.data.refreash)
     if (this.data.refreash){
       this.liveclass();
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})