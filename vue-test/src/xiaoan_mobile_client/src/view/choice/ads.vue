<template>
  <div class="ads" id="ads" ref="docmentDom">
    <div class="nav" ref="navDom">
      <div class="nav-scroll" ref="itemDom">
        <button class="linkScroll" v-for="(list,index) in adsCont" :id="'add'+index"
                :class="{active:list.active}" @click="switchCut(index)">
          {{list.advertType}}
          <span :class="{'nav-head-sin':list.active}"></span>
        </button>
      </div>
    </div>
    <div class="nav-content" :style="{height:wrapperHeight+'px'}">
      <swiper :min-moving-distance="130" :show-dots="false" :height="'100%'" @on-index-change="onSwiperItemIndexChange"
              v-model="active">
        <swiper-item class="swiper-item" v-for="(list,i1) in adsCont" :key="i1">
          <div class="swiper-scroll" :style="{height:wrapperHeight+'px'}">
            <ul class="infinite-list" v-infinite-scroll="loadMore"
                :infinite-scroll-disabled="loading" :infinite-scroll-distance="0">
              <li v-for="(list,index) in adsCont[i1].lists" class="nav-content-list" @click="navContent(index)">
                <div class="list-box">
                  <img :src="list.advertImgUrl" alt="">
                  <div class="nav-content-list-title">{{list.advertTitle}}</div>
                  <div class="nav-content-list-doc">
                    <span>{{list.advertType}}</span><span>&ensp;|&ensp;</span><span>{{$const.format(list.createTime)}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <p v-show="infLoading" class="infinite-loading">
              <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
            </p>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <v-returnHome position="fixed" bottom="6%"></v-returnHome>
  </div>
</template>

<script>
  import {Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import VReturnHome from "@/components/warning/returnHome.vue"

  export default {
    name: 'ads',
    components: {
      Swiper,
      SwiperItem,
      VReturnHome,
      Tab, TabItem
    },
    data() {
      return {
        active: 0,
        adsCont: [],
        offScroll: [],
        page: 1,
        bottomStatus: '',
        getAdvert: [],
        totalPage: "",
        reft: false,
        loading: false,
        allLoaded: true,
        wrapperHeight: 0,
        infLoading: true,
        docWidth: 0
      };
    },
    watch: {},
    created() {
      this.getAdvertType();
    },
    mounted() {
      this.$nextTick(() => {
        this.wrapperHeight = this.$refs.docmentDom.clientHeight - this.$refs.navDom.clientHeight;
        this.docWidth = this.$refs.docmentDom.clientWidth;

      });
      let adverttitle = "信公精选，干货收录";
      let sharelink2 = decodeURI(window.location.href); // 分享链接
      let shareDesc = "信息披露、资本市场精选资讯，点击了解更多"; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      onSwiperItemIndexChange(index) {
        this.$nextTick(() => {
          this.adsCont.forEach((item) => {
            item.active = false;
            item.pages = 1;
            item.lists = [];
          });
          this.adsCont[index].active = true;
          this.offsetLeft(index);
          this.loading = false;
          this.allLoaded = true;
          //
          if (this.active == 0) {
            this.getInfo();
          } else {
            this.getAdvertByType(this.adsCont[index].advertType);
          }
          this.adsCont[this.active].index = true;
        })
      },
      // 定位
      offsetLeft(index) {
        let hei = this.docWidth, arr = [], office = $(".linkScroll");
        // 判断初次进入是 "this.offScroll"是否赋值成功
        if (this.offScroll == "" || this.offScroll.length == 0 || this.offScroll == undefined) {
        } else {
          let clientWidth = $(`#add${index}`)[0].clientWidth;
          let clientW = (clientWidth / 2);
          let liLeft = ((this.offScroll[index]) + clientW);
          let heiS = (hei / 2);
          $(".nav-scroll").animate({scrollLeft: liLeft - heiS});
        }
      },
      //加载更多
      loadMore() {
        let lastValue = this.adsCont[this.active].pages;
        if (lastValue < this.adsCont[this.active].totalPage) {
          this.loading = true;
          this.allLoaded = true;
        }
        setTimeout(() => {
          if (lastValue < this.adsCont[this.active].totalPage) {
            this.adsCont[this.active].pages += 1;
            if (this.active == 0) {
              this.getInfo();
            } else {
              this.getAdvertByType(this.adsCont[this.active].advertType);
            }
          }
          setTimeout(() => {
            this.allLoaded = false;
            this.loading = false;
          }, 3000);
        }, 300);
      },
      //跳转页面
      navContent(index) {
        window.localStorage.setItem("adsActive", this.active);
        console.log(this.adsCont[this.active].lists[index]);
        if (this.adsCont[this.active].lists[index].advertUrl == "" || this.adsCont[this.active].lists[index].advertUrl == null) {
          this.$router.push({
            path: 'brief',
            query: {
              advert_Id: this.adsCont[this.active].lists[index].advertId,
              advert_Title: this.adsCont[this.active].lists[index].advertTitle
            }
          });
        } else {
          window.location.href = this.adsCont[this.active].lists[index].advertUrl;
        }
      },
      //获取分类
      getAdvertType() {
        let params = {}
        this.$axios.common.getAdvertType(params).then(res => {
          if (res.data.returnCode === 1) {
            let dataObj = res.data.returnObject;
            //
            let data = dataObj.filter((item) => {
              return item.count !== '0';
            });
            let obj = [{"advertType": "全部", count: '110', lists: []}];
            let adsCont = obj.concat(data);
            adsCont.forEach((item) => {
              item.pages = 1;
              item.totalPage = "";
              item.index = false;
              item.active = false;
              if (item.count == '110') {
                item.active = true;
              }
            });
            adsCont = adsCont.filter((e) => {
              return e.advertType != '信公商学院'
            })
            adsCont = adsCont.filter((e) => {
              return e.advertType != '信公新知'
            })
            //
            this.adsCont = adsCont;
            this.$nextTick(() => {
              let linkScroll = document.querySelectorAll('.linkScroll');
              linkScroll.forEach((item) => {
                this.offScroll.push(item.offsetLeft);
              });
              if (window.localStorage.getItem('adsActive') == '' || window.localStorage.getItem('adsActive') == null || window.localStorage.getItem("adsActive") == undefined || window.localStorage.getItem("adsActive") == "0" || window.localStorage.getItem("adsActive") == 0) {
                this.active = 0;
                this.getInfo();
                this.offsetLeft(this.active);
              } else {
                this.active = parseInt(window.localStorage.getItem("adsActive"));
                this.adsCont.forEach((item) => {
                  item.active = false
                });
                this.adsCont[this.active].active = true;
              }
            })
          }
        }).catch((err) => {

        })
      },
      //
      switchCut(index) {
        this.adsCont.forEach((item) => {
          item.active = false;
        });
        this.adsCont[index].active = true;
        this.active = index;
      },
      //根据种类来获取广告
      getAdvertByType(advertType) {
        let params = {
          type: advertType,
          page: this.adsCont[this.active].pages,
        }
        this.$axios.common.getAdvertByType(params).then(res => {
          //console.log(res);
          if (res.data.returnCode == 1) {
            this.adsCont[this.active].totalPage = res.data.returnObject.totalPage;
            //控制下拉刷新
            let listData = res.data.returnObject.list;
            listData.forEach(e => {
              e.advertImgUrl = e.advertImgUrl.replace('http://an-announcement.oss-cn-shanghai.aliyuncs.com/', 'https://oss.in-hope.cn/');
            })
            //过滤小安指南
            listData = listData.filter(function (item) {
              return item.advertId != '4';
            })
            listData = listData.filter(function (item) {
              return item.advertType == advertType;
            })
            //控制下拉刷新
            this.adsCont[this.active].lists = this.adsCont[this.active].lists.concat(listData);
          } else {

          }
        }).catch((err) => {

        })
      },
      //所有的广告
      getInfo() {
        let params = {
          page: this.adsCont[this.active].pages,
        }
        this.$axios.common.getAdvertInfo(params).then(res => {
          if (res.data.returnCode == 1) {
            this.adsCont[this.active].totalPage = res.data.returnObject.totalPage;
            let listData = res.data.returnObject.list;
            listData.forEach(e => {
              e.advertImgUrl = e.advertImgUrl.replace('http://an-announcement.oss-cn-shanghai.aliyuncs.com/', 'https://oss.in-hope.cn/');
            })
            //过滤小安指南
            listData = listData.filter(function (item) {
              return item.advertId != '4';
            })
            //控制下拉刷新
            this.adsCont[this.active].lists = this.adsCont[this.active].lists.concat(listData);
          } else {
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  };
</script>

<style lang="scss">
  // 加载动画
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  .ads {
    background-color: #f0f1f5;
    width: 100%;
    height: 100%;
    overflow: hidden;
    * {
      box-sizing: border-box;
    }
    .tab-box {
      padding: 0 12px;
      box-sizing: border-box;
      background-color: #FFFFFF;
      .vux-tab-warp {
        .vux-tab-container {
          .vux-tab.scrollable {
            padding-bottom: 0;
            .vux-tab-ink-bar {
              bottom: 0;
            }
          }
        }
      }
    }
    .nav {
      height: 45px;
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      white-space: nowrap;
      padding: 0 12px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        display: block;
        border-bottom: 1px solid #e3e3e3;
        z-index: 30;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        -webkit-transform-origin: 50% 50%;
        transform-origin: 50% 50%
      }
      .nav-scroll {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
          display: none;
          opacity: 0;
        }
        button.linkScroll {
          position: relative;
          height: 45px;
          line-height: 45px;
          font-size: 15px;
          border: 0;
          margin-right: 30px;
          background-color: rgba(255, 255, 255, 0);
          color: #8d8d8d;
          -webkit-transition: all 0.3s ease-in-out;
          -moz-transition: all 0.3s ease-in-out;
          -o-transition: all 0.3s ease-in-out;
          -ms-transition: all 0.3s ease-in-out;
          transition: all 0.3s ease-in-out;
          &:last-child {
            margin-right: 0;
          }
        }
        button.active {
          color: #ffb148;
          font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        }
        .nav-head-sin {
          position: absolute;
          bottom: 1px;
          left: 50%;
          border-radius: 2px;
          border-top: 2px solid #ffb148;
          width: 30px;
          background-color: #ffb148;
          -webkit-transform: translateX(-50%);
          z-index: 1000;
        }
      }
    }
    .nav-content {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      .vux-slider {
        height: 100%;
        .swiper-item {
          .swiper-scroll {
            width: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            .infinite-list {
              .nav-content-list {
                padding: 0 12px 15px 12px;
                &:first-child {
                  padding-top: 15px;
                }
                &:last-child {
                  padding-bottom: 0;
                }
                .list-box {
                  font-size: 0;
                  background-color: white;
                  border-radius: 4px;
                  border: 0.5px solid #e3e3e3;
                  .nav-content-list-title {
                    font-size: 15px;
                    margin: 11px 0 3px 0;
                    padding: 0 8px;
                    box-sizing: border-box;
                  }
                  .nav-content-list-doc {
                    font-size: 12px;
                    padding: 0 8px 11px 8px;
                    box-sizing: border-box;
                    color: #8d8d8d;
                    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                  }
                  img {
                    width: 100%;
                    height: 195px;
                    border-bottom: 0.5px solid #e3e3e3;
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
