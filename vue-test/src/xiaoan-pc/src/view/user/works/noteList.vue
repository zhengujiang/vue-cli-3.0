<template>
  <div id="noteList">
    <header class="note-search">
      <h4 class="note-title">{{lawTitle}}</h4>
      <el-input id="worksSearchWord" placeholder="多关键词用空格隔开" v-model="keyWord" class="input-with-select" size="small" clearable @clear="searchNoteStartPage">
        <i class="el-icon-search" slot="append" @click="searchNoteStartPage"></i>
      </el-input>
    </header>
    <div class="sort" id="sortColumn">
      <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="handleSelectSort(index)">
        <span>{{ list.name }}</span>
        <i class="icon iconfont web-sanjiaoxing up" :class="{hide: !list.isActive}"></i>
      </div>
      <div class="el-dropdown-link" style="margin-left: 157px;">
        <el-select class="filter-select" v-model="privacyValue" placeholder="笔记分类" size="mini" @change="searchNoteStartPage">
          <el-option v-for="item in privacyEnum" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="el-dropdown-link" style="margin-right: 0; width: 60px;" @click="isEditAll=true" v-show="!isEditAll">
        <span>批量编辑</span>
      </div>
      <div class="el-dropdown-link" style="margin-right: 0; width: 60px;" @click="isEditAll=false" v-show="isEditAll">
        <span>取消批量</span>
      </div>
      <div class="el-dropdown-link" style="margin-right: 0; width: 60px;" @click="changeButton" v-show="!toggle">
        <span>全部展开</span>
      </div>
      <div class="el-dropdown-link" style="margin-right: 0; width: 60px;" @click="changeButton1" v-show="toggle">
        <span>全部收起</span>
      </div>
    </div>
    <div class="multiple-operate" v-show="isEditAll">
      <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <span class="count mleft" v-show="checkCount>0">已选择 {{checkCount}} 条</span>
      <span class="count mleft" v-show="checkCount==0"></span>
      <el-button size="mini" :plain="true" class="mleft" @click="deleteLawNoteAll">全部删除</el-button>
      <el-select class="select-note-type mleft" v-model="noteTypeValue" placeholder="隐私设置" size="mini" @change="updatePrivacyStatusAll">
        <el-option v-for="item in noteTypeOpt" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="listContent" v-if="searchNoteList.length>0">
      <div class="note-item"  v-for="(item,index) in searchNoteList" :key="index">
        <div class="chkbox" v-show="isEditAll">
          <el-checkbox v-model="item.chk" @change="handleCheckChange(item,index)"> </el-checkbox>
        </div>
        <div class="listBox">
          <!--<div class="title-item">
            <img class="header-img" :src="item.userAvatar">
            <span class="title">{{item.userName}}</span>
            &lt;!&ndash;0私有，1团队, 2小安, 3公开&ndash;&gt;
            <span v-if="item.noteType==0" class="note-type note-type-person">个人笔记</span>
            <span v-else-if="item.noteType==1" class="note-type note-type-team">团队笔记</span>
            <span v-else-if="item.noteType==2" class="note-type note-type-xiaoan">小安笔记</span>
            <span v-else-if="item.noteType==3" class="note-type note-type-all">全站笔记</span>
          </div>-->
          <div class="note-content pointer" v-html="item.noteContent" v-show="!item.isEidt" @click="handleEdit(index,'edit')"></div>
          <div class="note-content"  v-show="item.isEidt">
            <el-input class="noteContent" type="textarea" v-model="item.noteContent" :autosize="{ minRows: 4, maxRows: 20}" placeholder="写下你的评论..." :maxlength="10000" spellcheck="false">
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
                <img class="iconimg" :src="$image.rules.dialog" style="height: 15px; cursor: default">
                <span class="count" style="cursor: default">{{item.commentCount}}</span>
                <!--<span class="icon-text" style="cursor: default">评论</span>-->
              </span>
              <span class="icon-content"style="width:90px;justify-content: center;margin-right: 9px;">
                <i v-if="item.like" class="iconfont web-dianzan1 likecolor icon-img" @click="giveLike(item,index,0)"></i>
                <i v-else class="iconfont web-dianzan1 icon-img" @click="giveLike(item,index,1)"></i>
                <span v-if="item.like" class="icon-text" @click="giveLike(item,index,0)">取消点赞</span>
                <span v-else class="icon-text" @click="giveLike(item,index,1)">点赞</span>
                <span class="count-span" :class="{'likecolor': item.like}" style="margin-right: 0;">{{item.likeCount}}</span>
              </span>
              <span class="icon-content">
                <img class="icon-img" :src="$image.rules.delete" style="height: 15px;">
                <span class="icon-text" @click="deleteLawNote(item.id)">删除</span>
              </span>
            </div>

            <el-select class="select-note-type" v-model="item.noteType" placeholder="隐私设置" size="mini" @change="updatePrivacyStatus(item.id,item.noteType)"  v-show="!item.isEidt">
              <el-option v-for="item in noteTypeOpt" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="btnBox" v-show="item.isEidt">
              <el-button type="primary" size="mini" @click="handleUpdateLawNote(item,index)">确定</el-button>
              <el-button size="mini" @click="handleEdit(index,'cancel')">取消</el-button>
            </div>
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
</template>

<script>
  export default {
    data() {
      return {
        isEditAll: false,
        toggle:false,
        switch:'',
        indeterminate: false,
        checkAll: false,
        checkCount: 0,
        lawId: '',
        userId: '',
        userInfo: '',
        contentHeight: 300,
        sort: [
          {id: '0', name: '默认排序', value: 'DEFAULT_SORT', isActive: true, up: false},
          {id: '1', name: '热度', value: 'HOT_SORT', isActive: false, up: true},
          {id: '2', name: '发布日期', value: 'DATE_SORT', isActive: false, up: true}
        ],
        keyWord: '',
        isParagraph: 0,
        paragraphEnum: 0,
        // paragraphEnum: [
        //   {value: 0, label: '全文笔记'},
        //   {value: 1, label: '当前段落笔记'}
        // ],
        noteType: 'ALL_NOTE',
        noteTypeList: [
          // {value: 'ALL_NOTE', label: '全部笔记'},
          // {value: 'USER_NOTE', label: '个人笔记'},
          // {value: 'XIAOAN_NOTE', label: '小安笔记'},
          // {value: 'TEAM_NOTE', label: '团队笔记'},
          // {value: 'PUBLIC_NOTE', label: '全站笔记'}
          {value: 'ALL_NOTE', label: '全部笔记'},
          {value: 'USER_NOTE', label: '个人笔记'},
          {value: 'TEAM_NOTE', label: '团队笔记'},
          {value: 'PUBLIC_NOTE', label: '全站笔记'}
        ],
        orderTypeEnum: 'DEFAULT_SORT',
        orderList: [
          {value: 'DEFAULT_SORT', label: '默认排序'},
          {value: 'HOT_SORT', label: '热度排序'},
          {value: 'DATE_SORT', label: '发布日期排序'}
        ],
        noteTypeValue: '',
        noteTypeOpt: [
          {value: 0, label: '个人可见'},
          {value: 1, label: '团队可见'},
          {value: 2, label: '全站可见'},
          {value: 3, label: '全站可见'}
        ],
        privacyValue: '',
        privacyEnum: [
          {value: '', label: '适用隐私'},
          {value: 'USER_SEE', label: '个人可见'},
          {value: 'TEAM_SEE', label: '团队可见'},
          {value: 'ALL_SEE', label: '全站可见'}
        ],
        searchNoteList: [],
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
        selectNoteId: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.lawId = this.$route.query.lawId
      this.lawTitle = decodeURIComponent(this.$route.query.lawTitle)
      if (this.lawTitle.length > 40) {
        this.lawTitle = this.lawTitle.substring(0, 40) + '...'
      }
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
          this.privacyEnum.splice(2, 1)
        }

      }
      this.searchNote()
    },
    mounted() {
      document.querySelector('#worksSearchWord').addEventListener('keyup', (event) => {
        if (event.keyCode == 13) {
          this.searchNoteStartPage()
        }
      })
    },
    // 方法
    methods: {
      changeButton() {
        this.toggle = true;
        for (let i = 0; i < this.searchNoteList.length; i++) {
          this.searchNoteList[i].showSnippet = true;
        }
      },
      changeButton1() {
        this.toggle = false;
        for (let i = 0; i < this.searchNoteList.length; i++) {
          this.searchNoteList[i].showSnippet = false;
        }
      },
      handleSelectSort(index) {
        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.orderTypeEnum = this.sort[index].value
        this.searchNote()
      },
      handleCheckAllChange () {
        this.searchNoteList.forEach((item) => {
          if (this.checkAll) {
            item.chk = true
            this.checkCount = this.searchNoteList.length
          } else {
            item.chk = false
            this.checkCount = 0
          }
        })
        this.indeterminate = false
      },
      handleCheckChange (item, index) {
        this.searchNoteList = Object.assign([], this.searchNoteList)
        var chklist = this.searchNoteList.filter((item) => {
          return (item.chk == true)
        })
        if (chklist.length > 0) {
          if (chklist.length == this.searchNoteList.length) {
            this.checkAll = true
            this.indeterminate = false
          } else {
            this.checkAll = false
            this.indeterminate = true
          }
        } else {
          this.indeterminate = false
        }
        this.checkCount = chklist.length
      },
      handleShowSnippet (index, key) {
        if (key == 'show') {
          this.$set(this.searchNoteList[index], 'showSnippet', true)
        } else {
          this.$set(this.searchNoteList[index], 'showSnippet', false)
        }
        this.searchNoteList = Object.assign([], this.searchNoteList)
      },
      handleEdit (index, key) {
        this.searchNoteList.forEach(item => {
          item.isEidt = false
        })
        if (key == 'edit') {
          this.$set(this.searchNoteList[index], 'isEidt', true)
        }
        this.searchNoteList = Object.assign([], this.searchNoteList)
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
        // let noteType = this.noteType
        // if (noteType == 'ALL_NOTE') {
        //   noteType = 'USER_NOTE'
        // }
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.searchNote,
          params: {
            lawId: this.lawId,
            keyWord: this.keyWord,
            noteType: 'USER_NOTE',  // 只获取个人的
            orderTypeEnum: this.orderTypeEnum,
            paragraph: paragraphValue,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            sourcedId: '',
            privacyEnum: this.privacyValue,
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

                item.showSnippet = this.switch

                item.isEidt = false
                item.chk = false
                let snippet = this.$common.hight(this.keyWord, item.snippet)
                item.snippet = snippet.replace(/\n+/g, '<br/>')
                item.createDate = this.$common.transTime(item.createDate)[4]
              })
              this.checkAll = false
              this.indeterminate = false
            }
            // this.$message({showClose: true, type: 'success', duration: 3000, message: '笔记获取成功'})
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
          }
        })
      },
      // 隐私设置
      updatePrivacyStatus (id, noteType) {
        this.$http({
          method: 'POST',
          url: this.$api.lawnote.updatePrivacyStatus,
          params: {
            noteId: id,
            noteType: noteType,
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
      updatePrivacyStatusAll () {
        let noteIds = []
        this.searchNoteList.forEach(item => {
          if (item.chk) {
            noteIds.push(item.id)
          }
        })
        if (noteIds.length > 0) {
          // this.updatePrivacyStatus(noteIds.join(','), this.noteTypeValue)
          this.$http({
            method: 'POST',
            url: this.$api.lawnote.updateNoteType,
            params: {
              noteIds: noteIds.join(','),
              noteType: this.noteTypeValue,
              userId: this.userId
            }
          }).then((res) => {
            if (res.data.returnCode === 200 || res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '隐私设置成功'})
              this.searchNoteList.forEach(item => {
                if (item.chk) {
                  item.noteType = this.noteTypeValue
                }
              })
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.retrunMsg})
            }
          })
        } else {
          this.noteTypeValue = ''
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先选择要操作的笔记'})
        }
      },
      // 删除笔记
      deleteLawNote (noteIds, key) {
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
              noteIds: noteIds,
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            console.log(res)
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (this.searchNoteList.length == 1) {
                this.pageNum = this.pageNum - 1
              }
              // 批操作，清除选中状态
              if (key == 'all') {
                this.checkCount = 0
                this.indeterminate = false
                this.checkAll = false
              }
              this.$message({showClose: true, type: 'success', duration: 3000, message: '删除成功'})
              setTimeout(() => {
                this.searchNote()
              }, 1000)
            } else {

            }
          })
        }).catch(() => {

        })
      },
      deleteLawNoteAll () {
        let noteIds = []
        this.searchNoteList.forEach(item => {
          if (item.chk) {
            noteIds.push(item.id)
          }
        })
        if (noteIds.length > 0) {
          this.deleteLawNote(noteIds.join(','), 'all')
        } else {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先选择要删除的笔记'})
        }

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
              this.$message({showClose: true, type: 'success', duration: 3000, message: '点赞成功'})
              this.$set(this.searchNoteList[index], 'likeCount', item.likeCount + 1)
              this.$set(this.searchNoteList[index], 'like', true)
            } else {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '点赞已取消'})
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
              this.pageChange(1)
            }, 1000)

          } else {

          }
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
            this.searchNoteList = Object.assign([], this.searchNoteList)
            this.$message({showClose: true, type: 'error', duration: 3000, message: '笔记修改成功'})
          } else {

          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #noteList {
    .note-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 6px;
      margin-top: -14px;
      border-bottom: 1px solid #e3e3e3;
      .note-title {
        padding: 0;
        margin: 0;
        line-height: 1;
        font-weight: 600;
      }
      .input-with-select {
        width:242px;
      }
      .el-input-group__append {
        background-color: rgba(255,255,255,0);
      }
      .el-icon-search {
        font-size: 18px;
        cursor: pointer;
        font-weight: 800;
      }
    }
    .sort {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      margin: 16px 0 6px 0;
      line-height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      font-size: 13px;
      color: #8d8d8d;
      .flip {
        line-height: 40px;
      }
      div {
        display: inline-block;
        i, .iconfont {
          /*transition: transform .3s, -webkit-transform .3s;*/
          /*transform: rotate(0deg);*/
        }
        .iconfont {
          font-size: 12px !important;
          color: #8d8d8d;
          display: inline-block;
          line-height: 20px;
          margin-left: 8px;
        }
        .web-sanjiaoxing:before {
          font-size: 12px !important;
          display: block;
          transform: scale(0.7, 0.7);
        }
        .up {
          transition: transform .3s, -webkit-transform .3s;
          transform: rotate(180deg);
        }
        .hide {
          opacity: 0;
        }
      }
      .el-dropdown-link {
        width:100px;
        margin-right: 50px;
      }
    }
    .multiple-operate {
      font-size: 14px;
      height: 30px;
      display: flex;
      align-items: center;
      .mleft {
        margin-left: 20px;
      }
      .count {
        display: inline-block;
        width: 80px;
      }
      .delete-btn {
        height: 28px;
        line-height: 28px;
        padding: 0 5px;

        display: inline-block;
        border: 1px solid #e3e3e3;
      }
      .el-button {
        color: #8d8d8d;
      }
      .el-button:hover,.el-button:active,.el-button:visited {
        border: 1px solid darken(#e3e3e3, 10%);
        color: #8d8d8d;
      }
      .select-note-type {
        width: 100px;
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #8d8d8d !important; opacity: 1;font-weight: 500 !important;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #8d8d8d;font-weight: 400 !important;
      }
      input:-ms-input-placeholder {
        color: #8d8d8d;font-weight: 400 !important;
      }
      input::-webkit-input-placeholder {
        color: #8d8d8d;font-weight: 400 !important;
      }
    }
    .listContent {
      padding-bottom: 20px;
      .note-item {
        display: flex;
        align-items: center;
        .chkbox {
          width: 3%;
        }
        .listBox {
          width: 97%;
          padding-top: 17px;
          flex-grow: 1;
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
            padding-right: 10px;
            .show-hidden {
              padding: 5px 0 4px 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .snippet {
              margin-top: 4px;
              padding: 7px 10px 7px 10px;
              background-color: #FFFAF5;
              line-height: 18px;
            }
          }
          .opt-box {
            padding: 4px 10px 10px 0;
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
              .icon-img,.iconimg {
                margin-right:8px;
                height: 15px;
                cursor: pointer;
                display: inline-block;
              }
              .count {
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

            .web-dianzan1 {
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
      }

      .pagination {
        padding-top: 10px;
      }
    }
  }
</style>
