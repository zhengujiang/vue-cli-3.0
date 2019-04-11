<template>
  <div class="new-notice" :style="{height:tabHeight+'px'}">
    <div id="scroll" class="new-affiche-container" ref="container" :style="{height:tabHeight+'px'}">
      <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
          :infinite-scroll-distance=0>
        <li class="anList" v-for="(list,index) in afficheList" @click="goCount(index)">
          <div style="width: 100%" class="vux-1px-b">
            <span class="content-text" v-html="keyWord(list.title)"></span>
            <p style="float: right">{{$const.format(list.releaseDate)}}</p>
          </div>
        </li>
      </ul>
      <!--9yue 25日 cai 改-->
      <p class="infinite-loading">
        <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
      </p>
    </div>
    <!---->
    <return-top v-model="returnTop" @click="returnTo" style="bottom: 10%"></return-top>
    <xiaoan-loading v-show="allLoading"></xiaoan-loading>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" @click="addFocusClick" :hintBtn="warning.btnText"
                    :isShowBtn="true" :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
  </div>
</template>

<script>
  import XiaoanLoading from '@/components/warning/loading'
  import XiaoanError from '@/components/warning/error'
  import XiaoanWarning from '@/components/warning/warning'

  export default {
    name: "new-notice",
    data() {
      return {
        allLoading: false,
        tabHeight: 0,
        loading: false,
        allLoaded: true,
        afficheList: [],
        userId: '',
        page: {
          index: 1,
          size: 15,
          total: 0
        },
        returnTop: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.personal.toFocus,
          text: '没有关注公司的最新公告！',
          btnText: '我的关注'
        },
      }
    },
    components: {
      XiaoanLoading,
      XiaoanError,
      XiaoanWarning
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: String,
        required: false,//是否必填
        default: 0,
      },
    },
    watch: {
      height: function () {
        this.$nextTick(() => {
          this.tabHeight = this.height;
          console.log(this.tabHeight, this.height);
        })
      },
      active: function (val) {
        if (val == '1') {
          this.page.index = 1;
          this.page.size = 15;
          this.afficheList = [];
          this.timeTotal = Date.parse(new Date()) - (7 * 24 * 3600 * 1000);
          this.apiGetAnnouncementByAttend(this.timeTotal);
        }
      }
    },
    created() {
      this.userId = this.$cookie.getCookie('userId');
      if (this.userId) {
        this.timeTotal = Date.parse(new Date()) - (7 * 24 * 3600 * 1000);
        this.apiGetAnnouncementByAttend(this.timeTotal);
        this.allLoading = true;
      }
    },
    mounted() {
      setTimeout(() => {
        this.allLoading = false;
      }, 240);
      this.$nextTick(() => {
        this.$refs.container.addEventListener('scroll', (e) => {
          e.stopPropagation();
          let isScrollTop = this.$refs.container.scrollTop;
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
        });
      });
    },
    methods: {
      // 返回顶部
      returnTo() {
        console.log(1122121212);
        $('#scroll').animate({scrollTop: 0});
      },
      addFocusClick() {
        this.$router.replace({path: '/focus', query: {active: 0}});
      },
      // link
      goCount(index) {
        this.$router.push({path: '/afficheContent', query: {id: this.afficheList[index].mainId}});
      },
      // 截取44个字符最多显示
      keyWord(str) {
        if (str.length >= 44) {
          return str = str.substring(0, 44) + '...';
        }
        return str
      },
      //
      apiGetAnnouncementByAttend(time) {
        /* this.$http({
          method: 'GET',
          url: this.$api.disclosure.getAnnouncementByAttend,
          params: {
            pageNum: this.page.index,
            pageSize: this.page.size,
            releaseStartDate: time
          }
        }) */
        let params = {
          pageNum: this.page.index,
          pageSize: this.page.size,
          releaseStartDate: time
        }
        this.$axios.disclosure.getAnnouncementByAttend(params).then((res) => {
          this.xaerror = false;
          console.log(res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.count == 0) {
              this.warning.show = true;
            } else {
              this.warning.show = false;
            }
            if (res.data.returnObject == null || res.data.returnObject.list == null || res.data.returnObject.list.length == 0) {
              //
            } else {
              let number = res.data.returnObject.count;
              this.page.total = this.$array.totalPage(number, this.page.size);
              //控制下拉刷新
              let listData = res.data.returnObject.list;
              this.afficheList = this.$array.loadMore(this.afficheList, listData);
            }
            console.log(this.page.index, this.page.total);
          } else {
            this.warning.show = true;
          }
        }).catch((err) => {
          console.log(err);
          // this.$toast({message: '网络异常', position: 'middle', duration: 1500});
          this.xaerror = true;
        })
      },
      // 无限加载器。。。
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index++;
            this.apiGetAnnouncementByAttend(this.timeTotal);
          }
          setTimeout(() => {
            this.loading = false;
            this.allLoaded = false;
          }, 5000)
        }, 300);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .new-notice {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .new-affiche-container {
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      ul.infinite-list {
        box-sizing: border-box;
        background-color: white;
        li.anList {
          width: 100%;
          padding: 0 12px;
          box-sizing: border-box;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          font-size: 15px;
          color: #323232;
          letter-spacing: 0.2px;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          line-height: 19px;
          -webkit-transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
          div {
            padding: 12px 0;
            span.content-text {
              text-align: justify;
            }
            p {
              margin: 0;
              padding: 0;
              display: inline-block;
              font-size: 12px;
              color: #ababab;
            }
          }
        }
        li.anList:active {
          background-color: #f0f1f5;
          -webkit-transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
          > div {
            // border-bottom-color: #f0f1f5;
          }
        }
      }
      .infinite-loading {
        height: 45px;
        line-height: 45px;
        text-align: center;
        background-color: #FFFFFF;
        .mint-spinner-snake {
          height: 14px !important;
          width: 14px !important;
          border: 2px solid transparent;
          border-top-color: rgb(252, 199, 127) !important;
          border-left-color: rgb(252, 199, 127) !important;
          border-bottom-color: rgb(252, 199, 127) !important;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }
        .snake {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          color: #535353;
          height: 50px;
          box-sizing: border-box;
          text-align: center;
        }
      }
    }
  }
</style>
