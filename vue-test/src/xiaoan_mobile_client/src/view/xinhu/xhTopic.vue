<template>
  <div id="xhTopic">
    <div class="searchBox">
      <div class="searchText" @click="$router.push('/xhSearch')">
        <i class="weui-icon-search"></i>
        <span> 搜索</span>
        <!--<img class="tiwenImg" src="/static/img/xinhu/tiwen.png"/>-->
      </div>
      <span class="c148" @click="$router.push('/xhQuestion')"><i class="icon iconfont icon-bianji1 c148"></i> 提问</span>
    </div>
    <div class="topicDetaile">
      <div class="detaile">
        <img class="topicImage" :src="topicDetaile.topicImage"/>
        <div class="topicContent">
          <div class="topicName">{{topicDetaile.topicName}}</div>
          <div class="topicDesc">{{topicDetaile.topicDescription}}</div>
        </div>
      </div>
      <div class="guanzhuBox">
        <div>
          <span class="c148">{{topicDetaile.attentionCount}}</span>个关注
          <span>|</span>
          <span class="c148">{{topicDetaile.relatedQuestionCount}}</span>个问题
        </div>
        <div class="grayBtn" v-if="topicDetaile.attention" @click="unfollow">已关注</div>
        <div class="guanzhuBtn c148" @click="addAttention" v-else>
          <!--<i class="icon iconfont icon-jia2 c148"></i>关注话题-->
          <img :src="focusImg" alt="">
        </div>
      </div>
    </div>
    <tab :line-width="2" custom-bar-width="30px" bar-active-color="#ffb148" v-model="value" default-color="#8d8d8d"
         active-color="#ffb148">
      <tab-item @on-item-click="handler(0)">简介</tab-item>
      <tab-item @on-item-click="handler(1)">最新提问</tab-item>
      <tab-item @on-item-click="handler(2)">精选回答</tab-item>
    </tab>
    <swiper :min-moving-distance="150" v-model="value" :show-dots="false" class="xhSwiper" @on-index-change="handler">
      <swiper-item :key="1">
        <div class="scrollBox scrollDetaile">
          <p>{{topicDetaile.topicDescription}}</p>
          <div class="adv" v-if="advertList.length > 0">
            <img :src="advertList[0].advertImgUrl" @click="goAdv()">
            <div class="text vux-1px">广告</div>
          </div>

        </div>
      </swiper-item>
      <swiper-item :key="2" class="xhSwiperItem">
        <div class="scrollBox">
          <ul class="infinite-list" v-infinite-scroll="loadMoreLatest" infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <v-listItem :item="item" v-for="(item, index) in latestList.data" :key="index" listType="new"></v-listItem>
          </ul>
          <p class="infinite-loading">
            <xiaoan-drop v-model="latestList.hasNext"></xiaoan-drop>
          </p>
        </div>
      </swiper-item>
      <swiper-item :key="3">
        <div class="scrollBox">
          <ul class="infinite-list" v-infinite-scroll="loadMoreFeatured" infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
            <!--<v-listItem :data="featuredList.data"></v-listItem>-->
            <v-listItem :item="item" v-for="(item, index) in featuredList.data" :key="index"
                        listType="jing"></v-listItem>
          </ul>
          <p class="infinite-loading">
            <xiaoan-drop v-model="featuredList.hasNext"></xiaoan-drop>
          </p>
        </div>
      </swiper-item>

    </swiper>

  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import listItem from "@/view/xinhu/components/listItem"
  import {Tab, TabItem, Search, Swiper, SwiperItem} from 'vux'
  import mixins from './mixin/isTestUser'
  export default {
    mixins: [mixins],
    data() {
      return {
        value: 0,
        topicId: '',
        topicDetaile: {},
        advertList: [],
        latestList: {
          viewType: 'LATEST_QUESTIONS',
          isLoading: false,
          data: [],
          nowPage: 1,
          hasNext: true
        },
        focusImg: this.$image.xinhu.focusHT,
        /* realTimeList: {
          viewType: 'REAL_TIME_ATTENTION',
          isLoading: false,
          data: [],
          nowPage: 0,
          hasNext: true
        }, */
        featuredList: {
          viewType: 'FEATURED_ANSWER',
          isLoading: false,
          data: [],
          nowPage: 1,
          hasNext: true
        }
      }
    },
    // 使用其它组件
    components: {
      Tab,
      TabItem,
      Search,
      Swiper,
      SwiperItem,
      'xiaoan-drop': drop,
      'v-listItem': listItem
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.topicId = this.$route.query.topicId
      this.getTopicDetails()
      let item = this.$route.query.item
      if (item) {
        this.value = item
      } else {
        this.value = 0
      }
      this.$MTAmethod.mtaShare('th7Yz7CYvV', {'j88awxypkq': 'true'})
    },
    mounted() {
    },
    // 方法
    methods: {
      goAdv() {
        location.href = this.advertList[0].advertUrl
      },
      handler(val) {
        this.value = val
        this.$router.push({path: '/xhTopic', query: {topicId: this.topicId, item: val}})
      },
      change(val) {
        // alert(val)
      },
      handleListItem(item) {
        alert(item.gz)
      },
      getTopicDetails() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.getTopicDetails,
          params: {
            topicId: this.topicId
          }
        })*/
        let params = {
          topicId: this.topicId
        }
        this.$axios.xinhu.getTopicDetails(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.topicDetaile = res.data.returnObject
            if (res.data.returnObject.advertList) {
              this.advertList = res.data.returnObject.advertList
            }
          }
        }).catch((err) => {

        })
      },
      // 取消关注
      unfollow() {
        let _this = this
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm() {
            /*_this.$http ({
              url: _this.$api.xinhu.unFollow,
              method: 'DELETE',
              params: {
                concernedId: _this.topicId,
                attentionType: 0
              }
            })*/
            let params = {
              concernedId: _this.topicId,
              attentionType: 0
            }
            _this.$axios.xinhu.unFollow(params).then((res) => {
              if (res.data.returnCode == 200) {
                _this.topicDetaile.attention = false
                _this.topicDetaile.attentionCount = _this.topicDetaile.attentionCount - 1
              }
            })
          },
          onCancel() {
          }
        })
      },
      addAttention() {
        /*this.$http ({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_TOPIC',
            concernedId: this.topicDetaile.topicId,
            concernedTitle: this.topicDetaile.topicName
          }
        })*/
        let params = {
          attentionType: 'ATTENTION_TOPIC',
          concernedId: this.topicDetaile.topicId,
          concernedTitle: this.topicDetaile.topicName
        }
        this.$axios.xinhu.addAttention(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.topicDetaile.attention = true
            this.topicDetaile.attentionCount = this.topicDetaile.attentionCount + 1
            this.$MTAmethod.mtaShare('th7Yz7CYvV', {'27c8sycs4q': 'true'})
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {

        })
      },
      loadMoreLatest() {
        if (this.latestList.hasNext) {
          setTimeout(() => {
            this.getListLatest()
          }, 1000)
        }
      },
      /* loadMoreRealTime() {
        if (this.realTimeList.hasNext) {
          setTimeout(() => {
            this.getListRealTime()
          }, 1000)
        }
      }, */
      loadMoreFeatured() {
        if (this.featuredList.hasNext) {
          setTimeout(() => {
            this.getListFeatured()
          }, 1000)
        }
      },
      // LATEST_QUESTIONS  REAL_TIME_ATTENTION  FEATURED_ANSWER
      // 最新提问
      getListLatest() {
        let params = {
          topicId: this.topicId,
          pageNum: this.latestList.nowPage,
          pageSize: 10
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listQuestionLatest,
          params: {
            topicId: this.topicId,
            pageNum: this.latestList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listQuestionLatest(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            let list = res.data.returnObject.list
            for (let i in list) {
              if (list[i].bestAnswer) {
                let bestAnswer = JSON.parse(list[i].bestAnswer)
                list[i].answerContent = bestAnswer.answerContent
                list[i].answerId = bestAnswer.answerId
                list[i].userName = bestAnswer.userName
              }
            }
            this.latestList.data = this.latestList.data.concat(list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.latestList.nowPage >= page) {
              this.latestList.hasNext = false
            } else {
              this.latestList.nowPage += 1
            }
          } else {
            this.latestList.hasNext = false
          }
        }).catch((err) => {
          this.latestList.hasNext = false
        })
      },
      // 精选问答
      getListFeatured() {
        let params = {
          topicId: this.topicId,
          pageNum: this.featuredList.nowPage,
          pageSize: 10
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listSiftAnswer,
          params: {
            topicId: this.topicId,
            pageNum: this.featuredList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listSiftAnswer(params).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.featuredList.data = this.featuredList.data.concat(res.data.returnObject.list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.featuredList.nowPage >= page) {
              this.featuredList.hasNext = false
            } else {
              this.featuredList.nowPage += 1
            }
          } else {
            this.featuredList.hasNext = false
          }
        }).catch((err) => {
          this.featuredList.hasNext = false
        })
      },
      // 实时关注
      /* getListRealTime () {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listQuestions,
          params: {
            viewType: this.realTimeList.viewType,
            pageNum: this.realTimeList.nowPage,
            pageSize: 10
          }
        }).then((res) => {
          if (res.data.returnCode === 200 && res.data.returnObject) {
            this.realTimeList.data = this.realTimeList.data.concat(res.data.returnObject.list)
            let page = 0
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10) - 1
            } else {
              page = parseInt(allCount / 10)
            }
            if (this.realTimeList.nowPage >= page) {
              this.realTimeList.hasNext = false
            } else {
              this.realTimeList.nowPage += 1
            }
          } else {
            this.realTimeList.hasNext = false
          }
        }).catch((err) => {
          this.realTimeList.hasNext = false
        })

      }, */

    }
  }
</script>

<style lang="scss">
  #xhTopic {
    display: flex;
    flex-direction: column;
    background-color: #f0f1f5;
    min-height: 100%;
    .c148 {
      color: #ffbb66;
      font-size: 12px;
      font-weight: 400;
      .iconfont {
        font-size: 20px;
      }
    }
    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 10px 12px;
      .searchText {
        position: relative;
        display: flex;
        align-items: center;
        background-color: #fff;
        height: 100%;
        width: 82%;
        border-radius: 3px;
        padding-left: 5px;
        font-size: 14px;
        color: #aeaeae;
        .weui-icon-search {
          font-size: 18px;
        }
        .tiwenImg {
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .c148 {
        color: #ffbb66;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        .iconfont {
          font-size: 20px;
        }
      }
    }
    .topicDetaile {
      min-height: 160px;
      background-color: #fff;
      font-size: 14px;
      margin-bottom: 10px;
      .detaile {
        height: auto;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin: 0 10px;
        padding: 7px 0 5px 0;
        .topicImage {
          width: 90px;
          height: 90px;
          border-radius: 5px;
          border: 1px solid #e3e3e3;
          flex-shrink: 0;
        }
        .topicContent {
          /*height: 90px;*/
          margin-left: 10px;
          flex-grow: 1;
          .topicName {
            color: #323232;
            font-size: 15px;
            font-family: PingFangSC-Medium;
          }
          .topicDesc {
            font-size: 13px;
            color: #545454;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            font-family: PingFangSC-Regular;
          }
        }
      }
      .guanzhuBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        margin: 5px 12px 0 12px;
        border-top: 1px solid #e3e3e3;
        color: #8d8d8d;
        .guanzhuBtn {
          width: 86px;
          height: 26px;
          img {
            height: 100%;
          }
        }
        .grayBtn {
          color: #8d8d8d;
          text-align: center;
          background-color: #f0f1f5;
          border-radius: 3px;
          padding: 3px 2px;
          width: 86px;
          font-size: 14px;
        }
        div:first-child {
          font-size: 12px;
          font-family: PingFangSC-Regular;
        }
      }

    }
    .xhSwiper {
      display: flex;
      flex-grow: 1;
      padding-bottom: 50px;
      padding-top: 10px;
    }
    .scrollBox {
      height: 100%;
      overflow-y: scroll;
    }
    .scrollDetaile {
      background-color: #fff;
      padding: 12px;
      font-size: 14px;
      color: #545454;
      p {
        text-indent: 2em;
      }
      .adv {
        padding: 0 0 5px 0;
        img {
          width: 100%;
          /*height: 195px;*/
          border-bottom: 0.5px solid #e3e3e3;
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
        }
      }
      .text {
        color: #8d8d8d;
        font-size: 12px;
        display: inline-block;
        padding: 0 8px;
        height: 20px;
        line-height: 20px;
        /*margin-left:3px;*/
      }
    }
    .vux-slider > .vux-swiper {
      flex-grow: 1;
      height: auto !important;
    }
    /*.vux-tab-warp {
      margin-top:10px;
    }*/
    .vux-tab-item {
      font-family: PingFangSC-Regular;
      font-size: 15px;color: #ffb148;
    }
  }
</style>
