<template>
  <div class="pdfReport" id="pdfReport">
    <v-iframe :src="pdfUrl"></v-iframe>
  </div>
</template>

<script>
  import iframe from '../../components/iframe.vue'

  export default {
    name: 'pdfReport',
    data() {
      return {
        pdfUrl: 'src/view/affiche/abc1.pdf',
        pdfIframe: 'abc',
        loaded: false,
        errored: false
      }
    },
    components: {
      'v-iframe': iframe
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        let height = document.documentElement.clientHeight;
        document.querySelector('.pdfReport').style.height = `${height}px`
      })
      window.document.title = this.$route.query.title;
      let url = this.$route.query.url;
      if (this.$route.query.url || this.$route.query.file) {
        url = this.$route.query.url || this.$route.query.file;
      }
      this.pdfUrl = `${url}`
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #pdfReport, .pdfReport {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
