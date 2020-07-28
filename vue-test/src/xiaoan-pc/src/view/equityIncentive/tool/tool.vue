<template>
  <div id="tool">
    <div class="content">
      <el-tabs class="elTabs" v-model="activeName">
        <el-tab-pane label="调查问卷" name="first" v-if="this.step == 'origin'" class="origin">
          <div class="questions">
            <div class="header">
              <el-button type="primary" class="newQuestion el-icon-plus" @click="newQuestion">新建调查问券</el-button>
            </div>
            <div class="items">
              <div class="item">
                <span class="name">问券名称限定字数</span>
                <span class="statu">答卷中</span>
                <span class="number">答券人数：<span class="orange">67</span></span>
                <span class="date">最后编辑时间：2019.02.28 12:32:03</span>
                <el-button type="text" class="copy">复制</el-button>
                <el-button type="text" class="edit" @click="toEdit">编辑</el-button>
                <el-button type="text" class="delate">删除</el-button>
              </div>
              <div class="item">
                <span class="name">问券名称限定字数的副本</span>
                <span class="statu red">草稿</span>
                <span class="number">答券人数：<span class="orange">0</span></span>
                <span class="date">最后编辑时间：2019.02.28 12:32:03</span>
                <el-button type="text" class="copy">复制</el-button>
                <el-button type="text" class="edit" @click="toEdit">编辑</el-button>
                <el-button type="text" class="delate">删除</el-button>
              </div>
              <div class="item">
                <span class="name">问券名称限定字数</span>
                <span class="statu gray">已完成</span>
                <span class="number">答券人数：<span class="orange">347</span></span>
                <span class="date">最后编辑时间：2019.02.28 12:32:03</span>
                <el-button type="text" class="statistics" @click="toStatistics">问卷统计结果</el-button>
                <el-button type="text" class="copy">复制</el-button>
                <el-button type="text" class="edit" @click="toEdit">编辑</el-button>
                <el-button type="text" class="delate">删除</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调查问卷" name="first" v-if="this.step == 'step1'" class="step1">
          <div class="question">
            <el-steps :active="active" align-center>
              <el-step title="编辑问卷"></el-step>
              <el-step title="发送到统筹方邮箱"></el-step>
              <el-step title="查看问券调查分析"></el-step>
            </el-steps>
            <div class="answer">
              <p class="name">
                <span>问券名称</span>
                <el-input size="small" type="primary" placeholder="请输入方案名称，不超过20个字"></el-input><el-button type="primary" class="reset">回到初始模版</el-button>
                <el-button type="primary" class="preview" @click="preview">预览</el-button>
              </p>
              <div class="subject">
                <p class="quesTitle">
                  <span class="el-icon-remove-outline leftIcon"></span><span class="textPart">1、以下哪些功能是你经常用到的？</span>
                  <el-select size="mini" v-model="value8" placeholder="单选题">
                    <el-option label="单选题" value="1"></el-option>
                    <el-option label="多选题" value="2"></el-option>
                  </el-select>
                </p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新选项</el-button></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新在此题后插入新题选项</el-button></p>
              </div>
              <div class="subject">
                <p class="quesTitle">
                  <span class="el-icon-remove-outline leftIcon"></span><span class="textPart">1、以下哪些功能是你经常用到的？</span>
                  <el-select size="mini" v-model="value8" placeholder="单选题">
                    <el-option label="单选题" value="1"></el-option>
                    <el-option label="多选题" value="2"></el-option>
                  </el-select>
                </p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新选项</el-button></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新在此题后插入新题选项</el-button></p>
              </div>
              <div class="subject">
                <p class="quesTitle">
                  <span class="el-icon-remove-outline leftIcon"></span><span class="textPart">1、以下哪些功能是你经常用到的？</span>
                  <el-select size="mini" v-model="value8" placeholder="单选题">
                    <el-option label="单选题" value="1"></el-option>
                    <el-option label="多选题" value="2"></el-option>
                  </el-select>
                </p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="quesOption"><span class="el-icon-remove-outline leftIcon"></span><span class="textPart">权限速查表</span></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新选项</el-button></p>
                <p class="operation"><el-button type="text" icon="el-icon-circle-plus-outline">增加新在此题后插入新题选项</el-button></p>
              </div>
              <div class="subject">
                <p class="quesTitle">
                  <span class="el-icon-remove-outline leftIcon"></span><span class="textPart1">9、写下您认为重要的意见或建议？</span>
                </p>
                <el-input type="textarea" placeholder="在此键入文字 …" v-model="textarea" resize="none"></el-input>
              </div>
            </div>
            <p class="button">
              <el-button size="small" type="primary" plain @click="backToOrigin">取消</el-button>
              <el-button size="small" type="primary" class="nextStep" plain @click="firstNext">下一步</el-button>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调查问卷" name="first" v-if="this.step == 'step2'" class="step2">
          <div class="question">
            <el-steps :active="active" align-center>
              <el-step title="编辑问卷"></el-step>
              <el-step title="设定答卷时间"></el-step>
              <el-step title="发送到统筹方"></el-step>
            </el-steps>
            <div class="date">
              <span>截止日期</span> 
              <el-date-picker
                v-model="value9"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <p class="button">
              <el-button size="small" type="primary" plain @click="secondLast">上一步</el-button>
              <el-button size="small" type="primary" class="nextStep" plain @click="secondNext">下一步</el-button>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调查问卷" name="first" v-if="this.step == 'step3'" class="step3">
          <div class="question">
            <el-steps :active="active" align-center>
              <el-step title="编辑问卷"></el-step>
              <el-step title="设定答卷时间"></el-step>
              <el-step title="发送到统筹方"></el-step>
            </el-steps>
            <div class="emails">
              <template>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="1" class="self">本人邮箱 huanhuan.song@infaith.com.cn</el-checkbox>
                  <el-checkbox label="2">统筹方名称 huanhuan.song@infaith.com.cn</el-checkbox>
                  <el-checkbox label="3">统筹方名称 huanhuan.song@infaith.com.cn</el-checkbox>
                  <el-checkbox label="4">统筹方名称 huanhuan.song@infaith.com.cn</el-checkbox>
                  <el-checkbox label="5">统筹方名称 huanhuan.song@infaith.com.cn</el-checkbox>
                  <el-checkbox label="6">统筹方名称 huanhuan.song@infaith.com.cn</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
            <p class="button">
              <el-button size="small" type="primary" plain @click="thirdLast">上一步</el-button>
              <el-button size="small" type="primary" class="nextStep" plain @click="thirdNext">一键发送</el-button>
            </p>
            <p class="bottomTip">调查问券的分发需要您通过邮箱文件操作</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调查问卷" name="first" v-if="this.step == 'step4'" class="step4">
          <div class="question">
            <el-steps :active="active" align-center>
              <el-step title="编辑问卷"></el-step>
              <el-step title="设定答卷时间"></el-step>
              <el-step title="发送到统筹方"></el-step>
            </el-steps>
            <span class="el-icon-circle-check-outline successIcon"></span>
            <p class="successP">发送成功</p>
            <p class="button">
              <el-button size="small" type="primary" class="nextStep" plain @click="backToOrigin">返回</el-button>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="信披清单" name="second">
          <el-row :gutter="12">
            <el-col :span="6">
              <div class="list">
                <el-button type="primary" size="mini" plain icon="el-icon-edit-outline">创建事项</el-button>
                <el-collapse class="collapse-head-select" accordion v-model="activeNames" @change="handleChange">
                  <el-collapse-item name="1">
                    <div class="title text-black1" slot="title">信披事例</div>
                    <div class="collapse-select-list">
                      <ul>
                        <li><p>限制性股票</p></li>
                        <li><p>股票期权</p></li>
                      </ul>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="2">
                    <div class="title text-black1" slot="title">进行中的事项</div>
                    <div class="collapse-select-list">
                      <ul>
                        <li><p>第一期名称</p></li>
                        <li><p>第二期名称</p></li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="listInner">
                <el-tabs class="right-content-tabs" v-model="activeTable" v-if="this.code == 1">
                  <el-tab-pane label="流程要点" name="first">
                    <el-table size="medium" :data="tableData" class="box-table-proceed" style="width: 100%">
                      <el-table-column label="序号" align="left" width="60" type="index"></el-table-column>
                      <el-table-column prop="flowPoint" width="240" label="节点名称">
                        <template slot-scope="scope">
                          <div class="scope-point">{{scope.row.flowPoint}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="compliancePoint" label="合规要点">
                        <template slot-scope="scope">
                          <div class="scope-point">{{scope.row.compliancePoint}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="address" label="相关规则">
                        <template slot-scope="scope">
                          <ul class="relationList" v-if="scope.row.show">
                            <li>
                              <span class="lawName">{{scope.row.address}}</span>
                            </li>
                            <span class="floatDown" @click="scope.row.show = !scope.row.show">
                              收起<i class="el-icon-arrow-up"></i>
                            </span>
                          </ul>
                          <ul class="relationList" v-else>
                            <li>
                              <span class="lawName">
                                awweqwewqwqeqqwewqewqewqeeqweqwewq
                              </span>
                              <span class="floatDown" @click="scope.row.show = !scope.row.show">
                                展开<i class="el-icon-arrow-down"></i>
                              </span>
                            </li>
                          </ul>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="审议程序" name="second"></el-tab-pane>
                </el-tabs>
                <div class="item" v-if="this.code == 2">
                  <div class="title">
                    <p>第一期名称<span>创建者:信公小安</span><span>创建日期:2019.02.01</span><span>更新日期:2019.02.01</span></p>
                    <el-button type="text" class="el-icon-printer"> 打印清单</el-button>
                    <el-button type="text" class="el-icon-delete"> 删除</el-button>
                  </div>
                  <el-table size="medium" :data="tableData1" class="box-table-proceed" style="width: 100%">
                    <el-table-column label="序号" align="left" width="60" type="index"></el-table-column>
                    <el-table-column prop="" width="200" label="起始时间">
                    </el-table-column>
                    <el-table-column prop="flowPoint" width="240" label="节点名称">
                      <template slot-scope="scope">
                        <div class="scope-point">{{scope.row.flowPoint}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="compliancePoint" label="编辑记录">
                      <template slot-scope="scope">
                        <p>里编辑于</p>
                        <p>2019.02.01 17:00:00</p>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address"  width="120" label="操作">
                      <template slot-scope="scope">
                        <span class="el-icon-edit-outline blue"></span>
                        <span class="el-icon-menu blue"></span>
                        <span class="el-icon-date blue"></span>
                        <span class="el-icon-delete orange"></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="日历提醒设置" name="third">
          <el-row :gutter="12">
            <el-col :span="6">
              <div class="calendar">
                <el-button type="primary" size="mini" plain icon="el-icon-edit-outline" @click="newReminder">新建日历提醒</el-button>
                  <el-button v-for="button in buttons" :key='button.id' size="medium " class="reminder" icon="el-icon-arrow-right" @click="showReminder(button.id)">{{button.name}}</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="calendarInner" v-if="this.reminder == 'new'">
                <p class="title">新建日历提醒</p>
                <div class="newCan">
                 <div class="left">
                    <p class="header">日历提醒详情</p>
                    <div class="body">
                      <p>
                        <span class="name">选择日历提醒名称</span>
                        <el-select v-model="value" placeholder="请选择日历名称">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </p>
                      <p>
                        <span class="name">添加到日历分类</span>
                        <el-select v-model="value" placeholder="我的日历">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </p>
                      <p>
                        <span class="name">开始缴款日期-截止日期</span>
                        <el-date-picker v-model="value" type="daterange" range-separator="至" start-placeholder="2019-03-31" end-placeholder="截止日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">股份到账通知</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">期权到账通知</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">限制性股票锁定期满</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">限制性股票解除限售</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">草案公告后名单公示期满</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">窗口期提示</span>
                        <el-date-picker v-model="value" type="daterange" range-separator="至" start-placeholder="2019-03-31" end-placeholder="截止日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">股东大会通过60天期满</span>
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
                      </p>
                      <p>
                        <span class="name">通知方式</span>
                        <el-checkbox-group v-model="checkList1">
                          <el-checkbox label="站内信"></el-checkbox>
                          <el-checkbox label="微信"></el-checkbox>
                          <el-checkbox label="邮件"></el-checkbox>
                        </el-checkbox-group>
                      </p>
                    </div>
                 </div>
                 <div class="right">
                   <p class="header">通知对象</p>
                   <el-table ref="multipleTable" stripe :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                      <el-table-column type="selection" width="38px"></el-table-column>
                      <el-table-column prop="name" label="账户名" width="112"></el-table-column>
                      <el-table-column prop="email" label="邮箱" width="221"></el-table-column>
                      <el-table-column prop="" label="操作" width="44">
                         <template slot-scope="scope">
                            <el-button type="text" size="small">编辑</el-button>
                         </template>
                      </el-table-column>
                    </el-table>
                 </div>
                </div>
                <p class="button"><el-button type="primary" size="small">取消</el-button><el-button type="primary" size="small">确定</el-button></p>
              </div>
              <div class="calendarInner1" v-if="this.reminder == 1">
                <p class="title">第二期提醒<el-button type="primary" size="small">编辑</el-button><el-button type="primary" size="small">删除</el-button></p>
                <div class="newCan">
                 <div class="left">
                    <p class="header">日历提醒详情</p>
                    <p class="data"><span>日历提醒名称：</span><span>第二期提醒</span></p>
                    <p class="data"><span>日历：</span><span>我的日历</span></p>
                    <p class="data"><span>创建时间：</span><span>2019.2.28 16:24</span></p>
                    <p class="data"><span>提醒：</span><span>站内信/微信/邮箱</span></p>
                 </div>
                 <div class="right">
                    <el-tabs class="right-content-tabs" v-model="activeTable">
                    <el-tab-pane label="日历提醒节点" name="first">
                      <div class="step">
                        <p class="date">2019年2月28日-2019年3月28日</p>
                        <p>开始缴款日期-截止日期</p>
                      </div>
                      <div class="step">
                        <p class="date">2019年3月18日</p>
                        <p>股份到账通知</p>
                      </div>
                      <div class="step">
                        <p class="date">2019年3月18日</p>
                        <p>期权到账通知</p>
                      </div>
                      <div class="step">
                        <p class="date">2019年3月18日</p>
                        <p>限制性股票锁定期满</p>
                      </div>
                      <div class="step">
                        <p class="date">2019年3月18日</p>
                        <p>限制性股票锁定期满</p>
                      </div>
                      <div class="step">
                        <p class="date">2019年3月18日</p>
                        <p>限制性股票锁定期满</p>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="通知对象" name="second"></el-tab-pane>
                    </el-tabs>
                 </div>
                </div>
               </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tool",
    data() {
      return {
        code: 1,
        step: 'origin',
        reminder: 1,
        activeName: 'first',
        activeNames: [],
        buttons: [
          {id: 1, name: '第一期提醒'},
          {id: 2, name: '第二期提醒'}
          ],
        checkList: ['2'],
        checkList1: ['站内信'],
        activeTable: 'first',
        tableData: [
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaaaaaa', compliancePoint: '12月31日前', address: '限制性股票限制性股票限制性股票aaaaaaaaaaaaaaaaaaddressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaa', compliancePoint: '12月31日前限制性股票限制性股票限制性股票aaaaaaaaaaaaa限制性股票限制性股票限制性股票aaaaaaaaaaaaa', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          }
        ],
        tableData1: [
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaaaaaa', compliancePoint: '12月31日前', address: '限制性股票限制性股票限制性股票aaaaaaaaaaaaaaaaaaddressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaa', compliancePoint: '12月31日前限制性股票限制性股票限制性股票aaaaaaaaaaaaa限制性股票限制性股票限制性股票aaaaaaaaaaaaa', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaa', compliancePoint: '12月31日前限制性股票限制性股票限制性股票aaaaaaaaaaaaa限制性股票限制性股票限制性股票aaaaaaaaaaaaa', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票aaaaaaaaaaaaa', compliancePoint: '12月31日前限制性股票限制性股票限制性股票aaaaaaaaaaaaa限制性股票限制性股票限制性股票aaaaaaaaaaaaa', address: 'addressaddressaddressaddressaddress'
          },
          {
            flowPoint: '限制性股票限制性股票限制性股票', compliancePoint: '12月31日前', address: 'addressaddressaddressaddressaddress'
          }
        ],
        tableData3: [
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'},
          {name: '统筹方账户名', email: 'name@example.com'}
        ],
        input: '',
        value: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: '单选题',
        value9: '',
        active: 1,
        checked: [],
        radio: '',
        textarea: ''
      }
    },
    created() {
      this.tableData.forEach((item) => {
        this.$set(item, 'show', false)
      })
    },
    methods: {
      handleChange(val) {
        this.code = val
      },
      showReminder(val) {
        this.reminder = val
      },
      newReminder() {
        this.reminder = 'new'
      },
      preview() {
        this.$router.push({path: "/equityIncentive/preview"})
      },
      newQuestion() {
        this.step = 'step1'
      },
      firstNext() {
        this.step = 'step2'
      },
      secondLast() {
        this.step = 'step1'
      },
      secondNext() {
        this.step = 'step3'
      },
      thirdLast() {
        this.step = 'step2'
      },
      thirdNext() {
        this.step = 'step4'
      },
      backToOrigin() {
        this.step = 'origin'
      },
      toEdit() {
        this.$router.push({path: "/equityIncentive/editQuestion"})
      },
      toStatistics() {
        this.$router.push({path: "/equityIncentive/statistics"})
      }
    }
  }
</script>

<style lang="scss">
  #tool {
    padding: 16px 0;
    .elTabs {
      .el-tabs__header {
        background: #ffffff;
        margin-bottom: 16px;
        padding: 0 16px;
      }
      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }
    .list, .calendar {
      padding: 9px 16px 0;
      width:292px;
      height:580px;
      border-radius:4px;
      background: #ffffff;
      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
    .list {
      .collapse-head-select {
        .el-collapse-item {
          .el-collapse-item__wrap {
            border-bottom-color: #f0f1f5;
          }
          .el-collapse-item__header {
            padding: 0 10px;
            * {
              transition: all .3s;
            }
            &.is-active {
              * {
                transition: all .3s;
              }
            }
            .el-collapse-item__arrow {
              margin-right: 0;
            }
            .title {
              font-size: 15px;
              color: #323232;
            }
          }
        }
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        .collapse-select-list {
          ul {
            li {
              padding: 0 10px;
              height: 40px;
              line-height: 40px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
              border-top: 1px solid rgba(0,0,0,0.08);
              p {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
                text-indent: 1em;
              }
              &.active {
                background:rgba(0,0,0,0.03);
                color:rgba(50,50,50,1);
              }
              &:hover {
                background:rgba(0,0,0,0.03);
                color:rgba(50,50,50,1);
              }
            }
          }
        }
      }
    }
    .calendar {
      .reminder {
        position: relative;
        height: 45px;
        margin: 0;
        padding: 0;
        text-align: left;
        background-color: #fff;
        border: none;
        border-bottom: 1px solid #e3e3e3;
        span {
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
        }
        .el-icon-arrow-right {
          position: absolute;
          right: 0;
        }
        .el-icon-arrow-right:before {
          color:rgba(50,50,50,1);
        }
      }
      .reminder:nth-child(2) {
        border-top: 1px solid #e3e3e3;
      }
    }
    .listInner {
      width:896px;
      padding: 0 16px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      .right-content-tabs {
        .el-tabs__header {
          padding: 0;
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
          background-color: rgba(0,0,0,0.08);
        }
        .el-tabs__item {
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          &.is-active {
            color:rgba(255,177,72,1);
          }
        }
        .box-table-proceed {
          border-top: 1px solid #e3e3e3;
          th {
            background: rgba(0,0,0,0.03);
          }
          .scope-point {
            line-height: 1.5;
            text-align: justify;
          }
          .relationList {
            li {
              cursor: pointer;
              text-align: justify;
              line-height: 1.5;
              padding-top: 10px;
              &:first-child {
                padding: 0;
              }
              .lawName {
                &:hover {
                  color: #ffb148;
                  text-decoration: underline;
                }
              }
            }
            .floatDown {
              cursor: pointer;
              float: right;
              color: #ffb148;
              i {
                color: #ffb148;
              }
            }
          }
          .table-operate-box {
            width: 100%;
            text-align: right;
            .table-operate-icon {
              height: 24px;
              width: 24px;
              margin-left: 10px;
              display: inline-block;
              text-align: center;
              background-color: rgba(120, 139, 251, 0.1);
              cursor: pointer;
              &.color {
                background-color: rgba(255, 177, 72, 0.1);
                i {
                  color: #ffb148;
                }
              }
              i {
                color: #788bfb;
              }
            }
          }
        }
      }
      .item {
        height: 580px;
        background-color: #fff;
        .title {
          height: 37px;
          border-bottom: 1px solid #D8D8D8;
          p {
            display: inline-block;
            width: 733px;
            padding-top: 10px;
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
            span {
              margin-top: 2px;
              margin-left: 12px;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
            span:nth-child(1) {
              margin-left: 16px;
            }
          }
          .el-button {
            padding: 0;
            border: none;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(84,84,84,1);
          }
        }
        .el-table {
          margin-top: 12px;
          thead {
            tr {
              th {
                background-color: #F6F6F6;
              }
              th:nth-child(4) {
                .cell {
                  padding-left: 36px;
                }
              }
              th:nth-child(5) {
                .cell {
                  padding-left: 46px;
                }
              }
            }
          }
          tbody {
            tr {
              td:nth-child(4) {
                .cell {
                  p:nth-child(1) {
                    padding-left: 36px;
                  }
                }
              }
              td:nth-child(5) {
                .cell {
                  display: flex;
                  justify-content: space-between;
                   .blue {
                    color: blue;
                  }
                   .orange {
                     color: #FFB148;
                   }
                }
              }
            }
          }
        }
      }
    }
    .calendarInner {
      width:896px;
      padding: 0 16px 36px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      .title {
        height:45px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(50,50,50,1);
        line-height:45px;
        border-bottom: 1px solid rgba(0,0,0,0.08);
      }
      .newCan {
        height: 600px;
        padding-top: 21px;
        .left {
          float: left;
          width: 432px;
          padding-right: 18px;
          border-right: 1px solid rgba(0,0,0,0.08);
          .header {
            height: 31px;
            padding-bottom: 12px;
            margin-bottom: 0;
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(84,84,84,1);
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }
          .body {
            padding-top: 15px;
            p {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              span {
                color:rgba(141,141,141,1);
              }
              .name {
                width: 154px;
                text-align: right;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:20px;
                margin-right: 12px;
              }
            }
            p:nth-child(1) {
              .el-input__inner {
                width: 248px;
                height: 32px;
                text-align: left!important;
                padding-left: 8px!important;
              }
            }
            p:nth-child(2) {
              .el-input__inner {
                width: 208px;
                height: 32px;
                text-align: left!important;
                padding-left: 8px!important;
              }
            }
            p:nth-child(3) {
              .el-input__inner {
                width: 248px;
                height: 32px;
                text-align: left!important;
                padding-left: 8px!important;
                .el-range-separator {
                  padding: 0;
                }
              }
            }
            p:nth-child(n+4) {
              .el-input__inner {
                width: 184px;
                height: 32px;
                padding-left: 32px!important;
              }
            }
            p:nth-child(9) {
              .el-input__inner {
                width: 248px;
                height: 32px;
                text-align: left!important;
                padding-left: 8px!important;
                .el-range-separator {
                  padding: 0;
                }
              }
            }
          }
        }
        .right {
          float: left;
          width: 431px;
          padding-left: 16px;
          .header {
            height: 31px;
            padding-bottom: 12px;
            margin-bottom: 0;
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(84,84,84,1);
            border-bottom: 1px solid rgba(0,0,0,0.08);
            margin-bottom: 15px;
          }
          .el-table {
            thead {
              tr {
                th {
                  padding: 10px 0;
                  border: none;
                  background-color: #F7F7F7;
                  .cell {
                    height: 20px;
                    line-height: 20px;
                    padding: 0;
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(84,84,84,1);
                  }
                }
                th:nth-child(1) {
                  .cell {
                    padding-left: 12px;
                  }
                }
              }
            }
            tbody {
              tr {
                td {
                  padding: 10px 0;
                  border: none;
                  .cell {
                    height: 20px;
                    line-height: 20px;
                    padding: 0;
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(84,84,84,1);
                  }
                }
                td:nth-child(1) {
                  .cell {
                    padding-left: 12px;
                  }
                }
                td:nth-child(4) {
                  .el-button {
                    padding: 0;
                    span {
                      font-size:14px;
                      font-family:PingFangSC-Regular;
                      font-weight:400;
                      color:rgba(141,141,141,1);
                    }
                  }
                }
              }
            }
          }
        }
      }
      .button {
        text-align: center;
        .el-button {
          width: 88px;
          span {
            display: inline-block;
            height: 16px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
          }
        }
        .el-button:nth-child(1) {
          margin-right: 12px;
          width:88px;
          height:36px;
          background:rgba(255,240,219,1);
          border-radius:4px;
          border:1px solid rgba(255,177,72,1);
          span {
            color: rgba(255,177,72,1);
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,177,72,1);
          }
        }
      }
    }
    .calendarInner1 {
      width:896px;
      padding: 0 16px 36px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      .title {
        height:45px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(50,50,50,1);
        line-height:45px;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        .el-button {
          padding: 0;
          width:68px;
          height:28px;
        }
        .el-button:nth-child(1) {
          margin-left: 642px;
        }
        .el-button:nth-child(2) {
          margin-left: 16px;
          background:rgba(255,240,219,1);
          border-radius:4px;
          border:1px solid rgba(255,177,72,1);
          span {
            color: rgba(255,177,72,1);
          }
        }
      }
      .newCan {
        height: 600px;
        padding-top: 21px;
        .left {
          float: left;
          width: 432px;
          height: 570px;
          padding-right: 18px;
          border-right: 1px solid rgba(0,0,0,0.08);
          .header {
            padding-bottom: 12px;
            margin-bottom: 15px!important;
            height: 31px;
            margin-bottom: 0;
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(84,84,84,1);
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }
          .data {
              margin-bottom: 28px!important;
              span {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
              }
              span:nth-child(1) {
                display: inline-block;
                width: 154px;
                text-align: right;
            }
          }
        }
        .right {
          float: left;
          width: 431px;
          padding-left: 16px;
          .el-tabs {
            .el-tabs__header {
              padding: 0;
              margin-bottom: 19px;
              .el-tabs__nav {
                height: 31px;
                .el-tabs__item {
                  height: 31px;
                  line-height: 15px;
                  font-size:14px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                }
              }
            }
            .el-tabs__nav-wrap::after {
              height: 1px;
              background-color: rgba(0,0,0,0.08);
            }
            .el-tabs__content {
              .el-tab-pane {
                .step {
                width: 388px;
                height: 72px;
                margin-bottom: 16px;
                background: rgba(0, 0, 0, 0.03);
                border-radius: 4px;
                padding: 12px;
                p {
                  font-size:14px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(141,141,141,1);
                }
                .date {
                  margin-bottom: 8px;
                }
              }
              .step:nth-child(n + 4) {
                background: rgba(255, 240, 219, 1);
                p {
                  color:rgba(50,50,50,1);
                }
              }
              }
            }
          }
        }
      }
    }
    .origin {
      .questions {
        background-color: #fff;
        height: 431px;
        padding: 0 16px;
        .header {
          height: 46px;
          padding-top: 10px;
          border-bottom: 1px solid #E3E3E3;
          .newQuestion {
            padding: 0;
            width:130px;
            height:28px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            border:1px solid rgba(255,177,72,1);
            span {
              margin-left: 8px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,255,255,1);
              line-height:20px;
            }
          }
        }
        .items {
          .item {
            margin-top: 16px;
            padding: 15px 12px;
            height: 50px;
            background-color: #F6F6F6;
            .orange {
              color: #FFB148;
            }
            .red {
              color:#FB4319!important;
            }
            .gray {
              color: #8D8D8D!important;
            }
            .name {
              display: inline-block;
              width:200px;
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              line-height:20px;
            }
            .statu {
              display: inline-block;
              width: 42px;
              margin-left: 94px;
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,177,72,1);
              line-height:20px;
            }
            .number {
              display: inline-block;
              width: 96px;
              margin-left: 20px;
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              line-height:20px;
            }
            .date {
              margin-left: 162px;
              height:17px;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(174,174,174,1);
              line-height:17px;
            }
            .statistics {
              margin-left: 73px;
            }
            .copy {
              margin-left: 180px;
            }
            .edit,
            .delate {
              margin-left: 20px;
            }
            .el-button {
              border: none;
              padding: 0;
              height: 20px;
              span {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:20px;
              }
            }
          }
          .item:nth-child(3) {
            .copy {
              margin-left: 20px;
            }
          }
        }
      }
    }
    .question {
      background:rgba(255,255,255,1);
      border-radius:4px;
      padding: 28px 0 36px;
      .el-steps {
        margin-bottom: 28px;
        .el-step__title {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#AEAEAE;
          line-height: 30px;
        }
        .el-step {
          .el-step__icon {
            background: #AEAEAE;
            color:#FFF;
          }
          .el-step__line {
            height: 1px;
          }
        }
        .el-step:first-child {
            .el-step__title{
            color: #FFB148;
          }
            .el-step__line {
              background: #FFB148;
            }
            .el-step__icon {
            background: #FFB148;
          }
        }
        .el-step:nth-child(2) {
          .el-step__icon {
            border-color:#AEAEAE;
          }
        }
      }
      .answer {
        width: 100%;
        padding-left: 116px;
        .name {
          display: flex;
          align-items: center;
          margin-bottom: 44px;
          span {
            font-size:16px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
            line-height:20px;
            margin-right: 12px;
          }
          .el-input {
            width:544px;
          }
          .el-button {
            padding: 6px 12px;
            height:32px;
            background:rgba(255,240,219,1);
            border-radius:4px;
            border:1px solid rgba(255,177,72,1);
            margin-left: 16px;
            span {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,177,72,1);
              line-height:20px;
            }
          }
         .reset {
            width: 108px;
          }
          .preview {
            width: 52px;
          }
        }
        .subject {
          margin-bottom: 32px;
          .quesTitle {
            margin-bottom: 12px;
            .leftIcon {
              width: 12px;
              height: 12px;
              color: #AEAEAE;
              margin-right: 9px;
            }
            .textPart {
              margin-right: 20px;
              display: inline-block;
              padding-left: 8px;
              width: 435px;
              height: 28px;
              line-height: 28px;
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              background-color: #f7f7f7;
            }
            .textPart1 {
              margin-right: 20px;
              display: inline-block;
              padding-left: 8px;
              width: 297px;
              height: 28px;
              line-height: 28px;
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              background-color: #f7f7f7;
            }
            .el-button {
              width: 50px;
              font-size:14px;
              color:rgba(84,84,84,1);
              height: 20px;
              span {
                color:rgba(84,84,84,1);
              }
            }
            .el-select {
              width: 88px;
              height: 28px;
              .el-input__inner {
                  height: 28px;
                  line-height: 28px;
                  padding-left: 12px !important;
                  background:rgba(255,240,219,1);
                  border-radius:4px;
                  border:1px solid rgba(255,177,72,1);
                  color:rgba(255,177,72,1)!important;
              }
              .el-input__suffix {
                right: 4px;
                span {
                  .el-icon-arrow-up:before {
                    color: rgba(255,177,72,1);
                  }
                }
              }
            }
          }
          .quesOption {
              margin-bottom: 8px;
              padding-left: 26px;
            .leftIcon {
              width: 12px;
              height: 12px;
              color: #AEAEAE;
              margin-right: 9px;
            }
            .textPart {
              display: inline-block;
              padding-left: 8px;
              width: 346px;
              height: 28px;
              line-height: 28px;
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              background-color: #f7f7f7;
            }
          }
          .operation {
              margin-bottom: 8px;
              padding-left: 26px;
              color:#FFB148;
            .leftIcon {
              width: 12px;
              height: 12px;
              color: #FFB148;
              margin-right: 9px;
            }
            .el-button {
              padding: 0;
              height: 28px;
              line-height: 28px;
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
            }
          }
          .el-checkbox-group, .el-radio-group {
            margin-left: 26px;
            .el-checkbox, .el-radio {
              display: block;
              margin-bottom: 8px;
              margin-left: 0;
              .el-checkbox__label, .el-radio__label {
                font-size: 16px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(50, 50, 50, 1);
                line-height: 22px;
              }
            }
            .el-checkbox:last-child, .el-radio:last-child {
              margin: 0;
            }
          }
          .el-textarea {
            margin-left: 26px;
            .el-textarea__inner {
              width:904px;
              height:114px;
              background:rgba(246,246,246,1);
              border-radius:2px;
              border:1px solid rgba(227,227,227,1);
            }
          }
        }
        .subject:last-of-type {
          margin-bottom: 16px;
        }
      }
      .button {
        text-align: center;
        .el-button {
          width:108px;
          height: 36px;
        }
        .nextStep {
          background:rgba(255,177,72,1);
          color: #FFF;
        }
      }
    }
    .step2 {
      .question {
      background:rgba(255,255,255,1);
      border-radius:4px;
      padding: 28px 0 36px;
      .el-steps {
        width: 840px;
        margin-bottom: 91px;
        margin-left: 169px;
        .el-step__title {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#AEAEAE;
          line-height: 30px;
        }
        .el-step {
          .el-step__icon {
            background: #AEAEAE;
            color:#FFF;
          }
          .el-step__line {
            height: 1px;
          }
        }
        .el-step:nth-child(1),
        .el-step:nth-child(2) {
            .el-step__title{
            color: #FFB148;
          }
            .el-step__icon {
            background: #FFB148;
          }
        }
        .el-step:nth-child(1),
        .el-step:nth-child(2) {
          .el-step__icon {
            border-color: #FFB148;
          }
        }
      }
      .date {
        height: 148px;
        padding-left: 378px;
        span {
          margin-right: 12px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height:20px;
        }
        .el-date-editor {
          width: 376px;
          height: 32px;
          .el-input__icon {
              color: #8D8D8D;
              line-height: 3 !important;
          }
        }
      }
      .button {
        text-align: center;
        .el-button {
          width:108px;
          height: 36px;
        }
        .nextStep {
          background:rgba(255,177,72,1);
          color: #FFF;
        }
      }
     }
    }
    .step3 {
      .question {
      background:rgba(255,255,255,1);
      border-radius:4px;
      padding: 28px 0 36px;
      .el-steps {
        width: 840px;
        margin-bottom: 42px;
        margin-left: 169px;
        .el-step__title {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#AEAEAE;
          line-height: 30px;
        }
        .el-step {
          .el-step__icon {
            background: #AEAEAE;
            color:#FFF;
          }
          .el-step__line {
            height: 1px;
          }
        }
        .el-step {
            .el-step__title{
            color: #FFB148;
          }
            .el-step__icon {
            background: #FFB148;
          }
        }
        .el-step {
          .el-step__icon {
            border-color: #FFB148;
          }
        }
      }
      .emails {
        height: 248px;
        padding-left: 429px;
        .el-checkbox-group, .el-radio-group {
          .el-checkbox, .el-radio {
            display: block;
            margin-bottom: 14px;
            margin-left: 0;
            .el-checkbox__label, .el-radio__label {
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(84,84,84,1);
              line-height:22px;
            }
          }
          .el-checkbox:first-child {
            margin-left: 8px;
            margin-bottom: 24px;
          }
          .el-checkbox:last-child, .el-radio:last-child {
            margin: 0;
          }
        }
      }
      .button {
        text-align: center;
        .el-button {
          width:108px;
          height: 36px;
        }
        .nextStep {
          background:rgba(255,177,72,1);
          color: #FFF;
        }
      }
      .bottomTip {
        margin-left: 492px;
        margin-top: 8px;
        width: 216px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(174,174,174,1);
        line-height:17px;
      }
     }
    }
    .step4 {
      .question {
      background:rgba(255,255,255,1);
      border-radius:4px;
      padding: 28px 0 36px;
      .el-steps {
        width: 840px;
        margin-bottom: 53px;
        margin-left: 169px;
        .el-step__title {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#AEAEAE;
          line-height: 30px;
        }
        .el-step {
          .el-step__icon {
            background: #AEAEAE;
            color:#FFF;
          }
          .el-step__line {
            height: 1px;
          }
        }
        .el-step {
            .el-step__title{
            color: #FFB148;
          }
            .el-step__icon {
            background: #FFB148;
          }
        }
        .el-step {
          .el-step__icon {
            border-color: #FFB148;
          }
        }
      }
      .successIcon {
        display: block;
        width: 69px;
        height: 68px;
        margin-left: 558px;
        color:#FFB148;
        font-size: 70px;
      }
      .successP {
        margin-top: 10px;
        margin-left: 565px;
        margin-bottom: 68px;
        width:56px;
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(141,141,141,1);
        line-height:20px;
      }
      .button {
        text-align: center;
        .el-button {
          width:160px;
          height: 36px;
        }
        .nextStep {
          background:rgba(255,177,72,1);
          color: #FFF;
        }
      }
     }
    }
  }
</style>
