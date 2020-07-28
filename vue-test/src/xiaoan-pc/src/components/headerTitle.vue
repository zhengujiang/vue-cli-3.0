<template>
  <div class="v-header-title">
    <h4>{{title}}</h4>
  </div>
</template>

<script>
  export default {
    name: "headerTitle",
    data() {
      return {}
    },
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  .v-header-title {
    h4 {
      width: 100px;
      height: 60px;
      line-height: 60px;
      margin: 0 auto;
      position: relative;
      &:before {
        position: absolute;
        content: '';
        width: 40px;
        height: 2px;
        background-color: #ffb148;
        top: 50%;
        left: -40px;
        transform: translateY(-50%);
      }
      &:after {
        position: absolute;
        content: '';
        width: 40px;
        height: 2px;
        background-color: #ffb148;
        top: 50%;
        right: -40px;
        transform: translateY(-50%);
      }
      text-align: center;
      color: #ffb148;
    }
  }
</style>
