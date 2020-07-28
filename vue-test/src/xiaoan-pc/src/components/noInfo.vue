<template>
  <transition name="el-fade-in-linear">
    <div class="noInfo" :class="{'mini': size=='mini'}">
      <img class="nocollect defaultImg" :src="imgSrc">
      <p>{{altText}}</p>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'noInfo',
    props: {
      altText: {
        type: String,
        default: '暂时没有内容'
      },
      size: {
        type: String,
        default: ''
      },
      imgSrc: {
        type: String,
        default: 'http://oss.in-hope.cn/enterpriseApply/6a82fe59d43d432c8adafc528f7ec186.png'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .noInfo {
    width: 100%;
    height: 100%;
    min-height: 450px;
    font-size: 50px;
    color: #ffb148;
    text-align: center;
    padding-top: 80px;
    opacity: .8;
    p {
      font-size: 14px;
      height: 20px;
      margin: 0;
      padding: 0;
      opacity: 0.6;
    }

  }
  .mini {
    min-height: 250px;
  }
</style>
