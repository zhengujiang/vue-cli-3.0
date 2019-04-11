<template>
  <div class="focus-topic" :style="{height:height+'px'}">
    <div class="focus-topic-box" :style="{height:height+'px'}">
      <div class="focus-topic-scroll" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
           :infinite-scroll-distance="0">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(list,index) in topicData" :key="index">
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
                  <p class="title" v-if="list.concernedName">{{list.concernedName}}</p>
                  <p class="about" v-if="list.concernedTitle">{{list.concernedTitle}}</p>
                  <p class="origin">
                    <span v-if="list.attentionCount">{{list.attentionCount}}个关注 |</span>
                    <span v-if="list.questionCount">{{list.questionCount}}个问题 |</span>
                    <span>{{$const.format(list.createDate)}}</span>
                  </p>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
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

  export default {
    name: "focus-topic",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning
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
        topicData: [],
      }
    },
    created() {

    },
    mounted() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.getAttentionTopic();
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
          this.$nextTick(() => {
            if (lastValue < this.page.total) {
              this.page.index += 1;
              this.getAttentionTopic();
            }
          })
          setTimeout(() => {
            this.loading = false;
          }, 5000)
        }, 300);
      },
      getAttentionTopic() {
        /*this.$http({
          method: "GET",
          url: this.$api.xinhu.getAttentionTopic,
          params: {
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        })*/
        let params = {
          pageNum: this.page.index,
          pageSize: this.page.size
        }
        this.$axios.xinhu.getAttentionTopic(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let number = res.data.total;
            this.page.total = this.$array.totalPage(number, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject;
              this.topicData = this.$array.loadMore(this.topicData, data);
            }
          } else if (res.data.returnCode == -1) {
            // this.problemData = [];
            if (this.topicData.length == 0) {
              this.warning.show = true;
            }
          }
        }).catch((data) => {

        })
      },
      toLink(index) {
        this.$router.push({path: '/xhTopic', query: {topicId: this.topicData[index].concernedId}})
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
            attentionType: 0, // 取消关注话题的
            concernedId: this.topicData[index].concernedId
          }
        })*/
        let params = {
          attentionType: 0, // 取消关注话题的
          concernedId: this.topicData[index].concernedId
        }
        this.$axios.xinhu.unFollow(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page = {
              index: 1,
              size: 20,
              total: 0
            };
            this.topicData = [];
            this.getAttentionTopic();
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
  .focus-topic {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .focus-topic-box {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .focus-topic-scroll {
      }
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
