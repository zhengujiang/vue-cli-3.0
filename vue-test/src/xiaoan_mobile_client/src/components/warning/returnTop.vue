<template>
  <transition name="bounce">
    <div v-show="value" class="xiaoan-return-top" @click="returnTo" :style="style">
      <i class="icon iconfont icon-xiangshangjiantou"></i>
      <p>顶部</p>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "return-top",
    data() {
      return {}
    },
    props: {
      value: {
        type: Boolean,
        required: false,
        default: false
      },
      style: {
        type: String,
        required: false
      }
    },
    methods: {
      returnTo() {
        this.$emit('click');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .xiaoan-return-top {
    width: 45px;
    height: 45px;
    position: absolute;
    bottom: 75px;
    right: 25px;
    z-index: 10;
    text-align: center;
    padding: 5px 10px 0 10px;
    font-size: 0;
    box-sizing: border-box;
    border-radius: 50%;
    background: rgba(0, 0, 0, .44);
    color: #fff;
    overflow: hidden;
    i {
      color: white;
      font-weight: 600;
      font-size: 18px;
      margin-top: 5px;
    }
    p {
      font-size: 10px;
      line-height: 1;
    }
  }
</style>
