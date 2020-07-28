<template>
  <div id="basicSituation">
    <div class="content data">
      <div class="first">
        <div class="header">
          <span>本公司三年财务数据分析</span>
          <el-radio-group v-model="radioChart" size="mini" style="margin-top: 11px;">
            <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
            <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
          </el-radio-group>
        </div>
        <div class="dataView">
          <p class="title">财务数据概览</p>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="" width="186"></el-table-column>
            <el-table-column prop="income" label="营业收入" width="200"></el-table-column>
            <el-table-column prop="netMargin" label="归母净利润" width="200"></el-table-column>
            <el-table-column prop="nonReturn" label="扣非归母净利润" width="200"></el-table-column>
            <el-table-column prop="profit" label="每股收益" width="200"></el-table-column>
            <el-table-column prop="rate" label="加权平均净资产收益率" width="176"></el-table-column>
          </el-table>
          <p class="last">* 以上数据年限为 2015-2017年。</p>
        </div>
        <div class="dataDetails">
          <p class="title">财务数据详情</p>
          <div class="inner">
            <table class="table">
              <tr>
                <th></th>
                <th>增长率/营业收入(万元)</th>
                <th>增长率/归母净利润(万元)</th>
                <th>增长率/扣非归母净利润(万元)</th>
                <th>每股收益</th>
                <th>加权平均净资产收益率</th>
              </tr>
              <tr v-for="(item, index) in 3" :key="index">
                <td>2016</td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td>78.76%</td>
                <td>9.32%</td>
              </tr>
            </table>
            <div class="rightDiv">
              <div class="connectUs">
                <el-dialog title="联系我们" :visible.sync="connectUs" width="620px" center>
                  <span class="content" style="display:block;text-indent:0;">尊敬的用户，您已申请股权激励服务咨询，专业股权激励团队随后将会电话联系您。或者您也可以致电： 021-20740322。</span>
                  <span slot="footer" class="dialog-footer">
                   <el-button type="primary" @click="connectUs = false">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
              <p>股权团队建议<span>信</span></p>
              <p>建议概览建议概览建议概览建议概览</p>
              <el-button type="primary" size="mini" @click="connectUs = true">联系我们</el-button>
            </div>
          </div>
        </div>
        <div class="dataDetails dataDetails1">
          <p class="title">财务数据详情</p>
          <div class="inner">
            <table class="table">
              <tr>
                <th></th>
                <th>增长率/营业收入(万元)</th>
                <th>增长率/归母净利润(万元)</th>
                <th>增长率/扣非归母净利润(万元)</th>
                <th>每股收益</th>
                <th>加权平均净资产收益率</th>
              </tr>
              <tr v-for="(item, index) in 3" :key="index">
                <td>2016</td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td><span>+6.23%</span><span>99,999,999</span></td>
                <td>78.76%</td>
                <td>9.32%</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="dataCompare">
          <div class="title">
            <div class="left">
              <span>可比公司三年平均财务数据比较</span>
              <el-radio-group v-model="radio" size="mini">
                <el-radio-button label="1">营业收入</el-radio-button>
                <el-radio-button label="2">归母净利润</el-radio-button>
                <el-radio-button label="3">扣非归母净利润</el-radio-button>
                <el-radio-button label="4">每股收益</el-radio-button>
                <el-radio-button label="5">加权平均净资产收益率</el-radio-button>
              </el-radio-group>
            </div>
            <div class="setCompare">
              <el-dialog title="可比公司设置" :visible.sync="setCompare" width="620px" center>
                <div class="left">
                  <div class="leftHeader">
                    <span>上市公司</span>
                    <el-input placeholder="公司代码/公司简称" v-model="input" size="mini" class="elInput">
                      <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                  </div>
                  <div class="leftBody">
                    <el-table :data="tableData8" style="width: 100%">
                      <el-table-column prop="code" width="69.5"></el-table-column>
                      <el-table-column prop="name" width="69.5"></el-table-column>
                      <el-table-column prop="address" width="69.5"></el-table-column>
                      <el-table-column label="操作" width="69.5" class="rightEdit">
                        <template slot-scope="scope">
                          <el-button
                            size="mini">添加
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="leftFooter">
                    <el-pagination
                      background
                      layout="prev, pager, next"
                      :pager-count="3"
                      :total="100">
                    </el-pagination>
                  </div>
                </div>
                <div class="right">
                  <div class="rightHeader">
                    <span>已选可比公司</span>
                    <span class="number">(4/10)</span>
                  </div>
                  <div class="rightBody">
                    <el-table :data="tableData9" style="width: 100%">
                      <el-table-column prop="code" width="69.5"></el-table-column>
                      <el-table-column prop="name" width="69.5"></el-table-column>
                      <el-table-column prop="address" width="69.5"></el-table-column>
                      <el-table-column label="操作" width="69.5" class="rightEdit">
                        <template slot-scope="scope">
                          <el-button
                            size="mini">移除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="setCompare = false" class="noButton">取 消</el-button>
                  <el-button type="primary" @click="setCompare = false" class="yesButton">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="viewDetail">
              <el-dialog title="证监会同行业公司的营业收入详情" :visible.sync="viewDetail" width="940px" center>
                <div class="table">
                  <el-table :data="tableData10" stripe style="width: 100%">
                    <el-table-column label="" width="133px">
                      <el-table-column prop="name" label="公司信息" width="133px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="营业收入(万元)" width="370px">
                      <el-table-column prop="y2016" label="2016年" width="123px"></el-table-column>
                      <el-table-column prop="y2017" label="2017年" width="123px"></el-table-column>
                      <el-table-column prop="y2018" label="2018年" width="123px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="平均水平(万元)" width="118px">
                      <el-table-column label="" width="118px" prop="average">
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="增长率" width="178px">
                      <el-table-column prop="averageRise" label="平均增长率" width="89px"></el-table-column>
                      <el-table-column prop="complexRise" label="复合增长率" width="89px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="" width="108px">
                      <el-table-column prop="" label="添加可比公司" width="108px">
                        <template slot-scope="scope">
                          <el-button
                            size="mini">添加
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="viewDetail = false" class="noButton">取 消</el-button>
                  <el-button type="primary" @click="viewDetail = false" class="yesButton">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <el-button type="primary" size="mini" @click="setCompare = true">可比公司设置</el-button>
          </div>
          <el-table :data="tableData1" stripe style="width: 100%">
            <el-table-column prop="name" label="" width="120"></el-table-column>
            <el-table-column label="" width="120">
              <el-table-column prop="level" label="平均水平"></el-table-column>
            </el-table-column>
            <el-table-column label="增长率" width="320">
              <el-table-column prop="averageRate" label="平均增长率"></el-table-column>
              <el-table-column prop="compoundRate" label="复合增长率"></el-table-column>
            </el-table-column>
            <el-table-column label="分位值" width="473">
              <el-table-column prop="quantile25" label="25分位"></el-table-column>
              <el-table-column prop="quantile50" label="50分位"></el-table-column>
              <el-table-column prop="quantile75" label="75分位"></el-table-column>
            </el-table-column>
            <el-table-column label="" width="115">
              <el-table-column prop="detail" label="详情" width="115">
                <template slot-scope="scope">
                  <el-button type="text" class="last" size="small" @click=" viewDetail = true">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="second">
        <div class="title">
          <p>股本结构分析<span>请输入拟增发股份，查看股权变动</span></p>
          <el-button type="primary" size="mini">股东身份设置</el-button>
        </div>
        <el-row :gutter="17">
          <el-col :span="12" class="elCol1">
            <p>前十大股东持股比例变动情况：</p>
            <el-table :data="tableData2" stripe style="width: 100%">
              <el-table-column label="" width="88">
                <el-table-column prop="name" label="股东名称" width="120"></el-table-column>
              </el-table-column>
              <el-table-column label="变动前" width="195">
                <el-table-column prop="beforeLevel" label="持股数量"></el-table-column>
                <el-table-column prop="beforeScale" label="持股比例"></el-table-column>
              </el-table-column>
              <el-table-column label="" width="94">
                <el-table-column label="变动(+/-)">
                  <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="变动后" width="195">
                <el-table-column prop="afterLevel" label="持股数量"></el-table-column>
                <el-table-column prop="afterScale" label="持股比例"></el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" class="elCol2">
            <p>控股股东持股比例变动情况：</p>
            <el-table :data="tableData3" stripe style="width: 100%">
              <el-table-column label="变动前" width="239">
                <el-table-column prop="beforeLevel" label="持股数量"></el-table-column>
                <el-table-column prop="beforeScale" label="持股比例"></el-table-column>
              </el-table-column>
              <el-table-column label="" width="94">
                <el-table-column label="变动(+/-)">
                  <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="变动后" width="239">
                <el-table-column prop="afterLevel" label="持股数量"></el-table-column>
                <el-table-column prop="afterScale" label="持股比例"></el-table-column>
              </el-table-column>
            </el-table>
            <p>实际控股人持股比例变动情况：</p>
            <el-table :data="tableData3" stripe style="width: 100%">
              <el-table-column label="变动前" width="239">
                <el-table-column prop="beforeLevel" label="持股数量"></el-table-column>
                <el-table-column prop="beforeScale" label="持股比例"></el-table-column>
              </el-table-column>
              <el-table-column label="" width="94">
                <el-table-column label="变动(+/-)">
                  <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="变动后" width="239">
                <el-table-column prop="afterLevel" label="持股数量"></el-table-column>
                <el-table-column prop="afterScale" label="持股比例"></el-table-column>
              </el-table-column>
            </el-table>
            <p class="last">上市公司董监高、持股10%以上股东持有的股份都称为非社会公众股，非社会公众股不能超过25%，超过的话就不具备上市条件</p>
          </el-col>
        </el-row>
      </div>
      <div class="three">
        <div class="title">
          <span>董监高薪酬水平</span>
          <div class="right">
            <el-button type="primary" size="mini" @click="setCompare = true">可比公司设置</el-button>
            <el-radio-group v-model="radioChart" size="mini" style="margin-top: 11px;">
              <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
              <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="total">
          <div class="button">
            <el-input placeholder="搜索代码/公司简称" v-model="input" size="mini" class="elInput">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" plain size="mini">可比公司</el-button>
            <el-button type="primary" plain size="mini">证监会分类</el-button>
            <el-button type="primary" plain size="mini">申万行业</el-button>
          </div>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData4" stripe style="width: 100%">
          <el-table-column prop="number" label="序号" width="50"></el-table-column>
          <el-table-column prop="code" label="股票代码"></el-table-column>
          <el-table-column prop="name" label="公司简称"></el-table-column>
          <el-table-column prop="director" label="董事"></el-table-column>
          <el-table-column prop="supervisor" label="监事"></el-table-column>
          <el-table-column prop="chairman" label="董事长"></el-table-column>
          <el-table-column prop="generalManager" label="总经理"></el-table-column>
          <el-table-column prop="secretary" label="董事会秘书"></el-table-column>
          <el-table-column prop="chief" label="财务总监"></el-table-column>
        </el-table>
      </div>
      <div class="four">
        <div class="title">
          <p>公司估值情况</p>
          <el-button type="primary" size="mini" @click="setCompare = true">可比公司设置</el-button>
        </div>
        <div class="image">

        </div>
        <div class="total">
          <div class="button">
            <el-input placeholder="搜索代码/公司简称" v-model="input" size="mini" class="elInput">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" plain size="mini">可比公司</el-button>
            <el-button type="primary" plain size="mini">证监会分类</el-button>
            <el-button type="primary" plain size="mini">申万行业</el-button>
          </div>
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData5" stripe style="width: 100%">
          <el-table-column prop="ranking" label="排名" width="50"></el-table-column>
          <el-table-column prop="code" label="股票代码"></el-table-column>
          <el-table-column prop="name" label="公司简称"></el-table-column>
          <el-table-column prop="value" label="总市值" sortable></el-table-column>
          <el-table-column prop="supervisor" label="监事" sortable></el-table-column>
          <el-table-column prop="chairman" label="董事长" sortable></el-table-column>
          <el-table-column prop="generalManager" label="总经理" sortable></el-table-column>
          <el-table-column prop="secretary" label="董事会秘书" sortable></el-table-column>
          <el-table-column prop="chief" label="财务总监" sortable></el-table-column>
        </el-table>
      </div>
      <div class="five">
        <div class="header">
          <span>可比公司股权激励实施情况</span>
          <el-radio-group v-model="radioChart" size="mini" style="margin-top: 11px;">
            <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
            <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
          </el-radio-group>
        </div>
        <el-table :data="tableData6" stripe style="width: 100%">
          <el-table-column prop="code" label="股票代码" width="90"></el-table-column>
          <el-table-column prop="name" label="公司简称" width="90"></el-table-column>
          <el-table-column prop="model" label="激励模式" width="90"></el-table-column>
          <el-table-column prop="announcementDay" label="草案公告日" width="100"></el-table-column>
          <el-table-column prop="source" label="股份来源及规模" width="130"></el-table-column>
          <el-table-column prop="object" label="激励对象" width="259"></el-table-column>
          <el-table-column prop="locking" label="等待期/锁定期" width="170"></el-table-column>
          <el-table-column prop="amortizationCost" label="摊销成本" width="150"></el-table-column>
          <el-table-column label="最近公告">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看公告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <p>结论：文字描述的假字填充文字描述的假字填充文字描述的假字填充文字描述的假字填充文字描述的假字填充</p>
      </div>
      <div class="six">
        <p class="title">可比公司股权激励实施情况</p>
        <el-table :data="tableData7" stripe style="width: 100%">
          <el-table-column prop="code" label="股票代码" width="90"></el-table-column>
          <el-table-column prop="name" label="公司简称" width="90"></el-table-column>
          <el-table-column prop="announcementName" label="公告名称" width="907"></el-table-column>
          <el-table-column label="最近公告">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看公告</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content">
      <div class="bottom">
        <p>信公股权激励团队为您提供专业的股权激励方案若需要专业股权激励团队请联系我们</p>
        <p>设计股权激励方案/制定实施流程及时间表/协助内部沟通/准备公告文件及报备材料/实施过程的咨询辅导</p>
        <el-button type="primary" size="small" @click="connectUs = true">联系我们</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "basicSituation",
    data() {
      return {
        connectUs: false,
        setCompare: false,
        viewDetail: false,
        tableData: [
          {
            name: '平均水平(万元)',
            income: '99,999,999',
            netMargin: '567,987',
            nonReturn: '9,999',
            profit: '89',
            rate: '9.32%'
          },
          {
            name: '平均增长率', income: '78.76%', netMargin: '567,987', nonReturn: '78.76%', profit: '78.76%', rate: '78.76%'
          },
          {
            name: '复合增长率', income: '78.76%', netMargin: '567,987', nonReturn: '78.76%', profit: '78.76%', rate: '78.76%'
          }
        ],
        radio: '1',
        radioChart: '1',
        tableData1: [
          {
            name: '可比公司均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          },
          {
            name: '证监会分类均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          },
          {
            name: '申万行业均值',
            level: '9,999,999',
            averageRate: '34.23%',
            compoundRate: '34.23%',
            quantile25: '999.99',
            quantile50: '999.99',
            quantile75: '999.99'
          }
        ],
        tableData2: [
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          },
          {
            name: '张三某某', beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          }
        ],
        tableData3: [
          {
            beforeLevel: '2,674,427', beforeScale: '34.23%', afterLevel: '2,674,427', afterScale: '34.23%'
          }
        ],
        input: '',
        value: '2019.02.28',
        options: [],
        tableData4: [
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            number: '1',
            code: '000001',
            name: '平安银行',
            director: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          }
        ],
        tableData5: [
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          },
          {
            ranking: '1',
            code: '000001',
            name: '平安银行',
            value: '567,987',
            supervisor: '9,999',
            chairman: '89',
            generalManager: '89',
            secretary: '89',
            chief: '9.32%'
          }
        ],
        tableData6: [
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          },
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          },
          {
            code: '000001',
            name: '平安银行',
            model: '股票期权',
            announcementDay: '2019.03.05',
            source: '定向发行15000万股(占总股本的13.90%)',
            object: '本次首次授予的激励对象人数共209人；占2017年末员工总人数的20.33%； 董监高人数合计6人，占激励对象总人数的2.87%',
            locking: '分3期行权，每期行权比例为40%、30%、30',
            amortizationCost: '预计摊销4年，总成本合计1,233,333万元'
          }
        ],
        tableData7: [
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告公告名称公告名公告名称公告名称称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告公告名称公告名称公告公告名称名称公告名称公告名称公告名称公告名称公告名称公告公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          },
          {
            code: '000001',
            name: '平安银行',
            announcementDay: '2019.03.05',
            announcementName: '公告名称公告名称称公告名告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称公告名称'
          }
        ],
        tableData8: [
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          }
        ],
        tableData9: [
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          },
          {
            code: '000000', name: '公司代码', address: '江苏'
          }
        ],
        tableData10: [
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          },
          {
            name: '000001 公司简称',
            y2016: '99,999,9999.99',
            y2017: '99,999,9999.99',
            y2018: '99,999,9999.99',
            average: '9,999,999.99',
            averageRise: '99.99%',
            complexRise: '99.999%'
          }
        ]
      }
    },
    methods: {
      toData() {
        this.$router.push({path: '/equityIncentive/basicSituation'})
      },
      toChart() {
        this.$router.push({path: '/equityIncentive/chartOverview'})
      }
    }
  }
</script>

<style lang="scss">
  #basicSituation {
    padding: 16px 0 40px;
    .data {
      .first {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .header {
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          .el-radio-group {
            height: 24px;
            // font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: white;
            line-height: 8px;
            .el-radio-button__inner {
              height: 24px;
              line-height: 8px;
            }
          }
        }
        .dataView {
          margin-bottom: 28px;
          .title {
            height: 48px;
            line-height: 48px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
          }
          .el-table {
            th, td {
              height: 40px;
              padding: 0;
            }
            th {
              background: rgba(0, 0, 0, 0.03);
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(84, 84, 84, 1);
              line-height: 20px;
              border-right: 1px solid #ffffff;
              text-align: center;
            }
            td {
              font-size: 16px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(50, 50, 50, 1);
              line-height: 22px;
              text-align: center;
            }
            td:first-child {
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(84, 84, 84, 1);
              line-height: 20px;
              text-align: left;
            }
          }
          .last {
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(141, 141, 141, 1);
            line-height: 17px;
            margin-top: 8px;
          }
        }
        .dataDetails {
          margin-bottom: 28px;
          .title {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            margin-bottom: 12px;
          }
          .inner {
            display: flex;
            justify-content: space-between;
            .table {
              width: 982px;
              tr {
                height: 40px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                th {
                  font-size: 14px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(84, 84, 84, 1);
                  line-height: 20px;
                  font-weight: normal;
                  text-align: right;
                }
                td {
                  font-size: 16px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(50, 50, 50, 1);
                  line-height: 22px;
                  text-align: right;
                  span {
                    margin-left: 16px;
                  }
                }
                td:first-child {
                  font-size: 14px;
                  color: rgba(84, 84, 84, 1);
                  line-height: 20px;
                }
              }
              tr:nth-child(odd) {
                background: rgba(0, 0, 0, 0.03);
              }
            }
            .rightDiv {
              width: 173px;
              height: 162px;
              background: rgba(0, 0, 0, 0.03);
              padding: 16px 27px 0 30px;
              .connectUs {
                .el-dialog {
                  .el-dialog__header {
                    border-bottom: 1px solid rgba(227, 227, 227, 1);
                  }
                  .dialog-footer {
                    .el-button {
                      width: 200px;
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
                  span {
                    width: 96px;
                    height: 22px;
                    font-size: 16px;
                    font-family: PingFangSC-Semibold;
                    font-weight: 600;
                    color: rgba(255, 177, 72, 1);
                    line-height: 22px;
                  }
                  .content {
                    width: 565px;
                    height: 44px;
                    font-size: 16px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(50, 50, 50, 1);
                    line-height: 22px;
                  }
                }
              }
              p:first-child {
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(50, 50, 50, 1);
                line-height: 20px;
                margin-bottom: 10px;
                span {
                  display: inline-block;
                  width: 24px;
                  height: 16px;
                  line-height: 16px;
                  text-align: center;
                  background: rgba(255, 177, 72, 1);
                  border-radius: 4px;
                  font-size: 10px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 1);
                  margin-left: 8px;
                }
              }
              p:nth-child(2) {
                width: 95px;
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(141, 141, 141, 1);
                line-height: 20px;
                text-align: center;
                margin-bottom: 12px;
              }
              .el-button {
                width: 114px;
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
            }
          }
        }
        .dataDetails1 {
          margin-bottom: 38px;
          .inner {
            .table {
              width: 100%;
            }
          }
        }
        .dataCompare {
          .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            .left {
              span {
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(50, 50, 50, 1);
                line-height: 20px;
                margin-right: 16px;
              }
              .el-radio-button {
                border: none;
                .el-radio-button__inner {
                  height: 24px;
                  line-height: 8px;
                  border-radius: 4px;
                  border: 1px solid rgba(227, 227, 227, 1);
                  font-size: 12px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(141, 141, 141, 1);
                  line-height: 8px;
                }
                &.is-active {
                  .el-radio-button__inner {
                    color: #ffffff;
                    border-color: #FFB148;
                  }
                }
              }
            }
            .setCompare {
              .el-dialog {
                height: 618px;
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
                  height: 498px;
                  padding: 0;
                  .left {
                    float: left;
                    width: 44.838%;
                    height: 488px;
                    margin-left: 16px;
                    .leftHeader {
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                      height: 59px;
                      box-sizing: border-box;
                      padding: 23px 0px 12px;
                      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                      span {
                        width: 56px;
                        height: 20px;
                        font-size: 14px;
                        font-family: PingFangSC-Semibold;
                        font-weight: 600;
                        color: rgba(50, 50, 50, 1);
                        line-height: 20px;
                      }
                      .elInput {
                        width: 186px;
                        box-sizing: border-box;
                        border-radius: 4px;
                        border: 1px solid rgba(255, 224, 182, 1);
                        .el-input__inner {
                          height: 24px;
                          padding: 0;
                          padding-left: 10px;
                          padding-top: 3px;
                          border: 1px solid rgba(255, 224, 182, 1);
                        }
                        .el-input-group__append {
                          width: 48px;
                          height: 22px;
                          background: rgba(255, 177, 72, 1);
                          border-radius: 0px 3px 3px 0px;
                          border-color: rgba(255, 224, 182, 1);
                          .el-icon-search {
                            color: #ffffff;
                          }
                        }
                      }
                    }
                    .leftBody {
                      width: 100%;
                      height: 360px;
                      padding-top: 7px;
                      .el-table__body tr,
                      .el-table__body td {
                        padding: 0;
                        padding-top: 11px;
                        height: 36px;
                      }
                      .el-table {
                        .el-table__header {
                          display: none;
                        }
                        .el-table__body {
                          tr {
                            td:nth-child(4) {
                              text-align: right;
                            }
                          }
                          .el-button {
                            width: 48px;
                            height: 24px;
                            background: rgba(255, 240, 219, 1);
                            border-radius: 4px;
                            border: 1px solid rgba(255, 177, 72, 1);
                            padding: 2px 10px;
                            span {
                              width: 28px;
                              height: 20px;
                              font-size: 14px;
                              font-family: PingFangSC-Regular;
                              font-weight: 400;
                              color: rgba(255, 177, 72, 1);
                              line-height: 20px;
                              margin: 0;
                            }
                          }
                          .cell {
                            width: 69px;
                            margin: 0;
                            padding: 0;
                            font-size: 14px;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            color: rgba(84, 84, 84, 1);
                            line-height: 20px;
                          }
                        }
                      }
                    }
                    .leftFooter {
                      width: 100%;
                      height: 78px;
                      margin: 35px 0px 24px;
                      .el-pagination {
                        .btn-prev,
                        .number,
                        .el-icon.more.btn-quicknext.el-icon-more,
                        .btn-next {
                          border: 1px solid #E3E3E3;
                          background-color: #fff;
                        }
                        .number.active {
                          background: #FFB148;
                        }
                      }
                    }
                  }
                  .right {
                    float: left;
                    width: 50%;
                    height: 488px;
                    margin-left: 16px;
                    .rightHeader {
                      width: 100%;
                      height: 59px;
                      box-sizing: border-box;
                      padding: 23px 0px 12px;
                      margin-left: 15px;
                      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                      span {
                        width: 84px;
                        height: 20px;
                        font-size: 14px;
                        font-family: PingFangSC-Semibold;
                        font-weight: 600;
                        color: rgba(50, 50, 50, 1);
                        line-height: 20px;
                      }
                      .number {
                        width: 39px;
                        height: 20px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular;
                        font-weight: 400;
                        color: rgba(84, 84, 84, 1);
                        line-height: 20px;
                        margin-left: 4px;
                      }
                    }
                    .rightBody {
                      width: 100%;
                      height: 360px;
                      padding-left: 15px;
                      margin-top: 11px;
                      border-left: 1px solid rgba(0, 0, 0, 0.08);
                      .el-table__body tr,
                      .el-table__body td {
                        padding: 0;
                        height: 36px;
                      }
                      .el-table {
                        .el-table__header {
                          display: none;
                        }
                        .el-table__body {
                          tr {
                            td:nth-child(4) {
                              text-align: right;
                            }
                          }
                          .el-button {
                            width: 48px;
                            height: 24px;
                            background: rgba(255, 240, 219, 1);
                            border-radius: 4px;
                            border: 1px solid rgba(255, 177, 72, 1);
                            padding: 2px 10px;
                            span {
                              width: 28px;
                              height: 20px;
                              font-size: 14px;
                              font-family: PingFangSC-Regular;
                              font-weight: 400;
                              color: rgba(255, 177, 72, 1);
                              line-height: 20px;
                              margin: 0;
                            }
                          }
                          .cell {
                            width: 69px;
                            margin: 0;
                            padding: 0;
                            font-size: 14px;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            color: rgba(84, 84, 84, 1);
                            line-height: 20px;
                          }
                        }
                      }
                      .el-table::before {
                        height: 0;
                      }
                    }
                  }
                }
                .dialog-footer {
                  margin-bottom: 8px;
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
            }
            .viewDetail {
              .el-dialog {
                height: 550px;
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
                  height: 400px;
                  padding: 16px 15px 0px;
                  .table {
                    .el-table__body tr,
                    .el-table__body td {
                      padding: 0;
                      padding-top: 11px;
                      height: 40px;
                    }
                    .el-table {
                      .el-table__header {
                        tr:nth-child(2) {
                          th:nth-child(1) {
                            text-align: left;
                          }
                          th:nth-child(2),
                          th:nth-child(3),
                          th:nth-child(4) {
                            text-align: right;
                          }
                          th:nth-child(6),
                          th:nth-child(7) {
                            .cell {
                              padding-left: 12px;
                              padding-right: 5px;
                            }
                          }
                        }
                      }
                      .el-table__body {
                        tr:nth-child(3) {
                          td:nth-child(8) {
                            .cell {
                              .el-button {
                                width: 48px;
                                height: 20px;
                                background: rgba(174, 174, 174, 1);
                                border-radius: 4px;
                                border: none;
                                span {
                                  color: #fff;
                                }
                              }
                            }
                          }
                        }
                        .el-button {
                          width: 48px;
                          height: 20px;
                          background: rgba(255, 240, 219, 1);
                          border-radius: 4px;
                          border: 1px solid rgba(255, 177, 72, 1);
                          padding: 2px 10px;
                          span {
                            width: 28px;
                            height: 20px;
                            font-size: 12px;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            color: rgba(255, 177, 72, 1);
                            line-height: 17px;
                            margin: 0;
                          }
                        }
                      }
                    }
                    .el-table::before {
                      height: 0;
                    }
                  }
                }
                .el-dialog__footer {
                  height: 100px;
                  padding-top: 28px;
                  .dialog-footer {
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
              }
            }
            .el-button {
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 8px;
              height: 24px;
            }
          }
          .el-table--border::after, .el-table--group::after {
            background: none;
            width: 0;
          }
          .el-table {
            border: none;
            thead {
              th {
                background: rgba(0, 0, 0, 0.03);
                padding: 0;
                height: 32px;
                border: none;
              }
              tr:first-child {
                th {
                  text-align: center;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(50, 50, 50, 1);
                  line-height: 20px;
                }
                th:nth-child(1), th:nth-child(2), th:nth-child(3), th:nth-child(4) {
                  border-right: 1px solid #ffffff;
                }
              }
              tr:last-child {
                th {
                  font-size: 14px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(84, 84, 84, 1);
                  line-height: 20px;
                  text-align: center;
                }
                th:nth-child(1), th:nth-child(3), th:nth-child(6) {
                  border-right: 1px solid #ffffff;
                }
              }
            }
            td {
              border: none;
              height: 40px;
              padding: 0;
              text-align: center;
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(84, 84, 84, 1);
              line-height: 20px;
              .last {
                font-size: 14px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 177, 72, 1);
                line-height: 20px;
              }
            }
            td:first-child {
              text-align: left;
            }
            td:nth-child(1), td:nth-child(2), td:nth-child(4), td:nth-child(7) {
              border-right: 1px solid #ffffff;
            }
          }
        }
      }
      .second {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
          p {
            font-size: 14px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(141, 141, 141, 1);
              line-height: 20px;
              margin-left: 16px;
            }
          }
          .el-button {
            height: 24px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 8px;
          }
        }
        .el-col {
          p {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
            margin-bottom: 8px;
          }
          .el-table {
            border: none;
            thead {
              th {
                background: rgba(0, 0, 0, 0.03);
                padding: 0;
                height: 32px;
                border: none;
              }
              tr:first-child {
                th {
                  text-align: center;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(50, 50, 50, 1);
                  line-height: 20px;
                }
              }
              tr:last-child {
                th {
                  font-size: 14px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(84, 84, 84, 1);
                  line-height: 20px;
                  text-align: center;
                }
              }
            }
            td {
              border: none;
              height: 40px;
              padding: 0;
              text-align: center;
              font-size: 14px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(84, 84, 84, 1);
              line-height: 20px;
              .el-input {
                .el-input__inner {
                  padding: 0 5px;
                  width: 70px;
                  height: 24px;
                  background: rgba(227, 227, 227, 1);
                  border-radius: 4px;
                  border: 1px solid rgba(174, 174, 174, 1);
                }
              }
            }
          }
        }
        .elCol1 {
          .el-table--border::after, .el-table--group::after, .el-table::before {
            background: none;
            width: 0;
          }
          .el-table {
            thead {
              tr:first-child {
                th:nth-child(1), th:nth-child(2), th:nth-child(3) {
                  border-right: 1px solid #ffffff;
                }
              }
              tr:last-child {
                th:nth-child(1), th:nth-child(3), th:nth-child(4), th:nth-child(6) {
                  border-right: 1px solid #ffffff;
                }
              }
            }
            td:nth-child(1), td:nth-child(3), td:nth-child(4) {
              border-right: 1px solid #ffffff;
            }
          }
        }
        .elCol2 {
          .el-table--border::after, .el-table--group::after {
            background: none;
            width: 0;
          }
          .el-table {
            margin-bottom: 31px;
            thead {
              tr:first-child {
                th:nth-child(1), th:nth-child(2) {
                  border-right: 1px solid #ffffff;
                }
              }
              tr:last-child {
                th:nth-child(2), th:nth-child(3) {
                  border-right: 1px solid #ffffff;
                }
              }
            }
            td {
              height: 60px;
            }
            td:nth-child(2), td:nth-child(3) {
              border-right: 1px solid #ffffff;
            }
          }
          .last {
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(95, 95, 95, 1);
            line-height: 17px;
          }
        }
      }
      .three {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          .right {
            display: flex;
            justify-content: space-between;
            .el-button {
              height: 24px;
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: white;
              line-height: 8px;
              margin-top: 11px;
              margin-right: 16px;
            }
            .el-radio-group {
              height: 24px;
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: white;
              line-height: 8px;
              .el-radio-button__inner {
                height: 24px;
                line-height: 8px;
              }
            }
          }
        }
        .total {
          margin: 16px 0 12px;
          display: flex;
          justify-content: space-between;
          .button {
            .elInput {
              width: 338px;
              margin-right: 24px;
              .el-input__inner {
                border: 1px solid rgba(255, 224, 182, 1);
              }
              .el-input-group__append {
                width: 52px;
                background: rgba(255, 177, 72, 1);
                border-color: rgba(255, 224, 182, 1);
                .el-icon-search {
                  color: #ffffff;
                }
              }
            }
          }
          .el-select {
            width: 104px;
          }
        }
        .el-table {
          &.el-table::before {
            background: none;
          }
          tr {
            border: none;
          }
          th, td {
            padding: 0;
            height: 40px;
            border: none;
            text-align: right;
          }
          th {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 20px;
            background: rgba(0, 0, 0, 0.03);
          }
          td {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 20px;
          }
        }
      }
      .four {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
          p {
            font-size: 14px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            line-height: 20px;
          }
          .el-button {
            height: 24px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 8px;
          }
        }
        .image {
          height: 300px;
        }
        .total {
          margin: 16px 0 12px;
          display: flex;
          justify-content: space-between;
          .button {
            .elInput {
              width: 338px;
              margin-right: 24px;
              .el-input__inner {
                border: 1px solid rgba(255, 224, 182, 1);
              }
              .el-input-group__append {
                width: 52px;
                background: rgba(255, 177, 72, 1);
                border-color: rgba(255, 224, 182, 1);
                .el-icon-search {
                  color: #ffffff;
                }
              }
            }
          }
          .el-select {
            width: 104px;
          }
        }
        .el-table {
          &.el-table::before {
            background: none;
          }
          tr {
            border: none;
          }
          th, td {
            padding: 0;
            height: 40px;
            border: none;
            text-align: right;
          }
          th {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 20px;
            background: rgba(0, 0, 0, 0.03);
          }
          td {
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 20px;
          }
        }
      }
      .five {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .header {
          display: flex;
          justify-content: space-between;
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 16px;
          .el-radio-group {
            height: 24px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: white;
            line-height: 8px;
            .el-radio-button__inner {
              height: 24px;
              line-height: 8px;
            }
          }
        }
        .el-table {
          border: none;
          th {
            height: 40px;
            background: rgba(0, 0, 0, 0.03);
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 17px;
            padding: 0;
            border: none;
          }
          td {
            padding: 0;
            border: none;
            height: 76px;
            text-align: inherit;
            line-height: 0;
            .cell {
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(50, 50, 50, 1);
              line-height: 20px;
              height: 100%;
              padding: 8px 10px;
            }
          }
        }
        p {
          margin-top: 13px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(95, 95, 95, 1);
          line-height: 17px;
        }
      }
      .six {
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 0 16px 24px;
        margin-bottom: 16px;
        .title {
          height: 46px;
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 46px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 16px;
        }
        .el-table {
          border: none;
          th {
            height: 40px;
            background: rgba(0, 0, 0, 0.03);
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 17px;
            padding: 0;
            border: none;
          }
          td {
            padding: 0;
            border: none;
            // height: 64px;
            text-align: inherit;
            line-height: 0;
            .cell {
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(50, 50, 50, 1);
              line-height: 20px;
              height: 100%;
              padding: 8px 10px;
            }
          }
          td:nth-child(3) {
            padding-right: 271px;
          }
        }
        p {
          margin-top: 13px;
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(95, 95, 95, 1);
          line-height: 17px;
        }
      }
    }
    .bottom {
      height: 233px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      text-align: center;
      padding: 0 16px;
      p:first-of-type {
        font-size: 20px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 28px;
        text-align: center;
        padding: 50px 370px 0;
      }
      p:last-of-type {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-align: center;
        margin: 11px 0 29px;
      }
      .el-button {
        width: 196px;
      }
    }
  }
</style>
