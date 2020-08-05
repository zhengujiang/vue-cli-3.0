<template>
  <iframe :src="isPDF(src)" :height="height" :width="width"></iframe>
</template>

<script>
  export default {
    name: 'iframe',
    data() {
      return {
        url: ''
      }
    },
    props: {
      src: {
        type: String,
        required: false,
        default: ''
      },
      height: {
        type: String,
        required: false,
        default: ''
      },
      width: {
        type: String,
        required: false,
        default: ''
      }
    },
    watch: {},
    mounted() {
    },
    methods: {
      isPDF(src) {
        console.log(src)
        var url = '';
        if (src.indexOf('static/pdf/web/viewer.html') > -1) {
          // src = 'http://localhost:8081/static/pdf/web/viewer.html'
          return `${src}?t=${Math.random()}`;
        } else {
          // var httpText = document.location.protocol == 'https:' ? 'https:' : 'http:'
          var httpText = 'https:' 
          url = httpText + '//' + src.split('://')[1]
          console.log(url)
          // url = 'https://' + src.split('://')[1]
          // return this.$api.host + 'static/pdf/web/viewer.html?file=' + url;
          console.log('2222', `../static/pdf/web/viewer.html?file=${url}?t=${Math.random()}`)
          console.log('2222', `${this.$api.host}static/pdf/web/viewer.html?file=${url}?t=${Math.random()}`)
          // url = 'http://118.190.217.108/test.pdf'
          // return `../static/pdf/web/viewer.html?file=${url}?t=${Math.random()}`
          return `http://118.190.217.108/pdf/web/viewer.html?file=${url}?t=${Math.random()}`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  iframe {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
    body {
      background: #fff;
    }
  }
</style>


