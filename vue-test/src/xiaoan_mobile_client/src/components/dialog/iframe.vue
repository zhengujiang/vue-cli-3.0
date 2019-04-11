<template>
  <iframe :src="src" :height="height" :width="width"></iframe>
</template>
<script>
  export default {
    name: 'iframe',
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
