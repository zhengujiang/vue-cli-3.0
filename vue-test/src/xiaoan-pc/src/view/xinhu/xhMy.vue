<template>
  <div id="xh-my" class="content">
    <el-row :gutter="0">
      <el-col :span="24">
        <el-card class="box-card" shadow="never" body-style="padding:0">
          <div class="xhMyTop">
            <div class="xhMyT vxa-image-xh-bg-banner"></div>
            <div class="xhMyB">
              <div class="list btn" v-if="$cookie.get('userId') == this.selectUserId"></div>
              <div class="list btn" v-else>
                <el-button @click="attentionUser(0)" class="list-btns-off" plain size="mini" v-if="userData.attention">
                  已关注
                </el-button>
                <el-button @click="attentionUser(1)" class="list-btns-on" plain size="mini" icon="el-icon-plus" v-else>
                  关注
                </el-button>
              </div>
            </div>
            <div class="pos-user-home">
              <ul>
                <li class="head">
                  <div class="sculpture">
                    <img class="headerImg" :src="userData.headUrl" alt="" v-if="userData.headUrl">
                    <img class="headerImg" :src="$image.xinhu.headerImg" v-else alt="">
                  </div>
                  <img v-if="chief" class="big-v" :src="$image.xinhu.v" alt="">
                </li>
                <li class="about">
                  <p class="user-name">
                    <b>{{userData.userName}}</b>&ensp;
                    <span title="点击编辑" v-if="userData.synopsis" @click="synopsisClick"
                          :class="{'cursor-default':!isOwn}">| {{userData.synopsis}}</span>
                    <span title="点击编辑" v-else @click="synopsisClick"
                          :class="{'cursor-default':!isOwn}">| {{synopsis}}</span>
                  </p>
                  <p class="user-about">
                    <span><b>{{userData.answerNum}}</b>/ 他的回答</span>
                    <span><b>{{userData.attentionUserNum}}</b>/ 他关注的人</span>
                    <span><b>{{userData.coverAttentionUserNum}}</b>/ 关注他的人</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col class="minHeight" :span="18">
        <el-card class="box-card box-card-bottom" shadow="never" body-style="padding:0">
          <el-tabs class="tabs-head" v-model="activeName">
            <!--<el-tab-pane label="他的提问" name="question">
              <template v-if="userQuestionData.length>0">
                <el-card v-for="(list, index) in userQuestionData" :key="index" class="list-box-card" shadow="never"
                         body-style="padding:12px">
                  <div class="list-title">
                    <a :href="'/xhQuestionDetail?questionId='+list.questionId"
                       target="_blank">{{list.questionTitle}}</a>
                  </div>
                  <div class="list-content" v-if="list.answer.answerContent">
                    <a :href="'/xhQuestionDetail?questionId='+list.questionId" target="_blank">{{list.answer.answerContent}}</a>
                  </div>
                  <div class="list-about">
                    <span>{{list.answerCount}}个回答 | </span>
                    <span>{{list.attentionCount}}个关注 | </span>
                    <span>{{$common.transTime(list.createTime)[0]}}</span>
                  </div>
                </el-card>
                <div class="foot-pagination" v-if="questionPage.total>10">
                  <el-pagination background layout="prev, pager, next" :total="questionPage.total"
                                 @current-change="selectPage"
                  ></el-pagination>
                </div>
              </template>
              <div class="min-height" v-else>
                <v-noInfo :altText="ismy + '暂时还没有提问！'" :imgUrl="imgNoQuestion"></v-noInfo>
              </div>
            </el-tab-pane>-->
            <!---->
            <el-tab-pane label="他的回答" name="answer">
              <template v-if="userAnswerData.length>0">
                <el-card v-for="(list, index) in userAnswerData" :key="index" class="list-box-card" shadow="never"
                         body-style="padding:12px">
                  <div class="list-title">
                    <a :href="'/xhAnswerDetail?questionId='+list.questionId+'&answerId='+list.answerId" target="_blank">{{list.questionTitle}}</a>
                  </div>
                  <div class="list-content">
                    <a :href="'/xhAnswerDetail?questionId='+list.questionId+'&answerId='+list.answerId" target="_blank">{{list.answerContent}}</a>
                  </div>
                  <div class="list-about">
                    <span>{{list.approveCount}}个赞同 |</span>
                    <span>{{$common.transTime(list.createTime)[0]}}</span>
                  </div>
                </el-card>
                <div class="foot-pagination" v-if="answerPage.total>10">
                  <el-pagination background layout="prev, pager, next" :total="answerPage.total"
                                 @current-change="selectAnswerPage"
                  ></el-pagination>
                </div>
              </template>
              <template v-else>
                <el-card class="no-info-box-card" shadow="never" body-style="padding:12px">
                  <v-noInfo :altText="ismy + '暂时还没有回答！'" :imgUrl="imgNoAnswer"></v-noInfo>
                </el-card>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!---->
        <el-card class="box-card right-card" shadow="never" body-style="padding:16px">
          <div class="correlation">
            <div class="achievement title">
              <img :src="$image.xinhu.hotTopic" alt="">
              <span>他的成就</span>
            </div>
          </div>
          <div class="correlation">
            <div class="achievement list">
              <img :src="$image.xinhu.xhLaud" alt="">
              <span>获得了{{achievement.evaluateCount}}次赞</span>
            </div>
            <div class="achievement list">
              <img :src="$image.xinhu.xhCollect"
                   alt=""><span>获得了{{achievement.collectionCount}}次收藏</span>
            </div>
            <div class="achievement list">
              <img :src="$image.xinhu.xhAdmin"
                   alt=""><span>获得了{{achievement.attentionCount}}次小安认证</span>
            </div>
          </div>
        </el-card>
        <!---->
        <el-card class="box-card right-my-other-card" shadow="never" body-style="padding:16px">
          <div class="correlation">
            <div class="achievement focus">
              <div class="ac-title">
                <img :src="$image.xinhu.xhUser" alt="">
                <span>他关注的人</span>
              </div>
              <span class="select" v-if="myAttentionUserData.length > 0">
                <el-pagination :page-size="5" small layout="prev, next" @current-change="selectMyAttentionPage"
                               :total="myAttentionUser.total"></el-pagination>
              </span>
            </div>
          </div>
          <ul class="correlation">
            <li class="list-user" v-for="(list,index) in myAttentionUserData">
              <div class="list img">
                <a :href="'/xhMy?selectUserId='+list.concernedId" target="_blank">
                  <img :src="list.concernedHeadUrl" alt="" v-if="list.concernedHeadUrl">
                  <img :src="$image.xinhu.headerImg" v-else>
                </a>
              </div>
              <a class="list user-name" :href="'/xhMy?selectUserId='+list.concernedId" target="_blank">
                <p class="name">{{list.concernedName}}</p>
                <p class="desc" v-if="list.concernedTitle">{{decodeURIComponent(list.concernedTitle)}}</p>
                <p class="desc" v-else>乎主很神秘</p>
              </a>
              <div class="list btn" v-if="false">
                <el-button class="list-btns-on" plain size="mini" icon="el-icon-plus" v-if="true">关注</el-button>
                <el-button class="list-btns-off" plain size="mini" v-else>已关注</el-button>
              </div>
            </li>
          </ul>
        </el-card>
        <!---->
        <el-card class="box-card right-my-other-card" shadow="never" body-style="padding:16px">
          <div class="correlation">
            <div class="achievement focus">
              <div class="ac-title">
                <img :src="$image.xinhu.xhUser" alt="">
                <span>关注他的人</span>
              </div>
              <span class="select" v-if="otherAttentionUserData.length > 0">
                 <el-pagination :page-size="5" small layout="prev, next" @current-change="selectOtherAttentionPage"
                                :total="otherAttentionUser.total"></el-pagination>
              </span>
            </div>
          </div>
          <ul class="correlation">
            <li class="list-user" v-for="(list,index) in otherAttentionUserData">
              <div class="list img">
                <a :href="'/xhMy?selectUserId='+list.concernedId" target="_blank">
                  <img :src="list.concernedHeadUrl" alt="" v-if="list.concernedHeadUrl">
                  <img :src="$image.xinhu.headerImg" v-else>
                </a>
              </div>
              <a class="list user-name" :href="'/xhMy?selectUserId='+list.concernedId" target="_blank">
                <p class="name">{{list.concernedName}}</p>
                <p class="desc" v-if="list.concernedTitle">{{decodeURIComponent(list.concernedTitle)}}</p>
                <p class="desc" v-else>乎主很神秘</p>
              </a>
              <div class="list btn" v-if="false">
                <el-button class="list-btns-on" plain size="mini" icon="el-icon-plus" v-if="true">关注</el-button>
                <el-button class="list-btns-off" plain size="mini" v-else>已关注</el-button>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <!--编辑简介-->
    <el-dialog title="修改个人简介" custom-class="editSynopsisDialog" center :visible="showEditSynopsis"
               @close="hideEditDialog()">
      <div class="dialog-edit">
        <input type="text" v-model="editSynopsis" placeholder="请输入个人简介，最多10个字符" maxlength="10">
        <div style="text-align: center;margin-top:30px;">
          <el-button type="primary" @click="updateSynopsisByUserId()" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "xh-my",
    data() {
      return {
        activeName: 'answer',
        synopsis: '乎主很神秘，还没有留下任何信息。',
        showEditSynopsis: false,
        editSynopsis: '',
        imgNoQuestion: this.$image.prompt.nowrite,
        imgNoAnswer: this.$image.prompt.nocollect,
        userData: {
          headUrl: this.$image.user.timg2x,
          answerNum: 0,
          attentionUserNum: 0,
          coverAttentionUserNum: 0,
          synopsis: '乎主很神秘，还没有留下任何信息。'
        },
        chief: false,
        selectUserId: '',
        newSelectUserId: '',
        ismy: '',
        isOwn: false,
        userAnswerData: [],
        userQuestionData: [],
        //
        myAttentionUserData: [],
        otherAttentionUserData: [],
        //
        achievement: {
          attentionCount: 0,
          collectionCount: 0,
          evaluateCount: 0
        },
        answerPage: {
          index: 1,
          size: 10,
          total: 0
        },
        questionPage: {
          index: 1,
          size: 10,
          total: 0
        },
        myAttentionUser: {
          index: 1,
          size: 5,
          total: 0
        },
        otherAttentionUser: {
          index: 1,
          size: 5,
          total: 0
        }
      }
    },
    // 使用其它组件
    components: {
    },
    created() {
      if (this.$route.query.selectUserId) {
        this.selectUserId = this.$route.query.selectUserId;
        if (this.$cookie.get('userId') == this.selectUserId) {
          this.synopsis = '留下只言片语，让大家了解下你。'
          this.selectUserId = this.$cookie.get('userId');
          this.newSelectUserId = this.$cookie.get('userId');
          this.ismy = '您'
          this.isOwn = true
        } else {
          this.ismy = '他'
          this.isOwn = false
          this.newSelectUserId = this.selectUserId;
        }
        //
        this.searchAttentionUser(0);
        //
        this.searchAttentionUser(1);
        //
        this.getUserXinHuInfo(this.newSelectUserId);
        this.searchUserData();
        this.searchUserQuestion();
        this.searchUserAnswer();
      }
    },
    mounted() {

    },
    methods: {
      windowLink(type, index) {
        switch (type) {
          case 'question':
            // window.open('/xhQuestionDetail?id=' +);
            break;
          case 'answer':
            window.open('/');
            break;
        }
      },
      //
      selectMyAttentionPage(index) {
        console.log(index);
        this.myAttentionUser.index = index;
        this.searchAttentionUser(0);
      },
      selectOtherAttentionPage(index) {
        console.log(index);
        this.otherAttentionUser.index = index;
        this.searchAttentionUser(1);
      },
      //
      attentionUser(type) {
        console.log(type)
        switch (type) {
          case 0:
            // 取消关注
            this.$confirm('您确定要取消关注吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((success) => {
              this.unFollow();
              // this.$message({type: 'success', message: success + '取消成功!'});
            }).catch((error) => {
              // this.$message({type: 'info', message: error + '已取消删除'})
            })
            break;
          case 1:
            // 添加关注
            this.addAttention();
            break
        }
      },
      //
      unFollow() {
        this.$http({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            concernedId: this.userData.userId,
            attentionType: 2, // 取消关注用户的
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({type: 'success', message: '取消成功!'});
            this.searchUserData();
            //
            this.searchAttentionUser(0);
            //
            this.searchAttentionUser(1);
          }
        }).catch((err) => {

        })
      },
      //
      addAttention() {
        this.$http({
          method: "POST",
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: this.selectUserId,
            concernedTitle: this.userData.userName,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({type: 'success', message: '关注成功!'});
            this.searchUserData();
            //
            this.searchAttentionUser(0);
            //
            this.searchAttentionUser(1);
          }
        }).catch((err) => {

        })
      },
      linkUser(type, index) {
        if (type == 'my') {
          this.$common.openWindow('/xhMy?selectUserId=' + this.myAttentionUserData[index].concernedId)
        } else {
          this.$common.openWindow('/xhMy?selectUserId=' + this.otherAttentionUserData[index].concernedId)
        }
      },
      //
      selectPage(index) {
        console.log(index);
        this.questionPage.index = index;
        this.searchUserQuestion();
      },
      //
      selectAnswerPage(index) {
        console.log(index);
        this.answerPage.index = index;
        this.searchUserAnswer();
      },
      //
      searchUserData() {
        this.$http({
          method: 'GET',
          url: this.$api.user.searchUserData,
          params: {
            selectUserId: this.selectUserId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.userData = res.data.returnObject;
            this.chief = this.userData.vip;
          } else {
          }
        }).catch((err) => {
        })
      },
      //
      getUserXinHuInfo(selectUserId) {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getUserXinHuInfo,
          params: {
            userId: selectUserId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.achievement = res.data.returnObject;
            console.log(res.data.returnObject);
          }
        })
      },
      //
      searchUserAnswer() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchUserAnswer,
          params: {
            selectUserId: this.selectUserId,
            pageNum: this.answerPage.index,
            pageSize: this.answerPage.size,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.userAnswerData = res.data.returnObject;
            this.answerPage.total = res.data.total;
          }
        }).catch((data) => {

        })
      },
      //
      searchUserQuestion() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchUserQuestion,
          params: {
            selectUserId: this.selectUserId,
            pageNum: this.questionPage.index,
            pageSize: this.questionPage.size,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.userQuestionData = res.data.returnObject;
            this.questionPage.total = res.data.total;
          }
        }).catch((data) => {

        })
      },
      //
      searchAttentionUser(type) {
        let page = {};
        if (type == 0) {
          page = this.myAttentionUser;
        } else {
          page = this.otherAttentionUser;
        }
        //
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchAttentionUser,
          params: {
            selectType: type,
            selectUserId: this.selectUserId,
            pageNum: page.index,
            pageSize: page.size,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject != null) {
              // 控制下拉刷新
              let data = res.data.returnObject;
              if (type == 0) {
                this.myAttentionUser.total = res.data.total;
                this.myAttentionUserData = res.data.returnObject;
              } else {
                this.otherAttentionUser.total = res.data.total;
                this.otherAttentionUserData = res.data.returnObject;
              }
              console.log(data);
            }
          } else {
            if (type == 0) {
              this.myAttentionUser.total = 0;
              this.myAttentionUserData = [];
            } else {
              this.otherAttentionUser.total = 0;
              this.otherAttentionUserData = [];
            }
          }
        }).catch((error) => {

        })
      },

      hideEditDialog() {
        this.showEditSynopsis = false
      },
      synopsisClick() {
        if (this.userData.userId == this.$cookie.get('userId')) {
          this.showEditSynopsis = true
          this.editSynopsis = this.userData.synopsis
        }
      },
      updateSynopsisByUserId() {
        /* if (!this.editSynopsis) {
          this.$message({showClose: true, type: 'success', duration: 3000, message: '个人简介不能为空'})
          return false
        } */
        this.$http({
          method: 'POST',
          url: this.$api.user.updateSynopsisByUserId,
          params: {
            synopsis: this.editSynopsis,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.searchUserData();
            this.showEditSynopsis = false;
            this.$message({showClose: true, type: 'success', duration: 3000, message: '修改成功'})
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '修改失败'})
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #xh-my {
    padding-bottom: 20px;
    .minHeight {
      min-height: 1140px;
    }
    .list-box-card {
      margin-bottom: 15px;
      cursor: pointer;
      .list-title {
        font-size: 17px;
        color: #303133;
        padding-bottom: 12px;
        border-bottom: 1px solid #e4e7ed;
        &:hover {
          color: #ffb148;
        }
      }
      .list-content {
        font-size: 13px;
        color: #8d8d8d;
        padding: 12px 0;
        border-bottom: 1px solid #e4e7ed;
      }
      .list-about {
        font-size: 12px;
        padding-top: 12px;
        color: #8d8d8d;
        cursor: default;
      }
    }
    .foot-pagination {
      width: 100%;
      margin: 0 0 20px 0;
      text-align: center;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ffb148;
      }
      .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
        background-color: white;
      }
    }
    .box-card-bottom {
      margin-bottom: 20px;
      border-color: #f6f6f6;
    }
    .box-card {
      min-height: 30px;
      margin-top: 20px;
      a {
        color: inherit;
      }
      .xhMyTop {
        width: 100%;
        position: relative;
        .xhMyT {
          width: 100%;
          min-height: 100px;
          border-bottom: 1px solid #cccccc;
          position: relative;
        }
        .xhMyB {
          width: 100%;
          min-height: 90px;
          .list {
            padding: 20px 24px 0 24px;
            text-align: right;
            .list-btns-on {
              color: #ffb148;
              border-color: #ffb148;
              padding: 7px 0;
              width: 80px;
              text-align: center;
              font-size: 14px;
              i {
                font-weight: bold;
                color: #ffb148;
              }
            }
            .list-btns-off {
              color: #8d8d8d;
              background-color: #f0f1f5;
              font-size: 14px;
              padding: 7px 0;
              width: 80px;
              text-align: center;
              &:hover {
                border-color: #e3e3e3;
              }
              &:active {
                border-color: #e3e3e3;
              }
              &:focus {
                border-color: #e3e3e3;
              }
            }
          }
        }
        .pos-user-home {
          width: 80%;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          transition: .3s;
          ul {
            display: flex;
            padding: 0 110px 0 40px;
            align-items: center;
            li {
              flex: 1;
              &.head {
                flex: 0 0 130px;
                position: relative;
                .sculpture {
                  position: relative;
                  height: 120px;
                  width: 120px;
                  border-radius: 50%;
                  border: 3px solid #f5d89c;
                  .headerImg {
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    cursor: default;
                  }
                  .vip {
                    position: absolute;
                    top: 90px;
                    left: 90px;
                  }
                }
                .big-v {
                  height: 30px;
                  width: 30px;
                  position: absolute;
                  bottom: 0;
                  right: 5px;
                }
              }
              &.about {
                padding-left: 40px;
                .user-name {
                  padding-top: 25px;
                  color: white;
                  cursor: default;
                  b {
                    font-size: 20px;
                    font-weight: bold;
                  }
                  span {
                    font-weight: normal;
                    font-size: 17px;
                    cursor: pointer;
                  }
                }
                .user-about {
                  padding-top: 32px;
                  color: #aeaeae;
                  span {
                    margin-right: 65px;
                  }
                  b {
                    font-size: 20px;
                    font-weight: bold;
                    padding-right: 10px;
                    color: #545454;
                  }
                }
              }
            }
          }
        }
      }
      .tabs-head {
        position: relative;
        background-color: #f6f6f6;
        .el-tabs__header {
          .el-tabs__nav-wrap {
            &:after {
              height: 0px;
            }
          }
          .el-tabs__nav-scroll {
            padding: 0 12px;
          }
          background-color: white;
        }
        .min-height {
          padding-top: 20%;
          min-height: 600px;
          position: relative;
          background: #fff;
        }
      }
      .correlation {
        .achievement {
          display: flex;
          align-items: center;
          color: #323232;
          img {
            height: 24px;
          }
          span {
            font-size: 17px;
            padding-left: 5px;
          }
          &.title {
            padding: 0 0 10px 0;
            border-bottom: 1px solid #e3e3e3;
          }
          &.list {
            padding-top: 12px;
            img {
              height: 20px;
            }
            span {
              font-size: 14px;
              color: #323232;
            }
          }
          &.focus {
            padding-bottom: 10px;
            border-bottom: 1px solid #e3e3e3;
            .ac-title {
              flex: 1;
              img {
                vertical-align: middle;
              }
              span {
                vertical-align: middle;
              }
            }
            .select {
              flex: 1;
              text-align: right;
              .el-pagination {
                padding: 0;
                .btn-prev {
                  padding: 0 0 0 0;
                }
                .btn-next {
                  padding: 0 0 0 0;
                }
              }
              i {
                font-size: 15px;
                cursor: pointer
              }
            }
          }
        }
        .list-user {
          margin-top: 20px;
          display: flex;
          align-items: center;
          .list {
            flex: 1;
            &.img {
              flex: 0 0 23%;
              font-size: 0;
              line-height: 1;
              img {
                border-radius: 50%;
              }
            }
            &.user-name {
              flex: 0 0 70%;
              .name {
                font-size: 14px;
                color: #323232;
                text-justify: distribute;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .desc {
                font-size: 12px;
                color: #aeaeae;
              }
            }
            &.btn {
              text-align: right;
            }
            img {
              height: 50px;
              width: 50px;
            }
            .list-btns-on {
              color: #ffb148;
              border-color: #ffb148;
              padding: 7px 0;
              width: 65px;
              text-align: center;
              font-size: 14px;
              i {
                font-weight: bold;
                color: #ffb148;
              }
            }
            .list-btns-off {
              color: #8d8d8d;
              background-color: #f0f1f5;
              font-size: 14px;
              padding: 7px 0;
              width: 65px;
              text-align: center;
              &:hover {
                border-color: #e3e3e3;
              }
              &:active {
                border-color: #e3e3e3;
              }
              &:focus {
                border-color: #e3e3e3;
              }
            }
          }
        }
      }
      &.right-card {
        min-height: 200px;
      }
      &.right-my-other-card {
        /*height: 514px;*/
        min-height: 420px;
      }
    }
    .editSynopsisDialog {
      width: 320px;
      height: 200px;
      .el-dialog__title {
        color: #ffb148;
      }
      input {
        border: 1px solid #e3e3e3;
        height: 36px;
        width: 100%;
      }
    }
    .cursor-default {
      cursor: default !important;
    }
  }
</style>
