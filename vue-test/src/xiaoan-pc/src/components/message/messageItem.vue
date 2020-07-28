<template>
  <div id="message-item" v-loading="loading">
    <div class="header">
      <div class="header-box">
        <div class="item left">
          <el-select size="mini" v-model="selectName" placeholder="请选择" @change="selectMessageType">
            <el-option v-for="item in messageTypeObj" :key="item.type" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-button v-if="isAllRead" size="small" type="text" @click="setAllUserMsgRead(selectName)">全部标记为已读
          </el-button>
        </div>
      </div>
    </div>
    <div class="content-message">
      <ul class="" v-if="messageData.length > 0">
        <li class="infinite" v-for="(list, index) in messageData" :key="index" @click="toLink(index)">
          <div class="li-box vux-1px-b">
            <div class="cell nameImg">
              <!--关注(1) - 小安企业系统提醒(8) - 规章制度(9)-->
              <span class="defaultImg"
                    v-if="list.messageType == 1 || list.messageType == 8 || list.messageType == 9"
              >
                <img :src="$image.message.messageadmin" alt="" v-if="list.fromUserAvatar == 'admin'">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--公告(2) - 研报(4)-->
              <span class="stock-code" v-else-if="list.messageType == 2 || list.messageType == 4">
                <span class="code" :class="{SH:list.stockMarket == 'SH'}" v-if="list.stockMarket == 'SH'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'SZ'}" v-if="list.stockMarket == 'SZ'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'ZX'}" v-if="list.stockMarket == 'ZX'">{{list.companyCode}}</span>
                <span class="code" :class="{SZ:list.stockMarket == 'CY'}" v-if="list.stockMarket == 'CY'">{{list.companyCode}}</span>
                <badge class="xa-stock-badge" v-show="!list.readIs"></badge>
              </span>
              <!-- 股票异动(3)-->
              <span class="defaultImg" v-else-if="list.messageType == 3">
                <img :src="$image.message.messageremind" alt=""
                     v-if="list.fromUserAvatar == '' || list.fromUserAvatar == null">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--信乎(6)-->
              <span class="defaultImg" v-else-if="list.messageType == 6">
                <img :src="$image.message.messageadmin" alt="" v-if="list.fromUserAvatar == 'admin'">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--e投关(10)-->
              <span class="defaultImg" v-else-if="list.messageType == 10">
                <img :src="investorImg" alt="">
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!--笔记(11) 活动(13) 舆情(15) 公司舆情(17) 自定义舆情方案(18)-->
              <span class="defaultImg"
                    v-if="list.messageType == 11 || list.messageType == 17 || list.messageType == 18 || list.messageType == 12 || list.messageType == 13 || list.messageType== 15"
              >
                <img :src="$image.message.messageadmin" alt="" v-if="list.fromUserAvatar == 'admin'">
                <img :src="list.fromUserAvatar" alt="" v-else>
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!-- 股行分(14)-->
              <span class="defaultImg" v-if="list.messageType == 14">
                <img :src="$image.message.gxfinfo" alt="">
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
              <!-- 商学院(16)-->
              <span class="defaultImg" v-if="list.messageType == 16">
                <img :src="$image.message.sxy" alt="">
                <badge class="xa-badge" v-show="!list.readIs"></badge>
              </span>
            </div>
            <div class="cell doc">
              <p class="title">{{list.messageContent}}</p>
              <p class="about" v-show="false">{{list.about}}</p>
              <p class="origin"><span>{{$common.transTime(list.createDate)[0]}}</span></p>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li class="warning">暂无数据</li>
      </ul>
    </div>
    <div class="content-page">

    </div>
    <div class="footer-message" v-if="page.total > 0">
      <el-pagination small background layout="prev, pager, next" :page-size="page.size" :total="page.total"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
  import Badge from '@/components/vux/badge.vue'
  export default {
    name: "message-item",
    components: {
      Badge
    },
    props: {
      messageTop: {
        type: Boolean,
        default: false
      },
      setUpdate: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        investorImg: this.$image.message.messageinvestor, // 投关用的图片
        loading: false,
        selectName: 0,
        messageTypeObj: [
          {show: true, type: 'total', name: '全部', value: 0, active: '', badge: true},
          {show: true, type: 'sxy', name: '商学院', value: 16, active: '', badge: true},
          {show: true, type: 'xinhu', name: '信乎', value: 6, active: '', badge: true},
          {show: true, type: 'focus', name: '关注', value: 1, active: '', badge: true},
          {show: true, type: 'notice', name: '公告', value: 2, active: '', badge: true},
          {show: true, type: 'stock', name: '异动', value: 3, active: '', badge: true},
          {show: true, type: 'report', name: '研报', value: 4, active: '', badge: true},
          {show: true, type: 'investor', name: 'e投关', value: 10, active: '', badge: true},
          {show: true, type: 'gxf', name: '股行分', value: 14, active: '', badge: true},
          {show: true, type: 'yq', name: '舆情', value: 15, active: '', badge: true}
          // {show: true, type: 'opinion', name: '舆情', value: 5, active: '', badge: true}
        ],
        messageData: [],
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        fallback: false,
        warning: false,
        type: 0,
        isAllRead: false
      }
    },
    watch: {
      setUpdate(val) {
        this.loading = true;
        setTimeout(() => {
          this.getMessageByType(this.selectName);
        }, 500)
      },
      type: function (val) {
        this.page.index = 1;
        this.getMessageByType(val);
      }
    },
    created() {
      console.log(this.$image.message)
      this.getMessageByType(this.selectName);
    },
    methods: {
      handleCurrentChange(index) {
        this.page.index = index;
        this.getMessageByType(this.selectName);
      },
      clearMessage() {

      },
      setAllUserMsgRead(messageType) {
        this.$confirm('确定要全部标记为已读吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: "PUT",
            url: this.$api.userMsg.setAllUserMsgRead,
            params: {
              msgType: messageType,
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.getMessageByType(this.selectName);
            }
          }).catch((error) => {
            // this.$vux.toast.show({text: error, position: 'middle', type: 'text', width: 'auto', time: 2500});
          })
        }).catch(() => {

        });
      },
      //
      selectMessageType(val) {
        console.log(val);
        this.page = {index: 1, size: 20, total: 0};
        this.getMessageByType(val);
      },
      //
      getMessageByType(type) {
        this.loading = true;
        this.$http({
          method: 'GET',
          url: this.$api.message.getMessageByType,
          params: {
            isEnterprise: true,
            userId: this.$cookie.get('userId'),
            messageType: type,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then((res) => {
          console.log(res);
          setTimeout(() => {
            this.loading = false;
          }, 500);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = res.data.total;
            this.$nextTick(() => {
              if (window.localStorage) {
                if (window.localStorage.getItem('SEARCHUSERDATA')) {
                  let data = window.JSON.parse(window.localStorage.getItem('SEARCHUSERDATA'));
                  //
                  if (data.readMsgCount > 0) {
                    this.isAllRead = true
                  }
                }
              }
            });
            if (res.data.returnObject != null) {
              // 控制下拉刷新
              let data = res.data.returnObject.infoList;
              this.messageData = data;
              //
              this.$emit('set-fallback', this.fallback, false);
            } else {
              this.messageData = [];
            }
          } else if (res.data.returnCode == -1) {
            this.messageData = [];
          }
        }).catch((err) => {

        })
      },
      // 通知的跳转
      toLink(index) {
        let set = false;
        switch (this.messageData[index].toUrlType) {
          case 'ANSWER_DETAIL':
            // 信乎 答案详情页
            set = true;
            this.getQuestionIdByAnswerId(this.messageData[index].toUrlParam);
            break;
          case 'QUESTION_DETAIL':
            set = true;
            // 信乎 问题详情页
            this.$common.openWindow('/xhQuestionDetail?questionId=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/xhQuestionDetail', query: {questionId: this.messageData[index].toUrlParam}});
            break;
          case 'USER_INFO':
            set = true;
            // 用户个人主页
            this.$common.openWindow('/xhMy?selectUserId=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/xhMy', query: {selectUserId: this.messageData[index].toUrlParam}});
            break;
          case 'COLLECT_DETAIL':
            set = true;
            // 收藏夹详情页
            this.$common.openWindow('/collect/collectDetails?id=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/collect/collectDetails', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'COMPANY_ANNOUNCEMENT_DETAIL':
            set = true;
            // 公司公告详情页
            this.$common.openWindow('/company-condition/' + this.messageData[index].stockMarket + this.messageData[index].companyCode)
            break;
          case 'ANNOUNCEMENT_LIST':
            set = true;
            this.$common.openWindow('/affiche?code=' + this.messageData[index].companyCode);
            // 公告汇聚页
            // this.$router.push({path: '/focus', query: {active: 'notice'}});
            break;
          case 'REPORT_DETAIL':
            set = true;
            // 研报详情页
            this.$common.openWindow('/report/details?id=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/report/details', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'SENTIMENT_DETAIL':
            set = true;
            // 舆情项目详情页
            this.$common.openWindow('/supervise?id=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'INSTITUTION_DETAIL':
            set = true;
            // 制度详情
            this.$common.openWindow('/regulation/manage?id=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'INTERACT_DETAIL':
            set = true;
            // e投关的枚举
            this.$common.openWindow('/investor/answer?id=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'ACTIVE_DETAIL':
            set = true;
            // 活动详情的枚举
            // 跳转 。。。
            break;
          case 'LAW_NOTE_COMMENT':
            set = true;
            // 笔记详情页
            this.$common.openWindow('/rule/details?id=' + this.messageData[index].toUrlLawId)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'LAW_NOTE_LOCATION':
            set = true;
            // 笔记详情页
            this.$common.openWindow('/rule/details?id=' + this.messageData[index].toUrlLawId)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'LAW_NOTE_COMMENT_LOCATION':
            set = true;
            // 笔记详情页
            this.$common.openWindow('/rule/details?id=' + this.messageData[index].toUrlLawId)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'GXF_DATA_MANAGE':
            set = true;
            // 股行分
            this.$common.openWindow('/stockholder/rosterExport')
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'SENTIMENT_COMPANY':
            set = true;
            // 公司舆情
            this.$common.openWindow('/sentiment/companySentimentList')
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'SENTIMENT_PLANS':
            set = true;
            // 自定义舆情
            this.$common.openWindow('/sentiment/sentimentMonitor?SentimentPlanId=' + this.messageData[index].toUrlParam)
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case 'XIAO_E_TONG':
            set = true;
            // 自定义舆情
            if (this.messageData[index].toUrlParam) {
              this.$common.openWindow(this.messageData[index].toUrlParam)
            } else {
              let url = `${window.location.origin.replace('web', 'ilearn').replace('xiaoan', 'ilearn')}/index`
              this.$common.openWindow(url)
            }
            
            // this.$router.push({path: '/supervise', query: {id: this.messageData[index].toUrlParam}});
            break;
          case (null || ''):
            set = false;
            // 舆情项目详情页
            break;
        }
        if (this.messageData[index].readIs) {
          if (set) {
            console.log(this.messageData[index]);
            this.$emit('set-fallback', (this.fallback));
          }
        } else {
          setTimeout(() => {
            this.setUserMsgRead(index);
          })
        }
        //
      },
      //
      getQuestionIdByAnswerId(id) {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let url = '/xhAnswerDetail?questionId=' + res.data.returnObject + '&answerId=' + id;
            let that = this;
            var newWin = null,
              isBlock = !1;
            /** 新窗口被某些扩展阻止打开，会抛出错误，因此使用try..catch **/
            try {
              newWin = window.open(url);
              if (newWin == null || newWin == undefined) {
                that.$router.push(url);
                setTimeout(() => {
                  if (that.$route.path == 'xhAnswerDetail') {
                    window.location.reload();
                  }
                }, 300)
              }
              /** 新窗口被阻止时，返回值是undefined或null**/
              (!newWin) && (isBlock = !0);
            } catch (ex) {
              isBlock = !0;
            }
            if (isBlock) {
              // 被拦截
              that.$router.push(url);
            }
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '问题不存在或者已删除！'})
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      //
      setUserMsgRead(index) {
        this.$http({
          method: "PUT",
          url: this.$api.userMsg.setUserMsgRead,
          params: {
            messageId: this.messageData[index].messageId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            // this.page = {index: 1, size: 20, total: 0};
            this.$emit('set-fallback', (this.fallback));
            this.messageData = [];
            this.getMessageByType(this.selectName);
          }
        }).catch((data) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #message-item {
    position: relative;
    transition: all .3s;
    .header {
      padding: 0 20px;
      .header-box {
        padding: 15px 0 10px 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e3e3e3;
        .item {
          flex: 1;
          &.left {
            padding-right: 50%;
          }
          &:last-child {
            text-align: right;
          }
          .el-button.el-button--small {
            font-size: 14px;
            padding: 5px 0;
          }
        }
      }
    }
    .content-page {
      text-align: center;
    }
    .content-message {
      height: 460px;
      max-height: 460px;
      overflow: auto;
      ul {
        .warning {
          padding: 10px 0;
          text-align: center;
          font-size: 14px;
          color: #8d8d8d;
        }
      }
      ul {
        li.infinite.backColor {
          background-color: #FFFFFF;
        }
        li.infinite {
          padding: 0 20px;
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
                font-size: 13px;
                line-height: 17px;
                color: #323232;
                max-height: 52px;
                text-align: justify;
                text-justify: auto;
                margin-bottom: 5px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                text-overflow: ellipsis;
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
    .footer-message {
      padding: 10px 0 15px 0;
      text-align: center;
      .el-button {
        padding: 0;
        height: 30px;
        width: 110px;
      }
    }
  }
</style>
