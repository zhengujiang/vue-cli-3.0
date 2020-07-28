<template>
  <div id="side-collect-box">
      <span class="close-por" @click="closeWindow">
        <i class="el-icon-close"></i>
      </span>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人收藏" name="my">
        <my-collect :info="info" :active="activeName"></my-collect>
      </el-tab-pane>
      <el-tab-pane label="团队收藏" name="team" v-if="userInfo.enterpriseUser">
        <team-collect :info="info" :active="activeName"></team-collect>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import MyCollect from '@/components/collect/myCollectItem.vue'
  import TeamCollect from '@/components/collect/teamCollectItem.vue'
  export default {
    name: "side-collect-box",
    components: {
      MyCollect,
      TeamCollect,
      // 新增加的
      info: {
        id:"cfc7ff984fec494097c29459f2e90eb0",
        time:1533484800000,
        timeliness:"现行有效",
        title:"关于修改《上海证券交易所风险警示板股票交易管理办法》第八条的通知",
        type:"law"
      }
    },
    data() {
      return {
        activeName: 'my',
        userInfo: {}
      }
    },
    props: {
      info: {
        type: Object
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
    },
    methods: {
      handleClick() {

      },
      closeWindow() {
        this.$emit('closeWindow')
      }
    }
  }
</script>

<style lang="scss">
  #side-collect-box {
    position: relative;
    .close-por {
      height: 40px;
      width: 40px;
      position: absolute;
      right: 0;
      top: 0;
      margin: auto;
      z-index: 1000;
      text-align: right;
      i {
        font-size: 20px;
        margin: 10px 0 0 0;
      }
    }
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
  }
</style>
