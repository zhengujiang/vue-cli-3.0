<template>
  <transition name="bounce">
    <div class="documentation" id="documentation">
      <vxa-pdf :src="documentationUrl" v-if="$route.query.type == 'pdf'"></vxa-pdf>
      <vxa-word :src="documentationUrl" v-else></vxa-word>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "pdfReport",
    data() {
      return {
        documentationUrl: "",
        loaded: false,
        errored: false,
      }
    },
    components: {},
    created() {
      if (this.$route.query.type == 'pdf') {
        let protocol = document.location.protocol == 'https:' ? 'https:' : 'https:';
        let url = decodeURIComponent(this.$route.query.url).replace('http:', protocol).replace('https:', protocol);
        this.documentationUrl = this.$api.CURRENTIP.IP + "/static/pdf/web/viewer.html?file=" + url;
      } else if (this.$route.query.type == 'doc') {
        let html = decodeURIComponent(this.$route.query.url); // PDF链接
        this.documentationUrl = 'https://hk1-word-view.officeapps.live.com/wv/mWord.aspx?ui=zh-CN&rs=zh-CN&WOPISrc=http://hk1-view-wopi.wopi.live.net:808/oh/wopi/files/@/wFileId?wFileId=' + html + '&access_token_ttl=0&wdAccPdf=1&wdMobileHost=3';
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss">
  #documentation {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .documentation {
  }
</style>
