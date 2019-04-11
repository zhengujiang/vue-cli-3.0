<template>
  <div class="collect-sub-item" :style="{height:height+'px'}">
    <div class="collect-cell" :style="{height:height+'px'}">
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="(list,index) in subscriptionList" :key="index">
          <div slot="right-menu" class="btn-box">
            <swipeout-button :background-color="'#ff7250'" @click.native="onOffClick(0,index)">删除</swipeout-button>
          </div>
          <div slot="content" class="infinite">
            <div class="card-box" @click="toCollectDetail(0, index)">
              <p class="title">{{list.favourite.favouriteName}}</p>
              <ul class="vux-1px-t">
                <li>
                  <div>
                    <img :src="category.statute" alt="">
                    <span>{{list.favourite.lawCount}}</span>
                  </div>
                  <div>
                    <img :src="category.notice" alt="">
                    <span>{{list.favourite.caseCount}}</span>
                  </div>
                  <div>
                    <img :src="category.reportIcon" alt="">
                    <span>{{list.favourite.reportCount}}</span>
                  </div>
                  <div v-if="!(isTestUser == 2)">
                    <img :src="category.qaIcon" alt="">
                    <span>{{list.favourite.qaCount}}</span>
                  </div>
                </li>
                <li class="data">
                  <span>{{$const.format(list.favourite.createTime)}}</span>
                </li>
              </ul>
            </div>
          </div>
        </swipeout-item>
        <swipeout-item transition-mode="follow" v-for="(list,index) in collectGroom" :key="list.favouriteId">
          <div slot="right-menu" class="btn-box">
            <swipeout-button :background-color="'#ff7250'" @click.native="onOffClick(1,index)">删除</swipeout-button>
          </div>
          <div slot="content" class="infinite">
            <div class="card-box" @click="toCollectDetail(1, index)">
              <p class="title">{{list.title}}</p>
              <ul class="vux-1px-t">
                <li>
                  <div>
                    <img :src="category.statute" alt="">
                    <span v-if="list.countList.length !== 0 && list.countList[0].type && list.countList[0].type=='law'">
                           {{ list.countList[0] ? list.countList[0].num : 0 }}</span>
                    <span v-else>{{ list.countList[1] ? list.countList[1].num : 0 }}</span>
                  </div>
                  <div>
                    <img :src="category.notice" alt="">
                    <span
                      v-if="list.countList.length !== 0 && list.countList[0].type && list.countList[0].type=='announcement'">
                             {{ list.countList[0] ? list.countList[0].num : 0 }}
                         </span>
                    <span v-else>{{ list.countList[1] ? list.countList[1].num : 0 }}</span>
                  </div>
                  <div>
                    <img :src="category.reportIcon" alt="">
                    <span>0</span>
                  </div>
                  <div v-if="!(isTestUser == 2)">
                    <img :src="category.qaIcon" alt="">
                    <span>0</span>
                  </div>
                </li>
                <li class="data">
                  <span>{{$const.format(list.releaseTime)}}</span>
                </li>
              </ul>
            </div>
          </div>
        </swipeout-item>
      </swipeout>
      <p class="infinite-loading">
        <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
      </p>
    </div>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    <transition name="fade">
      <div class="collect-bottom" v-show="bottomShow" @click="ToAds">{{collectBottom}}</div>
    </transition>
  </div>
</template>

<script>
  import {Popup, Swipeout, SwipeoutButton, SwipeoutItem, TransferDom} from 'vux'
  import XiaoanWarning from '@/components/warning/warning'

  export default {
    name: "collect-sub-item",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning,
      Popup
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        allLoaded: false,
        bottomShow: true,
        setIndex: 0,
        warning: {
          top: '25%',
          show: true,
          img: this.$image.warning.collectjingxuan,
          text: '您暂时还没有订阅！',
          btnText: ''
        },
        collectBottom: "订阅更多精彩内容，点击前往精选！",//精选遮罩
        subscriptionList: [],
        collectGroom: [],
        category: {
          notice: this.$image.collect.statute,
          statute: this.$image.collect.notice,
          reportIcon: this.$image.report.reportCollect,
          qaIcon: this.$image.collect.qa,
        },
        isTestUser: 0
      }
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.apiUserHome();
        this.getSubscriptionList();
        this.getUserCollectRecommend();
      }
    },
    mounted() {
      setTimeout(() => {
        this.bottomShow = false;
      }, 5000)
    },
    watch: {
      active: function (val) {
        if (val == 2) {
          this.setIndex = 0;
          this.getSubscriptionList();
          this.getUserCollectRecommend();
        }
      },
      setIndex: function (val) {
        console.log(val);
        if (val == 2) {
          if ((this.collectGroom == null || this.collectGroom.length == 0) && this.subscriptionList == null) {
            this.warning.show = true;
          } else if ((this.collectGroom == null || this.collectGroom.length == 0) && this.subscriptionList.length == 0) {
            this.warning.show = true;
          } else {
            this.warning.show = false;
          }
        }
      }
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            // let isTestUser = data.testUser;
            // if (isTestUser == false) {
            //   // 非测试用户
            //   this.isTestUser = 2;
            // }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({
              text: res.data.returnCode + res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      toCollectDetail(type, index) {
        switch (type) {
          case 0:
            // 发送到详情也去
            this.$router.push({
              path: '/collect/collectDetails',
              query: {
                id: this.subscriptionList[index].favourite.id,
                uuid: this.subscriptionList[index].favourite.shareKey
              }
            });
            break;
          case 1:
            this.$nextTick(() => {
              this.$router.push({
                path: '/collectGroom',
                query: {id: this.collectGroom[index].id, title: this.collectGroom[index].title}
              });
            });
            break;
        }
      },
      //
      ToAds() {
        this.$router.push({path: '/ads'});
      },
      // 删除
      onOffClick(type, index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            switch (type) {
              case 0:
                _this.cancelSubscription(index);
                break;
              case 1:
                _this.deleteUserCollectRecommend(index);
                break;
            }
          },
          onCancel() {
          }
        })
      },
      // 删除订阅的推荐列
      deleteUserCollectRecommend(index) {
        console.log(this.collectGroom[index].id);
        let params = {
            recommendId: this.collectGroom[index].id
          }
        this.$axios.recommend.deleteUserCollectRecommend(params).then(res => {
          if (res.data.returnCode == 1) {
            this.setIndex = 0;
            this.getSubscriptionList();
            this.getUserCollectRecommend();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 删除其他的收藏的订阅
      cancelSubscription(index) {
        let params = {
            id: this.subscriptionList[index].favourite.id
          }
        this.$axios.favourite.cancelSubscription(params).then(res => {
          if (res.data.returnCode == 1) {
            this.setIndex = 0;
            this.getSubscriptionList();
            this.getUserCollectRecommend();
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 删除项目
      deleteById(index) {
        let params = {
            id: this.collectData[index].id
          }
        this.$axios.favourite.deleteById(params).then(res => {
          console.log("删除成功", res);
          if (res.data.returnCode == 1) {
            this.getFavourite();
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      //
      getSubscriptionList() {
        let params ={}
        this.$axios.favourite.getSubscriptionList(params).then(res => {
          this.subscriptionList = [];
          if (res.data.returnCode == 1) {
            this.subscriptionList = res.data.returnObject;
            this.setIndex += 1;
          } else {
            this.setIndex += 1;
            this.subscriptionList = [];
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 我订阅的推荐列表
      getUserCollectRecommend() {
        let params = {}
        this.$axios.recommend.getUserCollectRecommend(params).then(res => {
          this.collectGroom = [];
          if (res.data.returnCode == 1) {
            this.collectGroom = res.data.returnObject;
            this.setIndex += 1;
          } else {
            this.setIndex += 1;
            this.collectGroom = [];
          }
        }).catch((err) => {
          console.log(err)
        });
      },
    }
  }
</script>

<style lang="scss">
  .position-collect-sub-item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #ffbc61;
    color: #FFFFFF;
    text-align: center;
  }
  .collect-bottom {
    height: 45px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 177, 72, 1);
    text-align: center;
    font-size: 15px;
    color: white;
    line-height: 45px;
    z-index: 1200;
  }
  .collect-sub-item {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .collect-cell {
      width: 100%;
      padding-top: 10px;
      overflow-y: scroll;
      overflow-x: hidden;
      background-color: #f0f1f5;
      -webkit-overflow-scrolling: touch;
      .vux-swipeout {
        .vux-swipeout-item {
          .vux-swipeout-button-box {
            .btn-box {
              padding-bottom: 10px;
            }
          }
          .vux-swipeout-content {
            .infinite {
              width: 100%;
              padding: 0 12px 10px 12px;
              background-color: #f0f1f5;
              .card-box {
                width: 100%;
                padding: 10px 10px 8px 10px;
                background-color: #FFFFFF;
                border-radius: 2px;
                .title {
                  font-size: 15px;
                  padding-bottom: 6px;
                }
                ul {
                  display: table;
                  width: 100%;
                  padding-top: 6px;
                  li {
                    display: table-cell;
                    vertical-align: middle;
                    div {
                      padding-right: 5px;
                      display: inline-block;
                      img {
                        vertical-align: middle;
                        height: 14px;
                        font-size: 0;
                      }
                      span {
                        font-size: 12px;
                        vertical-align: middle;
                        color: #8d8d8d;
                        padding-left: 3px;
                      }
                    }
                  }
                  li.data {
                    text-align: right;
                    span {
                      color: #8d8d8d;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
