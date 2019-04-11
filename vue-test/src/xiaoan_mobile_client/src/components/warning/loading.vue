<template>
  <!--回到主页-->
  <transition name="bounce">
    <div class="getLoading" :style="{color:textColor,backgroundColor:bgColor,
         bottom:bottom,position:position,zIndex:zIndex}">
      <div class="snake-circle" :style="{width:width,height:width,borderWidth:borderWidth}"></div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "xiaoan-loading",
    data() {
      return {
        text: "加载中..."
      }
    },
    props: {
      textColor: {
        type: String,
        required: false,
        default: "#fff",
      },
      bgColor: {
        type: String,
        required: false,
        default: "rgba(255, 255, 255, 1)", /*rgba(0,0,0,.44)*/
      },
      position: {
        type: String,
        default: "absolute",
      },
      width: {
        type: String,
        default: "14px"
      },
      bottom: "", zIndex: "", borderWidth: ""
    },
    methods: {},
    watch: {}
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
  .getLoading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    background: rgba(255, 255, 255, 1);
    line-height: 50%;
    z-index: 3000;
  }
  .getLoading .snake-circle {
    height: 15px;
    width: 15px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(252, 199, 127);
    border-left-color: rgb(252, 199, 127);
    border-bottom-color: rgb(252, 199, 127);
    position: absolute;
    left: 50%;
    top: 50%;
    box-sizing: border-box;
    margin-left: -7.5px;
    margin-top: -7.5px;
  }
  @keyframes snake-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
