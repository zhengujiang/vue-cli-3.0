<template>
  <div id="upload" class="content">
    <div class="contentLeft">
      <div class="one"></div>
      <div class="upload-image">
        <span class="upload-word">上传个人名片</span>
        <input type="file" @change="handleUpload" name="file" multiple="multiple" accept="image/jpeg,image/gif,image/png,image/bmp">
        <img v-if="imgUrl" :src="imgUrl" class="avatar">
      </div>
      <div class="inner">
        <p class="question">为什么要上传个人名片？</p>
        <p class="reason">上传名片能帮助我们准确地将奖品发放给您！</p>
      </div>
      <div class="button-upload" @click="uploadCasecard"></div>
    </div>
    <div class="contentRight">
      <comp-banner></comp-banner>
      <reward></reward>
      <!-- <div class="reward">
        <div class="title">活动奖励</div>
        <p>本次活动设置网络海选、区域赛、决赛三个阶段。</p>
        <p>网络海选奖品：</p>
        <p>
          1、拼综合实力！总积分排名前十的选手，每人将获得500元的奖励；<br/>
          2、拼脑力！答题得分排名前十的选手（答题得分相同的以完成时间快的为优先），每人将获得信公小安2019年全年出版物；<br/>
          3、拼人缘！邀请好友获得积分排名前十的选手，每人将获得价值9999元的信公小安企业版会员一年；<br/>
          4、阳光普照奖！所有参赛者将获得信公小安企业版三个月试用权。
        </p>
        <p>区域赛-决赛</p>
        <p>冠军奖金-5万元/人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入围选手-1万元/人</p>
        <div class="btn">
          <el-button type="primary" size="medium">查看活动条款</el-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
  import CompBanner from './components/banner.vue'
  import reward from './components/reward.vue'
  export default {
    name: "upload",
    data() {
      return {
        imgUrl: '',
        file: '',
        inviteTypeEnum: {
          '0': 'COMMON', // 普通用户
          '1': 'COMMONINVITE', // 邀请用户
          '2': 'SECRETARY' // 打call用户
        },
        inviteId: '',
        type: 0
      }
    },
    components: {
      CompBanner,
      reward
    },
    created() {
      if (sessionStorage.getItem('id')) {
        this.inviteId = JSON.parse(sessionStorage.getItem('id'));
      }
      if (sessionStorage.getItem('type')) {
        this.type = JSON.parse(sessionStorage.getItem('type'));
      }
    },
    methods: {
      handleUpload(file) {
        this.uploading = true;
        console.log("file", file);
        this.file = file.target.files;
        let base64 = {};
        var reader = new FileReader();
        reader.readAsDataURL(file.target.files[0]); // 读取文件
        reader.onloadend = () => {
          let base64head = reader.result
          this.imgUrl = base64head
        }
        return false;
      },
      uploadCasecard() {
        if (this.file == '') {
          this.$message({showClose: true, message: '请上传名片!', type: 'error'});
          return false;
        }
        let form = new FormData();
        form.append('casecardImg', this.file[0]);
        form.append('userId', this.$cookie.get('userId'));
        form.append('inviteId', this.inviteId);
        form.append('inviteTypeEnum', this.inviteTypeEnum[JSON.parse(this.type)]);
        if (this.type == 2) {
          form.append('isJoin', false);
        } else {
          form.append('isJoin', true);
        }
        let params = {
          data: form
        };
        this.$axios.mobApi.uploadCasecard(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
                this.$router.push('/competition/uploadSuccess')
            } else {
              this.$message({showClose: true, message: res.data.returnMsg, type: 'error'});
            }
          }
        }).catch(err => {
          
        })
      }
    }
  }
</script>

<style lang="scss">
  #upload {
    min-height: 800px;
    clear: both;
    .contentLeft {
      margin-bottom: 50px;
      height: 645px;
      .upload-image {
        width: 318px;
        height: 182px;
        // line-height: 182px;
        text-align: center;
        margin: 28px auto 10px;
        color: #FFFFFF;
        font-size: 16px;
        background: url(/static/img/competition/upload-border.png) no-repeat;
        background-size: contain;
        position: relative;
        .upload-word {
          line-height: 182px;
        }
        .avatar {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
        }
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 1
        }
      }
      .inner {
        width: 318px;
        margin: 0 auto 10px;
        .question {
          font-size: 18px;
          color: #FFFFFF;
        }
        .reason {
          font-size: 14px;
          color: #F6F6F6;
        }
      }
      .button-upload {
        width: 181px;
        height: 52px;
        margin: 31px auto 39px;
        background: url(/static/img/competition/Button_upload.png) no-repeat;
        cursor: pointer;
      }
    }
    .contentRight {
      .reward {
        width:292px;
        height:465px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 17px 15px;
        .title {
          height: 45px;
          line-height: 45px;
          text-align: left;
          font-size: 14px;
          color: #FFFFFF;
          border-bottom: 1px solid rgba(84,84,84,1);
        }
        p:nth-child(2) {
          font-size: 14px;
          color: #FFFFFF;
          margin-top: 10px;
          line-height: 18px;
        }
        p:nth-child(3), p:nth-child(5) {
          font-size: 14px;
          color: #FFFFFF;
          margin-top: 15px;
          line-height: 18px;
        }
        p:nth-child(4), p:nth-child(6) {
          font-size: 12px;
          color: #E3E3E3;
          line-height: 18px;
        }
        .btn {
          margin-top: 20px;
          .el-button {
            margin: 0 auto;
            display: inherit;
            background-color: #FFCE04;
            color: #545454
          }
        }
      }
    }
  }
</style>
