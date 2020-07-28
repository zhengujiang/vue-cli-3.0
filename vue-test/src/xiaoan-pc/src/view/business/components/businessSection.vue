<template>
  <section class="business-section">
    <div class="vxa-flax-box flex-box">
      <div class="col t-left">
        <h4>{{title == '行业研究'?'行业分析':title}}</h4>
      </div>
      <div class="col t-right">
        <slot name="pagination"></slot>
      </div>
    </div>
    <div class="divider"></div>
    <slot name="content"></slot>
  </section>
</template>
<script>
  export default {
    name: "business-section",
    data() {
      return {};
    },
    props: {
      title: {
        type: String,
        default: ""
      }
    }
  };
</script>
<style scoped lang="scss">
  .business-section {
    /*margin-bottom: 20px;*/
    position: relative;
    .flex-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        line-height: 1;
        padding: 0px 10px;
        margin: 0;
        border-left: solid 4px #ffb148;
      }
    }

    .divider {
      margin: 20px 0;
      height: 0;
      border-bottom: solid 1px #e3e3e3;
    }
  }
</style>
