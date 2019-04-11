<template>
  <div>
    <!--/pdf/-->
  </div>
</template>

<script>
  import loading from "../../components/warning/loading"

  export default {
    name: "rulesDemo",
    data() {
      return {
        pdfUrl: "/static/pdf/web/compressed.tracemonkey-pldi-09.pdf",
        pdfIframe: '/static/pdf/web/viewer.html?file=',
        isshowpdf: false,
        loading: false
      }
    },
    components: {
      "xiaoan-loading": loading
    },
    mounted() {
      let url = "/static/pdf/web/compressed.tracemonkey-pldi-09.pdf";
      url = encodeURI(url);
      this.pdfUrl = this.pdfIframe + url;

      this.loading = true;
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    methods: {}
  }
</script>

<style scoped>
  /* // @import "/static/pdf/web/viewer.css";
    @import "/static/pdf/web/locale/locale.properties";*/
</style>
