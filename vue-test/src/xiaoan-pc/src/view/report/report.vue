<template>
  <div id="report" v-loading.fullscreen.lock="loading">
    <div class="header vxa-image-bg-affiche">
      <div class="searchArea">
        <div class="searchCode">
          <el-popover placement="bottom" width="180" trigger="click" popper-class="inputCodeAuto"
                      :popper-options="{boundariesElement: 'body'}" v-on:click="selectCode">
            <ul>
              <li v-for="(list,index) in autoCode" :key="index" @click="selectCode(index)">
                <span v-html="$common.highlight(inputCode,list.code)"></span>
                <span>{{ list.name }}</span>
              </li>
            </ul>
            <el-input slot="reference" type="text" placeholder="证券代码/简称" @focus="loadCode" @input="loadCode"
                      v-model="inputCode"
                      @keyup.13.native="searchMethod"></el-input>
          </el-popover>
          <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
        </div>

        <div class="searchName">
          <el-popover placement="bottom" width="180" trigger="click" popper-class="inputName"
                      :popper-options="{boundariesElement: 'body'}" v-on:click="selectCode">
            <el-input slot="reference" type="text" placeholder="作者" @focus="loadAuthor" @input="loadAuthor"
                      v-model="inputName" @keyup.13.native="searchMethod"></el-input>
            <ul>
              <li v-for="(list, index) in autoName" :key="index" @click="selectCode(index, true)">
                <span v-html="$common.highlight(inputName,list)"></span>
                <!--<span>{{ list }}</span>-->
              </li>
            </ul>
          </el-popover>
          <v-safeWordTip v-show="tipShow[1]"></v-safeWordTip>
        </div>

        <div class="searchText" @keyup.13="searchMethod">
          <el-input v-model="inputText" placeholder="请输入研报关键词" @keyup.13="searchMethod"></el-input>
          <v-safeWordTip v-show="tipShow[2]"></v-safeWordTip>
        </div>
        <el-button class="searchButton" @click="searchMethod" :class="{buttonFlag:showPanel}">
          <i class="el-icon-search"></i>
        </el-button>
      </div>
    </div>
    <div class="container">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <el-row :gutter="15">
          <el-col :span="18">
            <!-- 筛选 -->
            <div class="screen"><!--  v-show="!isInfo" -->
              <!-- 筛选模块 -->
              <ul class="screen-box">
                <li v-for="(list,index) in screenList" :key="index" @click="screenIsActive(index)">
                  <div :class="{isActive: list.isSelect}">
                    <el-tooltip content="Bottom center" placement="bottom" effect="light"
                                popper-class="screen-tooltip-affiche" visible-arrow="false" :open-delay="hideAfter">
                      <span>{{$common.number(list.title)}}</span>
                      <span slot="content" v-if="index !== 3">{{list.title}}</span>
                      <span slot="content" v-else>{{startDate}}&nbsp;&nbsp;&nbsp;{{startEnd}}</span>
                    </el-tooltip>
                    <i class="iconfont web-sanjiaoxing" v-if="index !== 0" style="font-size: 10px;"></i>
                  </div>
                </li>
              </ul>
              <!-- 筛选各筛选项 -->
              <transition name="bounce" mode="out-in">
                <div class="xiaoan-box-content" v-show="boxContent">
                  <div class="cont-container" v-show="boxContentTi">
                    <div class="cont-search">
                      <div class="el-input">
                        <input class="el-input__inner" v-model="filterText" :placeholder="autoNo[7]"/>
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
                        <el-date-picker v-model="startDate" value-format="yyyy-MM-dd" type="date"
                                        placeholder="选择日期"
                                        :editable="false"
                                        :picker-options="pickerOptions1"></el-date-picker>
                        <!-- :default-value="this.$common.getNowDate()" -->
                      </div>
                    </div>
                    <div class="tableDate">
                      <div class="end">
                        <span>到</span>
                        <el-date-picker v-model="startEnd" value-format="yyyy-MM-dd" type="date"
                                        placeholder="选择日期"
                                        :editable="false"
                                        :picker-options="pickerOptions2"></el-date-picker>
                        <!-- :default-value="this.$common.getNowDate()" -->
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
                      <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[2]}}</el-button>
                    </div>
                    <div>
                      <el-button type="primary" class="timeButton" @click="submitAll">{{autoNo[3]}}</el-button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <!-- 排序 -->
            <div class="sort" >
              <totalNum :totalNum="totalNum"></totalNum>
              <div @click="allShow" class="el-dropdown-link" style="float: right;margin-right: -5px;">
                <span>{{ describeText }}</span>
              </div>
            </div>
            <div>
              <!-- <div class="no-list" v-if="info.length == 0">
                <v-noInfo></v-noInfo>
              </div> -->
              <div class="no-list" id="noInfo" v-if="info.length == 0">
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
                  <!-- <p v-if="sort !== 'reportDetail'">搜索不到相关内容，试试别的关键字或使用高级搜索吧！</p> -->
                  <p>搜索不到相关内容，试试别的关键字吧!</p>
                  <!-- <el-button @click="seniorMethod" v-if="sort !== 'reportDetail'">高级搜索</el-button> -->
                </template>
              </div>
              <div class="no-list" v-else>
                <v-list :data="info"></v-list>
                <div class="vxa-flax-box align foot-pagination" v-if="page.total>1">
                  <div class="col t-left">
                    <el-pagination class="vxa-footer-page-pagination" @current-change="selectPage"
                                   layout="prev, pager, next"
                                   :current-page="page.index" :page-count="total">
                    </el-pagination>
                  </div>
                  <div class="col t-right">
                    <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="page.size"
                                    @change="handlePageChange">
                      <el-radio-button :label="30">30条</el-radio-button>
                      <el-radio-button :label="50">50条</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <v-adv :pageName="'投关检索'" style="margin-top:15px;"></v-adv>
          </el-col>
        </el-row>
      </div>
    </div>
    <v-regulatorDialog :regulatorDialog="regulatorDialog"></v-regulatorDialog>
  </div>
</template>
<script>
  import mixins from '@/service/sensitiveWord'
  import list from './components/list.vue'
  import page from '@/components/customPage.vue'
  import totalNum from '@/components/totalNum.vue'

  export default {
    mixins: [mixins],
    data() {
      return {
        text: '研报',
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        autoCode: [],
        gridData: [],
        autoName: [],
        inputCode: '',
        inputName: '',
        inputText: '',
        hideAfter: 500,
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规名称，多关键词用空格隔开，如：上市', '请输入公告名称，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
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
        indent: 23,
        data4: [
          {id: 1, label: '沪市主板'},
          {id: 2, label: '深市中小板'},
          {id: 3, label: '深市创业板'},
          {id: 4, label: '深市主板'}
        ],
        screenListList: ['全部', '所有研报', '所属行业', '发布日期'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], title: '全部', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '所有研报', type: 'market', isSelect: false, list: []},
          {id: 2, name: [], title: '所属行业', type: 'industry', isSelect: false, list: []},
          {id: 3, name: [], title: '发布日期', type: 'date', isSelect: false, list: []}
        ],
        isStatus: 0,
        startDate: '',
        startEnd: '',
        boxContent: false, // 筛选栏关闭
        filterText: '',
        describeText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loading: true,
        isInfo: false, // 是否存在搜索结果
        boxContentTi: true,
        info: [],
        showPanel: '', // isShow panel
        flip: 1,
        total: 50,
        pagesize: 10,
        userId: '',
        userInfo: {},
        regulatorDialog: false,
        isRootUser: false,
        totalNum: ''
      }
    },
    // 使用其它组件
    components: {
      'v-list': list,
      'v-page': page,
      totalNum: totalNum
    },
    watch: {
      autoCode: function (val) {
        // if (val.length == 0) {
        //   document.getElementsByClassName('inputCodeAuto')[0].style.display = 'none'
        // } else {
        //   document.getElementsByClassName('inputCodeAuto')[0].style.display = 'block'
        // }
      },
      filterText: function (val) {
        this.$refs.tree2.filter(val)
        if (val == '') {
          var k = '25%'
          var content = document.getElementsByClassName('xiaoan-box-content')[0]
          this.$nextTick(() => {
            if (this.isStatus == '3') {
              k = '20%'
              content.style.cssText = 'right:0;left:auto;width:auto;padding:0 20px;'
            } else if (this.isStatus == '1') {
              k = '33%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            } else if (this.isStatus == '2') {
              k = '20%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            } else {
              k = '50%'
            }
            var tree = document.getElementsByClassName('el-tree-node')
            for (var i = 0; i < tree.length; i++) {
              tree[i].style.display = 'inline-block'
              tree[i].style.width = k
            }
          })
        }
      },
      autoName: function (val) {
        // if (val.length == 0) {
        //   document.getElementsByClassName('inputName')[0].style.display = 'none'
        // } else {
        //   document.getElementsByClassName('inputName')[0].style.display = 'block'
        // }
      },
      isStatus: function (val) {
        var button = document.getElementsByClassName('cont-button')[0]
        var date = document.getElementsByClassName('cont-containerDate')[0]
        var button1 = document.getElementsByClassName('timeButton')[0]
        var button2 = document.getElementsByClassName('timeButton')[1]
        if (val == this.screenList.length - 1) {
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
      flip() {
        this.$common.returnTop()
        // this.submitAll()
        if (this.$route.fullPath !== '/report') {
          this.submitAll()
        } else {
          this.afficheSearch()
        }
      }
    },
    beforeCreate() {
      this.$auth.logout_redirect()
    },
    created() {
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
      }
    },
    mounted() {
      this.preparation()
      // this.afficheSearch()
    },
    methods: {
      rootUser() {
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
      // 列表描述控制
      allShow() {
        if (this.describeText == '全部显示') {
          this.describeText = '全部隐藏'
          for (var i = 0; i < this.info.length; i++) {
            this.info[i].isDescribe = true
          }
        } else {
          this.describeText = '全部显示'
          for (var j = 0; j < this.info.length; j++) {
            this.info[j].isDescribe = false
          }
        }
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
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
        for (var i in this.dateArr) {
          this.dateArr[i].selectStatus = false
        }
        this.dateArr[index].selectStatus = true
      },
      // 选择筛选条件
      handleNodeClick(data) {
        this.$refs.tree2.setChecked(data.id, true, false)
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          if (this.screenList[this.isStatus].list[i] == data.id) {
            this.$refs.tree2.setChecked(data.id, false, false)
          }
        }
      },
      handleCheckChange(data) {
        this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
      },
      // 点击确认筛选
      submitAll() {
        console.log('this.screenList = ', this.screenList, this.isStatus)
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        let name = []
        if (this.screenList[this.isStatus].name.length !== 0) {

          for (let i = 0; i < this.screenList[this.isStatus].name.length; i++) {
            name.push(this.screenList[this.isStatus].name[i].label)
          }
          this.screenList[this.isStatus].title = name.join('，') // this.$common.subString()
        } else {
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

        this.boxContent = false
        // 用户状态保存
        this.$router.push({
          path: 'report', query: {
            keys: this.inputText,
            code: this.inputCode,
            inputName: this.inputName,
            market: this.screenList[1].list.join('##'),
            unitIds: this.screenList[2].list.join('##'),
            flip: this.flip,
            sortType: this.sortType,
            releaseStart: this.startDate,
            releaseEnd: this.startEnd
          }
        })
        /* if (this.screenList[2].list.length !== 0) {
           this.getIndustryReport()
         } else { */
        this.afficheSearch()
        /* } */
        // console.log('-=-=-=-=', this.screenList)
      },
      // 选择行业获取相关研报
      getIndustryReport() {
        this.$http({
          methods: 'GET',
          url: this.$api.report.getIndustryReport,
          params: {
            // pageNum: this.flip,
            // pageSize: this.pagesize,
            pageNum: this.page.index,
            pageSize: this.page.size,
            industry: this.screenList[2].title.replace(/，/g, ',')
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1) {
            this.total = Math.ceil(res.data.total / this.page.size);
            console.log(this.total)
            // total数量超过1w条 控制显示
            if (this.total > 1000) {
              this.total = 1000
            }
            if (this.total == 0) {
              this.isInfo = true
              this.info = []
            } else {
              this.isInfo = false
              var arr = res.data.returnObject
              this.info = []
              var reg = /\s/g
              var content = ''
              for (let i in arr) {
                if (arr[i].content) {
                  content = arr[i].content.replace(reg, '')
                }
                var describe = false
                var plate = []
                var obj = {}
                var highColorTitle = this.inputText
                var highColorContent = this.inputText
                if (this.$common.browserSort() == 'Chrome') {
                  obj = {
                    id: arr[i].id,
                    title: this.$common.key(highColorTitle, arr[i].subject),
                    describe: this.$common.key(highColorContent, content),
                    issued: arr[i].securitiesCompany ? arr[i].securitiesCompany : '',
                    listTitle: arr[i].subject,
                    date: this.$common.transTime(arr[i].sentDate)[0],
                    timeliness: arr[i].summary ? arr[i].summary : '',
                    isDescribe: describe,
                    plate: plate
                  }
                } else {
                  var strs = this.$common.key(highColorContent, content)
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: arr[i].id,
                    title: this.$common.key(highColorTitle, arr[i].subject),
                    describe: strs,
                    issued: arr[i].securitiesCompany ? arr[i].securitiesCompany : '',
                    listTitle: arr[i].subject,
                    date: this.$common.transTime(arr[i].sentDate)[0],
                    timeliness: arr[i].summary ? arr[i].summary : '',
                    plate: plate,
                    isDescribe: describe
                  }
                }
                this.info.push(obj)
              }
            }
          } else if (res.data.returnCode == -1) {
            this.isInfo = true
            this.info = []
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'warning',
            duration: 3000,
            message: res.returnMsg
          })
        })
      },
      // 重置筛选项
      resetAll() {
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          this.$refs.tree2.setChecked(this.screenList[this.isStatus].list[i], false, false)
        }
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        // alert(this.screenList[this.isStatus].type)
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
      },
      // 选择页数
      selectPage(e) {
        this.page.index = e;
        this.$common.returnTop()
        // this.submitAll()
        if (this.$route.fullPath !== '/report') {
          this.submitAll()
        } else {
          this.afficheSearch()
        }
      },
      handlePageChange(val) {
        this.page.size = val;
        this.page.index = 1;
        this.afficheSearch()
      },
      // 选择页数
      // selectPage (e) {
      //   this.flip = e
      //   this.loading = true
      // },
      // 筛选项样式
      itemStyle() {
        var k = '25%'
        var content = document.getElementsByClassName('xiaoan-box-content')[0]
        if (this.isStatus == '3') {
          k = '20%'
          content.style.cssText = 'right:0;left:auto;width:auto;padding:0 20px;'
        } else if (this.isStatus == '1') {
          k = '33%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        } else if (this.isStatus == '2') {
          k = '20%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        } else {
          k = '50%'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.isStatus = index
        this.filterText = ''
        if (this.screenList[1].title == '所有研报') {
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
        this.boxContentTi = true
        if (index == 0) {
          this.boxContent = false
          this.screenList[1].list = []
          this.screenList[1].name = []
          this.screenList[2].list = []
          this.screenList[2].name = []
          for (var i in this.screenList) {
            this.screenList[i].title = this.screenListList[i]
          }
          this.submitAll()
        } else {
          if (index == this.screenList.length - 1) {
            this.boxContentTi = false
          }
          this.data4 = this.allMapping[index]
          if (this.screenList[index].isSelect === true) {
            this.screenList[index].isSelect = false
            this.boxContent = this.screenList[index].isSelect
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = this.screenList[index].isSelect
          }
        }
        this.$nextTick(() => {
          this.itemStyle()
        })
        console.log('this.screenList[this.isStatus]', this.screenList)
      },
      // 筛选栏以外点击关闭筛选栏
      boxContClick() {
        this.boxContent = false
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
      },
      // auto选中
      selectCode(index, author) {
        // console.log('author = ', author)
        if (author) {
          this.inputName = this.autoName[index]
        } else {
          this.inputCode = this.autoCode[index].code
        }
      },
      // 作者autocomplete
      loadAuthor() {
        this.boxContClick()
        this.inputName = this.inputName ? this.inputName : ''
        this.$http({
          methods: 'GET',
          url: this.$api.report.autoAuthor,
          params: {
            pageSize: this.pagesize,
            keyWord: this.inputName
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // console.log('loadAuthor', res.data.returnObject)
            this.autoName = res.data.returnObject
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 公司代码autocomplete
      loadCode() {
        this.boxContClick()
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            // pageSize: this.pagesize,
            // keyWord: this.inputCode
            key: this.inputCode
          }
        }).then((res) => {
          // console.log('loadCode', res)
          if (res.data.returnCode == 1) {
            this.autoCode = res.data.returnObject
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message
          })
        })
      },
      // 搜索方法
      searchMethod() {
        // 敏感词检测
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        if (this.checkWordSearch(this.inputCode)) {
          this.$set(this.tipShow, 0, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }
        if (this.checkWordSearch(this.inputName)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        }
        if (this.checkWordSearch(this.inputText)) {
          this.$set(this.tipShow, 2, true)
          return false
        } else {
          this.$set(this.tipShow, 2, false)
        }
        if (this.inputText.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.flip = 1
          this.submitAll()
        }
      },
      /* 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.market == undefined ? [] : this.$route.query.market.split('##')
        this.screenList[2].list = this.$route.query.unitIds == undefined ? [] : this.$route.query.unitIds.split('##')
        // console.log('-=-=-=- 1 =-=-=-', this.screenList[2].list)
        /**/
        this.flip = this.$route.query.flip == undefined ? 1 : Number(this.$route.query.flip)

        this.sortType = this.$route.query.sortType == undefined ? '' : this.$route.query.sortType
        this.startDate = this.$route.query.releaseStart == undefined ? '' : this.$route.query.releaseStart
        this.startEnd = this.$route.query.releaseEnd == undefined ? '' : this.$route.query.releaseEnd
        this.keys = this.$route.query.keys == undefined ? this.$route.query.inputVal : this.$route.query.keys
        this.code = this.$route.query.code == undefined ? this.$route.query.inputCode : this.$route.query.code
        this.inputName = this.$route.query.inputName == undefined ? '' : this.$route.query.inputName
        /**/
        let market = [], unitIds = []
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
              if (this.screenList[2].list[x] !== '') {
                unitIds.push(this.allMapping[2][s].label)
              }
            }
          }
        }

        if (market.length != 0) {
          this.screenList[1].title = market.join(',')
        }
        if (unitIds.length != 0) {
          this.screenList[2].title = unitIds.join(',')
        }
        // console.log('== 2 ==', this.screenList[2], unitIds, this.screenList[2].list, this.allMapping[2])
        /**/
        this.inputText = this.keys
        this.inputCode = this.code
        this.afficheSearch()
      },
      // 获取筛选类
      preparation() {
        let data = [], data1 = []
        this.$http({
          methods: 'GET',
          url: this.$api.report.getIndustryList
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var list = res.data.returnObject
            for (var i = 0; i < list.length; i++) {
              data.push({
                id: i, label: list[i]
              })
            }
            data1 = [
              {id: '0', label: '公司'},
              {id: '1', label: '行业'},
              {id: '2', label: '综合'}
            ]
            this.allMapping = [[], data1, data, []]
            this.stateful()
          } else if (res.data.returnCode == -1) {
            this.allMapping = [[], data1, data, []]
            this.stateful()
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'warning',
            duration: 3000,
            message: err.error
          })
        })
      },
      // 获取我关注的公司代码
      getMyAttentionCodes() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.stock.getMyAttentions,
            params: {
              userId: this.userId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              resolve(res.data.returnObject.map(e => e.obj));
            }
            resolve([]);
          }).catch(reject);
        });
      },
      // 可比公司
      getCompanyCompare() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.enterpriseCompany.getCompanyCompare,
            params: {
              companyId: this.userInfo.companyId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              resolve(res.data.returnObject.map(e => e.code));
            }
            resolve([])
          }).catch(reject);
        });
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
            method: "GET",
            params: {
              userId: this.userId
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              resolve(res.data.returnObject.map(e => e.companyCode))
            }
            resolve([])
          }).catch(reject)
        })
      },
      afficheSearch() {
        this.inputCode = this.inputCode ? this.inputCode : ''

        if (this.inputCode == '本公司') {
          // this.handleAfficheSearch(this.userInfo.enterpriseCompanyCode)
          if (this.userInfo.enterpriseUser) {
            this.handleAfficheSearch(this.userInfo.enterpriseCompanyCode)
          } else if (this.userInfo.companyCode) {
            this.handleAfficheSearch(this.userInfo.companyCode)
          } else if (!this.userInfo.companyCode) {
            this.handleAfficheSearch('本公司')
          }
        } else if (this.inputCode == '关注公司') {
          this.getMyAttentionCodes().then(codes => {
            if (codes.length > 0) {
              this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
            } else {
              this.isInfo = true
              this.loading = false
            }
          }).catch(err => {
            this.isInfo = true
            this.loading = false
          })
        } else if (this.inputCode == '可比公司') {
          this.getCompanyCompare().then(codes => {
            this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
          }).catch(err => {
            this.isInfo = true
            this.loading = false
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '暂无可比公司！'})
          })
        } else if (this.inputCode == '监管公司') {
          this.getAllSuperviseCompanyByUser().then(codes => {
            if (codes.toString() != '') {
              this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
            } else {
              this.regulatorDialog = true
              this.isInfo = true
              this.loading = false
            }
          }).catch(err => {
            this.isInfo = true
            this.loading = false
          })
        } else if (!/^\d{1,6}$/.test(this.inputCode)) {
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCode
            }
          }).then((res) => {
            // console.log('loadCode', res)
            let searchInputCode = this.inputCode
            if (res.data.returnCode == 1) {
              this.gridData = res.data.returnObject
              if (this.gridData.length === 1) {
                if (this.inputCode === this.gridData[0].name) {
                  searchInputCode = this.gridData[0].code
                }
              }
            }
            this.handleAfficheSearch(searchInputCode)
          }).catch((err) => {
            console.log(err)
            this.handleAfficheSearch(this.inputCode)
          })
        } else {
          this.handleAfficheSearch(this.inputCode)
        }
      },
      seniorMethod() {
        // 控制搜索条的开关
        this.toggle = !this.toggle
        // if (this.showPanel) {
        //   this.dataType = 'mix'
        // } else {
        //   this.dataType = 'releaseDate'
        // }
        // this.senior++;
        // this.tipShow.forEach((item, index) => {
        //   this.$set(this.tipShow, index, false)
        // })
        // this.showPanel ? this.showPanel = false : this.showPanel = true
        // this.boxContClick()
        // this.resetSenior(2)
        /* if (!this.showPanel) {
          this.resetSenior(2)
        } */
      },
      handleAfficheSearch(searchInputCode) {
        this.loading = true
        this.inputText = this.inputText ? this.inputText : ''
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.inputName = this.inputName ? this.inputName : ''
        var dateStart = '', dateEnd = ''
        this.sortType = '发布日期'
        if (this.inputCode == '' && this.inputText == '' && this.inputName == '') {
          dateStart = this.startDate
          dateEnd = this.startEnd
        } else {
          dateStart = this.startDate
          dateEnd = this.startEnd
        }
        if (dateStart !== '') {
          dateStart = this.$common.getTimestamp(dateStart)
        }
        if (dateEnd !== '') {
          dateEnd = this.$common.getTimestamp(dateEnd)
        }
        var type = ''
        console.log(' this.screenList[1].title -- ', this.screenList[1].title, this.screenList[1])
        if (this.screenList[1].title !== '所有研报') {
          type = this.screenList[1].title.replace(/，/g, ',')
          if (type == '公司,行业,综合') {
            type = ''
          }
        }
        var indusText = ''
        if (this.screenList[2].title !== '所属行业') {
          indusText = this.screenList[2].title.replace(/，/g, ',')
        }
        this.$http({
          methods: 'GET',
          url: this.$api.report.searchReport,
          params: {
            pageNum: this.page.index,
            pageSize: this.page.size,
            companyCode: this.$common.transStr(searchInputCode),
            author: this.inputName,
            keyWord: this.$common.transStr(this.inputText),
            levelOne: type,
            industry: indusText,
            startTime: dateStart,
            endTime: dateEnd
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1) {
            this.total = Math.ceil(res.data.total / this.page.size)
            this.totalNum = res.data.total;
            // total数量超过1w条 控制显示
            if (this.total > 1000) {
              this.total = 1000
            }
            // 没有搜索结果
            if (this.total == 0) {
              this.isInfo = true
              this.info = []
            } else {
              this.isInfo = false
              var arr = res.data.returnObject
              this.info = []
              var reg = /\s/g
              var content = ''
              for (let i in arr) {
                if (arr[i].summary) {
                  content = arr[i].summary.replace(reg, '')
                }
                var describe = false
                if (this.inputText !== '') {
                  describe = true
                }
                var plate = []
                var obj = {}
                var highColorTitle = this.inputText + ' ' + this.inputName + ' ' + this.inputCode
                var highColorContent = this.inputText + ' ' + this.inputName + ' ' + this.inputCode
                // console.log('high = ', highColorContent, this.$common.key(highColorContent, content))
                if (this.$common.browserSort() == 'Chrome') {
                  obj = {
                    id: arr[i].id,
                    title: this.$common.key(highColorTitle, arr[i].subject),
                    describe: '<p>' + this.$common.key(highColorContent, content) + '</p>',
                    date: arr[i].securitiesCompany ? arr[i].securitiesCompany : '',
                    issued: this.$common.transTime(arr[i].sentDate)[0],
                    listTitle: arr[i].subject,
                    timeliness: arr[i].author ? arr[i].author : '',
                    biaoqian: arr[i].levelTwo ? arr[i].levelTwo : '',
                    pingji: arr[i].rating ? arr[i].rating : '',
                    isDescribe: describe,
                    plate: plate,
                    show: false
                  }
                } else {
                  var strs = this.$common.key(highColorContent, content)
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: arr[i].id,
                    title: this.$common.key(highColorTitle, arr[i].subject),
                    describe: strs,
                    date: arr[i].securitiesCompany ? arr[i].securitiesCompany : '',
                    issued: this.$common.transTime(arr[i].sentDate)[0],
                    listTitle: arr[i].subject,
                    timeliness: arr[i].author ? arr[i].author : '',
                    biaoqian: arr[i].levelTwo ? arr[i].levelTwo : '',
                    pingji: arr[i].rating ? arr[i].rating : '',
                    plate: plate,
                    isDescribe: describe,
                    show: false
                  }
                }
                this.info.push(obj)
              }
            }
          } else if (res.data.returnCode == '801') {
            this.isInfo = true
            this.info = []
          } else {
            this.isInfo = true
            this.info = []
            this.$message({
              showClose: true,
              type: 'error',
              duration: 3000,
              message: '系统异常，请稍后重试！'
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            duration: 3000,
            message: err.message
          })
        })
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
  .inputCodeAuto, .inputName {
    // top: 135px !important;
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
  #report {
    background: #fff;
    .header {
      width: 100%;
      height: auto;
      position: relative;
      background-size: cover;
      padding: 36px 0;
      overflow: hidden;
      .searchArea {
        width: 1200px;
        height: 44px;
        margin: auto;
        .searchCode, .searchText, .searchName {
          float: left;
          width: 180px;
          height: 44px;
          border-radius: 4px;
          -moz-box-shadow: 0px 0px 2px #FFB148;
          -webkit-box-shadow: 0px 0px 2px #FFB148;
          box-shadow: 0px 0px 2px #FFB148;
          /*overflow: hidden;*/
          input {
            width: 100%;
            height: 44px;
            border: 0;
            line-height: 44px;
            color: #5a5e66;
            outline: none;
            padding: 0 15px;
            box-sizing: border-box;
            font-size: 16px;
          }
          :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #aeaeae;
            opacity: 1;
          }
          ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #aeaeae;
            opacity: 1;
          }
          input:-ms-input-placeholder {
            color: #aeaeae;
            opacity: 1;
          }
          input::-webkit-input-placeholder {
            color: #aeaeae;
            opacity: 1;
          }
          .el-autocomplete {
            .el-input {
              .el-input__inner {
                width: 100%;
                height: 44px;
                border: 0;
                font-size: 20px;
                line-height: 44px;
              }
            }
          }
        }
        .searchName {
          margin-left: 20px;
        }
        .searchText {
          width: 675px !important;
          margin-left: 20px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
        .searchButton {
          width: 125px;
          height: 44px;
          background: #ffb148;
          float: right;
          border: 0;
          border-radius: 0;
          padding: 0 !important;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          -moz-box-shadow: 0px 0px 2px #FFB148;
          -webkit-box-shadow: 0px 0px 2px #FFB148;
          box-shadow: 0px 0px 2px #FFB148;
          i {
            font-size: 24px;
            color: #fff;
          }
          &:active {
            background: #f9e9d5;
          }
        }
      }
    }
    .screen {
      // width: 1200px;
      box-sizing: border-box;
      margin: 0 auto;
      height: auto;
      padding: 0 0 0 0;
      position: relative;
      z-index: 1000;
      border: 0;
      .xiaoan-box-content {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -ms-box-sizing: border-box;
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
          width: 12%;
          text-align: right;
        }
      }
    }
    .sort {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      margin: 15px auto;
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
    .no-list {
      position: relative;
      min-height: 700px;
      width: 100%;
    }
    .foot-pagination {
      padding: 30px 0;
    }
  }
</style>
