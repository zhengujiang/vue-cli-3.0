<template>
  <div id="join">
    <div class="content">
      <div class="joinImage">
        <!-- <div class="top"></div>
        <p class="joinText">这里也是一句话文案<br/>这里可不可以有一些关于这次活动的介绍</p>
        <div class="joinBottom"><span>扫码添加小安公众号参加</span><img src="/static/image/business/test/qrcode.png"/></div> -->
      </div>
      <div class="termInner">
        <p class="termAward">活动奖励</p>
        <img src="/static/img/competition/join.png" alt="" style="width: 436px; height: 327px">
        <div class="submit">
          <el-button @click="submit" class="submitBtn" type="primary" size="medium">我要报名</el-button>
          <p>
            <el-checkbox v-model="checked"></el-checkbox>
            <span class="agree">我同意<i @click="showTerm">《活动条款》</i></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "join",
        data() {
          return {
            checked: false,
            isUpload: false,
            inviteId: ''
          }
        },
        destroyed() {
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('type');
        },
        created() {
          if (sessionStorage.getItem('id')) {
            this.inviteId = JSON.parse(sessionStorage.getItem('id'));
          }
          this.checkUserCaseUpload();
          this.$route.query.isTerm ? this.checked = true : this.checked = false;
        },
        methods: {
          showTerm() {
            this.$router.push('/competition/term');
          },
          submit() {
            if (this.checked) {
              if (!this.$cookie.get('userInfo')) {
                let competition = JSON.parse(sessionStorage.getItem('competition'));
                // this.$router.push('/login?redirect_url=competition')
                this.$router.push(`/login?redirect_url=${competition}`)
              } else {
                if (this.isUpload) {
                  this.updateUserIsJoin();
                  this.$router.push('/competition/home');
                } else {
                  this.$router.push('/competition/upload')
                }
              }
            } else {
              this.$router.push('/competition/term');
              this.$message({showClose: true, message: '您需要先勾选活动条款', type: 'error'});
            }
          },
          // 是否上传名片
          checkUserCaseUpload () {
            let params = {
              userId: this.$cookie.get('userId')
            }
            this.$axios.mobApi.checkUserCaseUpload(params).then((res) => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                if (res.data.returnObject) {
                  this.isUpload = true;
                } else {
                  this.isUpload = false;
                }
              }
            })
          },
          // 修改用户报名状态
          updateUserIsJoin () {
            let params = {
              userId: this.$cookie.get('userId'),
              inviteId: this.inviteId
            }
            console.log(JSON.parse(sessionStorage.getItem('type')));
            this.$axios.mobApi.updateUserIsJoin(params).then((res) => {
              if (res.data.returnObject) {
                if (JSON.parse(sessionStorage.getItem('type')) != '2') {
                  sessionStorage.removeItem('id');
                  sessionStorage.removeItem('type');
                }
              } else {
                this.$message({showClose: true, message: res.data.returnMsg, type: 'error'});
              }
            })
          }
        }
    }
</script>

<style lang="scss">
  #join {
    min-height: 800px;
    background: #FFFFFF;
    padding: 20px;
    .content {
      padding: 16px;
      clear: both;
      overflow: hidden;
      box-shadow: 0 0 10px #CCC;
    }
    .joinImage {
      float: left;
      width:584px;
      height:568px;
      padding-top: 68px;
      padding-bottom: 35px;
      background: url(/static/img/competition/joinBanner.png) no-repeat;
      .top {
        width:527px;
        height:216px;
        margin: 0 auto 48px;
        background: url(/static/img/competition/bg-title.png) no-repeat;
        background-size: contain;
      }
      .joinText {
        text-align: center;
        height: 110px;
        font-size:16px;
        font-weight:bold;
        color:rgba(254,205,4,1);
        line-height: 30px;
      }
      .joinBottom {
        text-align: right;
        span {
          font-size:16px;
          font-weight:400;
          color:rgba(255,255,255,1);
        }
        img {
          height: 90px;
          width: 90px;
          margin: 0 34px 0 20px;
        }

      }
    }
    .termInner {
      float: left;
      margin-left: 60px;
      img {
        width: 436px;
        height: 327px;
        margin-top: 35px;
      }
      .termAward {
        margin-top: 30px;
        font-size:30px;
        font-weight:bold;
        color:rgba(50,50,50,1);
        padding-left: 8px;
      }
      .colorGray {
        font-size: 14px;
        color: #8D8D8D;
      }
      .submit {
        margin-top: 45px;
        padding-left: 8px;
        .submitBtn {
          width: 180px;
          height: 35px;
        }
        p {
          height: 14px;
          line-height: 14px;
          margin-top: 13px;
          .agree {
            font-size: 12px;
            i {
              color: #FFB148;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
