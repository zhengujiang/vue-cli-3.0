<template>
  <div id="sidebarNote">
    <div v-show="noteStep==1">
      <div id="notetrack" class="track">
        <div class="title">
          <a href="/works/noteLaw" target="_blank">查看我的笔记</a>
          <!--<el-select class="select-paragraph" v-model="isParagraph" placeholder="笔记范围" size="mini" @change="searchNote">
            <el-option v-for="item in paragraphEnum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>-->
          <el-dropdown placement="bottom"  @command="handleCommand">
            <span class="el-dropdown-link">
              {{paragraphText}}<i class="iconfont web-sanjiaoxing"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="paragraph" v-if="paragraph || paragraph==0">当前段落笔记</el-dropdown-item>
              <el-dropdown-item command="all">全文笔记</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <i class="el-icon-close" @click="closeWindow"></i>
        </div>
      </div>
      <div id="notesearch" class="search">
        <el-input id="txtkeyword" placeholder="搜索笔记内容,多关键词用空格隔开" v-model="keyWord" class="input-with-select" size="small" @keyup="searchNoteStartPage" clearable>
          <el-button slot="prepend" size="small">笔记</el-button>
          <el-button slot="append" icon="el-icon-search" size="small" @click="searchNoteStartPage"></el-button>
        </el-input>
      </div>
      <div id="notefilterbox" class="filterbox">
        <el-select class="filter-select" v-model="noteType" placeholder="笔记分类" size="mini" @change="searchNoteStartPage">
          <el-option v-for="item in noteTypeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="filter-select" v-model="orderTypeEnum" placeholder="排序" size="mini" @change="searchNoteStartPage">
          <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="notelistContent" class="listContent" :style="{height: contentHeight+'px'}" v-if="searchNoteList.length>0">
        <div class="listBox" v-for="(item,index) in searchNoteList" :key="index">
          <div class="title-item">
            <img class="header-img" :src="item.userAvatar">
            <span class="title">{{item.userName}}</span>
            <!--0私有，1团队, 2小安, 3公开-->
            <span v-if="item.noteStyle==0" class="note-type note-type-person">个人笔记</span>
            <span v-else-if="item.noteStyle==1" class="note-type note-type-team">团队笔记</span>
            <span v-else-if="item.noteStyle==2" class="note-type note-type-xiaoan">小安笔记</span>
            <span v-else-if="item.noteStyle==3" class="note-type note-type-all">全站笔记</span>
          </div>
          <div class="note-content pointer" v-html="noteContentToHtml(item.noteContent)" v-show="!item.isEidt" @click="handleEdit(index,'edit',item)"></div>
          <div class="note-content"  v-show="item.isEidt">
            <el-input class="noteContent" type="textarea" v-model="item.noteContent" :autosize="{ minRows: 4, maxRows: 50}" placeholder="写下你的评论..." :maxlength="10000" spellcheck="false" resize="vertical">
            </el-input>
            <!--<div class="btnBox">
              <el-button type="primary" size="mini" @click="">确定</el-button>
              <el-button size="mini" @click="handleEdit(index,'cancel')">取消</el-button>
            </div>-->
          </div>
          <div class="snippetbox" v-show="!item.isEidt">
            <div class="show-hidden">
              <span class="pointer" v-if="!item.showSnippet" @click.stop="handleShowSnippet(index,'show')">显示原文 <i class="el-icon-arrow-down"></i></span>
              <span class="pointer" v-else @click.stop="handleShowSnippet(index,'hide')">收起原文 <i class="el-icon-arrow-up"></i></span>
              <span>编辑于{{item.createDate}}</span>
            </div>
            <div class="snippet" v-html="item.snippet" v-show="item.showSnippet"></div>
          </div>
          <div class="opt-box">
            <div class="iconbox">
              <span class="icon-content" style="width:40px;">
                <img class="icon-img" :src="$image.rules.comment" style="height: 15px;">
                <span class="count-span">{{item.commentCount}}</span>
                <span class="icon-text" @click="showNoteComment(item)">评论</span>
              </span>
              <span class="icon-content" style="width:90px;justify-content: center;margin-right: 9px;">
                <i v-if="item.like" class="iconfont web-dianzan1 likecolor icon-img" @click="giveLike(item,index,0)"></i>
                <i v-else class="iconfont web-dianzan1 icon-img" @click="giveLike(item,index,1)"></i>
                <span v-if="item.like" class="icon-text" @click="giveLike(item,index,0)">取消点赞</span>
                <span v-else class="icon-text" @click="giveLike(item,index,1)">点赞</span>
                <span class="count-span" :class="{'likecolor': item.like}" style="margin-right: 0;">{{item.likeCount}}</span>
              </span>
              <span class="icon-content" v-if="item.userId==userId">
                <img class="icon-img" :src="$image.rules.delete" style="height: 15px;" @click="deleteLawNote(item)">
                 <span class="icon-text" @click="deleteLawNote(item)">删除</span>
              </span>
              <span class="icon-content" v-else style="width:100px;">
                 <img class="icon-img" :src="$image.rules.copy" style="height: 15px;" @click="handleAddLawNote(item)">
                 <span class="icon-text" @click="handleAddLawNote(item)">复制到我的笔记</span>
              </span>
            </div>

            <el-select class="select-note-type" v-model="item.noteType" placeholder="隐私设置" size="mini" @change="updatePrivacyStatus(item,index)"  v-show="!item.isEidt" v-if="item.userId==userId">
              <el-option v-for="item in noteTypeOpt" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="btnBox" v-show="item.isEidt">
              <el-button type="primary" size="mini" @click="handleUpdateLawNote(item,index)">确定</el-button>
              <el-button size="mini" @click="handleEdit(index,'cancel',item)">取消</el-button>
            </div>
          </div>

        </div>
        <div class="center pagination" v-if="totalCount > 10">
          <el-pagination background layout="prev, pager, next" :current-page="pageNum" :total="totalCount" :page-size="pageSize" @current-change="pageChange"></el-pagination>
        </div>
      </div>
      <div v-else>
        <v-noInfo></v-noInfo>
      </div>
    </div>
    <!--评论-->
    <v-noteComment :noteId="selectNoteId" @goBack="commentBack" @closeWindow="closeWindow" v-if="noteStep==2"></v-noteComment>
  </div>
</template>

<script>
  import noteComment from './noteComment'
  export default {
    data() {
      return {
        noteStep: 1,
        lawId: '',
        userId: '',
        userInfo: '',
        contentHeight: 300,
        keyWord: '',
        isParagraph: 0,
        paragraphText: '全文笔记',
        paragraphEnum: [
          {value: 0, label: '全文笔记'},
          {value: 1, label: '当前段落笔记'}
        ],
        noteType: 'ALL_NOTE',
        noteTypeList: [
          {value: 'ALL_NOTE', label: '全部笔记'},
          {value: 'USER_NOTE', label: '个人笔记'},
          {value: 'XIAOAN_NOTE', label: '小安笔记'},
          {value: 'TEAM_NOTE', label: '团队笔记'},
          {value: 'PUBLIC_NOTE', label: '全站笔记'}
        ],
        orderTypeEnum: 'DEFAULT_SORT',
        orderList: [
          {value: 'DEFAULT_SORT', label: '默认排序'},
          {value: 'HOT_SORT', label: '热度排序'},
          {value: 'DATE_SORT', label: '发布日期排序'}
        ],
        noteTypeValue: 0,
        noteTypeOpt: [
          {value: 0, label: '个人可见'},
          {value: 1, label: '团队可见'},
          {value: 2, label: '全站可见'},
          {value: 3, label: '全站可见'}
        ],
        searchNoteList: [],
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
        selectNoteId: ''
      }
    },
    props: {
      paragraph: {
        type: Number
      }
    },
    // 使用其它组件
    components: {
      'v-noteComment': noteComment
    },
    computed: {},
    watch: {
      paragraph: function (val) {
        if (this.paragraph || this.paragraph == 0) {
          this.isParagraph = 1
          this.paragraphText = '当前段落笔记'
        }
        this.searchNote()
      }
    },
    // 生命周期函数
    created() {
      this.lawId = this.$route.query.id
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'))
        // 小安用户 全站可见notetype=2,普通用户notetype=3
        if (this.userInfo.xiaoAnUser) {
          this.noteTypeOpt.splice(3, 1)
        } else {
          this.noteTypeOpt.splice(2, 1)
        }
        if (!this.userInfo.enterpriseUser) {
          this.noteTypeOpt.splice(1, 1)
          this.noteTypeList.splice(3, 1)

        }
      }
      if (this.paragraph || this.paragraph == 0) {
        this.isParagraph = 1
        this.paragraphText = '当前段落笔记'
      }
      this.searchNote()
    },
    mounted() {
      this.$nextTick(() => {
        var sidebarNote = document.querySelector('#sidebarNote').clientHeight
        var notetrack = document.querySelector('#notetrack').clientHeight
        var notesearch = document.querySelector('#notesearch').clientHeight
        var notefilterbox = document.querySelector('#notefilterbox').clientHeight
        this.contentHeight = (sidebarNote - notetrack - notesearch - notefilterbox) // barContentH - titleH - confirmH
        // document.querySelector('#notelistContent').style.height = (sidebarNote - notetrack - notesearch) + 'px'
        // barContentH - titleH - newCollectH - confirmH * 2
        console.log(this.contentHeight)
        setTimeout(() => {
          // alert(document.querySelectorAll('.noteContent textarea'))
          let eles = document.querySelectorAll('.noteContent textarea')
          for (let i = 0; i < eles.length; i++) {
            eles[i].style.maxHeight = (sidebarNote / 2) + 'px'
          }
        }, 1000)

        document.querySelector('#txtkeyword').addEventListener('keyup', (event) => {
          if (event.keyCode == 13) {
            this.searchNoteStartPage()
          }
        })
      });
    },
    // 方法
    methods: {
      handleCommand (command) {
        if (command == 'all') {
          this.paragraphText = '全文笔记'
          this.isParagraph = 0
        } else {
          this.paragraphText = '当前段落笔记'
          this.isParagraph = 1
        }
        this.searchNoteStartPage()
      },
      closeWindow() {
        this.$emit('closeWindow')
      },
      handleShowSnippet (index, key) {
        if (key == 'show') {
          this.$set(this.searchNoteList[index], 'showSnippet', true)
        } else {
          this.$set(this.searchNoteList[index], 'showSnippet', false)
        }
        this.searchNoteList = Object.assign([], this.searchNoteList)
      },
      handleEdit (index, key, item) {
        if (item.userId == this.userId) {
          this.searchNoteList.forEach(item => {
            item.isEidt = false
          })
          if (key == 'edit') {
            this.$set(this.searchNoteList[index], 'isEidt', true)
          }
          this.searchNoteList = Object.assign([], this.searchNoteList)
        }
      },
      pageChange (index) {
        this.pageNum = index;
        this.searchNote()
      },
      searchNoteStartPage() {
        this.pageNum = 1
        this.searchNote()
      },
      // 搜索接口
      searchNote() {
        let paragraphValue = this.paragraph
        if (this.isParagraph == 0) {
          paragraphValue = ''
        }
        // let keyword = this.$common.transStr(this.keyWord)  空格转逗号
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.searchNote,
          params: {
            lawId: this.lawId,
            keyWord: this.keyWord,
            noteType: this.noteType,
            orderTypeEnum: this.orderTypeEnum,
            paragraph: paragraphValue,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            sourcedId: '',
            refresh: 'wait_for',
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            if (res.data.returnObject) {
              this.totalCount = res.data.returnObject.count
              this.searchNoteList = res.data.returnObject.list
              this.searchNoteList.forEach((item) => {
                  item.noteContent = this.$common.hight(this.keyWord, item.noteContent)
                  item.showSnippet = false
                  item.isEidt = false
                  let snippet = this.$common.hight(this.keyWord, item.snippet)
                  item.snippet = snippet.replace(/\n+/g, '<br/>')

                  item.createDate = this.$common.transTime(item.createDate)[4]
                  // item.noteContentHtml = item.noteContent.replace(/\n/g, '<br/>')
              })
            }
            // this.$message({showClose: true, type: 'success', duration: 3000, message: '笔记获取成功'})
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      },
      noteContentToHtml (noteContent) {
        return noteContent.replace(/\n/g, '<br/>')
      },
      // 隐私设置
      updatePrivacyStatus (item, index) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.updatePrivacyStatus,
          params: {
            noteId: item.id,
            noteType: item.noteType,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode === 200 || res.data.returnCode === 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '隐私设置成功'})
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      },
      // 删除笔记
      deleteLawNote (item) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // modal: false,
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.lawnote.deleteLawNote,
            params: {
              noteIds: item.id,
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            console.log(res)
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (this.searchNoteList.length == 1) {
                this.pageNum = this.pageNum - 1
              }
              this.$message({showClose: true, type: 'error', duration: 3000, message: '删除成功'})
              this.searchNote()
            } else {

            }
          })
        }).catch(() => {

        })
      },
      // 点赞 是否点赞：0：否，1：是
      giveLike (item, index, like) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.giveLike,
          params: {
            sourceId: item.id,
            sourceType: 1,
            like: like,
            userId: this.userId
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (like == 1) {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞成功'})
              this.$set(this.searchNoteList[index], 'likeCount', item.likeCount + 1)
              this.$set(this.searchNoteList[index], 'like', true)
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: '点赞已取消'})
              this.$set(this.searchNoteList[index], 'likeCount', item.likeCount - 1)
              this.$set(this.searchNoteList[index], 'like', false)
            }

          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
          }
        })
      },
      // 添加笔记
      handleAddLawNote (item) {
        this.$confirm('确定要复制吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // modal: false,
          type: 'warning'
        }).then(() => {
        let sourceId = this.userId
        if (item.noteType == 1 && this.userInfo.enterpriseUser) {
          sourceId = this.userInfo.companyId
        }
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.addLawNote,
          data: {
            sourceId: sourceId,
            lawId: item.lawId,
            snippet: item.snippet,
            noteType: item.noteType,
            noteContent: item.noteContent,
            cssClass: '',
            startContainerId: item.startContainerId,
            endContainerId: item.endContainerId,
            paragraph: item.paragraph,
            userName: this.userInfo.userName,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            // 返回第一页
            setTimeout(() => {
              this.orderTypeEnum = 'DATE_SORT'
              this.pageChange(1)
            }, 1000)

          } else {

          }
        })
      })
    },
      // 编辑个人日历
      handleUpdateLawNote (item, index) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.updateLawNote,
          data: {
            id: item.id,
            noteContent: item.noteContent,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$set(this.searchNoteList[index], 'isEidt', false)
            // this.$set(this.searchNoteList[index], 'noteContentHtml', this.searchNoteList[index].noteContent)
            this.searchNoteList = Object.assign([], this.searchNoteList)
            this.$message({showClose: true, type: 'error', duration: 3000, message: '笔记修改成功'})
          } else {

          }
        })
      },
      // 查看评论
      showNoteComment (item) {
        this.selectNoteId = item.id
        this.noteStep = 2
      },
      // 评论返回
      commentBack () {
        this.selectNoteId = ''
        this.noteStep = 1
        this.searchNote()
      }
    }
  }
</script>

<style lang="scss">
  #sidebarNote {
    padding-bottom: 70px;
    height: 100%;
    .flex {
      display: flex;
      align-items: center;
    }
    .track {
      height: 33px;
      box-sizing: border-box;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 33px;
        padding-bottom: 11px;
        border-bottom: 1px solid #e3e3e3;
        font-size: 16px;
        color: #323232;
        .el-icon-close {
          float: right;
          color: #8d8d8d;
          font-size: 20px;
          cursor: pointer;
        }
        .web-sanjiaoxing {
          color: #ffb148;
          font-size: 12px;
          margin-left: 5px;
          font-weight: 800;
        }
        .select-paragraph {
          width:115px
        }
        .el-dropdown-link {
          font-size: 16px;
        }
        .el-dropdown {
          margin-left: -70px;
        }
      }

    }
    .search {
      padding: 10px 0;

    }
    .filterbox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e3e3e3;
      padding-bottom: 10px;
      .filter-select {
        width: 120px;
      }
    }
    .listContent {
      overflow-y: auto;
      padding-bottom: 20px;
      .listBox {
        padding-top: 17px;
        .title-item {
          display: flex;
          align-items: center;
          height: 30px;
          .header-img {
            width:30px;
            height: 30px;
            border-radius: 50%;
          }
          .title {
            font-size: 16px;
            color: #323232;
            display: inline-block;
            margin-left: 10px;
          }
          .note-type {
            margin-left: 10px;
            border-radius: 3px;
            padding: 0 9px;
            font-size: 12px;
            display: inline-block;
          }
          .note-type-person {
            color: #FF9A86;
            border: 1px solid #FF9A86;
          }
          .note-type-xiaoan {
            color: #ffb148;
            border: 1px solid #ffb148;
          }
          .note-type-team {
            color: #63BFFF;
            border: 1px solid #63BFFF;
          }
          .note-type-all {
            color:#8D8D8D;
            border: 1px solid #8D8D8D;
          }
        }
        .note-content {
          padding-left: 40px;
          font-size: 14px;
          color: #323232;
          .noteContent {
            /*border: 1px solid #e3e3e3;*/
          }
          .btnBox {
            padding-top:10px;
            text-align: right;
          }
        }
        .snippetbox {
          font-size: 12px;
          color: #8d8d8d;
          padding-left: 40px;
          /*padding-right: 10px;*/
          .show-hidden {
            padding: 5px 0 4px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .snippet {
            margin-top: 4px;
            padding: 7px 0 7px 10px;
            background-color: #FFFAF5;
            line-height: 18px;
          }
        }
        .opt-box {
          margin-left: 40px;
          padding: 4px 0 10px 0;
          border-bottom: 1px solid #e3e3e3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color:#8d8d8d;
          .iconbox {
            display: flex;
            height: 20px;
            align-items: center;
            justify-content: space-between;
          }
          .icon-content {
            width: 65px;
            display: inline-flex;
            align-items: center;
            .icon-img {
              margin-right:8px;
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

          .icon-dianzan1 {
            cursor: pointer;
            margin-right:8px;
            font-size: 20px;
            position: relative;
            top: -1px;
            color: #a4a4a4;
            line-height: 15px !important;
          }
          .count-span {
            margin-right: 30px;
          }
          .likecolor {
            color: #ffb148;
          }
          .select-note-type {
            width: 100px;
          }
        }
      }
      .pagination {
        padding-top: 10px;
      }
    }

  }
</style>
