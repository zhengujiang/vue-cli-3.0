<template>
  <ul class="infinite-list" v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="loading" :infinite-scroll-distance="90">
    <li v-for="(item, index) in listData" :key="index" @click="goPublishDetaile(item)">
      <h2 class="title" v-html="item.title"></h2>
      <p class="desc" v-html="item.content"></p>
      <div class="vux-1px-b">
        <span v-if="item.industryLevelOne">{{item.industryLevelOne}} |</span>
        <span v-if="item.typeName">{{item.typeName }} |</span>
        <span>{{$const.format(item.releaseDate)}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "vxa-list",
    data() {
      return {}
    },
    props: {
      listData: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: true
      }
    },
    filters: {
      typeText: function (value) {
        let rtn = ''
        if (value == 1) {
          rtn = '招股说明书'
        } else if (value == 2) {
          rtn = '反馈意见'
        } else if (value == 3) {
          rtn = '关注问题'
        }
        return rtn
      },
      context: function (value) {
        // return value.replace(/\n/g, '').replace(/\s/g, '')
        if (value) {
          return value.replace(/\s/g, '')
        }
        return value
      }
    },
    created() {
    },
    methods: {
      goPublishDetaile(item) {
        console.log(item);
        this.$router.push({path: '/ipo/details', query: {id: item.id}})
      },
      loadMore() {
        this.$emit('loadMore', true);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .infinite-list {
    li {
      padding: 0 12px;
      background-color: #FFFFFF;
      &:active {
        background: #f0f1f5;
      }
      .title {
        font-size: 15px;
        box-sizing: border-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        color: #323232;
        overflow: hidden;
        text-overflow: clip;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        padding: 15px 0 0 0;
        margin-bottom: 5px;
        word-spacing: normal;
        .highlight {
          color: #ffc051;
        }
      }
      .desc {
        /*text-align: justify;*/
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #545454;
        word-break: break-all;
        margin-bottom: 6px;
        font-size: 13px;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        max-height: 36px;
        .highlight {
          color: #ffc051;
        }
      }
      div {
        color: #aeaeae;
        padding: 0 0 15px 0;
      }
    }
  }
</style>
<!--http://localhost:8800/#/rule-->
