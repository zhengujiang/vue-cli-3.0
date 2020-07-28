<template>
  <div class="side-collect-box collectTitleInfo">
    <!--<div class="collectContent">-->
      <!--<my-collect v-if="display"></my-collect>-->
    <!--</div>-->
    <my-collect :info="info" :active="activeName" v-if="display" @changCollect="changCollect" @closeWindow="closeWindow"></my-collect>
    <team-collect :info="info" :active="activeName" v-if="!display" @changCollect="changCollect" @closeWindow="closeWindow"></team-collect>
    <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
    <!--<el-tab-pane label="个人收藏" name="my">-->
    <!--<my-collect :info="info" :active="activeName" v-if="display"></my-collect>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="团队收藏" name="team" v-if="userInfo.enterpriseUser">-->
    <!--<team-collect :info="info" :active="activeName" v-if="!display"></team-collect>-->
    <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  </div>
</template>

<script>
  import MyCollect from './components/myCollectItem.vue'
  import TeamCollect from './components/teamCollectItem.vue'

  export default {
    name: "side-collect-box",
    components: {
      MyCollect,
      TeamCollect
    },
    data() {
      return {
        value: '',
        collletTypeOpt: [
          {value: 0, label: '个人收藏'},
          {value: 1, label: '团队收藏'}
        ],
        activeName: 'my',
        userInfo: {},
        info: {},
        display: true
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
    },
    methods: {
      updatePrivacyStatus () {

      },
      handleClick(value) {
        console.log(value.name);
        if (value.name == 'my') {
          this.display = true;
        } else {
          this.display = false;
        }
        console.log(3434);
      },
      closeWindow() {
        this.$emit('isShow');
      },
      changCollect () {
        this.display = !this.display;
      }
    }
  }
</script>

<style lang="scss">
  .side-collect-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    .title {
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 45px;
      font-size: 14px;
      color: #323232;
      .el-dropdown {
        margin-left: 30px;
      }
      .select-note-type {
        width: 112px;
      }
      a:hover {
        font-weight: 600;
        color: #FFB148;
      }
      .el-icon-close {
        float: right;
        color: #8d8d8d;
        font-size: 20px;
        cursor: pointer;
      }
      .web-sanjiaoxing {
        color: #ffb148;
        font-size: 12px;
        margin-left: 5px;
        font-weight: 800;
      }
      .select-paragraph {
        width: 115px
      }
      .el-dropdown-link {
        font-size: 14px;
        height: auto;
        &:hover {
          font-weight: 600;
          color: #FFB148;
        }
      }
    }
    .collectContent {

    }
    .close-por {
      height: 40px;
      width: 40px;
      position: absolute;
      right: 14px;
      top: 8px;
      margin: auto;
      z-index: 1000;
      text-align: right;
      cursor: pointer;
      color: #8d8d8d;
      i {
        font-size: 20px;
        margin: 10px 0 0 0;
        color: #8d8d8d;
      }
    }
    .el-tabs {
      .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__item {
          font-size: 17px;
        }
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
  }
</style>
