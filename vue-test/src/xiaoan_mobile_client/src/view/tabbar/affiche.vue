<template>
  <transition name="bounce">
    <div id="affiche" class="affiche">
      <div class="logo"><img :src="bgimg" alt=""></div>
      <div class="search">
        <div class="seabox">
          <span>证券简称/代码</span><b></b><span>搜索公告名称</span>
        </div>
        <div class="spanone" @click="searchNoticeCode"></div>
        <div class="spantwo" @click="searchNoticeText"></div>
      </div>
      <ul class="link">
        <li :key="index" v-for="(list, index) in linkItem" class="linkitem" @click="routerLink(index)">
          <img :src="list.icon" :alt="list.id">
          <p>{{list.name}}</p>
        </li>
      </ul>
      <xiaoan-loading v-show="loading"></xiaoan-loading>
    </div>
  </transition>
</template>
<script>
  import loading from '@/components/warning/loading'

  export default {
    name: "Affiche",
    data() {
      return {
        bgimg: this.$image.base.affche,
        code: '',
        isOnload: true,
        linkItem: [
          {id: 'collect', name: '收藏', link: '/collect', icon: this.$image.base.collect},
          {id: 'focus', name: '关注', link: '/focus', icon: this.$image.base.guanzhu},
          {id: 'track', name: '足迹', link: '/track', icon: this.$image.base.track}
        ],
        loading: false,
        userInfo: {}
      }
    },
    components: {
      'xiaoan-loading': loading
    },
    computed: {},
    // 页面构建前准备
    beforeCreate() {

    },
    created() {
      if (this.$cookie.isLogin()) {
        if (this.$cookie.getUserInfo()) {
          this.userInfo = this.$cookie.getUserInfo();
          this.comCode = this.userInfo.companyCode ? this.userInfo.companyCode : '';
          this.stockType = this.userInfo.stockType ? this.userInfo.stockType : 0;
          if (this.comCode == '' || this.comCode.length == 0 || this.stockType == 1 || this.stockType == 2) {
            console.log('不需要执行操作！');
          } else {
            this.autoComplete();
          }
        } else {
          this.userHomeInfo();
        }
        this.isOnload = true;// 授权登录
      } else {
        this.isOnload = false;// 未授权登录
      }
    },
    mounted() {
    },
    methods: {
      //
      routerLink(index) {
        console.log(index);
        this.$router.push({path: this.linkItem[index].link});
      },
      //
      userHomeInfo() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          if (res.data.returnCode == 1) {
            this.comCode = res.data.returnObject.companyCode ? res.data.returnObject.companyCode : '';
            this.stockType = res.data.returnObject.stockType ? res.data.returnObject.stockType : 0;
            if (this.comCode == '' || this.comCode.length == 0 || this.stockType == 1 || this.stockType == 2) {
              console.log('不需要执行操作！');
            } else {
              this.autoComplete();
            }
          } else {
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      //
      autoComplete() {
        let params ={
            key: this.comCode,
          }
          this.$axios.common.autoComplete(params).then(res => {
          console.log('autoComplete', res)
          if (res.data.returnCode == 1) {
            this.$nextTick(() => {
              this.$router.replace({
                path: '/afficheList',
                query: {code: res.data.returnObject[0].fullCode}
              });
            })
          } else {
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      searchNoticeCode() {
        this.code = 1;
        this.$router.push({path: '/afficheSearch', query: {inputCode: this.code}});
      },
      //
      searchNoticeText() {
        this.code = 2;
        this.$router.push({path: '/afficheSearch', query: {inputCode: this.code}});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .affiche {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: white;
    .logo {
      width: 100%;
      height: 235px;
      padding: 64px 0 25px 0;
      box-sizing: border-box;
      img {
        display: block;
        height: 100%;
        padding-left: 25px;
      }
    }
    .search {
      width: 100%;
      height: 45px;
      padding: 0 25px;
      box-sizing: border-box;
      position: relative;
      .seabox {
        width: 100%;
        height: 45px;
        border: 1px solid #cbcbcb;
        box-sizing: border-box;
        border-radius: 2px;
        display: flex;
        align-items: center;
        /*justify-content: space-between;*/
        b {
          display: block;
          width: 1px;
          height: 15px;
          background: #cbcbcb;
          float: left;
        }
        img {
          display: block;
          height: 20px;
          position: absolute;
          right: 40px;
          top: 12px;
        }
        span {
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          font-size: 15px;
          color: #cbcbcb;
          margin: 0 10px;
        }
      }
      .spanone {
        position: absolute;
        left: 25px;
        top: 0;
        width: 30%;
        height: 100%;
      }
      .spantwo {
        position: absolute;
        right: 25px;
        top: 0;
        width: 55%;
        height: 100%;
      }
    }
    .link {
      width: 262px;
      height: 100px;
      font-size: 0;
      margin: 0 auto;
      padding-top: 53px;
      box-sizing: border-box;
      display: flex;
      .linkitem {
        flex: 1;
        display: inline-block;
        height: 100%;
        img {
          display: block;
          width: 25px;
          height: 25px;
          margin: 0 auto 10px;
          overflow: hidden;
        }
        p {
          margin: 0;
          width: 100%;
          font-size: 13px;
          color: #b1b1b1;
          text-align: center;
        }
      }
    }
  }
</style>
