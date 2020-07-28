<template>
  <div id="error" v-show="isAjaxError">
    <div class="noInfo" v-if="sort == 'noInfo'">
      <img :src="$image.prompt.searchNull" alt="">
      <p style="color:#ffb148">未获取到内容，请稍后再试！</p>
    </div>
    <!--<i class="el-icon-close" v-else></i>-->
    <div class="noInfo error500" v-else>
      <img :src="$image.prompt.error500" alt="">
      <p>服务器错误，刷新重试！</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'error',
    data () {
      return {}
    },
    props: {
      isAjaxError: {
        type: Boolean,
        default: true
      },
      sort: ''
    },
    methods: {},
    mounted () {
      var bodyH = document.body.offsetHeight
      var content = document.getElementById('contentLoading')
      content.style.lineHeight = bodyH + 'px'
    }
  }
</script>
<style lang="scss" scoped>
  #error {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    position: absolute;
    line-height: 800px;
    left: 0;
    top: 0;
    z-index: 9999;
    text-align: center;
    .noInfo {
      img {
        line-height: 1;
      }
      p{
        line-height: 1;
      }
    }
    i {
      font-size: 50px;
      color: #ffb148;
    }
    .error500 {
      line-height: 0;
      img{
        line-height: 0;margin-top: 300px;
      }
      p {
        color:#ffb148;line-height: 0;margin-top: 30px;
      }
    }
  }
</style>
