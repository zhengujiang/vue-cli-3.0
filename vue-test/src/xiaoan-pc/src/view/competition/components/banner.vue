<template>
  <div id="banner-image">
    <div class="comp-banner" @click="event=true"></div>
    <bannerShow v-if="event" :show="event" :isClick="true" @getShow="getShow"></bannerShow>
  </div>
</template>

<script>
  import bannerShow from './bannerShow.vue'
  export default {
    name: "banner",
    data() {
      return {
        event: false
      }
    },
    components: {
      bannerShow
    },
    methods: {
      getShow(type) {
        this.event = type;
      }
    }
  }
</script>

<style lang="scss">
  #banner-image {
    height: 164px;
    margin-bottom: 16px;
    .comp-banner {
      height: 164px;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      background: url(/static/img/competition/lastbar.jpg) no-repeat;
      background-size: contain;
    }
    .bannerDialg {
      padding: 0;
      height: 529px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .dialogImage {
        width: 463px;
        height: 190px;
        margin: 0 auto;
        background: url(/static/img/competition/bg-title.png) no-repeat;
        background-size: contain;
      }
      .bannerInner {
        margin-top: 30px;
        text-align: center;
        font-size:20px;
        font-weight:600;
        color:rgba(255,255,255,1);
      }
      .compare {
        text-align: center;
        font-size:12px;
        font-weight:400;
        color:rgba(227,227,227,1);
      }
      ul {
        width: 340px;
        margin: 19px auto 19px;
        height: 50px;
        li {
          float: left;
          font-size: 16px;
          color: #FFFFFF;
          width: 170px;
          span:first-child {
            display: inline-block;
            background: #FFCC02;
            height: 5px;
            width: 5px;
            border-radius: 5px;
            margin-right: 5px;
          }
          span:last-child {
            font-size: 20px;
            color: #FFCC02;
          }
        }
      }
      .banner-button {
        text-align: center;
        .el-button {
          width: 164px;
          background:rgba(251,203,5,1);
          span {
            font-size:16px;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
        .el-button:first-child {
          background: none;
          span {
            color: #ffffff;
          }
        }
      }
    }
    .inviteDialog {
      padding: 0;
      height: 529px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .dialogImage {
        width: 463px;
        height: 190px;
        margin: 0 auto;
        background: url(/static/img/competition/bg-title.png) no-repeat;
        background-size: contain;
      }
      .bannerInner {
        font-size:34px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        text-align: center;
        color:rgba(255,201,1,1);
        margin: 30px 0 12px;
      }
      .compare {
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
        line-height: 25px;
      }
      .button {
        margin-top: 20px;
        text-align: center;
        .el-button {
          margin: 0 auto;
          width: 164px;
          background:rgba(251,203,5,1);
          span {
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
      }

    }
  }

</style>
