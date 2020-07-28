<template>
  <div id="topHeader">
    <div class="content">
      <div class="title">
        <p>{{title}}</p>
      </div>
      <p class="inner">这是对当前页面的介绍这是对当前页面的介绍这是对当前页面的介绍这是对当前页面的介绍这是对当前页面的介绍这是对当前页面的介绍，包含标点符号共74个全角字符</p>
      <ul>
        <li v-for="(item, index) in bar" :key="index" :class="{active: item.active}" @click="handleClick(index)">
          {{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "IncentiveObject",
    components: {},
    data() {
      return {
        bar: [
          {name: '我的股权激励', type: ['myEquityIncentive'], active: true, link: '/IncentiveObject/myEquityIncentive'},
          {name: '问答', type: ['myquestionsAndAnswers'], active: true, link: '/IncentiveObject/myquestionsAndAnswers'}
        ],
        title: ''
      }
    },
    created() {
      this.isActive()
    },
    watch: {
      $route() {
        this.isActive()
      }
    },
    methods: {
      handleClick(index) {
        this.title = this.bar[index].name
        this.bar.forEach((item) => {
          item.active = false
        })
        this.bar[index].active = true
        this.$router.push({path: this.bar[index].link})
      },
      isActive() {
        this.bar.forEach((item) => {
          item.active = false;
          if (item.type.indexOf(this.$route.meta.tabName) !== -1) {
            this.title = item.name
            item.active = true
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #topHeader {
    width: 100%;
    height: 166px;
    background-image: url(https://oss.in-hope.cn/xiaoan/web_static/financeBack.jpg);
    background-size: 100% 100%;
    .title {
      p {
        font-size:30px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,255,255,1);
        line-height:42px;
        padding: 32px 0 4px;
      }
    }
    .inner {
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-bottom: 26px;
      line-height: 20px;
    }
    ul {
      height: 42px;
      clear: both;
      overflow: hidden;
      li {
        width:168px;
        float: left;
        height:42px;
        background:rgba(255,255,255,0.08);
        font-size:16px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 42px;
        text-align: center;
        margin-right: 1px;
        &.active {
          color:rgba(255,177,72,1);
          border-bottom: 1px solid #FFB148;
        }
      }
    }
  }
</style>
