<template>
  <div id="listLatest" class="v-content">
    <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
        infinite-scroll-distance="0">
      <template v-for="(item, index) in dataList.data">
        <v-listItem :key="index" :item="item" listType="new"></v-listItem>
        <li :key="index" class="nav-content-list" v-if="index==2">
          <div class="list-box">
            <!--<div class="advtext fl">推广</div>-->
            <vxa-banner advType="my"></vxa-banner>
          </div>
          <!--<div class="list-box" v-if="advert.advertImgUrl">
            <img :src="advert.advertImgUrl" alt="" @click="goAdv()">
            <div class="advtext fl">推广</div>
          </div>
          <recommend-item v-else></recommend-item>-->
        </li>
      </template>
    </ul>
    <p class="infinite-loading">
      <xiaoan-drop v-model="dataList.hasNext"></xiaoan-drop>
    </p>
  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import listItem from "@/view/xinhu/components/listItem"
  import recommendItem from '@/view/xinhu/components/recommendItem.vue'
  import enterpriseInvite from '@/components/enterprise/enterpriseInvite'
  export default {
    name: 'listLatest',
    data() {
      return {
        loading: false,
        dataList: {
          viewType: 'LATEST_QUESTIONS',
          data: [],
          nowPage: 1,
          hasNext: true
        },
        advert: {}
      }
    },
    props: {
      fromPath: {
        type: String,
        default: ''
      }
    },
    // 使用其它组件
    components: {
      'xiaoan-drop': drop,
      'v-listItem': listItem,
      'v-enterpriseInvite': enterpriseInvite,
      recommendItem

    },
    computed: {},
    watch: {
      fromPath(val) {
        if (val == 'xhQuestion') {
          this.dataList = {
            viewType: 'LATEST_QUESTIONS',
            data: [],
            nowPage: 1,
            hasNext: true
          }
          this.loadMore()
        }
      }
    },
    // 生命周期函数
    created() {
      // this.getAdvert()
    },
    mounted() {
    },
    // 方法
    methods: {
      goAdv() {
        location.href = this.advert.advertUrl
      },
      loadMore() {
        this.loading = true
        if (this.dataList.hasNext) {
          setTimeout(() => {
            this.getList()
          }, 300)
        }
      },
      getAdvert() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.getAdvert,
          params: {}
        })*/
        this.$axios.xinhu.getAdvert().then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.advert = res.data.returnObject[0]
            // this.dataList.data.splice(3, 0, this.advert)
            console.log('!!!', this.dataList.data)
          }
        })
      },
      getList() {
        let params = {
          topicId: '',
          pageNum: this.dataList.nowPage,
          pageSize: 10
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listQuestionLatest,
          params: {
            topicId: '',
            pageNum: this.dataList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listQuestionLatest(params).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            let list = res.data.returnObject.list
            this.dataList.data = this.dataList.data.concat(list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.dataList.nowPage == 1) {
              this.getAdvert()
            }
            if (this.dataList.nowPage >= page) {
              this.dataList.hasNext = false
            } else {
              this.dataList.nowPage += 1
            }

          } else {
            this.dataList.hasNext = false
          }
        }).catch((err) => {
          this.dataList.hasNext = false
        })
      },
    }
  }
</script>

<style lang="scss">
  #listLatest {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #f0f1f5;
    .advtext {
      position: absolute;
      left: 12px;
      top: 10px;
      font-size: 12px;
      color: white;
      border: 0.5px solid #fff;
      border-radius: 2px;
      padding: 0 2px;
      /*margin-left:3px;*/
    }
    .nav-content-list {
      padding: 0 0 7.5px 0;
      .recommend-item-content {
        padding: 0;
      }
      &:first-child {
        padding-top: 15px;
      }
      &:last-child {
        padding-bottom: 0;
      }
      .list-box {
        font-size: 0;
        background-color: white;
        border-radius: 4px;
        border: 0.5px solid #e3e3e3;
        position: relative;
        .nav-content-list-title {
          font-size: 15px;
          margin: 11px 0 3px 0;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .nav-content-list-doc {
          font-size: 12px;
          padding: 0 8px 11px 8px;
          box-sizing: border-box;
          color: #8d8d8d;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        }
        img {
          width: 100%;
          /*height: 195px;*/
          border-bottom: 0.5px solid #e3e3e3;
        }
      }
    }
  }
</style>
