<template>
  <div id="totalNum">
    <span>找到结果</span>
    <span class="num">{{totalNum}}</span>
    <span>条</span>
  </div>
</template>
<script>
export default {
  props: ['totalNum']
}
</script>
<style lang="scss" scoped>
  #totalNum {
    float: right;
    color: #8D8D8D;
    font-size: 14px;
    .num {
      color: #FFB148;
      margin: 0 8px;
    }
  }
</style>

