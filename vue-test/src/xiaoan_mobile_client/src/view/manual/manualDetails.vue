<template>
  <div id="manual-details" class="xiaoan-box" ref="xioanDom">
    <div class="nav vux-1px-b" ref="navDom">
      <ul class="nav-scroll" ref="itemDom">
        <li v-for="(list,index) in manualTypeData" :class="{active:list.active}" @click="switchCut(index)">
          <div class="li-label">{{list.name}}<span class="ink-bar"></span></div>
        </li>
      </ul>
    </div>
    <div class="sw-content" :style="{height:swHeight+'px'}">
      <swiper v-model="active1" :height="'100%'" :dots-position="'center'" :show-dots="true">
        <swiper-item v-for="(item, index) in activeData" :key="index">
          <div class="img-box">
            <img :src="item.img" alt="">
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="sw-footer" ref="footDom">
      <ul class="title-type">
        <li class="title fcolor1">{{activeAbout.title}}</li>
        <li class="link" @click="routeLink"><img :src="$image.manual.manualRight" alt=""></li>
      </ul>
      <ul class="about">
        <li class="desc fcolor2">{{activeAbout.about}}</li>
        <li class="QCode"><img :src="$image.manual.QCode" alt=""></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'vux';

  export default {
    name: "manual-details",
    data() {
      return {
        swHeight: 0,
        active: 0,
        active1: 0,
        activeData: [],
        activeAbout: {},
        offScroll: [],
        manualTypeData: [
          {
            name: '信乎', type: 'xh', active: false,
            data: [
              {
                title: '信公小安·信乎',
                type: 'xh',
                about: '信乎社区是高质量资本市场知识问答社区，网罗业界各领域专家大咖提供高质量的精彩回答，旨在为资本市场从业人员打造出可以相互交流、共同学习的知识互通共享型平台。',
                link: '/xhList',
                img: this.$image.manual.xh
              },
            ]
          },
          {
            name: '法规', type: 'law', active: true,
            data: [
              {
                title: '信公小安·法规',
                type: 'law',
                about: '信公小安的法规库涵盖了证监会、交易所、登记公司、财政部、税务总局等机构出台的与上市公司相关的法律法规，实时更新。',
                link: '/rule',
                img: this.$image.manual.law1
              },
              {
                title: '信公小安·法规',
                type: 'law',
                about: '支持标题、全文的精确检索和模糊检索，同时提供精确筛选。',
                link: '/rule',
                img: this.$image.manual.law2
              },
              {
                title: '信公小安·法规',
                type: 'law',
                about: '智能匹配相关法规，专业整合避免重复检索。',
                link: '/rule',
                img: this.$image.manual.law3
              }
            ]
          },
          {
            name: '公告', type: 'affiche', active: false,
            data: [
              {
                title: '信公小安·公告',
                type: 'affiche',
                about: '信公小安收录了沪深上市公司的所有公告，实时更新。提供公司代码、标题和全文精确检索和模糊检索功能，用户可通过所属板块、所属行业及时间进行精准筛选。',
                link: '/affiche',
                img: this.$image.manual.affiche1
              },
              {
                title: '信公小安·公告',
                type: 'affiche',
                about: '输入证券简称/代码可查看实时股价、涨跌幅、成交情况等行情数据，一览同行业相关数据。信公小安智能自动核算当日偏离值/换手率，及时发出异动提醒。\n',
                link: '/affiche',
                img: this.$image.manual.affiche2
              }
            ]
          },
          {
            name: '研报', type: 'report', active: false,
            data: [
              {
                title: '信公小安·研报',
                type: 'report',
                about: '信公小安获得多家知名券商研报授权，通过分析用户使用习惯和搜索记录智能呈现最新、最权威、最相关研报。系统了解行业状况，把握关注公司最新动向。',
                link: '/report',
                img: this.$image.manual.report
              }
            ]
          },
          {
            name: 'IPO', type: 'ipo', active: false,
            data: [
              {
                title: '信公小安·IPO',
                type: 'ipo',
                about: '收录沪深IPO企业及已上市公司招股书、反馈意见及发审会关注问题。用户可快速了解同行业整体情况，及时掌握公司及行业审核进度，更能快捷研究分析特定问题。',
                link: '/ipo/list',
                img: this.$image.manual.ipo
              }
            ]
          },
          {
            name: '权限速查', type: 'reference', active: false,
            data: [
              {
                title: '信公小安·权限速查',
                type: 'reference',
                about: '上市公司可随时查看公司发生交易、关联交易、对外担保、重大资产重组、重大合同、诉讼及仲裁、政府补助以及资产减值时的披露和审议权限标准。',
                link: '/lookupTables',
                img: this.$image.manual.reference
              }
            ]
          },
          {
            name: '舆情', type: 'opinion', active: false,
            data: [
              {
                title: '信公小安·舆情',
                type: 'opinion',
                about: '信公小安舆情通过统计和分析多家媒体数据源，实时监控上市公司舆情信息，自定义项目让用户一览公司舆情分布及媒体舆情走势，直观分类、汇总推送让舆论情况了然于心。',
                link: '/superviseList',
                img: this.$image.manual.opinion
              }
            ]
          },
          {
            name: '日历', type: 'calendar', active: false,
            data: [
              {
                title: '信公小安·日历',
                type: 'calendar',
                about: '关键时间点自动更新，工作安排梳理呈现，多渠道可选通知，重大日程无遗漏。',
                link: '/calendar/calendarAll',
                img: this.$image.manual.calendar1
              },
              {
                title: '信公小安·日历',
                type: 'calendar',
                about: '小安日历内含智能标准化的模板并持续自动更新重大时间节点，帮助董办成员更加高效准确地安排董办工作中所涉及的繁琐事项。',
                link: '/calendar/calendarAll',
                img: this.$image.manual.calendar2
              }
            ]
          },
          {
            name: '精选', type: 'choice', active: false,
            data: [
              {
                title: '信公小安·精选',
                type: 'choice',
                about: '小安精选里收藏着各类法规合辑、行业研究报告、新规解读、资本市场热点分析解读、董办问题汇总等大量学习资料，干货满满的精选内容充当你的学习资料库。',
                link: '/ads',
                img: this.$image.manual.choice
              },
            ]
          },
          {
            name: '董秘测评', type: 'testing', active: false,
            data: [
              {
                title: '信公小安·董秘测评',
                type: 'testing',
                about: '董秘测评涵盖沪深两市和新三板，题目涉及信息披露、公司治理、股票交易、发行、收购、重组等多个专业维度。题目难度层级自动匹配，信公小安将并根据测评结果推荐相关学习资料。',
                link: '/testing',
                img: this.$image.manual.testing
              }
            ]
          },
          {
            name: '信公商学院', type: 'xiaoetong', active: false,
            data: [
              {
                title: '信公小安·信公商学院',
                type: 'xiaoetong',
                about: '课程由在证券市场从业多年的专家团队精心打造，旨在为上市及筹备上市的董办成员、董事、监事及高级管理人员，投行、法律、会计服务的中介机构从业人员，提供系统、务实、有效的专业指导。',
                link: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/',
                img: this.$image.manual.xiaoetong
              }
            ]
          },
        ],
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    watch: {
      active: function (val) {
        this.$nextTick(() => {
          this.active1 = 0;
          this.offsetLeft(val);
        })
      },
      active1: function (val) {
        this.activeAbout = this.activeData[val];
        this.swHeight = this.$refs.xioanDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footDom.clientHeight;

      }
    },
    created() {
      //
      if (this.$route.query.type) {
        this.manualTypeData.forEach((item, index) => {
          if (item.type == this.$route.query.type) {
            this.switchCut(index);
          }
        })
      } else {
        this.$router.replace({path: '/manual/details', query: {type: this.manualTypeData[0].type}});
        this.switchCut(0);
      }
    },
    mounted() {
      // 默认初始处理的dom
      let scrollList = document.querySelectorAll('.nav-scroll li');
      scrollList.forEach((item) => {
        this.offScroll.push(item.offsetLeft);
      });
      //
      setTimeout(() => {
        this.$nextTick(() => {
          this.swHeight = this.$refs.xioanDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footDom.clientHeight;
        })
      },0)
      // 分享
      let shareTitle = '小安指南';
      let shareLink = this.$api.CURRENTIP.IP + '#/manual/details'; // 分享链接
      let shareDesc = ''; // 描述
      this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
    },
    methods: {
      //
      offsetLeft(index) {
        let presentDom = document.querySelector('ul .active').clientWidth / 2;
        let DOMWidth = (this.$refs.xioanDom.clientWidth) / 2;
        let liLeft = (this.offScroll[index]) + presentDom;
        $(".nav-scroll").animate({scrollLeft: liLeft - DOMWidth});
        this.$nextTick(() => {
          this.swHeight = this.$refs.xioanDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footDom.clientHeight;
        })
      },
      //
      routeLink() {
        // console.log(this.activeData[this.active1]);
        let data = this.activeAbout;
        if (data.type == 'xiaoetong') {
          location.href = data.link;
        } else {
          this.$router.push({path: data.link});
        }
      },
      //
      switchCut(index) {
        this.$nextTick(() => {
          this.swHeight = this.$refs.xioanDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footDom.clientHeight;
        })
        this.active = index;
        this.activeData = this.manualTypeData[index].data;
        this.activeAbout = this.activeData[0];
        this.manualTypeData.forEach((item) => {
          item.active = false;
        });
        this.manualTypeData[index].active = true;
        this.$router.replace({path: '/manual/details', query: {type: this.manualTypeData[index].type}});
      }
    }
  }
</script>

<style lang="scss">
  #manual-details {
    position: relative;
    .nav {
      height: 45px;
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      white-space: nowrap;
      padding: 0 12px;
      position: relative;
      .nav-scroll {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
          width: 0 !important;
          display: none;
          opacity: 0;
        }
        li {
          display: inline-block;
          height: 45px;
          line-height: 45px;
          font-size: 15px;
          border: 0;
          padding-right: 15px;
          padding-left: 15px;
          background-color: rgba(255, 255, 255, 0);
          color: #8d8d8d;
          transition: all 0.3s ease-in-out;
          .li-label {
            position: relative;
          }
          &:last-child {
            padding-right: 0;
          }
          &:first-child {
            padding-left: 0;
          }
          &.active {
            color: #ffb148;
            font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
            .ink-bar {
              position: absolute;
              bottom: 0;
              left: 50%;
              border-radius: 2px;
              border-top: 2px solid #ffb148;
              width: 30px;
              background-color: #ffb148;
              margin-left: -15px;
              z-index: 1000;
            }
          }
        }
      }
    }
    .sw-content {
      /*border: 1px solid red;*/
      background: url("https://oss.in-hope.cn/xiaoan/h5_static/manual/background@3x.png");
      background-size: 100%;
      background-repeat: no-repeat;
      .vux-slider {
        height: 100%;
        .vux-swiper {
          height: 100%;
          .img-box {
            height: 100%;
            width: 100%;
            text-align: center;
          }
          img {
            padding: 3% 0;
            height: 100%;
            margin: 0 auto;
            vertical-align: middle;
          }
        }
        .vux-indicator {
          bottom: 5px;
          a {
            &:first-child {
              margin-left: 0;
            }
            i {
              border-radius: 0;
              width: 14px;
              height: 3px;
            }
          }
        }
      }
    }
    .sw-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: white;
      height: 120px;
      * {
        transition: all 0.3s ease-in-out;
      }
      transition: all 0.3s ease-in-out;
      .title-type {
        width: 100%;
        padding: 10px 12px 0;
        display: flex;
        justify-content: space-between;
        li {
          flex: 1;
          &.title {
            flex: 0 0 65%;
            font-size: 17px;
          }
          &.link {
            flex: 0 0 35%;
            text-align: right;
            img {
              height: 24px;
              vertical-align: middle;
            }
          }
        }
      }
      .about {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px 12px;
        li {
          flex: 1;
          &.desc {
            text-align: justify;
            font-size: 12px;
            padding-right: 10px;
          }
          &.QCode {
            flex: 0 0 14%;
            img {
              height: 65px;
              vertical-align: middle;
              border: 4px solid #fff;
              border-radius: 2px;
              box-shadow: 0px 0px 10px #d2d2d2;
            }
          }
        }

      }
    }
  }
</style>
