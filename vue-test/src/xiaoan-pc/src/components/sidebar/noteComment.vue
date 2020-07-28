<template>
  <div id="noteCommentCotent">
    <div class="noteComment" v-show="showComment">
      <div class="track">
        <div class="title">
          <i class="el-icon-arrow-left" @click="goBack"></i>
          <span>评论</span>
          <i class="el-icon-close" @click="closeWindow"></i>
        </div>
      </div>
      <div class="comment-list" v-if="commentsList.length>0">
        <div class="listBox" v-for="(item,index) in commentsList">
          <div class="title-item">
            <img class="header-img" :src="item.createUserAvatar">
            <span class="title">{{item.createUserName}} </span>
            <span v-if="item.replyUserName && item.replyUserName!='null'">
              &nbsp;&nbsp;回复&nbsp;&nbsp;
              <template v-if="item.deleteStatus && item.deleteStatus!='null'">
                <el-tooltip content="该用户的评论已删除" placement="top" effect="light" :visible-arrow="false">
                  <span style="text-decoration:line-through">{{item.replyUserName}}</span>
                </el-tooltip>
              </template>
              <template v-else>
                <span>{{item.replyUserName}}</span>
              </template>
            </span>
            <!--<span class="note-type note-type-team">团队笔记</span>-->
          </div>
          <div class="note-content" @click.stop="cancel">
            {{item.commentContent}}
          </div>
          <div class="snippetbox">
            <span>编辑于{{item.createDate}}</span>
          </div>
          <div class="opt-box">
            <div class="iconbox">
              <span class="icon-content" style="width:70px">
                <i v-if="item.like" class="iconfont web-dianzan1 likecolor icon-img"
                   @click="giveLike(item,index,0)"></i>
                <i v-else class="iconfont web-dianzan1 icon-img" @click="giveLike(item,index,1)"></i>
                <span v-if="item.like" class="icon-text" @click="giveLike(item,index,0)">取消点赞</span>
                <span v-else class="icon-text" @click="giveLike(item,index,1)">点赞</span>
                <span class="count-span" :class="{'likecolor': item.like}">{{item.likeCount}}</span>
              </span>
              <span class="icon-content" v-if="item.createUserId!=userId" style="width:45px;">
                <img class="icon-img" :src="$image.rules.reply" @click.stop="replay(item)">
                <span class="icon-text" @click="replay(item)">回复</span>
              </span>
              <!--<span v-if="item.createUserId!=userId" class="count-span"></span>-->
              <span class="icon-content" v-if="item.replyUserId">
                <img class="icon-img" :src="$image.rules.dialog"
                     :class="{'cursor-default': item.commentCount==0}" @click.stop="dialog(item)">
                <span class="count-span">{{item.commentCount}}</span>
                <span class="icon-text" @click.stop="dialog(item)">查看对话</span>
              </span>

            </div>
            <span class="icon-content delete" v-if="item.createUserId==userId">
              <img class="icon-img" :src="$image.rules.delete" style="height: 15px;"
                   @click="deleteLawComment(item)">
              <span class="icon-text" @click.stop="deleteLawComment(item)">删除</span>
            </span>
          </div>
        </div>
        <div class="center pagination" v-if="totalCount > 10">
          <el-pagination background layout="prev, pager, next" :total="totalCount" :page-size="pageSize"
                         @current-change="pageChange"></el-pagination>
        </div>
      </div>
      <div class="comment-list" v-else>
        <v-noInfo></v-noInfo>
      </div>
      <div class="comment-add" v-show="showAdd">
        <el-input class="noteContent" type="textarea" v-model="commentContent" :autosize="{ minRows: 4, maxRows: 4}"
                  placeholder="写下你的评论..." :maxlength="10000" spellcheck="false">
        </el-input>
        <div class="btnBox">
          <el-button type="primary" size="mini" @click="addNoteComment">确定</el-button>
          <el-button size="mini" @click="goBack">取消</el-button>
        </div>
      </div>
      <div class="comment-add" style="height: 180px;" v-show="!showAdd">
        <div class="applyName">正在回复 {{replayItem.createUserName}}</div>
        <el-input class="noteContent" type="textarea" v-model="replayContent" :autosize="{ minRows: 4, maxRows: 4}"
                  placeholder="写下你的评论..." :maxlength="10000" spellcheck="false">
        </el-input>
        <div class="btnBox">
          <el-button type="primary" size="mini" @click="addNoteCommentAplay">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>

    <!--回复评论-->
    <div class="noteComment" v-if="!showComment">
      <div class="track">
        <div class="title">
          <i class="el-icon-arrow-left" @click="closeDialog"></i>
          <span>查看对话</span>
          <i class="el-icon-close" @click="closeWindow"></i>
        </div>
      </div>
      <div class="comment-list" v-if="dialogList.length>0">
        <div class="listBox" v-for="(item,index) in dialogList">
          <div class="title-item">
            <img class="header-img" :src="item.createUserAvatar">
            <span class="title">{{item.createUserName}}</span>
            <span v-if="item.replyUserName"> &nbsp;&nbsp;回复&nbsp;&nbsp;
              <template v-if="item.deleteStatus && item.deleteStatus!='null'">
                <el-tooltip content="该用户的评论已删除" placement="top" effect="light" :visible-arrow="false">
                  <span style="text-decoration:line-through">{{item.replyUserName}}</span>
                </el-tooltip>
              </template>
              <template v-else>
                <span>{{item.replyUserName}}</span>
              </template>
            </span>
          </div>
          <div class="note-content">
            {{item.commentContent}}
          </div>
          <div class="snippetbox">
            <span>编辑于{{item.createDate}}</span>
          </div>
          <div class="opt-box">
            <div class="iconbox">
              <span class="icon-content">
                <i v-if="item.like" class="iconfont web-dianzan1 likecolor icon-img"
                   @click="giveLikeDialog(item,index,0)"></i>
                <i v-else class="iconfont web-dianzan1 icon-img" @click="giveLikeDialog(item,index,1)"></i>
                <span v-if="item.like" class="icon-text" @click="giveLikeDialog(item,index,0)">取消点赞</span>
                <span v-else class="icon-text" @click="giveLikeDialog(item,index,1)">点赞</span>
                <span class="count-span" :class="{'likecolor': item.like}">{{item.likeCount}}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="center pagination" v-if="dialogTotalCount > 2">
          <el-pagination background layout="prev, pager, next" :total="dialogTotalCount" :page-size="dialogPageSize"
                         @current-change="pageChange"></el-pagination>
        </div>
      </div>
      <div class="comment-list" v-else>
        <v-noInfo></v-noInfo>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showComment: true,
        userId: '',
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        commentsList: [],
        commentContent: '',
        showAdd: true,
        replayContent: '',
        replayItem: [], // 正在回复的选中的项
        replyUserId: '', // 查看对话时选中的回复id
        // 对话内容
        dialogTotalCount: 0,
        dialogPageSize: 10,
        dialogPageNum: 1,
        dialogList: ''
      }
    },
    props: {
      noteId: String
    },
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'))
      }
      // this.addNoteComment()
      this.getCommentsByNoteId()
    },
    // 方法
    methods: {
      rtn() {
        return false
      },
      cancel() {
        this.showAdd = !this.showAdd
      },
      // 添加评论
      addNoteComment() {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.addNoteComment,
          params: {
            // id: '',
            noteId: this.noteId,
            // sourceId: '',
            commentType: 0,
            commentContent: this.commentContent,
//            replyUserId: '',
//            replyUserName: '',
//            replyUserAvatar: '',
//            createUserAvatar: this.userInfo.weixinAvatar,
//            createUserName: this.userInfo.userName,
            createUserId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            // 返回第一页
            this.pageChange(1)
          } else {

          }
        })
      },
      // 添加回复
      addNoteCommentAplay() {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.addNoteComment,
          params: {
            noteId: this.replayItem.noteId,
            sourceId: this.replayItem.id,
            commentType: 1,
            commentContent: this.replayContent,
            replyUserId: this.replayItem.createUserId,
            createUserId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            // 返回第一页
            this.replayContent = ''
            this.showAdd = true
            this.$message({showClose: true, type: 'error', duration: 3000, message: '回复成功'})
            this.pageChange(1)
          } else {

          }
        })
      },
      // 删除评论
      deleteLawComment(item) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // modal: false,
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.lawnote.deleteLawComment,
            params: {
              commentId: item.id,
              noteId: item.noteId,
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            // console.log(res)
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (this.commentsList.length == 1) {
                this.pageNum = this.pageNum - 1
              }
              this.getCommentsByNoteId()
            } else {

            }
          })
        }).catch(() => {

        })

      },
      // 获取评论
      getCommentsByNoteId() {
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.getCommentsByNoteId,
          params: {
            noteId: this.noteId,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            if (res.data.returnObject) {
              this.totalCount = res.data.total
              this.commentsList = res.data.returnObject
              this.commentsList.forEach((item) => {
                item.createDate = this.$common.transTime(item.createDate)[4]
                item.createUserName = decodeURIComponent(decodeURIComponent(item.createUserName))
                item.replyUserName = decodeURIComponent(decodeURIComponent(item.replyUserName))
              })
            } else {
              this.totalCount = 0
              this.commentsList = []
            }

          } else {
            this.totalCount = 0
            this.commentsList = []
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      },
      // 点赞 是否点赞：0：否，1：是
      giveLike(item, index, like) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.giveLike,
          params: {
            sourceId: item.id,
            sourceType: 0,
            like: like,
            userId: this.userId
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (like == 1) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞成功'})
              this.$set(this.commentsList[index], 'likeCount', item.likeCount + 1)
              this.$set(this.commentsList[index], 'like', true)
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞已取消'})
              this.$set(this.commentsList[index], 'likeCount', item.likeCount - 1)
              this.$set(this.commentsList[index], 'like', false)
            }

          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      giveLikeDialog(item, index, like) {

        this.$http({
          method: 'POST',
          url: this.$api.lawnote.giveLike,
          params: {
            sourceId: item.id,
            sourceType: 0,
            like: like,
            userId: this.userId
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {

            this.getCommentsByNoteId();

            if (like == 1) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞成功'})
              this.$set(this.dialogList[index], 'likeCount', item.likeCount + 1)
              this.$set(this.dialogList[index], 'like', true)
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞已取消'})
              this.$set(this.dialogList[index], 'likeCount', item.likeCount - 1)
              this.$set(this.dialogList[index], 'like', false)
            }

          } else {

          }
        })
      },
      pageChange(index) {
        this.pageNum = index;
        this.getCommentsByNoteId()
      },
      // 回复按钮, 打开对话弹窗
      replay(item) {
        this.replayItem = item
        this.showAdd = false
      },
      dialog(item) {
        if (item.replyUserId) {
          this.showComment = false
          this.replyUserId = item.createUserId
          this.getDialog(item)
        }
      },
      goBack() {
        this.$emit('goBack')
      },
      closeWindow() {
        this.goBack()
        this.$emit('closeWindow')
      },

      // 对话方法
      closeDialog() {
        this.showComment = true
      },
      // 获取对话
      getDialog(item) {
        // console.log(this.$cookie.get('userId'));
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.getDialog,
          params: {
            noteId: this.noteId,
            pageSize: this.dialogPageSize,
            pageNum: this.dialogPageNum,
            replyUserId: item.replyUserId,
            commentId: item.sourceId,
            userId: item.createUserId,
            loginUserId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            this.dialogTotalCount = res.data.total
            this.dialogList = res.data.returnObject
            this.dialogList.forEach((item) => {
              item.createDate = this.$common.transTime(item.createDate)[4]
              item.createUserName = decodeURIComponent(decodeURIComponent(item.createUserName))
              if (item.replyUserName) {
                item.replyUserName = decodeURIComponent(decodeURIComponent(item.replyUserName))
              }
            })
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #noteCommentCotent {
    height: 100%;
    .noteComment {
      height: 100%;
      display: flex;
      flex-direction: column;
      .track {
        flex-grow: 0;
        height: 54px;
        box-sizing: border-box;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 36px;
          border-bottom: 1px solid #e3e3e3;
          font-size: 16px;
          color: #323232;
          i {
            float: right;
            color: #8d8d8d;
            font-size: 20px;
            line-height: 54px;
            cursor: pointer;
          }
          .select-paragraph {
            width: 115px
          }
        }

      }
      .comment-list {
        flex-grow: 1;
        overflow-y: auto;
        .listBox {
          padding-top: 17px;
          .title-item {
            display: flex;
            align-items: center;
            height: 30px;
            .header-img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
            }
            .title {
              font-size: 16px;
              color: #323232;
              display: inline-block;
              margin-left: 10px;
            }
          }
          .note-content {
            padding-left: 40px;
            font-size: 14px;
            color: #323232;
          }
          .snippetbox {
            font-size: 12px;
            color: #8d8d8d;
            padding-top: 5px;
            padding-left: 40px;
            /*padding-right: 10px;*/
            text-align: right;
          }
          .opt-box {
            margin-left: 40px;
            padding: 4px 0 10px 0;
            border-bottom: 1px solid #e3e3e3;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #8d8d8d;
            .iconbox {
              display: flex;
              height: 20px;
              align-items: center;
              justify-content: space-between;
            }
            .icon-content {
              width: 75px;
              display: inline-flex;
              align-items: center;
              .icon-img {
                margin-right: 8px;
                height: 15px;
                cursor: pointer;
                display: inline-block;
              }
              .count-span {
                display: inline-block;
              }
              .icon-text {
                display: none;
              }
            }
            .icon-content:hover {
              display: inline-flex;
              .icon-img {
                display: none;
              }
              .count-span {
                display: none;
              }
              .icon-text {
                cursor: pointer;
                display: inline-block;
              }
            }
            .delete, .delete:hover {
              display: inline-block;
              text-align: right;
              .icon-img {
                margin-right: 0;
              }
            }
            .cursor-default {
              cursor: default;
            }
            .icon-dianzan1 {
              cursor: pointer;
              margin-right: 8px;
              font-size: 20px;
              position: relative;
              top: -1px;
              color: #a4a4a4;
              line-height: 15px !important;
            }

            .likecolor {
              color: #ffb148;
            }
            .select-note-type {
              width: 100px;
            }
          }
          .pagination {
            padding-top: 10px;
          }
        }
      }
      .comment-add {
        flex-grow: 0;
        height: 150px;
        border-top: 1px solid #e3e3e3;
        padding-top: 10px;
        .btnBox {
          padding-top: 10px;
          text-align: right;
        }
        .applyName {
          font-size: 14px;
          padding-bottom: 5px;
        }
      }
      .pagination {
        padding: 10px 0;
      }
    }
  }

</style>
