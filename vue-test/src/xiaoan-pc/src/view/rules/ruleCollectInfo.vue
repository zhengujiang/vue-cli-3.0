<template>
  <div id="ruleCollectInfo">
    <div class="header vxa-image-bg-affiche">
      <div class="content ">
        <v-headerTitle :title="'法规汇编'"></v-headerTitle>
      </div>
    </div>
    <div class="content contentBox">
      <v-subscribeContent></v-subscribeContent>
    </div>

  </div>
</template>

<script>
  import subscribeContent from '@/view/user/subscribe/subscribeContent'
  export default {
    data() {
      return {
      }
    },
    // 使用其它组件
    components: {
      'v-subscribeContent': subscribeContent
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #ruleCollectInfo {
    min-height: 600px;
    .header {
      background-color: #f0f1f5;
      height: 60px;
      position: relative;
      background-size: cover;
      overflow: hidden;
    }
    .contentBox {
      padding-top:20px;
    }
  }
</style>
