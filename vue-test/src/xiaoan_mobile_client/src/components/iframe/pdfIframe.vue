<template>
  <iframe :src="uri" :height="height" :width="width"></iframe>
</template>
<script>
  export default {
    name: 'vxa-pdf',
    props: {
      src: {
        type: String,
        required: false,// 是否必填
        default: "",
      },
      height: {
        type: String,
        required: false,// 是否必填
        default: "",
      },
      width: {
        type: String,
        required: false,// 是否必填
        default: "",
      }
    },
    watch: {},
    computed: {
      uri: function () {
        let url = '';
        if (this.src.indexOf('static/pdf/web/viewer.html') > -1) {
          url = this.src;
        } else {
          if (this.src) {
            url = `${this.$api.CURRENTIP.IP}static/pdf/web/viewer.html?file=${this.src}`
          } else {
            url = ``
          }
          // url = `http://local.in-hope.com.cn:8082/static/pdf/web/viewer.html`
        }
        return url
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>
  iframe {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
