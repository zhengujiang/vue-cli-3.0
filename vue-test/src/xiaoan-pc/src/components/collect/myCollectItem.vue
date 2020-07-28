<template>
  <div id="collect" class="my-team-collect-item">
    <div class="my-box">
      <!---->
      <div class="contents" :style="{height: contentHeight+'px'}">
        <div class="newCollect">
          <el-input class="inputName" v-model="newName" :placeholder="placeholder[0]"></el-input>
          <div class="new" @click="newCollect">创建</div>
        </div>
        <el-alert v-show="addCollectAlert.show" class="addCollectAlert" :title="addCollectAlert.message"
                  :type="addCollectAlert.type" show-icon></el-alert>
        <div class="listContent">
          <div class="column" v-for="(list,index) in collectList" @click.stop="selectItem(list.id, 'L', index)">
            <span class="liTitle">{{ list.title }}</span>
            <el-checkbox v-model="list.checked" v-show="!editStatus" @click.stop="selectItem(list.id, 'L', index)"
                         class="che"></el-checkbox>
          </div>
        </div>
        <div class="confirm" v-if="!editStatus">
          <div class="cancel" @click="cancelCollect">取 消</div>
          <div class="true" @click="addCollect">确 认</div>
        </div>
        <div class="confirm" v-else>
          <div class="cancel" style="margin-left: 150px" @click="editCollect">编辑</div>
        </div>
      </div>
      <!---->
      <div class="collectList" id="cat" v-show="showList">
        <div class="fanhui" id='dog' @click="returnBack">
          <div style="text-align: left;background: #fff;width: auto;height: 99%;overflow: hidden">
            <i class="iconfont web-fanhui" style="font-weight: 500;line-height: 65px;color:#323232;"></i>
          </div>
          <div v-if="this.collectName !== '' && this.collectName.length > 15"
               style="padding-left: 33px;
                    box-sizing: border-box;
                    overflow: hidden;">{{ this.collectName }}
          </div>
          <div v-else-if="this.collectName !== '' && this.collectName.length < 15"
               style="box-sizing: border-box;overflow: hidden;">{{ this.collectName }}
          </div>
        </div>
        <div id="wrapper" v-if="!loadContent">
          <ul class="liList" id="per"> <!--  v-if="!loadContent" -->
            <li v-for="(list, index) in listArr" @click="linkTo(list.refId, list.type)">
              <div class="liTitle" v-if="list.type == 'interact'">{{ list.title }}{{list.timeliness}}</div>
              <div class="liTitle" v-else>{{ list.title }}</div>
              <div>
                <span class="liSort" style="background: #90b8f4" v-if="list.type == 'law'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #ffd091" v-else-if="list.type == 'case'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #f2aa94" v-else-if="list.type == 'qa'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #ffa691" v-else-if="list.type == 'caselaw'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #8bdde4" v-else-if="list.type == 'report'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #ffa691" v-else-if="list.type == 'interact'">
                  {{ list.type | listType }}</span>
                <span class="liSort" style="background: #ffddb0" v-else-if="list.type == 'publish'">
                  {{ list.type | listType }}</span>
                <span class="liSplit">|</span>
                <span class="liTime">{{ list.time }}</span>
                <span class="liSplit" v-show="list.timeliness">|</span>
                <span class="liTime" v-show="list.timeliness">{{ list.timeliness }}</span>
              </div>
            </li>
          </ul>
        </div>
        <ul class="liList loading" v-else>
          <li v-if="listArr.length !== 0">
            <i class="el-icon-loading"></i>
          </li>
          <li v-if="listArr.length == 0" style="padding-top: 50px">
            <v-noInfo></v-noInfo>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import noInfo from '@/components/noInfo.vue'

  export default {
    name: 'mycollect',
    data() {
      return {
        //
        activeName: 'my',
        //
        newName: '',
        placeholder: ['输入收藏夹名称'],
        radio: '1',
        checkedM: false,
        checked: false,
        defaultId: '',
        collectList: [],
        defaultList: [],
        listArr: [],
        loadContent: false,
        showList: false,
        editStatus: false,
        collectName: '',
        scrollNum: '',
        listRows: 10,
        listPage: 1,
        collectSort: '',
        collectId: '',
        collectTotal: 0,
        alreadyId: [],
        alreadyArr: [],
        addCollectAlert: {show: false, type: 'success', duration: 3000, message: '创建成功！'},
        contentHeight: 0,
        defaultCollectObj: {}
      }
    },
    components: {
      'v-noInfo': noInfo
    },
    watch: {
      active: function (val) {
        this.$nextTick(() => {
          var listContent = document.getElementsByClassName('listContent')[0]
          var barContentH = document.getElementsByClassName('barContent')[0].clientHeight
          var titleH = 0
          var newCollectH = document.getElementsByClassName('newCollect')[0].clientHeight
          var contents = document.getElementsByClassName('contents')[0]
          var confirmH = document.getElementsByClassName('confirm')[0].clientHeight
          this.contentHeight = (barContentH - titleH - 20) // barContentH - titleH - confirmH
          listContent.style.height = (barContentH - titleH - newCollectH - 40 * 2 - 100) + 'px'
          // barContentH - titleH - newCollectH - confirmH * 2
        });
        console.log(val, this.contentHeight);
      },
      scrollNum: function (val) {
        console.log('val', val)
      },
      alreadyArr: function (val) {
        if (val.length !== 0) {
          console.log('val', val, this.defaultId)
          for (var i in this.alreadyId) {
            for (var j in val) {
              if (this.alreadyId[i] == val[j]) {
                this.collectList[i].checked = true
              }
              if (this.defaultId == val[j]) {
                this.checkedM = true
              } else {
                this.checkedM = false
              }
            }
          }
        }
      }
    },
    props: {
      active: {
        type: String
      },
      info: {
        type: Object
      }
    },
    filters: {
      listType: function (value) {
        if (!value) return value
        if (value == 'law') {
          return '法规'
        } else if (value == 'case') {
          return '公告'
        } else if (value == 'qa') {
          return '问答'
        } else if (value == 'caselaw') {
          return '案例'
        } else if (value == 'report') {
          return '研报'
        } else if (value == 'interact') {
          return 'e互动'
        } else if (value == 'publish') {
          return 'IPO'
        }
      }
    },
    created() {
      this.getDefaultContent();
    },
    mounted() {
      this.$nextTick(() => {
        var listContent = document.getElementsByClassName('listContent')[0]
        var barContentH = document.getElementsByClassName('barContent')[0].clientHeight
        var titleH = 0
        var newCollectH = document.getElementsByClassName('newCollect')[0].clientHeight
        var contents = document.getElementsByClassName('contents')[0]
        var confirmH = document.getElementsByClassName('confirm')[0].clientHeight
        contents.style.height = (barContentH - titleH - 20) + 'px' // barContentH - titleH - confirmH
        listContent.style.height = (barContentH - titleH - newCollectH - 40 * 2 - 90) + 'px'
        // barContentH - titleH - newCollectH - confirmH * 2
      });
    },
    methods: {
      getDefaultContent() {
        this.$http({
          methods: 'GET',
          url: this.$api.user.getDefaultContent,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject;
            this.defaultCollectObj = [content]
            this.defaultId = content.id;
            this.getMyCollectB();
          }
        })

      },
      //
      contentStyle() {
        var cat = document.getElementById('cat').clientHeight
        var wrap = document.getElementById('wrapper')
        wrap.style.height = (cat - 60 - 65) + 'px'
        this.addEvent(wrap, 'mousewheel', onmousewheel)
        this.addEvent(wrap, 'DOMMouseScroll', onmousewheel)
      },
      //
      addEvent(obj, xEvent, fn) {
        if (obj.attachEvent) {
          obj.attachEvent('on' + xEvent, fn)
        } else {
          obj.addEventListener(xEvent, fn, false)
        }
        var wrap = document.getElementById('wrapper')
        var _th = this
        wrap.onscroll = function () {
          if (obj.scrollTop > (170 * _th.listPage)) {
            if (_th.listPage < Math.ceil(_th.collectTotal / _th.listRows)) {
              _th.listPage = _th.listPage + 1
              if (_th.collectSort == 'M') {
                _th.handleChangeM()
              } else {
                _th.getCollectContent(_th.collectId)
              }
            }
          }
        }
      },
      //
      editCollect() {
        this.editStatus = false
        this.alreadyList()
      },
      //
      returnBack() {
        this.showList = false
      },
      // 新建收藏夹
      newCollect() {
        this.$http({
          method: 'POST',
          url: this.$api.user.addCollect,
          params: {
            userId: this.$cookie.get('userId'),
            favouriteName: this.newName,
            isDefault: 0,
            introduction: '',
            limitation: ''
          }
        }).then((res) => {
          console.log('新建收藏夹', res)
          if (res.data.returnCode == 1) {
            // this.$message({showClose: true, type: 'success', duration: 3000, message: '创建成功！'})
            this.handleAddCollectAlert({show: true, type: 'success', duration: 3000, message: '创建成功！'})
            this.getMyCollectB()
            this.newName = ''
          } else if (res.data.returnCode == -1) {
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写新收藏夹的名称！'})
            this.handleAddCollectAlert({show: true, type: 'warning', duration: 3000, message: '请填写新收藏夹的名称！'})
          } else if (res.data.returnCode == 3) {
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '该文件名称已存在！'})
            this.handleAddCollectAlert({show: true, type: 'warning', duration: 3000, message: '该文件名称已存在！'})
          } else if (res.data.returnCode == 2) {
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多创建十个收藏夹！'})
            this.handleAddCollectAlert({show: true, type: 'warning', duration: 3000, message: '最多创建十个收藏夹！'})
          }
        }).catch((err) => {
          // this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          this.handleAddCollectAlert({show: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      //
      handleAddCollectAlert(config) {
        this.addCollectAlert = config
        setTimeout(() => {
          this.addCollectAlert.show = false
        }, config.duration)
      },
      // 取消收藏 重置选中样式
      cancelCollect() {
        for (var i in this.collectList) {
          this.collectList[i].checked = false
        }
        this.editStatus = true
      },
      // 已收藏的收藏夹id   alreadyCollect
      alreadyList() {
        console.log('info = ', this.info)
        var idStr
        if (this.alreadyId.length !== 0) {
          idStr = this.alreadyId.join(',')
        }
        this.$http({
          methods: 'GET',
          url: this.$api.user.alreadyCollect,
          params: {
            userId: this.$cookie.get('userId'),
            refId: this.info.id,
            favourableIds: idStr
          }
        }).then((res) => {
          console.log('已收藏的收藏夹id = ', res)
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.alreadyArr = res.data.returnObject
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 添加收藏内容
      addCollect() {
        var arr = []
        if (this.checkedM) {
          arr.push(this.defaultId)
        }
        for (var i in this.collectList) {
          if (this.collectList[i].checked == true) {
            arr.push(this.collectList[i].id)
          }
        }
        var id = ''
        if (this.alreadyArr.length !== 0) {
          id = this.alreadyArr.join(',')
        }
        /* if (arr.length !== 0) { */
        var favourableid = arr.join(',')
        this.$http({
          methods: 'GET',
          url: this.$api.user.addCollectList,
          params: {
            refId: this.info.id,
            // favourableId: favourableid,
            title: this.info.title,
            publishTime: this.info.time,
            type: this.info.type,
            timeLiness: this.info.timeliness,
            userId: this.$cookie.get('userId'),
            choseFavourableId: favourableid, // 所选收藏夹
            isCollectId: id // 已被收藏的收藏夹id
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '收藏成功！'})
            this.editStatus = true
          } else if (res.data.returnCode == 2) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
            this.editStatus = true
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '收藏失败！'})
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
        /* } */
      },
      // 收藏列表跳转
      linkTo(id, sort) {
        var url = '';
        var watch = false;
        switch (sort) {
          case 'law':
            url = '/rule/details?id=' + id;
            watch = true;
            break;
          case 'case':
            url = '/affiche/details?id=' + id;
            watch = true;
            break;
          case 'caselaw':
            url = '/case/details?id=' + id;
            watch = true;
            break;
          case 'report':
            url = '/report/details?id=' + id;
            watch = true;
            break;
          case 'qa':
            this.getQuestionIdByAnswerId(id);
            break;
          case 'interact':
            url = '/investor/answer?id=' + id;
            watch = true;
            break;
          case 'publish':
            url = '/ipo/details?id=' + id;
            watch = true;
            break;
        }
        if (watch) {
          this.$common.openWindow(url);
        }
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
      selectItem(id, sort, index) {
        //
        // console.log('sdfs', index)
        this.listArr = []
        this.listPage = 1
        this.collectSort = sort
        // console.log('collectId=', this.collectId, id, sort, index)
        if (sort == 'M') {
          if (this.editStatus) {
            this.showList = true
            this.handleChangeM()
            this.$nextTick(() => {
              this.contentStyle()
            })
          } else {
            this.checkedM == true ? this.checkedM = false : this.checkedM = true
          }
        } else {
          if (this.editStatus) {
            this.showList = true
            this.collectId = id
            this.getCollectContent(id)
            this.$nextTick(() => {
              this.contentStyle()
            })
          } else {
            this.collectList[index].checked == true ? this.collectList[index].checked = false : this.collectList[index].checked = true
          }
        }
      },
      // 获取该收藏夹内容
      getCollectContent(id) {
        // console.log('123123', id)
        let params = {
          favourableId: id,
          userId: this.$cookie.get('userId'),
          page: this.listPage,
          rows: this.listRows
        }
        this.$axios.collect.getCollectContent(params).then((res) => {
          // console.log('收藏夹内容', res)
          // this.listArr = []
          if (res.data.returnCode == 1) {
            var arr = res.data.returnObject.collects
            this.collectName = res.data.returnObject.favourite.favouriteName
            this.collectTotal = res.data.total;
            this.listArr = arr.map((item) => {
              return {
                id: item.id,
                refId: item.refId,
                time: this.$common.transTime(item.createDatetime)[1],
                title: item.title,
                type: item.type,
                timeliness: item.timeLiness
              }
            });
            if (this.listArr.length !== 0) {
              this.loadContent = false
            } else {
              this.loadContent = true
            }
          } else if (res.data.returnCode == -1) {
            this.loadContent = true
            this.collectName = res.data.returnObject.favourite.favouriteName ? res.data.returnObject.favourite.favouriteName : ''
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 获取我的收藏
      getMyCollectB() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getMyCollect,
          params: {
            userId: this.$cookie.get('userId'),
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          console.log('我的收藏', res)
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.collectList = [];
              this.alreadyId = [];
              console.log('========>');
              var list = res.data.returnObject.list;
              let data = this.defaultCollectObj.concat(list);
              let newData = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              console.log('========>', newData);
              this.collectList = newData;
              this.alreadyId = newData.map(e => e.id);
              this.alreadyList()
            } else {
              this.collectList = [];
              this.alreadyId = [];
              let data = this.defaultCollectObj
              let newData1 = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              console.log('========>', newData1);
              this.collectList = newData1;
              this.alreadyId = newData1.map(e => e.id);
              this.alreadyList()
            }
          } else {
            this.collectList = [];
            this.alreadyId = [];
            let data = this.defaultCollectObj
            let newData1 = data.map((e) => {
              return {
                id: e.id,
                title: e.favouriteName,
                checked: false
              }
            });
            console.log('========>', newData1);
            this.collectList = newData1;
            this.alreadyId = newData1.map(e => e.id);
            this.alreadyList()
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 打开默认收藏夹
      handleChangeM() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getDefaultContent,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.checkedM == true ? this.checkedM = false : this.checkedM = true
            // console.log('defaultList', res.data.returnObject)
            var content = res.data.returnObject
            this.defaultId = content.id
            this.getCollectContent(content.id)
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 打开个人收藏夹
      handleChange(id, index) {
        // console.log('handleChange', id, index)
        this.collectList[index].checked == true ? this.collectList[index].checked = false : this.collectList[index].checked = true
        this.getCollectContent(id)
      },
      closeWindow() {
        this.$emit('closeWindow')
      }
    }
  }
</script>
<style>
  .el-input__inner {
    padding: 0 10px;
  }
</style>
<style lang="scss">
  #collect {
    width: 100%;
    height: 100%;
    padding-top: 0;
    box-sizing: border-box;
    position: relative;
    .my-box {
      height: 100%;
    }
    .collectList {
      width: 100%;
      height: 100%;
      background: #fff;
      position: absolute;
      left: 0;
      top: 1px;
      z-index: 22;
      box-sizing: border-box;
      .fanhui {
        line-height: 60px;
        height: 60px;
        cursor: pointer;
        position: relative;
        border-bottom: 1px solid #e3e3e3;
        div {
          display: inline-block;
        }
        div:last-child {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          padding-right: 20px;
        }
      }
    }
    #wrapper {
      width: 100%;
      height: auto;
      overflow-y: scroll;
      // overflow: hidden;
      .liList {
        /*overflow-y: scroll;*/
        /*overflow-x: hidden;*/
        overflow: hidden;
        width: 100%;
        height: auto;
        li:first-child {
          // border-top: 1px solid #e3e3e3;
          padding-top: 20px;
        }
        li {
          padding-top: 20px;
          font-size: 16px;
          color: #323232;
          line-height: 22px;
          .liTitle {
            margin-bottom: 5px;
            &:hover {
              text-decoration: underline;
              color: #ffb148;
            }
          }
          .liSort {
            min-width: 35px;
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #fff;
            font-size: 12px;
            border-radius: 2px;
            display: inline-block;
            //margin-right: 10px;
          }
          .liSplit {
            color: #e3e3e3;font-size: 12px;
            margin: 0 5px;
          }
          .liTime {
            font-size: 12px;
            color: #8d8d8d;
            // margin-left: 10px;
          }
        }
      }
    }

    .loading {
      min-height: 200px;
      li {
        width: 100%;
        height: 100%;
        // line-height: 200px;
        text-align: center;
        font-size: 30px;
        color: #ffb148;
      }
    }
    .title {
      width: 100%;
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid #e3e3e3;
      box-sizing: border-box;
      font-size: 17px;
      color: #323232;
      .el-icon-close {
        float: right;
        color: #8d8d8d;
        font-size: 20px;
        line-height: 54px;
        cursor: pointer;
      }
    }
    .contents {
      width: 100%;
      height: 100%;
      position: relative;
      .newCollect {
        width: 100%;
        height: 80px;
        display: table;
        .inputName {
          display: table-cell;
          vertical-align: middle;
          width: 480px;
          height: 40px;
        }
        .new {
          display: table-cell;
          vertical-align: middle;
          width: 45px;
          height: 40px;
          text-align: right;
          font-size: 16px;
          color: #ffb148;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          &:active {
            color: #fff;
          }
        }
      }
      .addCollectAlert {
        margin-top: -10px;
        margin-bottom: 20px;
      }
      .listContent {
        width: 100%;
        height: auto;
        overflow-y: auto;
        overflow-x: hidden;
        .column {
          padding: 20px 0;
          border-bottom: 1px solid #e3e3e3;
          font-size: 16px;
          color: #323232;
          cursor: pointer;
          transition: .3s all;
          .che {
            float: right;
            margin-right: 10px;
          }
          &:active {
            background: #f0f1f5;
          }
          &:hover {
            // background: #8d8d8d;
          }
        }
        .column:first-child {
          border-top: 1px solid #e3e3e3;
        }

        .el-collapse {
          border-bottom: none;
          .el-collapse-item {
            .el-collapse-item__header {
              font-size: 16px;
              color: #323232;
              font-weight: normal !important;
              .selectB {
                width: 16px;
                height: 16px;
              }
            }
            .el-collapse-item__content {
              .liList {
                li:first-child {
                  border-top: 1px solid #e3e3e3;
                  padding-top: 20px;
                }
                li {
                  padding-top: 20px;
                  font-size: 16px;
                  color: #323232;
                  line-height: 22px;
                  .liTitle {
                    margin-bottom: 5px;
                    &:hover {
                      text-decoration: underline;
                      color: #ffb148;
                    }
                  }
                  .liSort {
                    width: 35px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    border-radius: 2px;
                    display: inline-block;
                    margin-right: 10px;
                  }
                  .liSplit {
                    color: #e3e3e3;
                  }
                  .liTime {
                    font-size: 12px;
                    color: #8d8d8d;
                    margin-left: 10px;
                  }
                }
              }
              .loading {
                min-height: 200px;
                li {
                  width: 100%;
                  height: 100%;
                  line-height: 200px;
                  text-align: center;
                  font-size: 30px;
                  color: #ffb148;
                }
              }
            }
          }
        }
      }
      .confirm {
        width: 100%;
        height: 65px;
        position: absolute;
        left: 0;
        // bottom: 0;
        display: table;
        margin-top: 15px;
        // padding-top: 20px;
        .cancel, .true {
          float: left;
          width: 250px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          border: 1px solid #ffb148;
          border-radius: 4px;
          font-size: 16px;
          color: #8d8d8d;
          background: #ffefda;
          cursor: pointer;
          box-sizing: border-box;
          user-select: none;
          -ms-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          &:active {
            background: #fff;
          }
        }
        .true {
          float: right;
          border: 0;
          background: #ffb148;
          color: #fff;
        }
      }
    }
  }
</style>
