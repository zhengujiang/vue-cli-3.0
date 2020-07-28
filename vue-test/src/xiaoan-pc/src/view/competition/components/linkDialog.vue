<template>
  <div id="linkDialog">
    <el-dialog :visible.sync="showDialog" :show-close="false" custom-class="activiDialg" @close="closeDialog">
      <div class="title">{{title}}</div>
      <div class="close-button" @click="showDialog=false"><img src="/static/img/competition/close.png" alt=""></div>
      <div class="dialogInner">
        <div class="code">
          <div id="qrcode"></div>
          <p>微信扫一扫</p>
        </div>
        <div class="line"></div>
        <div class="href">
          <p>链接地址</p>
          <div class="address">
            <input id="copyLink" type="text" v-model="link">
          </div>
          <el-button type="primary" size="medium" @click="copyLink">复制链接</el-button>
        </div>
      </div>
      <div class="inner">复制链接或扫描二维码{{title}}</div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/service/api/index'

  export default {
    name: "upload",
    data() {
      return {
        showDialog: false,
        link: '',
        mobLink: '',
        userId: ''
      }
    },
    props: ['name', 'linkValue', 'title', 'questionId', 'type'],
    mounted() {
      this.showDialog = this.linkValue;
      this.$nextTick(() => {
        if (this.type == 1) {
          this.link = `${api.host}competition/home?type=1&id=${this.userId}`;
          this.mobLink = `${api.mobileHost}#/competition/home?type=1&id=${this.userId}&source=friend`;
        }
        if (this.type == 2) {
          // this.name = encodeURI(this.name);
          this.link = `${api.host}competition/call?type=2&id=${this.userId}&name=${encodeURIComponent(this.name)}`;
          this.mobLink = `${api.mobileHost}#/competition/call?type=2&id=${this.userId}&source=call`;
        }
        if (this.questionId) {
          this.link = `${api.host}competition/activityAnswer?questionId=${this.questionId}`;
          this.mobLink = `${api.mobileHost}#/competition/friendTesting?id=${this.questionId}&source=friend`;
        }
        this.makeCode();
      })
    },
    components: {
    },
    watch: {
    },
    created() {
      this.userId = this.$cookie.get('userId')
    },
    methods: {
      closeDialog () {
        this.$emit("upAdd", false);
      },
      copyLink () {
        let input = document.getElementById('copyLink');
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
        }
        // console.log(api.host);
        this.$message({showClose: true, message: '复制成功！', type: 'success'});
      },
      makeCode () {
        let qrcode = new QRCode("qrcode");
        qrcode.makeCode(this.mobLink);
      }
    }
  }
</script>

<style lang="scss">
  #linkDialog {
    .activiDialg {
      width: 695px;
      height: 395px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      padding: 0 54px;
      .el-dialog__header {
        padding: 0px;
      }
      .el-dialog__body {
        padding: 0;
        .close-button {
          cursor: pointer;
          position: absolute;
          top: 37px;
          right: 40px;
          img {
            width: 33px;
            height: 33px;
          }
        }
        padding-top: 30px;
        .title {
          height: 52px;
          border-bottom: 1px solid rgba(84,84,84,1);
          text-align: center;
          line-height: 52px;
          font-size:16px;
          font-weight:600;
          color:rgba(255,201,1,1);
        }
      }
      .dialogInner {
        height: 230px;
        .code {
          float: left;
          text-align: center;
          margin-top: 30px;
          margin-left: 20px;
          p {
            font-size:14px;
            font-weight:400;
            margin-top: 14px;
            color:rgba(255,255,255,1);
          }
          #qrcode {
            img{
              width: 156px;
              height: 156px;
              border: 2px solid #F8F8F8;
            }
          }
        }
        .line {
          float: left;
          margin: 55px 30px 0;
          width:1px;
          height:109px;
          background:rgba(84,84,84,1);
        }
        .href {
          float: left;
          margin-top: 35px;
          margin-left: 10px;
          p {
            font-size:16px;
            font-weight:400;
            color:rgba(255,255,255,1);
          }
          .address {
            margin-top: 17px;
            input {
              border:1px solid rgba(141,141,141,1);
              padding-left: 11px;
              line-height: 33px;
              height:32px;
              width: 299px;
              font-size:14px;
              font-weight:400;
              color:rgba(255,255,255,1);
              background: url(/static/img/competition/slice.png) no-repeat;
            }
          }
          .el-button {
            margin-top: 55px;
            width: 164px;
            height: 35px;
            background:rgba(251,203,5,1);
            border-radius:4px;
            span {
              font-size:16px;
              font-weight:400;
              color:rgba(50,50,50,1);
            }
          }
        }
      }
      .inner {
        text-align: center;
        width: 100%;
        font-size:14px;
        font-weight:400;
        color:rgba(141,141,141,1);
      }
    }
  }
</style>
