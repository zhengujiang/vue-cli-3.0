<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
      <div class="dialog-header">{{title}}</div>
      <div class="dialog-content">
        <slot name="content">
          <div v-html="content"></div>
        </slot>
      </div>
      <div class="dialog-footer">
        <slot name="confirm"></slot>
        <div class="btn-area">
          <div v-if="type != 'confirm'" class="btn default-btn" @click="closeBtn">
              {{cancelText}}
          </div>
          <div v-if="type == 'danger'" class="btn danger-btn" @click="dangerBtn">
              {{dangerText}}
          </div>
          <div v-if="type == 'confirm'" class="btn confirm-btn" @click="confirmBtn">
              {{confirmText}}
          </div>
        </div>
      </div>
      <div class="ivu-modal-close" @click="closeMask"><i class="ivu-icon ivu-icon-ios-close"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    // 类型包括 defalut 默认， danger 危险， confirm 确认，
    type: {
      type: String,
      default: 'default'
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    dangerText: {
      type: String,
      default: '删除'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      showMask: true
    }
  },
  methods: {
    closeMask () {
      console.log(333333)
      this.showMask = false
    },
    closeBtn () {
      this.$emit('cancel')
      this.closeMask()
    },
    dangerBtn () {
      this.$emit('danger')
      this.closeMask()
    },
    confirmBtn () {
      this.$emit('confirm')
      this.closeMask()
    }
  },
  mounted () {
    this.showMask = this.value
  },
  watch: {
    value (newVal, oldVal) {
      this.showMask = newVal
    },
    showMask (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "./dialog.scss";
</style>
