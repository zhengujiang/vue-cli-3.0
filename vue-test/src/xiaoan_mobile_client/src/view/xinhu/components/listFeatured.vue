<template>
  <div id="listFeatured" class="v-content">
    <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="0">
      <v-listItem :item="item" v-for="(item, index) in dataList.data" :key="index" listType="jing"></v-listItem>
    </ul>
    <p class="infinite-loading">
      <xiaoan-drop v-model="dataList.hasNext"></xiaoan-drop>
    </p>
  </div>
</template>

<script>
  import drop from "@/components/warning/drop"
  import listItem from "@/view/xinhu/components/listItem"
  export default {
    name: 'listFeatured',
    data() {
      return {
        loading: false,
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
          topicId: '',
          pageNum: this.dataList.nowPage,
          pageSize: 10
        }
        /*this.$http({
          method: 'GET',
          url: this.$api.xinhu.listSiftAnswer,
          params: {
            topicId: '',
            pageNum: this.dataList.nowPage,
            pageSize: 10
          }
        })*/
        this.$axios.xinhu.listSiftAnswer(params).then((res) => {
          this.loading = false
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.dataList.data = this.dataList.data.concat(res.data.returnObject.list)
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
        }).catch((err) => {
          this.dataList.hasNext = false
        })
      },
    }
  }
</script>

<style lang="scss">
  #listFeatured {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
