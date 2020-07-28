<template>
  <div class="business" v-loading.fullscreen.lock="loading">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "business",
    data() {
      return {
        loading: true
      }
    },
    mounted() {
      setTimeout(() => {
        this.loading = false;
      }, 1200)
    }
  }
</script>

<style lang="scss">
  .business {
    min-height: 600px;
    background-color: #f6f6f6;
  }
</style>
