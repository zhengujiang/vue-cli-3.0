<template>
  <div class="focus-customer" :style="{height:height+'px'}">
    <div class="focus-customer-box">
      <div class="focus-problem-scroll" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
           :infinite-scroll-distance="0">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(list,index) in customerData" :key="index">
            <div slot="right-menu">
              <swipeout-button background-color="#ffb148" @click.native="onOffClick(index)">取消关注</swipeout-button>
            </div>
            <div slot="content" class="infinite" @click="toLink(index)">
              <div class="li-box vux-1px-b">
                <div class="cell nameImg">
                  <img :src="list.concernedHeadUrl" alt="" v-if="list.concernedHeadUrl">
                  <img :src="$image.personal.timg" alt="" v-else>
                </div>
                <div class="cell doc">
                  <p class="title">{{list.concernedName}}</p>
                  <p class="origin">
                    <!--<span v-if="list.concernedTitle">{{list.concernedTitle}} | </span>-->
                    <span>{{list.attentionCount}}个关注</span>
                  </p>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <recommend-item v-if="recommendShow"></recommend-item>
        <p class="infinite-loading">
          <xiaoan-drop v-model="loading"></xiaoan-drop>
        </p>
      </div>
    </div>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  import XiaoanWarning from '../../../../components/warning/warning'
  import recommendItem from '@/view/xinhu/components/recommendItem.vue'
  export default {
    name: "focus-customer",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning,
      recommendItem
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: String,
        required: false,//是否必填
        default: 0,
      },
    },
    data() {
      return {
        recommendShow: false,
        allLoaded: false,
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        loading: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.personal.toFocus,
          text: '你暂时还没有关注！',
          btnText: '去关注'
        },
        customerData: [],
      }
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.getAttentionQuestion();
      }
    },
    methods: {
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true;
        } else {
          this.loading = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index += 1;
            this.getAttentionQuestion();
          }
          setTimeout(() => {
            this.loading = false;
          }, 5000)
        }, 300);
      },
      getAttentionQuestion() {
        let params = {
          selectType: 0,
          pageNum: this.page.index,
          pageSize: this.page.size
        }
        /*this.$http ({
          method: "GET",
          url: this.$api.xinhu.searchAttentionUser,
          params: {
            selectType: 0,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        })*/
        this.$axios.xinhu.searchAttentionUser(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let number = res.data.total;
            if (number <= 3) {
              this.recommendShow = true;
            } else {
              this.recommendShow = false;
            }
            this.page.total = this.$array.totalPage(number, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject;
              this.customerData = this.$array.loadMore(this.customerData, data);
            }
          } else if (res.data.returnCode == -1) {
            // this.customerData = [];
            this.recommendShow = true;
          }
        }).catch((err) => {

        })
      },
      toLink(index) {
        this.$router.push({
          path: '/userOther',
          query: {
            selectUserId: this.customerData[index].concernedId
          }
        });
        console.log(index);
      },
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.unFollow(index);
          },
          onCancel() {
          }
        })
      },
      unFollow(index) {
        /*this.$http({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            concernedId: this.customerData[index].concernedId,
            attentionType: 2 // 取消关注用户的
          }
        })*/
        let params = {
          concernedId: this.customerData[index].concernedId,
          attentionType: 2 // 取消关注用户的
        }
        this.$axios.xinhu.unFollow(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page = {
              index: 1,
              size: 20,
              total: 0
            };
            this.customerData = [];
            this.getAttentionQuestion();
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '删除失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .focus-customer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .focus-customer-box {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .vux-swipeout {
        .vux-swipeout-item {
          .vux-swipeout-content {
            .infinite {
              padding: 0 12px;
              .li-box {
                padding: 10px 0;
                display: table;
                table-layout: fixed;
                word-wrap: break-word;
                width: 100%;
                .cell.nameImg {
                  width: 14%;
                }
                .cell.doc {
                  width: 86%;
                }
                .cell {
                  display: table-cell;
                  vertical-align: middle;
                  img {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    vertical-align: middle;
                  }
                  .title {
                    font-size: 15px;
                    color: #323232;
                    text-align: justify;
                    text-justify: auto;
                    font-family: PingFangSC-Medium, sans-serif;
                  }
                  .about {
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
                  .origin {
                    color: #aeaeae;
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
</style>
