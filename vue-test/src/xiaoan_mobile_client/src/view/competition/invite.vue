<template>
  <div id="comp-invite">
    <div class="header-image"></div>
    <div class="name"><span>这是用户昵...</span>正在参加董办知识竞赛，你也一起来参加吧！</div>
    <div class="award-image">
      <div class="backimg"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "invite",
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
  }
</script>

<style lang="scss">
  #comp-invite {
    .header-image {
      width: 375px;
      height: 153px;
      margin: 27px 0 18px;
    }
    .name {
      font-size: 13px;
      color: #FFDA01;
      margin-left: 20px;
      margin-bottom: 16px;
      span {
        color: #FFFFFF;
        margin-right: 13px;
      }
    }
    .award-image {
      width: 100%;
      height: 291px;
      padding: 0 20px;
      .backimg {
        width: 100%;
        height: 100%;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/invite_JL1X.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
  }
</style>
