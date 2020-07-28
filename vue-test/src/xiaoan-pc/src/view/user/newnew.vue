<template>
  <div id="change-company">
    <header>
      <h4 class="card-title"><span>当前套餐：{{userInfo.enterpriseCompanyName}} 标准企业版 </span><span v-if="userInfo.root" class="role">管理员</span></h4>
    </header>
    <div class="card-box">
      <el-row :gutter="20" style="width:100%">
        <el-col :span="12" v-for="(item, index) in companyList" :key="index">
          <div class="enterprise-box" :class="{'is-active':userInfo.companyId == item.id}">
            <p class="title">{{item.companyFullName}}({{item.companyCode}})<span class="role" v-if="userInfo.id == item.rootUserId">管理员</span></p>
            <p class="text">成员数量 ：{{item.userCount}}/{{item.userLimit}}人<span v-if="userInfo.id == item.rootUserId">，剩余<span class="highlight">{{item.inviteCount}}</span>人可邀请</span>
            <p class="text">有效期至{{$common.transTime(item.endDate)[0]}} ，剩余<span class="highlight">{{remainTime(item)}}</span>天</p>
            <div class="btn-group">
                <el-tag type="info" size="small" class="expire-tag" v-if="remainTime(item)==0">已到期</el-tag>
                <el-button type="primary" size='mini' @click="switchEnterprise(item.id)" v-if="userInfo.companyId != item.id && remainTime(item)!=0">切换</el-button>
                <el-button type="primary" size='mini' @click="renew(item)">续费</el-button>
                <el-button v-if="userInfo.id != item.rootUserId" type="primary" plain size='mini' @click="quit(item)">退出</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="border-bottom">
      <h4 class="card-title"><span>套餐对比</span></h4>
    </div>
    <v-versionCompare :version="'enterprise'"></v-versionCompare>
    <verification v-if="isVisible" :isVisible='isVisible' @cancel="closeVerifiDialog" @check="handleCheck" @sent="handleSent" title="请输入验证码"></verification>
    <el-dialog class="dialog-class" title="续费" :visible.sync="dialogVisible" width="620px">
      <div class="renew-company">
        <p>企业名称：&nbsp;{{userInfo.enterpriseCompanyName}}&nbsp;{{itemData.companyCode}}</p>
        <p>方案名称：&nbsp;企业版 </p>
        <p>方案时长：&nbsp;年付 </p>
        <p>方案价格：&nbsp;<span id="span-two">￥9999&nbsp;</span><span class="span-one">￥</span><span class="span">29999</span></p>
        <p>到期时间：&nbsp;{{newdate}}</p>
      </div>
      <div class="bank-account">
        <p class="order">点击提交订单后，客服人员会在1-2个工作日内联系您注册的手机号码。</p>
        <p class="remit">您还可以通过银行汇款的方式进行充值，以下是具体信息：</p>
        <p class="account">账户名称：&nbsp;上海信公印诚信息技术有限公司</p>
        <p class="bank">开户银行：&nbsp;中国银行上海市延安东路支行</p>
        <p class="bank-number">银行账户：&nbsp;457268920707</p>
        <el-button class="commit-button" type="primary" size='mini' width="100px" @click="addEnterpriseOrder">提交订单</el-button>
        <p class="invoice">如果您需要开具发票，请联系客服人员</p>
      </div>
    </el-dialog>
    <el-dialog class="dialog-class dialog-class-one" title="已收到您的续费申请" :visible.sync="centerDialogVisible" width="620px" top="30vh" >
      <div class="renew-apply">
        <p class="service">客服人员会在1-2个工作日内联系您！</p>
        <el-button class="commit-button-one" type="primary" size='mini' @click="centerDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import verification from "@/components/verification";
import versionCompare from "@/view/user/components/versionCompare"
import moment from "moment";
export default {
  components: {
    verification,
    'v-versionCompare': versionCompare
  },
  data() {
    return {
      userInfo: {},
      companyList: [],
      isVisible: false,
      companyId: "",
      companyName: "",
      dialogVisible: false,
      centerDialogVisible: false,
      newdate:"",
      itemData:{}
    };
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    this.getCompanyByUser();
  },
  methods: {
    renew(item) {
      this.dialogVisible = true;
      var dt = item.endDate;
      var d = new Date();
      d.setTime(dt);
      var year = d.getFullYear() + 1;
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var ttt = year + "-" + month + "-" + day;
      this.newdate = ttt;
      this.itemData = item;
    },
    getCompanyByUser() {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$api.enterpriseCompany.getCompanyByUser,
          method: "get",
          params: {
            userId: this.userInfo.id
          }
        })
          .then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              // 当前企业默认排第一
              if (res.data.returnObject.length !== 0) {
                this.companyList = res.data.returnObject.sort(
                  (x, y) =>
                    x.id == this.userInfo.companyId
                      ? -1
                      : y.id == this.userInfo.companyId ? 1 : 0
                );
              } else {
                this.companyList = [];
              }
            } else {
              this.companyList = [];
            }
            resolve("success");
          })
          .catch(reject);
      });
    },
    remainTime(item) {
      let time = -moment().diff(
        this.$common.transTime(item.endDate)[1],
        "days"
      );
      return time < 0 ? 0 : time;
    },
    switchEnterprise(id) {
      this.$http({
        url: this.$api.enterpriseCompany.changeCompany,
        method: "post",
        params: {
          userId: this.userInfo.id,
          companyId: id
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.$message({
            showClose: true,
            type: "success",
            duration: 3000,
            message: "切换成功"
          });
          this.$auth.reSetUserStore(this);
          setTimeout(() => {
            this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
            this.getCompanyByUser();
          }, 500);
        }
      });
    },
    exitCompany() {
      this.$http({
        url: this.$api.enterpriseCompany.exitCompany,
        method: "post",
        params: {
          userId: this.userInfo.id,
          companyId: this.companyId
        }
      })
        .then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({
              showClose: true,
              type: "success",
              duration: 3000,
              message: "退出成功"
            });
            this.$auth.reSetUserStore(this);
            // 如果还有企业，自动切换一家，如果没有，降级为个人用户
            let _this = this;
            setTimeout(() => {
              _this
                .getCompanyByUser()
                .then(res => {
                  console.log(res);
                  if (_this.companyList.length > 0) {
                    _this.switchEnterprise(_this.companyList[0].id);
                  } else {
                    // _this.$router.replace("/manage/purchase");
                    location.href = '/manage/purchase'
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }, 500);
          }
          if (res.data.returnCode == 201) {
            this.$message({
              showClose: true,
              type: "error",
              duration: 3000,
              message: "管理员不可退出"
            });
          }
        })
        .catch(err => {});
    },
    quit(company) {
      console.log(company);
      this.$confirm(`确认退出${company.companyFullName}？`, "提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isVisible = true;
          this.companyId = company.id;
          this.companyName = company.companyFullName;
          // this.exitCompany();
        })
        .catch(() => {});
    },
    closeVerifiDialog(e) {
      this.isVisible = false;
    },
    handleCheck(e) {
      this.$http({
        url: this.$api.enterpriseCompany.exitCompany,
        method: "post",
        params: {
          userId: this.userInfo.id,
          companyId: this.companyId,
          code: e.code
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.$message({
            message: "成功退出",
            type: "success",
            showClose: true
          });
          this.isVisible = false
          this.$auth.reSetUserStore(this);
          // 如果还有企业，自动切换一家，如果没有，降级为个人用户
          let _this = this;
          setTimeout(() => {
            _this
              .getCompanyByUser()
              .then(res => {
                console.log(res);
                if (_this.companyList.length > 0) {
                  _this.switchEnterprise(_this.companyList[0].id);
                } else {
                  // _this.$router.replace("/manage/purchase");
                  location.href = '/manage/purchase'
                }
              })
              .catch(err => {
                console.log(err);
              });
          }, 500);
        } else if (res.data.returnCode == 201) {
          this.$message({
            showClose: true,
            type: "error",
            duration: 3000,
            message: "管理员不可退出"
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            duration: 3000,
            message: "验证码错误，请重试"
          });
        }
      });
    },
    handleSent(e) {
      console.log("sent");
      this.$http({
        url: this.$api.enterpriseCompany.sendExitSms,
        method: "POST",
        params: {
          userId: this.userInfo.id,
          companyName: this.companyName
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.$message({
            message: "信息已发送",
            type: "success",
            showClose: true
          });
        }
      });
    },
    addEnterpriseOrder() {
      this.$http({
        url: this.$api.enterpriseCompany.addEnterpriseOrder,
        method: "post",
        params: {
          companyId: this.userInfo.companyId,
          planName:'企业版',
          planTime:'年付',
          planPrice:'9999',
          userId: this.userInfo.id
        }
      }).then(res => { 
          this.dialogVisible = false;
          setTimeout(() => {
            this.centerDialogVisible = true;
            }, 500)  
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss">
#change-company {
  .card-title {
     padding: 0 0 0 8px;
     margin: 0;
     line-height: 1;
     border-left: solid 4px #ffb148;
     margin-bottom: 15px;
     font-weight: 600;
     display: flex;
     align-items: center;
   }
  .border-bottom {
    border-bottom: 1px solid #e3e3e3;
  }
  .card-box {
    padding: 10px 0;
    border-top: 1px solid #ebeef5;
    .enterprise-box {
      margin: 10px;
      width: 100%;
      padding: 15px 20px;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      height: 150px;
      &.is-active {
        background-color: #fff7ed;
        border-color: #ffb148;
      }
      .title {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .text {
        font-size: 14px;
        color: #909399;
      }
      .btn-group {
        margin-top: 10px;
      }
      .highlight {
        color: #ffb148;
      }
    }
    .expire-tag {
      height: 28px;
      line-height: 28px;
      padding: 0 8px;
    }
  }
  .role {
    display: inline-block;
    margin-left: 4px;
    padding: 4px 6px;
    font-size: 10px;
    font-weight: 400;
    border-radius: 4px;
    color: #fff;
    transform: scale(0.8);
    background-color: #ff7b35;
  }
  .dialog-class{
    .el-dialog__header{
      height:50px;
      position: relative;
      .el-dialog__close{
        position: relative;
        top:-4px;
      }
    }
    .el-dialog__title{
      color:#ffb148;
      font-size:16px;
      line-height:22px;
      position:absolute;
      top:50%;
      left:50%;
      margin: -10px 0 0 -16px;
    }
    .renew-company{
      height: 198px;
      border-top: 1px solid #E3E3E3 ;
      border-bottom: 1px solid #E3E3E3 ;
      p{
        margin: 18px 0 18px 50px;
        font-size: 12px;
        color: #545454;
      }
      #span-two{
        font-size: 16px;
        color: #FFB148;
      }
      .span-one{
        color:#CFCFCF;
      } 
      .span{
        color:#CFCFCF;
        text-decoration: line-through;
      }
    }
    .bank-account{
      height:309px;
      padding: 0;
      position: relative;
      .order{
        font-size: 16px;
        color:#FFB148;
        position: absolute;
        top:31px;
        left:50px;
      }
      p{
        font-size: 12px;
        color: #545454;
      } 
      .remit{
        position: absolute;
        left: 50px;
        top:65px;
        color:#818181;
      }
      .account{
        position: absolute;
        left: 50px;
        top:100px;
      }
      .bank{
        position: absolute;
        left: 50px;
        top:135px;
      }
      .bank-number{
        position: absolute;
        left: 50px;
        top:170px;
      }
      .invoice{
        color: #CFCFCF;
        position: absolute;
        left:204px;
        bottom: 25px;
      }
      .commit-button{
        display: inline-block;
        font-size: 16px;
        width: 200px;
        height: 35px;
        position: absolute;
        left:206px;
        bottom: 45px;
      }
    }
  }
  .dialog-class-one{
    .el-dialog__title{
     margin: -11px 0 0 -72px
    }
    .renew-apply{
      height: 125px;
      border-top: 1px solid #E3E3E3 ;
      position: relative;
    }
    .service{
      font-size:16px;
      color: #323232;
      position: absolute;
      left: 180px;
      top: 24px;
      line-height: 22px;
    }
    .commit-button-one{
      display: inline-block;
      width:200px;
      height:35px;
      font-size: 16px;
      position: absolute;
      left:210px;
      top:70px;
    }
  }
  .el-dialog__body{
    padding: 0;
    margin: 0;
  }
}
</style>
