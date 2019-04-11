<template>
  <transition name="bounce">
    <div class="test-tab">
      <router-view/>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "test",
    data() {
      return {}
    }
  }
</script>

<style lang="scss">
  .test-tab {
    width: 100%;
    height: 100%;
    background-color: #5B5C64;
  }
</style>
