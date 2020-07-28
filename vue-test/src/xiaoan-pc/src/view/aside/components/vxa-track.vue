<template>
  <div class="vxa-aside-track" v-loading="loading" ref="asideTrake">
    <div class="title" ref="trackTitleDom">
      <span>我的足迹</span>
      <i class="iconfont web-close-x" @click="closeWindow"></i>
    </div>
    <!---->
    <div class="trackContent" v-show="!isNull" :style="{height: listContainerHeight}">
      <div class="counter" ref="counterDom">
        <span>{{ trackNum }}条记录</span>
        <el-button type="text" @click="open2">
          <i class="iconfont web-shanchu"></i>
        </el-button>
      </div>
      <div class="listContainer vxa-scrollbar-no-shadow">
        <div class="list" v-for="(list,index) in todayList" @click="linkTo(list.type,list.refId)">
          <el-row>
            <el-col :span="3">
              <el-button type="primary" v-if="list.type == 1" style="background-color: #90b8f4">法规</el-button>
              <el-button type="warning" v-else-if="list.type == 3" style="background-color: #ffd091">公告</el-button>
              <el-button type="danger" v-else-if="list.type == 5" style="background-color: #ffa691">案例</el-button>
              <el-button type="danger" v-else-if="list.type == 4" style="background-color: #9AE6ED">研报</el-button>
              <el-button type="danger" v-else-if="list.type == 6" style="background-color: #ffa691">问答</el-button>
              <el-button type="danger" v-else-if="list.type == 7" style="background-color: #ffa691">问答</el-button>
              <el-button type="danger" v-else-if="list.type == 8" style="background-color: #ffddb0">IPO</el-button>
              <el-button type="danger" v-else-if="list.type == 9" style="background-color: #ffa691">e互动</el-button>
            </el-col>
            <el-col :span="21" class="elCol21">
              <el-row>
                <el-col :span="19">
                  <div class="listTitle">{{ list.title }}</div>
                </el-col>
                <el-col :span="5">
                  <span class="time">{{ $common.transTime(list.releaseTime)[1] }}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="list" v-for="(list,index) in agoList" @click="linkTo(list.type,list.refId)">
          <el-row>
            <el-col :span="3">
              <el-button type="primary" v-if="list.type == 1" style="background-color: #90b8f4">法规</el-button>
              <el-button type="warning" v-else-if="list.type == 3" style="background-color: #ffd091">公告</el-button>
              <el-button type="danger" v-else-if="list.type == 5" style="background-color: #ffa691">案例</el-button>
              <el-button type="danger" v-else-if="list.type == 4" style="background-color: #8bdde4">研报</el-button>
              <el-button type="danger" v-else-if="list.type == 6" style="background-color: #ffa691">问答</el-button>
              <el-button type="danger" v-else-if="list.type == 7" style="background-color: #ffa691">问答</el-button>
              <el-button type="danger" v-else-if="list.type == 8" style="background-color: #ffddb0">IPO</el-button>
              <el-button type="danger" v-else-if="list.type == 9" style="background-color: #ffa691">e互动</el-button>
            </el-col>
            <el-col :span="21" class="elCol21">
              <el-row>
                <el-col :span="19">
                  <div class="listTitle">{{ list.title }}</div>
                </el-col>
                <el-col :span="5">
                  <span class="time">{{ $common.transTime(list.releaseTime)[1] }}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="trackContent" v-show="isNull" style="padding-top: 180px;">
      <v-noInfo altText="暂无足迹" style="font-size: 16px" :imgSrc="noInfoImg"></v-noInfo>
    </div>
  </div>
</template>

<script>
  export default {
    name: "vxa-aside-track",
    components: {},
    data() {
      return {
        listContainerHeight: '95%',
        loading: true,
        isNull: false,
        trackNum: '12',
        todayList: [],
        agoList: [],
        noInfoImg: this.$image.prompt.noInfo
      }
    },
    created() {
      this.getTrackM();
    },
    destroyed () {
      window.onresize = null;
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.resizeHeight();
        })()
      }
    },
    watch: {},
    methods: {
      resizeHeight() {
        this.$nextTick(() => {
          let windowH = this.$refs.asideTrake.clientHeight;
          let titleH = this.$refs.trackTitleDom.clientHeight;
          this.listContainerHeight = parseInt((windowH - titleH)) + 'px';
          console.log('height', this.listContainerHeight);
        });
      },
      // 跳转内容
      linkTo(type, id) {
        var url = '';
        if (type == 1) {
          url = '/rule/details' + '?id=' + id;
        } else if (type == 3) {
          url = '/affiche/details' + '?id=' + id;
        } else if (type == 5) {
          url = '/case/details' + '?id=' + id;
        } else if (type == 4) {
          url = '/report/details' + '?id=' + id;
        } else if (type == 6) {
          url = '/xhQuestionDetail' + '?questionId=' + id;
        } else if (type == 9) {
          url = '/investor/answer' + '?id=' + id;
        } else if (type == 8) {
          url = '/ipo/details' + '?id=' + id;
        }
        //
        if (type == 7) {
          this.getQuestionIdByAnswerId(id);
        } else {
          this.$common.openWindow(url);
        }
      },
      getQuestionIdByAnswerId(id) {
        let params = {
          answerId: id
        };
        this.$axios.xinhu.getQuestionIdByAnswerId(params).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let url = '/xhAnswerDetail?questionId=' + res.data.returnObject + '&answerId=' + id;
            let that = this;
            var newWin = null, isBlock = !1;
            // ** 新窗口被某些扩展阻止打开，会抛出错误，因此使用try..catch **/
            try {
              newWin = window.open(url);
              console.log(newWin);
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
      open2() {
        this.$confirm('删除足迹, 是否继续?', '永久删除哦！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delTrack()
        }).catch(() => {
          this.$message({showClose: true, duration: 2000, type: 'info', message: '已取消删除'});
        })
      },
      // 删除足迹
      delTrack() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.user.delTrack(params).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '足迹清除成功！'})
            this.isNull = true
          }
        }).catch((err) => {
          console.log(err)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 获取足迹
      getTrackM() {
        this.loading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          rows: 20
        };
        this.$axios.user.getTrack(params).then((res) => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          if (res.data.returnCode == 1) {
            this.todayList = res.data.returnObject.browsings;
            this.agoList = res.data.returnObject.browsingAgo;
            this.trackNum = this.todayList.length + this.agoList.length;
            if (this.trackNum == 0) {
              this.isNull = true
            } else {
              this.isNull = false;
            }
          } else if (res.data.returnCode == -1) {
            this.isNull = true
          }
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false;
          }, 300)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      closeWindow() {
        this.$emit('isShow');
      }
    }
  }
</script>

<style lang="scss">
  .vxa-aside-track {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .title {
      padding: 0 16px;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #e3e3e3;
      font-size: 14px;
      color:rgba(50,50,50,1);
      font-weight:600;
      i {
        float: right;
        color: #8d8d8d;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .trackContent {
      width: 100%;
      height: 100%;
      .counter {
        padding: 0 16px;
        line-height: 24px;
        height:24px;
        background:rgba(0,0,0,0.03);
        .el-button--text {
          float: right;
          padding: 0;
        }
        span {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(141,141,141,1);
        }
        i {
          float: right;
          color: #bcbcbc;
          font-size: 12px;
          line-height: 24px;
          cursor: pointer;
        }
      }
      .listContainer {
        padding: 0 16px;
        width: 100%;
        height: 95%;
        overflow: auto;
        .el-button.is-round {
          background: #d4b486;
          color: #fff;
          font-size: 14px;
          border: none;
          cursor: default;
        }
        .list {
          cursor: pointer;
          .el-row {
          }
          .el-col-5 {
            text-align: right;
          }
          .el-col-19 {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
            text-align: left;
          }
          .el-col-3 {
            padding: 12px 0;
          }
          .elCol21 {
            padding: 12px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          .listTitle {
            &:hover {
              text-decoration: underline;
              color: #ffb148;
            }
          }
          .el-button {
            font-size: 12px;
            color: #fff;
            padding: 3px 5px;
            border: 0;
            cursor: default;
          }
          .el-button--primary {
            background-color: #90b8f5;
          }
          .el-button--warning {
            background-color: #ffb148;
          }
          .time {
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(174,174,174,1);
          }
        }
      }
    }
  }
  .el-message-box__wrapper {
    z-index: 200001 !important;
  }
</style>
