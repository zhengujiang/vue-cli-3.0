<template>
  <ul id="ulContent">
    <li v-for="(list,index) in info" v-show="!noInfo" :title="list.listTitle" :key="index">
      <!-- @click="showDescribe(index)" -->
      <div class="title effect" :class="{borderNone: !list.isDescribe}" v-if="list.timeliness == '失效'"
           @click="linkTo(list.id,sort,list.type)">
        <!--  v-html="list.title" -->
        <span v-html="list.title"></span>
        <i v-show="list.newLogo" class="newLogo">new</i>
      </div>
      <div class="title" :class="{borderNone: !list.isDescribe}" v-else @click="linkTo(list.id,sort,list.type)">
        <!--  v-html="list.title" -->
        <span v-html="list.title"></span> <!--  @click.stop="linkTo(list.id,sort,list.type)" -->
        <i v-show="list.newLogo" class="newLogo">new</i>
      </div>
      <transition name="fade">
        <div class="describe" v-show="list.describe" v-if="list.isDescribe == true || list.isDescribe == null"
             @click="linkTo(list.id,sort,list.type)">
          <p v-show="list.describe" v-html="list.describe"></p> <!--  | delHtml -->
        </div>
      </transition>
      <div class="info">
        <p class="issued" v-show="list.issued">{{ list.issued }}</p>
        <!--<p class="split" v-show="list.issued"></p>-->
        <p class="split" v-show="list.issued && list.date"></p>
        <p class="date" v-show="list.date">{{ list.date }}</p>
        <p class="split" v-show="list.timeliness"></p>
        <p class="timeliness" v-show="list.timeliness">{{ list.timeliness }}</p>
        <p class="split" v-show="list.biaoqian"></p>
        <p class="timeliness" v-show="list.biaoqian">{{ list.biaoqian }}</p>
        <p class="split" v-show="list.pingji"></p>
        <p class="timeliness" v-show="list.pingji">{{ list.pingji }}</p>
        <p class="split" v-show="list.plate.length>0"></p>
        <p class="plate">
          <template v-for="li in list.plate">
            <i v-if="li.treeNodeValue == '沪市主板'">沪主板</i>
            <i v-if="li.treeNodeValue == '沪市主板' && list.plate.length !== 1" class="xiegang">/</i>
            <!-- :style="{borderColor:'#ffd092',color:'#ffd092'}" -->
            <i v-if="li.treeNodeValue == '深市主板'">深主板</i>
            <!-- :style="{borderColor:'#ffd092',color:'#ffd092'}" -->
            <i v-if="li.treeNodeValue == '深市主板' && list.plate.length !== 1" class="xiegang">/</i>
            <i v-if="li.treeNodeValue == '深市中小板'">中小板</i>
            <!-- :style="{borderColor:'#ffd092',color:'#ffd092'}" -->
            <i v-if="li.treeNodeValue == '深市中小板' && list.plate.length !== 1" class="xiegang">/</i>
            <i v-if="li.treeNodeValue == '深市创业板'">创业板</i>
            <!-- :style="{borderColor:'#ffd092',color:'#ffd092'}" -->
            <i v-if="li.treeNodeValue == '深市创业板' && list.plate.length !== 1" class="xiegang">/</i>
            <i v-if="li.treeNodeValue == '新三板'">新三板</i>
            <!-- :style="{borderColor:'#ffd092',color:'#ffd092'}" -->
            <i v-if="li.treeNodeValue == '新三板' && list.plate.length !== 1" class="xiegang">/</i>
          </template>
        </p>
        <p v-if="sort == 'collect'" class="delCollect" @click.stop="delCollect(list.collectId, list.type, list)">
          <i class="iconfont web-shanchu"></i>
          删除
        </p>
        <p class="showDescribe" v-if="sort !== 'ruleDetail' && list.isDescribe == false">
          <i id="showDescribe">显示摘要</i>
          <i id="showDescribe2">
            <i @click.stop="showDescribe(index)">单条</i> | <i @click.stop="showAll('show')">全部</i>
          </i>
        </p>
        <p class="showDescribe" v-else-if="sort !== 'ruleDetail' && list.isDescribe == true"
           @click.stop="showDescribe(index)">
          <i id="hideDescribe">隐藏摘要</i>
          <i id="hideDescribe2">
            <i @click.stop="showDescribe(index)">单条</i> | <i @click.stop="showAll('hide')">全部</i>
          </i>
        </p>
      </div>
    </li>
    <li id="noInfo" v-show="noInfo">
      <img :src="$image.prompt.noInfo" alt="" class="defaultImg">
      <template v-if="inputCode == '本公司' && userId && !companyCode">
        <p>暂无内容,你还未设置公司信息。</p>
        <el-button @click="$router.push('/manage/person')">去设置</el-button>
      </template>
      <template v-else-if="inputCode == '关注公司'">
        <p>暂无内容</p>
        <el-button @click="$router.push('/follow/companies')">关注公司</el-button>
      </template>
      <template v-else-if="inputCode == '可比公司'">
        <p>暂无内容</p>
        <el-button @click="$router.push('/admin/application/compare')" v-if="isRootUser">设置可比公司</el-button>
        <p v-else style="top:300px;">等待管理员设置同行业</p>
      </template>
      <template v-else>
        <p v-if="sort !== 'reportDetail'">搜索不到相关内容，试试别的关键字或使用高级搜索吧！</p>
        <p v-else-if="sort == 'reportDetail'">搜索不到相关内容，试试别的关键字吧!</p>
        <el-button @click="seniorButton" v-if="sort !== 'reportDetail'">高级搜索</el-button>
      </template>
    </li><!---->
    <li class="noShare" v-show="cancelShare">
      <img :src="$image.prompt.shareClose" alt="" class="defaultImg">
      <p>该分享链接已失效！</p>
    </li>
    <div id="loading" v-show="loading">
      <img :src="$image.prompt.loading" alt="">
    </div>
  </ul>
</template>
<script>
  export default {
    name: 'list',
    data () {
      return {
        deScribeText: '查看摘要',
        isRootUser: false,
        userId: '',
        companyCode: ''
      }
    },
    props: {
      info: '',
      sort: '',
      isDescribe: true,
      loading: {
        type: Boolean,
        default: false
      },
      noInfo: {
        type: Boolean,
        default: false
      },
      cancelShare: {
        type: Boolean,
        default: false
      },
      inputCode: '' // 股票代码搜索关键词（本公司，关注公司，同比公司，其它为空）
    },
    filters: {
      simplify: function (value) {
        if (value == '沪市主板') {
          value = '沪主'
        } else if (value == '深市主板') {
          value = '深主'
        } else if (value == '深市中小板') {
          value = '中小板'
        } else if (value == '深市创业板') {
          value = '创业板'
        }
        if (!value) return ''
        return value
      },
      delHtml: function (val) {
        var text = '<p>' + val.replace(/<[^>]+>/g, '') + '</p>' // 去掉所有的html标记
        return text
      }
    },
    watch: {
      'info': function (val) {
//        this.$nextTick(() => {
//          var info = document.getElementsByClassName('info')
//          console.log('val == ', val.length, info.length)
//        })
//        for (var i = 0; i < val.length; i++) {
//          val[i].describe = '<p>' + val[i].describe.replace(/<[^>]+>/g, '<span>') + '</p>'
//        }
      }
    },
    created () {
      this.rootUser()
    },
    methods: {
      rootUser () {
        this.userId = this.$cookie.get('userId')
        let isTrue = false
        if (this.userId) {
          this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
          this.companyCode = this.userInfo.companyCode
          if (this.userInfo.companyId) {
            if (this.userInfo.rootUserId == this.userId) {
              isTrue = true
            }
          }
        }
        this.isRootUser = isTrue
      },
      showAll (sort) {
        if (sort == 'show') {
          for (var i = 0; i < this.info.length; i++) {
            this.info[i].isDescribe = true
          }
        } else {
          for (var j = 0; j < this.info.length; j++) {
            this.info[j].isDescribe = false
          }
        }
      },
      showDescribe (index) {
        if (!this.info[index].isDescribe) {
          this.info[index].isDescribe = true
        } else {
          this.info[index].isDescribe = false
        }
      },
      delCollect (id, sort, list) {
        this.$emit('delCollect', id, sort, list)
      },
      linkTo (index, sort, type) {
        if (sort == 'collect' || sort == 'collect_dingyue') {
          this.$emit('linkTo', index, type)
        } else {
          let havenote = this.$route.query.havenote
          if (havenote == 1) {
            havenote = '&havenote=1'
          } else {
            havenote = ''
          }
          var url = sort + '?id=' + index + havenote
          this.$common.openWindow(url)
        }
      },
      seniorButton () {
        this.$emit('seniorButton')
      }
    },
    mounted () {

    }
  }
</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    opacity: 0
  }
</style>
<style lang="scss" scoped>
  ul {
    position: relative;
    min-height: 550px;
    li {
      width: 100%;
      height: auto;
      background: #fff;
      border: 1px solid #e3e3e3;
      box-sizing: border-box;
      margin-bottom: 15px;
      border-radius: 4px;
      padding: 0px 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
      div {
        border-bottom: 1px solid #e3e3e3;
        box-sizing: border-box;
      }
      div:last-child {
        border-bottom: none
      }
      .title {
        width: 100%;
        height: auto;
        font-size: 17px;
        color: #303133;
        word-wrap: break-word;
        padding: 8px 0;
        position: relative;
        .newLogo {
          width: 33px;
          height: 16px;
          font-weight: normal;
          line-height: 1;
          padding: 0;
          font-size: 13px;
          display: inline-block;
          // color: #ffb148;
          background: #ffb148;
          color: #fff;
          text-align: center;
          border: 1px solid #ffb148;
          border-radius: 2px;
          box-sizing: border-box;
        }
        .isDescribe {
          color: #ffb148;
          position: absolute;
          right: 0;
          bottom: 0;
        }
        span:first-child {
          &:hover {
            color: #ffb148;
          }
        }
      }
      .borderNone {
        /*border-bottom: 0 !important;*/
        /*padding-bottom: 0;*/
      }

      .effect {
        color: rgb(141, 141, 141)
      }
      .describe {
        font-size: 13px;
        color: #8d8d8d;
        padding: 10px 0;
        box-sizing: border-box;
        height: auto;
        p {
          width: 100%;
          height: auto;
          max-height: 53px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3; // （行数）
          -webkit-box-orient: vertical;
          line-height: 1.2;
        }
        *, h1{
          width: 100%;
          height: auto;font-size: 13px!important;
          max-height: 53px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          font-weight: normal!important;
          -webkit-line-clamp: 3; // （行数）
          -webkit-box-orient: vertical;
        }
      }
      .info {
        padding: 5px 0 8px 0;
        p {
          display: inline-block;
          color: #8d8d8d;
          font-size: 12px;
          vertical-align: middle;
          span {
            width: auto;
            height: 18px;
            border-radius: 10px;
            line-height: 18px;
            display: inline-block;
            text-align: center;
            color: #fff;
            padding: 0 6px 0 7px;
          }
        }
        .delCollect {
          color: #8d8d8d;
          float: right;
          font-size: 12px;
          &:hover {
            color: #ffb148;
          }
        }
        .showDescribe {
          // margin-right: 15px;
          color: #8d8d8d;
          float: right;
          font-size: 12px;
        }
        .plate {
          margin-right: 8px;
          span, i {
            color: #fff;
            color: #8d8d8d;
            font-size: 12px;
          }
          i {
            border-radius: 20px;
            padding: 2px 4px;
          }
          .xiegang {
            color: #e3e3e3;
            &:last-child {
              display: none;
            }
          }
        }
        .split {
          width: 1px;
          height: 12px;
          background: #e3e3e3;
          vertical-align: middle;
          margin: 0 8px;
        }
      }
      #showDescribe2 {
        display: none;
      }
      #showDescribe {
        display: block;
      }
      #hideDescribe {
        display: block;
      }
      #hideDescribe2 {
        display: none;
      }
      &:hover {
        -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);
        -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);
        box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);
        #showDescribe {
          display: none;
        }
        #showDescribe2 {
          display: block;
          i {
            &:hover {
              color: #ffb148;
            }
          }
        }
        #hideDescribe {
          display: none;
        }
        #hideDescribe2 {
          display: block;
          i {
            &:hover {
              color: #ffb148;
            }
          }
        }
      }
    }
    #noInfo {
      width: 100%;
      height: 550px;
      text-align: center;
      font-size: 30px;
      color: #ffb148;
      border: 0;
      box-shadow: none;
      position: relative;
      img {
        margin: auto;
        margin-top: 140px;
        width: auto;
        display: block;
        height: auto;
      }
      p {
        margin: auto;
        margin-top: 20px;
        width: auto;
        line-height: 1;
        height: auto;
        font-size: 14px;
        color: #f4b55c;
      }
      .el-button {
        margin-top: 25px;
        background: #ffb148;
        color: #fff;
        /*text-decoration: underline;*/
        font-size: 14px;
        border: 0;
      }
    }
    #noInfo:hover {
      background: #fff;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    li:last-child {
      margin-bottom: 0;
    }
    #loading {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 22;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      text-align: center;
      color: #FFAC38;
      font-size: 50px;
      text-align: center;
      .el-icon-loading, img {
        margin: 27% auto;
      }
      img {
        width: 50px;
      }
    }
  }
</style>
