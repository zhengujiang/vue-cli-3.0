<template>
  <div id="purchase">
    <header>
      <h4 class="card-title">当前套餐：个人免费版</h4>
      <div class="clearFix">
        <p style="float:left">为什么升级企业版？</p>
        <!-- <el-button type="primary" size='mini' style="float: right;margin-top: -8px" @click="gotoApply">创建新企业</el-button> -->
      </div>
    </header>
    <v-versionCompare :version="'person'"></v-versionCompare>
  </div>
</template>
<script>
import versionCompare from "@/view/user/components/versionCompare"
export default {
  name: "manage-purchase",
  data() {
    return {
    };
  },
  components: {
    'v-versionCompare': versionCompare
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    if (this.userInfo.enterpriseUser || this.userInfo.companyId) {
      this.$router.push('/manage/changeCompany')
    }
  },
  methods: {
    gotoApply() {
      if (this.userInfo.applyEnterprise) {
        this.$message({
          type: "warning",
          message: "已申请，请等待审核"
        });
      } else {
        this.$router.push("/manage/purchaseApplication");
      }
    }
  }
};
</script>
<style lang="scss">
#purchase {
  header {
    .card-title {
      padding: 0 0 0 8px;
      margin: 0;
      line-height: 1;
      border-left: solid 4px #ffb148;
      margin-bottom: 15px;
      font-weight: 600;
    }
    p {
      font-size: 14px;
      color: #8d8d8d;
    }
    margin-bottom: 10px;
  }
}
</style>
