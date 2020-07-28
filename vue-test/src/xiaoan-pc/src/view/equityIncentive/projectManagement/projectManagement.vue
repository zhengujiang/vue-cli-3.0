<template>
  <div id="projectManagement">
    <div class="content manage">
      <div class="project">
        <p class="title">新建激励计划</p>
        <div class="name">计划名称<el-input v-model="input" placeholder="请输入方案名称，不超过20个字" size="small"></el-input></div>
        <div class="data">开始日期
          <el-date-picker v-model="value1" type="date" placeholder="选择日期" size="small"></el-date-picker>
        </div>
        <div class="mode">激励方式
          <el-radio-group v-model="radio2" @change="handleChange">
            <el-radio :label="1">限制性股票</el-radio>
            <el-radio :label="2">股票期权</el-radio>
            <el-radio :label="3">复合工具（股票期权+限制性股票）</el-radio>
          </el-radio-group>
        </div>
        <!--限制性股票-->
        <div class="disMode" v-if="this.code == 1">
          <div class="quantity">
            <div class="left">
              拟授予权益总数<el-input v-model="input" placeholder="必填" size="small"></el-input>
            </div>
            <div class="right">
              预留权益数量<el-input v-model="input" placeholder="必填" size="small"></el-input>
            </div>
          </div>
          <p class="top">限制性股票</p>
          <div class="line">
            <div class="firstLine"></div>
            <div class="word">本次授予名称</div>
            <div class="lastLine"></div>
          </div>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="请输入本次授予名称"></el-input></div>
            <div class="zon periods"><span class="sp">解除限售期数</span></div>
            <div class="data zon"><span class="sp">限售期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">解除限售比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="tip zon">* 单次解除限售比例请不要超过50%</div>
            <div class="firstData zon">
              <div>
                <span class="sp">本次授予权益日</span>
                <el-date-picker v-model="value2" type="date" placeholder="选择时间" size="small"></el-date-picker>
              </div>
              <div>
                <span class="sp">本次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">本次授予权益价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
            <div class="complate zon">
              <span class="sp">本次授予权益完成日</span>
              <el-date-picker size="small" v-model="value5" type="date" placeholder="选择时间"></el-date-picker>
            </div>
          </div>
          <div class="line two">
            <div class="firstLine"></div>
            <div class="word">第二次</div>
            <div class="lastLine"></div>
          </div>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="不超过20个字"></el-input></div>
            <div class="zon periods"><span class="sp">解除限售期数</span></div>
            <div class="data zon"><span class="sp">限售期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">解除限售比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="firstData zon">
              <div>
                <span class="sp">首次授予权益日</span>
                <el-date-picker size="small" v-model="value2" type="date" placeholder="选择时间"></el-date-picker>
              </div>
              <div>
                <span class="sp">首次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">首次授予权益价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
            <div class="complate zon">
              <span class="sp">首次授予权益完成日</span>
              <el-date-picker size="small" v-model="value5" type="date" placeholder="选择时间"></el-date-picker>
            </div>
          </div>
          <div class="line two">
            <div class="firstLine"></div>
            <div class="word">第三次</div>
            <div class="lastLine"></div>
          </div>
          <p class="add"><el-button class="el-icon-circle-plus-outline" type="text"> 自定义添加第三次授予日</el-button></p>
          <div class="bottomButton">
                  <el-button  class="noButton">取 消</el-button>
                  <el-button type="primary"  class="yesButton" @click.native.prevent="toComplate">确 定</el-button>
          </div>
        </div>
        <!--股票期权-->
        <div class="option" v-if="this.code == 2">
          <div class="quantity">
            <div class="left">
              拟授予权益总数<el-input v-model="input" placeholder="必填" size="small"></el-input>
            </div>
            <div class="right">
              预留权益数量<el-input v-model="input" placeholder="必填" size="small"></el-input>
            </div>
          </div>
            <p class="top">股票期权</p>
          <div class="line">
            <div class="firstLine"></div>
            <div class="word">本次授予名称</div>
            <div class="lastLine"></div>
          </div>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="请输入本次授予名称"></el-input></div>
            <div class="zon periods"><span class="sp">行权期数</span></div>
            <div class="data zon"><span class="sp">等待期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">行权比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="tip zon">* 单次解除限售比例请不要超过50%</div>
            <div class="firstData zon">
              <div>
                <span class="sp">本次授予权益日</span>
                <el-date-picker v-model="value2" type="date" placeholder="选择时间" size="small"></el-date-picker>
              </div>
              <div>
                <span class="sp">本次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">本次授予行权价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
          </div>
          <div class="line two">
            <div class="firstLine"></div>
            <div class="word">第二次</div>
            <div class="lastLine"></div>
          </div>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="不超过20个字"></el-input></div>
            <div class="zon periods"><span class="sp">行权期数</span></div>
            <div class="data zon"><span class="sp">等待期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">行权比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="firstData zon">
              <div>
                <span class="sp">首次授予权益日</span>
                <el-date-picker size="small" v-model="value2" type="date" placeholder="选择时间"></el-date-picker>
              </div>
              <div>
                <span class="sp">首次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">首次授行权益价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
          </div>
          <div class="line two">
            <div class="firstLine"></div>
            <div class="word">第三次</div>
            <div class="lastLine"></div>
          </div>
          <p class="add"><el-button class="el-icon-circle-plus-outline" type="text"> 自定义添加第三次授予日</el-button></p>
          <div class="bottomButton">
                  <el-button  class="noButton">取 消</el-button>
                  <el-button type="primary"  class="yesButton" @click.native.prevent="toComplate">确 定</el-button>
          </div>
        </div>
        <!--复合工具-->
      <div class="main" v-if="this.code == 3">
        <div class="quantity">
            <div class="top">
              <div class="left">
                <span class="spn">限制性股票拟授予权益总数</span><el-input v-model="input" placeholder="必填" size="small"></el-input>
              </div>
              <div class="right">
                <span class="spn">限制性股票预留权益数量</span><el-input v-model="input" placeholder="必填" size="small"></el-input>
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span class="spn">股票期权拟授予权益总数</span><el-input v-model="input" placeholder="必填" size="small"></el-input>
              </div>
              <div class="right">
                <span class="spn">股票期权预留权益数量</span><el-input v-model="input" placeholder="必填" size="small"></el-input>
              </div>
            </div>
            <p class="quantityP">复合工具</p>
       </div>
        <p class="top">限制性股票<span>（若本次无此方式可不填写）</span></p>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="请输入本次授予名称"></el-input></div>
            <div class="zon periods"><span class="sp">解除限售期数</span></div>
            <div class="data zon"><span class="sp">限售期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">解除限售比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="tip zon">* 单次解除限售比例请不要超过50%</div>
            <div class="firstData zon">
              <div>
                <span class="sp">本次授予权益日</span>
                <el-date-picker v-model="value2" type="date" placeholder="选择时间" size="small"></el-date-picker>
              </div>
              <div>
                <span class="sp">本次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">本次授予权益价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
            <div class="complate zon">
              <span class="sp">本次授予权益完成日</span>
              <el-date-picker size="small" v-model="value5" type="date" placeholder="选择时间"></el-date-picker>
            </div>
          </div>
         <p class="top">股票期权<span>（若本次无此方式可不填写）</span></p>
          <div class="inner">
            <div class="zon"><span class="sp">本次授予名称</span><el-input class="name" size="small" v-model="input1" placeholder="请输入本次授予名称"></el-input></div>
            <div class="zon periods"><span class="sp">行权期数</span></div>
            <div class="data zon"><span class="sp">等待期</span><p><span><em>12</em>个月;</span><span><em>24</em>个月;</span><span><em>36</em>个月</span></p></div>
            <div class="beta zon"><span class="sp">行权比例(%)</span><p><span>40</span><span>30</span><span>30</span></p></div>
            <div class="tip zon">* 单次解除限售比例请不要超过50%</div>
            <div class="firstData zon">
              <div>
                <span class="sp">本次授予权益日</span>
                <el-date-picker v-model="value2" type="date" placeholder="选择时间" size="small"></el-date-picker>
              </div>
              <div>
                <span class="sp">本次授予权益数量</span>
                <el-input size="small" v-model="value3"></el-input>
              </div>
              <div>
                <span class="sp">本次授予行权价格</span>
                <el-input size="small" v-model="value4"></el-input>
              </div>
            </div>
          </div>
           <div class="line two">
            <div class="firstLine"></div>
            <div class="word">第三次</div>
            <div class="lastLine"></div>
          </div>
          <p class="add"><el-button class="el-icon-circle-plus-outline" type="text"> 自定义添加第三次授予日</el-button></p>
          <div class="bottomButton">
                  <el-button  class="noButton">取 消</el-button>
                  <el-button type="primary"  class="yesButton" @click.native.prevent="toComplate">确 定</el-button>
          </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "projectManagement",
    data() {
      return {
        input: '',
        value1: '',
        radio2: 1,
        input1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        code: '1',
        value6: '',
        radio3: '',
        activeName: 'first',
        input5: '',
        radio4: '',
        value7: '',
        value8: '',
        value9: '',
        value10: '',
        value11: '',
        tableData: [
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'},
          {name: '张三某某', identity: '281727399371782728', total: '9,999,999', companyAssessment: '已达标'}
        ],
        radio5: '30条'
      }
    },
    methods: {
      handleChange(value) {
        this.code = value;
        this.style.background = "#ccc"
      },
      toComplate() {
       this.$router.push({path: '/equityIncentive/complateNewPro'})
      }
    }
  }
</script>

<style lang="scss">
  #projectManagement {
    padding: 16px 0 0;
    .manage {
      .project {
        min-height:496px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 0px;
        .title {
          height:46px;
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:46px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .name, .data, .mode{
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height:20px;
          margin-top: 16px;
          padding-left: 77px;
        }
        .name {
          .el-input {
            width:544px;
            margin-left: 12px;
          }
        }
        .data {
          .el-date-editor {
            margin-left: 12px;
          }
        }
        .mode {
          margin-bottom: 13px;
          .el-radio-group {
            margin-left: 12px;
            .el-radio__label {
              color:#AEAEAE;
            }
            .is-checked {
              span {
                color:#545454
              }
            }
          }
        }
        .disMode, .option {
          .quantity {
            width: 100%;
            height: 32px;
            margin-bottom: 36px;
            padding-left: 35px;
            .el-input {
                width:160px;
                height:32px;
                margin-left: 12px;
              }
            .left {
              float: left;
            }
            .right {
              float: left;
              margin-left: 56px;
            }
          }
          .top {
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
            line-height:20px;
          }
          .line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .firstLine {
              width: 965px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
            .word {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
            .lastLine {
              width: 90px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
          }
          .inner {
            .periods {
              height: 64px;
              line-height: 64px;
            }
            .zon {
              margin-bottom: 12px;
            }
            .sp {
              display: inline-block;
              width: 130px;
              text-align: right;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              line-height:20px;
              margin-right: 12px;
            }
            .name {
              width: 472px;
              padding-left: 0;
            }
            .total {
              display: flex;
              .el-input {
                width: 160px;
              }
            }
            .data {
              p {
                display: inline-block;
                span {
                  margin-right: 34px;
                  width: auto;
                  em {
                    display: inline-block;
                    text-align: center;
                    width:24px;
                    height:24px;
                    line-height: 24px;
                    border-radius:2px;
                    border:1px solid rgba(0,0,0,0.2);
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(50,50,50,1);
                  }
                }
              }
            }
            .beta {
              padding-left: 77px;
              p {
                display: inline-block;
                span {
                  display: inline-block;
                  width:24px;
                  height:24px;
                  border-radius:2px;
                  border:1px solid rgba(0,0,0,0.2);
                  margin-right: 66px;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(50,50,50,1);
                  line-height:24px;
                  text-align: center;
                }
              }
            }
            .tip {
              height:17px;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
              line-height:17px;
              padding-left: 243px;
            }
            .firstData {
              display: flex;
              .el-input {
                width: 160px;
              }
            }
            .complate {
              .el-input {
                width: 160px;
              }
            }
          }
          .two {
            .firstLine {
              width: 995px;
            }
            .lastLine {
              width: 115px;
            }
          }
          .add {
            i {
              margin-right: 5px;
            }
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(141,141,141,1);
            margin-top: 8px;
            .el-button {
                color: #8D8D8D;
            }
          }
          .bottomButton {
            height: 100px;
            padding-top: 28px;
            padding-bottom: 36px;
            .noButton{
                        width:170px;
                        height:36px;
                        background:rgba(255,240,219,1);
                        border-radius:4px;
                        border:1px solid rgba(255,177,72,1);
                        padding: 6px 69px 8px;
                        margin-right: 10px;
                        margin-left: 389px;
                        span {
                          width:32px;
                          height:22px;
                          font-size:16px;
                          font-family:PingFangSC-Semibold;
                          font-weight:400;
                          color:rgba(255,177,72,1);
                          line-height:22px;
                        }
                      }
            .yesButton {
            width:170px;
            height:36px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            padding: 6px 69px 8px;
            span {
              width:32px;
              height:22px;
              font-size:16px;
              font-family:PingFangSC-Semibold;
              font-weight:400;
              color:rgba(255,255,255,1);
              line-height:22px;                       
            }
          }
          }
        }
      }
    }
    .main {
          .quantity {
            .quantityP {
                  height: 42px;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: #323232;
                  line-height: 42px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            }
            .spn {
               display: inline-block;
              width: 168px;
              text-align: right;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              line-height:20px;
            }
            .top, .bottom {
                width: 100%;
                height: 32px;
                margin-bottom: 16px;
              .el-input {
                  width:160px;
                  height:32px;
                  margin-left: 12px; 
                }
              .left {
                float: left;
              }
              .right {
                float: left;
                margin-left: 38px;
              }
            }
            .bottom {
              margin-bottom: 33px;
            }
          }
          .top {
            font-size:14px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(50,50,50,1);
            line-height:20px;
            margin-top: 24px;
            margin-bottom: 4px;
            span {
              width:252px;
              height:20px;
              font-size:14px;
              font-family:PingFangSC-Semibold;
              font-weight:400;
              color:#8D8D8D;
              line-height:20px;
            }
          }
          .line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .firstLine {
              width: 965px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
            .word {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
            .lastLine {
              width: 90px;
              height:1px;
              background:rgba(0,0,0,0.08);
            }
          }
          .inner {
            .periods {
              height: 64px;
              line-height: 64px;
            }
            .zon {
              margin-bottom: 12px;
            }
            .sp {
              display: inline-block;
              width: 130px;
              text-align: right;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              line-height:20px;
              margin-right: 12px;
            }
            .name {
              width: 472px;
              padding-left: 0;
            }
            .total {
              display: flex;
              .el-input {
                width: 160px;
              }
            }
            .data {
              p {
                display: inline-block;
                span {
                  margin-right: 34px;
                  width: auto;
                  em {
                    display: inline-block;
                    text-align: center;
                    width:24px;
                    height:24px;
                    line-height: 24px;
                    border-radius:2px;
                    border:1px solid rgba(0,0,0,0.2);
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(50,50,50,1);
                  }
                }
              }
            }
            .beta {
              padding-left: 77px;
              p {
                display: inline-block;
                span {
                  display: inline-block;
                  width:24px;
                  height:24px;
                  border-radius:2px;
                  border:1px solid rgba(0,0,0,0.2);
                  margin-right: 66px;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:rgba(50,50,50,1);
                  line-height:24px;
                  text-align: center;
                }
              }
            }
            .tip {
              height:17px;
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
              line-height:17px;
              padding-left: 243px;
            }
            .firstData {
              display: flex;
              .el-input {
                width: 160px;
              }
            }
            .complate {
              padding-bottom: 24px;
              margin-bottom: 0;
              border-bottom: 1px dashed #E3E3E3;
              .el-input {
                width: 160px;
              }
            }
          }
          .two {
            .firstLine {
              width: 995px;
            }
            .lastLine {
              width: 115px;
            }
          }
          .add {
            i {
              margin-right: 5px;
            }
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(141,141,141,1);
            margin-top: 8px;
            .el-button {
                color: #8D8D8D;
            }
          }
          .bottomButton {
            height: 100px;
            padding-top: 28px;
            padding-bottom: 36px;
            .noButton{
                        width:170px;
                        height:36px;
                        background:rgba(255,240,219,1);
                        border-radius:4px;
                        border:1px solid rgba(255,177,72,1);
                        padding: 6px 69px 8px;
                        margin-right: 10px;
                        margin-left: 389px;
                        span {
                          width:32px;
                          height:22px;
                          font-size:16px;
                          font-family:PingFangSC-Semibold;
                          font-weight:400;
                          color:rgba(255,177,72,1);
                          line-height:22px;
                        }
                      }
            .yesButton {
            width:170px;
            height:36px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            padding: 6px 69px 8px;
            span {
              width:32px;
              height:22px;
              font-size:16px;
              font-family:PingFangSC-Semibold;
              font-weight:400;
              color:rgba(255,255,255,1);
              line-height:22px;                       
            }
          }
          }
    }
  }
</style>
