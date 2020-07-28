<template>
  <div class="xhNoInfo" v-show="show">
    <img :src="imgUrl">
    <div class="text">{{altText}}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: false
      }
    },
    props: {
      altText: {
        type: String,
        default: '暂无信息'
      },
      imgUrl: {
        type: String,
        default: this.$image.prompt.noInfo
      }
    },
    // 使用其它组件
    components: {
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      setTimeout(() => {
        this.show = true
      }, 1000)
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  .xhNoInfo {
    width:100%;
    text-align: center;
    background-color: #fff;
    padding: 20px;
    line-height: 40px;
    .text {
      line-height: 40px;
      color:#ffb148;
      font-size: 14px;
    }
    img {
      width:200px;
    }
  }
</style>
