<template>
  <div class="hint" v-show="isShow">
    <div class="hintImg">
      <img :src="imgSrc" alt="">
    </div>
    <div class="hintText">{{ message }}</div>
    <mt-button class="hintBtn" v-show="isShowBtn" @click="hintButton()">{{hintBtn}}</mt-button>
  </div>
</template>
<script>
  export default {
    name: "hint",
    data() {
      return {}
    },
    props: {
      imgSrc: {
        type: String,
        required: false,
        default: `https://oss.in-hope.cn/xiaoan/h5_static/report/noReportInfo.png?${Math.random()}`
      },
      message: {
        type: String,
        required: false,
        default: 'zhuye'
      },
      hintBtn: {
        type: String,
        required: false,
        default: '前往查看'
      },
      isShow: {
        type: Boolean,
        required: false,
        default: true
      },
      isShowBtn: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    methods: {
      //this.$emit('event'); $emit 将事件发射出去  子组件dom中@event=“gohome” gohome为methods里面的方法名
      hintButton() {
        this.$emit('event');
      }
    }
  }
</script>
<style scoped>
  .hint {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
  }
  .hintImg {
    width: 118.25px;
    margin: 0 auto;
    padding-top: 25%;
  }
  .hintImg img {
    width: 100%;
  }
  .hintText {
    font-size: 15px;
    color: #ffb148;
    text-align: center;
    margin-top: 30px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .hintBtn {
    box-shadow: none;
    color: white;
    border: 0;
    width: 90px;
    margin: 20px auto 0;
    position: absolute;
    left: 0;
    right: 0;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    height: 30px;
    font-size: 15px;
    line-height: 30px;
    text-align: center;
    background: #ffb148;
    border-radius: 2px;
  }
</style>
