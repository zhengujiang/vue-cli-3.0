<template>
  <div id="institutionRelation">
    <el-row :gutter="20">
      <el-col :span="3" v-loading="dataLoading">
        <div class="nav">
          <p @click="getData('shareholder', 30, 1)" :class="{'active': type == 'shareholder'}"><img
            :src="$image.stockholder.holder" alt=""><span>股东</span><i>{{tableList['shareholder'].length}}</i></p>
          <p @click="getData('member', 30, 1)" :class="{'active': type == 'member'}"><img
            :src="$image.stockholder.member" alt=""><span>成员</span><i>{{tableList['member'].length}}</i></p>
          <p @click="getData('invest', 30, 1)" :class="{'active': type == 'invest'}"><img
            :src="$image.stockholder.investment" alt=""><span>投资</span><i>{{tableList['invest'].length}}</i></p>
        </div>
      </el-col>
      <el-col :span="21" v-loading="dataLoading">
        <el-table key="shreholder" size="mini" stripe v-if="type == 'shareholder'" :data="shareholderList"
                  style="width: 100%">
          <el-table-column show-overflow-tooltip align="center" prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.name">{{scope.row.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="股东类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type">{{scope.row.type}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="num" label="认缴额(万)">
            <template slot-scope="scope">
              <span v-if="scope.row.num">{{scope.row.num}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="ratio" label="持股比例(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.ratio">{{removeRatio(scope.row.ratio)}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="time" label="成立时间">
            <template slot-scope="scope">
              <span v-if="scope.row.time">{{scope.row.time}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="lawsuit" label="涉诉">
            <template slot-scope="scope">
              <span v-if="scope.row.lawsuit">{{scope.row.lawsuit}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="business" label="经营">
            <template slot-scope="scope">
              <span v-if="scope.row.business">{{scope.row.business}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="asset" label="资产/交易">
            <template slot-scope="scope">
              <span v-if="scope.row.asset">{{scope.row.asset}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table key="member" size="mini" stripe v-if="type == 'member'" :data="memberList" style="width: 100%">
          <el-table-column show-overflow-tooltip align="center" prop="name" label="名称" width="200">\</el-table-column>
          <el-table-column class-name="memebr" align="center" prop="position" label="职务">
            <template slot-scope="scope">
              <span v-if="scope.row.position">{{scope.row.position}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table key="invest" size="mini" v-if="type == 'invest'" :data="investList" style="width: 100%">
          <el-table-column show-overflow-tooltip align="center" prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.name">{{scope.row.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="faren" width="150" label="法定代表人">
            <template slot-scope="scope">
              <span v-if="scope.row.faren">{{scope.row.faren}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="ratio" label="持股比例(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.ratio">{{removeRatio(scope.row.ratio)}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="capital" width="150" label="注册资本(万元)">
            <template slot-scope="scope">
              <span v-if="scope.row.capital">{{scope.row.capital.replace('万元', '')}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="time" label="成立时间">
            <template slot-scope="scope">
              <span v-if="scope.row.time">{{scope.row.time}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="lawsuit" label="涉诉">
            <template slot-scope="scope">
              <span v-if="scope.row.lawsuit">{{scope.row.lawsuit}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="business" label="经营">
            <template slot-scope="scope">
              <span v-if="scope.row.business">{{scope.row.business}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="right" prop="asset" label="资产/交易">
            <template slot-scope="scope">
              <span v-if="scope.row.asset">{{scope.row.asset}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="vxa-flax-box" style="margin-top: 30px" v-if="page.total > page.size">
          <div class="col t-left">
            <el-pagination class="pagination-new-box" @current-change="currentChange" :current-page="page.index"
                           :page-size="page.size"
                           layout="prev, pager, next" :total="page.total" background></el-pagination>
          </div>
          <div class="col t-right">
            <el-radio-group size="small" @change="pageSizeChange" v-model="page.size">
              <el-radio-button :label="30">30条</el-radio-button>
              <el-radio-button :label="50">50条</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: 'shareholder',
        tableList: {
          'shareholder': [],
          'member': [],
          'invest': []
        },
        shareholderList: [],
        memberList: [],
        investList: [],
        dataList: {},
        dataLoading: false,
        page: {
          index: 1,
          size: 30,
          total: 10
        }
      };
    },

    components: {},
    computed: {
      institutionAccountInfo: function () {
        return this.$store.state.institutionAccountInfo
      }
    },
    watch: {
      'institutionAccountInfo': function () {
        this.riskstormSearch(this.institutionAccountInfo.possessorName);
      }
    },
    mounted() {
      if (this.institutionAccountInfo.possessorName) {
        this.riskstormSearch(this.institutionAccountInfo.possessorName);
      }
    },
    created() {
    },
    methods: {
      removeRatio(str) {
        return str.replace('%', '')
      },
      riskstormSearch(val) {
        this.dataLoading = true
        let params = {
          requestUrl: '/v1/company/search',
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: val
        }
        this.$axios.gxfApi.riskstorm(params).then(res => {
          if (res.data.hits.length > 0) {
            let companyId = '';
            res.data.hits[0]['统一社会信用代码'] ? companyId = res.data.hits[0]['统一社会信用代码'] : companyId = res.data.hits[0]['注册号']
            this.riskstormRisk(companyId);
          }
        }).catch(err => {
          this.dataLoading = false;
        })
      },
      riskstormRisk(val) {
        let params = {
          requestUrl: '/v1/company/' + val + '/relation_list',
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: ''
        }
        this.$axios.gxfApi.riskstorm(params).then(res => {
          this.tableList = res.data;
          this.getData('shareholder', 30, 1);
          this.dataLoading = false;
        }).catch(err => {
          this.dataLoading = false;
        })
      },
      getData(type, size, index) {
        this.type = type;
        this.page.size = size;
        this.page.index = index;
        if (type == 'shareholder') {
          this.shareholderList = this.tableList.shareholder.slice((this.page.index - 1) * this.page.size, this.page.index * this.page.size);
          this.page.total = this.tableList.shareholder.length;
        } else if (type == 'member') {
          this.memberList = this.tableList.member.slice((this.page.index - 1) * this.page.size, this.page.index * this.page.size);
          this.page.total = this.tableList.member.length;
        } else if (type == 'invest') {
          this.investList = this.tableList.invest.slice((this.page.index - 1) * this.page.size, this.page.index * this.page.size);
          this.page.total = this.tableList.invest.length;
        }
      },
      pageSizeChange(val) {
        // this.page.index = 1;
        // this.page.size = val;
        let type = this.type
        this.getData(type, val, 1);
      },
      currentChange(index) {
        // this.page.index = index;
        let type = this.type;
        // let size = this.size;
        this.getData(type, this.page.size, index);
      }
    }
  }
</script>
<style lang="scss">
  #institutionRelation {
    .el-table {
      .el-table__header-wrapper {
        .has-gutter {
          height: 35px;
          line-height: 35px;
        }
      }
      .memebr {
        padding-left: 400px;
      }
    }
  }
</style>

<style lang='scss' scoped>
  #institutionRelation {
    min-height: 600px;
    .nav {
      p {
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        img {
          vertical-align: text-top;
          margin-right: 4px;
        }
        &:nth-child(2),
        &:nth-child(3) {
          border-bottom: 1px solid #E3E3E3;
        }
        i {
          position: absolute;
          right: 10px;
        }
      }
      .active {
        color: #FFB148;
      }
    }
  }
</style>
