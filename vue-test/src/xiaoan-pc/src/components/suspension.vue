<template>
  <div id="suspension">
    <el-popover
      ref="popover1"
      placement="right"
      title="基本信息"
      width="250"
      trigger="click"
      popper-class="basicInfo">
      <ul>
        <li v-for="(list, index) in basicInfo" :key="index">
          <span v-html="list.title"></span>
          <span>{{ list.doc }}</span>
        </li>
      </ul>
    </el-popover>
    <el-popover
      ref="popover2"
      placement="right"
      title="目录"
      width="200"
      trigger="click"
      popper-class="muluScreen">
      <ul>
        <li v-for="(list, index) in muluInfo" :key="index" @click="linkMulu(index)">
          <span v-html="list.title"></span>
        </li>
      </ul>
    </el-popover>
    <div class="iconBox">
      <i class="iconfont web-jibenxinxi" v-popover:popover1></i>
    </div>
    <div class="iconBox">
      <i class="iconfont web-mulu" v-popover:popover2></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'suspension',
    data () {
      return {}
    },
    watch: {},
    props: {

      basicInfo: {
        type: Array,
        default: [
          {title: '发布日期：', doc: ''},
          {title: '生效日期：', doc: ''}
        ]
      },
      muluInfo: {
        type: Array,
        default: [
          {title: '发布日期：', doc: ''},
          {title: '生效日期：', doc: ''}
        ]
      }
    },
    methods: {
      linkMulu (index) {
        this.$emit('linkMulu', index)
      }
    }
  }
</script>
<style lang="scss">
  #suspension {
    width: 40px;
    height: 70px;
    position: fixed;
    top: 80px;
    left: 0px;
    .iconBox {
      display: block;
      color: #ffb148;
      text-align: center;
      line-height: 35px;
      background: #fff;
      i {
        font-size: 20px;
      }
    }
  }

  .basicInfo, .muluScreen {
    .popper__arrow {
      display: none !important;
    }
  }
</style>
