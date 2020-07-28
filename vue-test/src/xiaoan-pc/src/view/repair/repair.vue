<template>
  <div id="repair" class="content">
    <el-row class="repair-box" type="flex" justify="center">
      <el-col :span="12"><img class="img" src="https://oss.in-hope.cn/xiaoan/web_static/repair.png"></el-col>
      <el-col :span="12">
        <div>
          <div class="title">系统正在升级维护中！</div>
          <p class="info">建议您稍后再尝试打开。 <br/>给您带来不便，敬请谅解！</p>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    data() {
      return {
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
      let ch = document.body.clientHeight || 720
      document.querySelector('.repair-box').style.height = (ch - 220) + 'px'
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #repair {
    .repair-box {
      height: 500px;
      .img {
        width: 420px;
        margin: 0 0 0 150px;
      }
      .title {
        font-size: 30px;
        color: #323232;
        font-weight: 600;
        /*margin-top: 170px;*/
      }
      .info {
        font-size: 14px;
        color: #8D8D8D;
        /*margin-top: 10px;*/
      }
      .el-col-12 {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

  }
</style>
