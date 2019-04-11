<template>
  <div class="focus-problem" :style="{height:height+'px'}">
    <div class="focus-problem-box" :style="{height:height+'px'}">
      <div class="focus-problem-scroll" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
           :infinite-scroll-distance="0">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(list,index) in problemData" :key="index">
            <div slot="right-menu">
              <swipeout-button background-color="#ffb148" @click.native="onOffClick(index)">取消关注</swipeout-button>
            </div>
            <div slot="content" class="infinite" @click="toLink(index)">
              <div class="li-box vux-1px-b">
                <p class="title">{{list.questionTitle}}</p>
                <p class="about" v-if="list.answer.answerContent">
                  <span v-if="!list.answer.anonymous"><span
                    v-if="list.answer.userName">{{list.answer.userName+'：'}}</span>{{list.answer.answerContent}}</span>
                  <span v-else>{{'匿名用户：'+list.answer.answerContent}}</span>
                </p>
                <p class="origin">
                  <span v-if="list.answer">{{list.answerCount}}个回答 |</span>
                  <span v-if="list.answer.approveCount">{{list.answer.approveCount}}个赞同 |</span>
                  <span v-if="list.attentionCount">{{list.attentionCount}}个关注 |</span>
                  <span>{{$const.format(list.createTime)}}</span>
                </p>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <p class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
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
    name: "focus-problem",
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
        problemData: []
      }
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.getAttentionQuestion();
      }
    },
    methods: {
      getAttentionQuestion() {
        /*this.$http ({
          method: "GET",
          url: this.$api.xinhu.getAttentionQuestion,
          params: {
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        })*/
        let params = {
          pageNum: this.page.index,
          pageSize: this.page.size
        }
        this.$axios.xinhu.getAttentionQuestion(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let number = res.data.total;
            this.page.total = this.$array.totalPage(number, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject;
              this.problemData = this.$array.loadMore(this.problemData, data);
            }
          } else if (res.data.returnCode == -1) {
            // this.problemData = [];
            if (this.problemData.length == 0) {
              this.warning.show = true;
            }
          }
        }).catch((data) => {

        })
      },
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index += 1;
            this.getAttentionQuestion();
          }
          setTimeout(() => {
            this.loading = false;
            this.allLoaded = false;
          }, 5000);
        }, 300);
      },
      toLink(index) {
        this.$router.push({path: '/xhQuestionDetaile', query: {questionId: this.problemData[index].questionId}});
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
        /*this.$http ({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            attentionType: 1, // 取消关注问题的
            concernedId: this.problemData[index].questionId
          }
        })*/
        let params = {
          attentionType: 1, // 取消关注问题的
          concernedId: this.problemData[index].questionId
        }
        this.$axios.xinhu.unFollow(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page = {
              index: 1,
              size: 20,
              total: 0
            };
            this.problemData = [];
            this.getAttentionQuestion();
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '取消失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .focus-problem {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .focus-problem-box {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .focus-problem-scroll {

      }
      .vux-swipeout {
        .vux-swipeout-item {
          .vux-swipeout-content {
            .infinite {
              padding: 0 12px;
              .li-box {
                padding: 10px 0;
                .title {
                  font-size: 15px;
                  color: #323232;
                  text-align: justify;
                  text-justify: auto;
                  font-family: PingFangSC-Medium, sans-serif;
                  margin-bottom: 5px;
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
</style>
