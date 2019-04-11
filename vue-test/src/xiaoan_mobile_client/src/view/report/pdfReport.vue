<template>
  <transition name="bounce">
    <div class="pdfReport" id="pdfReport">
      <vxa-pdf :src="pdfUrl"></vxa-pdf>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "pdfReport",
    data() {
      return {
        pdfUrl: "",
        loaded: false,
        errored: false,
        affId: ''
      }
    },
    components: {
    },
    created() {
      this.affId = this.$route.query.id;
      window.document.title = decodeURIComponent(this.$route.query.title);
    },
    mounted() {
      let protocol = document.location.protocol == 'https:' ? 'https:' : 'https:';
      let url = decodeURI(this.$route.query.url).replace('http:', protocol).replace('https:', protocol);
      this.pdfUrl = url;
      /**************************************/
      this.$weixin.wxconfig(this);  // 11.1 修改  wx。config调用
      let adverttitle = decodeURI(window.document.title);
      let sharelink2 = decodeURI(this.$api.CURRENTIP.IP + '#/detailReport?id=' + this.affId);// 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {}
  }
</script>

<style lang="scss">
  #pdfReport {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
</style>
