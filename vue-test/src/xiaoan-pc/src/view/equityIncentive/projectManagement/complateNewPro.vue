<template>
  <div id="complateNewPro">
    <div class="targetAdvance">
      <el-dialog title="导入激励对象" :visible.sync="targetAdvance" width="460px" center>
        <div class="planInfo">
          <div class="info1">
            <p>
              <span class="key">计划名称：</span>
              <span class="value">计划名称假字填充</span>
            </p>
            <p>
              <span class="key">激励方式：</span>
              <span class="value">限制性股票</span>
            </p>
          </div>
          <div class="info2">
            <p>
              <span class="key">拟授予股数：</span>
              <span class="value">999,999,999</span>
            </p>
            <p>
              <span class="key">实际授予股数：</span>
              <span class="value">999,999,999</span>
            </p>
          </div>
          <div class="info3">
            <p>
              <span class="key">激励对象人数：</span>
              <span class="value">1,234</span>
            </p>
          </div>
          <div class="info4">
            <p>
              <span class="key">未解除限售股数：</span>
              <span class="value">999,999,999</span>
            </p>
            <p>
              <span class="key">已解除限售股数股数：</span>
              <span class="value">999,999,999</span>
            </p>
            <p>
              <span class="key">可解除限售日期：</span>
              <span class="value">2019.2.2</span>
            </p>
          </div>
        </div>
        <div class="progressBar">
          <!-- <div style="height: 300px;">
                      <el-steps direction="vertical">
                        <el-step title="2019年2月28日" description="开始计划"></el-step>
                        <el-step title="2019年2月28日" description="开始第一次授予计划 本次授予总数：999,999,999"></el-step>
                        <el-step title="2019年2月28日" description="第一个解禁期开始 本次解禁总数：999,999,999"></el-step>
                        <el-step title="2019年2月28日" description="第一个解禁期完成"></el-step>
                        <el-step title="2019年2月28日" description="第二个解禁期完成"></el-step>
                        <el-step title="2019年2月28日" description="开始第二次授予计划"></el-step>
                      </el-steps>
          </div>-->
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>开始计划</p>
          </div>
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>开始第一次授予计划 本次授予总数：999,999,999</p>
          </div>
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>第一个解禁期开始 本次解禁总数：999,999,999</p>
          </div>
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>第一个解禁期完成</p>
          </div>
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>第二个解禁期完成</p>
          </div>
          <div class="step">
            <p class="date">2019年2月28日</p>
            <p>开始第二次授予计划</p>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="content main">
      <div class="title">
        <p>本公司激励计划</p>
        <div class="button">
          <el-select size="mini" v-model="value5" placeholder="切换计划">
            <el-option label="切换计划" value>第一期计划名称</el-option>
            <el-option label="切换计划" value>第一期计划名称</el-option>
            <el-option label="切换计划" value>第一期计划名称</el-option>
            <el-option label="切换计划" value @click.native.prevent="planManage">
              <i class="el-icon-setting"></i>计划管理
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="plain">
        <div class="name">
          <div class="first">
            <span>计划名称</span>
            <el-select size="mini" v-model="value6" placeholder="已完成">
              <el-option label="进行中" value></el-option>
              <el-option label="已完成" value></el-option>
            </el-select>
          </div>
          <el-radio-group size="mini" v-model="radio3" @change="handleChange">
            <el-radio-button label="数据概览"></el-radio-button>
            <el-radio-button label="图表概览"></el-radio-button>
          </el-radio-group>
        </div>
        <el-tabs v-model="activeName" v-if="this.code == '数据概览'" @tab-click="handleClick">
          <el-tab-pane label="限制性股票" name="first">
            <div class="data">
              <div class="block" v-for="(item, index) in 7">
                <p>999,999,999</p>
                <p>总股本(万股)</p>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="股票期权" name="second">
            <div class="data">
              <div class="block" v-for="(item, index) in 7">
                <p>999,999,999</p>
                <p>总股本(万股)</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" v-if="this.code == '图表概览'" @tab-click="handleClick">
          <el-tab-pane label="限制性股票" name="first">
            <div class="charts">图表</div>
          </el-tab-pane>
          <el-tab-pane label="股票期权" name="second">
            <div class="charts">图表</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="limit" v-if="this.code1 == 'first'">
        <div class="stock">
          <p>限制性股票</p>
          <div class="importPop">
            <el-dialog title="导入激励对象" :visible.sync="importPop" width="620px" center>
              <div class="popTop">
                <p>文件名称：这是文件名称的回显</p>
                <el-button type="text" size="small">重新上传</el-button>
              </div>
              <div class="popBottom">
                <el-radio-group v-model="radio4">
                  <el-radio :label="1">第一次授予</el-radio>
                  <el-radio :label="2">第二次授予</el-radio>
                </el-radio-group>
                <p class="add"><el-button class="el-icon-circle-plus-outline" type="text"> 自定义添加第三次授予日</el-button></p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="importPop = false" class="noButton">取 消</el-button>
                <el-button
                  type="primary"
                  @click="importPop = false; successPop = true"
                  class="yesButton"
                >确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="successPop">
            <el-dialog title="导入激励对象" :visible.sync="successPop" width="620px" center>
              <div class="center">
                <img src alt>
                <p>文件导入成功，如需查看原始文件，请前往文件库</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="successPop = false">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="button">
            <el-button type="primary" size="mini" @click="targetAdvance = true">计划进度</el-button>
            <el-button type="primary" size="mini">下载激励对象模版</el-button>
            <el-button type="primary" size="mini" @click="importPop = true">导入激励对象文件</el-button>
            <el-button type="primary" size="mini" plain>导出名单</el-button>
          </div>
        </div>
        <div class="push">
          <el-input size="mini" placeholder="姓名/身份证号" v-model="input5">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <div class="pushRight">
            <p>
              授予次数
              <el-select class="number" v-model="value7" placeholder="请选择" size="mini">
                <el-option label="次数自定义名称的筛选" value></el-option>
              </el-select>
            </p>
            <p>
              解禁期筛选
              <el-select class="choose" v-model="value7" placeholder="请选择" size="mini">
                <el-option label="第一个解禁期" value></el-option>
              </el-select>
            </p>
          </div>
        </div>
        <div class="push1">
          <div class="left">
            <span>股份状态</span>
            <div class="buttons">
              <el-button type="primary" size="mini">批量改为正常</el-button>
              <el-button type="primary" size="mini">批量改为待回购</el-button>
              <el-button type="primary" size="mini">批量改为回购注销</el-button>
            </div>
          </div>
          <div class="right">
            <span>考核结果</span>
            <div class="buttons">
              <el-button type="primary" size="mini">批量改为未考核</el-button>
              <el-button type="primary" size="mini">批量改为已达标</el-button>
              <el-button type="primary" size="mini">批量改为未达标</el-button>
            </div>
          </div>
        </div>
        <div class="detailInner1" v-if="this.code2 == false">
          <el-table :data="tableData" style="width: 100%" stripe @row-click="personalInfo">
            <el-table-column label="基本信息">
              <el-table-column prop label width="59">
                <template slot="header" slot-scope="scope">
                  <el-select size="mini" v-model="value6" placeholder>
                    <el-option label value="1">全选</el-option>
                    <el-option label value="2">全不选</el-option>
                    <el-option label value="3">正常股份状态</el-option>
                    <el-option label value="4">待回购股份状态</el-option>
                    <el-option label value="5">回购注销股份状态</el-option>
                    <el-option label value="6">个人考核未考核</el-option>
                    <el-option label value="7">个人考核未考核</el-option>
                    <el-option label value="8">个人考核未考核</el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <el-checkbox></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="62"></el-table-column>
              <el-table-column prop="identity" label="身份证号" width="139"></el-table-column>
            </el-table-column>
            <el-table-column>
              <el-table-column prop="total" label="获授总数(股)" sortable width="105"></el-table-column>
            </el-table-column>
            <el-table-column label="激励计划">
              <template slot="header" slot-scope="scope">
                <el-button @click.native.prevent="changeTable"></el-button>
              </template>
              <el-table-column prop label="股份状态" width="100">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="companyAssessment" label="公司考核" width="92">
                <template slot-scope="scope">
                  <span class="future">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width="158">
                <template slot-scope="scope">
                  <span class="no">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width="100">
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额 (元)" width="97"></el-table-column>
              <el-table-column prop="tax2" label="应纳税额 (元)" width="113"></el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width="141"></el-table-column>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
            <el-radio-group v-model="radio5" size="small">
              <el-radio-button label="30条"></el-radio-button>
              <el-radio-button label="50条"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="detailInner2" v-if="this.code2 == true">
          <el-table :data="tableData" style="width: 100%" stripe @row-click="personalInfo">
            <el-table-column label="基本信息" width="259px">
              <el-table-column prop label width="59px">
                <template slot="header" slot-scope="scope">
                  <el-select size="mini" v-model="value6" placeholder>
                    <el-option label value="1">全选</el-option>
                    <el-option label value="2">全不选</el-option>
                    <el-option label value="3">正常股份状态</el-option>
                    <el-option label value="4">待回购股份状态</el-option>
                    <el-option label value="5">回购注销股份状态</el-option>
                    <el-option label value="6">个人考核未考核</el-option>
                    <el-option label value="7">个人考核未考核</el-option>
                    <el-option label value="8">个人考核未考核</el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <el-checkbox></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="62px"></el-table-column>
              <el-table-column prop="identity" label="身份证号" width="139px"></el-table-column>
            </el-table-column>
            <el-table-column>
              <el-table-column prop="total" label="获授总数(股)" sortable width="105px"></el-table-column>
            </el-table-column>
            <el-table-column label="激励计划">
              <template slot="header" slot-scope="scope">
                <el-button @click.native.prevent="changeTable"></el-button>
              </template>
              <el-table-column prop="total" label="解除限售安排"></el-table-column>
              <el-table-column prop="total" label="授予股份数量 (股)"></el-table-column>
              <el-table-column prop="total" label="可解除限售数量 (股)"></el-table-column>
              <el-table-column prop="total" label="可解除限售日"></el-table-column>
              <el-table-column prop="total" label="实际解除限售日"></el-table-column>
              <el-table-column prprop="total"op label="实际解除数量 (股)"></el-table-column>
              <el-table-column prop label="股份状态" width="100">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="companyAssessment" label="公司考核">
                <template slot-scope="scope">
                  <span class="future">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width>
                <template slot-scope="scope">
                  <span class="no">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width>
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额 (元)" width></el-table-column>
              <el-table-column prop="tax2" label="应纳税额 (元)" width></el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width></el-table-column>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
            <el-radio-group v-model="radio5" size="small">
              <el-radio-button label="30条"></el-radio-button>
              <el-radio-button label="50条"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="limit" v-if="this.code1 == 'second'">
        <div class="stock">
          <p>股票期权</p>
          <div class="importPop">
            <el-dialog title="导入激励对象" :visible.sync="importPop" width="620px" center>
              <div class="popTop">
                <p>文件名称：这是文件名称的回显</p>
                <el-button type="text" size="small">重新上传</el-button>
              </div>
              <div class="popBottom">
                <el-radio-group v-model="radio4">
                  <el-radio :label="1">第一次授予</el-radio>
                  <el-radio :label="2">第二次授予</el-radio>
                </el-radio-group>
                <p class="add">
                  <i class="el-icon-circle-plus-outline"></i>添加第三次授予
                </p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="importPop = false" class="noButton">取 消</el-button>
                <el-button
                  type="primary"
                  @click="importPop = false; successPop = true"
                  class="yesButton"
                >确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="successPop">
            <el-dialog title="导入激励对象" :visible.sync="successPop" width="620px" center>
              <div class="center">
                <img src alt>
                <p>文件导入成功，如需查看原始文件，请前往文件库</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="successPop = false">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="button">
            <el-button type="primary" size="mini">下载激励对象模版</el-button>
            <el-button type="primary" size="mini" @click="importPop = true">导入激励对象文件</el-button>
            <el-button type="primary" size="mini" plain>导出名单</el-button>
          </div>
        </div>
        <div class="push">
          <el-input size="mini" placeholder="姓名/身份证号" v-model="input5">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <div class="pushRight">
            <p>
              授予次数
              <el-select class="number" v-model="value7" placeholder="请选择" size="mini">
                <el-option label="次数自定义名称的筛选" value></el-option>
              </el-select>
            </p>
            <p>
              解禁期筛选
              <el-select class="choose" v-model="value7" placeholder="请选择" size="mini">
                <el-option label="第一个解禁期" value></el-option>
              </el-select>
            </p>
          </div>
        </div>
        <div class="push1">
          <div class="left">
            <span>股份状态</span>
            <div class="buttons">
              <el-button type="primary" size="mini">批量改为正常</el-button>
              <el-button type="primary" size="mini">批量改为待回购</el-button>
              <el-button type="primary" size="mini">批量改为回购注销</el-button>
            </div>
          </div>
          <div class="right">
            <span>考核结果</span>
            <div class="buttons">
              <el-button type="primary" size="mini">批量改为未考核</el-button>
              <el-button type="primary" size="mini">批量改为已达标</el-button>
              <el-button type="primary" size="mini">批量改为未达标</el-button>
            </div>
          </div>
        </div>
        <div class="detailInner1" v-if="this.code2 == false">
          <el-table :data="tableData" style="width: 100%" stripe @row-click="personalInfo">
            <el-table-column label="基本信息">
              <el-table-column prop label width="59">
                <template slot="header" slot-scope="scope">
                  <el-select size="mini" v-model="value6" placeholder>
                    <el-option label value="1">全选</el-option>
                    <el-option label value="2">全不选</el-option>
                    <el-option label value="3">正常股份状态</el-option>
                    <el-option label value="4">待回购股份状态</el-option>
                    <el-option label value="5">回购注销股份状态</el-option>
                    <el-option label value="6">个人考核未考核</el-option>
                    <el-option label value="7">个人考核未考核</el-option>
                    <el-option label value="8">个人考核未考核</el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <el-checkbox></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="62"></el-table-column>
              <el-table-column prop="identity" label="身份证号" width="139"></el-table-column>
            </el-table-column>
            <el-table-column>
              <el-table-column prop="total" label="获授总数(股)" sortable width="105"></el-table-column>
            </el-table-column>
            <el-table-column label="激励计划">
              <template slot="header" slot-scope="scope">
                <el-button @click.native.prevent="changeTable"></el-button>
              </template>
              <el-table-column prop label="股份状态" width="100">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核结果">
              <el-table-column prop="companyAssessment" label="公司考核" width="92">
                <template slot-scope="scope">
                  <span class="future">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width="158">
                <template slot-scope="scope">
                  <span class="no">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width="100">
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况">
              <el-table-column prop="tax1" label="应纳税所得额 (元)" width="97"></el-table-column>
              <el-table-column prop="tax2" label="应纳税额 (元)" width="113"></el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width="141"></el-table-column>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
            <el-radio-group v-model="radio5" size="small">
              <el-radio-button label="30条"></el-radio-button>
              <el-radio-button label="50条"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="detailInner2" v-if="this.code2 == true">
          <el-table :data="tableData" style="width: 100%" stripe @row-click="personalInfo">
            <el-table-column label="基本信息" width="259px">
              <el-table-column prop label width="59px">
                <template slot="header" slot-scope="scope">
                  <el-select size="mini" v-model="value6" placeholder>
                    <el-option label value="1">全选</el-option>
                    <el-option label value="2">全不选</el-option>
                    <el-option label value="3">正常股份状态</el-option>
                    <el-option label value="4">待回购股份状态</el-option>
                    <el-option label value="5">回购注销股份状态</el-option>
                    <el-option label value="6">个人考核未考核</el-option>
                    <el-option label value="7">个人考核未考核</el-option>
                    <el-option label value="8">个人考核未考核</el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  <el-checkbox></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="62px"></el-table-column>
              <el-table-column prop="identity" label="身份证号" width="139px"></el-table-column>
            </el-table-column>
            <el-table-column>
              <el-table-column prop="total" label="获授总数(股)" sortable width="105px"></el-table-column>
            </el-table-column>
            <el-table-column label="激励计划">
              <template slot="header" slot-scope="scope">
                <el-button @click.native.prevent="changeTable"></el-button>
              </template>
              <el-table-column prop="total" label="解除限售安排"></el-table-column>
              <el-table-column prop="total" label="授予股份数量 (股)"></el-table-column>
              <el-table-column prop="total" label="可解除限售数量 (股)"></el-table-column>
              <el-table-column prop="total" label="可解除限售日"></el-table-column>
              <el-table-column prop="total" label="实际解除限售日"></el-table-column>
              <el-table-column prop="total" label="实际解除数量 (股)"></el-table-column>
              <el-table-column prop="total" label="股份状态">
                <template slot-scope="scope">
                  <span class="norm">正常</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="授予价格 (元/股)"></el-table-column>
              <el-table-column prop="total" label="回购价格 (元/股)"></el-table-column>
            </el-table-column>
            <el-table-column label="考核结果" width="246px">
              <el-table-column prop="companyAssessment" label="公司考核">
                <template slot-scope="scope">
                  <span class="future">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="个人考核" width>
                <template slot-scope="scope">
                  <span class="no">未考核</span>
                </template>
              </el-table-column>
              <el-table-column label="解锁系数" width>
                <template slot-scope="scope">
                  <span class="level">0~1</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="纳税情况" width="235px">
              <el-table-column prop="tax1" label="应纳税所得额 (元)" width></el-table-column>
              <el-table-column prop="tax2" label="应纳税额 (元)" width></el-table-column>
              <el-table-column prop="tax3" label="最晚纳税日" width></el-table-column>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
            <el-radio-group v-model="radio5" size="small">
              <el-radio-button label="30条"></el-radio-button>
              <el-radio-button label="50条"></el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "complateNewPro",
  data() {
    return {
      importPop: false,
      successPop: false,
      targetAdvance: false,
      code: "数据概览",
      code1: "first",
      code2: false,
      input: "",
      value5: "切换计划",
      value6: "",
      radio3: "数据概览",
      radio4: 1,
      activeName: "first",
      input5: "",
      value7: "",
      tableData: [
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        },
        {
          name: "张三某某",
          identity: "281727399371782728",
          total: "9,999,999",
          companyAssessment: "已达标",
          tax1: "24.5",
          tax2: "24.5",
          tax3: "2019.03.21"
        }
      ],
      radio5: "30条"
    };
  },
  methods: {
    handleChange(value) {
      this.code = value;
    },
    handleClick(tab) {
      this.code1 = tab.name;
    },
    changeTable() {
      this.code2 = !this.code2;
    },
    planManage() {
      this.$router.push({ path: "/equityIncentive/planManagement" });
    },
    personalInfo(row) {
      this.$router.push({ path: "/equityIncentive/personalInformation" });
    }
  }
};
</script>

<style lang="scss">
#complateNewPro {
  padding: 16px 0 40px;
  .targetAdvance {
    .el-dialog {
      position: fixed;
      height: 100%;
      margin: 0 !important;
      z-index: 2501;
      right: 0;
      padding: 0 16px;
      .el-dialog__header {
        border-bottom: 1px solid rgba(227, 227, 227, 1);
        height: 50px;
        padding-top: 14px;
        span {
          width: 96px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
          line-height: 22px;
        }
      }
      .el-dialog__body {
        padding: 20px 0;
        .planInfo {
          height: 320px;
          border-bottom: 1px solid rgba(227, 227, 227, 1);
          .info1,
          .info2,
          .info3 {
            margin-bottom: 24px;
          }
          p {
            margin-bottom: 12px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
          }
          .key {
            display: inline-block;
            width: 156px;
            text-align: right;
          }
        }
        .progressBar {
          padding-top: 24px;
          padding-left: 50px;
          // .el-step {
          //   position: relative;
          //   .el-step__main {
          //     width: 388px;
          //     height: 72px;
          //     position: absolute;
          //     left: 17px;
          //     top: -12px;
          //     .el-step__title {

          //     }
          //   }
          // }
          .step {
            width: 388px;
            height: 72px;
            margin-bottom: 16px;
            background: rgba(0, 0, 0, 0.03);
            border-radius: 4px;
            padding: 12px;
            .date {
              margin-bottom: 8px;
            }
          }
          .step:nth-child(n + 4) {
            background: rgba(255, 240, 219, 1);
          }
        }
      }
    }
  }
  .main {
    .title {
      height: 46px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      margin-bottom: 16px;
      p {
        width: 98px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(50, 50, 50, 1);
        line-height: 20px;
      }
      .button {
        .el-select {
          width: 102px;
          margin-left: 16px;
          .el-input__inner {
            text-align: center !important;
            color: rgba(255, 255, 255, 1) !important;
            border-color: #f79617;
          }
          input {
            background: rgba(255, 177, 72, 1);
          }
          input::-webkit-input-placeholder {
            color: #fff;
          }
          span {
            .el-icon-arrow-up:before {
              color: #fff;
            }
          }
          li:last-child {
            width: 123px;
          }
        }
      }
    }
    .plain {
      margin-bottom: 16px;
      border-radius: 4px;
      padding: 0 16px;
      background: rgba(255, 255, 255, 1);
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        .first {
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
            margin-right: 5px;
          }
          .el-select {
            width: 68px;
            height: 24px;
            .el-input__inner {
              height: 24px;
              line-height: 24px;
              padding-right: 24px !important;
              padding-left: 7px !important;
              background: rgba(255, 240, 219, 1);
              border-radius: 4px;
              border: 1px solid rgba(255, 177, 72, 1);
              color: rgba(255, 177, 72, 1) !important;
            }
            .el-input__suffix {
              right: -9px;
              span {
                .el-icon-arrow-up:before {
                  color: rgba(255, 177, 72, 1);
                }
              }
            }
          }
        }
        .el-radio-group {
          .is-active {
            .el-radio-button__inner {
              background: #ffb148;
              border-color: #ffb148;
            }
          }
        }
      }
      .el-tabs {
        .el-tabs__nav-wrap::after {
          width: 151px;
        }
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__item:nth-child(2) {
          padding: 0;
        }
      }
      .data {
        padding: 36px 0;
        display: flex;
        justify-content: space-between;
        .block {
          p:first-child {
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            line-height: 25px;
            margin-bottom: 16px;
          }
          p:last-child {
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(141, 141, 141, 1);
            line-height: 17px;
          }
        }
        .block:nth-child(4) {
          padding: 0 40px;
          border-left: 1px solid rgba(174, 174, 174, 1);
          border-right: 1px solid rgba(174, 174, 174, 1);
        }
      }
      .charts {
        height: 224px;
      }
    }
    .limit {
      background: rgba(255, 255, 255, 1);
      padding: 0 16px 36px;
      .stock {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        height: 46px;
        margin-bottom: 17px;
        p {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 20px;
        }
        .button {
          .el-button {
            margin-left: 16px;
          }
        }
        .importPop,
        .successPop {
          .el-dialog {
            height: 307px;
            .el-dialog__header {
              border-bottom: 1px solid rgba(227, 227, 227, 1);
              height: 50px;
              padding-top: 14px;
              span {
                width: 96px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 177, 72, 1);
                line-height: 22px;
              }
            }
            .el-dialog__body {
              width: 508px;
              height: 187px;
              margin-left: 70px;
              padding: 0;
              padding-top: 20px;
              padding-bottom: 24px;
              .popTop {
                height: 72px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e3e3e3;
                p {
                  height: 22px;
                  font-size: 16px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(50, 50, 50, 1);
                  line-height: 22px;
                }
                .el-button {
                  padding: 0;
                  span {
                    height: 22px;
                    font-size: 16px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(255, 177, 72, 1);
                    line-height: 22px;
                  }
                }
              }
              .popBottom {
                height: 94px;
                padding-top: 20px;
                padding-bottom: 14px;
                .el-radio-group {
                  .el-radio__label {
                    color: #aeaeae;
                  }
                  .is-checked {
                    span {
                      color: #545454;
                    }
                  }
                }
                .add {
                  i {
                    margin-right: 5px;
                  }
                  font-size: 14px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(141, 141, 141, 1);
                  margin-top: 16px;
                  .el-button {
                      color: #8D8D8D;
                  }
                }
              }
            }
            .el-dialog__footer {
              padding-bottom: 24px;
            }
            .dialog-footer {
              margin-bottom: 8px;
              span {
                width: 96px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 177, 72, 1);
                line-height: 22px;
              }
              .noButton {
                width: 110px;
                height: 35px;
                background: rgba(255, 240, 219, 1);
                border-radius: 4px;
                border: 1px solid rgba(255, 177, 72, 1);
                padding: 7px 33px 6px;
                span {
                  width: 44px;
                  height: 22px;
                  font-size: 16px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(255, 177, 72, 1);
                  line-height: 22px;
                }
              }
            }
            .yesButton {
              width: 110px;
              height: 35px;
              background: rgba(255, 177, 72, 1);
              border-radius: 4px;
              padding: 7px 33px 6px;
              span {
                width: 44px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 22px;
              }
            }
          }
        }
        .successPop {
          position: relative;
          .center {
            height: 164px;
            img {
              position: absolute;
              left: 276px;
              top: 79px;
              display: block;
              width: 69px;
              height: 68px;
            }
            p {
              position: absolute;
              left: 157px;
              top: 171px;
              width: 308px;
              height: 20px;
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(141, 141, 141, 1);
              line-height: 20px;
            }
          }
          .dialog-footer {
            .el-button {
              width: 144px;
              height: 35px;
              background: rgba(255, 177, 72, 1);
              border-radius: 4px;
              padding-top: 7px;
              padding-bottom: 6px;
              span {
                width: 32px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 14px;
              }
            }
          }
        }
      }
      .el-input {
        width: 348px;
        height: 28px;
        .el-input__inner {
          border-radius: 4px;
          border: 1px solid rgba(255, 224, 182, 1);
        }
        .el-input-group__append {
          color: #fff;
          background: rgba(255, 177, 72, 1);
        }
      }
      .push {
        display: flex;
        justify-content: space-between;
        .pushRight {
          display: flex;
          justify-content: space-between;
          width: 475px;
          .el-input__inner {
            border: 1px solid rgba(227, 227, 227, 1);
          }
        }
        p {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 17px;
          .el-select {
            margin-left: 5px;
          }
          .number {
            .el-input {
              width: 183px;
              .el-input__inner {
                padding: 0;
              }
            }
          }
          .choose {
            .el-input {
              width: 110px;
              .el-input__inner {
                padding: 0;
              }
            }
          }
        }
      }
      .push1 {
        height: 56px;
        .left,
        .right {
          width: 428px;
          height: 56px;
          float: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
          }
          .buttons {
            .el-button {
              padding: 3px 12px 4px;
              height: 24px;
              background: rgba(255, 177, 72, 1);
              border-radius: 4px;
              span {
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 17px;
              }
            }
          }
        }
        .left {
          margin-right: 39px;
        }
      }
      .detailInner1 {
        .el-table--border::after,
        .el-table--group::after {
          width: 0;
        }
        .el-table::before {
          height: 0;
        }
        .el-table {
          border: none;
          margin-bottom: 28px;
          .cell {
            padding: 0;
          }
          th {
            height: 30px;
            padding: 0;
            border: none;
          }
          thead {
            tr:first-child {
              th {
                font-size: 14px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(50, 50, 50, 1);
                text-align: center;
                border-right: 1px solid #ffffff;
              }
              th:nth-child(3) {
                .cell {
                  height: 30px;
                  position: relative;
                  .el-button {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0;
                    border: 0;
                    width: 9px;
                    height: 10px;
                    background-color: red;
                  }
                }
                .cell::before {
                  display: inline-block;
                  text-align: center;
                  content: "激励计划";
                  width: 56px;
                  height: 20px;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(50, 50, 50, 1);
                  line-height: 20px;
                }
              }
            }
            tr:last-child {
              th {
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(84, 84, 84, 1);
              }
              th:nth-child(2),
              th:nth-child(3) {
                border-right: 1px solid #ffffff;
              }
              th:nth-child(4) {
                padding-left: 12px;
              }
              th:nth-child(5) {
                text-align: center;
              }
            }
            tr:nth-child(2) {
              th {
                .cell {
                  padding-bottom: 10px;
                }
              }
              th:first-child {
                .cell {
                  padding-left: 8px;
                  padding-right: 13px;
                  padding-top: 6px;
                  .el-select {
                    padding: 0;
                    .el-input {
                      padding: 0;
                      width: 38px;
                      height: 20px;
                      line-height: 20px !important;
                      .el-input__inner {
                        padding: 0 !important;
                        width: 38px;
                        height: 20px;
                        border: 1px solid rgba(227, 227, 227, 1);
                      }
                      .el-input__suffix {
                        right: -1px;
                        top: 2px;
                      }
                    }
                  }
                }
              }
              th:nth-child(n + 6) {
                .cell {
                  text-align: center;
                }
              }
              th:nth-child(9) {
                .cell {
                  padding-left: 24px;
                  padding-top: 17px;
                  line-height: 17px;
                  text-align: right;
                }
              }
              th:nth-child(10) {
                .cell {
                  padding-left: 64px;
                  padding-top: 17px;
                  line-height: 17px;
                  text-align: right;
                }
              }
              th:nth-child(11) {
                .cell {
                  padding-left: 64px;
                  padding-right: 16px;
                  text-align: right;
                }
              }
            }
          }
          tbody {
            tr {
              td:first-child {
                .cell {
                  padding-left: 22px;
                }
              }
            }
          }
          td {
            border: none;
            height: 40px;
            padding: 0;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
          }
          td:nth-child(2),
          td:nth-child(3) {
            border-right: 1px solid #ffffff;
          }
          td:nth-child(4) {
            padding-left: 24px;
            .cell {
              width: 57px;
            }
          }
          td:nth-child(5) {
            .cell {
              text-align: center;
            }
            .norm {
              display: inline-block;
              width: 62px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: rgba(255, 240, 219, 1);
              border-radius: 4px;
              border: 1px solid rgba(255, 177, 72, 1);
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(255, 177, 72, 1);
            }
          }
          td:nth-child(6),
          td:nth-child(7),
          td:nth-child(8) {
            .cell {
              text-align: center;
              span {
                display: inline-block;
                text-align: center;
                width: 48px;
                height: 20px;
                line-height: 20px;
                background: rgba(255, 240, 219, 1);
                border-radius: 4px;
                border: 1px solid rgba(255, 177, 72, 1);
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 177, 72, 1);
              }
            }
          }
          td:nth-child(8) {
            .cell {
              span {
                border: 1px solid rgba(174, 174, 174, 1);
                background: rgba(227, 227, 227, 1);
                color: rgba(84, 84, 84, 1);
              }
            }
          }
          td:nth-child(9) {
            .level {
              display: inline-block;
              width: 48px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: rgba(227, 227, 227, 1);
              border-radius: 4px;
              border: 1px solid rgba(174, 174, 174, 1);
            }
          }
          td:nth-child(n + 9) {
            .cell {
              text-align: right;
            }
          }
          td:last-child {
            .cell {
              padding-right: 16px;
            }
          }
        }
        .page {
          display: flex;
          justify-content: space-around;
        }
      }
      .detailInner2 {
        .el-table--border::after,
        .el-table--group::after {
          width: 0;
        }
        .el-table::before {
          height: 0;
        }
        .el-table {
          border: none;
          margin-bottom: 28px;
          .cell {
            padding: 0;
          }
          th {
            height: 30px;
            padding: 0;
            border: none;
          }
          thead {
            tr:first-child {
              th {
                font-size: 14px;
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                color: rgba(50, 50, 50, 1);
                text-align: center;
                border-right: 1px solid #ffffff;
              }
              th:nth-child(3) {
                .cell {
                  height: 30px;
                  position: relative;
                  .el-button {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0;
                    border: 0;
                    width: 9px;
                    height: 10px;
                    background-color: red;
                  }
                }
                .cell::before {
                  display: inline-block;
                  text-align: center;
                  content: "激励计划";
                  width: 56px;
                  height: 20px;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(50, 50, 50, 1);
                  line-height: 20px;
                }
              }
            }
            tr:last-child {
              th {
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(84, 84, 84, 1);
              }
              th:nth-child(2),
              th:nth-child(3) {
                border-right: 1px solid #ffffff;
              }
            }
            tr:nth-child(2) {
              th {
                .cell {
                  padding-bottom: 10px;
                }
              }
              th:first-child {
                .cell {
                  padding-left: 8px;
                  padding-right: 13px;
                  padding-top: 6px;
                  .el-select {
                    padding: 0;
                    .el-input {
                      padding: 0;
                      width: 38px;
                      height: 20px;
                      line-height: 20px !important;
                      .el-input__inner {
                        padding: 0 !important;
                        width: 38px;
                        height: 20px;
                        border: 1px solid rgba(227, 227, 227, 1);
                      }
                      .el-input__suffix {
                        right: -1px;
                        top: 2px;
                      }
                    }
                  }
                }
              }
              th:nth-child(n + 14) {
                .cell {
                  text-align: center;
                }
              }
              th:nth-child(17) {
                .cell {
                  padding-left: 24px;
                  padding-top: 17px;
                  line-height: 17px;
                  text-align: right;
                }
              }
              th:nth-child(18) {
                .cell {
                  padding-left: 64px;
                  padding-top: 17px;
                  line-height: 17px;
                  text-align: right;
                }
              }
              th:nth-child(19) {
                .cell {
                  padding-left: 64px;
                  padding-right: 16px;
                  text-align: right;
                }
              }
            }
          }
          tbody {
            tr {
              td:first-child {
                width: 60px !important;
                .cell {
                  padding-left: 22px;
                  width: 60px !important;
                }
              }
            }
          }
          td {
            border: none;
            height: 40px;
            padding: 0;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
          }
          td:nth-child(2),
          td:nth-child(3) {
            border-right: 1px solid #ffffff;
          }
          td:nth-child(4) {
            padding-left: 24px;
            .cell {
              width: 57px;
            }
          }
          td:nth-child(5) {
            .cell {
              text-align: center;
            }
            .norm {
              display: inline-block;
              width: 62px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: rgba(255, 240, 219, 1);
              border-radius: 4px;
              border: 1px solid rgba(255, 177, 72, 1);
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(255, 177, 72, 1);
            }
          }
          td:nth-child(6),
          td:nth-child(7),
          td:nth-child(8) {
            .cell {
              text-align: center;
              span {
                display: inline-block;
                text-align: center;
                width: 48px;
                height: 20px;
                line-height: 20px;
                background: rgba(255, 240, 219, 1);
                border-radius: 4px;
                border: 1px solid rgba(255, 177, 72, 1);
                font-size: 12px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 177, 72, 1);
              }
            }
          }
          td:nth-child(8) {
            .cell {
              span {
                border: 1px solid rgba(174, 174, 174, 1);
                background: rgba(227, 227, 227, 1);
                color: rgba(84, 84, 84, 1);
              }
            }
          }
          td:nth-child(9) {
            .level {
              display: inline-block;
              width: 48px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: rgba(227, 227, 227, 1);
              border-radius: 4px;
              border: 1px solid rgba(174, 174, 174, 1);
            }
          }
          td:nth-child(n + 9) {
            .cell {
              text-align: right;
            }
          }
          td:last-child {
            .cell {
              padding-right: 16px;
            }
          }
        }
        .page {
          display: flex;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>
