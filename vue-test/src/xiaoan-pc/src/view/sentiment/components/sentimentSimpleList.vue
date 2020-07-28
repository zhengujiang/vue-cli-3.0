<template>
  <div id="sentimentSimpleList">
    <div class="el-card company-card-nopadding">
      <div class="company-card-header">
        <div class="company-card-title">{{listTitle}}</div>
      </div>
      <div class="company-card-body">
        <div class="card-fold-list">
          <div class="fold-list-header">
            <!--排序-->
            <div class="sort">
              <div class="el-dropdown-link" v-for="(list,index) in sort.sortList" :key="index"
                   @click="selectSort(index)">
                                <span v-show="list.isShow">{{ list.name }}
                                    <i v-if="list.mode== ''" class="iconfont web-sort"></i>
                                    <i v-else-if="list.mode== 'desc'" class="iconfont web-sort-desc"></i>
                                    <i v-else-if="list.mode== 'asc'" class="iconfont web-sort-asc"></i>
                                </span>
              </div>
            </div>
            <!--翻页-->
            <span class="list-header-page">
              <v-page v-show="!noInfo" :flip="page.flip" :total="page.total" v-on:addition="addition"
                      v-on:subtraction="subtraction"></v-page>
            </span>
          </div>
          <ul>
            <!--列表-->
            <li v-for="(item,index) in listInfo" :key="index" :class="{active: item.isDescribe}">
              <div class="list-title-block list-title-num">{{item.heat}}</div>

              <div class="list-content-block list-content-sm">
                <div class="fold-list-title"><a class="a-link" :href="item.url" target="_blank">{{item.title}}</a></div>
                <div class="fold-list-subtitle"><a class="a-link" :href="item.url" target="_blank">{{item.summary}}</a>
                </div>
                <div class="fold-list-tips">
                  <span class="list-tips-left">{{item.media}}<a @click="openTimeAsisi(item.title)"><span>{{item.reprinted}}</span>条相似</a></span>
                  <span class="list-tips-right">{{$common.transTime(item.dateTime)[0]}}&nbsp;&nbsp;|&nbsp;&nbsp;
                                        <span v-if="item.isDescribe == false" class="showDescribe">
                                            <i class="showDescribeText">显示摘要</i>
                                            <i class="showDescribeNum">
                                                <i @click.stop="showDescribe(index)">单条</i> | <i
                                              @click.stop="showAll('show')">全部</i>
                                            </i>
                                        </span>
                                        <span v-else-if="item.isDescribe == true" class="showDescribe"
                                              @click.stop="showDescribe(index)">
                                            <i class="hideDescribeText">隐藏摘要</i>
                                            <i class="hideDescribeNum">
                                                <i @click.stop="showDescribe(index)">单条</i> | <i
                                              @click.stop="showAll('hide')">全部</i>
                                            </i>
                                        </span>
                                    </span>
                </div>
              </div>
            </li>
            <div v-show="!noInfo" class="list-note-tips">* 标题相似的舆情已去重显示</div>
          </ul>
          <no-info v-show="noInfo"></no-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VPage from '@/components/customPage.vue'
  import NoInfo from "../../../components/noInfo.vue";

  export default {
    name: "sentimentSimpleList",
    components: {
      NoInfo,
      VPage
    },
    props: {
      page: {
        flip: '',
        total: ''
      },
      sort: {
        sortType: '',
        sortMode: '',
        sortList: []
      },
      listTitle: '',
      listInfo: {
        type: [Array],
        default: []
      },
      noInfo: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    created() {
    },
    watch: {
      page: {
        handler(newVal, oldVal) {
          var page = newVal.flip
          this.$emit('changePage', page)
        },
        deep: true
      },
      sort: {
        handler(newVal, oldVal) {
          var type = newVal.sortType
          var mode = newVal.sortMode
          this.$emit('changeSort', type, mode)
        },
        deep: true
      }
    },
    methods: {
      openTimeAsisi(data) {
        console.log(data)
        this.$emit('openTimeAsise', data);
      },
      // 选择排序
      selectSort(index) {
        if (this.sort.sortList[index].mode == '') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortList[index].mode = 'desc'
          this.sort.sortType = this.sort.sortList[index].name
        } else if (this.sort.sortList[index].mode == 'desc') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortList[index].mode = 'asc'
          this.sort.sortType = this.sort.sortList[index].name
        } else if (this.sort.sortList[index].mode == 'asc') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortType = ''
        }

        this.sort.sortMode = this.sort.sortList[index].mode
        // console.log('排序方法', this.sortType, this.sortMode)
      },
      showAll(sort) {
        if (sort == 'show') {
          for (var i = 0; i < this.listInfo.length; i++) {
            this.listInfo[i].isDescribe = true
          }
        } else {
          for (var j = 0; j < this.listInfo.length; j++) {
            this.listInfo[j].isDescribe = false
          }
        }
      },
      showDescribe(index) {
        if (!this.listInfo[index].isDescribe) {
          this.listInfo[index].isDescribe = true
        } else {
          this.listInfo[index].isDescribe = false
        }
      },
      // 页数加一
      addition() {
        if (this.page.flip < this.page.total) {
          this.page.flip += 1
        }
      },
      // 页数减一
      subtraction() {
        if (this.page.flip > 1) {
          this.page.flip -= 1
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-header {
    width: 100%;
    height: 150px;
    color: #fff;
    font-size: 16px;
    .company-title {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 64px;
      margin: 43px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title-only {
      display: table-cell;
      vertical-align: middle;
      float: left;
      height: 42px;
      margin: 54px 0;
      h2 {
        margin: 0;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .company-title p {
      margin: 0;
      font-size: 16px;
      line-height: 22px;
    }
  }
  #company-body {
    padding: 10px 0;
    overflow: hidden;
    .el-row {
      margin: 0 -10px;
    }

    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
    }
    .company-card-header {
      /*border-bottom: 1px solid #E3E3E3;*/
      padding-bottom: 8px;
      overflow: hidden;
    }
    .company-card-nopadding .company-card-header {
      padding: 0 15px 10px;
    }
    .company-card-header {
      .company-card-title {
        float: left;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-weight: 800;
        color: #323232;
      }
      .company-card-link {
        float: right;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .company-card-select {
        float: right;
        height: 28px;
      }
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 10px;
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .company-card-body .card-fold-list {
    ul {
      padding: 0 15px;
    }
    .fold-list-header {
      background-color: #F8F8F8;
      margin-top: 0;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #8D8D8D;
      padding: 0 15px;
    }
  }
  .card-fold-list {
    .fold-list-header .list-header-page {
      float: right;
      /*margin-right: 12px;*/
      span {
        color: #545454;
        margin: 0 6px;
        font-size: 14px;
        position: relative;
        top: 1px;
      }
    }
    li {
      width: 100%;
      overflow: hidden;
      border-bottom: 1px solid #D8D8D8;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        .list-title-num, .list-title-sm, .fold-list-title a {
          color: #FFB148;
        }
      }
    }
    .list-title-block {
      float: left;
      display: block;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #323232;
    }
    .list-content-block {
      float: left;
      display: inline-block;
      line-height: 40px;
    }
    .list-title-sm {
      width: 80px;
    }
    .list-title-num {
      width: 84px;
      text-align: right;
      padding-right: 16px;
    }
    .list-content-sm {
      width: calc(100% - 85px);
      padding-right: 180px;
    }
    .fold-list-title {
      float: left;
      width: 100%;
      height: 40px;
      line-height: 40px;
      /*padding-right: 15px;*/
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      font-size: 14px;
      color: #323232;
      .a-link {
        color: #323232;
        display: inline-block;
        height: 100%;
        width: 100%;
      }

    }
    .fold-list-subtitle {
      display: none;
      /*float: left;*/
      width: 100%;
      padding-top: 4px;
      font-size: 12px;
      text-overflow: ellipsis;
      line-height: 16px;
      max-height: 34px;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .fold-list-tips {
      position: relative;
      padding-top: 7px;
      color: #AEAEAE;
      font-size: 12px;
      a {
        font-size: 14px;
        color: #FFB148;
        margin-left: 5px;
        text-decoration: underline;
      }
      .list-tips-left {
        display: none;
      }
      .list-tips-right {
        display: inline-block;
        line-height: 40px;
        float: right;
        position: absolute;
        right: -180px;
        top: 0px;
        a {
          text-decoration: none;
          font-size: 12px;
          color: #AEAEAE;
          margin-left: 0;
        }
      }
    }
    .list-content-highlight {
      color: #FF7844;
    }
    li.active {
      overflow: hidden;
      padding: 10px 0;
      .list-title-block {
        height: 20px;
        line-height: 20px;
      }
      .list-content-block {
        height: auto;
        line-height: 20px;
      }
      .list-content-sm {
        padding-right: 0;
      }
      .fold-list-title {
        font-weight: 800;
        height: 20px;
        line-height: 20px;
        /*margin-bottom: 5px;*/
        color: #323232;
      }
      .list-content-lg {
        padding-right: 0;
      }
      .fold-list-subtitle, .fold-list-tips {
        display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
        display: -ms-flexbox; /* IE 10 */
        display: -moz-flex; /* Firefox 18+ */
        display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
        display: -moz-box; /* Firefox 17- */
        display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
      }
      .fold-list-tips {
        height: 25px;
      }
      .list-tips-left {
        display: inline-block;
      }
      .list-tips-right {
        line-height: 20px;
        right: 0;
        top: 6px;
      }
    }
    .list-note-tips {
      font-size: 12px;
      color: #8D8D8D;
      padding-left: 12px;
      padding-top: 8px;
    }

  }
  .sort {
    div {
      display: inline-block;
    }
    .el-dropdown-link {
      margin-right: 38px;
      cursor: pointer;
      float: left;
    }
    div i {
      display: inline-block;
      color: #a6a6a6;
      margin-left: 8px;
      font-size: 8px;
    }
  }
  .icon-sort {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-desc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort-desc.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-asc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort-asc.svg) no-repeat center;
    background-size: 100%;
  }
  .showDescribe {
    /*margin-right: 15px;*/
    float: right;
    font-size: 12px;
  }
  .showDescribeText, .hideDescribeText {
    display: block;
  }
  .showDescribe:hover {
    .showDescribeNum, .hideDescribeNum {
      display: block;
    }
  }
  .showDescribeNum, .hideDescribeNum {
    display: none;
  }
  .showDescribe:hover {
    .showDescribeText, .hideDescribeText {
      display: none;
    }
  }
  .showDescribeNum i:hover, #hideDescribeNum i:hover {
    color: #ffb148;
  }
</style>
