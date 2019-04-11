<template>
  <div id="answer">
    <!-- 回答页 -->
    <div class="scrollArea">
      <div class="question">
        <div class="tag">
          <span v-for="(list,index) in tag" :key="index">{{list.value}}</span>
        </div>
        <div class="title">{{title}}</div>
        <div class="describe">
          <span :class="{container: !describeShow}">{{describe}}</span>
          <!--<p v-show="describeShow" style="width: 100%;height: 18px;"></p>-->
          <span class="switch" @click="switchControl">
          <!--<span v-if="describeShow">收起问题描述<i class="icon iconfont icon-xiangshangjiantou"></i></span>
          <span v-else-if="!describeShow"><b>...</b>展开问题描述<i class="icon iconfont icon-xiangxiajiantou"></i></span>-->
          <span v-if="!describeShow"><b>...</b>展开问题描述<i class="icon iconfont icon-xiangxiajiantou"></i></span>
        </span>
        </div>
        <div class="other">
          <span><i>{{focusNum}}</i>人关注</span>
          <span class="joinLine">|</span>
          <span><i>{{answerNum}}</i>个回答</span>
          <span class="focusButton" :class="{blurButton: isFocus}" @click="focusMethod">
          <span v-if="!isFocus">
            <i class="icon iconfont icon-jia3"></i>
          关注问题
          </span>
          <span v-else-if="isFocus">
            <i class="icon iconfont icon-duihao"></i>
          已关注
          </span>
        </span>
        </div>
      </div>
      <div class="content"> <!--  :style="{height: widthChange}" -->
        <ul class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="0">
          <div class="xinhulist" v-for="(item, index) in dataList" :key="index" @click="seeDetaile(item)">
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
            <div class="else">
              <span>{{item.gz}}个关注 <i class="split">|</i></span>
              <span>{{item.zt}}个赞同 <i class="split">|</i></span>
              <span>2018.02.03</span>
            </div>
          </div>
        </ul>
        <p class="infinite-loading" v-if="loaded">
          <mt-spinner type="snake"></mt-spinner>
          <span style="vertical-align: middle">加载中...</span>
        </p>
        <p class="infinite-loading" v-else-if="!loaded">
          <span style="vertical-align: middle">没有更多了！</span>
        </p>
      </div>
    </div>
    <div class="show_footer footer" id="footerDom" v-if="!isOwner">
      <div class="footer-home" @click="goHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p>{{footerHome.name}}</p>
      </div>
      <div class="show_items" v-for="(list, index) in footerItem" :key="index" @click="footerClick(list)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </div>
    <div class="show_footer owner" v-else-if="isOwner">
      <div class="show_items" v-for="(list, index) in ownerItem" :key="index" @click="footerClick(list)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt=""><span class="tabbar-value">{{list.name}}</span>
        </div>
      </div>
      <span class="splitLine"></span>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'

  export default {
    data () {
      return {
        tag: [
          {id: 0, value: '公司治理'},
          {id: 1, value: '独立董事'},
          {id: 2, value: '权利'}
        ],
        title: '独立董事是个什么职位，在公司中是个什么样的角色，有哪些权利？',
        describe: '独立董事是指独立于公司股东且不在公司中内部任职，并与公司或公司经营管理者没有重要的业务联系或专业联系sadfsdaf,独立董事是指独立于公司股东且不在公司中内部任职，并与公司或公司经营管理者没有重要的业务联系或专业联系sadfsdaf,独立董事是指独立于公司股东且不在公司中内部任职，并与公司或公司经营管理者没有重要的业务联系或专业联系sadfsdaf,管理者没有重要的业务',
        describeShow: false,
        isFocus: false,
        focusNum: '310',
        answerNum: '13',
        dataList: [
          {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个什么职位独立董事是个什么职位？',
            gz: '1',
            zt: '5',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '0',
            zt: '8',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }
        ],
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        footerItem: [
          {
            id: 0,
            name: '修改标题',
            value: '',
            show: false,
            icon: this.$image.rules.editimg,
            isshow: false
          },
          {
            id: 1,
            name: '回答问题',
            value: '',
            show: false,
            icon: this.$image.xinhu.answer,
            isshow: true
          },
          {
            id: 2,
            name: '相关内容',
            value: '',
            show: false,
            icon: this.$image.rules.linkIcon,
            isshow: false
          },
        ],
        ownerItem: [
          {
            id: 0,
            name: '编辑问题',
            value: '',
            show: false,
            icon: this.$image.rules.editimg,
            isshow: false
          },
          {
            id: 1,
            name: '删除问题',
            value: '',
            show: false,
            icon: this.$image.xinhu.answer,
            isshow: true
          }
        ],
        loaded: true,
        isOwner: false
      }
    },
    // 使用其它组件
    components: {
      Swiper,
      SwiperItem
    },
    computed: {
//      widthChange () {
//        var header = document.querySelector('question').clientHeight
//      }
    },
    watch: {},
    // 生命周期函数
    created () {

    },
    mounted () {
      var answer = document.getElementById('answer').clientHeight
      var footer = document.getElementsByClassName('show_footer')[0].clientHeight
      var scrollArea = document.getElementsByClassName('scrollArea')[0]
      scrollArea.style.height = answer - footer + 'px'
    },
    // 方法
    methods: {
      seeDetaile (list) {
        // console.log('list == ', list)
        this.$router.push({path: '/xhDetaile'})
      },
      footerClick (index) {
        console.log(index)
      },
      goHome () {
        this.$router.push({path: '/xhList'})
      },
      loadMore () {
        var arr = [
          {
            title: '!!!!!独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个什么职位独立董事是个什么职位？',
            gz: '1',
            zt: '5',
            t: '2018.02.03'
          }, {
            title: '-----独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '0',
            zt: '8',
            t: '2018.02.03'
          }, {
            title: '-----独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '-----独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '-----独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '000独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }, {
            title: '----==独立董事是个什么职位，独立董事是个职位？',
            desc: '独立董事是个什么职位，独立董事是个事是个什么职位？',
            gz: '5',
            zt: '0',
            t: '2018.02.03'
          }
        ]
        if (arr.length == 0) {
          this.loaded = false
        }
        this.dataList = this.dataList.concat(arr)
      },
      switchControl () {
        this.describeShow = this.describeShow ? false : true
      },
      focusMethod () {
        this.isFocus = this.isFocus ? false : true
      }
    }
  }
</script>

<style lang="scss">
  #answer {
    background: #f0f1f5;
    width: 100%;
    height: 100%;
    .scrollArea {
      width: 100%;
      height: auto;
      overflow-y: scroll;
      box-sizing: border-box;
      .question {
        width: 100%;
        height: auto;
        background: #FFF;
        padding: 10px;
        .tag {
          margin-bottom: 10px;
          span {
            display: inline-block;
            font-size: 13px;
            color: #8d8d8d;
            padding: 7px;
            background: #f0f1f5;
            border-radius: 2px;
            margin-right: 3px;
          }
        }
        .title {
          font-size: 16px;
          color: #323232;
        }
        .describe {
          font-size: 12px;
          color: #545454;
          position: relative;
          padding: 10px 0;
          border-bottom: 1px solid #e3e3e3;
          box-sizing: border-box;
          .container {
            width: 100%;
            height: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //规定几行显示省略号
            -webkit-box-orient: vertical;
          }
          .switch {
            position: absolute;
            right: 0;
            bottom: 10px;
            background: #fff;
            color: #ffb148;
            b {
              color: #545454;
              margin-right: 3px;
              display: inline-block;
              padding-left: 2px;
              box-sizing: border-box;
              font-weight: normal;
            }
          }
          span {
            i {
              color: #ffb148;
              font-size: 10px;
            }
          }
        }
        .other {
          width: 100%;
          height: auto;
          padding: 10px 0 0 0;
          line-height: 24px;
          box-sizing: border-box;
          color: #aeaeae;
          font-size: 12px;
          .joinLine {
            font-size: 11px;
            margin: 0 3px;
          }
          i {
            font-weight: normal;
            color: #ffb148;
          }
          .focusButton {
            width: auto;
            height: 23px;
            text-align: center;
            border-radius: 2px;
            border: 1px solid #ffb148;
            font-size: 12px;
            box-sizing: border-box;
            float: right;
            line-height: 23px;
            color: #ffb148;
            padding: 0 3px;
            i {
              line-height: normal;
            }
          }
          .blurButton {
            border: 1px solid #aeaeae;
            color: #aeaeae;
            i {
              color: #aeaeae
            }
          }
        }
      }
      .content {
        width: 100%;
        height: 200px;
        .xinhulist {
          width: 100%;
          height: 100%;
          margin-top: 10px;
          padding: 10px;
          background-color: #fff;
          .title {
            padding-bottom: 5px;
            font-size: 15px;
            color: #323232;
          }
          .desc {
            padding-bottom: 5px;
            font-size: 13px;
            color: #545454
          }
          .else {
            color: #aeaeae;
            span {
              display: inline-block;
            }
            .split {
              display: inline-block;
              padding: 0 .3px;
            }
          }
        }
        .vux-slider > .vux-swiper {
          height: 100% !important;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;

        }
        .infinite-loading {
          text-align: center;
          height: 45px;
          line-height: 45px;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            padding-top: 10px;
            font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
            .mint-spinner-snake {
              display: inline-block;
              vertical-align: middle;
              border: 2px solid transparent;
              border-top-color: rgb(252, 199, 127) !important;
              border-left-color: rgb(252, 199, 127) !important;
              border-bottom-color: rgb(252, 199, 127) !important;
              height: 14px !important;
              width: 14px !important;
              -webkit-animation: mint-spinner-rotate 0.8s infinite linear !important;
              animation: mint-spinner-rotate 0.8s infinite linear !important;
              border-radius: 50%;
              color: #535353;
            }
          }
          span:last-child {
            height: auto;
            padding-top: 0px;
            line-height: 20px;
          }
        }
      }
    }

    /*.footer {*/
    /*width: 100%;height: 50px;background: #f0f1f5;border-top: 1px solid #d8d8d8;box-sizing: border-box;*/
    /*position: fixed;left:0;bottom:0;*/
    /*}*/
    .show_footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      z-index: 300;
      display: flex;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .show_items:hover .tt-clue {
        opacity: 0.9;
        bottom: 70px;
      }
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        height: 100%;
        padding: 5px 0;
        text-align: center;
        border-right: 1px solid #e3e3e3;
        box-sizing: border-box;
        float: left;
        .tabbar-Icon {
          padding: 0 15px;
          img {
            height: 19px;
          }
        }
        p {
          font-size: 12px;
          color: #767877;
        }
      }
      .show_items {
        flex: 1;
        height: 100%;
        text-align: center;
        color: #767877;
        font-size: 12px;
        text-decoration: none;
        padding: 5px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        position: relative;
        .tabbar-Icon {
          img {
            height: 20px;
          }
        }
        .tabbar-value {
          font-size: 12px;
          color: #767877;
        }
        .show_shareIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/Attribute.png");
        }
        .show_collectIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/celloctIcon.png");
        }
        .show_relativeIcon {
          background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/linkIcon.png");
        }
      }

      .show_items.active {
        color: #f6900c;
      }
      .show_items span {
        display: block;
        width: 100%;
      }
      .show_shareIcon, .show_collectIcon, .show_relativeIcon {
        height: 50%;
      }

    }
    .owner {
      position: relative;
      .splitLine {
        display: inline-block;width: 1px;height: 35px;background: #e3e3e3;
        position: absolute;left:0;right:0;bottom:0;top:0;margin: auto;
      }
      .show_items {
        .tabbar-Icon {
          margin-top: 10px;overflow: hidden;
          img {
            display: inline-block;
            height: 17px;vertical-align: middle;
          }
          span {
            display: inline-block;vertical-align: middle;
            width: auto;height: 100%;
            font-size: 15px;font-weight: normal;
            color: #8d8d8d;margin-left: 5px;
          }
        }
      }
    }
  }
</style>
