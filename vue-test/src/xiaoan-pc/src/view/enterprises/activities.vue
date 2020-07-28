<template>
  <div id="charge-activities" class="charge-activities">
    <div class="header vxa-image-bg-affiche">
      <div class="content">
        <!--<div class="title">监管动态</div>-->
        <v-headerTitle :title="'监管动态'"></v-headerTitle>
        <div class="tabs">
          <el-card class="box-card-header" shadow="never" body-style="padding:0">
            <ul class="box-tabs">
              <li v-for="(list , index) in bar" :class="{active: list.active}" @click="handleClick(index)">
                <span class="text">{{list.title}}<span class="bar"></span></span>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
    <div class="content" v-if="superviseDynamicList.length>0">
      <div class="box-card-content">
        <!-- <el-card class="box-card-item" v-for="(item,index) in superviseDynamicList" :key="index" shadow="never" body-style="padding:10px 30px">
          <p class="p_title" @click="goUrl(item.sourceUrl)">{{item.title}}</p>
          <p class="about"><span>{{item.source}}</span> | <span>{{$common.transTime(item.releaseDate)[0]}}</span></p>
        </el-card> -->
        <div class="vxa-flax-box box-card-item align vux-1px-b" v-for="(item,index) in superviseDynamicList" :key="index">
          <div class="title-default">
            <p class="row title" v-if="activeName != 4" @click="goUrl(item.sourceUrl)">{{item.title}}</p>
            <p class="row title" v-else @click="goUrl(item.href)">{{item.title}}</p>
            <div class="row right">
              <span class="about"><span v-if="activeName != 4">{{item.source}} | </span> <span>{{$common.transTime(item.releaseDate)[0]}}</span></span>
            </div>
          </div>

          <!--注释-->
          <!--<div class="col">-->
            <!--<span v-if="activeName != 4" class="p_title" @click="goUrl(item.sourceUrl)">{{item.title}}</span>-->
            <!--<span v-else class="p_title" @click="goUrl(item.href)">{{item.title}}</span>-->
          <!--</div>-->
          <!--<div class="col t-right">-->
            <!--<span class="about"><span v-if="activeName != 4">{{item.source}} | </span> <span>{{$common.transTime(item.releaseDate)[0]}}</span></span>-->
          <!--</div>-->

        </div>
      </div>
      <!-- <div class="foot-activities">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageTotal" :current-page="pageNum" @current-change="selectPage">
        </el-pagination>
      </div> -->
      <div id="vxa-foot-pagination">
        <div class="row block">
          <el-pagination @current-change="selectPage" layout="prev, pager, next"
                          :page-size="pageSize" :current-page="pageNum" :total="pageTotal">
          </el-pagination>
        </div>
        <div class="row">
          <el-radio-group size="mini" v-model="pageSize" @change="handlePageChange">
            <el-radio-button :label="30">30条</el-radio-button>
            <el-radio-button :label="50">50条</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <v-noInfo v-else></v-noInfo>
  </div>
</template>

<script>
  export default {
    name: "activities",
    data() {
      return {
        activeName: 'first',
        bar: [
          {title: '最新监管动态', name: '全部', active: true},
          {title: '证监会监管动态', name: '证监会', active: false},
          {title: '上交所监管动态', name: '上交所', active: false},
          {title: '深交所监管动态', name: '深交所', active: false},
          {title: '科创板监管动态', name: '科创板', active: false}
        ],
        superviseDynamicList: [],
        valueJianguan: '',
        pageNum: 1,
        pageTotal: 10,
        pageSize: 30,
        startTime: '',
        endTime: ''
      }
    },
    created() {
      // this.superviseDynamic()
      if (this.$route.query.starttime) {
        this.startTime = this.$common.getTimestampms(this.$route.query.starttime + ' 00:00:00')
      }
      if (this.$route.query.endtime) {
        this.endTime = this.$common.getTimestampms(this.$route.query.endtime + ' 23:59:59')
      }
      let index = this.$route.query.index
      if (index || index == 0) {
        this.handleClick(index)
      } else {
        this.handleClick(0)
      }

    },
    watch: {
      '$route': function () {
        let index = this.$route.query.index
        this.activeName = this.$route.query.index
        if (index || index == 0) {
          this.handleClick(index)
        }
      }
    },
    methods: {
      handleClick(index) {
        this.bar.forEach((item) => {
          item.active = false;
        })
        this.bar[index].active = true;
        this.valueJianguan = this.bar[index].name
        this.activeName = this.$route.query.index
        this.pageNum = 1
        index == 4 ? this.getStibSupervise() : this.superviseDynamic()
      },
      handlePageChange(val) {
        this.$common.returnTop()
        this.pageSize = val;
        this.activeName == 4 ? this.getStibSupervise() : this.superviseDynamic()
      },
      selectPage(index) {
        this.$common.returnTop()
        this.pageNum = index
        this.activeName == 4 ? this.getStibSupervise() : this.superviseDynamic()
      },
      // 监管动态
      superviseDynamic () {
        let stype = this.valueJianguan == '全部' ? '' : this.valueJianguan
        this.$http({
          method: 'GET',
          url: this.$api.supervise.superviseDynamic,
          params: {
            type: stype,
            pageNo: this.pageNum,
            pageSize: this.pageSize,
            releaseStart: this.startTime,
            releaseEnd: this.endTime
          }
        }).then((res) => {
          console.log("获取监管案例----", res.data)
          if (res.data.returnCode == 200) {
            this.superviseDynamicList = res.data.returnObject.superviseDynamicList
            this.pageTotal = res.data.returnObject.total
          }
        })
      },
      // 科创板监管动态
      getStibSupervise() {
        let params = {
          pageNo: this.pageNum,
          pageSize: this.pageSize
        }
        this.$axios.kechuangban.getStibSupervise(params).then(res => {
          if (res.data.returnCode == '200') {
            this.superviseDynamicList = res.data.returnObject.superviseList;
            this.pageTotal = res.data.returnObject.total
          }
        }).catch(err => {

        })
      },
      // go  link
      goUrl(url) {
        this.$common.openWindow(url)
      }
    }
  }
</script>

<style lang="scss">
  #charge-activities {
    min-height: 800px;
    .header {
      background-color: #f0f1f5;
      height: 120px;
      position: relative;
      background-size: cover;
      overflow: hidden;
      .title {
        text-align: center;
        color: #ffb148;
        padding: 18px 0;
        font-size: 17px;
      }
      .tabs {
        .box-card-header {
          border: 0;
          .box-tabs {
            display: flex;
            height: 45px;
            align-items: center;
            li {
              height: 100%;
              flex: 1;
              text-align: center;
              line-height: 45px;
              position: relative;
              &:last-child {
                flex: 0 0 16.5%;
                text-align: right;
                padding-right: 20px;
              }
              &:first-child {
                text-align: left;
                flex: 0 0 16.5%;
                padding-left: 20px;
              }
              &.active {
                color: #ffb148;
                .bar {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  height: 2px;
                  width: 98%;
                  background-color: #ffb148;
                  margin: 0 auto;
                }
              }
              .text {
                height: 100%;
                position: relative;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .box-card-content {
      padding-top: 20px;
      .box-card-item {
        // margin-bottom: 15px;
        color: #323232;
        .about {
          padding-top: 3px;
          font-size: 13px;
          color: #8d8d8d;
        }
      }
      .title-default {
        width: 100%;
        padding: 10px 0;
        align-items: center;
        display: flex;
        .row {
          flex: 1;
          &.title {
            flex: 0 0 80%;
            font-size: 16px;
            color: rgba(50, 50, 50, 1);
            &.flex1 {
              flex: 1;
            }
          }
          &.right {
            text-align: right;
            font-size: 12px;
            color: rgba(174, 174, 174, 1);
            transition: all .3s;
            .set-break {
            }
            .set {
              display: none;
            }
            &:hover {
              .set-break {
                display: none;
              }
              .set {
                display: inline-block;
                span:hover {
                  color: #ffb148;
                }
              }
            }
          }
        }
        .effect {
          color: rgb(141, 141, 141)
        }
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
      }
    }
    .foot-activities {
      padding: 20px;
      text-align: center;
    }
    .p_title {
      cursor: pointer;
      width: 80%;
      height: 40px;
      line-height: 40px;
      max-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      /*display: -webkit-box;*/
      /*-webkit-box-orient: vertical;*/
      /*-webkit-line-clamp: 1;*/
      /*font-size: 14px;*/
      color: #323232;
      /*word-wrap: break-word;*/
      /*padding: 5px 0 5px 0;*/
      position: relative;
      &:hover {
        color: #ffb148;
      }
    }
  }
</style>
