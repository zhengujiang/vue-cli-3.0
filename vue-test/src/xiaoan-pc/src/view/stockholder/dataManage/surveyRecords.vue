<template>
  <div id="surveyRecords">
    <div class="title">
      <p class="returnDatabase" @click="goBack"><i class="el-icon-arrow-left"></i> 返回投资者数据库管理</p>
    </div>
    <div>
      <el-row :gutter="15">
        <el-col :span="18" v-loading='loading'>
          <div class="vux-1px-b"></div>
          <div v-if="this.investorResearchRecord.length > 0" class="contentArea">
            <div class="details" v-for="(list , index) in investorResearchRecord">
              <span v-if="list.show" class="detailsTitle" @click.stop="showDetail(list,index)">{{list.title}}</span>
              <span v-else class="detailsTitle1" @click.stop="showDetail(list,index)">{{list.title}}</span>
              <span class="option">
                <i @click="edit(list)">编辑</i> | <i @click="downloadInvestorResearchRecord(list)">下载</i> | <i @click="deleteInvestorResearchRecord(list)">删除</i> |
                <span class="showDescribe" v-if="!list.show">
                  <i id="showDescribe">显示摘要</i>
                  <i id="showDescribe2">
                    <i @click.stop="showDetail(list,index)">单条</i> | <i @click.stop="showAll('show')">全部</i>
                  </i>
                </span>
                <span class="showDescribe" v-else-if="list.show">
                  <i id="hideDescribe">隐藏摘要</i>
                  <i id="hideDescribe2">
                    <i @click.stop="showDetail(list,index)">单条</i> | <i @click.stop="showAll('hide')">全部</i>
                  </i>
                </span>
              </span>
              <div class="describe" v-if="list.show">
                {{list.describe}}
                <!--记录主题：{{list.theme}}；
                活动时间：{{list.activiteTime}}；
                活动地址：{{list.activiteAddressProvince + list.activiteAddressCity + list.activiteAddressTown + list.activiteAddressStreet}}；
                参与人：{{list.investors}}；
                会议纪要 ：{{list.meetingMinutes || '无'}}-->
              </div>
            </div>
          </div>
          <div v-else class="noinfo">
            <v-noInfo altText='检索不到内容'></v-noInfo>
          </div>
          <div class="footer">
          <div class="pagination" v-show="this.investorResearchRecord.length > 0">
            <div class="block" style="width: 100%;text-align: left">
              <el-pagination
                @current-change="selectPage"
                layout="prev, pager, next"
                :current-page="pageNum" :page-size="pageSize"
                :total="total">
              </el-pagination>
            </div>
            <div class="button-group">
              <el-radio-group size="mini" v-model="displayMode" @change="radioChange">
                <el-radio-button :label="30">30条</el-radio-button>
                <el-radio-button :label="50">50条</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        </el-col>
        <el-col :span="6">
          <v-adv :pageName="'股东名册'" style="margin-bottom:16px;"></v-adv>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import page from '@/components/customPage.vue'
  export default {
    data() {
      return {
        userId: '',
        investorResearchRecord: [],
        pageNum: 1, // 默认页码
        pageSize: 30,
        total: 50, // 总页数
        displayMode: "30",
        displayState: false,
        loading: false
      }
    },
    // 使用其它组件
    components: {
      'v-page': page
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getInvestorResearchRecord()
    },
    mounted() {
    },
    // 方法
    methods: {
      getInto (item, index) {
        console.log("进入");
        console.log(11);
        console.log(item);
        this.displayState = true;
        // this.$set(this.investorResearchRecord[index], 'show', !item.show)
        // this.investorResearchRecord = Object.assign([], this.investorResearchRecord)
      },
      getOut (item, index) {
        this.displayState = false;
      },
      // 选择页数
      selectPage(i) {
        this.pageNum = i
        // this.loading = true
        this.getInvestorResearchRecord()
      },
      radioChange() {
        this.pageNum = 1
        this.pageSize = parseInt(this.displayMode)
        this.getInvestorResearchRecord()
      },
      goBack() {
        this.$router.push('/stockholder/investorManage');
      },
      showDetail(item, index) {
        this.$set(this.investorResearchRecord[index], 'show', !item.show)
        this.investorResearchRecord = Object.assign([], this.investorResearchRecord)
      },
      showAll(item) {
        if (item == 'show') {
          for (let index = 0; index < this.investorResearchRecord.length; index++) {
            this.investorResearchRecord[index].show = true;
          }
          this.investorResearchRecord = Object.assign([], this.investorResearchRecord)
        } else {
          for (let index = 0; index < this.investorResearchRecord.length; index++) {
            this.investorResearchRecord[index].show = false;
          }
          this.investorResearchRecord = Object.assign([], this.investorResearchRecord)
        }
      },
      // 查询投资调研记录
      getInvestorResearchRecord () {
        this.loading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getInvestorResearchRecord,
          params: {
            userId: this.userId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.loading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.investorResearchRecord = res.data.returnObject
            this.total = res.data.total
            this.investorResearchRecord.forEach((item, index) => {
              item.createTime = this.$common.transTime(item.createTime)[1]
              item.activiteTime = this.$common.transTime(item.activiteTime)[4]
              if (index == 0) {
                item.show = true
              } else {
                item.show = false
              }
            })
          } else {
            this.investorResearchRecord = [];
          }
        })
      },
      // 下载投资调研记录
      downloadInvestorResearchRecord (item) {
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.downloadInvestorResearchRecord,
          params: {
            id: item.id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            location.href = res.data.returnObject
          }
        })
      },
      // 删除投资调研记录
      deleteInvestorResearchRecord (item) {
        console.log(item);
        this.$confirm('您将删除 ' + item.title + '，是否删除?', '删除', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.gxfApi.deleteInvestorResearchRecord,
            params: {
              userId: this.userId,
              id: item.id
            }
          }).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'})
              this.getInvestorResearchRecord()
            }
          })
        }).catch(() => {
        })
      },
      // 修改投资调研记录
      edit(item) {
        this.$router.push({
          path: '/stockholder/relationshipResearch', query: {
            id: item.id
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #surveyRecords {
    min-height: 550px;
    .title {
      width: 100%;
      .returnDatabase {
        font-size:14px;
        font-weight:500;
        color:rgba(174,174,174,1);
        line-height:20px;
        margin-bottom: 16px;
        // text-align: left;
      }
      .returnDatabase:hover {
        cursor: pointer;
      }
    }
    .contentArea {
      min-height: 450px;
      .details {
        border-bottom: 1px solid #E3E3E3;
        padding: 10px 0px;
        cursor: pointer;
        .detailsTitle {
          font-size:14px;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:18px;
        }
        .detailsTitle1 {
          font-size:14px;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height:18px;
        }
        .describe {
          width: 100%;
          max-height: 34px;
          margin-top: 5px;
          overflow : hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
        .option, .describe {
          font-size:12px;
          font-weight:400;
          color:rgba(174,174,174,1);
          line-height:17px;
        }
        .option {
          float: right;
        }
        #showDescribe2, #hideDescribe2 {
          display: none;
        }
        &:hover {
          #showDescribe2, #hideDescribe2 {
            display: inline-block;
          }
          #showDescribe, #hideDescribe {
            display: none;
          }
        }
      }
    }
    .footer {
      position: relative;
      border: 1px solid #FFFFFF;
      .pagination {
        width: 400px;
        height: auto;
        margin: 26px auto;
        margin-left: 0;
        .btn-prev, .btn-next, li {
          margin-right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid #e3e3e3;
          box-sizing: border-box;
          padding: 0;
          min-width: 30px;
          .el-icon {
            font-size: 14px;
          }
        }
        li:last-child {
          margin-right: 0;
        }
        .el-pager {
          li {
            font-size: 12px;
            color: #8d8d8d;
            font-weight: 400;
          }
          li.active {
            color: #fff;
            background: #ffb148;
          }
        }
        .btn-next {
          margin-left: 10px;
          color: #b4bccc;
        }
        .btn-prev {
          color: #b4bccc;
        }
        .el-pagination {
          padding-left: 0;
        }
      }
      .button-group {
        position: absolute;
        right: 0;
        bottom: 29px;
        .el-radio-button__inner {
          padding: 5px 9px 5px 9px;
          line-height: 17px;
        }
      }
    }
  }
</style>

