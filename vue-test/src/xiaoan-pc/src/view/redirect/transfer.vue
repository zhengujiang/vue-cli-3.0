<template>
  <div></div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    // 生命周期函数
    created() {
      let url = this.$route.query.url
      console.log('transfer:' + url)
      if (url) {
        this.$router.replace(url)
      }
    },
    // 方法
    methods: {}
  }
</script>
