//app.js
var common = require("utils/util.js");

App({
  getOpenid: function (share_code) {
      var that = this;
      wx.login({
          success: function(res) {
              if (res.code) {
                  common.ajax({
                      url: 'Login/getOpenid',
                      data: {code:res.code},
                      userinfo: false,
                      success: function (res) {
                          if (res.status == 'SUCCESS') {
                              that.globalData.openid = res.result.openid;
                              that.globalData.openid2 = res.result.openid;
                              if (res.result.access_token == '') {
                                  that.loginAjax(res.result.openid)
                              } else {
                                  common.set_userinfo(res.result)
                                  // wx.switchTab({
                                  //     url: '/pages/index/index'
                                  // })
                                wx.switchTab({
                                  url: '../index/index',
                                })
                              }
                              // if (res.result.binding_status) {
                              //     common.set_userinfo(res.result)
                              //     wx.switchTab({
                              //         url: '/pages/index/index'
                              //     })
                              // } else {
                              //     if (share_code != '') {
                              //        var param = {
                              //            'share_code':share_code
                              //        }
                              //         common.redirect_to('/pages/login/login',param)
                              //     } else {
                              //         common.redirect_to('/pages/login/login')
                              //     }
                              // }
                          } else {
                          }
                      }
                  })
              } else {
                  console.log('登录失败')
              }
          }
      });
  },
   loginAjax: function (openid) {
      var that = this
       console.log(that.globalData.userInfo)
       common.ajax({
           url: 'Login/miniLogin',
           data: {
               openid: openid,
               headimg: that.globalData.userInfo.avatarUrl,
               nickname: that.globalData.userInfo.nickName,
           },
           userinfo: false,
           success: function (res) {
               if (res.status == 'SUCCESS') {
                   that.globalData.openid = res.result.openid;
                   that.globalData.openid2 = res.result.openid;
                   if (res.result.access_token == '') {
                       that.loginAjax(res.result.openid)
                   } else {
                       common.set_userinfo(res.result)
                      //  wx.switchTab({
                      //      url: '/pages/index/index'
                      //  })
                     wx.switchTab({
                       url: '../index/index',
                     })
                   }
               } else {
               }
           }
       })
   },
  onLaunch: function () {
    // 登录
    // //
      var that = this;
      if (common.get_userinfo()) {
          // common.redirect_to('/pages/index/index')
          // wx.switchTab({
          //     url: '/pages/index/index'
          // })
        wx.switchTab({
          url: '../index/index',
        })
      }
      /*var that = this
      if (that.globalData.hx_show) {
          WebIM.conn.close()
          wx.login({
              success: function (res) {
                  if (res.code) {
                      wx.getUserInfo({
                          success: function (data) {
                              that.globalData.userInfo = data.userInfo
                              common.user_info({code:res.code,type:'微信',source:'小程序',user_info:JSON.stringify(data.userInfo)},function (openid) {
                                  that.globalData.openids = openid.openid
                                  that.globalData.user_code = openid.user_code
                                  that.globalData.token = openid.token
                                  that.globalData.status_wx = openid.binding_status
                                  wx.setStorage({
                                      key:"token",
                                      data:openid.token
                                  })
                                  if (!openid.binding_status){
                                      wx.navigateTo({
                                          url: '../register/register'
                                      })
                                  } else {
                                      common.user_huanxin({token:openid.token},function (res){
                                          var options = {
                                              apiUrl: WebIM.config.apiURL,
                                              user: res.hx_username,
                                              pwd: res.hx_password,
                                              grant_type: that.globalData.grant_type,
                                              appKey: WebIM.config.appkey
                                          }
                                          wx.setStorage({
                                              key: "myUsername",
                                              data: res.hx_username
                                          })
                                          WebIM.conn.open(options)
                                      })
                                  }
                              })
                          },
                          fail: function (failData) {
                              console.info("用户拒绝授权");
                          }
                      });
                  } else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                  }
              }
          })
      }*/

    // 获取用户信息
   /* wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })*/
  },
    globalData: {
        timer: 'timer',
        longitude:'',
        latitude:'',
        lng:'',
        lat:'',
        address:'',
        userInfo: null,
        openid: '',
        openid2: '',
        user_code: '',
        status_wx: '',
        songInfo: null,
        playIndex: 0, //当前播放列表的index
        currentTime: 0, //当前播放时间
        duration: 0, //总时长
        version: '4.0.2',
        token: '4b25fba236bce46d796925426a6992f8',
        url: 'https://wyxt.chenchaoweb.cn/index.php/Home/'
  }
})