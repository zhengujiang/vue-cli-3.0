<template>
  <div id="advertisement">
      <div class="top">
          <span class="line">——&nbsp;&nbsp;&nbsp;</span>
          <span class="partner">合作伙伴</span>
          <span class="line">&nbsp;&nbsp;&nbsp;——</span>
      </div>
      <div>
        <img src="/static/img/competition/advert.png" alt="">
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    };
  }
}
</script>
<style lang='scss' scoped>
  #advertisement {
    margin-top: 30px;
    .top {
      text-align: center;
      .line {
        color: #53535D;
      }
      .partner {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        line-height: 42px;
      }
    }
    img {
      display: inherit;
      margin: 0 auto;
      margin-bottom: 40px;
    }
  }
</style>