<template>
  <div id="xh-other-answer-item">
    <!---->
    <el-card v-for="(list, index) in answerAllListData" :key="index" class="list-box-card" shadow="never"
             body-style="padding:12px">
      <img v-if="list.authentication" :src="$image.xinhu.rz" class="rzImg">
      <div class="list-title">
        <ul class="correlation">
          <li class="list-user" v-if="list.anonymous">
            <div class="list">
              <span class="img cursor-default">
                <img class=" cursor-default" :src="$image.user.timg2x" alt="">
              </span>
              <span class="user-name cursor-default">
                <span class="name cursor-default">匿名用户</span>
                <span v-if="!list.audit" class="auditButton">正在审核</span>
              </span>
            </div>
          </li>
          <li class="list-user" v-else>
            <el-popover popper-class="list-user-popover" placement="bottom-start" width="400"
                        trigger="hover" :visible-arrow="false" @show="popoverShow(index)">
              <div class="other-header">
                <div class="other-header-box" :class="{isChief: chief}">
                  <div class="other-header-top">
                    <div class="left-img">
                      <span class="middle-img">
                        <img v-show="chief" class="Bug-V" :src="$image.xinhu.v" alt="">
                        <img :src="userData.headUrl" alt="" v-if="userData.headUrl">
                        <img :src="$image.user.timg2x" alt="" v-else>
                      </span>
                    </div>
                    <div class="right-title">
                      <p class="title">
                        <span class="synopsis">{{synopsis}}</span>
                      </p>
                      <ul>
                        <li>
                          <div class="num">{{userData.answerNum}}</div>
                          <div class="name">他的回答</div>
                        </li>
                        <li>
                          <div class="num">{{userData.attentionUserNum}}</div>
                          <div class="name">他关注的人</div>
                        </li>
                        <li>
                          <div class="num">{{userData.coverAttentionUserNum}}</div>
                          <div class="name">关注他的人</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="other-header-bottom">
                    <div class="stateful">
                      <ul>
                        <li>
                          <span class="list">
                            <img :src="$image.xinhu.zhan3x" alt="">
                            <span class="number">{{userData.praiseNum }}</span>
                          </span>
                        </li>
                        <li class="statefulList" v-if="$route.query.selectUserId == $cookie.get('userId')"></li>
                        <li class="statefulList" v-else>
                          <el-button @click="attentionUser(0,userData)" class="out" plain size="mini"
                                     v-if="userData.attention">已关注
                          </el-button>
                          <el-button @click="attentionUser(1,userData)" class="select" plain size="mini"
                                     icon="el-icon-plus" v-else>关注
                          </el-button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="list" slot="reference">
                <span class="img">
                  <a :href="'/xhMy?selectUserId='+list.userId" target="_blank">
                    <img :src="list.userPicture" alt="" v-if="list.userPicture">
                    <img :src="$image.user.timg2x" alt="" v-else>
                  </a>
                </span>
                <span class="user-name">
                  <a :href="'/xhMy?selectUserId='+list.userId" target="_blank">
                    <span class="name">{{list.userName}}</span>
                  </a>
                  <span class="desc" v-if="list.userSynopsis">| {{decodeURIComponent(list.userSynopsis)}}</span>
                  <span class="desc" v-else>| 乎主很神秘，还没有留下任何信息。</span>
                  <span v-if="!list.audit" class="auditButton">正在审核</span>
                </span>
              </div>
            </el-popover>
          </li>
        </ul>
      </div>
      <div class="list-content" v-if="list.answerContent">
        <a :href="'/xhAnswerDetail?questionId='+list.questionId+'&answerId='+list.answerId" target="_blank">
          <div>{{list.answerContent}}</div>
        </a>
      </div>
      <div class="list-about">
        <span>{{list.approveCount+'个赞同'}}</span> | <span>{{$common.transTime(list.createTime)[0]}}</span>
      </div>
    </el-card>
    <!---->
    <div class="foot-pagination" v-if="answerPage.total > 10">
      <el-pagination background layout="prev, pager, next" :total="answerPage.total"
                     @current-change="selectPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "xh-other-answer-item",
    data() {
      return {
        answerAllListData: [],
        newSelectUserId: '',
        answerPage: {
          index: 1,
          size: 10,
          total: 0
        },
        synopsis: '乎主很神秘，还没有留下任何信息。',
        userData: {
          headUrl: this.$image.user.timg2x,
          userName: '信公小安用户',
          answerNum: 0,
          attentionUserNum: 0,
          coverAttentionUserNum: 0,
          praiseNum: 0,
          synopsis: '乎主很神秘，还没有留下任何信息。'
        },
        chief: false
      }
    },
    props: {
      questionId: {
        type: String,
        default: ''
      },
      answerId: {
        type: String,
        default: ''
      }
    },
    created() {
      this.listAnswersForQuestion();
    },
    mounted() {
    },
    methods: {
      //
      attentionUser(type, userData) {
        //  console.log(type)
        switch (type) {
          case 0:
            // 取消关注
            this.$confirm('您确定要取消关注吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((success) => {
              this.unFollow(userData);
              // this.$message({type: 'success', message: success + '取消成功!'});
            }).catch((error) => {
              // this.$message({type: 'info', message: error + '已取消删除'})
            })
            break;
          case 1:
            // 添加关注
            this.addAttention(userData);
            break
        }
      },
      //
      unFollow(userData) {
        this.$http({
          method: "DELETE",
          url: this.$api.xinhu.unFollow,
          params: {
            concernedId: userData.userId,
            attentionType: 2, // 取消关注用户的
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({type: 'success', message: '取消成功!'});
            this.searchUserData();
          }
        }).catch((err) => {

        })
      },
      //
      addAttention(userData) {
        this.$http({
          method: "POST",
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_PEOPLE',
            concernedId: userData.userId, // 关注人的userId
            concernedTitle: userData.userName, // 关注人的名称
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({type: 'success', message: '关注成功!'});
            this.searchUserData();
          }
        }).catch((err) => {

        })
      },
      //
      popoverShow(index) {
        if (this.newSelectUserId == this.answerAllListData[index].userId) {
        } else {
          this.newSelectUserId = this.answerAllListData[index].userId;
          this.searchUserData();
        }
      },
      //
      searchUserData() {
        this.$http({
          method: 'GET',
          url: this.$api.user.searchUserData,
          params: {
            selectUserId: this.newSelectUserId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.userData = res.data.returnObject;
            this.chief = this.userData.vip;
            if (this.userData.synopsis) {
              this.synopsis = this.userData.synopsis
            }
          }
        }).catch((err) => {
        })
      },
      //
      listAnswersForQuestion() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.listAnswersForQuestion,
          params: {
            answerIds: this.answerId,
            questionId: this.questionId,
            pageNum: this.answerPage.index,
            pageSize: this.answerPage.size,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res.data.returnObject);
          if (res.data.returnCode == 200) {
            let answerAllListData = res.data.returnObject;
            this.answerAllListData = answerAllListData;
            this.answerPage.total = res.data.total;
            if ((this.$cookie.get('userId') != this.answerAllListData[0].userId) && !this.answerAllListData[0].audit) {
                this.$message({
                showClose: true,
                type: "error",
                duration: 3000,
                message: '信息正在审核中'
                })
              this.$router.push('/xhList');
            }
          }
        }).catch((err) => {

        })
      },
      //
      selectPage(index) {
        console.log(index);
        this.answerPage.index = index;
        this.listAnswersForQuestion();
      }
    }
  }
</script>

<style lang="scss">
  .list-user-popover {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    .other-header {
      width: 400px;
      .other-header-box {
        width: 100%;
        background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#b8b8b8), to(#bbb6af));
        display: table;
        table-layout: fixed;
        word-wrap: break-word;
        padding: 15px 10px;
        border-radius: 4px;
        box-shadow: 0px -2px 10px rgba(184, 184, 184, 0.23);
        &.isChief {
          box-shadow: 0px -2px 10px rgba(122, 100, 67, 0.23);
          background: -webkit-gradient(linear, 50% 0%, 75% 100%, from(#DAC28B), to(#BDA36D));
          .other-header-top {
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            .left-img {
              .middle-img {
                img {
                  border: 2px solid #ebdcc1;
                }
              }
            }
            .right-title {
              .title {
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
              }
            }
          }
          .other-header-bottom {
            .stateful {
              ul {
                li.statefulList {
                  .select {
                    color: rgba(189, 163, 109, 1);
                    i {
                      color: rgba(189, 163, 109, 1);
                      font-weight: bold;
                    }
                  }
                  .out {
                    background-color: rgba(255, 255, 255, 0.7);
                    color: rgba(189, 163, 109, 1);
                  }
                }
              }
            }
          }
        }
        .other-header-top {
          border-bottom: 1px solid #cac9c7;
          .left-img {
            display: table-cell;
            width: 22%;
            vertical-align: middle;
            line-height: 1;
            .middle-img {
              display: inline-block;
              height: 70px;
              width: 70px;
              background-color: #fff;
              border-radius: 50%;
              position: relative;
              .Bug-V {
                height: 17px;
                width: 17px;
                position: absolute;
                bottom: 0;
                right: 0;
                border: 0;
              }
              img {
                height: 100%;
                width: 100%;
                border-radius: 50%;
                border: 2px solid #d2d3d0;
              }
            }

          }
          .right-title {
            width: 78%;
            display: table-cell;
            vertical-align: middle;
            .title {
              font-size: 17px;
              color: #FFFFFF;
              font-family: PingFangSC-Medium, sans-serif;
              padding-bottom: 10px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #cac9c7;
              .userName {
                display: inline-block;
                max-width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              input {
                color: #FFFFFF;
                background-color: transparent;
                border: 0;
                width: 100%;
              }
            }
            .about {
              font-size: 12px;
              color: #fff;
            }
            ul {
              padding-top: 10px;
              padding-bottom: 10px;
              display: table;
              table-layout: fixed;
              word-wrap: break-word;
              width: 100%;
              color: #FFFFFF;
              li {
                display: table-cell;
                vertical-align: middle;
                .num {
                  font-size: 17px;
                }
                .name {
                  font-size: 12px;
                  color: rgba(255, 255, 255, 0.6);
                }
              }
              li:last-child {
                padding-left: 9%;
              }
              // li:first-child {
              // }
            }
          }
        }
        .other-header-bottom {
          color: #FFFFFF;
          .customer {
            padding-top: 5px;
            span {
              height: 16px;
              display: inline-block;
              img {
                height: 100%;
                vertical-align: top;
              }
            }
          }
          .stateful {
            padding-top: 10px;
            ul {
              display: table;
              width: 100%;
              li {
                display: table-cell;
                vertical-align: middle;
                .list {
                  img {
                    height: 16px;
                  }
                  .number {
                    font-size: 16px;
                  }
                }
                .list.two {
                  padding-left: 20px;
                }

              }
              .statefulList {
                .select {
                  width: 70px;
                  border-radius: 4px;
                  border: 0;
                  border: none;
                  text-align: center;
                  background-color: #FFFFFF;
                  height: 25px;
                  color: rgba(184, 184, 184, 1);
                  font-size: 16px;
                  padding: 0;
                  i {
                    font-weight: bold;
                    color: rgba(184, 184, 184, 1);
                  }
                  span {
                    margin-left: 2px;
                  }
                }
                .out {
                  border-radius: 4px;
                  width: 70px;
                  height: 25px;
                  font-size: 16px;
                  border: none;
                  background-color: rgba(255, 255, 255, 0.7);
                  color: rgba(184, 184, 184, 1);
                  padding: 0;
                }
              }
              li:last-child {
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
  #xh-other-answer-item {
    .list-box-card {
      margin-bottom: 15px;
      position: relative;
      a {
        color: inherit;
      }
      .list-title {
        .cursor-default {
          cursor: default;
          &:hover {
            color: #323232 !important;
          }
        }
        .correlation {
          .list-user {
            padding-bottom: 10px;
            border-bottom: 1px solid #e4e7ed;
            .list {
              width: 45%;
              display: flex;
              align-items: center;
              .img {
                flex: 0 0 30px;
                font-size: 0;
                line-height: 1;
                cursor: pointer;
                img {
                  height: 30px;
                  width: 30px;
                  border-radius: 50%;
                }
              }
              .user-name {
                padding-left: 10px;
                .name {
                  font-size: 14px;
                  color: #323232;
                  &:hover {
                    color: #ffb148;
                  }
                }
                .auditButton{
                display: inline-block;
                width: 66px;
                height: 18px;
                border-radius: 9px;
                border: 1px solid #fb4319;
                font-size: 12px;
                // margin-left: 10px;
                text-align: center;
                color: #fb4319;
              }
                .desc {
                  font-size: 12px;
                  color: #aeaeae;
                }
              }

            }
          }
        }
      }
      .list-content {
        font-size: 13px;
        color: #545454;
        padding: 12px 0;
        border-bottom: 1px solid #e4e7ed;
        div {
          text-justify: distribute;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .list-about {
        font-size: 12px;
        padding-top: 12px;
        color: #aeaeae;
      }
      .rzImg {
        position: absolute;
        right: 0;
        top: 10px;
        right: 16px;
        width: 100px;
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
  }
</style>
