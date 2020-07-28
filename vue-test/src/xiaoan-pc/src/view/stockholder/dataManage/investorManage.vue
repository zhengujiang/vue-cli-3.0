<template>
  <div id="investorManage">
    <div class="header">
      <div class="search-input">
        <div class="auto">
          <input class="search-investor" @keyup.enter="searchInvestor" v-model="searchWord" type="text"
                 placeholder="搜索投资者名称/职务/联系电话/邮件/地址">
          <button @click="searchInvestor">
            <i class="el-icon-search"></i>
          </button>
          <ul class="autoComplate" v-show="automatic && searchWord">
            <li v-for="(item, index) in autoList" @click="goDetaile(index)">
              <p v-html="item"></p>
            </li>
          </ul>
        </div>
        <span class="shareholder">股东性质</span>
        <el-select @change="holderTypeChange" size="mini" v-model="nature" placeholder="全部">
          <el-option
            v-for="item in natureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-option">
        <el-button class="new-investors" size="small" type="primary" @click="addInvestors">新增投资者信息</el-button>
        <el-popover
          popper-class="popover-option"
          placement="bottom"
          width="137"
          :visible-arrow="false"
          trigger="click">
          <div class="vux-1px-b">
            <p style="margin-bottom:7px;" @click="newSurvey">新增调研记录</p>
          </div>
          <p style="margin-top:7px;" @click="allResearch">查看全部调研记录</p>
          <el-button class="new-investors" slot="reference" size="small" type="primary">调研记录</el-button>
        </el-popover>
        <el-button class="new-investors" size="small" type="primary" @click="uploadInvestor">导出数据库</el-button>
      </div>
    </div>
    <div class="body" v-loading="tableLoading">
      <el-table ref="tableFocus" size="small" :data="tableData" stripe style="width: 100%"
                @sort-change="tableSortChange">
        <template slot="empty">
          <div class="noinfo">
            <v-noInfo altText='检索不到内容'></v-noInfo>
          </div>
        </template>
        <el-table-column show-overflow-tooltip type="index" label="序号" align="center" width="45"></el-table-column>
        <el-table-column class-name="investor-name" prop="investorName" label="投资者名称" align="center" width="193">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.investorName" placement="top">
              <router-link v-if="scope.row.rollOfficialId != null && scope.row.rollOfficialId != '--'"
                           class="vxa-a-hover underline"
                           :to="'/stockholder/institutionAccountInfo?id='+scope.row.rollOfficialId" target="_blank">
                <div class="info">
                  {{scope.row.investorName}}
                </div>
              </router-link>
              <div v-else class="info">
                {{scope.row.investorName}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="investType" label="股东性质" align="center"
                         width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="shareholdingNum" label="持股数量(股)" align="right" sortable="custom"
                         width="130">
          <!-- <template slot-scope="scope"> -->
          <!-- {{$array.abs(scope.row.shareholdingNum, false)}} -->
          <!-- </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="contactMan" label="联系人" align="center"
                         width="85"></el-table-column>
        <el-table-column show-overflow-tooltip prop="position" label="职位" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="联系电话" align="center" width="120">
          <template slot-scope="scope">
            <el-popover :disabled="scope.row.mobile=='--' && scope.row.contactPhone == '--'" :visible-arrow="false"
                        popper-class="popper-phone" width="80"
                        placement="bottom" trigger="hover">
              <template v-if="scope.row.mobile !== '--' || scope.row.contactPhone !== '--'">
                <p v-if="scope.row.mobile !== '--'">手机：{{scope.row.mobile}}</p>
                <p v-if="scope.row.contactPhone !== '--'">固话：{{scope.row.contactPhone}}</p>
              </template>
              <span v-if="scope.row.mobile !== '--'" slot="reference">{{scope.row.mobile}}</span>
              <span v-else slot="reference">{{scope.row.contactPhone}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip class-name="Email" prop="email" label="电子邮件" align="center"
                         width="115">
        </el-table-column>
        <el-table-column class-name="address" prop="contactAddress" label="地址" align="center"
                         width="150">
          <!-- <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.contactAddress" placement="top">
              <div class="info">
                {{scope.row.contactAddress}}
              </div>
            </el-tooltip>
          </template>           -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="researchCount" label="调研次数" align="center"
                         width="70"></el-table-column>
        <el-table-column show-overflow-tooltip prop="edit" class="addColor" label="操作" align="center" width="70">
          <template slot-scope="scope">
            <img class="editBtn" :src="$image.stockholder.edit" @click="edit(scope.row.id)">
            <img class="editBtn editBtn-rt" :src="$image.stockholder.delete" @click="delet(scope.row)">
          </template>
        </el-table-column>
      </el-table>

      <div class="footer" v-show="this.tableData.length > 0">
        <div class="pagination" v-show="!isInfo">
          <div class="block" style="width: 100%;text-align: left">
            <el-pagination @current-change="selectPage" layout="prev, pager, next"
                           :current-page="flip" :page-count="total">
            </el-pagination>
          </div>
          <div class="button-group">
            <el-radio-group size="mini" v-model="pageSize" @change="switchBar">
              <el-radio-button label="30">30条</el-radio-button>
              <el-radio-button label="50">50条</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :before-close="closeDialog" class="dialog-research" :title="newOrEdit" :visible.sync="research"
               width="620px" top="15vh">
      <div class="research">
        <el-form :model="form" label-width="90px">
          <div class="auto">
            <el-form-item label="投资者" class="inverFont"
                          :class="[{'is-success': errFrom.investorName === 1}, {'is-error': errFrom.investorName === 0}]"
                          required>
              <el-input @blur="onblur('investorName')" @focus="oninput('investorName')"
                        class="investor-information" v-model="form.investorName"
                        placeholder="请输入投资者名称，或从股东名册添加" clearable>
                <span class="investorName">{{form.investorName}}</span>
                <div slot="append">
                  <el-popover placement="bottom" width="250" :visible-arrow="false" v-model="visible2">
                    <div class="search-name">
                      <input class="search-shareholder" v-model="searchInvestorName" type="text" placeholder="搜索股东名称">
                      <button @click="request"><i class="el-icon-search"></i></button>
                    </div>
                    <div class="register-added vux-1px-b" v-loading="isLoading">
                      <el-radio-group v-model="checks">
                        <el-radio v-for="(list, i) in checkList" :label="list" :key="i">
                          {{list.possessorName}}/{{list.possessorAmount}}
                        </el-radio>
                        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" style="width:250px;">
                          <span class="no-more" slot="no-more"></span>
                          <span class="no-more" slot="no-results"></span>
                        </infinite-loading>
                      </el-radio-group>
                    </div>
                    <div class="dialog-footer">
                      <el-button type="primary" plain @click="visible2 = false">取消</el-button>
                      <el-button type="primary" @click="confirmAdd">确定</el-button>
                    </div>
                    <el-button slot="reference" class="fromStock" @click="addShareholder">从股东名册添加</el-button>
                  </el-popover>
                </div>
              </el-input>
              <ul class="autoComplate" v-show="showAutoComplate && form.investorName">
                <li v-for="(item, index) in autocompleteList" @click="goQuestionDetaile(item)">
                  <p v-html="item.possessor"></p>
                </li>
              </ul>
              <div v-show="errFrom.investorName===0" class="el-form-item__error">请输入投资者名称</div>
            </el-form-item>
          </div>
          <el-form-item label="持股情况"
                        :class="[{'is-error': errFrom.shareholdingNum === 1}, {'is-error': errFrom.shareholdingNum === 0}]"
                        required>
            <el-input @blur="onblur('shareholdingNum')" @focus="oninput('shareholdingNum')" class="investor-information"
                      v-model="form.shareholdingNum" placeholder="请输入持股情况，如果没有，可以填写0"></el-input>
            <div v-show="errFrom.shareholdingNum===0" class="el-form-item__error">请输入持股情况</div>
            <div v-show="errFrom.shareholdingNum===1" class="el-form-item__error">持股情况必须是数字</div>
          </el-form-item>
          <el-form-item label="股东性质" :class="[{'is-error': errFrom.investType === 0}]" required>
            <el-select @focus="oninput('investType')" class="investor-information" size="mini" v-model="form.investType"
                       placeholder="请选择股东性质">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-show="errFrom.investType=== 0" class="el-form-item__error">请选择股东性质</div>
          </el-form-item>
          <el-form-item label="联系人" required class="hiddenreqired">
            <el-col :span="11">
              <el-input class="contactInfo" v-model="form.contactMan" placeholder="请输入联系人姓名"></el-input>
            </el-col>
            <el-col :span="11">
              <el-input class="input-class" v-model="form.position" placeholder="请输入联系人职务"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系电话" required class="hiddenreqired">
            <el-col :span="11">
              <el-input class="contactInfo" v-model="form.mobile" placeholder="请输入手机号码"></el-input>
            </el-col>
            <el-col :span="11">
              <el-input class="input-class" v-model="form.contactPhone" placeholder="请输入固定电话"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="电子邮件" :class="[{'is-success': errFrom.email === 1}, {'is-error': errFrom.email === 0}]"
                        required class="hiddenreqired">
            <el-input @blur="onblur('email')" @focus="oninput('email')" class="investor-information"
                      v-model="form.email" placeholder="请输入电子邮件"></el-input>
            <div v-show="errFrom.email===0" class="el-form-item__error">
              {{form.email ===''?'请输入邮箱':'邮箱格式错误'}}
            </div>
          </el-form-item>
          <el-form-item label="地址" required class="hiddenreqired">
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressProvince" placeholder="请选择" no-data-text="请选择"
                           @change="getCitylistOnChang">
                  <el-option v-for="item in areaData.pro" :key="item.id" :label="item.name"
                             :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressCity" placeholder="请选择" no-data-text="请选择" @change="getTownList">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressTown" placeholder="请选择" no-data-text="请选择">
                  <el-option v-for="item in townList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item class="textarea-address">
            <el-input type="textarea" v-model="form.contactAddressStreet"
                      placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="confirm" type="primary" @click="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog class="dialog-research" title="新增完成" :visible.sync="newCompletion" width="620px" top="30vh">
      <div class="new-completion">
        <p class="message">新增调研记录完成！</p>
        <el-button class="confirmButton" type="primary" @click="finished">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import areaData from '@/service/area_data.js'
  import page from '@/components/customPage.vue'
  import InfiniteLoading from 'vue-infinite-loading'
  export default {
    data() {
      return {
        enterpriseCompanyCode: '',
        visible2: false,
        radio2: 3,
        nature: '',
        userId: '',
        searchWord: '',
        tableLoading: false,
        showAutoComplate: false,
        automatic: false,
        autocompleteList: [],
        autoList: [],
        searchInvestorName: '',
        options: [
          {
            value: '1',
            label: '公募基金'
          }, {
            value: '2',
            label: '私募基金'
          }, {
            value: '3',
            label: '证券公司资管产品'
          }, {
            value: '4',
            label: '社保基金'
          }, {
            value: '5',
            label: 'QFII'
          }, {
            value: '6',
            label: 'RQFII'
          }, {
            value: '7',
            label: '汇金公司'
          }, {
            value: '8',
            label: '中证金'
          }, {
            value: '9',
            label: '香港结算公司'
          }, {
            value: '10',
            label: '一般机构或产品'
          }, {
            value: '11',
            label: '自然人'
          }
        ],
        natureOptions: [
          {
            value: '',
            label: '全部'
          }, {
            value: '1',
            label: '公募基金'
          }, {
            value: '2',
            label: '私募基金'
          }, {
            value: '3',
            label: '证券公司资管产品'
          }, {
            value: '4',
            label: '社保基金'
          }, {
            value: '5',
            label: 'QFII'
          }, {
            value: '6',
            label: 'RQFII'
          }, {
            value: '7',
            label: '汇金公司'
          }, {
            value: '8',
            label: '中证金'
          }, {
            value: '9',
            label: '香港结算公司'
          }, {
            value: '10',
            label: '一般机构或产品'
          }, {
            value: '11',
            label: '自然人'
          }
        ],
        value: [],
        tableData: [],
        investorMan: [],
        pageSize: 30, // 默认显示30条
        displayMode: "30",
        isInfo: false, // 是否存在搜索结果
        flip: 1, // 默认页码
        total: 50, // 总页数
        orderType: '', // 持股数量排序方式
        research: false,
        newCompletion: false,
        form: {
          investorName: '',
          shareholdingNum: '', // 持股情况
          investType: '',
          contactMan: '',
          position: '',
          mobile: '',
          contactPhone: '',
          email: '',
          contactAddressProvince: '',
          contactAddressCity: '',
          contactAddressTown: '',
          contactAddressStreet: '',
          onePasswordAccount: '',
          recordDate: ''
        },
        errFrom: {
          investorName: '',
          shareholdingNum: '', // 持股情况
          investType: '',
          contactMan: '',
          position: '',
          mobile: '',
          contactPhone: '',
          email: '',
          contactAddressProvince: '',
          contactAddressCity: '',
          contactAddressTown: '',
          contactAddressStreet: ''
        },
        centerDialogVisible: false,
        checkList: [],
        rollOfficial: {
          pageNum: 1,
          pageSize: 30,
          total: 1
        },
        checks: {},
        id: '', // 投资者信息的id
        areaData: areaData,
        cityList: '',
        townList: '',
        newOrEdit: '新增投资者信息',
        isLoading: false,
        onePasswordAccount: '',
        recordDate: ''
      }
    },
    // 使用其它组件
    components: {
      'v-page': page,
      // 'v-page': page
      InfiniteLoading
    },
    computed: {
      searchWord1() {
        return this.form.investorName
      }
    },
    watch: {
      searchWord1: function (val) {
        setTimeout(() => {
          this.searchInput()
        }, 500)
      },
      searchWord: function (val) {
        setTimeout(() => {
          this.autoInvestor()
        }, 500)
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getInvestorInner();
      this.autoInvestor();
    },
    mounted() {
      // 从股东名册添加
      this.getNewRollOfficial();
      document.addEventListener('click', () => {
        this.showAutoComplate = false
      });
      document.addEventListener('click', () => {
        this.automatic = false
      })
    },
    // 方法
    methods: {
      switchBar() {
        this.flip = 1;
        this.getInvestorInner();
      },
      verification(item) {
        if (item == 30) {
          this.$message({message: '抱歉，您已达到最大字数限制', showClose: true, type: 'warning', duration: 3000});
        }
      },
      // 选择页数
      selectPage(i) {
        this.flip = i;
        this.loading = true;
        this.getInvestorInner();
      },
      // 数字每三位加一个逗号
      amountAbs(val) {
        if (val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else if (val == null) {
          return '--';
        } else {
          return this.$array.abs(val, false);
        }
      },
      goDetaile(index) {
        this.searchWord = this.investorMan[index];
        this.searchInvestor();
      },
      autoInvestor() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.autoInvestor,
          params: {
            keyWord: this.searchWord,
            userId: userId,
            pageSize: '10'
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject.length > 0) {
              this.automatic = true;
              let obj = [];
              this.investorMan = res.data.returnObject;
              res.data.returnObject.forEach((item, i) => {
                if (i <= 9) {
                  item = this.hightList(item);
                  obj.push(item);
                }
              });
              this.autoList = obj;
              // console.log(this.autoList);
            } else {
              this.automatic = false
              this.autoList = []
            }
          }
        }).catch((err) => {
        })
      },
      closeDialog() {
        let ket = false;
        for (var key in this.form) {
          if (this.form[key]) {
            ket = true;
          }
        }
        if (ket) {
          this.$confirm('您将放弃新建投资者信息', '小安提示', {
            confirmButtonText: '放弃',
            cancelButtonText: '继续填写',
            type: 'warning'
          }).then(() => {
            this.research = false;
          }).catch(() => {
          })
        } else {
          this.research = false;
        }
      },
      // 股东性质发生变化
      holderTypeChange() {
        this.$refs.tableFocus.clearSort();
        this.orderType = '';
        this.flip = 1;
        this.getInvestorInner();
      },
      request() {
        this.checkList = [];
        this.rollOfficial.pageNum = 1;
        this.rollOfficial.pageSize = 30;
        this.rollOfficial.total = 1;
        this.getNewRollOfficial();
      },
      goQuestionDetaile(item) {
        this.form.investorName = item.possessorName;
        this.form.shareholdingNum = item.possessorAmount;
        this.form.investType = item.possessorType;
        this.form.mobile = item.messagePhone;
        this.form.contactAddressStreet = item.messageAddress;
        if (this.form.investorName !== '') {
          this.errFrom.investorName = 2;
        }
        if (this.form.shareholdingNum !== '') {
          this.errFrom.shareholdingNum = 2;
        }
        if (this.form.investType !== '') {
          this.errFrom.investType = 2;
        }
        this.visible2 = false;
      },
      searchInput() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getNewRollOfficial,
          params: {
            pageNum: 1,
            pageSize: 10,
            userId: userId,
            keyWord: this.form.investorName
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.total > 0) {
              this.showAutoComplate = true
              let obj = res.data.returnObject;
              obj.forEach((item, i) => {
                item.possessor = this.hightLignt(item.possessorName)
              });
              this.autocompleteList = obj
            } else {
              this.showAutoComplate = false
              this.autocompleteList = []
            }
          }
        }).catch((err) => {
        })
      },
      hightLignt(value) {
        let searchWord1 = this.form.investorName.split(' ').join(',')
        if (searchWord1.indexOf(',') > -1) {
          let searchWordArr = searchWord1.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              let reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value = value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          let reg = new RegExp('(' + searchWord1.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }
      },
      hightList(value) {
        let searchValue = this.searchWord.split(' ').join(',')
        if (searchValue.indexOf(',') > -1) {
          let searchWordArr = searchValue.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              let reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value = value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          let reg = new RegExp('(' + searchValue.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }
      },
      addShareholder() {
        // 将单选框选中的选项清空
        this.checks = {};
      },
      uploadInvestor() {
        let userId = this.$cookie.get('userId')
        if (!userId) {
          userId = ''
        }
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.uploadInvestor,
          params: {
            userId: userId
          }
        }).then((res) => {
          // window.location.href = res.data.returnObject;
          this.saveAs(res.data.returnObject);
        }).catch((err) => {
        })
      },
      saveAs(link) {
        var filename = '131231.png'
        var a = document.createElement('a');
        a.setAttribute('download', 'download');
        a.href = link;
        a.innerHTML = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      },
      checkPhone(phone) {
        if (phone != '') {
          var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
          if (pattern.test(phone) == false) {
            return false;
          } else {
            return true;
          }
        }
      },
      checkAll() {
        let allkey = ['investorName', 'shareholdingNum', 'email', 'investType']
        for (let i = 0; i < allkey.length; i++) {
          if (allkey[i] === 'investType') {
            if (this.form.investType === '') {
              this.errFrom.investType = 0
            }
          }
          this.onblur(allkey[i]);
        }
        if (this.errFrom.investorName === 0 || this.errFrom.shareholdingNum === 0 || this.errFrom.email === 0 || this.errFrom.investType === 0 || this.errFrom.shareholdingNum === 1) {
          return false
        } else {
          return true
        }
      },
      onblur(key) {
        if (key === 'investorName') {
          if (this.empty(this.form.investorName)) {
            this.errFrom.investorName = 0
          } else {
            this.errFrom.investorName = 1
          }
        } else if (key === 'shareholdingNum') {
          if (this.empty(this.form.shareholdingNum)) {
            this.errFrom.shareholdingNum = 0;
          } else if (!this.empty(this.form.shareholdingNum) && isNaN(this.form.shareholdingNum)) {
            this.errFrom.shareholdingNum = 1;
          }
        } else if (key === 'email') {
          if (!this.$regx.mail(this.form.email) && this.form.email !== '') {
            this.errFrom.email = 0
          } else {
            this.errFrom.email = 1
          }
        }
      },
      oninput(key) {
        if (key === 'investorName') {
          this.errFrom.investorName = 2
        } else if (key === 'shareholdingNum') {
          this.errFrom.shareholdingNum = 2
        } else if (key === 'email') {
          this.errFrom.email = 2
        } else if (key === 'investType') {
          this.errFrom.investType = 2
        } else if (key === 'contactPhone') {
          this.errFrom.contactPhone = 2
        }
      },
      finished() {
        this.newCompletion = false;
      },
      submitForm() {
        if (this.newOrEdit == '新增投资者信息') {
          if (this.checkAll()) {
            this.addInvestor();
          }
        } else {
          if (this.checkAll()) {
            this.updateInvestor();
          }
        }
      },
      confirmAdd() {
        this.form.investorName = this.checks.possessorName;
        this.form.shareholdingNum = this.checks.possessorAmount;
        this.form.investType = this.checks.possessorType;
        this.form.mobile = this.checks.messagePhone;
        if (this.checks.messageAddress) {
          this.form.contactAddressStreet = this.checks.messageAddress;
        }
        this.form.onePasswordAccount = this.checks.onePasswordAccount;
        this.form.recordDate = this.checks.recordDate;
        this.form.rollOfficialId = this.checks.id;
        if (this.form.investorName !== '') {
          this.errFrom.investorName = 2;
        }
        if (this.form.shareholdingNum !== '') {
          this.errFrom.shareholdingNum = 2;
        }
        if (this.form.investType !== '') {
          this.errFrom.investType = 2;
        }
        this.visible2 = false;
      },
      newSurvey() {
        this.$router.push('/stockholder/relationshipResearch');
      },
      allResearch() {
        this.$router.push('/stockholder/surveyRecords');
      },
      searchInvestor() {
        if (this.searchWord.length == 0) {
          this.flip = 1;
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'});
          this.getInvestorInner();
        }
        if (this.searchWord.length < 2) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'});
        } else {
          this.flip = 1;
          // console.log(typeof this.pageSize);
          this.getInvestorInner();
        }
      },
      getInvestorInner() {
        this.tableLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.searchInvestor,
          params: {
            keyWord: this.searchWord,
            investType: this.nature,
            orderType: this.orderType,
            userId: this.userId,
            pageNum: this.flip,
            pageSize: this.pageSize
          }
        }).then((res) => {
          this.tableLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.total = Math.ceil(res.data.total / this.pageSize);
            let dataName = res.data.returnObject;
            dataName.forEach((item, index) => {
              if (item.contactAddress == null || item.contactAddress == 0) {
                item.contactAddress = '--'
              }
              Object.keys(item).forEach((q, j) => {
                if (item[q] == null || item[q] === '') {
                  item[q] = '--'
                }
              })
              if (this.natureOptions[item.investType]) {
                item.investType = this.natureOptions[item.investType].label;
              } else {
                item.investType = '--'
              }
              item.shareholdingNum = this.amountAbs(item.shareholdingNum);
            });
            this.tableData = dataName;
          } else {
            this.tableData = [];
          }
        }).catch((err) => {

        })
      },
      addInvestor() {
        let userId = this.$cookie.get('userId');
        if (this.form.contactAddressProvince == '请选择') {
          this.form.contactAddressProvince = '';
        }
        if (this.form.contactAddressCity == '请选择') {
          this.form.contactAddressCity = '';
        }
        if (this.form.contactAddressTown == '请选择') {
          this.form.contactAddressTown = '';
        }
        let contactAddress = this.form.contactAddressProvince + this.form.contactAddressCity + this.form.contactAddressTown + this.form.contactAddressStreet;
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.addInvestor,
          params: {
            id: '',
            investorName: this.form.investorName,
            investType: this.form.investType,
            shareholdingNum: this.form.shareholdingNum,
            contactMan: this.form.contactMan,
            mobile: this.form.mobile,
            position: this.form.position,
            contactPhone: this.form.contactPhone,
            email: this.form.email,
            contactAddress: contactAddress,
            contactAddressProvince: this.form.contactAddressProvince,
            contactAddressCity: this.form.contactAddressCity,
            contactAddressTown: this.form.contactAddressTown,
            contactAddressStreet: this.form.contactAddressStreet,
            createUserId: userId,
            updateUserId: userId,
            rollOfficialId: this.form.rollOfficialId,
            onePasswordAccount: this.form.onePasswordAccount,
            recordDate: this.form.recordDate
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.research = false;
            this.$message({message: '信息提交成功', showClose: true, type: 'success', duration: 3000});
            // this.searchInvestor();
            this.flip = 1;
            this.getInvestorInner();
          }
        }).catch((err) => {
          // console.log(err, '错误')
        })
      },
      updateInvestor() {
        let userId = this.$cookie.get('userId');
        if (this.form.contactAddressProvince == '请选择') {
          this.form.contactAddressProvince = '';
        }
        if (this.form.contactAddressCity == '请选择') {
          this.form.contactAddressCity = '';
        }
        if (this.form.contactAddressTown == '请选择') {
          this.form.contactAddressTown = '';
        }
        let contactAddress = this.form.contactAddressProvince + this.form.contactAddressCity + this.form.contactAddressTown + this.form.contactAddressStreet;
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.updateInvestor,
          params: {
            id: this.id,
            investorName: this.form.investorName,
            investType: this.form.investType,
            shareholdingNum: this.form.shareholdingNum,
            contactMan: this.form.contactMan,
            mobile: this.form.mobile,
            position: this.form.position,
            contactPhone: this.form.contactPhone,
            email: this.form.email,
            contactAddress: contactAddress,
            contactAddressProvince: this.form.contactAddressProvince,
            contactAddressCity: this.form.contactAddressCity,
            contactAddressTown: this.form.contactAddressTown,
            contactAddressStreet: this.form.contactAddressStreet,
            createUserId: userId,
            updateUserId: userId,
            rollOfficialId: this.form.rollOfficialId,
            onePasswordAccount: this.form.onePasswordAccount,
            recordDate: this.form.recordDate
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.research = false;
            this.$message({message: '信息修改成功', showClose: true, type: 'success', duration: 3000})
            // this.searchInvestor();
            this.flip = 1;
            this.getInvestorInner();
          }
        }).catch((err) => {
          // console.log(err, '错误')
        })
      },
      onInfinite() {
        this.rollOfficial.pageNum += 1
        this.getNewRollOfficial()
      },
      getNewRollOfficial() {
        this.isLoading = true;
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getNewRollOfficial,
          params: {
            pageNum: this.rollOfficial.pageNum,
            pageSize: this.rollOfficial.pageSize,
            userId: userId,
            keyWord: this.searchInvestorName
          }
        }).then((res) => {
          // this.checkList = res.data.returnObject;
          this.isLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.checkList = this.checkList.concat(res.data.returnObject)
            let total = res.data.total
            let tPage = this.$common.totalPage(total, this.rollOfficial.pageSize)
            if (this.rollOfficial.pageNum >= tPage) {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          }
        }).catch((err) => {
          // console.log(err, '错误')
        })
      },
      tableSortChange(column, prop, order) {
        if (column.order == 'ascending') {
          this.orderType = 'ShareholdingNum_ASC';
          this.flip = 1;
          this.getInvestorInner();
        }
        if (column.order == 'descending') {
          this.orderType = 'ShareholdingNum_DESC';
          this.flip = 1;
          this.getInvestorInner();
        }
      },
      edit(id) {
        for (var key in this.errFrom) {
          this.errFrom[key] = '';
        }
        this.newOrEdit = '编辑投资者信息';
        this.research = true;
        this.id = id;
        this.getById();
      },
      delet(item) {
        this.id = item.id;
        this.$confirm(`此操作将把投资者 ${item.investorName} 从当前数据库移除，确定移除?`, '小安提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteInvestor();
        }).catch(() => {
        })
      },
      deleteInvestor() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'PUT',
          url: this.$api.gxfApi.deleteInvestor,
          params: {
            ids: this.id,
            userId: userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'});
            this.flip = 1;
            this.getInvestorInner();
          }
        })
      },
      getById() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getById,
          params: {
            id: this.id,
            userId: userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.form = res.data.returnObject;
          }
        }).catch((err) => {
          // console.log(err, '错误')
        })
      },
      getCitylistOnChang(proName, cityName, townName) {
        this.onblur('contactAddressProvince')
        this.getCityList(proName, cityName, townName)
      },
      getCityList(proName, cityName, townName) {
        // this.onblur('contactAddressProvince')
        let proId = this.getProId(proName)
        this.cityList = this.areaData.city[proId]
        if (!cityName || cityName === '请选择') {
          cityName = this.cityList[0].name
          this.form.contactAddressCity = cityName
        }
        this.getTownList(cityName, townName)
      },
      empty(value) {
        if (!value) {
          return true
        } else {
          return this.$regx.blank(value)
        }
      },
      getProId(proName) {
        let proId = ''
        for (let i in this.areaData.pro) {
          if (this.areaData.pro[i].name === proName) {
            proId = this.areaData.pro[i].id
          }
        }
        return proId
      },
      getTownList(cityName, townName) {
        let cityId = this.getCityId(cityName)
        this.townList = this.areaData.county[cityId]
        if (!townName || townName === '请选择') {
          townName = this.townList[0].name
          this.form.contactAddressTown = townName
        }
      },
      getCityId(cityName) {
        let cityId = ''
        for (let i in this.cityList) {
          if (this.cityList[i].name === cityName) {
            cityId = this.cityList[i].id
          }
        }
        return cityId
      },
      addInvestors() {
        for (var key in this.form) {
          this.form[key] = '';
        }
        ;
        for (var key1 in this.errFrom) {
          this.errFrom[key1] = '';
        }
        ;
        this.newOrEdit = '新增投资者信息';
        this.research = true;
      }
    }
  }
</script>

<style lang="scss">
  .el-message-box__wrapper {
    .el-message-box__title, .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 177, 72, 1);
    }
    .el-message-box__btns {
      button {
        width: 80px;
        height: 32px;
      }
    }
  }
  .popover-option {
    cursor: pointer;
  }
  .popper-phone {
    font-size: 12px;
  }
  .el-popover {
    width: 250px;
    .search-name {
      width: 226px;
      height: 26px;
      .search-shareholder {
        width: 190px;
        height: 26px;
        box-shadow: 0px 1px 1px 0px rgba(255, 177, 72, 0.26);
        border-radius: 4px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #FFB148;
        float: left;
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
        line-height: 26px;
        border-right: none;
        margin-bottom: 9px;
        padding-left: 6px;
      }
      button {
        width: 36px;
        height: 26px;
        background: #FFB148;
        float: left;
        font-size: 16px;
        border: 0;
        outline: none;
        font-size: 16px;
        border-radius: 0;
        color: #ffffff;
        padding: 0 !important;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        box-shadow: 0px 0px 2px #FFB148;
      }
    }
    .register-added {
      height: 289px;
      width: 226px;
      overflow: auto;
      padding-bottom: 30px;
      .el-radio-group {
        .el-radio {
          display: block;
          margin-left: 0;
          line-height: 0;
          padding: 0 0 8px 0;
          .el-radio__label {
            padding-left: 8px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 17px;
          }
        }
      }
    }
    .dialog-footer {
      padding: 15px 0 16px 0;
      text-align: center;
      button {
        float: left;
        text-align: center;
        width: 106px;
        height: 35px;
        padding: 0;
        span {
          font-size: 12px;
          display: inline-block;
          height: 35px;
          width: 106px;
          text-align: center;
          line-height: 35px;
        }
      }
    }
  }
  .el-select-dropdown__item {
    font-size: 12px;
  }
  #investorManage {
    .investorName {
      background-color: #ffb148;
      border-radius: 5px;
    }
    .header {
      width: 100%;
      height: 51px;
      display: flex;
      justify-content: center;
      .search-option {
        font-size: 12px;
        font-weight: 400;
        text-align: right;
        flex: 1;
        line-height: 17px;
        .new-investors {
          width: 137px;
          height: 35px;
          font-size: 16px;
          font-weight: 600;
        }
        .el-button {
          margin-left: 16px;
        }
      }
      .search-input {
        height: 24px;
        display: inline-block;
        flex: 1;
        text-align: left;
        margin-top: 6px;
        .search-investor {
          width: 291px;
          height: 24px;
          box-shadow: 0px 0px 2px #E3E3E3;
          border-radius: 2px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          padding: 0 9px;
          border: 1px solid #E3E3E3;
          float: left;
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 24px;
          border-right: none;
        }
        button {
          width: 40px;
          height: 24px;
          background: #FFB148;
          float: left;
          border: 0;
          outline: none;
          font-size: 13px;
          border-radius: 0;
          color: #ffffff;
          padding: 0 !important;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          box-shadow: 0px 0px 2px #FFB148;
        }
        .shareholder {
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 17px;
          margin-left: 16px;
          // margin-right: 5px;
        }
        .el-select {
          width: 140px; // 宽度比效果图长
          margin-left: 5px;
          height: 24px;
        }
        .auto {
          position: relative;
          .autoComplate {
            position: absolute;
            z-index: 100 !important;
            top: 33px;
            left: 0;
            width: 291px;
            min-height: 48px;
            background-color: #fff;
            box-shadow: 0 0 15px #e3e3e3;
            li {
              padding: 0 12px;
              list-style-type: none;
              width: 100%;
              height: 35px;
              line-height: 1;
              font-size: 15px;
              background-color: white;
              box-sizing: border-box;
              p {
                display: inline-block;
                float: left;
                height: 35px;
                line-height: 35px;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: justify;
                border-bottom: 1px solid #e3e3e3;
                .hightLight {
                  color: #ff9933;
                }
              }
            }
          }
        }
      }
    }
    .body {
      .el-table__body-wrapper {
        min-height: 400px;
      }
      .noinfo {
        min-height: 550px;
      }
      table {
        font-size: 12px;
        font-weight: 400;
        color: rgba(84, 84, 84, 1);
        line-height: 17px;
      }
      td {
        vertical-align: middle;
        border: none;
        padding: 6px 0;
      }
      th {
        padding: 5px 0;
        background-color: #F0F0F0;
        border: none;
        .cell {
          color: #545454;
        }
      }
      .caret-wrapper {
        position: relative;
      }
      .el-table::before {
        height: 0;
      }
      .append {
        font-size: 12px;
        color: #FFB148;
        text-decoration: underline;
      }
      .append:hover {
        cursor: pointer;
      }
      .appended {
        font-size: 12px;
        color: #8D8D8D;
      }
      .appended:hover {
        cursor: pointer;
      }
      td.investor-name .cell {
        .info {
          width: 173px;
          text-align: center;
          max-height: 46px;
          overflow: hidden;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
      }
      td.address .cell {
        padding: 0;
        width: 140px;
        text-align: center;
        max-height: 46px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-height: 1.4;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
      td.Email .cell {
        width: 150px;
        text-align: center;
      }
      .editBtn {
        cursor: pointer;
      }
      .editBtn-rt {
        margin-left: 15px;
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
    .dialog-research {
      .el-dialog__header {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
        }
        .el-dialog__headerbtn {
          top: 18px;
        }
      }

      .el-input__inner {
        padding-left: 6px;
      }
      .el-dialog__body {
        padding: 0;
      }
      .new-completion {
        border-top: 1px solid #E3E3E3;
        height: 119px;
        .message {
          font-size: 16px;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          line-height: 22px;
          margin: 20px 234px 20px 242px;
        }
        .confirmButton {
          width: 200px;
          height: 35px;
          font-size: 16px;
          margin: 0px 210px 22px 210px;
          padding-top: 8px;
        }
      }
      .research {
        border-top: 1px solid #E3E3E3;
        height: 554px;
        .el-input {
          font-size: 16px;
        }
        .textarea-address {
          .el-textarea__inner {
            width: 514px;
            height: 70px;
            padding: 8px;
            font-size: 16px;
          }
        }
        .el-form-item__label {
          font-size: 16px;
          padding: 0;
        }
        .fromStock {
          span {
            color: rgba(255, 177, 72, 1);
            text-decoration: underline;
          }
        }
        .inverFont {
          .el-form-item__label {
            text-align: right;
            letter-spacing: 0px;
            padding-left: 5px;
          }
        }
        .investor-information {
          width: 514px;
          .el-input__inner {
            height: 40px;
          }
        }
        .el-input-group__append, .el-input-group__prepend {
          background-color: rgba(255, 255, 255, 1);
          padding: 0 10px;
        }
        .el-form-item {
          font-size: 16px;
          margin-bottom: 16px;
        }
        .el-form {
          margin-top: 16px;
        }
        .input-class {
          margin-left: 22px;
          width: 249px;
        }
        .contactInfo {
          width: 249px;
        }
        .confirm {
          width: 200px;
          height: 35px;
          margin-left: 120px;
          // margin-bottom: 30px;
          margin-top: 4px;
          padding-top: 7px;
          font-size: 16px;
        }
        .el-form-item.is-required .el-form-item__label:before {
          margin-left: 4px;
          float: right;
          position: relative;
          top: -6px;
        }
        .hiddenreqired .el-form-item__label:before {
          visibility: hidden;
        }
        .hiddenreqired .contactPhone {
          margin-left: 50%;
        }
        .space {
          .el-select {
            width: 177px;
            padding-right: 16px;
          }
        }
        .el-form-item.is-error .el-input__inner {
          border-color: #fb4319;
        }
        .el-form-item .is-error .el-input__inner {
          border-color: #fb4319;
        }
        .el-form-item__error {
          color: #fb4319;
          padding-top: 2px;
        }
        .auto {
          position: relative;
          .autoComplate {
            position: absolute;
            z-index: 100 !important;
            top: 50px;
            left: 0;
            width: 380px;
            min-height: 48px;
            background-color: #fff;
            box-shadow: 0 0 15px #e3e3e3;
            li {
              padding: 0 12px;
              list-style-type: none;
              width: 100%;
              height: 35px;
              line-height: 1;
              font-size: 15px;
              background-color: white;
              box-sizing: border-box;
              p {
                display: inline-block;
                float: left;
                height: 35px;
                line-height: 35px;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: justify;
                border-bottom: 1px solid #e3e3e3;
                .hightLight {
                  color: #ff9933;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
