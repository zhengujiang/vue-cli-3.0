<template>
  <div class="xiaoan-box message-item" :style="{height:height+'px'}">
    <div class="message-item-scroll" :style="{height:height+'px'}">
      <ul v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" :infinite-scroll-distance="0">
        <li class="infinite" v-for="(list, index) of messageData"
            @click="toLink(index)">
          <div class="li-box vux-1px-b">
            <div class="cell nameImg">
              <!--关注-->
              <span class="defaultImg" v-if="list.messageType == 1 || list.messageType == 8 || list.messageType == 9">
                <img :src="$image.message.admin" alt="" v-if="list.fromUserAvatar == 'admin'">
                <img :src="list.fromUserAvatar" alt="">
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--公告 - 研报-->
              <span class="stock-code" v-else-if="list.messageType == 2 || list.messageType == 4">
                <span class="code" :class="{SH:list.stockMarket == 'SH'}" v-if="list.stockMarket == 'SH'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'SZ'}" v-if="list.stockMarket == 'SZ'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'ZX'}" v-if="list.stockMarket == 'ZX'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'CY'}" v-if="list.stockMarket == 'CY'">{{list.companyCode}}</span>
                <badge class="xa-stock-badge" v-show="!list.readIs"></badge>
              </span>
              <!--舆情 - 异动-->
              <span class="defaultImg" v-else-if="list.messageType == 3 || list.messageType == 5">
                <img :src="$image.message.remind" alt=""
                     v-if="list.fromUserAvatar == '' || list.fromUserAvatar == null">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--信乎-->
              <span class="defaultImg" v-else-if="list.messageType == 6">
                <img :src="$image.message.admin" alt="" v-if="list.fromUserAvatar == 'admin'">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <span class="defaultImg" v-else>
                 <img :src="$image.message.admin" alt="">
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
            </div>
            <div class="cell doc">
              <p class="title">{{list.messageContent}}</p>
              <p class="about" v-show="false">{{list.about}}</p>
              <p class="origin"><span>{{$const.format(list.createDate)}}</span></p>
            </div>
          </div>
        </li>
      </ul>
      <p class="infinite-loading">
        <xiaoan-drop v-model="loading"></xiaoan-drop>
      </p>
    </div>
    <xiaoan-loading v-show="allLoading"></xiaoan-loading>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="warning.isBtns"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
  </div>
</template>

<script>
  import XiaoanWarning from '@/components/warning/warning'
  import XiaoanLoading from '@/components/warning/loading'
  import {Badge} from 'vux'
  export default {
    name: "message-item",
    components: {
      XiaoanWarning, XiaoanLoading, Badge
    },
    data() {
      return {
        allLoading: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.message.warning,
          text: '你暂时还没有消息！',
          btnText: '去关注',
          isBtns: false
        },
        messageData: [],
        messageTypeObj: [
          {show: true, type: 'total', name: '全部', value: 0, active: '', badge: true},
          {show: true, type: 'xinhu', name: '信乎', value: 6, active: '', badge: true},
          {show: true, type: 'focus', name: '关注', value: 1, active: '', badge: true},
          {show: true, type: 'notice', name: '公告', value: 2, active: '', badge: true},
          {show: true, type: 'stock', name: '异动', value: 3, active: '', badge: true},
          {show: true, type: 'report', name: '研报', value: 4, active: '', badge: true},
          {show: true, type: 'opinion', name: '舆情', value: 5, active: '', badge: true}
        ],
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        messageType: 0,
        loading: false,
        allLoaded: false
      }
    },
    props: {
      height: {
        type: Number,
        required: false, // 是否必填
        default: 0,
      },
      active: {
        type: Number,
        required: false, // 是否必填
        default: 0,
      },
      type: {
        type: String,
        required: false, // 是否必填
        default: 'total',
      },
      remind: {
        type: Number,
        required: false, // 是否必填
        default: 0,
      },
    },
    watch: {
      remind: function (val) {
        console.log('remind', val);
        this.page = {
          index: 1,
          size: 20,
          total: 0
        };
        this.messageData = [];
        this.getMessageByType(this.messageType);
      },
      type: function () {

      }
    },
    created() {
      console.log('234324234===========>', this.$route.query.active);
      this.allLoading = true;
      switch (this.type) {
        case 'total':
          this.messageType = 0;
          break;
        case 'focus':
          this.messageType = 1;
          break;
        case 'notice':
          this.messageType = 2;
          break;
        case 'stock':
          this.messageType = 3;
          break;
        case 'report':
          this.messageType = 4;
          break;
        case 'xinhu':
          this.messageType = 6;
          break;
        case 'opinion':
          this.messageType = 5;
          break;
      }
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.getMessageByType(this.messageType);
      }
    },
    mounted() {
      setTimeout(() => {
        this.allLoading = false;
      }, 300)
    },
    methods: {
      //
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true;
        } else {
          this.loading = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index += 1;
            this.getMessageByType(this.messageType);
          }
          setTimeout(() => {
            this.loading = false;
          }, 5000)
        }, 300);
      },
      //
      getQuestionIdByAnswerId(id) {
        /*this.$http({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          },
        })*/
        let params = {
          answerId: id
        }
        this.$axios.xinhu.getQuestionIdByAnswerId(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$router.push({path: '/xhAnswerDetaile', query: {questionId: res.data.returnObject, answerId: id}});
          } else if (res.data.returnCode == -1) {
            this.$router.push({path: '/error', query: {text: '', img: ''}});
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      //
      toLink(index) {
        console.log(this.messageData[index].toUrlType);
        let srt = true;
        switch (this.messageData[index].toUrlType) {
          case 'ANSWER_DETAIL':
            // 信乎 答案详情页
            this.getQuestionIdByAnswerId(this.messageData[index].toUrlParam);
            break;
          case 'QUESTION_DETAIL':
            // 信乎 问题详情页
            this.$router.push({path: '/xhQuestionDetaile', query: {questionId: this.messageData[index].toUrlParam}});
            break;
          case 'USER_INFO':
            // 用户个人主页
            this.$router.push({path: '/userOther', query: {selectUserId: this.messageData[index].toUrlParam}});
            break;
          case 'COLLECT_DETAIL':
            // 收藏夹详情页
            this.$router.push({path: '/collect/collectDetails', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'COMPANY_ANNOUNCEMENT_DETAIL':
            // 公司公告详情页
            this.$router.push({
              path: '/afficheList',
              query: {code: this.messageData[index].stockMarket + this.messageData[index].companyCode}
            });
            break;
          case 'ANNOUNCEMENT_LIST':
            // 公告汇聚页
            this.$router.push({path: '/focus', query: {active: 'notice'}});
            break;
          case 'REPORT_DETAIL':
            // 研报详情页
            this.$router.push({path: '/detailReport', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'SENTIMENT_DETAIL':
            // 舆情项目详情页
            this.$router.push({path: '/opinion', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'XIAO_E_TONG':
            // 商学院跳转
            location.href = this.messageData[index].toUrlParam;
            //this.$router.push({path: '/opinion', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'INSTITUTION_DETAIL':
            // 制度详情
            this.$vux.alert.show({
              title: '提示',
              content: '请登录桌面端查看！',
              onShow() {
                console.log('Plugin: I\'m showing')
              },
              onHide() {
                console.log('Plugin: I\'m hiding')
              }
            })
            srt = false;
            break;
          case (null || ''):
            // 舆情项目详情页
            // 哪也不去 就在这
            break;
        }
        this.setUserMsgRead(index);
        // if (this.messageData[index].readIs) {
        // } else {
        //   this.setUserMsgRead(index);
        // }
      },
      //
      setUserMsgRead(index) {
        let params = {
            messageId: this.messageData[index].messageId
          }
        this.$axios.userMsg.setUserMsgRead(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page = {
              index: 1,
              size: 20,
              total: 0
            };
            this.messageData = [];
            this.getMessageByType(this.messageType);
          }
        }).catch((data) => {

        })
      },
      //
      getMessageByType(messageType) {
        let params = {
            messageType: messageType,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        this.$axios.userMsg.getMessageByType(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = this.$array.totalPage(res.data.total, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject.infoList;
              this.messageData = this.$array.loadMore(this.messageData, data);
            } else {
              this.warning.show = true;
            }
          } else if (res.data.returnCode == -1) {
            if (this.messageData.length == 0) {
              this.warning.show = true;
            }
          }
        }).catch((data) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .message-item {
    .message-item-scroll {
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul {
        li.infinite.backColor {
          background-color: #FFFFFF;
        }
        li.infinite {
          padding: 0 12px;
          background-color: white;
          &:active {
            background-color: #f0f1f5;
          }
          .li-box {
            padding: 10px 0;
            display: table;
            table-layout: fixed;
            word-wrap: break-word;
            width: 100%;
            .cell.nameImg {
              width: 17%;
            }
            .cell.doc {
              width: 83%;
            }
            .cell {
              display: table-cell;
              vertical-align: middle;
              .defaultImg {
                position: relative;
                img {
                  width: 42px;
                  height: 42px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                .xa-badge {
                  position: absolute;
                  top: -10px;
                  right: 0;
                  padding: 4px;
                }
              }
              .stock-code {
                position: relative;
                .xa-stock-badge {
                  position: absolute;
                  top: -10px;
                  right: 0;
                  padding: 4px;
                }
                span.code {
                  display: inline-block;
                  height: 20px;
                  width: 50px;
                  line-height: 20px;
                  font-size: 11px;
                  text-align: center;
                  border-radius: 2px;
                  color: #FFFFFF;
                }
                span.SH {
                  background-color: #fea692;
                }
                span.SZ {
                  background-color: #91b8f3;
                }
              }
              .title {
                font-size: 15px;
                color: #323232;
                text-align: justify;
                text-justify: auto;
                margin-bottom: 5px;
              }
              .about {
                font-size: 13px;
                color: #545454;
                text-justify: distribute;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 5px;
              }
              .origin {
                color: #aeaeae;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
</style>
