<template>
  <div id="listRealTime" class="v-content">
    <template v-if="hasList">
      <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="0">
        <v-listItem :item="item" v-for="(item, index) in dataList.data" :key="index" listType="realTime"></v-listItem>
      </ul>
      <p class="infinite-loading">
        <xiaoan-drop v-model="dataList.hasNext"></xiaoan-drop>
      </p>
    </template>
    <template v-else>
      <recommend></recommend>
    </template>
  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import listItem from "@/view/xinhu/components/listItem"
  import recommend from '@/view/xinhu/components/recommendItem'
  export default {
    name: 'listRealTime',
    data() {
      return {
        loading: false,
        hasList: true,
        dataList: {
          viewType: 'REAL_TIME_ATTENTION',
          data: [],
          nowPage: 1,
          hasNext: true
        },
      }
    },
    // 使用其它组件
    components: {
      'xiaoan-drop': drop,
      'v-listItem': listItem,
      recommend,
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      loadMore() {
        this.loading = true
        if (this.dataList.hasNext) {
          setTimeout(() => {
            this.getList()
          }, 300)
        }
      },
      getList() {
        let params = {
          viewType: this.dataList.viewType,
          pageNum: this.dataList.nowPage,
          pageSize: 10
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.xinhu.listQuestions,
          params: {
            viewType: this.dataList.viewType,
            pageNum: this.dataList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listQuestions(params).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject) {
            let list = res.data.returnObject.list
            for (let i in list) {
              list[i].updateTime = this.$const.format(list[i].createTime)
              list[i].userName = list[i].answerUserName
            }
            this.dataList.data = this.dataList.data.concat(list)
            let page = 1
            let allCount = res.data.returnObject.count
            if (allCount % 10 == 0) {
              page = parseInt(allCount / 10)
            } else {
              page = parseInt(allCount / 10) + 1
            }
            if (this.dataList.nowPage >= page) {
              this.dataList.hasNext = false
            } else {
              this.dataList.nowPage += 1
            }
          } else {
            this.dataList.hasNext = false
          }
          if (this.dataList.data.length > 0 && this.dataList.nowPage == 1) {
            this.hasList = true
          } else {
            this.hasList = false
          }

        }).catch((err) => {
          this.dataList.hasNext = false
        })
      },
    }
  }
</script>

<style lang="scss">
  #listRealTime {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
