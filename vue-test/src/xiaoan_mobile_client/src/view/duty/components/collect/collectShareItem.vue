<template>
  <div class="collect-share-item" :style="{height:height+'px'}">
    <div class="collect-cell" :style="{height:height+'px'}">
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="(list,index) of collectShareData" :key="index">
          <div slot="right-menu" class="btn-box">
            <swipeout-button :background-color="'#ffd091'" @click.native="onShareClick(index)">
              取消分享
            </swipeout-button>
            <swipeout-button :background-color="'#ffb148'" @click.native="onItemClick(index)">编辑</swipeout-button>
            <swipeout-button :background-color="'#ff7250'" @click.native="onOffClick(index)">删除</swipeout-button>
          </div>
          <div slot="content" class="infinite">
            <div class="card-box" @click="toCollectDetail(1, index)">
              <p class="title">{{list.favouriteName}}</p>
              <ul class="vux-1px-t">
                <li>
                  <div>
                    <img :src="category.statute" alt="">
                    <span>{{list.lawCount}}</span>
                  </div>
                  <div>
                    <img :src="category.notice" alt="">
                    <span>{{list.caseCount}}</span>
                  </div>
                  <div>
                    <img :src="category.reportIcon" alt="">
                    <span>{{list.reportCount}}</span>
                  </div>
                  <div v-if="!(isTestUser == 2)">
                    <img :src="category.qaIcon" alt="">
                    <span>{{list.qaCount}}</span>
                  </div>
                </li>
                <li class="data">
                  <span>{{$const.format(list.createTime)}}</span>
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
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  import XiaoanWarning from '@/components/warning/warning'

  export default {
    name: "collect-share-item",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning
    },
    data() {
      return {
        allLoaded: false,
        warning: {
          top: '25%',
          show: true,
          img: this.$image.warning.collectShare,
          text: '您暂时还没有分享！',
          btnText: ''
        },
        collectShareData: [],
        page: {
          index: 30,
          size: 1,
          total: 0
        },
        contentHeight: 0,
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
    watch: {
      active: function (val) {
        if (val == 1) {
          this.getFavourite();
        }
      }
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        // this.apiUserHome();
        this.getFavourite();
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
            //this.$storage.loginStatus(this, document.title, window.location.href);
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      // 获取我的收藏夹
      getFavourite() {
        let params =  {
            pageSize: this.page.index,
            pageIndex: this.page.size
          }
        this.$axios.favourite.getFavourite(params).then(res => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == "" || res.data.returnObject == null) {
              this.collectShareData = [];
              this.warning.show = true;
            } else {
              let pages = res.data.returnObject.list;
              this.collectShareData = pages.filter((item) => {
                return item.share == true;
              });
              console.log(pages, this.collectShareData);
              if (this.collectShareData == [] || this.collectShareData.length == 0) {
                this.warning.show = true;
              } else {
                this.warning.show = false;
              }
            }
          } else {
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '获取收藏夹失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      toCollectDetail(type, index) {
        this.$router.push({path: '/collect/collectDetails', query: {id: this.collectShareData[index].id}});
      },
      // 取消分享
      onShareClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消分享吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.shareSwitch(index);
          },
          onCancel() {
          }
        })
      },
      // 编辑
      onItemClick(index) {
        // 编辑方法
        this.$router.push({path: '/collect/collectDetails', query: {id: this.collectShareData[index].id, show: true}});
      },
      // 删除
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteById(index);
            console.log(index);
          },
          onCancel() {
          }
        })
      },
      // 取消分享
      shareSwitch(index) {
        let params = {
            favouriteId: this.collectShareData[index].id,
            isShare: false
          }
        this.$axios.favourite.shareSwitch(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '已取消分享', position: 'middle', type: 'text', width: 'auto', time: 1500});
            this.getFavourite();
          } else {
            this.$vux.toast.show({text: '取消分享失败，请刷新后重试', position: 'middle', type: 'text', width: 'auto', time: 1500});
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '取消分享错误', position: 'middle', type: 'text', width: 'auto', time: 1500});
          console.log(err)
        })
      },
      // 删除项目
      deleteById(index) {
        let params = {
            id: this.collectShareData[index].id
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
    }
  }
</script>

<style lang="scss">
  .collect-share-item {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .collect-cell {
      width: 100%;
      padding-top: 10px;
      background-color: #f0f1f5;
      overflow-y: scroll;
      overflow-x: hidden;
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
