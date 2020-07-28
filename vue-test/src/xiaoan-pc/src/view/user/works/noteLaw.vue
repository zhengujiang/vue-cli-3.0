<template>
  <div id="noteLaw">
    <header class="law-search">
      <h4 class="card-title">我的笔记</h4>
      <el-input id="worksSearchWord" placeholder="多关键词用空格隔开" v-model="searchWord" class="input-with-select" size="small" clearable @clear="submitAll">
        <i class="el-icon-search" slot="append" @click="submitAll"></i>
      </el-input>
    </header>
    <!-- 筛选 -->
    <template v-if="screenList.length >0" >
      <div class="xiaoan-Screen">
      <ul class="screen-box">
        <li v-for="(list,index) in screenList" @click="screenIsActive(index)">
          <div :class="{isActive: list.isSelect}">
            <el-tooltip content="Bottom center" placement="bottom" effect="light" popper-class="screen-tooltip"
                        :visible-arrow="false" :open-delay="500">
              <span>{{$common.number(list.title)}}</span>
              <span slot="content" v-if="index !== 5">{{list.title}}</span>
              <span slot="content" v-else>
                <template v-if="startDate || startEnd">{{startDate}}&nbsp;&nbsp;&nbsp;{{startEnd}}</template>
                <template v-else>{{list.title}}</template>
              </span>
            </el-tooltip>
            <i class="icon iconfont web-sanjiaoxing" v-if="index !== 0"></i>
          </div>
        </li>
      </ul>
      <transition name="bounce" mode="out-in">
        <div class="xiaoan-box-content" v-show="boxContent">
          <div class="cont-container" v-show="boxContentTi">
            <div class="cont-search">
              <div class="el-input">
                <input type="text" class="el-input__inner" v-model="filterText" placeholder="搜索筛选条件"/>
              </div>
              <div class="ruleBtn">
                <el-button type="primary" icon="el-icon-search"></el-button>
              </div>
            </div>
            <div class="cont-tree">
              <el-tree class="filter-tree" :data="data4" :props="defaultProps" :filter-node-method="filterNode"
                       node-key="id" accordion show-checkbox ref="tree2" expand-on-click-node
                       @node-click="handleNodeClick" @check-change="handleCheckChange" highlight-current
                       :indent="23">
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
              <li v-for="(list, index) in dateArr" @click="selectDate(index)"
                  :class="{selectStatus: list.selectStatus}">{{ list.column }}
              </li>
            </ul>
          </div>
          <div class="cont-button">
            <div>
              <el-button type="primary" class="timeButton" @click="resetAll">重置</el-button>
            </div>
            <div>
              <el-button type="primary" class="timeButton" @click="submitAll">确认</el-button>
              <!-- searchMethod -->
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 排序 -->

    <template v-if="ownerNoteList.length >0" >
      <div class="sort" id="sortColumn">
        <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="handleSelectSort(index)">
          <span>{{ list.name }}</span>
          <i class="icon iconfont web-sanjiaoxing up" :class="{hide: !list.isActive}"></i>
        </div>
        <!--<div class="pagebox" v-show="pageNumCount>1">
          <i class="el-icon el-icon-arrow-left" :class="{'idisable':pageNum==1}" @click="pageLast"></i>
          <span class="count"><span style="color: #ffb148;">{{pageNum}}</span> / {{pageNumCount}}</span>
          <i class="el-icon el-icon-arrow-right" :class="{'idisable':pageNum==pageNumCount}" @click="pageNext"></i>
        </div>-->
        <v-page :flip="pageNum" :total="pageNumCount" v-on:addition="pageNext" v-on:subtraction="pageLast"></v-page>
      </div>
      <div class="noteLawList">
        <div class="law-item" v-for="(item,index) in ownerNoteList" :key="index">
          <a :href="'/rule/details?id=' + item.lawId" target="_blank">
            <div class="law-title" v-html="item.hightTitle"></div>
          </a>
          <a :href="'/works/noteList?lawId=' + item.lawId + '&lawTitle=' + item.encodeTitle" target="_blank">
            <div class="note-count">查看相关{{item.noteCount}}条笔记</div>
          </a>
        </div>
        <div class="center pagination" v-if="totalCount > 10">
          <el-pagination background layout="prev, pager, next" :current-page="pageNum" :total="totalCount" :page-size="pageSize" @current-change="pageChange"></el-pagination>
        </div>
      </div>
    </template>
    <v-noInfo v-else></v-noInfo>
    </template>
    <v-noInfo v-else></v-noInfo>
  </div>
</template>

<script>
  import page from '@/components/customPage.vue'
  export default {
    data() {
      return {
        searchWord: '',
        defaultProps: {children: 'children', label: 'label'}, // 筛选项类的数据 格式
        data4: [{id: '', label: ''}], // 筛选项的二极类
        filterText: '',
        isStatus: 0, // 当前打开的筛选项
        boxContent: false, // 筛选框
        boxContentTi: true, // 区分 筛选项的二级  和 发布日期控制
        screenList: [
          {id: 0, name: [], title: '全部', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '适用范围', type: 'marketStatus', isSelect: false, list: []},
          {id: 2, name: [], title: '发文单位', type: 'fawenStatus', isSelect: false, list: []},
          {id: 3, name: [], title: '规则类别', type: 'guizeStatus', isSelect: false, list: []},
          {id: 4, name: [], title: '时效性', type: '', isSelect: false, list: []},
          {id: 5, name: [], title: '发布日期', type: 'dateStatus', isSelect: false, list: []}
        ], // 筛选项的条件
        screenListList: ['全部', '适用范围', '发文单位', '规则类别', '时效性', '发布日期'], // 筛选默认显示的title格式
        sortType: 'DEFAULT_SORT',
        sort: [
          {id: '0', name: '默认排序', value: 'DEFAULT_SORT', isActive: true, up: false},
          {id: '1', name: '笔记数', value: 'NOTE_COUNT_SORT', isActive: false, up: true}
          // ,{id: '2', name: '发布日期', isActive: false, up: true}
        ],
        startDate: '',
        startEnd: '',
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
        pageNum: 1,
        pageNumCount: 1,
        pageSize: 10,
        totalCount: 0,
        ownerNoteList: []
      }
    },
    // 使用其它组件
    components: {
      'v-page': page
    },
    computed: {},
    watch: {
      // 筛选项的过滤
      filterText: function (val) {
        this.$refs.tree2.filter(val)
        if (val == '') {
          var k = '25%'
          var content = document.getElementsByClassName('xiaoan-box-content')[0]
          this.$nextTick(() => {
            if (this.isStatus == '1' || this.isStatus == '2' || this.isStatus == '3') {
              k = '33%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            } else if (this.isStatus == '5') {
              k = '50%'
              content.style.cssText = 'right:0;left:auto;width:60%;padding:0 20px;'
            } else if (this.isStatus == '0') {
              content.style.cssText = 'display:none'
            } else {
              k = '50%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            }
            var tree = document.getElementsByClassName('el-tree-node')
            for (var i = 0; i < tree.length; i++) {
              tree[i].style.display = 'inline-block'
              tree[i].style.width = k
            }
          })
        }
      }
    },
    // 生命周期函数
    created() {
      this.preparation()
    },
    mounted() {
      document.querySelector('#worksSearchWord').addEventListener('keyup', (event) => {
        if (event.keyCode == 13) {
          this.submitAll()
        }
      })
    },
    // 方法
    methods: {
      /* 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.market == undefined ? [] : this.$route.query.market.split(',')
        this.screenList[2].list = this.$route.query.unitIds == undefined ? [] : this.$route.query.unitIds.split(',')
        this.screenList[3].list = this.$route.query.cateIds == undefined ? [] : this.$route.query.cateIds.split(',')
        this.screenList[4].list = this.$route.query.timelinessIds == undefined ? [] : this.$route.query.timelinessIds.split(',')

        this.inputText = (this.$route.query.contentIncludes == '' || this.$route.query.contentIncludes == undefined) ? '' : this.$common.transComma(this.$route.query.contentIncludes)

        this.searchWord = this.$route.query.searchWord ? this.$route.query.searchWord : ''
        this.sortType = (this.$route.query.sortType == '' || this.$route.query.sortType == undefined) ? 'DEFAULT_SORT' : this.$route.query.sortType
        this.startDate = (this.$route.query.releaseStart == '' || this.$route.query.releaseStart == undefined) ? '' : this.$route.query.releaseStart
        this.startEnd = (this.$route.query.releaseEnd == '' || this.$route.query.releaseEnd == undefined) ? '' : this.$route.query.releaseEnd
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

        this.lawSearch()
      },
      resetAll() {
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          this.$refs.tree2.setChecked(this.screenList[this.isStatus].list[i], false, false)
        }
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        if (this.screenList[this.isStatus].type == 'dateStatus') {
          this.startEnd = ''
          this.startDate = ''
          this.dateArr.forEach(item => {
            item.selectStatus = false
          })
        }
      },
      submitAll () {
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        let name = []
        if (this.screenList[this.isStatus].name.length != 0) {
          for (let i = 0; i < this.screenList[this.isStatus].name.length; i++) {
            name.push(this.screenList[this.isStatus].name[i].label)
          }
          this.screenList[this.isStatus].title = name.join('，')
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
        // console.log('------------------', this.screenList[this.isStatus])
        this.boxContent = false
        this.$router.push({
          path: '/works/noteLaw', query: {
            key: this.searchWord,
            market: this.screenList[1].list.join(','),
            unitIds: this.screenList[2].list.join(','),
            cateIds: this.screenList[3].list.join(','),
            timelinessIds: this.screenList[4].list.join(','),
            pageNum: this.pageNum,
            sortType: this.sortType,
            releaseStart: this.startDate,
            releaseEnd: this.startEnd
          }
        })
        this.lawSearch()
      },
      // 筛选处选择时间
      selectDate(index) {
        for (var i in this.dateArr) {
          this.dateArr[i].selectStatus = false
        }
        this.dateArr[index].selectStatus = true
        // console.log('index = ', index, this.dateArr)
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
      handleSelectSort(index) {
        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.sortType = this.sort[index].value
        this.submitAll()
        // console.log('排序条件', this.sort[index].name)
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
          // console.log(content);
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
          this.allMapping = [objy, data1, data, range, objy, objy]
          console.log('------', this.allMapping)
          /* 111111 */
          this.stateful()

        }).catch((err) => {

        })
      },
      /* 筛选项的开关 */
      screenIsActive(index) {
        this.isStatus = index
        this.filterText = ''
        // console.log('this.isStatus', this.isStatus)
        if (this.screenList[1].title == '适用范围') {
          this.screenList[1].list = []
          this.screenList[1].name = []
        }
        if (this.screenList[2].title == '所属行业') {
          this.screenList[2].list = []
          this.screenList[2].name = []
        }
        if (this.screenList[3].title == '发布日期') {
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
        // console.log(this.allMapping[index], this.screenList[index])
        this.$nextTick(() => {
          this.itemStyle()
        })
      },
      // 筛选项样式
      itemStyle() {
        var k = '25%'
        var content = document.getElementsByClassName('xiaoan-box-content')[0]
        if (this.isStatus == '1' || this.isStatus == '2' || this.isStatus == '3') {
          k = '33%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        } else if (this.isStatus == '5') {
          k = '50%'
          content.style.cssText = 'right:0;left:auto;width:60%;padding:0 20px;'
        } else if (this.isStatus == '0') {
          content.style.cssText = 'display:none'
        } else {
          k = '50%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      /* 选中触发 */
      handleNodeClick(data) {
        // 当前选中的数组
        // console.log('handleNodeClick', data.children)
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
        // 去空
        this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        this.screenList[this.isStatus].list = this.$common.ImpArr(this.screenList[this.isStatus].list)
        this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
        // 去空
        this.screenList[this.isStatus].name = this.$common.ImpArr(this.$refs.tree2.getCheckedNodes())
        console.log('====1111111', this.screenList)
      },
      pageChange (index) {
        this.pageNum = index;
        this.lawSearch()
      },
      pageNext () {
        if (this.pageNum < this.pageNumCount) {
          this.pageNum = this.pageNum + 1
          this.lawSearch()
        }
      },
      pageLast () {
        if (this.pageNum > 1) {
          this.pageNum = this.pageNum - 1
          this.lawSearch()
        }
      },
      // 筛选\高级\初始化\控制的ajax
      lawSearch() {
        let dateStart = this.startDate ? this.$common.getTimestampms(this.startDate + ' 00:00:00') : ''
        let dateEnd = this.startEnd ? this.$common.getTimestampms(this.startEnd + ' 23:59:59') : ''
        let searchWord = this.searchWord.replace(/\s+/g, ',')
        let userId = this.$cookie.get('userId')
        this.$http({
          method: 'GET',
          url: this.$api.lawnote.searchOwnerNote,
          params: {
            key: searchWord,
            unitIds: this.screenList[2].list.join(','), // 发文单位
            timelinessIds: this.screenList[4].list.join(','), // 时效性
            scopeId: this.screenList[1].list.join(','), // 板块
            cateIds: this.screenList[3].list.join(','), // 规则类别
            lawNoteSortTypeEnum: this.sortType, // 搜索排序
            releaseStart: dateStart, // 发布日期（起）
            releaseEnd: dateEnd, // 发布日期（止）
            pageNum: this.pageNum, // 页码
            pageSize: this.pageSize, // 每页行数
            userId: userId
          }
        }).then((res) => {
          if (res.data.retrunCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.totalCount = res.data.total
              if (this.totalCount % this.pageSize == 0) {
                this.pageNumCount = parseInt(this.totalCount / this.pageSize)
              } else {
                this.pageNumCount = parseInt(this.totalCount / this.pageSize) + 1
              }

              this.ownerNoteList = res.data.returnObject
              this.ownerNoteList.forEach((item, index) => {
                item.hightTitle = this.$common.hight(this.searchWord, item.lawTitle)
                item.encodeTitle = encodeURIComponent(item.lawTitle)
              })
            } else {
              this.ownerNoteList = []
              this.totalCount = 0
            }
          }
        }).catch((err) => {
          this.ownerNoteList = []
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    }
  }
</script>

<style lang="scss">
  #noteLaw {
    .law-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 6px;
      margin-top: -14px;
      border-bottom: 1px solid #e3e3e3;
      .card-title {
         margin-bottom: 0;
      }
      .input-with-select {
        width:242px;
      }
      .el-input-group__append {
        background-color: rgba(255,255,255,0);
      }
      .el-icon-search {
        font-size: 18px;
        cursor: pointer;
        font-weight: 800;
      }
    }
    .xiaoan-Screen {
      width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
      height: auto;
      padding: 0 0 0 0;
      position: relative;
      z-index: 1000;
      border: 0;
      background-color: white;
      .xiaoan-box-content {
        box-sizing: border-box;
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
              width: 220px;
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
                .el-input__prefix {
                  display: none;
                }
                .el-input__suffix {
                  background: rgba(255, 255, 255, 0);
                  .el-input__suffix-inner {
                    text-align: right;
                    .el-input__icon {
                      color: #aeaeae
                    }
                    .el-icon-circle-close {
                      color: #aeaeae
                    }
                  }
                  span {
                    background: rgba(255, 255, 255, 0)
                  }
                }
                input {
                  padding: 0 0 0 15px;
                  text-align: left;
                }
              }
            }
          }
          .dateArr {
            width: 100%;
            height: auto;
            padding: 10px 0 20px 0;
            overflow: hidden;
            li {
              list-style: none;
              float: left;
              font-size: 12px;
              color: #323232;
              margin-right: 30px;
              padding: 0 5px;
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
                  &:hover {
                    background: rgba(240, 241, 245, .6);
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
        display: table;
        box-sizing: border-box;
        vertical-align: middle;
        border: none;
        position: relative;
        z-index: 199;
        li {
          display: table-cell;
          text-align: center;
          vertical-align: middle;
          box-sizing: border-box;
          border: none;
          width: 20.5%;
          font-size: 0;
          div {
            box-sizing: border-box;
            height: 46px;
            padding-top: 8px;
            margin-top: 3px;
            border: 1px solid #fff;
            border-bottom: 1px solid #e3e3e3;
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            span {
              font-size: 14px;
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
              content: "\e604" !important;
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
            border: 1px solid #e3e3e3;
            text-align: center;
            border-bottom: 1px solid #fff;
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
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
        li:first-child {
          border-bottom-color: #e3e3e3;
          text-align: left;
          border-right: 0;
          width: 6%;
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
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
        li:last-child {
          width: 14%;
          text-align: right;
        }
      }
    }

    .sort {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      margin-top: 16px;
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
          font-size: 12px !important;
          color: #8d8d8d;
          display: inline-block;
          line-height: 20px;
          margin-left: 8px;
        }
        .web-sanjiaoxing:before {
          font-size: 12px !important;
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
        width:100px;
        margin-right: 50px;
      }
      .pagebox {
        float: right;
        .count {
          display: inline-block;
          margin: 0 5px;
        }
        .idisable {
          color: #c0c4cc;
          cursor: default;
        }
      }
    }
    .noteLawList {
      .law-item {
        border-bottom: 1px solid #e3e3e3;
        padding: 16px 0;
        .law-title {
          font-size: 16px;
          color: #323232;
        }
        .note-count {
          font-size: 14px;
          color: #AEAEAE;
          font-weight: normal;
          padding-top:10px;
        }
      }
      .pagination {
        padding: 10px;
      }
    }
  }
</style>
