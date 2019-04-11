<template>
  <div class="xinhulist" @click="handleClick(item)">
    <div class="title fb" v-html="item.questionTitle"></div>
    <div class="else" >
      <span>{{formatDataT(item.createTime)}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'inviteList',
    data() {
      return {
      }
    },
    props: {
      item: {
        type: Object,
        default: function() {
          return {};
        }
      }
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
      formatDataT (date) {
        // let dateObj = JSON.parse(date).updateTime
        let dateObj = this.$const.format(date)
        return dateObj
      },
      // 没有答案跳转问题页，有答案跳转答案页
      handleClick (evt) {
        this.$router.push({path: '/xhQuestionDetaile', query: {questionId: evt.questionId}})
      }
    }
  }
</script>

<style lang="scss">
  .xhqPadding {
    padding: 3px 10px !important;
  }
  .xinhulist {
    margin-bottom: 7.5px;
    padding: 12px;
    background-color: #fff;
    width:100%;
    &:last-child {
      margin-bottom: 0;
    }
    .title {
      margin-bottom: 5px;
      font-size: 15px;
      color: #323232;
      text-align: justify;
      font-family: PingFangSC-Medium;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .desc {
      margin-bottom: 5px;
      font-size: 13px;
      color:#545454;
      text-align: justify;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .else {
      color:#aeaeae;
      span {
        display: inline-block;font-size: 12px;
      }
      .split {
        display: inline-block;
        padding: 0 .1px;
        margin:0;
      }
    }
  }
</style>
