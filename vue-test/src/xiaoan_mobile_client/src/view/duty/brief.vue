<template>
  <div id="brief" class="xiaoan-box brief">
    <div class="brief-scroll returnHomeb">
      <div class="briefImgIndex" v-for="(list,index) in advertImgData">
        <img v-lazy="list" alt="">
        <button class="briefImgBtn" @click="goToLaw(index)" v-if="index==0 && briefs == '4'">点一点</button>
        <button class="briefImgBtn2" @click="goToLaw(index)" v-if="index==advertImgData.length -1 && briefs == '4'">
          点一点
        </button>
      </div>
    </div>
    <v-return-home position="fixed" bottom="6%"></v-return-home>
    <xiaoan-loading v-show="loading"></xiaoan-loading>
  </div>
</template>

<script>
  import VReturnHome from "@/components/warning/returnHome.vue"
  import XiaoanLoading from "@/components/warning/loading"

  export default {
    name: 'brief',
    data() {
      return {
        loading: false,
        briefs: '',
        advertImgData: [],
      }
    },
    components: {
      VReturnHome, XiaoanLoading
    },
    created() {
      this.loading = true;
      //取到路由传值
      let adverttitles = '小安指南';
      if (this.$route.query.advert_Title !== undefined) {
        adverttitles = decodeURIComponent(this.$route.query.advert_Title);
        window.document.title = adverttitles;
      }
      this.briefs = this.$route.query.advert_Id;
      if (this.briefs == 4) {
        this.$router.replace({path: '/manual'});
      }
      this.getAdvertImg();
    },
    mounted() {
      /**
       * todo
       **/
      var shareDesc = '';// 描述
      if (this.briefs == 247) {
        shareDesc = '基本面好、安全边际高，但股价被低估？信公咨询携手路演中为您量身定制路演服务，立即了解。'
      }
      var adverttitle = decodeURI(window.document.title);
      var sharelink2 = decodeURI(window.location.href);// 分享链接
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      goToLaw(index) {
        if (index == 0) {
          //点击上面的按钮
          this.$MTAmethod.mtaShare('FU7K2kspH1IGRnOb', {'gsyl6a6n56tnq30b': 'true'})
        } else {
          //点击下面的按钮
          this.$MTAmethod.mtaShare('FU7K2kspH1IGRnOb', {'q68tz4evp1y1lcze': 'true'})
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.$router.push({path: "law"});
          })
        });
      },
      getAdvertImg() {
        let params = {
          advertId: this.briefs,
        }
        this.$axios.common.getAdvertImg(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.advertImgData = res.data.returnObject;
            this.loading = false;
          }
        }).catch((err) => {
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .xiaoan-box.brief {
    position: relative;
    .brief-scroll {
      width: 100%;
      height: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      font-size: 0;
      vertical-align: middle;
      img {
        background-color: white;
        width: 100%;
        height: 100%;
        z-index: 100;
      }
    }
  }
  #brief .briefImgIndex {
    position: relative;
  }
  #brief .briefImgBtn {
    position: absolute;
    left: 50%;
    top: 53%;
    border: 0;
    background-color: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0);
    height: 40px;
    width: 200px;
    transform: translateX(-50%);
  }
  #brief .briefImgBtn2 {
    position: absolute;
    left: 50%;
    bottom: 0.7%;
    border: 0;
    background-color: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0);
    height: 40px;
    width: 200px;
    transform: translateX(-50%);
  }
</style>
