// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:"定位",
    swiperimages:[],   //轮播图
    bottom_data: [
      { title: '美食饮品', icon: 'deliciousfood.png' },
      { title: '休闲娱乐', icon: 'entertainment.png' },
      { title: '旅游酒店', icon: 'travel.png' },
      { title: '生活学习', icon: 'service.png' },
      { title: '好物优选', icon: 'shopping.png' }
    ],
    scrolltext:["爆品热销","离我最近","推荐专区","购买最多","特惠上新","分享推荐","即将下架"],
    // current: 0,  // 当前项目
    itemselect:[],
    cid: 0,   //文字导航栏判断值
    product:[],   //商品详情存储变量
    cachetime:0   //缓存时间，用来判断是不是当天，如果是当天就用缓存的数据，文字导航栏的商品信息就从缓存里面获取不会点击一次内容变一次，如果不是当天就清空缓存重新获取
  },
  // 获取轮播图数据函数，可以用id来作为key来缓存数据，用时间来判断是否先清空缓存获取新缓存,轮播图不需要做缓存
  getswiperdata(){
    var that = this
    var date = new Date();
    var ondata = date .toLocaleDateString();
    console.log(ondata)
    console.log(that.data.cachetime)

    if( ondata==that.data.cachetime){
      console.log(11111)
      wx.getStorage({
        key:rchart,
        success:(data)=>{
          console.log(data)
          this.setData({
            swiperimages:data
          })
          console.log("从缓存拉取数据")
          console.log(that.data.swiperimages)
        },
        fail:(err)=>{
          let db=wx.cloud.database({
            env:"cloud1-7gs68okw98d2ff41"
          });
          db.collection('swiper_images').get().then(res=>{
            this.setData({
              swiperimages:res.data
            })
            wx.setStorage({
              key:rchart,
              data:res.data
            })
            console.log("重新获取数据存入缓存")  
          })
        }
      })
    }else{
      console.log(1222)
      wx.removeStorage({
        key: 'rchart',
        success (res) {
          console.log(res)
        }
      })
      console.log(ondata)
      this.setData({
        setdata:ondata
      })
      console.log(that.data.setdata)
      let db=wx.cloud.database({
        env:"cloud1-7gs68okw98d2ff41"
      });
      db.collection('swiper_images').get().then(res=>{
        this.setData({
          swiperimages:res.data
        })
        wx.setStorage({
          key:'rchart',
          data:res.data
        })
      }) 
      console.log("重新获取数据存入缓存2")
    }
  },
  // 产品套餐主要信息栏云数据库获取信息函数，获取数据需要做缓存
  getproductdata(event){
    // 在wx.request中调用小程序中定义的data中的数据，我通过网上搜索资料发现this打点进行调用，发现不可行，会出现data没有定义的情况，后来我使用这种方式才成功的调用
    var that = this
    let id=event.target.dataset.id;
    // console.log(event.target.dataset.id)
    this.setData({
      cid:id
    })
    let db=wx.cloud.database({
      env:"cloud1-7gs68okw98d2ff41"
    }); 
    var date = new Date();
    var ondata = date .toLocaleDateString();
    // cid是文字导航栏判断条件，0代表爆品推荐，1代表离我最近，是wxml绑定的data-id，下标，这里必须写缓存，不然每点一下都要读数据库，而且爆品推荐没连接一次数据库数据都是随机的，还要进行分页加载
    // 获取缓存的时间，并设置cachetime为缓存的时间
    // 如果时间和当前时间不一样就说明不是同一天，就需要把商品缓存清空，重新获取，时间缓存也要重新set
    /* if( ondata!=that.data.cachetime){
      console.log("清空缓存")
      for(var i=0; i<7; i++){
        wx.removeStorage({
          key: i+'',
          success (res) {
            console.log(res)
          }
        });
      }
      wx.setStorage({
        key:"cachedata",
        data:ondata
        })
      this.setData({
        cachetime:ondata
      })
    } */
    // 爆品热销，随机从数据库获取，不能每天都是获取前面的数据都不变
    if(that.data.cid==0){
      // 判断当前时间和缓存时间是否相同，不相同就说明不是在当天，需要清空商品缓存从小获取商品信息，不然每天都显示的是一样的商品
      console.log(that.data.cachetime)
      console.log(ondata)
      // 如果有缓存时间就获取到，可以判断缓存的商品信息product是否需要缓存获取信息。如果没有缓存就设置缓存，那if判断是同一天就跳过不需要清空product缓存
      // 获取缓存
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          // 从表中随机获取商品
          db.collection('Commodity_package').aggregate().sample({size: 4
          }).end().then(  res => {
            this.setData({
              product:res.list
            })
            // 设置缓存
            console.log("添加缓存")
            wx.setStorage({
              key:that.data.cid+'',
              data:res.list
            })
          })
        }
      })
    }else if(that.data.cid==1){
      console.log(that.data.cachetime)
      console.log(ondata)
      /* if( ondata!=that.data.cachetime){
        console.log("清空缓存")
        wx.removeStorage({
          key: that.data.cid+'',
          success (res) {
            console.log(res)
          }
        })
        wx.setStorage({
          key:"cachedata",
          data:ondata
          })
        this.setData({
          cachetime:ondata
        })
      } */
      /* wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{ */
      // 获取用户的定位经纬度,这个获取定位应该放在生命周期里面
          wx.getLocation({
            altitude: 'altitude',
            success(res){
              console.log(111)
              // 计算定位和各店铺的距离
              const $ = db.command.aggregate
              db.collection('Commodity_package').aggregate()
                .geoNear({
                  distanceField: 'distance', // 输出的每个记录中 distance 即是与给定点的距离
                  spherical: true,
                  near: db.Geo.Point(res.longitude, res.latitude),
                }).end().then(res=>{
                  // 距离：m转化成km
                  res.list.forEach(item=>{
                    // item.distance =(item.distance/1000).toFixed(2) 千米/1000
                    console.log(item.distance)
                    if(item.distance<1000){item.distance =(item.distance).toFixed(0)+'m'}else{item.distance =(item.distance/1000).toFixed(2)+'km'}
                  })
                  console.log(res)
                  that.setData({
                    product:res.list
                  })
                  wx.setStorage({
                    key:that.data.cid+'',
                    data:res.list
                  })
                  console.log("缓存内容")
                })
            },
            fail(){console.log("定位失败，请确保已授权获取位置信息")}
          })
      //   }
      // })
    }else if(that.data.cid==2){
      /* if( ondata!=that.data.cachetime){
        console.log("清空缓存")
        wx.removeStorage({
          key: that.data.cid+'',
          success (res) {
            console.log(res)
          }
        })
        wx.setStorage({
          key:"cachedata",
          data:ondata
          })
        this.setData({
          cachetime:ondata
        })
        } */
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          const _ = db.command
          db.collection('Commodity_package').aggregate()
          .sort(
            {Share: -1}
          ).end().then(res=>{
            console.log(res)
            this.setData({
              product:res.list
            })
            wx.setStorage({
              key:that.data.cid+'',
              data:res.list
            })
            console.log("录入缓存")
          })
        }
      })
    } 
    else if(that.data.cid==3){
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          // 购买数量Purchasequantity不等于0就说明有人购买
          const _ = db.command
          db.collection('Commodity_package').where({ Purchasequantity: _.neq(0) }).get().then(res=>{
            console.log(res)
            this.setData({
              product:res.data
            })
            wx.setStorage({
              key:that.data.cid+'',
              data:res.data
            })
          })
        }
      })  
    }else if(that.data.cid==4){
      console.log(33)
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          // OnlineTime上架时间-1倒序显示，前面就是显示最新上架的商品信息
          const _ = db.command
          db.collection('Commodity_package').aggregate()
          .sort(
            {OnlineTime: -1}
          ).end().then(res=>{
            console.log(res)
            this.setData({
              product:res.list
            })
            wx.setStorage({
              key:that.data.cid+'',
              data:res.list
            })
          })
        }
      })  
    }else if(that.data.cid==5){
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          const _ = db.command
          db.collection('Commodity_package').aggregate()
          .sort(
            {Share: -1}
          ).end().then(res=>{
            console.log(res)
            this.setData({
              product:res.list
            })
            wx.setStorage({
              key:that.data.cid+'',
              data:res.list
            })
          })
        }
      })  
    }else{
      wx.getStorage({
        key:that.data.cid+'',
        success:(data)=>{
          console.log("获取缓存")
          this.setData({
            product:data.data
          })
        },
        fail:(err)=>{
          const _ = db.command
          db.collection('Commodity_package').aggregate()
          .sort(
            {Share: 1}
          ).end().then(res=>{
            console.log(res)
            this.setData({
              product:res.list
            })
            wx.setStorage({
              key:that.data.cid+'',
              data:res.list
            })
          })
        }
      })  
    }
    // wx.cloud.callFunction({
    //   name:'getproductdata'
    // }).then(res=>{
    //   console.log(res.result.data)
    //   this.setData({
    //     product:res.result.data
    //   })
    // })
  },

  // 获取爆品热销并展示并清空所有的缓存数据，的函数
  getexplosiveproducts(){
    var date = new Date();
    var ondata = date .toLocaleDateString();
    /* if( ondata!=this.data.cachetime){
      console.log("清空缓存")
      for(var i=0; i<7; i++){
        wx.removeStorage({
          key: i+'',
          success (res) {
            console.log(res)
          }
        });
      }
    } */

    wx.getStorage({
      key:"cachedata",
      success:(data)=>{
        console.log("获取时间缓存")
        this.setData({
          cachetime:data.data
        })
        let db=wx.cloud.database({
          env:"cloud1-7gs68okw98d2ff41"
        }); 
        // 如果有缓存则要判断时间是否同一天，不是同一天就不能用缓存数据，需要清空缓存
        if( ondata!=this.data.cachetime){
          console.log("清空所有缓存")
          wx.clearStorage()
          /* for(var i=0; i<7; i++){
            wx.removeStorage({
              key: i+'',
              success (res) {
                console.log(res)
              }
            });
          } */
          /* wx.removeStorage({
            key: 0+'',
            success (res) {
              console.log(res)
            }
          }); */
          db.collection('Commodity_package').aggregate().sample({size: 4
          }).end().then(  res => {
            this.setData({
              product:res.list
            })
            // 设置缓存
            console.log("添加sw缓存")
            wx.setStorage({
              key:0+'',
              data:res.list
            })
            wx.setStorage({
              key:"cachedata",
              data:ondata
              })
            this.setData({
              cachetime:ondata
            })
          })
          }else{
            wx.getStorage({
              key:0+'',
              success:(data)=>{
                console.log("获取缓存")
                this.setData({
                  product:data.data
                })
              },
              fail:(err)=>{
                // 从表中随机获取商品
                db.collection('Commodity_package').aggregate().sample({size: 4
                }).end().then(  res => {
                  this.setData({
                    product:res.list
                  })
                  // 设置缓存
                  console.log("添加缓存")
                  wx.setStorage({
                    key:0+'',
                    data:res.list
                  })
                })
              }
          })
        }
      },fail:(err)=>{
        wx.setStorage({
          key:"cachedata",
          data:ondata
        })
        this.setData({
          cachetime:ondata
        })
        console.log("缓存时间")
        let db=wx.cloud.database({
          env:"cloud1-7gs68okw98d2ff41"
        }); 
          db.collection('Commodity_package').aggregate().sample({size: 4
          }).end().then(  res => {
            this.setData({
              product:res.list
            })
            // 设置缓存
            console.log("添加商品0缓存")
            wx.setStorage({
              key:0+'',
              data:res.list
            })
          })
        }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getswiperdata()
    // 连接云数据库调用优选页面轮播图，注释是因为链接数据库次数不够用
    // let db=wx.cloud.database({
    //   env:"cloud1-7gs68okw98d2ff41"
    // });
    // db.collection('swiper_images').get().then(res=>{
    // this.setData({
    //   swiperimages:res.data
    // })
    // console.log(this.data.swiperimages[0].images)
    // })
    
    // 产品套装展示：调用函数获取云数据库数据
    this.getproductdata()

    // 程序启动时调用云函数就可以获取数据，做上拉分页加载，数据随机显示
    // wx.cloud.callFunction({
    //   name:'getproductdata'
    // }).then(res=>{
    //   // console.log(res)
    //   // console.log(res.result.list)
    //   this.setData({
    //     product:res.result.list
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 如果有缓存时间就获取到，可以判断缓存的商品信息product是否需要缓存获取信息。如果没有缓存就设置缓存，那if判断是同一天就跳过不需要情况product缓存
    this.getexplosiveproducts()
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








// //index.js
// const app = getApp()
// const { envList } = require('../../envList.js')

// Page({
//   data: {
//     showUploadTip: false,
//     powerList: [{
//       title: '云函数',
//       tip: '安全、免鉴权运行业务代码',
//       showItem: false,
//       item: [{
//         title: '获取OpenId',
//         page: 'getOpenId'
//       },
//       //  {
//       //   title: '微信支付'
//       // },
//        {
//         title: '生成小程序码',
//         page: 'getMiniProgramCode'
//       },
//       // {
//       //   title: '发送订阅消息',
//       // }
//     ]
//     }, {
//       title: '数据库',
//       tip: '安全稳定的文档型数据库',
//       showItem: false,
//       item: [{
//         title: '创建集合',
//         page: 'createCollection'
//       }, {
//         title: '更新记录',
//         page: 'updateRecord'
//       }, {
//         title: '查询记录',
//         page: 'selectRecord'
//       }, {
//         title: '聚合操作',
//         page: 'sumRecord'
//       }]
//     }, {
//       title: '云存储',
//       tip: '自带CDN加速文件存储',
//       showItem: false,
//       item: [{
//         title: '上传文件',
//         page: 'uploadFile'
//       }]
//     }, {
//       title: '云托管',
//       tip: '不限语言的全托管容器服务',
//       showItem: false,
//       item: [{
//         title: '部署服务',
//         page: 'deployService'
//       }]
//     }],
//     envList,
//     selectedEnv: envList[0],
//     haveCreateCollection: false
//   },

//   onClickPowerInfo(e) {
//     const index = e.currentTarget.dataset.index
//     const powerList = this.data.powerList
//     powerList[index].showItem = !powerList[index].showItem
//     if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
//       this.onClickDatabase(powerList)
//     } else {
//       this.setData({
//         powerList
//       })
//     }
//   },

//   onChangeShowEnvChoose() {
//     wx.showActionSheet({
//       itemList: this.data.envList.map(i => i.alias),
//       success: (res) => {
//         this.onChangeSelectedEnv(res.tapIndex)
//       },
//       fail (res) {
//         console.log(res.errMsg)
//       }
//     })
//   },

//   onChangeSelectedEnv(index) {
//     if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
//       return
//     }
//     const powerList = this.data.powerList
//     powerList.forEach(i => {
//       i.showItem = false
//     })
//     this.setData({
//       selectedEnv: this.data.envList[index],
//       powerList,
//       haveCreateCollection: false
//     })
//   },

//   jumpPage(e) {
//     wx.navigateTo({
//       url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
//     })
//   },

//   onClickDatabase(powerList) {
//     wx.showLoading({
//       title: '',
//     })
//     wx.cloud.callFunction({
//       name: 'quickstartFunctions',
//       config: {
//         env: this.data.selectedEnv.envId
//       },
//       data: {
//         type: 'createCollection'
//       }
//     }).then((resp) => {
//       if (resp.result.success) {
//         this.setData({
//           haveCreateCollection: true
//         })
//       }
//       this.setData({
//         powerList
//       })
//       wx.hideLoading()
//     }).catch((e) => {
//       console.log(e)
//       this.setData({
//         showUploadTip: true
//       })
//       wx.hideLoading()
//     })
//   }
// })
