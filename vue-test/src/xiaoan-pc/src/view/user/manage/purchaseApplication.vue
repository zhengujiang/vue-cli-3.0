<template>
  <div id="purchase-application">
    <h4>申请成为信公小安企业版试用用户</h4>
    <el-steps :active="activeStep" align-center class="add-steps" finish-status="success" process-status="now-status">
      <el-step title="上传个人名片"></el-step>
      <el-step title="关注信公小安公众号"></el-step>
      <el-step title="等待反馈通知"></el-step>
    </el-steps>
    <section class="step-block" v-if="activeStep == 0">
      <el-upload
        v-loading="uploading"
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :before-upload="handleUpload"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        multiple>
        <img v-if="imgUrl" :src="imgUrl" class="avatar">
        <i class="el-icon-upload" v-else></i>
        <div class="el-upload__text">将名片拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div class="tip">
        <p style="font-weight:600;margin-bottom:20px">为什么需要提供该信息?</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">小安管理员将依据你提供的个人名片，核实你的个人信息。核实后开通小安企业版权限。</p>
      </div>
    </section>
    <section class="step-block" v-if="activeStep == 1">
      <div class="vxa-image-user-bg-qrcode qrcode"></div>
      <div class="tip">
        <p style="font-weight:600;margin-bottom:20px">为什么需要关注该公众号?</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">您的审核信息将通过微信公众号通知的方式及时反馈给您</p>
      </div>
    </section>
    <section class="step-block" v-if="activeStep == 2">
      <div class="vxa-image-user-bg-qrcode2 qrcode2"></div>
      <div class="tip">
        <p style="font-weight:600;margin-bottom:20px">恭喜您，已成功提交申请</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">感谢您申请信公小安企业版试用账号，</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">信公小安管理员会在1个工作日内审核相关信息的真实性，并为您开通企业版权限。</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">联系电话：021-2074-0322</p>
        <p style="font-size:14px;color:#909399;margin-bottom:5px">联系邮箱：xiaoan_help@infaith.com.cn</p>
        <p style="font-size:14px;color:#909399">客服微信号：infaithjinjin（可扫描左方二维码）</p>
      </div>
    </section>
    <section class="steps-foot">
      <el-button type="primary" plain @click="nextRound(-1)" style="width:120px">{{opStepText[activeStep]}}</el-button>
      <div style="width:30px"></div>
      <el-button type="primary" :disabled="!imgUrl.length>0" v-if="!imgUrl.length>0" style="width:120px">请先上传名片
      </el-button>
      <el-button type="primary" @click="nextRound(1)" v-else style="width:120px">{{stepText[activeStep]}}</el-button>
    </section>
  </div>
</template>
<script>
  export default {
    name: "purchase-application",

    data() {
      return {
        activeStep: 0,
        opStepText: ["取消", "上一步", "上一步"],
        stepText: ["下一步", "下一步", "完成"],
        imgUrl: "",
        uploading: false,
        packages: []
      };
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.getEnterprisePackage();
    },
    methods: {
      nextRound(num) {
        if (this.activeStep == 2) {
          this.handleApply();
        }
        if (this.activeStep + num < 0 || this.activeStep + num > 2) {
          this.$router.go(-1);
        } else {
          this.activeStep = this.activeStep + num;
        }
      },
      getEnterprisePackage() {
        this.$http({
          url: this.$api.enterpriseCompany.getEnterprisePackage,
          method: "get"
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.packages = res.data.returnObject;
          }
        });
      },
      handleUpload(file) {
        this.uploading = true;
        console.log("file", file);
        let base64 = {};
        var reader = new FileReader();
        reader.readAsDataURL(file); // 读取文件
        reader.onload = e => {
          base64 = {base64: e.target.result};
          console.log(base64);
          this.$http({
            url: this.$api.enterpriseCompany.uploadPicByBase64,
            method: "post",
            data: base64
          }).then(res => {
            this.uploading = false;
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.$message({
                showClose: true,
                type: "success",
                duration: 3000,
                message: "上传成功"
              });
              this.imgUrl = res.data.returnObject;
            } else {
              this.$message({
                showClose: true,
                type: "error",
                duration: 3000,
                message: "上传失败，请重试"
              });
            }
          });
        };
        return false;
      },
      handleApply() {
        this.$http({
          url: this.$api.enterpriseCompany.applyEnterprise,
          method: "post",
          data: {
            createUserId: this.userInfo.id,
            packageId: this.packages[0].id,
            voucherLink: this.imgUrl
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({
              showClose: true,
              duration: 3000,
              message: "申请成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              duration: 3000,
              message: "申请失败",
              type: "error"
            });
          }
        });
      }
    }
  };
</script>
<style lang="scss">
  #purchase-application {
    h4 {
      border-left: 4px solid #ffb148;
      border-radius: 2px;
      padding: 0px 0px 0px 10px;
      margin: 0;
    }
    .upload-demo {
      height: 300px;
      .avatar {
        width: 360px;
        height: 180px;
        display: block;
      }
    }
    .add-steps {
      .el-step {
        margin: 20px 0px 10px 0px;
        .el-step__title {
          font-size: 12px;
          color: #aeaeae;
          line-height: 28px;
        }
        .el-step__icon.is-text {
          border-width: 1px;
          background-color: #aeaeae;
          .el-step__icon-inner {
            color: white;
            font-weight: normal;
          }
        }
        &.is-horizontal .el-step__line {
          height: 1px;
        }
        .el-step__head.is-success {
          color: #ffb148;
          border-color: #ffb148;
          .el-step__icon {
            background-color: #ffb148;
            .el-step__icon-inner {
              font-weight: bold;
            }
          }
          .el-step__line {
            background-color: #ffb148;
            .el-step__line-inner {
              border-width: 0 !important;
            }
          }
        }
        .el-step__head.is-now-status {
          .el-step__line {
            background-color: #ffb148;
          }
          .el-step__icon {
            background-color: #ffb148;
            border-color: #ffb148;
            color: white;
          }
        }
      }
    }
    .step-block {
      padding: 40px 13%;
      margin-top: 20px;
      display: flex;
      .qrcode {
        width: 200px;
        height: 200px;
      }
      .qrcode2 {
        width: 300px;
        height: 300px;
      }
      .tip {
        margin-left: 30px;
        padding-top: 40px;
        flex: 1;
      }
    }
    .steps-foot {
      border-top: 2px solid #e3e3e3;
      margin: 0px 118px;
      display: flex;
      justify-content: center;
      padding-top: 30px;
    }
  }
</style>
