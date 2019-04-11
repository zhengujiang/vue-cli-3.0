<template>
  <div class="infinite-loading-drop">
    <p v-show="value">
      <span class="infinite-drop loading">
        <span class="xiaoan-spinner-snake"></span>
        <span class="text">{{nextText}}</span>
      </span>
    </p>
    <p v-show="!value">
      <span class="infinite-drop">
       <span class="infinite-drop-left"></span>
       <span>{{text}}</span>
       <span class="infinite-drop-right"></span>
      </span>
    </p>
  </div>
</template>
<script>
  export default {
    name: 'xiaoan-drop',
    data() {
      return {}
    },
    props: {
      value: {
        type: Boolean,
        required: false,//是否必填
        default: false
      },
      borderWidth: {
        type: String,
        required: false,//是否必填
        default: "20px",
      },
      text: {
        type: String,
        required: false,
        default: '没有更多了'
      },
      nextText: {
        type: String,
        required: false,
        default: '加载中...'
      }
    },
    mounted: function () {

    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .infinite-loading-drop {
    height: 45px;
    line-height: 45px;
    vertical-align: middle;
    text-align: center;
    background-color: transparent;
    p {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
  .infinite-drop {
    color: #aeaeae;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 14px;
    position: relative;
    .text {
      vertical-align: middle;
      color: #8d8d8d;
    }
  }
  .infinite-drop.loading {
    .text {
      vertical-align: middle;
    }
  }
  .infinite-drop .infinite-drop-left {
    display: inline-block;
    width: 20px;
    border-bottom: 1px solid #aeaeae;
    position: absolute;
    top: 9px;
    left: -23px;
  }
  .infinite-drop .infinite-drop-right {
    display: inline-block;
    width: 20px;
    border-bottom: 1px solid #aeaeae;
    position: absolute;
    top: 9px;
    right: -23px;
  }
  .xiaoan-spinner-snake {
    -webkit-animation: xiaoan-spinner-rotate 0.8s infinite linear;
    animation: xiaoan-spinner-rotate 0.8s infinite linear;
    border-radius: 50%;
    height: 14px;
    width: 14px;
    border: 2px solid transparent;
    border-top-color: #fcc77f;
    border-left-color: #fcc77f;
    border-bottom-color: #fcc77f;
    display: inline-block;
    vertical-align: middle;
  }
  @keyframes xiaoan-spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
