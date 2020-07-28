<template>
  <div id="companyManage">
    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane class="tabPane" label="公司基本信息" name="first">
          <div class="table-div">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="35%" class="demo-ruleForm">
              <el-form-item label="公司代码：" prop="companyCode">
                <el-input v-model="ruleForm.companyCode" clearable readonly></el-input>
              </el-form-item>
              <el-form-item label="公司全名：" prop="companyFullName">
                <el-input v-model="ruleForm.companyFullName" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司简称：" prop="companyName">
                <el-input v-model="ruleForm.companyName" clearable></el-input>
              </el-form-item>
              <el-form-item label="英文名称：" prop="englishName">
                <el-input v-model="ruleForm.englishName" clearable></el-input>
              </el-form-item>
              <el-form-item label="注册地址：" prop="registerAddress">
                <el-input v-model="ruleForm.registerAddress" clearable></el-input>
              </el-form-item>
              <el-form-item label="法定代表人：" prop="legalRepresentative">
                <el-input v-model="ruleForm.legalRepresentative" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司董秘：" prop="companySuperintend">
                <el-input v-model="ruleForm.companySuperintend" clearable></el-input>
              </el-form-item>
              <el-form-item label="注册资本（元）：" prop="registeredCapital">
                <el-input v-model="ruleForm.registeredCapital" clearable></el-input>
              </el-form-item>
              <el-form-item label="行业类型：" prop="industryType">
                <el-input v-model="ruleForm.industryType" clearable></el-input>
              </el-form-item>
              <el-form-item label="邮政编码：" prop="postalCode">
                <el-input v-model="ruleForm.postalCode" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司电话：" prop="companyTel">
                <el-input v-model="ruleForm.companyTel" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司传真：" prop="companyFax">
                <el-input v-model="ruleForm.companyFax" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司网址：" prop="companyUrl">
                <el-input v-model="ruleForm.companyUrl" clearable></el-input>
              </el-form-item>
              <el-form-item label="上市时间：" prop="listDate">
                <el-form-item prop="listDate">
                  <el-date-picker type="date" placeholder="选择上市日期" value-format="timestamp"
                                  format="yyyy-MM-dd" v-model="ruleForm.listDate"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="招股时间：" prop="raiseDate">
                <el-form-item prop="raiseDate">
                  <el-date-picker type="date" placeholder="选择招股日期" value-format="timestamp"
                                  format="yyyy-MM-dd" v-model="ruleForm.raiseDate"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="总股本（股）：" prop="equity">
                <el-input v-model="ruleForm.equity" clearable></el-input>
              </el-form-item>
              <el-form-item label="发行数量（股）：" prop="issueNumber">
                <el-input v-model="ruleForm.issueNumber" clearable></el-input>
              </el-form-item>
              <el-form-item label="发行价格（元）：" prop="issuePrice">
                <el-input v-model="ruleForm.issuePrice" clearable></el-input>
              </el-form-item>
              <el-form-item label="发行市盈率（倍）：" prop="peRatio">
                <el-input v-model="ruleForm.peRatio" clearable></el-input>
              </el-form-item>
              <el-form-item label="发行方式：" prop="issueWay">
                <el-input v-model="ruleForm.issueWay" clearable></el-input>
              </el-form-item>
              <el-form-item label="主承销商：" prop="leadUnderWriter">
                <el-input v-model="ruleForm.leadUnderWriter" clearable></el-input>
              </el-form-item>
              <el-form-item label="上市推荐人：" prop="listIntroducer">
                <el-input v-model="ruleForm.listIntroducer" clearable></el-input>
              </el-form-item>
              <el-form-item label="保荐机构：" prop="sponsorInstitution">
                <el-input v-model="ruleForm.sponsorInstitution" clearable></el-input>
              </el-form-item>
              <el-form-item class="btn-class">
                <el-button type="primary" @click="updateCompanyAccount()">保存</el-button>
                <el-button @click="dialogVisible = true">重置</el-button>
                <el-dialog
                  title="提示"
                  :visible.sync="dialogVisible"
                  width="30%">
                  <span>确定重置为初始数据吗？</span>
                  <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="resetForm()">确 定</el-button></span>
                </el-dialog>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--<router-link to="/userManage">userManage</router-link><br/>-->
      <!--<router-link to="/companyManage">{{name}}</router-link><br/>-->
      <!--<router-link to="/systemManage">systemManage</router-link><br/>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "companyManage",
    data() {
      return {
        userId: this.$cookie.get("userId"),
        name: 'companyManage',
        companyId: '239138382b8e4d0d85509aff4501cd5c',
        company: '',
        activeName: 'first',
        ruleForm: {
          id: '',
          companyCode: '',
          companyFullCode: '',
          companyName: '',
          companyFullName: '',
          englishName: '',
          registerAddress: '',
          legalRepresentative: '',
          companySuperintend: '',
          registeredCapital: '',
          industryType: '',
          postalCode: '',
          companyTel: '',
          companyFax: '',
          companyUrl: '',
          listDate: '',
          raiseDate: '',
          equity: '',
          issueNumber: '',
          issuePrice: '',
          peRatio: '',
          issueWay: '',
          leadUnderWriter: '',
          listIntroducer: '',
          sponsorInstitution: ''
        },
        rules: {
          companyCode: [
            {required: true, message: '请输入公司股票代码', trigger: 'blur'},
            {min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur'}
          ],
          companyFullName: [
            {required: true, message: '请输入公司全名', trigger: 'blur'}
          ],
          companyName: [
            {required: true, message: '请输入公司简称', trigger: 'blur'}
          ],
          totalCapitalStock: [
            {required: true, message: '请输入总股本', trigger: 'blur'}
          ]
          // date2: [
          //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          // ]
        },
        userData: {},
        dialogVisible: false
      }
    },
    created() {
      if (this.$cookie.get('userInfo')) {
        this.userData = window.JSON.parse(this.$cookie.get('userInfo'));
        console.log("用户信息-------------------", this.userData)
        if (this.userData.companyId === null || this.userData.companyId === '') {
          this.$message({showClose: true, type: 'error', message: '非企业用户，请先开通'})
          this.$router.push('/manage/account')
        } else if (!this.userData.enableState) {
          this.$message({showClose: true, type: 'error', message: '当前企业已被禁用'})
          this.$router.push('/manage/account')
        } else if (!this.userData.state) {
          this.$message({showClose: true, type: 'error', message: '您已被管理员禁用'})
          this.$router.push('/manage/account')
        } else {
          this.getByCompanyId()
        }
      }

    },
    methods: {
      // 获取企业信息
      getByCompanyId() {
        console.log(this.userData.companyId);
        this.$http({
          method: 'GET',
          url: this.$api.manage.companyInfo,
          params: {
            companyId: this.userData.companyId
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            this.ruleForm = res.data.returnObject;
            console.log("rootUserId", res.data.returnObject.rootUserId);
            console.log("userId", this.userId)
            if (res.data.returnObject.rootUserId !== this.userId) {
              this.$message({showClose: true, type: 'error', message: '非管理员！'})
              this.$router.push('/manage/account')
            }
          }
        })
      },
      // 编辑企业信息
      updateCompanyAccount() {
        let params = {
          adminUserId: this.userData.id,
          adminUserName: this.userData.userName,
          companyCode: this.ruleForm.companyCode,
          companyFax: this.ruleForm.companyFax,
          companyFullCode: this.ruleForm.companyFullCode,
          companyFullName: this.ruleForm.companyFullName,
          companyName: this.ruleForm.companyName,
          companySuperintend: this.ruleForm.companySuperintend,
          companyTel: this.ruleForm.companyTel,
          companyUrl: this.ruleForm.companyUrl,
          englishName: this.ruleForm.englishName,
          equity: this.ruleForm.equity,
          id: this.ruleForm.id,
          industryType: this.ruleForm.industryType,
          issueNumber: this.ruleForm.issueNumber,
          issuePrice: this.ruleForm.issuePrice,
          issueWay: this.ruleForm.issueWay,
          leadUnderWriter: this.ruleForm.leadUnderWriter,
          legalRepresentative: this.ruleForm.legalRepresentative,
          listDate: this.ruleForm.listDate,
          listIntroducer: this.ruleForm.listIntroducer,
          peRatio: this.ruleForm.peRatio,
          postalCode: this.ruleForm.postalCode,
          raiseDate: this.ruleForm.raiseDate,
          registerAddress: this.ruleForm.registerAddress,
          registeredCapital: this.ruleForm.registeredCapital,
          sponsorInstitution: this.ruleForm.sponsorInstitution
        }
        console.log("params", params);
        this.$http({
          method: 'POST',
          url: this.$api.manage.updateCompanyAccount,
          data: params
        }).then((res) => {
          console.log("res", res.data);
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '保存成功'})
          } else {
            this.$message({showClose: true, type: 'error', message: '添加失败'})
          }
        })
      },
      resetForm() {
        console.log("companyCode", this.ruleForm.companyCode);
        this.$http({
          method: 'GET',
          url: this.$api.manage.getByCompanyCode,
          params: {
            companyCode: this.ruleForm.companyCode
          }
        }).then((res) => {
          console.log(res.data.returnObject);
          if (res.data.returnCode === 1) {
            this.ruleForm.companyCode = res.data.returnObject.companyCode;
            this.ruleForm.companyFullCode = res.data.returnObject.companyFullCode;
            this.ruleForm.companyFullName = res.data.returnObject.companyFullName;
            this.ruleForm.companyName = res.data.returnObject.companyName;
            this.ruleForm.registerAddress = res.data.returnObject.registerAddress;
            this.ruleForm.legalRepresentative = res.data.returnObject.legalRepresentative;
            this.ruleForm.companySuperintend = res.data.returnObject.companySuperintend;
            this.ruleForm.registeredCapital = res.data.returnObject.registeredCapital;
            this.ruleForm.industryType = res.data.returnObject.industryType;
            this.ruleForm.postalCode = res.data.returnObject.postalCode;
            this.ruleForm.companyTel = res.data.returnObject.companyTel;
            this.ruleForm.companyFax = res.data.returnObject.companyFax;
            this.ruleForm.companyUrl = res.data.returnObject.companyUrl;
            this.ruleForm.listDate = res.data.returnObject.listDate;
            this.ruleForm.raiseDate = res.data.returnObject.raiseDate;
            this.ruleForm.equity = res.data.returnObject.equity;
            this.ruleForm.issueNumber = res.data.returnObject.issueNumber;
            this.ruleForm.issuePrice = res.data.returnObject.issuePrice;
            this.ruleForm.peRatio = res.data.returnObject.peRatio;
            this.ruleForm.issueWay = res.data.returnObject.issueWay;
            this.ruleForm.leadUnderWriter = res.data.returnObject.leadUnderWriter;
            this.ruleForm.listIntroducer = res.data.returnObject.listIntroducer;
            this.ruleForm.sponsorInstitution = res.data.returnObject.sponsorInstitution;
            this.ruleForm.englishName = res.data.returnObject.englishName;
            this.dialogVisible = false;
          }
        })
      }
    }

  }
</script>

<style lang="scss">
  #companyManage {
    min-height: 800px;
    .el-tabs__item {
      font-size: 16px;
    }
    .table-div {
      min-height: 600px;
      /*text-align: center;*/
      .el-input {
        width: 400px;
      }
      .el-date-editor {
        width: 400px;
      }
      .btn-class {
        margin-left: 120px;
      }
    }
  }
</style>
