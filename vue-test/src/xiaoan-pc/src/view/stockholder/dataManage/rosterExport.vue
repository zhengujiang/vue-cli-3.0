<template>
  <div id="rosterExport">
    <div class="export-box">
      <div class="export-progress">
        <div class="title">股东名册导入</div>
        <!-- <el-upload v-if="!exporting" class="upload-progress" action="" :http-request="handleUpload1"
                   :show-file-list="false" accept="" :on-change="handleChange"
                   :limit="100" multiple ref="upload" :on-exceed="handleExceed" :file-list="fileList">
          <el-button ref="uploadExportBtn" class="export-btn upload-export-btn" size="small" type="primary">导入股东名册
          </el-button>
        </el-upload> -->
        <div class="upload-progress" v-if="!exporting">
          <div class="el-upload el-upload--text">
            <input class="inputUpload" id="upload" ref="upload" multiple="multiple" name="file" type="file"
                   @change="handleUpload($event)"/>
            <el-button ref="uploadExportBtn" class="export-btn upload-export-btn" size="small" type="primary">导入股东名册
            </el-button>
          </div>
        </div>
        <!-- <input multiple="multiple" name="file" type="file" @change="uploadResume($event,scope.row)"/> -->
        <!-- <el-button ref="uploadExportBtn" class="export-btn upload-export-btn" size="small" type="primary">导入股东名册</el-button> -->
        <!--progress 进度条-->
        <div class="progress">
          <vxa-progress v-if="exporting" v-model="uploadPercentage"></vxa-progress>
        </div>
        <p class="progress-desc" v-if="isSH">系统支持中国证券登记结算公司上海分公司定期发放的月度名册和公司因特定事项申请的全名册分析，相关操作请<span
          style="cursor: pointer;text-decoration: underline;"><a class="b148 link" @click="download">查看导入数据说明</a></span>
        </p>
        <p class="progress-desc" v-else>系统支持中国证券登记结算公司深圳分公司定期发放的月度名册和公司因特定事项申请的全名册分析，相关操作请<span
          style="cursor: pointer;text-decoration: underline;"><a class="b148 link" @click="download">查看导入数据说明</a></span>
        </p>
        <!-- <p class="safe-desc">*为保护用户隐私信息安全，您上传的文件将于24小时后从服务器中自动删除；系统中解析存储的数据将进行加密处理</p> -->
      </div>
      <p class="export-desc">
        相关提示说明：<br/>
        1、请导入当前登录公司代码的股东数据，非本公司数据无法导入；<br/>
        <!-- 3、名册类型命名示例：<span class="b148">t2(200)</span>：
        <span class="b148">t2</span>99960020170630
        <span class="b148">t200</span>.b06<a class="b148 link" @click="download">(查看导入数据说明)</a><br/> -->
        2、当所选两期股东名册的股东数量不一致时，系统将以股东数量“孰少”为原则进行分析；<br/>
        3、为保护用户隐私信息安全，您上传的文件将于24小时后从服务器中自动删除，系统中解析存储的数据将进行加密处理<br/>
        <span v-if="isSH">4、名册命名示例：<span class="b148">t2(200)</span>:<span class="b148">t2</span>600273032020180710<span class="b148">t200</span>.710</span>
        <span v-else>4、名册命名示例：<span class="b148">01(200)</span>:DQMC<span class="b148">01</span>_002403_20180710.zip</span>
        <!-- 6、因中登公司自2018年7月2日起实施《证券持有人名册业务实施细则》，当所选期数为新名册（前200股东）与旧名册（前100股东）对比分析时，系统将自动选取前100股东进行分析 -->
      </p>
    </div>
    <el-card v-if="true" shadow="never" class="export-list">
      <div slot="header">
        <span>导入数据情况</span>
        <!--<el-button class="el-button-more" type="text" @click="linkMore()">
          查看更多<i class="el-icon-arrow-right icon-arrow"></i>
        </el-button>-->
      </div>
      <div class="listBox" v-loading="tableLoading">
        <el-table empty-text='您还未上传数据' stripe :data="tableData" style="width: 100%" :span-method="arraySpanMethod">
          <!---->
          <el-table-column prop="date" label="序号" width="90" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <!---->
          <el-table-column prop="recordDate" label="股东期数" width="160" align="center" sortable>
            <template slot-scope="scope">
              <div class="num" @click="showInfo">{{scope.row.recordDate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="导入文件">
            <template slot-scope="scope">
              <div class="roster-box" v-if="scope.row.MONTH.status > 0">
                <div class="roster">
                  <div class="col info">
                    <a class="vxa-hover vxa-a-hover" href="javascript:"
                       @click="scope.row.MONTH.show = !scope.row.MONTH.show">
                      <span>{{scope.row.MONTH.name}}</span>
                      <span class="num">({{scope.row.MONTH.status}}/{{scope.row.MONTH.list.length}})</span>
                      <span class="lost" v-if="scope.row.MONTH.lack != 0">缺{{scope.row.MONTH.lack}}期</span>
                      &ensp;<i :class="{'rotate':scope.row.MONTH.show}" class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                  <div class="col opt-icon">
                    <img @click="linkEvent(scope.row.MONTH)" class="show-icon pointer" :src="$image.stockholder.show">
                    <img @click="removeEventData(scope.row.MONTH)" class="pointer" :src="$image.stockholder.delete">
                  </div>
                </div>
                <!---->
                <el-collapse-transition>
                  <div class="roster-item" :class="{'vux-1px-b': scope.row.WHOLE.status > 0}" style="width: 100%"
                       v-show="scope.row.MONTH.show">
                    <div class="item" v-for="(mt, index) in scope.row.MONTH.list">
                      <span>
                        <el-tooltip effect="light" :content="mt.description" placement="bottom-start" :visible-arrow="false">
                          <span class="roll-name">{{mt.rollTypeName}}</span>
                        </el-tooltip>
                        <span v-if="!mt.summaryId">暂缺</span></span>
                      <span class="export isUpload" v-if="mt.summaryId">{{'上传成功'}}</span>
                      <span class="export" @click="setUpload" v-else>{{'立即导入'}}</span>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
              <!---->
              <div class="roster-box" v-if="scope.row.WHOLE.status > 0">
                <!--全名册-->
                <div class="roster">
                  <div class="col info">
                    <a class="vxa-hover vxa-a-hover" href="javascript:"
                       @click="scope.row.WHOLE.show = !scope.row.WHOLE.show">
                      <span>{{scope.row.WHOLE.name}}</span>
                      <span class="num">({{scope.row.WHOLE.status}}/{{scope.row.WHOLE.list.length}})</span>
                      <span class="lost" v-if="scope.row.WHOLE.lack != 0">缺{{scope.row.WHOLE.lack}}期</span>
                      &ensp;<i :class="{'rotate':scope.row.WHOLE.show}" class="el-icon-arrow-down"></i>
                    </a>
                  </div>
                  <div class="col opt-icon">
                    <img @click="linkEvent(scope.row.WHOLE)" class="show-icon pointer" :src="$image.stockholder.show">
                    <img @click="removeEventData(scope.row.WHOLE)" class="pointer" :src="$image.stockholder.delete">
                  </div>
                </div>
                <!---->
                <el-collapse-transition>
                  <div class="roster-item" v-if="scope.row.WHOLE.show">
                    <div class="item" v-for="mt in scope.row.WHOLE.list">
                      <span>
                        <!--{{mt.rollTypeName}}-->
                        <el-tooltip effect="light" :content="mt.description" placement="bottom-start" :visible-arrow="false">
                          <span class="roll-name">{{mt.rollTypeName}}</span>
                        </el-tooltip>
                        <span v-if="!mt.summaryId">暂缺</span>
                      </span>
                      <span class="export isUpload" v-if="mt.summaryId">{{'上传成功'}}</span>
                      <span class="export" @click="setUpload" v-else>{{'立即导入'}}</span>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </template>
          </el-table-column>
          <!---->
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope"></template>
          </el-table-column>
          <!---->
        </el-table>
        <div class="btn-box" v-if="tableData.length!= 0">
          <div class="left">
            <span v-if="tableData.length!= 0">共{{tableData.length}}条</span>
          </div>
          <el-button type="primary" class="export-btn" @click="removeAllData">清空全部数据</el-button>
        </div>
      </div>
    </el-card>
    <!---->
    <el-dialog top="25%" class="dialogStockHolder rosterExportDig" :visible.sync="exportDialog" width="620px"
               :show-close="true" :close-on-click-modal="false" :before-close="exportHandleClose" center>
      <template slot="title">小安提示</template>
      <!---->
      <!-- <template slot="title">小安提示</template> -->
      <div style="padding: 0 10px" class="progress-log">
        <div class="message">数据已上传！系统正在为您解析，请耐心等待！</div>
        <vxa-progress v-model="uploadAnalysis" :animation="false" :height="12" :width="'100%'"></vxa-progress>
      </div>
      <!---->
      <el-dialog top="25%" width="800px" class="dialogStockHolder rosterExportDig dialog-detail"
                 :visible.sync="analysisD"
                 append-to-body :show-close="true" :close-on-click-modal="false">
        <template slot="title">小安提示</template>
        <div style="padding: 0 10px;">
          <div style="color:#323232,font-size: 16px">数据解析完成！</div>
          <el-table size="mini" :data="errorData" stripe max-height="385" width="700">
            <el-table-column prop="recordDate" label="期数" width="130" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名" align="center" width="200"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="result" label="导入状态" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.result == '成功导入'" class=""><i class="el-icon-check" style="color: #FFB148"></i>{{scope.row.result}}</span>
                <span v-else><i class="el-icon-close" style="color: #43D661"></i>{{scope.row.result}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" show-overflow-tooltip label="错误原因" align="center"></el-table-column>
          </el-table>
          <!-- <div class="message center" style="text-align: center">{{returnMessage}}</div> -->
          <div class="center top20">
            <el-button type="primary" class="check-btn" @click="exportDialogCheck(1)">确认</el-button>
          </div>
        </div>

      </el-dialog>
      <!---->
      <el-dialog class="dialogStockHolder" :visible.sync="exportDeactivated" width="620px" :show-close="false"
                 top="25%" :close-on-click-modal="false" center append-to-body>
        <template slot="title">小安提示</template>
        <div class="message">系统将在后台为您解析！</div>
        <div class="center top20">
          <el-button type="primary" class="check-btn" @click="exportDialogCheck(2)">确认</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!---->

    <!---->
    <el-dialog class="dialogStockHolder" :visible.sync="delExport" width="620px" :show-close="false"
               :close-on-click-modal="false" center>
      <template slot="title">删除</template>
      <div class="message">您将删除2018-07-20期共4组月度股东名册数据，删除后将无法找回！</div>
      <div class="center top20">
        <el-button type="primary" class="check-btn" plain>取消</el-button>
      </div>
      <div class="center top20">
        <el-button type="primary" class="check-btn">确认</el-button>
      </div>
    </el-dialog>
    <!---->
    <el-dialog class="dialogStockHolder dialogXieye" :visible.sync="showDialog" width="620px" :show-close="false"
               :close-on-click-modal="false" center>
      <template slot="title">用户协议</template>
      <div class="xieye-content">
        一、接受条款<br/>
        1、用户点击信公小安注册页面的同意注册按钮并完成注册程序、获得信公小安账号和密码时，视为用户与信公小安已达成《信公小安用户协议》。<br/><br/>
        2、信公小安在此特别提示，用户欲使用信公小安服务，必须事先认真阅读本协议全部条款（未成年人阅读时应得到其监护人的陪同），特别是本协议中免除、减轻或者限制信公小安责任的全部条款以及含有限制用户权利内容的全部条款。<br/><br/>
        3、用户下载、注册、登录、使用及连接信公小安服务等行为均将被视为用户完全了解、接受并同意遵守本协议项下的全部内容。本协议可由信公小安单方随时修改，修改后的协议条款一经信公小安公布即代替本协议的原条款，构成用户与信公小安之间就本协议主题事由的全部、最新协议。用户可可以随时在信公小安网站或信公小安应用程序中查阅最新协议条款。如果用户不接受信公小安修改后的最新协议条款，请立即停止使用信公小安服务。如用户选择继续使用信公小安服务，则视为用户完全了解、接受并同意遵守信公小安修改后的最新协议条款。<br/><br/>
        4、用户特此声明，已经完全理解本协议相关内容，并不存在任何重大误解；同时，认可协议内容并不存在有失公平的情形。<br/><br/>
        二、用户信息条款<br/>
        1、用户个人信息。用户个人信息包括下列信息：用户真实姓名，职业，头像，手机号码，IP地址。<br/><br/>
        2、非用户个人信息。用户对信公小安服务的操作状态、使用记录、使用习惯等反映在信公小安服务器端的全部记录信息，及其他一切本条第1款所述的用户个人信息范围外的信息，均为普通信息，均不属于用户个人信息。<br/><br/>
        3、第三方平台记录信息。用户通过新浪微博账号、微信账号等第三方平台账号（下称“第三方平台”）注册、登录、使用信公小安服务的，将被视为用户完全了解、同意并接受信公小安已包括但不限于收集、统计、分析等方式使用其在新浪微博、微信等第三方平台上填写、登记、公布、记录的全部信息（下称“第三方平台记录信息”）。用户一旦使用第三方平台账号注册、登录、使用信公小安服务，信公小安对该等第三方平台记录的信息的任何使用，均将被视为已经获得了用户本人的完全同意并接受。<br/><br/>
      </div>
      <div class="center top20">
        <el-checkbox v-model="checked">我同意</el-checkbox>
      </div>
      <div class="center top20">
        <el-button type="primary" class="check-btn" @click="close">确认</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog class="dialog-detail" title="小安提示" :visible.sync="errorData.length > 0" width="620px" top="30vh">
      <div class="dialog-table">
        <el-table :data="errorData" stripe max-height="385">
          <el-table-column type="recordDate" label="期数" width="45" align="center"></el-table-column>
          <el-table-column prop="fileName" label="文件名" align="center" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="result" label="导入状态" align="right" sortable></el-table-column>
          <el-table-column prop="reason" label="错误原因" align="center" width="172"></el-table-column>
        </el-table>
        <p>本次解禁股东<span>{{fewTotal}}</span>家，共<span>{{numTotal}}</span>万股</p>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showDialog: false,
        checked: false,
        descObject: {
          export: ` `,
          // progress: `*若拟分析月度股东名册，请完整导入月度股东名册t3(200)+t2(200)+t3(100)+t2(100)共4组数据；若拟分析全体股东名册，请完整导入t1+t5共2组数据`
          progress: `*系统支持中国证券登记结算公司深圳分公司定期发放的月度名册和公司因特定事项申请的全名册分析，相关操作请查看导入数据说明（这里放下载链接）`
        },
        show: false,
        exporting: false,
        exportDialog: false,
        analysisP: false,
        delExport: false,
        tableData: [],
        tableLoading: true,
        tableOptionObj: {
          // 0 => 股东全名册，1 => 月度股东名册
          'T1': 0,
          'T5': 0,
          'T2(100)': 1,
          'T2(200)': 1,
          'T3(100)': 1,
          'T3(200)': 1
        },
        fileList: [],
        uploadPercentage: 20,
        uploadAnalysis: 0,
        analysisD: false,
        source: null, // 取消上传
        exportDeactivated: false,
        userInfo: {},
        returnMessage: '',
        errorData: [],
        isSH: false
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      //
      exportDialog: function (val) {
        if (val) {
          // window.onbeforeunload = function (next) {
          //   return '系统将在后台为您解析！'
          // }
          this.uploadAnalysis = 0;
          window.upLoadIntset = setInterval(() => {
            this.uploadAnalysis += 1
            if (this.uploadAnalysis >= 78) {
              clearInterval(window.upLoadIntset);
            }
          }, 1300)
        } else {
          clearInterval(window.upLoadIntset);
        }
      },
      //
      exporting: function (val) {
        if (val) {
          // window.onbeforeunload = function (next) {
          //   return '系统将在后台为您解析！'
          // }
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.exporting == true || this.exportDialog == true) {
        this.$confirm('系统将在后台为您解析！').then(() => {
          next()
        }).catch(() => {
          next(false)
        });
      } else {
        next()
      }
    },
    beforeDestroy() {
      // this.$router.replace({path:''});
      this.exportDeactivated = true;
      clearInterval(window.intset);
    },
    // 生命周期函数
    created() {
      this.getUserUploadRecord();
      let userInfo = JSON.parse(this.$cookie.get('userInfo'));
      if (userInfo.enterpriseCompanyFullCode.indexOf('SH') != -1) {
        this.isSH = true;
      } else {
        this.isSH = false;
      }
    },
    mounted() {
    },
    // 方法
    methods: {
      handleChange(res, file) {
        console.log(res);
        console.log(file)
        // this.fileUpload(file)
      },
      //
      download() {
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
        let isMarket = this.userInfo.enterpriseCompanyFullCode.substring(0, 2);
        let url = 'http://oss.in-hope.cn/gxf/shuoming/导入数据说明-沪市.xlsx';
        /*
        * http://oss.in-hope.cn/gxf/shuoming/daorushuoming_hushi.xlsx
          http://oss.in-hope.cn/gxf/shuoming/daorushuoming_shenshi.xlsx
          http://oss.in-hope.cn/gxf/shuoming/导入数据说明-沪市.xlsx
          http://oss.in-hope.cn/gxf/shuoming/导入数据说明-深市.xlsx
         */
        switch (isMarket) {
          case 'SH':
            url = 'http://oss.in-hope.cn/gxf/shuoming/导入数据说明-沪市.xlsx'
            break;
          case 'SZ':
            url = 'http://oss.in-hope.cn/gxf/shuoming/导入数据说明-深市.xlsx'
            break;
        }
        var linkA = document.createElement('a');
        linkA.setAttribute('target', '_blank');
        linkA.setAttribute('download', 'download');
        linkA.setAttribute('href', url);
        linkA.setAttribute('id', url);
        if (!document.getElementById(url)) {
          document.body.appendChild(linkA)
        }
        linkA.click();
        setTimeout(() => {
          linkA.parentNode.removeChild(linkA)
        }, 300);
        //
        console.log(this.userInfo, isMarket);
      },
      //
      exportHandleClose() {
        this.exportDialog = true;
        this.exportDeactivated = true;
      },
      //
      exportDialogCheck(type) {
        switch (type) {
          case 1:
            this.exportDialog = false;
            this.analysisD = false;
            this.analysisP = false;
            this.exportDeactivated = false;
            break;
          case 2:
            this.exportDialog = false;
            this.analysisD = false;
            this.analysisP = false;
            this.exportDeactivated = false;
            break
        }
      },
      //
      close() {
        if (this.checked) {
          this.showDialog = false
        } else {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先同意用户协议'});
        }
      },
      //
      setUpload() {
        document.querySelector('.inputUpload').click();
      },
      //
      getUserUploadRecord() {
        this.tableLoading = true;
        let params = {userId: this.$cookie.get('userId')}
        this.$axios.gxfApi.getUserUploadRecord(params).then(res => {
          this.tableLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res);
            let tableData = res.data.returnObject;
            tableData.forEach((it, i) => {
              this.$set(it, 'MONTH', {});
              this.$set(it, 'WHOLE', {});

              this.$set(it.MONTH, 'list', it.resultMap.MONTH)
              this.$set(it.MONTH, 'name', '月度股东名册')
              let m = 0, ml = 0;

              it.MONTH.list.forEach((e, j) => {
                if (e.summaryId) {
                  m++
                }
              })
              ml = it.MONTH.list.length - m;
              this.$set(it.MONTH, 'status', m)
              this.$set(it.MONTH, 'show', false)
              this.$set(it.MONTH, 'lack', ml)
              this.$set(it.MONTH, 'time', it.recordDate)
              this.$set(it.MONTH, 'type', 2)
              // let iswhork = true
              // if (it.resultMap.WHOLE.length == 0) {
              //   iswhork = false
              // }
              // this.$set(it.MONTH, 'iswhork', iswhork)
              //
              this.$set(it.WHOLE, 'list', it.resultMap.WHOLE)
              this.$set(it.WHOLE, 'name', '股东全名册')
              let y = 0, yl = 0
              it.WHOLE.list.forEach((e, j) => {
                if (e.summaryId) {
                  y++
                }
              })
              yl = it.WHOLE.list.length - y;
              this.$set(it.WHOLE, 'status', y)
              //
              this.$set(it.WHOLE, 'show', false)
              this.$set(it.WHOLE, 'lack', yl)
              this.$set(it.WHOLE, 'time', it.recordDate)
              this.$set(it.WHOLE, 'type', 1)
            })
            this.tableData = [];
            this.$nextTick(() => {
              this.tableData = tableData;
            });
            console.log(this.tableData, tableData)
          }
        }).catch(err => {
          this.tableLoading = false;
        })
      },
      //
      fileUpload(file) {
        this.exporting = true;
        let CancelToken = this.$axios.gxfApi.Axios.CancelToken;
        this.source = CancelToken.source();
        let form = new FormData();
        for (var i = 0; i < file.length; i++) {
          form.append('rollFile', file[i]);
        }
        form.append('userId', this.$cookie.get('userId'));
        let params = {
          data: form,
          cancelToken: this.source.token,
          onUploadProgress: progressEvent => {
            this.uploadPercentage = (progressEvent.loaded / progressEvent.total * 100 | 0);
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
            this.exporting = true;
            console.log(complete, this.exporting);
            if (this.uploadPercentage == 100) {
              // this.$message({showClose: true, message: '上传成功！', type: 'success'});
              this.exportDialog = true;
              this.analysisP = true;
            }
          }
        };
        this.$axios.gxfApi.FileUpload(params).then(res => {
          if (res.data.returnCode == 1) {
            // this.returnMessage = res.data.returnMsg;
            this.errorData = res.data.returnObject
            this.analysisD = true;
            this.getUserUploadRecord();
            setTimeout(() => {
              this.exporting = false;
              this.uploadPercentage = 0;
              this.exportDialog = false;
              //
              this.uploadAnalysis = 100;
            }, 300)
          }
        }).catch(err => {
          clearInterval(window.intset);
          setTimeout(() => {
            this.exportDialog = false;
            this.exporting = false;
            this.uploadPercentage = 0;
            // this.$message({showClose: true, message: '取消上传，上传失败！', type: 'error'});
          })
        })
      },
      //
      handleExceed(files, fileList) {
        // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //
      handleUpload1(e) {
        console.log(e);
        // this.fileUpload(e.target.files);

        this.fileUpload(e.file);
      },
      handleUpload(e) {
        console.log(e)
        // console.log(e.target.files);
        // console.log(Object.values(e.target.files));
        this.fileUpload(e.target.files);
      },
      //
      showInfo() {
        this.show = true
      },
      //
      linkEvent(scope) {
        if (scope.lack != 0) {
          this.$confirm('请导入一期完整数据再查看', '小安提示', {
            confirmButtonText: '立即导入',
            // cancelButtonText: '立即导入',
            type: 'warning'
          }).then(() => {
            this.setUpload();
          }).catch(() => {
          })
        }
        if (scope.list.length == scope.status) {
          let time = this.$common.getTimestampms(scope.time);
          this.$common.openWindow(`/stockholder/viewShareholder?time=${time}&type=${scope.type}`);
          this.delExport = false;
        } else {

        }
      },
      //
      batchDeleteUploadRecords() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.batchDeleteUploadRecords(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.getUserUploadRecord();
            this.$message({showClose: true, type: 'warning', message: '清除成功!'});
          }
        }).catch(err => {

        })
      },
      //
      deleteBySummaryIds(scope) {
        let scopeId = scope.list.map(e => {
          return e.summaryId
        });
        scopeId = this.$array.impArray(scopeId);
        let params = {
          userId: this.$cookie.get('userId'),
          summaryIds: scopeId.toString(),
          reportDate: scope.time,
          rollType: scope.type
        }
        this.tableLoading = true;
        this.$axios.gxfApi.deleteBySummaryIds(params).then(res => {
          this.tableLoading = false;
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '删除成功!'});
            this.getUserUploadRecord();
          }
        }).catch(err => {
          this.tableLoading = false;
        })
      },
      //
      removeEventData(scope) {
        console.log(scope);

        let massage = `您将删除${scope.time}期共${scope.list.length}组${scope.name}数据，删除后将无法找回！`

        this.$confirm(massage, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBySummaryIds(scope);
        }).catch(() => {
          // this.$message({showClose: true, type: 'info', message: '已取消删除'});
        });
        // this.delExport = true;
      },
      //
      removeAllData() {
        // this.source.cancel('强制取消上传！');
        //
        this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          this.batchDeleteUploadRecords();
        }).catch(_ => {
          //  this.$message({type: 'info', message: '已取消删除'});
        });
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 2) {
          return [1, 2];
        } else if (columnIndex == 3) {
          return [0, 0]
        }
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
  .rosterExportDig {
    transition: .3s all;
    .el-dialog {
      transform: translateY(-50%);
    }
  }
  .el-dialog__header {
    text-align: center;
  }
  #rosterExport {
    min-height: 600px;
    .dialog-detail {
      .el-dialog__header {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        border-bottom: 1px solid #E3E3E3;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
        }
        .el-dialog__headerbtn {
          top: 18px;
        }
      }
      .el-dialog__body {
        padding: 0;
      }
      .dialog-table {
        padding: 16px 16px 6px 16px;
        p {
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 17px;
          margin-top: 10px;
          margin-bottom: 6px;
        }
      }
      .el-table::before {
        display: none;
      }
      .el-table {
        th {
          padding: 0;
          .cell {
            font-size: 12px;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            line-height: 35px;
            padding: 0;
          }
        }
        td {
          padding: 0;
          .cell {
            font-size: 12px;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 35px;
          }
        }
        td.shareholdNumber {
          .cell {
            text-align: right;
            padding-right: 32px;
          }
        }
      }
    }
    .export-box {
      height: 200px;
      border-radius: 4px;
      border: 1px dashed #e3e3e3;
      .export-progress {
        float: left;
        width: 560px;
        padding-left: 20px;
        .upload-progress {
          position: relative;
          input {
            position: absolute;
            bottom: 0;
            left: 0;
            opacity: 0;
            -ms-filter: 'alpha(opacity=0)';
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
        .title {
          margin-top: 30px;
          border-left: 2px solid #ffb148;
          padding-left: 8px;
          font-size: 16px;
          font-weight: 600;
          height: 16px;
          line-height: 16px;
        }
        .progress {
          margin-top: 20px;
          width: 410px;
        }
        .upload-progress {
          margin-top: 20px;
          width: 410px;
          .export-btn {
            width: 450px;
            height: 50px;
            border-radius: 4px;
            font-size: 18px;
            font-weight: 600;
          }
        }
        .present {
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          color: #8d8d8d;
          font-size: 12px;
          width: 414px;
        }
        .progress-desc {
          color: #8d8d8d;
          font-size: 12px;
          width: 456px;
          /*padding-top: 10px;*/
          line-height: 1.4;
        }
        .safe-desc {
          padding-top: 9px;
          font-size: 12px;
          width: 456px;
          color: #FB4319;
          text-align: left;
        }

      }
      .export-desc {
        float: left;
        margin-top: 14px;
        padding: 8px 0 9px 10px;
        width: 623px;
        height: 168px;
        background: rgba(244, 244, 244, 1);
        border-radius: 4px;
        border: 1px solid #e3e3e3;
        line-height: 25px;
        color: #8d8d8d;
        font-size: 14px;
        .b148 {
          color: #ffb148;
          &.link {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    .export-list {
      margin-top: 16px;
      padding: 0 15px;
      .listBox {
        // min-height: 200px;
      }
      .roster-box {
        width: 100%;
        .roster {
          color: #000;
          display: flex;
          align-items: center;
          .num {
            color: #8d8d8d;
          }
          .lost {
            display: inline-flex;
            padding: 0 3px;
            width: 38px;
            height: 20px;
            line-height: 20px;
            background: #fb4319;
            border-radius: 2px;
            color: #fff;
            transform: scale(0.8);
          }
          i {
            padding: 3px 3px;
            transition: 0.3s all;
            transform: rotate(0deg);
            cursor: pointer;
            &.rotate {
              transition: .3s all;
              transform: rotate(180deg);
              color: #FFB148;
              font-weight: bold;
            }
          }
          .col {
            flex: 1;
            &.info {
              flex: 1;
              width: 786px;
              padding: 3px 0;
            }
            &.opt-icon {
              flex: 0 0 12%;
              .pointer {
                vertical-align: middle;
              }
              .show-icon {
                margin-right: 30px;
              }
            }
          }
        }
        .roster-item {
          width: 600px;
          .item {
            display: inline-block;
            width: 280px;
            color: #aeaeae
          }
          .export {
            color: #ffb148;
            text-decoration: underline;
            margin-left: 10px;
            cursor: pointer;
            &.isUpload {
              text-decoration: none;
              color: #AEAEAE;
              cursor: default;
            }
          }
          .upload {
            color: #ffb148;
          }
          .roll-name {
            cursor: pointer;
            &:hover {
              color: #ffb148;
            }
          }
        }
      }
      .btn-box {
        text-align: right;
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
        .left {
          font-size: 12px;
          font-weight: 400;
          color: rgba(169, 169, 169, 1);
          line-height: 12px;
        }
      }
    }
  }
</style>
