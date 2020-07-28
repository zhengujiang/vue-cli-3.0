<template>
  <el-card id="hotTopic" class="box-card" shadow="never">
    <div slot="header" class="header">
      <div>
        <img class="titleImg" :src="$image.xinhu.hotTopic">
        <span class="fleft">热门问题</span>
      </div>
      <div @click="getHotSearchWords" class="pointer">
        <span class="fright">换一批</span>
        <img :src="$image.xinhu.refresh">
      </div>
    </div>
    <ul class="listBox">
      <li class="item" v-for="(item,index) in data" @click="link(item)" :title="item">
        <span class="disc"></span>{{item}}
      </li>
    </ul>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        data: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.getHotSearchWords()
    },
    mounted() {
    },
    // 方法
    methods: {
      link(item) {
        this.$router.push({path: '/xhSearchResult', query: {word: item}});
      },
      getHotTopics() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getHotTopics,
          params: {
            number: 5
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.data = res.data.returnObject
          }
        })
      },
      getHotSearchWords() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getHotSearchWords,
          params: {
            pageNum: 1,
            pageSize: 5
          }
        }).then((res) => {
          if (res.data.returnCode === 200) {
            this.data = res.data.returnObject
//            if(this.$route.query.content){
//              this.hotSearchWords.unshift(this.$route.query.content)
//            }
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #hotTopic {
    width: 100%;
    min-height: 300px !important;
    padding: 0 12px 12px 12px;
    margin-bottom: 20px;
    .pointer {
      cursor: pointer;
    }
    .el-card__header {
      padding: 0;
    }
    .el-card__body {
      padding: 0;
      padding-top: 12px;
    }
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleImg {
        width: 23px;
      }
      div {
        display: flex;
        align-items: center;
      }
      .fleft {
        display: inline-block;
        margin-left: 5px;
      }
      .fright {
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
    .listBox {
      .item {
        font-size: 14px;
        color: #8d8d8d;
        // background-color: #f0f1f5;
        border-radius: 16px;
        padding: 5px 0;
        //margin-bottom: 5px;
        //margin-right: 10px;
        cursor: pointer;
        &:hover {
          color: #ffb148;
          .disc {
            background-color: #ffb148;
          }
        }
        .disc {
          display: inline-block;
          position: relative;
          top: -3px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #8d8d8d;
          margin-right: 5px;
        }
      }
    }
  }
</style>
