<template>
  <transition name="bounce">
    <div class="xa-error">
      <img :src="img" alt="">
      <div class="waringText">{{text}}</div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "xa-error",
    data() {
      return {
        img: this.$image.warning.shixiaolianjie,
        text: '该链接已失效！',
        show: 0,
      }
    },
    created() {
      if (this.$route.query.text == '' || this.$route.query.text == null || this.$route.query.text == undefined) {
      } else {
        this.text = this.$route.query.text;
      }
      //
      if (this.$route.query.img == '' || this.$route.query.img == null || this.$route.query.img == undefined) {
      } else {
        this.img = this.$route.query.img;
      }
      //
      if (this.$route.query.show == '' || this.$route.query.show == null || this.$route.query.show == undefined) {
      } else {
        this.show = this.$route.query.show;
        if (this.show == '1') {
          // 非测试用户
          let _this = this;
          this.$vux.confirm.show({
            title: '',
            content: '该功能暂时只对内测用户开放',
            // 组件除show外的属性
            onConfirm() {
              _this.$router.replace({path: '/home'});
            },
            onCancel() {
              _this.$router.replace({path: '/home'});
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .xa-error {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    background-color: white;
    text-align: center;
    img {
      height: 110px;
      width: 118.25px;
      margin: 38.2% auto 0 auto;
    }
    .waringText {
      font-size: 15px;
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      color: #ffb148;
      margin: 20px 0 0 0;
      text-align: center;
    }
  }
</style>
