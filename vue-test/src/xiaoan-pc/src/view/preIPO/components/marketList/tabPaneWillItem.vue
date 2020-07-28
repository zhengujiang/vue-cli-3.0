<template>
  <div id="tabPaneAll" v-loading="tableSreenLoading">
    <table border="0" class="company-table">
      <thead>
      <tr>
        <td class="row" v-for="(item, index) of tableHeader" :class="item.class" v-if="item.isItem"
            :title="selectedNameFun(item,item.selected)">
          <template v-if="item.popover">
            <el-popover :key="item.enumerate" v-model="item.show" popper-class="ipoTablePopover" width="300"
                        placement="bottom" trigger="click" @show="handlePopoverShowChange(index)"
                        @hide="handlePopoverHideChange(index)">
              <div class="popover-content" v-if="item.popoverType == 'checkbox'">
                <div class="el-input el-input--mini el-input--prefix input-with-select">
                  <input :key="item.enumerate" type="text" autocomplete="off" @input="popoverChange"
                         v-model="item.search" class="el-input__inner"/>
                  <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
                </div>
                <!--<el-input :key="item.enumerate" size="mini" placeholder="请输入内容" v-model="item.search"-->
                <!--prefix-icon="el-icon-search"  @input.n="popoverChange(item.search)"></el-input>-->
                <div class="checkbox-global">
                  <div class="isIndeterminate vux-1px-b">
                    <el-checkbox :key="item.enumerate" size="mini" :indeterminate="item.isIndeterminate"
                                 v-model="item.checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                  </div>
                  <el-checkbox-group :key="item.enumerate" size="mini" v-model="item.selected"
                                     @change="handleCheckedChange">
                    <ul>
                      <li v-for="(list, j) in item.list">
                        <el-checkbox size="mini" v-if="list.show" :label="list.id" :key="list.id">{{list.name}}
                        </el-checkbox>
                      </li>
                    </ul>
                  </el-checkbox-group>
                </div>
                <div class="button-global vux-1px-t">
                  <div class="row">
                    <el-button type="primary" class="primary-plain" plain size="mini" @click="resetBtns(index)">重置
                    </el-button>
                  </div>
                  <div class="row right">
                    <el-button type="primary" size="mini" @click="submitBtns(index)">确认</el-button>
                  </div>
                </div>
              </div>
              <div class="popover-content" v-else-if="item.popoverType == 'time'">
                <div class="popover-date-picker">
                  <el-date-picker :key="index" class="picker-option" size="mini" v-model="item.selected"
                                  :picker-options="pickerOptions" @change="auditingChange" :editable="false"
                                  :clearable="false" align="center" type="date"
                                  placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp">
                  </el-date-picker>
                </div>
                <div class="button-global vux-1px-t">
                  <div class="row">
                    <el-button type="primary" class="primary-plain" plain size="mini" @click="resetBtns(index)">重置
                    </el-button>
                  </div>
                  <div class="row right">
                    <el-button type="primary" size="mini" @click="submitBtns(index)">确认</el-button>
                  </div>
                </div>
              </div>
              <div slot="reference" class="cell" :class="{'is-active': item.show}" v-if="item.isItem">
                <span v-html="item.fullName"></span>&ensp;<i class="icon iconfont web-sanjiaoxing"></i>
              </div>
            </el-popover>
          </template>
          <template v-else>{{item.fullName}}</template>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) of tableData" :class="{'is-background': (index+1) % 2 == 0}">
        <td class="row is-center index">
          <span class="indexNo">{{((page.index * page.size) - (page.size-1)) + index}}</span>
        </td>
        <!---->
        <td class="row is-left company">
          <div class="cell">
            <!-- {{item.companyName}} -->
            <router-link class="vxa-a-hover underline" :to="`/kechuangban/info?name=${encodeURIComponent(item.companyName)}`" target="_blank">
              <div :title="item.companyName">{{item.companyName}}</div>
            </router-link>
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.marketName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.levelOneIndustryName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.levelTwoIndustryName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.areaName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.sponsorName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.accountingName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.lawName}}
          </div>
        </td>
        <td class="row is-center">
          <div class="cell" v-if="item.detailId">
            <router-link class="link" :to="'/ipo/details?id='+item.detailId" target="_blank">{{item.auditStatus}}
            </router-link>
          </div>
          <div class="cell" v-else>{{item.auditStatus}}</div>
        </td>
        <td class="row is-center">
          <div class="cell">{{item.questionCount}}</div>
        </td>
        <td class="row is-center">
          <div class="cell">
            {{item.ipoTime}}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="no-list" v-if="tableData.length == 0">
      <v-noInfo></v-noInfo>
    </div>
    <!--div-->
    <div class="foot-pagination" v-if="tableData.length > 0">
      <div class="row block">
        <el-pagination @current-change="selectPage" layout="prev, pager, next" :current-page="page.index"
                       :page-count="page.total">
        </el-pagination>
      </div>
      <div class="row">
        <el-radio-group size="mini" v-model="page.size" @change="handlePageChange">
          <el-radio-button :label="30">30条</el-radio-button>
          <el-radio-button :label="50">50条</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tabPaneAll",
    components: {},
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > new Date()
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }
          ]
        },
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        total: 0,
        checkStatusOption: {
          true: '是',
          false: '否',
          null: '--'
        },
        tableSreenLoading: true,
        //
        active: '',
        tableHeader: [
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'index',
            show: false,
            type: 'index',
            popoverType: 'checkbox',
            popover: false,
            enumerate: 'INDEX',
            name: '序号',
            fullName: '序号'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'company',
            show: false,
            type: 'companyName',
            popoverType: 'checkbox',
            popover: false,
            enumerate: 'COMPANY',
            name: '公司',
            fullName: '公司'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'market',
            show: false,
            type: 'marketTypeName',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'MARKET',
            name: '板块',
            fullName: '板块'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: '',
            show: false,
            type: 'industryLevelOne',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'LEVELOFINDUSTRY',
            name: '一级行业',
            fullName: '一级行业&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: '',
            show: false,
            type: 'industryLevelTwo',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'SECONDARYINDUSTRY',
            name: '二级行业',
            fullName: '二级行业&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: '',
            show: false,
            type: 'companyArea',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'PREFECTURE',
            name: '辖区',
            fullName: '辖区&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'form',
            show: false,
            type: 'sponsorInstitutionName',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'SPONSOR',
            name: '保荐机构',
            fullName: '保荐机构&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'form',
            show: false,
            type: 'accountingFirmName',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'ACCOUNTINGFIRM',
            name: '会计师事务所',
            fullName: '会计师事务所&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'form',
            show: false,
            type: 'lawFirmName',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'LAWOFFICE',
            name: '律师事务所',
            fullName: '律师事务所&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'audit',
            show: false,
            type: 'auditStatus',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'AUDIT',
            name: '审核状态',
            fullName: '审核状态&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'question',
            show: false,
            type: 'question',
            popoverType: 'checkbox',
            popover: false,
            enumerate: 'QUESTION', // 枚举
            name: '关注问题数',
            fullName: '关注问题数'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: '',
            isItem: true,
            class: 'datetime',
            show: false,
            type: 'datetime',
            popoverType: 'time',
            popover: true,
            enumerate: 'DATETIME', // 枚举
            name: '上会日期',
            fullName: '上会日期&ensp;'
          }
        ],
        setType: {
          all: '全部',
          sh: '',
          zx: '',
          cy: '',
          innovate: ''
        },
        tableData: [],
        paramsData: {
          marketIds: '',
          levelOneIndustryCodes: '',
          levelTwoIndustryCodes: '',
          areaIds: '',
          sponsorIds: '',
          accountingIds: '',
          lawIds: '',
          auditStatus: '',
          ipoTimes: ''
        },
        marketTypeData: []
      }
    },
    props: {
      type: String,
      name: String
    },
    watch: {
      $route: function (to, form) {
        // console.log(to.query.active, form);
        if (to.query.active == this.type) {
          this.tableSreenLoading = true;
          this.retrialFilterConditions();
          if (this.type != 'all') {
            this.tableHeader.forEach(e => {
              e.isItem = true;
              if (e.enumerate == 'MARKET') {
                e.popover = false
              }
            })
          }
        }
      }
    },
    created() {
      console.log(this.$route.query);
      //
      if (this.$route.query.active == this.type) {
        this.retrialFilterConditions();
        if (this.type != 'all') {
          this.tableHeader.forEach(e => {
            e.isItem = true;
            if (e.enumerate == 'MARKET') {
              e.popover = false
            }
          })
        }
      }
    },
    mounted() {
    },
    methods: {
      getDataSourceId(name) {
        this.$http({
          method: 'GET',
          url: this.$api.publish.getDataSourceId,
          params: {
            companyName: name
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$common.openWindow('/ipo/details?id=' + res.data.returnObject);
          }
        }).catch(() => {

        })
      },
      popoverChange(val) {
        let selectItem = this.tableHeader[this.active];
        console.log(selectItem.search);
        this.tableHeader[this.active].search = this.$common.Trim(selectItem.search);
        if (selectItem.search != '') {
          var select = selectItem.list.filter((arr) => {
            return arr.name.indexOf(selectItem.search) > -1
          });
          this.tableHeader[this.active].list = select;
        } else {
          this.tableHeader[this.active].list = this.tableHeader[this.active].initialList;
        }
      },
      auditingChange(val) {

      },
      //
      selectedNameFun(allArray, arr) {
        // console.log(arr);
        let name = [];
        if (allArray.enumerate == 'DATETIME') {
          if (allArray.selected != '') {
            name.push(this.$common.transTime(allArray.selected)[1]);
          }
          name = this.$common.ImpArr(name)
        } else {
          allArray.list.forEach((item, index) => {
            arr.forEach((itemTwo, k) => {
              if (item.id == itemTwo) {
                name.push(item.name)
              }
            })
          })
        }
        // console.log('name====>', name);
        if (name.toString() == '') {
          return ''
        } else if (name.toString().length >= 50) {
          return name.toString().substring(0, 50) + '......'
        } else {
          return name.toString()
        }
      },
      //
      selectPage(e) {
        this.page.index = e;
        this.$common.returnTop();
        this.searchAuditingCompany();
      },
      //
      handlePageChange(val) {
        this.page.size = val;
        this.page.index = 1;
        this.searchAuditingCompany();
      },
      //
      retrialFilterConditions() {
        this.$http({
          methods: 'GET',
          url: this.$api.publish.retrialFilterConditions,
          params: {}
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let dataObject = res.data.returnObject;
            this.marketTypeData = dataObject.MARKET.map((k) => {
              return Object.assign({}, k, {show: true})
            }) // 板块
            this.tableHeader.forEach((item, index) => {
              if (item.enumerate == 'MARKET') {
                item.list = dataObject.MARKET.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 板块
                item.initialList = dataObject.MARKET.map((k) => {
                  return Object.assign({}, k, {show: true})
                })
              }
              if (item.enumerate == 'LEVELOFINDUSTRY') {
                item.list = dataObject.INDUSTRY_LEVEL_ONE.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 一级
                item.initialList = dataObject.INDUSTRY_LEVEL_ONE.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 一级
              }
              if (item.enumerate == 'SECONDARYINDUSTRY') {
                item.list = dataObject.INDUSTRY_LEVEL_TWO.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 二级
                item.initialList = dataObject.INDUSTRY_LEVEL_TWO.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 二级
              }
              if (item.enumerate == 'PREFECTURE') {
                item.list = dataObject.AREA.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 辖区
                item.initialList = dataObject.AREA.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 辖区
              }
              if (item.enumerate == 'SPONSOR') {
                item.list = dataObject.SPONSOR_INSTITUTION.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 保荐机构
                item.initialList = dataObject.SPONSOR_INSTITUTION.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 保荐机构
              }
              if (item.enumerate == 'ACCOUNTINGFIRM') {
                item.list = dataObject.ACCOUNTING_FIRM.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 会计师事务所
                item.initialList = dataObject.ACCOUNTING_FIRM.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 会计师事务所
              }
              if (item.enumerate == 'LAWOFFICE') {
                item.list = dataObject.LAW_FIRM.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 律师事务所
                item.initialList = dataObject.LAW_FIRM.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 律师事务所
              }
              if (item.enumerate == 'AUDIT') {
                item.list = [
                  {"name": "通过", "id": "通过", "show": true},
                  {"name": "未通过", "id": "未通过", "show": true},
                  {"name": "暂缓表决", "id": "暂缓表决", "show": true},
                  {"name": "取消审核", "id": "取消审核", "show": true}
                ]
                item.initialList = [
                  {"name": "通过", "id": "通过", "show": true},
                  {"name": "未通过", "id": "未通过", "show": true},
                  {"name": "暂缓表决", "id": "暂缓表决", "show": true},
                  {"name": "取消审核", "id": "取消审核", "show": true}
                ]
              }
              if (item.enumerate == 'REVIEW') {
                item.list = [{name: '是', id: true, show: true}, {name: '否', id: false, show: true}] // 检查
                item.initialList = [{name: '是', id: true, show: true}, {name: '否', id: false, show: true}] // 检查
              }
            })
            console.log(this.marketTypeData);
            console.log(this.paramsData.marketIds);
            this.tableHeader[2].selected = [];
            let sponsor = this.$route.query.sponsor ? this.$route.query.sponsor : null;
            let lawfirm = this.$route.query.lawfirm ? this.$route.query.lawfirm : null
            let accountingfirm = this.$route.query.accountingfirm ? this.$route.query.accountingfirm : null;
            //
            this.tableHeader.forEach((item, index) => {
              // 保荐机构
              if (item.enumerate == 'SPONSOR') {
                if (sponsor) {
                  item.selected.push(sponsor);
                }
                this.active = index;
                this.handleCheckedChange(item.selected)
              }
              // 律师
              if (item.enumerate == 'LAWOFFICE') {
                if (lawfirm) {
                  item.selected.push(lawfirm);
                }
                this.active = index;
                console.log(item.selected);
                this.handleCheckedChange(item.selected)
              }
              // 会计
              if (item.enumerate == 'ACCOUNTINGFIRM') {
                if (accountingfirm) {
                  item.selected.push(accountingfirm);
                }
                this.active = index;
                this.handleCheckedChange(item.selected)
              }
            })
            this.synchronizedChecked(); // 同步选中 误删
            //
            this.marketTypeData.forEach((item) => {
              if (item.name.indexOf(this.name) > -1) {
                this.tableHeader[2].selected.push(item.id);
                this.paramsData.marketIds = item.id
              }
            })
            //
            console.log(this.paramsData.marketIds);
            this.searchAuditingCompany();
          }
        }).catch((err) => {

        })
      },
      //
      resetBtns(i) {
        if (this.tableHeader[i].enumerate == "LEVELOFINDUSTRY") {
          this.getIndustryList('', i);
        }
        this.page.index = 1;
        this.tableHeader[this.active].isIndeterminate = false;
        if (this.tableHeader[i].popoverType == 'time') {
          this.tableHeader[i].selected = '';
        } else {
          this.tableHeader[i].selected = [];
        }
        this.tableHeader[i].search = '';
        this.tableHeader[i].list = this.tableHeader[i].initialList
        this.tableHeader[this.active].checkAll = false;
        this.tableHeader[i].show = false;
        this.synchronizedChecked();
        this.$nextTick(() => {
          this.searchAuditingCompany();
        })
      },
      //
      //
      getIndustryList(code, index) {
        this.$http({
          method: 'GET',
          url: this.$api.publish.getIndustryList,
          params: {
            levelOneIndustryCode: code
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject;
            var set = data.map(e => {
              return e.levelTwoIndustry
            })
            console.log(set);
            var temp = [];
            for (var i = 0; i < set.length; i++) {
              temp = temp.concat(set[i])
            }
            var tempArr = temp.map(e => {
              return {id: e.industryCode, name: e.industryName, show: true}
            })
            this.$nextTick(() => {
              this.tableHeader[index + 1].list = tempArr;
              this.tableHeader[index + 1].initialList = tempArr;
            })
          }
        }).catch((err) => {

        })
      },
      //
      submitBtns(i) {
        if (this.tableHeader[i].enumerate == "LEVELOFINDUSTRY") {
          this.tableHeader[i + 1].selected = [];
          this.getIndustryList(this.tableHeader[i].selected.toString(), i);
        }
        this.page.index = 1;
        this.tableHeader[i].show = false;
        this.synchronizedChecked();
        this.$nextTick(() => {
          this.searchAuditingCompany();
        })
      },
      //
      handlePopoverShowChange(i) {
        this.active = null;
        if (this.tableHeader[i].show) {
          this.active = i;
        }
        this.handleCheckedChange(this.tableHeader[i].selected);
        console.log('234214234', this.active);
      },
      //
      handlePopoverHideChange(i) {
        this.reverseSynchronizedChecked()
        // console.log('234214234', this.active);
      },
      // 搜索
      searchAuditingCompany() {
        this.tableSreenLoading = true;
        let httpData = Object.assign({}, this.paramsData, {pageNum: this.page.index, pageSize: this.page.size})
        // console.log(httpData);
        function rank(type) {
          var set = '';
          if (type == 0) {
            set = '--'
          } else if (type < 0) {
            set = '<i class="iconfont web-jiantou-bottom"></i>' + Math.abs(type)
          } else if (type > 0) {
            set = '<i class="iconfont web-jiantou-top"></i>' + Math.abs(type)
          } else {
            set = '--'
          }
          return set
        }
        //
        this.$http({
          method: 'POST',
          url: this.$api.publish.getIpoCompanyInfoList,
          params: httpData
        }).then((res) => {
          setTimeout(() => {
            this.tableSreenLoading = false;
          }, 300)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.total = res.data.total;
            this.page.total = Math.ceil(res.data.total / this.page.size);
            this.$emit('date-change', res.data.returnObject.date);
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.tableData = []
            } else {

              let arrayListData = res.data.returnObject;
              arrayListData.forEach((item, index) => {
                item.rankNo = rank(item.compareRankNo)
              });
              this.tableData = arrayListData
            }
          } else {
            this.tableData = [];
          }
        }).catch((err) => {
          setTimeout(() => {
            this.tableSreenLoading = false;
          }, 3000)
        })
      },
      // checkbox 全选 change
      handleCheckAllChange(val) {
        let data = this.tableHeader[this.active].list;
        if (val) {
          this.tableHeader[this.active].selected = data.map(e => {
            return e.id
          })
        } else {
          this.tableHeader[this.active].selected = [];
        }
        this.tableHeader[this.active].isIndeterminate = false;
      },
      // 同步选中
      synchronizedChecked() {
        this.tableHeader.forEach((item, index) => {
          if (item.enumerate == 'MARKET') {
            if (this.type == 'all') {
              this.paramsData.marketIds = item.selected.toString()
            }
            // item.list = dataObject.MARKET // 板块
          }
          if (item.enumerate == 'LEVELOFINDUSTRY') {
            this.paramsData.levelOneIndustryCodes = item.selected.toString()
            // item.list = dataObject.INDUSTRY_LEVEL_ONE // 一级
          }
          if (item.enumerate == 'SECONDARYINDUSTRY') {
            this.paramsData.levelTwoIndustryCodes = item.selected.toString()
            // item.list = dataObject.INDUSTRY_LEVEL_TWO // 二级
          }
          if (item.enumerate == 'PREFECTURE') {
            this.paramsData.areaIds = item.selected.toString()
            // item.list = dataObject.AREA // 辖区
          }
          if (item.enumerate == 'SPONSOR') {
            this.paramsData.sponsorIds = item.selected.toString()
            // item.list = dataObject.SPONSOR_INSTITUTION // 保荐机构
          }
          if (item.enumerate == 'ACCOUNTINGFIRM') {
            this.paramsData.accountingIds = item.selected.toString()
            // item.list = dataObject.ACCOUNTING_FIRM // 会计师事务所
          }
          if (item.enumerate == 'LAWOFFICE') {
            this.paramsData.lawIds = item.selected.toString()
            // item.list = dataObject.LAW_FIRM // 律师事务所
          }
          if (item.enumerate == 'AUDIT') {
            this.paramsData.auditStatus = item.selected.toString()
            // item.list = dataObject.AUDIT_STATUS // 审核状态
          }
          if (item.enumerate == 'DATETIME') {
            // 处理全选情况下 如果全选就不传参数
            this.paramsData.ipoTimes = item.selected
            // item.list = dataObject.AUDIT_STATUS // 检查
          }
        });
      },
      // 反向同步选中
      reverseSynchronizedChecked() {
        this.tableHeader.forEach((item, index) => {
          if (item.enumerate == 'MARKET') {
            if (this.type == 'all') {
              item.selected = this.paramsData.marketIds.split(',');
            }
          }
          if (item.enumerate == 'LEVELOFINDUSTRY') {
            item.selected = this.paramsData.levelOneIndustryCodes.split(',')
          }
          if (item.enumerate == 'SECONDARYINDUSTRY') {
            item.selected = this.paramsData.levelTwoIndustryCodes.split(',')
          }
          if (item.enumerate == 'PREFECTURE') {
            item.selected = this.paramsData.areaIds.split(',')
          }
          if (item.enumerate == 'SPONSOR') {
            item.selected = this.paramsData.sponsorIds.split(',')
          }
          if (item.enumerate == 'ACCOUNTINGFIRM') {
            item.selected = this.paramsData.accountingIds.split(',')
          }
          if (item.enumerate == 'LAWOFFICE') {
            item.selected = this.paramsData.lawIds.split(',')
          }
          if (item.enumerate == 'AUDIT') {
            item.selected = this.paramsData.auditStatus.split(',')
          }
          if (item.enumerate == 'DATETIME') {
            // 处理全选情况下 如果全选就不传参数
            item.selected = this.paramsData.ipoTimes
            // item.list = dataObject.AUDIT_STATUS // 检查
          }
          item.selected = this.$common.ImpArr(item.selected);
          this.handleCheckedChange(item.selected);
        });
        console.log('====>', this.tableHeader);
      },
      // checkbox change
      handleCheckedChange(val) {
        let selectLen = val.length;
        let listLen = this.tableHeader[this.active].list.length;
        this.tableHeader[this.active].checkAll = selectLen === listLen;
        this.tableHeader[this.active].isIndeterminate = selectLen > 0 && selectLen < listLen;
      }
    }
  }
</script>

<style lang="scss" scoped>
  #tabPaneAll {
    min-height: 350px;
  }
</style>
