<template>
  <transition name="bounce">
    <div class="xa-box-shadow" :style="{color:color,backgroundColor:backgroundColor,
        bottom:bottom,position:position,zIndex:zIndex}" @click="clickt()">
    </div>
  </transition>
</template>

<script>
  export default {
    name: "shadow",
    data() {
      return {}
    },
    props: {
      color: {
        type: String,
        required: false,
        default: "#fff",
      },
      backgroundColor: {
        type: String,
        required: false,
        default: "rgba(255, 255, 255, 0.44)", /*rgba(0,0,0,.44)*/
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
    methods: {
      //this.$emit('event'); $emit 将事件发射出去  子组件dom中@event=“gohome” gohome为methods里面的方法名
      clickt() {
        this.$emit('click');
      }
    }
  }
</script>

<style lang="scss">
  .xa-box-shadow {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    z-index: 2800;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-filter: blur(0);
    filter: blur(0);
  }
  .bounce-enter-active {
    animation: bounce-in .4s;
  }
  .bounce-leave-active {
    animation: bounce-in .4s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      opacity: 0;
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
