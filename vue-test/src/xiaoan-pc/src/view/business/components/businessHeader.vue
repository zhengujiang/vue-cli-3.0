<template>
  <div class="business-header vxa-image-bg-affiche">
    <h4>{{title}}</h4>
  </div>
</template>
<script>
export default {
  name: "business-header",
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="scss">
.business-header {
  background-color: #f0f1f5;
  height: 90px;
  position: relative;
  background-size: cover;
  overflow: hidden;
  margin-bottom: 20px;
  h4 {
    width: 100px;
    height: 90px;
    line-height: 90px;
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
