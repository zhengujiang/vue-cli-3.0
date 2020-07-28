<template>
  <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="regulatorDialog" width="30%" center custom-class="regulatorDialog">
    <span>你还未设置监管公司，前往设置。</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="goSetCompany">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'regulatorDialog',
    data() {
      return {
        // dialogVisible: false
      }
    },
    props: {
      regulatorDialog: {
        type: Boolean,
        default: false
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      goSetCompany () {
        this.$router.push('/dashboard/regulator')
      }
    }
  }
</script>

<style lang="scss">
  .regulatorDialog {
    .el-dialog__header {
      padding: 10px;
      border-bottom: 1px solid #e3e3e3;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog--center .el-dialog__body {
      padding: 25px;
    }
    .el-dialog__footer {
      padding: 0 10px 20px;
    }
  }

</style>
