<template>
  <transition name="bounce">
    <div class="xiaoan-error">
      <img :src="errorImg" alt="">
      <div class="waringText">{{errorText}}</div>
      <button class="waringBtn" @click="waringBin()">{{errorBtn}}</button>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'xiaoan-error',
    data() {
      return {
        // "warningError": "../../static/img/warning/warnin.png",
      }
    },
    watch: {},
    props: {
      errorImg: {
        type: String,
        required: false, // 是否必填
        default: 'https://oss.in-hope.cn/xiaoan/h5_static/warning/warnin.png'
      },
      errorText: {
        type: String,
        required: false,
        default: "服务器错误，请刷新重试！"
      },
      errorBtn: {
        type: String,
        required: false,
        default: "刷新"
      }
    },
    mounted: function () {
    },
    methods: {
      waringBin() {
        window.location.reload();
      }
    }
  }
</script>

<style lang="scss">
  .bounce-enter-active {
    animation: bounce-in .3s;
  }
  .bounce-leave-active {
    animation: bounce-in .3s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @-o-keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
  @keyframes bounce-in {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }
</style>

<style scoped>
  .xiaoan-error {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    background-color: white;
    text-align: center;
  }
  .xiaoan-error img {
    height: 110px;
    width: 118.25px;
    margin: 38.2% auto 0 auto;
  }
  .xiaoan-error .waringText {
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #ffb148;
    margin: 20px 0 0 0;
    text-align: center;
  }
  .xiaoan-error .waringBtn {
    box-shadow: none;
    color: white;
    border: 0;
    width: 90px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    height: 30px;
    background: #ffb148;
    border-radius: 2px;
    font-size: 15px;
  }
</style>
