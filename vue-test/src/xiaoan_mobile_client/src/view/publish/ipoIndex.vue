<template>
  <div id="ipoIndex">
      <router-view/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "ipo-index",
    data() {
      return {}
    },
    computed: {
      ...mapState({
        direction: state => state.mutations.direction,
      })
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #ipoIndex {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
</style>
