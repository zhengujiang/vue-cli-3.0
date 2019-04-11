<template>
  <div class="creation-item" :style="{height:height+'px'}">
    <div class="creation-item-scroll">
      <ul v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" :infinite-scroll-distance="0">
        <li v-for="(list,index) of askData">
          <div class="infinite" @click="toLink(index)">
            <div class="li-box vux-1px-b">
              <p class="title">{{list.questionTitle}}</p>
              <p class="about" v-if="false">{{list.answerContent}}</p>
              <p class="origin">
                <span>{{list.answerCount}}个回答 |</span>
                <span>{{list.attentionCount}}个关注 |</span>
                <span>{{$const.format(list.createTime)}}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
      <p class="infinite-loading">
        <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
      </p>
    </div>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    <xiaoan-loading v-show="allLoading"></xiaoan-loading>
  </div>
</template>

<script>
  import XiaoanLoading from '@/components/warning/loading'
  import XiaoanWarning from '@/components/warning/warning'

  export default {
    name: "creation-item",
    components: {
      XiaoanWarning,
      XiaoanLoading
    },
    data() {
      return {
        allLoading: false,
        allLoaded: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.my.userOther,
          text: '您暂时还没有提问！',
          btnText: ''
        },
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        askData: [],
        loading: true
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
    watch: {},
    created() {
      this.allLoading = true;
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.searchUserQuestion();
      }
    },
    mounted() {
      setTimeout(() => {
        this.allLoading = false;
      })
    },
    methods: {
      toLink(index) {
        console.log('123456', index);
        /*
        * 问题：/xhQuestionDetaile?id=
回答：/xhAnswerDetaile?id=
话题：/xhTopic?id=*/
        this.$router.push({path: '/xhQuestionDetaile', query: {questionId: this.askData[index].questionId}});
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
            this.searchUserQuestion();
          }
          setTimeout(() => {
            this.loading = false;
          }, 5000)
        }, 300);
      },
      searchUserQuestion() {
        /* this.$http ({
          method: "GET",
          url: this.$api.xinhu.searchUserQuestion,
          params: {
            selectUserId: 0,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }) */
        let params = {
          selectUserId: 0,
          pageNum: this.page.index,
          pageSize: this.page.size
        }
        this.$axios.xinhu.searchUserQuestion(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.page.total = this.$array.totalPage(res.data.total, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject;
              this.askData = this.$array.loadMore(this.askData, data);
            }
          } else if (res.data.returnCode == -1) {
            // this.askData = [];
            if (this.askData.length == 0) {
              this.warning.show = true;
            }
          }
        }).catch((data) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .creation-item {
    .creation-item-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul {
        li {
          &:active {
            background-color: #f0f1f5;
          }
          .infinite {
            padding: 0 12px;
            .li-box {
              padding: 10px 0;
              .title {
                font-size: 15px;
                color: #323232;
                text-align: justify;
                text-justify: auto;font-family: PingFangSC-Medium, sans-serif;
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
</style>
