<template>
  <div class="rule" id="rule" v-loading.fullscreen.lock="loading" style="min-height: 600px">
    <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
    <search @submitAll="submitAll" @screenIsActive="screenIsActive" @deleteType='deleteType'
            :senior="senior" :auto="true" :placeholder="autoNo[2]" :allMapping="mapping" :stockCode="false" :titleList="screenList">
      <template slot="title">法规</template>
      <template slot="info">小安为您整理的有关沪深交易所上市公司合规运作的法律法规、通知文件等。每日及时更新，按需分类，供您快速查阅。</template>
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
                <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[3]}}</el-button>
              </div>
              <div>
                <el-button type="primary" class="timeButton" @click="submitAll(false, 'reset')">{{autoNo[4]}}
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
            <div class="sort" id="sortColumn" style="width: 100%">
              <!-- 排序 -->
              <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="handleSelectSort(index)">
                <span>{{ list.name }}</span>
                <i class="iconfont web-sanjiaoxing up" :class="{hide: !list.isActive}"></i>
              </div>
              <!-- 翻页 -->
              <!-- <v-page :flip="flip" :total="total" v-on:addition="addition" v-on:subtraction="subtraction"></v-page> -->
              <totalNum :totalNum="totalNum"></totalNum>
            </div>
            <!---->
            <div :class="{noSort: this.$route.fullPath == '/rule'}">
              <div class="listContent" style="padding: 0 16px">
                <!--<v-list :info="this.info" sort="/rule/details" @seniorButton="seniorMethod" :noInfo="isInfo"-->
                <!--:loading='this.loading'></v-list>-->
                <v-list :data="this.info" sort="/rule/details" @seniorButton="seniorMethod" :noInfo="isInfo"></v-list>
              </div>
              <div class="vxa-flax-box align foot-pagination" v-show="!isInfo">
                <div class="col">
                  <el-pagination class="vxa-footer-page-pagination"
                                 @current-change="selectPage"
                                 layout="prev, pager, next, jumper"
                                 :current-page="flip"
                                 :page-count="total">
                  </el-pagination>
                </div>
                <div class="col button-group t-right">
                  <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="pageSize"
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
        <v-adv :pageName="'法规检索'"></v-adv>
      </template>
    </search>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import list from './components/list.vue'
  import page from '@/components/customPage.vue'
  import search from '@/components/commonSearch.vue'
  import totalNum from '@/components/totalNum.vue'

  export default {
    mixins: [mixins],
    data() {
      return {
        loading: true,
        hideAfter: 500,  // hover 筛选框的预提示
        autoNo: ['换一个关键词吧！', '高级', '请输入法规关键词，多关键词用空格隔开，如：股东 减持', '重置', '确认', '从', '到', '搜索筛选条件'], // 页面的文字抽出
        info: [{id: '', title: '', describe: '', date: '', timeliness: '', plate: []}], // 默认的列表组件的格式
        isInfo: false, // 是否存在搜索结果
        sort: [
          {id: '0', name: '默认排序', isActive: true, up: false},
          {id: '1', name: '阅读量', isActive: false, up: true},
          {id: '2', name: '发布日期', isActive: false, up: true}
        ], // list sort method
        sortMethod: '默认排序',
        sortFlag: false, // 排序一栏
        flip: 1, // 默认页码
        total: 50, // 总页数
        pageSize: 30, // 每页10条
        showPanel: '', // isShow panel
        indent: 23, // 筛选项如果有二级 二级距离左侧的距离
        prestrain: [], // autoComplete的数据
        screenList: [
          {id: 0, name: [], titleName: '全部', title: '全部', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], titleName: '适用范围', title: '适用范围', type: 'marketStatus', isSelect: false, list: []},
          {id: 2, name: [], titleName: '发文单位', title: '发文单位', type: 'fawenStatus', isSelect: false, list: []},
          {id: 3, name: [], titleName: '规则类别', title: '规则类别', type: 'guizeStatus', isSelect: false, list: []},
          {id: 4, name: [], titleName: '时效性', title: '时效性', type: '', isSelect: false, list: []},
          {id: 5, name: [], titleName: '发布日期', title: '发布日期', type: 'date', isSelect: false, list: []}
        ], // 筛选项的条件
        screenListList: ['全部', '适用范围', '发文单位', '规则类别', '时效性', '发布日期'], // 筛选默认显示的title格式
        boxContent: false, // 筛选框
        boxContentTi: true, // 区分 筛选项的二级  和 发布日期控制
        filterText: '',  // 筛选项里的搜索
        defaultProps: {children: 'children', label: 'label'}, // 筛选项类的数据 格式
        data4: [{id: '', label: ''}], // 筛选项的二极类
        isStatus: 0, // 当前打开的筛选项
        allMapping: [], // 筛选项 处理好的集合
        mapping: {},
        sortType: '', // 搜索排序
        inputText: '', // user inpput affiche text
        titleIncludes: '', // 标题包含
        titleExcludes: '', // 标题不包含
        titleMaybeIncludes: '', // 标题可能包含
        contentIncludes: '', // 全文包含
        contentExcludes: '', // 全文不包含
        contentMaybeIncludes: '', // 全文可能包含
        fullTextIncludes: '', // 正文包含
        fullTextExcludes: '', // 正文不包含
        fullTextMaybeIncludes: '', // 正文可能包含
        startDate: '1994-12-16',  // 发布日期（起）
        startEnd: '',  // 发布日期（至）
        monthDate: '',
        monthEnd: '',
        dateArr: [
          {id: 0, column: '今天', selectStatus: false},
          {id: 1, column: '昨天', selectStatus: false},
          {id: 2, column: '最近3天', selectStatus: false},
          {id: 3, column: '最近一周', selectStatus: false},
          {id: 4, column: '最近一月', selectStatus: false},
          {id: 5, column: '最近一年', selectStatus: false}
        ],
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
        haveNote: null,
        isTitle: false, // 是否为搜索标题  组件传入匹配
        senior: 1, // 打开高级搜索 传给组件
        totalNum: ''
      }
    },
    // 使用其它组件
    components: {
      'v-list': list,
      'v-page': page,
      totalNum: totalNum,
      search
    },
    // 方法
    computed: {},
    watch: {
      startEnd(val) {
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
            if (val !== this.$common.getBeforeDate('0')) {
              this.dateArr[i].selectStatus = false
            }
          }
        }
      },
      startDate(val) {
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
            if (i < 3) {
              if (val !== this.$common.getBeforeDate(i)) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 3) {
              if (val !== this.$common.getBeforeDate('6')) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 4) {
              if (val !== this.$common.getBeforeDate('30')) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 5) {
              if (val !== this.$common.getBeforeDate('365')) {
                this.dateArr[i].selectStatus = false
              }
            }
          }
        }
      },
      monthDate(val) {
        if (val == '' && this.monthEnd == '') {
          this.screenList[5].title = '发布日期'
        }
      },
      // 监听 this.total 发生变化后this.flip = 1;
      total() {
        // this.flip = 1;
      },
      flip: function () {
        this.$common.returnTop()
        // 通过监听来切换数据
        if (this.$route.fullPath !== '/rule') {
          this.submitAll()
        } else {
          this.lawSearch()
        }
      },
      // 筛选框的显示
      boxContent: function () {
        if (this.boxContent) {
        } else {
          this.screenList[0].isSelect = true
        }
        this.itemStyle()
      },
      inputText: function () {
        if (this.inputText == '' || this.inputText == null || this.inputText.length == 0) {
        }
      },
      prestrain: function (val) {
        var tit = document.getElementsByClassName('ele-popover')
        if (val.length == 0) {
          tit[0].style.zIndex = '-10'
        } else {
          tit[0].style.zIndex = '2000'
        }
      },
      // 筛选项的过滤
      filterText: function (val) {
        this.$refs.tree2.filter(val)
        if (val == '') {
          var k = '25%'
          var content = document.getElementsByClassName('xiaoan-box-content')[0]
          let calc = `width: 100%; width:-moz-calc(100% + 30px); width:-webkit-calc(100% + 30px); width: calc(100% + 30px);
                    left: 0; left:-moz-calc(0px - 15px); left: -webkit-calc(0px - 15px); left: calc(0px - 15px);`
          this.$nextTick(() => {
            if (this.isStatus == '1' || this.isStatus == '2' || this.isStatus == '3') {
              k = '33%'
              content.style.cssText = `right:auto;padding:0 45px;${calc}`
            } else if (this.isStatus == '5') {
              k = '50%'
              content.style.cssText = `right:0;padding:0 20px;${calc}`
            } else if (this.isStatus == '0') {
              content.style.cssText = 'display:none'
            } else {
              k = '50%'
              content.style.cssText = `right:auto;padding:0 45px;${calc}`
            }
            var tree = document.getElementsByClassName('el-tree-node')
            for (var i = 0; i < tree.length; i++) {
              tree[i].style.display = 'inline-block'
              tree[i].style.width = k
            }
          })
        }
      },
      isStatus: function (val) {
        var button = document.getElementsByClassName('cont-button')[0]
        var date = document.getElementsByClassName('cont-containerDate')[0]
        var button1 = document.getElementsByClassName('timeButton')[0]
        var button2 = document.getElementsByClassName('timeButton')[1]
        if (val == '5') {
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
      '$route': function (val) {
        if (val.fullPath == '/rule') {
          this.monthDate = this.$common.getBeforeDate(30)
          this.monthEnd = this.$common.getBeforeDate(0)
          this.sortType = '发布日期'
        } else {
          this.$nextTick(() => {
            document.getElementById('sortColumn').style.display = 'block!important'
          })

          if (this.inputText == '' && this.titleIncludes == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '') {
            this.monthDate = this.$common.getBeforeDate(30)
            this.monthEnd = this.$common.getBeforeDate(0)
            // this.sortType = '发布日期'
          } else {
            this.monthDate = ''
            this.monthEnd = ''
          }
          this.monthDate = ''
          this.monthEnd = ''
        }
      }
    },
    methods: {
      handlePageChange() {
        this.flip = 1;
        this.lawSearch()
      },
      // 筛选处选择时间
      selectDate(index) {
        for (var i in this.dateArr) {
          this.dateArr[i].selectStatus = false
        }
        this.dateArr[index].selectStatus = true
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
      },
      // 筛选项样式
      itemStyle() {
        var k = '25%'
        var content = document.getElementsByClassName('xiaoan-box-content')[0];
        let calc = `width: 100%; width:-moz-calc(100% + 30px); width:-webkit-calc(100% + 30px); width: calc(100% + 30px);
                    left: 0; left:-moz-calc(0px - 15px); left: -webkit-calc(0px - 15px); left: calc(0px - 15px);`
        if (this.isStatus == '1' || this.isStatus == '2' || this.isStatus == '3') {
          k = '33%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        } else if (this.isStatus == '5') {
          k = '50%'
          content.style.cssText = `right:0;padding:0 20px;${calc}`
        } else if (this.isStatus == '0') {
          content.style.cssText = 'display:none'
        } else {
          k = '50%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      searchMethod() {
        // 敏感词检测
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        if (this.checkWordSearch(this.inputText)) {
          this.$set(this.tipShow, 0, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }
        if (this.checkWordSearch(this.titleIncludes)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        }
        if (this.checkWordSearch(this.titleMaybeIncludes)) {
          this.$set(this.tipShow, 2, true)
          return false
        } else {
          this.$set(this.tipShow, 2, false)
        }
        if (this.checkWordSearch(this.titleExcludes)) {
          this.$set(this.tipShow, 3, true)
          return false
        } else {
          this.$set(this.tipShow, 3, false)
        }
        if (this.checkWordSearch(this.contentIncludes)) {
          this.$set(this.tipShow, 4, true)
          return false
        } else {
          this.$set(this.tipShow, 4, false)
        }
        if (this.checkWordSearch(this.contentMaybeIncludes)) {
          this.$set(this.tipShow, 5, true)
          return false
        } else {
          this.$set(this.tipShow, 5, false)
        }
        if (this.checkWordSearch(this.contentExcludes)) {
          this.$set(this.tipShow, 6, true)
          return false
        } else {
          this.$set(this.tipShow, 6, false)
        }

        this.startDate = this.startDate ? this.startDate : ''
        this.startEnd = this.startEnd ? this.startEnd : ''
        // 增加关键词判断
        if (this.titleIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.fullTextMaybeIncludes.length == 1 || this.fullTextExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.flip = 1
          this.sortType = ''
          this.submitAll()
        }
      },
      // 筛选\高级\初始化\控制的ajax
      lawSearch() {        // 点击确定发送请求数据
        this.loading = true
        this.inputText = this.inputText ? this.inputText : ''
        var dateStart = '', dateEnd = ''
        if (this.$route.fullPath !== '/rule') {
          if (this.inputText == '' && this.titleIncludes == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '' && this.startDate == '' && this.startEnd == '') {
//            dateStart = this.$common.getBeforeDate(30)
//            dateEnd = this.$common.getBeforeDate(0)
            dateStart = this.startDate
            dateEnd = this.startEnd
            // this.sortType = '发布日期'
            // for (let i in this.sort) {
            //   this.sort[i].isActive = false
            // }
            // this.sort[2].isActive = true
          } else {
            dateStart = this.startDate
            dateEnd = this.startEnd
          }
        } else {
          dateStart = this.monthDate
          dateEnd = this.monthEnd
        }
        let userId = this.$cookie.get('userId')
        if (!userId) {
          userId = ''
        }
        this.$http({
          method: 'GET',
          url: this.$api.rule.lawSearch,
          params: {
            pageNo: this.flip, // 页码
            pageSize: this.pageSize, // 每页行数
            unitIds: this.screenList[2].list.join(','), // 发文单位
            timelinessIds: this.screenList[4].list.join(','), // 时效性
            scopeId: this.screenList[1].list.join(','), // 板块
            cateIds: this.screenList[3].list.join(','), // 规则类别
            sortType: this.sortType, // 搜索排序，时间排序time
            releaseStart: dateStart, // 发布日期（起）
            releaseEnd: dateEnd, // 发布日期（止）
            titleIncludes: this.isTitle ? this.$common.transStr(this.inputText) : this.$common.transStr(this.titleIncludes), // this.$common.transStr(this.inputText), // 标题包含
            titleExcludes: this.$common.transStr(this.titleExcludes), // 标题不包含
            titleMaybeIncludes: this.$common.transStr(this.titleMaybeIncludes), // 标题可能包含
            contentIncludes: this.$common.transStr(this.contentIncludes), // 正文包含
            contentExcludes: this.$common.transStr(this.contentExcludes), // 正文不包含
            contentMaybeIncludes: this.$common.transStr(this.contentMaybeIncludes), // 正文可能包含
            fullTextIncludes: this.isTitle ? '' : this.$common.transStr(this.inputText), // this.$common.transStr(this.fullTextIncludes) 全文包含
            fullTextExcludes: this.$common.transStr(this.fullTextExcludes), // 全文不包含
            fullTextMaybeIncludes: this.$common.transStr(this.fullTextMaybeIncludes), // 全文可能包含
            type: 'law', // 类型, law, case, qa, 默认是law
            key: '',
            haveLawNote: this.haveNote,
            userId: userId
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1) {
            let content = res.data.returnObject
            this.total = this.$common.totalPage(content.count, this.pageSize) // 获取总的页数
            this.totalNum = content.count;
            this.info = []
            if (content.list) {
              this.isInfo = false
              for (var i = 0; i < content.list.length; i++) {
//                let plate = []
                var plate = content.list[i].markets ? content.list[i].markets : []
                if (plate !== []) {
                  plate.sort((a, b) => {
                    return a.marketId > b.marketId
                  })
                }
                let isNew = false
                if (content.list[i].PublishDate) {
                  if (content.list[i].PublishDate <= new Date().getTime()) {
                    if (content.list[i].PublishDate >= Date.parse(new Date(this.$common.getBeforeDate(14)))) {
                      isNew = true
                    }
                  }
                }
                var obj = {}
                var highColorContent = this.contentIncludes + ' ' + this.contentMaybeIncludes + ' ' + this.inputText
                // var highColorContent = this.fullTextIncludes + ' ' + this.fullTextMaybeIncludes + ' ' + this.inputText // + ' ' + this.titleMaybeIncludes + ' ' + this.titleIncludes
                // this.inputText + ' ' + this.titleMaybeIncludes + ' ' +
                var highColorTitle = this.titleIncludes + ' ' + this.titleMaybeIncludes + ' ' + this.fullTextIncludes + ' ' + this.inputText + ' ' + this.fullTextMaybeIncludes

                // 发文号为空是，显示发文单位
                let issued = ''
                if (content.list[i].referenceNumber && content.list[i].referenceNumber !== '无') {
                  issued = content.list[i].referenceNumber
                } else {
                  let organizations = content.list[i].organizations
                  if (organizations) {
                    for (let k in organizations) {
                      if (k <= 2) {
                        issued += organizations[k].value + ','
                      }
                    }
                  }
                  issued = issued.substring(0, issued.length - 1)
                }

                if (this.$common.browserSort() == 'Chrome') {

                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: this.isTitle ? content.list[i].content : this.$common.key(highColorContent, content.list[i].content), // this.inputText
                    listTitle: content.list[i].title,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].PublishDate)[0],
                    plate: plate,
                    isDescribe: false,
                    newLogo: isNew,
                    show: false
                  }
                } else {
                  var strs = this.isTitle ? content.list[i].content : this.$common.key(highColorContent, content.list[i].content) // this.inputText
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: strs,
                    listTitle: content.list[i].title,
                    // issued: content.list[i].referenceNumber,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].PublishDate)[0],
                    plate: plate,
                    isDescribe: false,
                    newLogo: isNew,
                    show: false
                  }
                }
                this.info.push(obj);
              }
              this.info[0].isDescribe = true;
            } else {
              // 搜索内容为空
              this.isInfo = true
              this.info = []
            }
          }
        }).catch((err) => {
          this.loading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // input 聚焦执行方法
      inputFocus() {
        this.boxContClick()
        this.autoComplete()
        var tit = document.getElementsByClassName('ele-popover')
        // if (this.prestrain.length == 0) {
        //   tit[0].style.zIndex = '-10'
        // } else {
        //   tit[0].style.zIndex = '2000'
        // }
      },
      //
      handleSelectSort(index) {
        this.flip = 1;
        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.sortType = this.sort[index].name
        if (index == '0') {
          this.sortType = ''
        }
        this.lawSearch()
      },
      selectSort(index) {
        index = 0
        if (this.$route.fullPath == '/rule') {
          index = 2
        } else {
          let sortType = this.$route.query.sortType
          if (sortType === '发布日期') {
            index = 2
          } else if (sortType === '阅读量') {
            index = 1
          } else if (sortType === '默认排序') {
            index = 0
          }
        }

        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.sortType = this.sort[index].name
        if (index == '0') {
          this.sortType = ''
        }

        this.lawSearch()
      },
      /**/
      boxContClick() {
        this.boxContent = false
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
      },
      // 点击确认  //  搜索按钮
      submitAll(type, reset) {
        if (reset == 'reset') {
          this.flip = 1;
        }
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
          // for (let key in type) {
          //   this[key] = type[key];
          // }
        }
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        // if (!type) {
          let names = []
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
        this.boxContent = false
        this.$router.push({
          path: 'rule', query: {
            havenote: this.haveNote ? 1 : 0,
            keys: '',
            market: this.screenList[1].list.join('##'),
            unitIds: this.screenList[2].list.join('##'),
            cateIds: this.screenList[3].list.join('##'),
            timelinessIds: this.screenList[4].list.join('##'),
            titleIncludes: this.$common.transStr(this.titleIncludes), // this.$common.transStr(this.inputText)
            titleExcludes: this.$common.transStr(this.titleExcludes),
            titleMaybeIncludes: this.$common.transStr(this.titleMaybeIncludes),
            contentIncludes: this.$common.transStr(this.contentIncludes), // this.$common.transStr(this.fullTextIncludes)
            contentExcludes: this.$common.transStr(this.contentExcludes),
            contentMaybeIncludes: this.$common.transStr(this.contentMaybeIncludes),
            fullTextIncludes: this.$common.transStr(this.inputText),
            flip: this.flip,
            sortType: this.sortType,
            releaseStart: this.startDate,
            releaseEnd: this.startEnd
          }
        })
        if (this.$route.fullPath == '/rule') {
          this.selectSort('2')
        } else {
          this.selectSort('0')
        }
      },
      resetSenior(index) {
//        if (index == 1) {
//          this.inputText = '' // user inpput affiche text
//        }
        this.inputText = '' // user inpput affiche text
        this.titleIncludes = '' // 标题包含
        this.titleExcludes = '' // 标题不包含
        this.titleMaybeIncludes = '' // 标题可能包含
        this.contentIncludes = '' // 正文包含
        this.contentExcludes = '' // 正文不包含
        this.contentMaybeIncludes = '' // 正文可能包含
        this.fullTextIncludes = '' // 全文包含
        this.fullTextExcludes = '' // 全文不包含
        this.fullTextMaybeIncludes = '' // 全文可能包含
        this.startDate = ''  // 发布日期（起）
        this.startEnd = ''  // 发布日期（至）
      },
      /**/
      resetAll() {
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          this.$refs.tree2.setChecked(this.screenList[this.isStatus].list[i], false, false)
        }
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
        this.initTree(this.isStatus);
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      /* 选中触发 */
      handleNodeClick(data) {
        // 当前选中的数组
        if (data.children == undefined) {
          this.$refs.tree2.setChecked(data.id, true, false)
          for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
            if (this.screenList[this.isStatus].list[i] == data.id) {
              this.$refs.tree2.setChecked(data.id, false, false)
            }
          }
        }
      },
      handleCheckChange(data) {
        // // 去空
        // this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        // this.screenList[this.isStatus].list = this.$common.ImpArr(this.screenList[this.isStatus].list)
        // this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
        // this.screenList[this.isStatus].name = this.$common.ImpArr(this.$refs.tree2.getCheckedNodes())
      },
      /* 获取筛选的类 */
      preparation() {
        let data = [], data1 = [], range = []
        this.$http({
          method: 'GET',
          url: this.$api.rule.getalllmappingrules,
          params: {}
        }).then((res) => {
          let content = res.data.returnObject
          let fawenStatus = content.filter((item) => {
            return item.mappingTypeLable === 'organization'
          })
          let guizeStatus = content.filter((item) => {
            return item.mappingTypeLable === 'range'
          })
          let marketStatus = content.filter((item) => {
            return item.mappingTypeLable === 'market'
          })
          /* marketStatus */
          for (let i = 0; i < marketStatus.length; i++) {
            data1.push({
              id: marketStatus[i].mappingOriginalItems[0].id,
              label: marketStatus[i].mappingOriginalItems[0].originalVaule
            })
          }
          /* fawenStatus */
          for (let i = 0; i < fawenStatus.length; i++) {
            data.push({
              id: fawenStatus[i].mappingOriginalItems[0].id,
              label: fawenStatus[i].mappingOriginalItems[0].originalVaule
            })
          }
          /* guizeStatus */
          let sss = [], strarr = []
          for (let i = 0; i < guizeStatus.length; i++) {
            sss.push(guizeStatus[i].mappingOriginalItems)
          }
          for (let i = 0; i < sss.length; i++) {
            let idarr = []
            for (let j = 0; j < sss[i].length; j++) {
              idarr.push(sss[i][j].id)
            }
            strarr.push(idarr.join(','))
          }
          for (let j = 0; j < strarr.length; j++) {
            let obj = {
              'id': strarr[j],
              'label': guizeStatus[j].mapplingVaule
            }
            range.push(obj)
          }
          /* 时效性 */
          let objy = [{'id': '现行有效', 'label': '现行有效'}, {'id': '部分失效', 'label': '部分失效'}, {
            'id': '待生效', 'label': '待生效'
          }, {'id': '失效', 'label': '失效'}]
          /* 发布日期 */
          let de = [{'id': '', 'label': ''}]
          this.allMapping = [objy, data1, data, range, objy, objy];
          this.mapping = {
            '适用范围': data1,
            '发文单位': data,
            '规则类别': range
          }
          /* 111111 */
          this.stateful()

        }).catch((err) => {
          
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
        this.isStatus = index
        this.filterText = ''
        if (this.screenList[1].title == '适用范围') {
          this.screenList[1].list = []
          this.screenList[1].name = []
        }
        if (this.screenList[2].title == '发文单位') {
          this.screenList[2].list = []
          this.screenList[2].name = []
        }
        if (this.screenList[3].title == '规则类别') {
          this.screenList[3].list = []
          this.screenList[3].name = []
        }
        if (this.screenList[4].title == '时效性') {
          this.screenList[4].list = []
          this.screenList[4].name = []
        }
        if (this.screenList[5].title == '发布日期') {
          this.startDate = ''
          this.startEnd = ''
          for (var ix in this.dateArr) {
            this.dateArr[ix].selectStatus = false
          }
        }
        this.$refs.tree2.setCheckedKeys(this.screenList[index].list, false)
        for (let i in this.screenList) {
          if (i == index) {
          } else {
            this.screenList[i].isSelect = false
          }
        }
        /**/
        this.boxContentTi = true
        if (index == 0) {
          this.boxContent = false
          this.screenList[1].list = []
          this.screenList[1].name = []
          this.screenList[2].list = []
          this.screenList[2].name = []
          this.screenList[3].list = []
          this.screenList[3].name = []
          this.screenList[4].list = []
          this.screenList[4].name = []
          this.startDate = ''
          this.startEnd = ''
          for (var i in this.screenList) {
            this.screenList[i].title = this.screenListList[i]
          }
          this.flip = 1;
          this.lawSearch()
          this.boxContent = false
        } else {
          if (index == this.screenList.length - 1) {
            this.boxContentTi = false
          }
          /**/
          this.data4 = this.allMapping[index]
          if (this.screenList[index].isSelect === true) {
            this.screenList[index].isSelect = false
            this.boxContent = this.screenList[index].isSelect
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = this.screenList[index].isSelect
          }
        }
      },
      /* 筛选项的开关 */
      screenIsActive(index) {
        this.initTree(index);
        this.$nextTick(() => {
          this.itemStyle()
        })
      },
      /* autoComplete */
      autoComplete(value) {
        this.inputText = this.inputText ? this.inputText : ''
        this.$http({
          method: 'GET',
          url: this.$api.rule.autoComplete,
          params: {
            title: this.inputText == '' ? '上市' : this.inputText
          }
        }).then((res) => {
          if (res.data.returnObject.length == 0) {
            this.prestrain = []
          } else {
            this.prestrain = res.data.returnObject
          }
        }).catch((err) => {
          
        })
      },
      // 页数加一
      addition() {
        if (this.flip < this.total) {
          this.flip += 1
        }
      },
      // 页数减一
      subtraction() {
        if (this.flip > 1) {
          this.flip -= 1
        }
      },
      // 选择页数
      selectPage(i) {
        this.flip = i
        this.loading = true;
        this.lawSearch()
      },
      // 打开高级搜索
      seniorMethod() {
        this.senior++;
        // this.tipShow.forEach((item, index) => {
        //   this.$set(this.tipShow, index, false)
        // })
        // this.showPanel ? this.showPanel = false : this.showPanel = true
        // this.boxContClick()
        // /* if (!this.showPanel) {
        //   this.resetSenior(2)
        // } */
        // this.resetSenior(2)
      },
      // autocomplete rules click
      selectText(i) {
        this.inputText = this.prestrain[i].title
        var tit = document.getElementsByClassName('ele-popover')[0]
        tit.style.display = 'none'
      },
      /* 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.market == undefined ? [] : this.$route.query.market.split('##')
        this.screenList[2].list = this.$route.query.unitIds == undefined ? [] : this.$route.query.unitIds.split('##')
        this.screenList[3].list = this.$route.query.cateIds == undefined ? [] : this.$route.query.cateIds.split('##')
        this.screenList[4].list = this.$route.query.timelinessIds == undefined ? [] : this.$route.query.timelinessIds.split('##')
        if (this.$route.query.releaseStart || this.$route.query.releaseEnd) {
          this.screenList[5].list = [];
          this.screenList[5].list.push(this.$route.query.releaseStart + '---' + this.$route.query.releaseEnd);
          this.screenList[5].title = this.$route.query.releaseStart + '---' + this.$route.query.releaseEnd;
        }
        this.titleIncludes = (this.$route.query.titleIncludes == '' || this.$route.query.titleIncludes == undefined) ? '' : this.$common.transComma(this.$route.query.titleIncludes)
        this.titleExcludes = (this.$route.query.titleExcludes == '' || this.$route.query.titleExcludes == undefined) ? '' : this.$common.transComma(this.$route.query.titleExcludes)
        this.titleMaybeIncludes = (this.$route.query.titleMaybeIncludes == '' || this.$route.query.titleMaybeIncludes == undefined) ? '' : this.$common.transComma(this.$route.query.titleMaybeIncludes)
        /**/
        this.inputText = (this.$route.query.contentIncludes == '' || this.$route.query.contentIncludes == undefined) ? '' : this.$common.transComma(this.$route.query.contentIncludes)
        this.fullTextExcludes = (this.$route.query.contentExcludes == '' || this.$route.query.contentExcludes == undefined) ? '' : this.$common.transComma(this.$route.query.contentExcludes)
        this.fullTextMaybeIncludes = (this.$route.query.contentMaybeIncludes == '' || this.$route.query.contentMaybeIncludes == undefined) ? '' : this.$common.transComma(this.$route.query.contentMaybeIncludes)

        /**/
        this.flip = (this.$route.query.flip == '' || this.$route.query.flip == undefined) ? 1 : Number(this.$route.query.flip)
        this.sortType = (this.$route.query.sortType == '' || this.$route.query.sortType == undefined) ? '' : this.$route.query.sortType
        this.startDate = (this.$route.query.releaseStart == '' || this.$route.query.releaseStart == undefined) ? '' : this.$route.query.releaseStart
        this.startEnd = (this.$route.query.releaseEnd == '' || this.$route.query.releaseEnd == undefined) ? '' : this.$route.query.releaseEnd
        this.inputText = (this.$route.query.fullTextIncludes == '' || this.$route.query.fullTextIncludes == undefined) ? this.inputText : this.$route.query.fullTextIncludes
        /**/
        let market = [], unitIds = [], timelinessIds = [], cateIds = []
        for (let s in this.allMapping[1]) {
          for (let x in this.screenList[1].list) {
            if (this.allMapping[1][s].id == this.screenList[1].list[x]) {
              market.push(this.allMapping[1][s].label)
            }
          }
        }
        for (let s in this.allMapping[2]) {
          for (let x in this.screenList[2].list) {
            if (this.allMapping[2][s].id == this.screenList[2].list[x]) {
              unitIds.push(this.allMapping[2][s].label)
            }
          }
        }
        for (let s in this.allMapping[3]) {
          for (let x in this.screenList[3].list) {
            if (this.allMapping[3][s].id == this.screenList[3].list[x]) {
              cateIds.push(this.allMapping[3][s].label)
            }
          }
        }
        for (let s in this.allMapping[4]) {
          for (let x in this.screenList[4].list) {
            if (this.allMapping[4][s].id == this.screenList[4].list[x]) {
              timelinessIds.push(this.allMapping[4][s].label)
            }
          }
        }

        if (market.length != 0) {
          this.screenList[1].title = market.join(',')
        }
        if (unitIds.length != 0) {
          this.screenList[2].title = unitIds.join(',')
        }
        if (cateIds.length != 0) {
          this.screenList[3].title = cateIds.join(',')
        }
        if (timelinessIds.length != 0) {
          this.screenList[4].title = timelinessIds.join(',')
        }
        if (this.$route.fullPath == '/rule') {
          this.selectSort('2')
        } else {
          this.selectSort('0')
        }
      }
    },
    // 生命周期函数
    created() {
      // this.autoComplete('上市')
      // 是否笔记法规
      if (this.$route.query.havenote == 1) {
        this.haveNote = true
        // 未登录用户权限判断
        if (!this.$cookie.get('userId')) {
          location.href = '/login?redirect_url=' + this.$route.fullPath
          return false
        }
      } else {
        this.haveNote = null
      }
      if (this.$route.fullPath == '/rule') {
        this.monthDate = this.$common.getBeforeDate(30)
        this.monthEnd = this.$common.getBeforeDate(0)
        this.monthDate = ''
        this.monthEnd = ''
      }
      this.preparation()
    },
    mounted() {
      this.itemStyle();
    }
  }
</script>

<style lang="scss">
  .screen-tooltip {
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
  .bounce-enter-active {
    animation: bounce-in .4s;
  }
  .bounce-leave-active {
    animation: bounce-in .4s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @-o-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  .box-container {
    // min-height: 1200px;
    .content {
      min-height: 800px;
    }
    .noSort {
      // margin-top: 20px !important;
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
  .ele-popover {
    padding: 12px 0;
    .popul {
      max-height: 210px;
      padding: 0 0 !important;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      li {
        padding: 10px 12px;
        box-sizing: border-box;
        // margin: 0 0 10px 0;
        // font-size: 20px;
      }
      li:hover {
        background: rgba(240, 241, 245, .6);
        /*span {*/
        /*color: white !important;*/
        /*}*/
      }
      li:last-child {
        margin: 0 0 0 0;
      }
    }
  }
  .sort {
    width: 1200px;
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
      i, .iconfont {
        transition: transform .3s, -webkit-transform .3s;
        transform: rotate(0deg);
      }
      .iconfont {
        font-size: 3px !important;
        display: inline-block;
        line-height: 20px;
        margin-left: 8px;
        color: #a6a6a6;
      }
      .web-sanjiaoxing:before {
        font-size: 5px !important;
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
      margin-right: 95px;
    }
  }
  .foot-pagination {
    padding: 30px 0;
  }
  @import "../../../static/css/animate";
</style>
