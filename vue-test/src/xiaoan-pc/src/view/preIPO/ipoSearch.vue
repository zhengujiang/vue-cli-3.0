<template>
  <div class="ipo-search" id="ipo-search" v-loading.fullscreen.lock="loading">
    <!---->
    <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
    <search @submitAll="submitAll" @screenIsActive="screenIsActive" @deleteType='deleteType' :changeSearch="true"
            :senior="senior" :placeholder="autoNo[5]" :allMapping="mapping" :stockCode="false" :titleList="screenList">
      <template slot="title">IPO</template>
      <template slot="info">小安为您整理的有关上交所、深交所历届上会上市公司，和在审上市公司信息统计。每日及时更新，供您快速查阅。</template>
      <template slot="transition">
        <transition name="bounce" mode="out-in">
          <div class="xiaoan-box-content" v-show="boxContent">
            <div class="cont-container" v-show="boxContentTi">
              <div class="cont-search">
                <div class="el-input">
                  <input type="text" class="el-input__inner" v-model="filterText" :placeholder="autoNo[7]"/>
                </div>
                <div class="ruleBtn">
                  <el-button type="primary" icon="el-icon-search"></el-button>
                </div>
              </div>
              <div class="cont-tree">
                <el-tree class="filter-tree" :data="data4" :props="defaultProps" :filter-node-method="filterNode"
                         node-key="id" accordion show-checkbox ref="tree2" expand-on-click-node
                         @node-click="handleNodeClick" @check-change="handleCheckChange" highlight-current
                         :indent="indent">
                </el-tree>
              </div>
            </div>
            <div v-show="!boxContentTi" class="cont-containerDate">
              <div class="tableDate">
                <div class="start">
                  <span>自</span>
                  <el-date-picker value-format="yyyy-MM-dd"
                                  v-model="startDate" type="date" placeholder="选择日期"
                                  :default-value="this.$common.getNowDate()"
                                  :editable="false"
                                  :picker-options="pickerOptions1">
                  </el-date-picker>
                </div>
              </div>
              <div class="tableDate">
                <div class="end">
                  <span>到</span>
                  <el-date-picker value-format="yyyy-MM-dd"
                                  v-model="startEnd" type="date" placeholder="选择日期"
                                  :default-value="this.$common.getNowDate()"
                                  :editable="false"
                                  :picker-options="pickerOptions2">
                  </el-date-picker>
                </div>
              </div>
              <ul class="dateArr">
                <li v-for="(list, index) in dateArr" :key="index" @click="selectDate(index)"
                    :class="{selectStatus: list.selectStatus}">{{ list.column }}
                </li>
              </ul>
            </div>
            <div class="cont-button">
              <div>
                <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[2]}}</el-button>
              </div>
              <div>
                <el-button type="primary" class="timeButton" @click="submitAll(false, 'reset')">{{autoNo[3]}}
                </el-button>
              </div>
            </div>
          </div>

        </transition>
      </template>
      <template slot="list">
        <el-card shadow='never'>
          <div class="box-container">
            <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
            <!-- 排序 -->
            <!-- <div class="sort" id="sortColumn" style="width: 100%">
              <totalNum :totalNum="totalNum"></totalNum>
            </div> -->
            <div class="no-list" v-if="listInfo.length == 0">
              <v-noInfo></v-noInfo>
            </div>
            <!---->
            <div :class="{noSort: this.$route.fullPath == '/ipo/search'}" v-else>
              <div class="sort" id="sortColumn" style="width: 100%">
                <totalNum :totalNum="totalNum"></totalNum>
              </div>
              <div class="listContent" style="padding: 0 16px">
                <!--<v-list :info="this.info" sort="/rule/details" @seniorButton="seniorMethod" :noInfo="isInfo"-->
                <!--:loading='this.loading'></v-list>-->
                <v-list :data="this.listInfo" sort="/ipo/details" @seniorButton="seniorMethod" :noInfo="isInfo"></v-list>
              </div>
              <div class="vxa-flax-box align foot-pagination" v-show="!isInfo">
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
        </el-card>
      </template>
      <template slot="adv">
        <v-adv :pageName="'投关检索'"></v-adv>
        <v-company-will-item></v-company-will-item>
        <v-company-new-i-p-o-count-item></v-company-new-i-p-o-count-item>
      </template>
    </search>
  </div>
</template>

<script>
  import VList from './components/list'
  import VCompanyWillItem from './components/company/companyWillItem'
  import VCompanyNewIPOCountItem from './components/company/companyNewIPOCountItem'
  import totalNum from '@/components/totalNum.vue'
  import search from '@/components/commonSearch.vue'
  export default {
    name: "ipo-search",
    components: {
      VList,
      VCompanyWillItem,
      VCompanyNewIPOCountItem,
      totalNum,
      search
    },
    data() {
      return {
        hideAfter: 500,
        listInfo: [],
        loading: true,
        restaurants: [],
        state: '',
        timeout: null,
        inputCode: '', // user inpput code
        inputText: '', // user inpput affiche text
        gridData: [],  // code autocomplete
        gridText: [],  // affiche autocomplete
        sort: [
          {id: '0', name: '默认排序', isActive: true, up: true},
//          {id: '1', name: '阅读量', isActive: false, up: true},
          {id: '1', name: '提问日期', isActive: false, up: true}
        ],
        sortMethod: '默认排序',
        sortFlag: false,
        total: 50,
        showPanel: '', // isShow panel
        startDate: '',
        startEnd: '',
        titleIncludes: '', // 标题必含关键字
        titleMaybeIncludes: '', // 标题可含关键字
        titleExcludes: '', // 标题不含关键字
        contentIncludes: '', // 全文必含关键字
        contentMaybeIncludes: '', // 全文可含关键字
        contentExcludes: '', // 全文不含关键字
        // 筛选区
        screenListList: ['全部', '所属板块', '所属行业', '文件类别', '发布日期'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], titleName: '全部', title: '全部', class: 'all', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], titleName: '所属板块', title: '所属板块', class: '', type: 'market', isSelect: false, list: []},
          {id: 2, name: [], titleName: '所属行业', title: '所属行业', class: '', type: 'industry', isSelect: false, list: []},
          {id: 3, name: [], titleName: '文件类别', title: '文件类别', class: '', type: 'category', isSelect: false, list: []},
          {id: 4, name: [], titleName: '发布日期', title: '发布日期', class: 'time', type: 'date', isSelect: false, list: []}
        ],
        allMapping: [],
        boxContent: false,
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        //
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        indent: 23,
        data4: [
          {id: 1, label: '沪市主板'},
          {id: 2, label: '深市中小板'},
          {id: 3, label: '深市创业板'},
          {id: 4, label: '深市主板'}
        ],
        isStatus: 0,
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规名称，多关键词用空格隔开，如：上市', '请输入关键词，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
        activeName: '1',
        value1: '',
        value2: '',
        boxContentTi: true,
        isInfo: false, // 是否存在搜索结果
        monthDate: '',
        monthEnd: '',
        describeText: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        dateArr: [
          {id: 0, column: '今天', selectStatus: false},
          {id: 1, column: '昨天', selectStatus: false},
          {id: 2, column: '最近3天', selectStatus: false},
          {id: 3, column: '最近一周', selectStatus: false},
          {id: 4, column: '最近一月', selectStatus: false},
          {id: 5, column: '最近一年', selectStatus: false}
        ],
        userId: '',
        userInfo: {},
        totalNum: '',
        isTitle: false, // 是否为搜索标题  组件传入匹配
        senior: 1, // 打开高级搜索 传给组件
        mapping: {}
      }
    },
    watch: {
      isStatus: function (val) {
        var button = document.getElementsByClassName('cont-button')[0]
        var date = document.getElementsByClassName('cont-containerDate')[0]
        var button1 = document.getElementsByClassName('timeButton')[0]
        var button2 = document.getElementsByClassName('timeButton')[1]
        if (this.screenList[val].type == 'date') {
          date.style.cssText = 'float:left;width:70%;'
          button.style.cssText = 'float:left;width:30%;margin:0;'
          button1.style.cssText = 'width:90%;margin:20px 15px 20px 0;height:36px;line-height:36px;padding:0;font-size: 14px;'
          button2.style.cssText = 'width:90%;margin:20px 0;height:36px;line-height:36px;padding:0;font-size: 14px;'
        } else {
          date.style.cssText = 'display:none;'
          button.style.cssText = 'display: table;width:100%;margin-top: 15px;margin-bottom: 15px;'
          button1.style.cssText = 'width: 250px;height: 44px;font-size: 18px;line-height:1;padding:12px 20px;'
          button2.style.cssText = 'width: 250px;height: 44px;font-size: 18px;line-height:1;padding:12px 20px;'
        }
      },
      $route: function (val, form) {
        console.log(val, form);
      },
      // 筛选项的过滤
      filterText: function (val) {
        this.$refs.tree2.filter(val)
        if (val == '') {
          this.$nextTick(() => {
            this.itemStyle();
          })
        }
      }
    },
    created() {
      this.preparation();
    },
    methods: {
      handlePageChange(val) {
        this.page.size = val;
        this.page.index = 1;
        this.searchList()
      },
      // 筛选处选择时间
      selectDate(index) {
        if (index == '0') {
          this.startDate = this.$common.getBeforeDate('0')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '1') {
          this.startDate = this.$common.getBeforeDate('1')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '2') {
          this.startDate = this.$common.getBeforeDate('2')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '3') {
          this.startDate = this.$common.getBeforeDate('6')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '4') {
          this.startDate = this.$common.getBeforeDate('30')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '5') {
          this.startDate = this.$common.getBeforeDate('365')
          this.startEnd = this.$common.getBeforeDate('0')
        }
        this.dateArr.forEach((item) => {
          this.$set(item, 'selectStatus', false);
        })
        this.$set(this.dateArr[index], 'selectStatus', true);
      },
      //
      boxContClick() {
        this.boxContent = false;
        this.screenList.forEach((item) => {
          this.$set(item, 'isSelect', false);
        });
      },
      // 筛选项样式
      itemStyle() {
        var k = '25%'
        var content = document.getElementsByClassName('xiaoan-box-content')[0];
        let calc = `width: 100%; width:-moz-calc(100% + 30px); width:-webkit-calc(100% + 30px); width: calc(100% + 30px);
                    left: 0; left:-moz-calc(0px - 15px); left: -webkit-calc(0px - 15px); left: calc(0px - 15px);`
        if (this.screenList[this.isStatus].type == 'date') {
          k = '20%'
          content.style.cssText = `right:0;padding:0 20px;${calc}`
        } else if (this.isStatus == '1') {
          k = '50%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        } else if (this.isStatus == '2') {
          k = '33%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        } else {
          k = '50%'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      // 重置高级条件
      resetSenior() {
        this.startDate = ''
        this.startEnd = ''
        this.titleIncludes = '' // 标题必含关键字
        this.titleMaybeIncludes = '' // 标题可含关键字
        this.titleExcludes = '' // 标题不含关键字
        this.contentIncludes = '' // 全文必含关键字
        this.contentMaybeIncludes = '' // 全文可含关键字
        this.contentExcludes = '' // 全文不含关键字
        this.inputCode = ''
        this.inputText = ''
      },
      //
      setQuery(type, status) {
        var data;
        if (status == 'string') {
          data = (this.$route.query[type] == undefined || this.$route.query[type] == '') ? '' : this.$common.transComma(this.$route.query[type])
        } else if (status == 'array') {
          data = this.$route.query[type] == undefined ? [] : this.$route.query[type].split(',');
        } else if (status == 'number') {
          data = (this.$route.query[type] == '' || this.$route.query[type] == undefined) ? '' : this.$route.query[type]
        }
        return data;
      },
      // 保存状态
      statusDefault() {
        this.screenList[1].list = this.setQuery('marketType', 'array');
        this.screenList[2].list = this.setQuery('industry', 'array');
        this.screenList[3].list = this.setQuery('confition', 'array');
        if (this.$route.query.startTime || this.$route.query.endTime) {
          this.screenList[4].list = [];
          this.screenList[4].list.push(this.$route.query.startTime + '---' + this.$route.query.endTime);
          this.screenList[4].title = this.$route.query.startTime + '---' + this.$route.query.endTime;
        }
        //
        this.titleIncludes = this.setQuery('mustTitle', 'string');
        this.titleExcludes = this.setQuery('exceptTitle', 'string');
        this.titleMaybeIncludes = this.setQuery('possibleTitle', 'string');
        //
        this.contentIncludes = this.setQuery('mustContent', 'string');
        this.contentExcludes = this.setQuery('exceptContent', 'string');
        this.contentMaybeIncludes = this.setQuery('possibleContent', 'string');
        //
        this.inputText = this.setQuery('keyword', 'string');
        this.inputText = decodeURI(this.inputText)
        //
        this.page.index = Number(this.setQuery('pageNum', 'number'));
        this.page.size = Number(this.setQuery('pageSize', 'number'));
        this.startDate = this.setQuery('startTime', 'number');
        this.startEnd = this.setQuery('endTime', 'number');
        //
        if (this.page.index < 1) {
          this.page.index = 1;
        }
        if (this.page.size < 10) {
          this.page.size = 30;
        }
        //
        let market = [], industry = [], confition = [];
        this.allMapping[1].forEach((item, i) => {
          this.screenList[1].list.forEach((list, j) => {
            if (item.id == list) {
              market.push(item.label)
            }
          })
        });
        //
        this.allMapping[2].forEach((item, i) => {
          this.screenList[2].list.forEach((list, j) => {
            if (item.id == list) {
              industry.push(item.label)
            }
          })
        })
        //
        this.allMapping[3].forEach((item, i) => {
          this.screenList[3].list.forEach((list, j) => {
            if (item.id == list) {
              confition.push(item.label)
            }
          })
        })
        //
        if (this.startDate != '' || this.startEnd != '') {
          this.screenList[this.allMapping.length - 1].title = this.startDate + ' ' + this.startEnd
        }
        //
        if (market.length != 0) {
          this.screenList[1].title = market.toString()
        }
        if (industry.length != 0) {
          this.screenList[2].title = industry.toString()
        }
        if (confition.length != 0) {
          this.screenList[3].title = confition.toString()
        }
        this.inputCode = this.code
        this.searchList()
      },
      // 点击确认筛选
      submitAll(type) {
        if (!type) {
          if (this.screenList[this.isStatus].titleName == '发布日期') {
            this.screenList[this.isStatus].list = [];
            this.screenList[this.isStatus].list.push(this.startDate + '---' + this.startEnd)
          } else {
            this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
            this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
          }
        }
        if (type && typeof type == 'object') {
          for (let key in type) {
            if (key == 'startDate' || key == 'startEnd') {
              if (type[key]) {
                this[key] = type[key]
                // if (key == 'startEnd') {
                //   this.startEnd = type[key];
                // }
                for (let data of this.screenList) {
                  if (data.titleName == '发布日期') {
                    data.list = [];
                    data.list.push(this.startDate + '---' + this.startEnd)
                  }
                }
              }
            } else {
              this[key] = type[key];
            }
          }
        }

        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        // if (!type) {
          let names = []
          console.log(this.screenList[this.isStatus])
          if (this.screenList[this.isStatus].name.length != 0) {
            for (let i = 0; i < this.screenList[this.isStatus].name.length; i++) {
              names.push(this.screenList[this.isStatus].name[i].label)
            }
            this.screenList[this.isStatus].title = names.join(',')
          } else {
            this.startDate = this.startDate ? this.startDate : ''
            this.startEnd = this.startEnd ? this.startEnd : ''
            if (this.screenListList[this.isStatus] == '发布日期') {
              if (this.startDate == '' && this.startEnd == '') {
                this.screenList[this.isStatus].title = '发布日期'
              } else {
                this.screenList[this.isStatus].title = this.startDate + '' + this.startEnd
              }
            } else {
              this.screenList[this.isStatus].title = this.screenListList[this.isStatus]
            }
          }
        // }
        let newObject = this.screenList[this.isStatus];
        let newIndex = this.screenListList[this.isStatus];
        let name = []
        // 当前的object
        this.screenList.forEach((item) => {
          this.$set(item, 'isSelect', false)
        });
        //
        if (newObject.name.length !== 0) {
          name = newObject.name.map(item => {
            return item.label
          });
          this.$set(this.screenList[this.isStatus], 'title', name.join('，'))
        } else {
          //
          if (newIndex.indexOf('发布日期') > -1) {
            // console.log('this.startDate + \'\' + this.startEnd', this.startDate + '-' + this.startEnd);
            if (!this.startDate && !this.startEnd) {
              this.$set(this.screenList[this.isStatus], 'title', '发布日期')
            } else {
              this.$set(this.screenList[this.isStatus], 'title', this.startDate + '-' + this.startEnd)
            }
          } else {
            this.$set(this.screenList[this.isStatus], 'title', newIndex);
          }
        }

        this.boxContent = false;
        // 用户状态保存
        this.page.index = 1;
        this.synchronizationRouter()
        this.searchList()
      },
      // 重置筛选项
      resetAll() {
        this.screenList[this.isStatus].list.forEach((item) => {
          this.$refs.tree2.setChecked(item, false, false)
        })
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
      },
      // 设置url 拼接参数
      synchronizationRouter() {
        this.$router.push({
          path: '/ipo/search', query: {
            mustTitle: this.$common.transStr(this.titleIncludes), // this.titleIncludes,
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            mustContent: this.$common.transStr(this.contentIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            keyword: this.$common.transStr(this.inputText),
            startTime: this.startDate, // 起始时间
            endTime: this.startEnd, // 结束时间
            marketType: this.screenList[1].list.toString(), // 板块
            industry: this.screenList[2].list.toString(), // 所属行业
            confition: this.screenList[3].list.toString(), // 文件类型
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        })
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      //
      currentChange(data, el) {
        console.log(321, this.screenList[this.isStatus]);
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.tree2.setChecked(data.id, true, false);
          //
          if (this.screenList[this.isStatus].list.length > 1) {
            this.resetAll();
            this.$refs.tree2.setChecked(data.id, true, false);
          }
        }
      },
      // 选择筛选条件
      handleNodeClick(data) {
        console.log(data, this.screenList[this.isStatus].type);
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.tree2.setChecked(data.id, true, false)
          if (this.screenList[this.isStatus].list.length > 0) {
            this.resetAll();
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.tree2.setChecked(data.id, false, false)
              }
            }
          }
        } else {
          if (data.children == undefined) {
            this.$refs.tree2.setChecked(data.id, true, false)
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.tree2.setChecked(data.id, false, false)
              }
            }
          }
        }
      },
      //
      handleCheckChange() {
        this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
      },
      // 获取筛选的类
      preparation() {
        let marketData = [], industryData = [], confitionData = [];
        this.$http({
          method: 'GET',
          url: this.$api.publish.filterConditions,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            var content = res.data.returnObject;
            var market = content.marketTypeConditions; // 板块类别
            var industry = content.industryConditions; // 所属行业
            var confitions = content.ipoTypeConfitions; // 文件类别
            //
            marketData = market.map(e => {
              return {id: e.id, label: e.name}
            });
            //
            industryData = industry.map((e) => {
              return {id: e.id, label: e.name}
            });
            //
            confitionData = confitions.map((e) => {
              return {id: e.id, label: e.name}
            });
            //
            this.allMapping = [[], marketData, industryData, confitionData, []];
            this.mapping = {
              '所属板块': marketData,
              '所属行业': industryData,
              '文件类别': confitionData
            }
            //
            this.statusDefault()
          }
        }).catch((err) => {
          console.log(err)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      deleteType(data, type) {
        this.isStatus = data.status;
        this.initTree(this.isStatus);
        this.boxContClick();
        if (type == 'all') {
          this.resetAll();
          this.screenList[this.isStatus].list = [];
          this.screenList[this.isStatus].name = [];
          this.screenList[this.isStatus].title = '';
        } else {
          this.handleNodeClick(data);
          for (let i = 0; i < this.screenList.length; i++) {
            for (let j = 0; j < this.screenList[i].list.length; j++) {
              if (data.id == this.screenList[i].list[j]) {
                this.screenList[i].list.splice(j, 1);
              }
            }
          }
        }
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
        // this.resetAll();
        this.submitAll(true);
      },
      initTree(index) {
        this.isStatus = index;
        this.filterText = '';
        // console.log(index, '选择筛选模块', this.screenList[index].list, this.screenList);
        this.screenList.forEach((item, i) => {
          if (item.title == '适用范围' || item.title == '所属行业') {
            item.list = []
            item.name = []
          }
          if (item.title == '发布日期') {
            this.dateArr.forEach((b) => {
              this.$set(b, 'selectStatus', false)
            })
          }
          if (i != index) {
            this.$set(item, 'isSelect', false);
          }
        });
        //
        this.$refs.tree2.setCheckedKeys(this.screenList[index].list, false);
        this.boxContentTi = true
        //
        if (index == 0) {
          // 点击了全部
          this.boxContent = false
          this.screenList.forEach((item, index) => {
            item.list = []
            item.name = []
            item.title = this.screenListList[index];
          });
          this.submitAll()
        } else {
          // 其他
          if (this.screenList[index].type == 'date') {
            this.boxContentTi = false
          }
          this.data4 = this.allMapping[index];
          if (this.screenList[index].isSelect) {
            this.screenList[index].isSelect = false
            this.boxContent = false
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = true
          }
        }
        // this.$nextTick(() => {
        //   this.itemStyle()
        // })
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.initTree(index);
        this.$nextTick(() => {
          this.itemStyle()
        })
      },
      // 选择页数
      selectPage(e) {
        this.page.index = e;
        this.synchronizationRouter();
        this.$common.returnTop();
        // 通过监听来切换数据
        if (this.$route.fullPath == '/ipo/search') {
          this.submitAll()
        } else {
          this.searchList()
        }
      },
      // 打开高级搜索
      seniorMethod() {
        this.senior++;
        // this.showPanel = !this.showPanel;
        // this.boxContClick()
      },
      // 搜索方法
      searchList() {
        this.handlerSearchList();
      },
      // 搜索 api
      handlerSearchList() {
        this.loading = true;
        this.inputText = this.inputText ? this.inputText : ''
        this.startDate = this.startDate ? this.startDate : ''
        this.startEnd = this.startEnd ? this.startEnd : ''
        console.log(this.startEnd);
        var dateStart = '', dateEnd = ''
        dateStart = new Date(this.startDate + ' 00:00:00').getTime()
        dateEnd = new Date(this.startEnd + ' 00:00:00').getTime()
        if (this.startDate == '') {
          dateStart = '';
        }
        if (this.startEnd == '') {
          dateEnd = '';
        }
        // //
        this.$http({
          methods: 'GET',
          url: this.$api.publish.search,
          params: {
            mustTitle: this.$common.transStr(this.titleIncludes), // this.titleIncludes
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            mustContent: this.$common.transStr(this.contentIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            // //
            keyword: this.$common.transStr(this.inputText),
            releaseStartTime: dateStart,
            releaseEndTime: dateEnd,
            marketTypeEnum: this.screenList[1].list.toString(), // 板块
            industryCodeLevelOne: this.screenList[2].list.toString(), // 所属行业
            publishEnum: this.screenList[3].list.toString(), // 文件类别
            // //
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        }).then((res) => {
          setTimeout(() => {
            this.loading = false;
          });
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject.count == 0) {
              this.listInfo = []
              return false;
            }
            console.log(8888888888888888888888)
            this.page.total = Math.ceil(res.data.returnObject.count / this.page.size)
            this.totalNum = res.data.returnObject.count
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.isInfo = true
              this.listInfo = []
            } else {
              this.isInfo = false;
              var arrayListData = res.data.returnObject.list;
              this.listInfo = [];
              //
              arrayListData.forEach((item, i) => {
                var htmlDesc = '', obj = {}, link = '', desc = '', reg = /\s/g, highColorTitle = '',
                  highColorContent = '';
                //
                if (item.content) {
                  desc = item.content.replace(reg, '');
                }
                highColorTitle = this.inputText + ' ' + this.titleIncludes + ' ' + this.titleMaybeIncludes;
                highColorContent = this.inputText + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                htmlDesc = this.isBrowserChrome(highColorContent, desc);
                link = '/ipo/details?id=' + item.id;
                //
                obj = {
                  id: item.id,
                  title: this.$common.key(highColorTitle, item.title),
                  desc: htmlDesc,
                  industryLevelOne: item.industryLevelOne,
                  industryLevelTwo: item.industryLevelTwo,
                  releaseDate: item.releaseDate,
                  type: item.type,
                  marketType: item.marketType,
                  link: link,
                  fileType: this.returnFile(item.type).label,
                  show: false
                };
                this.listInfo.push(obj);
              });
              console.log('====>', this.listInfo);
            }
          } else {
            this.listInfo = [];
          }
        }).catch((err) => {
          setTimeout(() => {
            this.listInfo = [];
            this.loading = false;
          }, 3000)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message});
        })
      },
      //
      returnFile(id) {
        var fileType = this.allMapping[3];
        var name = '';
        fileType.forEach(e => {
          if (e.id == id) {
            name = e
          }
        })
        return name;
      },
      //  兼容 非chrome浏览器 只显示2行
      isBrowserChrome(highColorContent, content) {
        var strs = '';
        if (this.$common.browserSort() != 'Chrome') {
          // 兼容 非chrome浏览器 只显示2行
          this.isTitle ? strs = content : strs = this.$common.key(highColorContent, content) 
          if (strs.length > 250) {
            strs = strs.substring(0, 250) + '...'
          }
        } else {
          this.isTitle ? strs = content : strs = this.$common.key(highColorContent, content) 
        }
        return strs
      },
      // 点击执行搜索方法
      searchMethod() {
        console.log(this.showPanel, '-======>');
        if (this.showPanel) {
          // 高级
          this.inputText = '';
          this.page.index = 1;
        } else {
          // 全文
          this.titleIncludes = '' // 标题必含关键字
          this.titleMaybeIncludes = '' // 标题可含关键字
          this.titleExcludes = '' // 标题不含关键字
          this.contentIncludes = '' // 全文必含关键字
          this.contentMaybeIncludes = '' // 全文可含关键字
          this.contentExcludes = '' // 全文不含关键字
          this.page.index = 1;
        }
        this.startDate = this.startDate ? this.startDate : ''
        this.startEnd = this.startEnd ? this.startEnd : ''
        if (this.contentIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.contentMaybeIncludes.length == 1 || this.contentExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.submitAll()
        }
      },
      // autocomplete click
      selectCode(e) {
        this.inputCode = this.gridData[e].code
      },
      // autocomplete affiche click
      selectText(e) {
        this.inputText = this.gridText[e]
      },
      //
      inputFocus() {
        this.boxContClick()
      }
    }
  }
</script>

<style lang="scss">
  .screen-tooltip-affiche {
    padding: 5px;
    border-radius: 2px;
    margin-top: 5px !important;
    color: #8d8d8d !important;
    border: 1px solid #e3e3e3 !important;
    box-shadow: 0 1px 1px #f0f1f3 !important;
    span {
      font-size: 14px;
    }
    .popper__arrow, .popper__arrow:after {
      display: none;
      border: 0;
    }
  }
  .contentShadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 100;
  }
  .inputCode {
    top: 135px !important;
    border-radius: 4px !important;
    li {
      width: auto;
      height: auto;
      overflow: hidden;
      padding: 10px 0;
      box-sizing: border-box;
      span {
        float: left;
        width: 50%;
      }
      &:hover {
        background: rgba(240, 241, 245, .6);
      }
    }
  }
  .inputText {
    padding: 0 10px;
    width: 730px !important;
    box-sizing: border-box;
    top: 135px !important;
    border-radius: 4px !important;
    ul {
      li {
        width: auto;
        height: auto;
        overflow: hidden;
        padding: 10px 0;
        box-sizing: border-box;
        span {
          float: left;
          width: 50%;
        }
        &:hover {
          background: #f8ecde;
          color: #fff;
        }
      }
    }
  }
</style>

<style lang="scss">
  #ipo-search {
    width: 100%;
    height: auto;
    background: #fff;
    .container {
      .box-card {
        margin-bottom: 15px;
      }
    }
    @import "../../styles/search-header-style";
    .screen {
      width: 100%;
      margin: 0 auto;
      height: auto;
      padding: 0 0 0 0;
      position: relative;
      z-index: 1000;
      border: 0;
      .xiaoan-box-content {
        width: 100%;
        height: auto;
        position: absolute;
        top: 49px;
        left: 0;
        background: #ffffff;
        z-index: 120;
        padding: 0 45px;
        border: 1px solid #e3e3e3;
        border-top: 0;
        box-shadow: 0 1px 1px #e3e3e3;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        .cont-button {
          margin-top: 15px;
          margin-bottom: 15px;
          width: 100%;
          display: table;
          font-size: 0;
          div {
            display: table-cell;
            width: 50%;
            font-size: 18px;
            margin: 0 auto;
            .el-button {
              width: 250px;
              height: 44px;
              font-size: 18px;
            }
          }
          div:first-child {
            text-align: right;
            .el-button {
              margin-right: 15px;
              background-color: white;
              color: #FFAC38;
            }
            .el-button:active {
              border-color: white;
              background-color: rgba(255, 172, 56, 0.4);
              color: #fff;
            }
          }
          div:last-child {
            text-align: left;
            .el-button {
              margin-left: 15px;
            }
          }

        }
        .cont-containerDate {
          width: 100%;
          .tableDate {
            display: inline-block;
            width: 48%;
            margin-right: 1%;
            .start, .end {
              width: 100%;
              height: 35px;
              display: table;
              margin-top: 20px;
              border-radius: 4px;
              -moz-box-shadow: 0px 0px 2px #FFB148;
              -webkit-box-shadow: 0px 0px 2px #FFB148;
              box-shadow: 0px 0px 2px #FFB148;
              overflow: hidden;
              span, input {
                width: 45px;
                display: table-cell;
                height: 35px;
                line-height: 35px;
                text-align: center;
                font-size: 14px;
                color: #636363;
              }
              span {
                color: white;
                background: #FFB148;
              }
              input {
                width: 100%;
                border: 0;
                border-radius: 0;
              }
              .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 100%;
                .el-input__prefix, .el-input__suffix {
                  display: none;
                }
                input {
                  padding: 0 0 0 15px;
                  text-align: left;
                }
              }
            }
          }
          .dateArr {
            width: 140%;
            height: auto;
            padding: 10px 0 20px 0;
            overflow: hidden;
            li {
              list-style: none;
              float: left;
              font-size: 12px;
              color: #323232;
              margin-right: 30px;
              padding: 0px 5px;
              border: 1px solid #fff;
              &:hover {
                color: #ffb148;
              }
            }
            li:last-child {
              margin-right: 0;
            }
            .selectStatus {
              border: 1px solid #ffb148;
              color: #ffb148;
              padding: 0 5px;
              border-radius: 2px;
            }
          }
        }
        .cont-container {
          .cont-tree {
            margin-top: 10px;
            /* margin-bottom: 20px;*/
            max-height: 300px;
            height: auto;
            overflow-y: auto;
            overflow-x: hidden;
            .filter-tree {
              .el-tree-node {
                .el-tree-node__content {
                  height: 40px;
                  border-radius: 2px;
                  &:hover {
                    background: rgba(240, 241, 245, .6);
                  }
                  .el-checkbox {
                    .el-checkbox__input {
                      .el-checkbox__inner {
                        height: 20px;
                        width: 20px;
                      }
                      .el-checkbox__inner::after {
                        width: 4.28px;
                        height: 10px;
                        top: 1.6px;
                        left: 6px;
                      }
                      .el-checkbox__inner::before {
                        top: 8px;
                      }
                    }
                  }
                  .el-tree-node__label {
                    //font-size: 14px;
                    color: #424345;
                  }
                  .el-tree-node__expand-icon {
                    font-size: 0;
                    padding: 0;
                  }
                }
              }
            }
          }
          .cont-search {
            margin-top: 35px;
            display: table;
            width: 100%;
            div {
              display: table-cell;
            }
            .el-input {
              .el-input__inner {
                border: #FFAC38;
                -moz-box-shadow: 0px 0px 2px #FFB148;
                -webkit-box-shadow: 0px 0px 2px #FFB148;
                box-shadow: 0px 0px 2px #FFB148;
                height: 35px;
                border-bottom-right-radius: 0;
                border-top-right-radius: 0;
                border-right-width: 0;
              }
            }
            .ruleBtn {
              display: table-cell;
              vertical-align: middle;
              border: 0;
              color: #fff;
              font-size: 15px;
              button {
                -moz-box-shadow: 0px 0px 2px #FFB148;
                -webkit-box-shadow: 0px 0px 2px #FFB148;
                box-shadow: 0px 0px 2px #FFB148;
                height: 35px;
                font-size: 20px;
                padding: 0;
                width: 60px;
                border-bottom-left-radius: 0;
                border-top-left-radius: 0;
              }
            }
          }
        }
      }
      .screen-box {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        vertical-align: middle;
        border: none;
        position: relative;
        z-index: 199;
        li {
          flex: 1;
          // margin-right: 30px;
          // display: table-cell;
          text-align: center;
          vertical-align: middle;
          box-sizing: border-box;
          border: none;
          // width: 20.5%;
          font-size: 0;
          &:last-child {
            flex: 0 0 15%;
            text-align: right;
            // margin-right: 0;
          }
          &:first-child {
            flex: 0 0 10%;
            border-bottom-color: #e3e3e3;
            text-align: left;
            border-right: 0;
            border-left: 1px solid #fff;
            .isActive {
              color: #FFAC38;
              box-sizing: border-box;
              height: 46px;
              padding-top: 8px;
              margin-top: 3px;
              padding-right: 20px;
              text-align: left;
              border: 1px solid #fff;
              border-bottom: 1px solid #e3e3e3;
              -webkit-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
          div {
            box-sizing: border-box;
            height: 46px;
            padding-top: 8px;
            margin-top: 3px;
            border: 1px solid #fff;
            // border-bottom: 1px solid #e3e3e3;
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            span {
              font-size: 16px;
              vertical-align: middle;
              color: #323232;
              outline: none;
            }
            i {
              color: #FFAC38;
              vertical-align: middle;
              display: inline-block;
              transition: transform .3s, -webkit-transform .3s;
              transform: rotate(0deg);
              line-height: 20px;
              margin-left: 8px;
            }
            .web-sanjiaoxing:before {
              font-size: 14px !important;
              display: block;
              transform: scale(0.7, 0.7);
              -ms-transform: scale(0.7, 0.7); /* IE 9 */
              -moz-transform: scale(0.9, 0.9); /* Firefox */
              -webkit-transform: scale(0.7, 0.7); /* Safari 和 Chrome */
              -o-transform: scale(0.7, 0.7); /* Opera */
            }
            .el-icon-arrow-down:before {
              content: "\E60B";
            }
          }
          div:hover {
            color: #FFAC38;
            span {
              color: #FFAC38;
            }
          }
          .isActive {
            box-sizing: border-box;
            height: 46px;
            padding-top: 8px;
            margin-top: 3px;
            text-align: center;
            border: 1px solid #e3e3e3;
            border-bottom: 1px solid #fff;
            -webkit-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            .focusing {
              outline: none;
            }
            i {
              transition: transform .3s, -webkit-transform .3s;
              transform: rotate(180deg);
            }
            * {
              color: #FFAC38;
            }
          }
        }
      }
    }
    .no-list {
      position: relative;
      min-height: 700px;
      width: 100%;
    }
    .sort {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      // margin: 15px auto;
      cursor: pointer;
      line-height: 40px;
      padding: 0 18px;
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
        i {
          display: inline-block;
          transition: transform .3s, -webkit-transform .3s;
          transform: rotate(0deg);
          line-height: 20px;
          margin-left: 8px;
          color: #a6a6a6;
        }
        .web-sanjiaoxing:before {
          font-size: 5px !important;
          display: block;
          transform: scale(0.7, 0.7);
        }
        .el-icon-arrow-down:before {
          content: '\E60B'
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
        margin-right: 95px;
      }
    }
  }
</style>
