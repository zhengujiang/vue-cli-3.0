<template>
  <transition name="bounce">
    <div class="collect-det-item" :style="{height:height+'px'}">
      <div class="collect-det-item-scroll" :style="{height:height+'px'}">
        <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" :infinite-scroll-distance="0">
          <swipeout class="infinite-box">
            <swipeout-item class="infinite-list" transition-mode="follow" :disabled="!share"
                           v-for="(list,index) of collectDetailsData" :key="list.id">
              <div slot="right-menu">
                <swipeout-button @click.native="onOffClick(index)" :background-color="'#ff7250'">删除
                </swipeout-button>
              </div>
              <div slot="content" class="collect-det-list vux-1px-b" @click="toDetalis(index)">
                <div class="list-box">
                  <p class="title">{{list.title}}</p>
                  <p class="about" v-if="list.answerContent">{{list.answerContent}}</p>
                  <p class="doc">
                    <span class="text icon">
                      <b :style="{backgroundColor:list.typeColor}">{{list.typeName}}</b>&ensp;
                    </span>
                    <span class="text doc-other">
                      <b v-if="list.faWenZiHao">{{list.faWenZiHao}}</b>
                      <b v-if="list.faWenZiHao">&ensp;|&ensp;</b>
                      <b v-if="list.timeLiness">{{list.timeLiness}}</b>
                      <b v-if="list.timeLiness">&ensp;|&ensp;</b>
                      <b>{{$const.format(list.publishTime)}}</b>
                    </span>
                  </p>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
          <p class="infinite-loading">
            <xiaoan-drop v-model="loading"></xiaoan-drop>
          </p>
        </div>
      </div>
      <xiaoan-error v-show="errorShow"></xiaoan-error>
      <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                      :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    </div>
  </transition>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  import XiaoanWarning from '@/components/warning/warning'
  import {mapState} from 'vuex'
  export default {
    name: "collect-det-item",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning
    },
    data() {
      return {
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        errorShow: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.warning.warning3,
          text: '您暂时还没有收藏！',
          btnText: ''
        },
        loading: true,
        shareKey: '',
        isOwner: true,
        collectDetailsData: [],
        collectId: '',
        pageTotal: 0,
        binding: 0,
        isTestUser: 0
      }
    },
    computed: {
      ...mapState({
        collectDetailsWatch: state => state.mutations.collectDetailsWatch,
      })
    },
    watch: {
      collectDetailsWatch: function (val) {
        console.log('===============>', val);
        this.page = {
          index: 1,
          size: 20,
          total: 0
        };
        this.collectDetailsData = [];
        this.getCollect();
      },
      active: function (val) {
        window.sessionStorage.setItem('collect-details-active', val);
      }
    },
    props: {
      height: {
        type: Number,
        required: false, // 是否必填
        default: 0,
      },
      active: {
        type: Number,
        required: false, // 是否必填
        default: 0,
      },
      type: {
        type: String,
        required: false, // 是否必填
        default: 'total',
      },
      share: {
        type: Boolean,
        required: false, // 是否必填
        default: true,
      }
    },
    created() {
      if (this.$route.query.id !== undefined) {
        this.collectId = this.$route.query.id;
      }
      //
      if (this.$route.query.uuid !== undefined) {
        this.shareKey = this.$route.query.uuid;
      }
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.apiUserHome();
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
            let isTestUser = data.testUser;
            // if (isTestUser == false) {
            //   // 非测试用户
            //  // this.isTestUser = 1;
            // }
            this.$nextTick(() => {
              this.getCollect();
            })
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
      // 页面跳转
      toDetalis(index) {
        switch (this.collectDetailsData[index].type) {
          case 'law':
            this.$router.push({
              path: '/rule/details',
              query: {id: this.collectDetailsData[index].refId}
            });
            break;
          case 'case':
            this.$router.push({
              path: '/afficheContent',
              query: {id: this.collectDetailsData[index].refId}
            });
            break;
          case 'report':
            this.$router.push({
              path: '/detailReport',
              query: {id: this.collectDetailsData[index].refId}
            });
            break;
          case 'qa':
            this.getQuestionIdByAnswerId(this.collectDetailsData[index].refId);
            // this.$router.push({
            //   path: '/xhQuestionDetaile', query: {questionId: this.collectDetailsData[index].refId}
            // });
            // 待确定
            break;
          case 'publish':
            this.$router.push({
              path: '/ipo/details', query: {id: this.collectDetailsData[index].refId}
            });
            break;
        }
      },
      getQuestionIdByAnswerId(id) {
        /*this.$http({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          },
        })*/
        let params = {
          answerId: id
        }
        this.$axios.xinhu.getQuestionIdByAnswerId(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$router.push({path: '/xhAnswerDetaile', query: {questionId: res.data.returnObject, answerId: id}});
          } else if (res.data.returnCode == -1) {
            this.$router.push({path: '/error', query: {text: '', img: ''}});
            // this.$vux.toast.show({text: '没有查找到该数据', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      // 无限加载器
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true
        } else {
          this.loading = false
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index++;
            this.getCollect();
          }
        }, 300);
      },
      // 删除按钮
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteCollectById(index);
            console.log(index);
          },
          onCancel() {
          }
        })
      },
      //删除单个内容
      deleteCollectById(index) {
        let params = {
            id: this.collectDetailsData[index].id,
            favouriteId: this.$route.query.id,
            type: this.collectDetailsData[index].type
          }
        this.$axios.collect.deleteCollectById(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.binding += 1;
            this.$store.commit('UPDATE_COLLECTDETAILS', {collectDetailsWatch: this.binding});
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '没有查找到该数据', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 获取收藏夹内容
      getCollect() {
        let params = {
            favourableId: this.collectId,
            page: this.page.index,
            rows: this.page.size,
            shareKey: this.shareKey,
            showType: this.type
          }
        this.$axios.collect.getCollect(params).then(res => {
          if (res.data.returnCode == 1) {
            // 如果有返回值就传出去到组件
            let collectDetailsData = res.data.returnObject.collects;
            this.$nextTick(() => {
              let total = 0;
              console.log('this.type', this.type);
              if (this.type == 'total') {
                total = res.data.total;
                console.log('23123213', total);
              } else if (this.type == 'law') {
                total = res.data.returnObject.favourite.lawCount;
                console.log(total);
              } else if (this.type == 'case') {
                total = res.data.returnObject.favourite.caseCount;
                console.log(total);
              } else if (this.type == 'report') {
                total = res.data.returnObject.favourite.reportCount;
                console.log(total);
              } else if (this.type == 'qa') {
                total = res.data.returnObject.favourite.qaCount;
                console.log(total);
              } else if (this.type == 'publish') {
                total = res.data.returnObject.favourite.publishCount;
                console.log(total);
              }
              let lastValue = this.page.index;

              this.page.total = this.$array.totalPage(total, this.page.size);
              if (lastValue < this.page.total) {
                this.loading = true
              } else {
                this.loading = false
              }
            })
            //
            collectDetailsData.forEach((item) => {
              if (item.type == 'law') {
                item.typeName = '法规';
                item.typeColor = '#90b8f4'
              }
              if (item.type == 'case') {
                item.typeName = '公告';
                item.typeColor = '#ffd091'
              }
              if (item.type == 'report') {
                item.typeName = '研报';
                item.typeColor = '#98e6f0'
              }
              if (item.type == 'qa') {
                item.typeName = '问答';
                item.typeColor = '#ffa691'
              }
              if (item.type == 'publish') {
                item.typeName = 'IPO';
                item.typeColor = '#ffd091'
              }
            });
            if (this.isTestUser == 1) {
              // 过滤到 qa
              collectDetailsData = collectDetailsData.filter((item) => {
                return item.type !== 'qa';
              })
            }
            //
            this.collectDetailsData = this.$array.loadMore(this.collectDetailsData, collectDetailsData);
          } else if (res.data.returnCode == -1) {
            if (this.collectDetailsData.length == 0) {
              this.warning.show = true;
            } else {
              this.warning.show = false;
            }
            this.page.total = 0;
            // console.log(this.page.total, this.page.index, this.page.size);
          }
        }).catch((err) => {
          console.log(err);
          this.errorShow = true;
          this.$vux.toast.show({text: '获取收藏夹内容失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
    }
  }
</script>

<style lang="scss">
  .collect-det-item {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .collect-det-item-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .infinite-box {
        .infinite-list {
          .collect-det-list {
            .list-box {
              padding: 10px 12px;
              p.title {
                color: #323232;
                font-size: 15px;
                text-align: justify;
                text-justify: auto;
                font-family: PingFangSC-Medium, sans-serif;
                margin-bottom: 5px;
              }
              p.about {
                font-size: 13px;
                color: #545454;
                text-justify: distribute;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 5px;
              }
              p.doc {
                display: table;
                padding-top: 3px;
                .text {
                  display: table-cell;
                  vertical-align: top;
                  color: #8d8d8d;
                  min-width: 41px;
                }
                .text.icon {
                  b {
                    display: inline-block;
                    height: 16px;
                    padding: 0 5px;
                    text-align: center;
                    background-color: #f0f1f5;
                    color: #FFFFFF;
                    line-height: 16px;
                    border-radius: 2px;
                    margin-right: 1px;
                    font-size: 12px;
                    font-weight: normal;
                  }
                }
                .text.doc-other {
                  b {
                    display: inline-block;
                    float: left;
                    font-weight: normal;
                  }
                }
              }
            }
          }

        }
        .infinite-loading {
          height: 45px;
          line-height: 45px;
          text-align: center;
        }
      }
    }
  }
</style>
