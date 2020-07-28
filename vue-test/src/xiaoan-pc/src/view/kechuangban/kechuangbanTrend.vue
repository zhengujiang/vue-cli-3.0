<template>
  <div id="tabPaneAll" v-loading="tableSreenLoading">
    <div class="finance-title">
      <div class="content">
        <p>科创板在审公司统计</p>
      </div>
    </div>
    <div class="content" style="min-height: 370px">
      <table border="0" class="company-table">
        <thead>
        <tr>
          <td class="row" v-for="(item, index) of tableHeader" :key="index" :class="item.class" v-if="item.isItem"
              :title="selectedNameFun(item,item.selected)">
            <template v-if="item.popover">
              <el-popover :key="item.enumerate" v-model="item.show" popper-class="ipoTablePopover" width="300"
                          placement="bottom" trigger="click" @show="handlePopoverShowChange(index)"
                          @hide="handlePopoverHideChange(index)">
                <div class="popover-content" v-if="item.popoverType == 'checkbox'">
                  <div class="el-input el-input--mini el-input--prefix input-with-select">
                    <input :key="item.enumerate" type="text" autocomplete="off" @input="popoverChange"
                          v-model="item.search" class="el-input__inner" placeholder="请输入内容"/>
                    <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
                  </div>
                  <div class="checkbox-global">
                    <div class="isIndeterminate vux-1px-b">
                      <el-checkbox :key="item.enumerate" size="mini" :indeterminate="item.isIndeterminate"
                                  v-model="item.checkAll" @change="handleCheckAllChange">全选
                      </el-checkbox>
                    </div>
                    <el-checkbox-group :key="item.enumerate" size="mini" v-model="item.selected"
                                      @change="handleCheckedChange">
                      <ul>
                        <li v-for="(list, j) in item.list" :key="j">
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
                <div class="popover-content" v-else-if="item.popoverType == 'times'">
                  <div class="popover-date-picker">
                    <el-date-picker :key="index" class="picker-option" size="mini" v-model="item.selected"
                                    :picker-options="pickerOptions" :editable="false"
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
                  <span v-html="item.fullName"></span>&ensp;<i class="iconfont web-sanjiaoxing"></i>
                </div>
              </el-popover>
            </template>
            <template v-else>{{item.fullName}}</template>
          </td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) of tableData" :class="{'is-background': (index+1) % 2 == 0}" :key="index">
          <td class="row is-center index">
            <span class="indexNo">{{((page.index * page.size) - (page.size-1)) + index}}</span>
          </td>
          <!-- <td class="row is-center rankNo" v-if="type != 'all'">
            <div class="cell" v-html="item.rankNo"></div>
          </td> -->
          <td class="row is-left company">
            <div class="cell">
              <router-link class="vxa-a-hover underline" :to="`/kechuangban/info?name=${encodeURIComponent(item.companyName)}`" target="_blank">
                <div :title="item.companyName">{{item.companyName}}</div>
              </router-link>
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              <router-link class="checkType" :to="`/kechuangban/details?id=${item.id}&type=trend`" target="_blank">
                {{checkType[item.checkType]}}
              </router-link>
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{item.companyArea}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{item.industryLevelTwo}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{item.sponsorInstitutionName}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{item.accountingFirmName}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{item.lawFirmName}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{$common.transTime(item.turnoverDate)[1]}}
            </div>
          </td>
          <td class="row is-center">
            <div class="cell">
              {{$common.transTime(item.acceptDate)[1]}}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="no-list" v-if="tableData.length == 0">
        <v-noInfo></v-noInfo>
      </div>
      <div class="vxa-flax-box align foot-pagination" v-if="total > 30">
        <div class="col">
          <el-pagination class="vxa-footer-page-pagination"
                          @current-change="selectPage"
                          layout="prev, pager, next, jumper"
                          :current-page="page.index"
                          :page-count="page.total">
          </el-pagination>
        </div>
        <div class="col button-group t-right">
          <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="page.size"
                          @change="handlePageChange">
            <el-radio-button label="30">30条</el-radio-button>
            <el-radio-button label="50">50条</el-radio-button>
          </el-radio-group>
        </div>
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
            type: 'companys',
            popoverType: 'checkbox',
            popover: false,
            enumerate: 'companys',
            name: '发行人全称',
            fullName: '发行人全称'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: [],
            isItem: true,
            class: 'status',
            show: false,
            type: 'checkTypes',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'checkTypes',
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
            class: 'status',
            show: false,
            type: 'companyAreas',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'companyAreas',
            name: '注册地',
            fullName: '注册地&ensp;'
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
            type: 'industrys',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'industrys',
            name: '证监会行业',
            fullName: '证监会行业&ensp;'
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
            enumerate: 'sponsorInstitutionNames',
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
            type: 'accountingFirmNames',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'accountingFirmNames',
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
            type: 'lawFirmNames',
            popoverType: 'checkbox',
            popover: true,
            enumerate: 'lawFirmNames',
            name: '律师事务所',
            fullName: '律师事务所&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: '',
            isItem: true,
            class: 'status',
            show: false,
            type: 'turnoverTimes',
            popoverType: 'times',
            popover: true,
            enumerate: 'turnoverTimes', // 枚举
            name: '更新日期',
            fullName: '更新日期&ensp;'
          },
          {
            list: [],
            initialList: [],
            search: '',
            checkAll: false,
            isIndeterminate: false,
            selected: '',
            isItem: true,
            class: 'status',
            show: false,
            type: 'accepTimes',
            popoverType: 'times',
            popover: true,
            enumerate: 'accepTimes', // 枚举
            name: '受理日期',
            fullName: '受理日期&ensp;'
          }
        ],
        setType: {
          all: '全部',
          sh: '',
          zx: '',
          cy: '',
          innovate: ''
        },
        checkType: {
          '1': '已受理',
          '2': '已问询',
          '3': '通过',
          '4': '未通过',
          '5': '提交注册',
          '6': '注册生效',
          '7': '不予注册',
          '8': '已发行',
          '9': '中止',
          '10': '终止'
        },
        tableData: [],
        paramsData: {
          companyNames: '', // 发行人全称
          companyAreas: '', // 注册地
          checkTypes: '', // 审核状态
          industryCodeLevelTwo: '', // 证监会行业
          sponsorInstitutionNames: '', // 保荐机构
          accountingFirmNames: '', // 会计事务所
          lawFirmNames: '', // 律师事务所
          acceptTimes: '', // 受理时间
          turnoverTimes: '' // 更新时间
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
          this.getStibConditions();
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
      //
      if (this.$route.query.active == this.type) {
        this.getStibConditions();
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
      this.getStibDataSource();
    },
    methods: {
      //
      popoverChange(val) {
        let selectItem = this.tableHeader[this.active];
        console.log(selectItem);
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
      //
      selectedNameFun(allArray, arr) {
        let name = [];
        if (allArray.enumerate == 'accepTimes' || allArray.enumerate == 'turnoverTimes') {
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
        this.getStibDataSource();
      },
      //
      handlePageChange(val) {
        this.page.size = val;
        this.page.index = 1;
        this.getStibDataSource();
      },
      //
      getStibConditions() {
        this.$http({
          methods: 'GET',
          url: this.$api.kechuangban.getStibConditions,
          params: {}
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let dataObject = res.data.returnObject;
            // this.marketTypeData = dataObject.MARKET.map((k) => {
            //   return Object.assign({}, k, {show: true})
            // }) // 板块
            this.tableHeader.forEach((item, index) => {
              if (item.enumerate == 'companys') {
                let companyArr = [];
                dataObject.companys.forEach(e => {
                  let obj = {name: e};
                  companyArr.push(obj)
                })
                item.list = companyArr.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 发行人全称
                item.initialList = companyArr.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 发行人全称
              }
              if (item.enumerate == 'checkTypes') {
                dataObject.checkTypes.forEach(e => {
                  e['id'] = `${e.code}`;
                })
                item.list = dataObject.checkTypes.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 审核状态
                item.initialList = dataObject.checkTypes.map((k) => {
                  return Object.assign({}, k, {show: true})
                }) // 审核状态
              }
              if (item.enumerate == 'industrys') {
                dataObject.industrys.forEach(e => {
                  e['id'] = e.code;
                })
                item.list = dataObject.industrys.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 证监会行业
                item.initialList = dataObject.industrys.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 证监会行业
              }
              if (item.enumerate == 'companyAreas') {
                let area = [];
                dataObject.companyAreas.forEach(e => {
                  let obj = {name: e, id: e};
                  area.push(obj);
                })
                item.list = area.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 注册地
                item.initialList = area.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 注册地
              }
              if (item.enumerate == 'sponsorInstitutionNames') {
                let sponsor = [];
                dataObject.sponsorInstitutionNames.forEach(e => {
                  let obj = {name: e, id: e};
                  sponsor.push(obj);
                })
                item.list = sponsor.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 保荐机构
                item.initialList = sponsor.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 保荐机构
              }
              if (item.enumerate == 'accountingFirmNames') {
                let account = [];
                dataObject.accountingFirmNames.forEach(e => {
                  let obj = {name: e, id: e};
                  account.push(obj)
                })
                item.list = account.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 会计师事务所
                item.initialList = account.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 会计师事务所
              }
              if (item.enumerate == 'lawFirmNames') {
                let law = [];
                dataObject.lawFirmNames.forEach(e => {
                  let obj = {name: e, id: e};
                  law.push(obj);
                })
                item.list = law.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 律师事务所
                item.initialList = law.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 律师事务所
              }
              if (item.enumerate == 'accepTimes') {
                let time = [];
                dataObject.accepTimes.forEach(e => {
                  let obj = {name: this.$common.transTime(e)[1], id: this.$common.transTime(e)[1]};
                  time.push(obj);
                })
                item.list = time.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 受理时间
                item.initialList = time.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 受理时间
              }
              if (item.enumerate == 'turnoverTimes') {
                let time = [];
                dataObject.turnoverTimes.forEach(e => {
                  let obj = {name: this.$common.transTime(e)[1], id: this.$common.transTime(e)[1]};
                  time.push(obj);
                })
                item.list = time.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 更新时间
                item.initialList = time.map((k) => {
                  return Object.assign({}, k, {show: true})
                })  // 更新时间
              }
            })
            this.synchronizedChecked();
            this.getStibDataSource();
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      resetBtns(i) {
        this.page.index = 1;
        this.tableHeader[this.active].isIndeterminate = false;
        this.tableHeader[this.active].checkAll = false;
        if (this.tableHeader[i].popoverType == 'times') {
          this.tableHeader[i].selected = '';
        } else {
          this.tableHeader[i].selected = [];
        }
        this.tableHeader[i].search = '';
        this.tableHeader[i].list = this.tableHeader[i].initialList
        this.tableHeader[i].show = false;
        this.synchronizedChecked();
        this.$nextTick(() => {
          this.getStibDataSource();
        })
      },
      submitBtns(i) {
        this.page.index = 1;
        this.tableHeader[i].show = false;
        this.synchronizedChecked();
        this.$nextTick(() => {
          this.getStibDataSource();
        })
      },
      //
      handlePopoverShowChange(i) {
        this.active = null;
        if (this.tableHeader[i].show) {
          this.active = i;
        }
        this.handleCheckedChange(this.tableHeader[i].selected);
      },
      //
      handlePopoverHideChange(i) {
        setTimeout(() => {
          this.reverseSynchronizedChecked();
        }, 300)
        // console.log('234214234', this.active);
      },
      // 搜索
      getStibDataSource() {
        this.tableSreenLoading = true;
        let httpData = Object.assign({}, this.paramsData, {pageNum: this.page.index, pageSize: this.page.size})
        function rank(type) {
          var set = '';
          if (type == 0) {
            set = '--'
          } else if (type < 0) {
            set = '<i class="jiantou-bottom  iconfont web-jiantou-bottom"></i>' + Math.abs(type)
          } else if (type > 0) {
            set = '<i class="jiantou-top iconfont web-jiantou-top"></i>' + Math.abs(type)
          } else {
            set = '--'
          }
          return set
        }
        //
        this.$http({
          method: 'POST',
          url: this.$api.kechuangban.getStibDataSource,
          params: httpData
        }).then((res) => {
          setTimeout(() => {
            this.tableSreenLoading = false;
          }, 300)
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.total = res.data.returnObject.total;
            this.page.total = Math.ceil(res.data.returnObject.total / this.page.size);
            this.$emit('date-change', res.data.returnObject.date);
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            console.log(this.page.total)
            // 没有搜索结果
            if (this.page.total == 0) {
              this.tableData = []
            } else {
              let arrayListData = res.data.returnObject.auditList;
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
        console.log(val);
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
          if (item.enumerate == 'checkTypes') {
            this.paramsData.checkTypes = item.selected.toString() // 审核状态
          }
          if (item.enumerate == 'lawFirmNames') {
            this.paramsData.lawFirmNames = item.selected.toString() // 律师事务所
          }
          if (item.enumerate == 'industrys') {
            this.paramsData.industryCodeLevelTwo = item.selected.toString() // 证监会行业
          }
          if (item.enumerate == 'accountingFirmNames') {
            this.paramsData.accountingFirmNames = item.selected.toString() // 会计事务所
          }
          if (item.enumerate == 'sponsorInstitutionNames') {
            this.paramsData.sponsorInstitutionNames = item.selected.toString() // 保荐机构
          }
          if (item.enumerate == 'companyAreas') {
            this.paramsData.companyAreas = item.selected.toString() // 注册地
          }
          if (item.enumerate == 'accepTimes') {
            // item.selected = item.selected.map(e => {
            //   return Date.parse(new Date(e)) - (8 * 60 * 60 * 1000)
            // })
            this.paramsData.acceptTimes = item.selected // 受理日期
          }
          if (item.enumerate == 'turnoverTimes') {
            // item.selected = item.selected.map(e => {
            //   return Date.parse(new Date(e)) - (8 * 60 * 60 * 1000)
            // })
            this.paramsData.turnoverTimes = item.selected // 更新日期
          }
        });
      },
      // 反向同步选中
      reverseSynchronizedChecked() {
        this.tableHeader.forEach((item, index) => {
          if (item.enumerate == 'checkTypes') {
            item.selected = this.paramsData.checkTypes.split(','); // 审核状态
          }
          if (item.enumerate == 'lawFirmNames') {
            item.selected = this.paramsData.lawFirmNames.split(','); // 律师事务所
          }
          if (item.enumerate == 'industrys') {
            item.selected = this.paramsData.industryCodeLevelTwo.split(','); // 证监会行业
          }
          if (item.enumerate == 'accountingFirmNames') {
            item.selected = this.paramsData.accountingFirmNames.split(','); // 会计事务所
          }
          if (item.enumerate == 'sponsorInstitutionNames') {
            item.selected = this.paramsData.sponsorInstitutionNames.split(','); // 保荐机构
          }
          if (item.enumerate == 'companyAreas') {
            item.selected = this.paramsData.companyAreas.split(','); // 注册地
          }
          if (item.enumerate == 'accepTimes') {
            item.selected = this.paramsData.acceptTimes
            // let time = this.paramsData.acceptTimes.split(',');
            // item.selected = time.map(e => {
            //   return this.$common.transTime(e)[1]
            // }) // 受理日期
          }
          if (item.enumerate == 'turnoverTimes') {
            item.selected = this.paramsData.turnoverTimes
            // let time = this.paramsData.turnoverTimes.split(',');
            // item.selected = time.map(e => {
            //   return this.$common.transTime(e)[1]
            // }) // 更新日期
          }
          item.selected = this.$common.ImpArr(item.selected);
          this.handleCheckedChange(item.selected);
        });

        console.log('====>', this.tableHeader);
      },
      // checkbox change
      handleCheckedChange(val) {
        console.log(val)
        let selectLen = val.length;
        let listLen = this.tableHeader[this.active].list.length;
        this.tableHeader[this.active].checkAll = selectLen === listLen;
        this.tableHeader[this.active].isIndeterminate = selectLen > 0 && selectLen < listLen;
      }
    }
  }
</script>

<style lang="scss">
  #tabPaneAll {
    min-height: 350px;
    .finance-title {
      width: 100%;
      height: 140px;
      background-image: url(https://oss.in-hope.cn/xiaoan/web_static/financeBack.jpg);
      background-size: 100% 100%;
      color: #FFFFFF;
      p {
        font-size:30px;
        font-weight:600;
        padding: 49px 0;
      }
    }
    .company-table {
      width: 100%;
      font-size: 12px;
      border: none;
      border: 0;
      border-collapse: collapse;
      table-layout: fixed;
      border-radius:4px;
      border:1px solid rgba(241,240,245,1);
      margin: 16px 0;
      thead {
        tr {
          background: #f2f2f2;
          height: 45px;
          td {
            color: #323232;
            font-size: 12px;
            text-align: center;
            &.row {
              text-align: center;
              .cell {
                cursor: pointer;
                outline: none;
                transition: all .3s;
                &.is-active {
                  color: #ffb148;
                  font-weight: bold;
                  i {
                    display: inline-block;
                    transition: transform .3s, -webkit-transform .3s, -ms-transform .3s;
                    -webkit-transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                    -ms-transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                    transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                  }
                }
                i {
                  font-size: 10px;
                  color: #ffb148;
                  display: inline-block;
                  transition: transform .3s, -webkit-transform .3s, -ms-transform .3s;
                  -webkit-transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                  -ms-transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                  transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                }
              }
              &.market {
                width: 80px;
              }
              &.form {
                width: 130px;
              }
              &.audit {
                width: 95px;
              }
              &.status {
                width: 70px;
              }
              &.index {
                width: 55px;
              }
              &.company {
                width: 152px;
              }
              &.rankNo {
                width: 70px;
              }
            }
          }
        }
      }
      tbody {
        tr {
          height: 40px;
          &.is-background {
            background: #F8F8F8;
          }
          td {
            font-size: 12px;
            color: rgba(84, 84, 84, 1);
            &.row {
              text-align: left;
              .cell {
                padding: 5px 3px;
                .link {
                  color: #ffb148;
                  text-decoration: underline;
                  cursor: pointer;
                  &:hover {
                    color: #ffb148;
                  }
                }
              }
              .checkType {
                color: #FFB148;
                cursor: pointer;
              }
              &.is-center {
                text-align: center;
              }
              &.is-right {
                text-align: right;
              }
              &.is-left {
                text-align: left;
              }
              &.index {
                width: 60px;
                font-size: 16px;
                color: #323232;
                text-align: center;
                .indexNo {
                  display: inline-flex;
                  align-items: center;
                  text-align: center;
                  height: 18px;
                  width: 18px;
                  font-size: 14px;
                  line-height: 1;
                  border-radius: 50%;
                  justify-content: center;
                  &.index0 {
                    background-color: #FFC952;
                    color: white;
                  }
                  &.index1 {
                    background-color: #90B8F5;
                    color: white;
                  }
                  &.index2 {
                    background-color: #F5BE95;
                    color: white;
                  }
                }
              }
              &.company {
                width: 152px;
              }
              &.rankNo {
                i {
                  font-size: 12px;
                  font-weight: bold;
                }
                .jiantou-top {
                  color: #FFB148;
                }
                .jiantou-bottom {
                  color: #29DA89;
                }
              }
            }
          }

        }
      }
    }
    .foot-pagination {
      padding: 30px 16px;
    }
  }
  .ipoTablePopover {
    padding: 10px;
    .popover-content {
      .popover-date-picker {
        width: 100%;margin-bottom: 10px;
        .el-input {
          width: 100%;
        }
        .el-input__inner {
          width: 100%;
        }
      }
      .checkbox-global {
        .isIndeterminate {
          height: 30px;
          line-height: 30px;
          .el-checkbox__label{
            font-size: 12px;
            font-weight: normal;
          }
        }
        .el-checkbox-group {
          ul {
            max-height: 270px;
            min-height: 270px;
            height: 270px;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 5px 0;
            li {
              padding: 5px 0;
              line-height: 1;
              .el-checkbox {
                display: flex;
                align-items: center;
                font-size: 12px;
                .el-checkbox__input {
                  flex: inherit;
                }
                .el-checkbox__label {
                  flex: 1;
                  font-weight: normal;
                  white-space: normal;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .button-global {
        display: flex;
        padding-top: 8px;
        .row {
          flex: 1;
          margin-right: 10px;
          .el-button {
            width: 100%;
            padding: 0;
            height: 30px;
          }
          .primary-plain {
            &:focus {
              color: #ffb148;
              background: #fff7ed;
              border-color: #ffe0b6;
            }
          }
          &.right {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
