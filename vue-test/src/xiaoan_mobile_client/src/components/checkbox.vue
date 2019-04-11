<template>
  <label class="vxa-checkbox" :class="{'is-selected': show}" :style="style">
    <i class="icon iconfont icon-checkbox" v-if="show" :style="'checkbox-style'"></i>
  </label>
</template>

<script>
  export default {
    name: "vxa-checkbox",
    components: {},
    data() {
      return {}
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      'checkbox-style': [Object, String],
      style: [Object, String]
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .vxa-checkbox {
    line-height: 1;
    font-size: 0;
    display: flex;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 16px;
    width: 16px;
    background-color: #f0f1f5;
    border-radius: 2px;
    transition: all .3s;
    &.is-selected {
      background-color: transparent;
      transition: all .3s;
    }
    .icon-checkbox {
      color: #ffb148;
      flex: 1;
      font-size: 17px;
      transition: all .3s;
    }
  }
</style>
