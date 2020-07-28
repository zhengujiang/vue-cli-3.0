<template>
  <div id="manage">
    <v-nav navIndex="4" :navCount="1">
      <template slot="slotMain">
        <div class="left">
          <div class="item" :class="{act:isActive==='account'}" @click="linkTo('account')">
            <span class="itemText">账号信息</span></div>
          <div class="item" :class="{act:isActive==='person'}" @click="linkTo('person')">
            <span class="itemText">个人信息</span></div>
          <div class="item" :class="{act:isActive==='purchase'}" v-if="userInfo.enterpriseUser || userInfo.companyId"
               @click="linkTo('changeCompany')">
            <span class="itemText">套餐选择</span>
          </div>
          <div class="item" :class="{act:isActive==='purchase'}" v-else @click="linkTo('purchase')">
            <span class="itemText">套餐选择</span>
          </div>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
      </template>
    </v-nav>
  </div>
</template>
<script>
  import nav from "./nav.vue";
  export default {
    data() {
      return {
        isActive: "account",
        userInfo: {}
      };
    },
    // 使用其它组件
    components: {
      "v-nav": nav
    },
    // 方法
    computed: {},
    watch: {
      $route(to, from) {
        this.setTab();
      }
    },
    methods: {
      linkTo(url) {
        this.$router.push("/manage/" + url);
      },
      setTab() {
        this.isActive = this.$route.meta.tabName;
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.setTab();
    },
    mounted() {
    }
  };
</script>
<style lang="scss">
  #manage {
    .right {
      .ruleForm {
        width: 520px;
      }
      // 错误提示位于左侧
      /*.el-form-item__error {
          left: 104%;
          top: 30%;
          width: 100%;
        }*/
      .space {
        padding-right: 10px;
      }
      .el-select {
        width: 100%;
      }
      .el-form-item.is-required .el-form-item__label:before {
        margin-left: 4px;
        float: right;
        position: relative;
        top: 3px;
      }
      .line {
        text-align: center;
        color: rgba(255, 255, 255, 0);
      }
      .subBtn {
        width: 240px;
        height: 40px;
      }
    }
  }
</style>
