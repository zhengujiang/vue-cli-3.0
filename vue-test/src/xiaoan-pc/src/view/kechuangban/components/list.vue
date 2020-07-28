<template>
  <ul class="list">
    <li v-for="(item, index) of listData" :key="index" class="hover" :class="{'vux-1px-b': index != listData.length - 1 || urlType == 'rule' || urlType == 'kechuangban'}">
      <div class="title-default">
        <p class="row title" :class="{'flex1': item.show}">
          <router-link v-if="urlType" class="a-link" :class="{fontWeight: item.show}" :to="`/${urlType}/details?id=${item.id}`"
                       target="_blank"
                       v-html="item.title"></router-link>
          <a v-else :href="item.url" target="_blank" class="a-link" :class="{fontWeight: item.show}" v-html="item.title"></a>
        </p>
        <div class="row right" v-if="!item.show">
          <span class="time">{{item.date}}&ensp;|&ensp;</span>
          <span class="set">
            <span @click="handleChange(index, 0)">单条</span>&ensp;|&ensp;<span @click="handleChange(index, 1)">全部</span>
          </span>
          <span class="set-break">
            <span>显示摘要</span>
          </span>
        </div>
      </div>
      <el-collapse-transition>
        <div class="desc-all" v-if="item.show">
          <div class="desc" v-if="item.describe">
            <router-link v-if="urlType" class="a-link desc-link hiddenLine4" :to="`/${urlType}/details?id=${item.id}`" target="_blank"
                         v-html="item.describe"></router-link>
            <a v-else :href="item.url" target="_blank" class="a-link desc-link hiddenLine4" v-html="item.describe"></a>
          </div>
          <div class="about">
            <div class="row left">
              <span class="form" v-if="item.industryLevelTwo">{{ item.industryLevelTwo }}</span>
              <span class="form" v-if="item.industryLevelTwo && (item.issued || item.date)">&ensp;|&ensp;</span>
              <span class="form" v-if="item.issued">{{ item.issued }}</span>
              <span class="form" v-if="item.disclosureTypeName">{{ item.disclosureTypeName }}</span>
              <span class="form" v-if="item.issued && item.date">&ensp;|&ensp;</span>
              <span class="form" v-if="item.disclosureTypeName && item.date">&ensp;|&ensp;</span>
              <span class="form" v-if="item.date">{{ item.date }}</span>
              <span class="form" v-if="item.timeliness">&ensp;|&ensp;</span>
              <span class="form" v-if="item.timeliness">{{ item.timeliness }}</span>
              <span class="form" v-if="item.biaoqian">&ensp;|&ensp;</span>
              <span class="form" v-if="item.biaoqian">{{ item.biaoqian }}</span>
              <span class="form" v-if="item.pingji">&ensp;|&ensp;</span>
              <span class="form" v-if="item.pingji">{{ item.pingji }}</span>
              <span class="form" v-if="item.plate && item.plate.length>0">&ensp;|&ensp;</span>
              <span>
                <i v-html="$array.setMarket(item.plate)"></i>
              </span>
            </div>
            <div class="row right">
            <span class="set">
              <span @click="handleChange(index, 0)">单条</span>&ensp;|&ensp;<span
              @click="handleChange(index, 1)">全部</span>
            </span>
              <button class="set-break" type="button">隐藏摘要</button>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </li>
    <li id="noInfo" v-if="listData.length == 0">
      <img :src="$image.prompt.noInfo" alt="" class="defaultImg">
      <p>暂无内容</p>
      <!-- <template v-if="inputCode == '本公司' && userId && !companyCode">
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
        <p v-if="sort !== 'reportDetail'">搜索不到相关内容，试试别的关键字或使用高级搜索吧！</p>
        <p v-else-if="sort == 'reportDetail'">搜索不到相关内容，试试别的关键字吧!</p>
        <el-button @click="seniorButton" v-if="sort !== 'reportDetail'">高级搜索</el-button>
      </template> -->
    </li>
    <!-- <li class="noShare" v-if="cancelShare">
      <img :src="$image.prompt.shareClose" alt="" class="defaultImg">
      <p>该分享链接已失效！</p>
    </li> -->
  </ul>
</template>

<script>
  export default {
    name: "list",
    components: {},
    data() {
      return {
        listData: [],
        url: ''
      }
    },
    props: {
      data: '',
      noInfo: {
        type: Boolean,
        default: false
      },
      urlType: ''
    },
    watch: {
      data: function (val) {
        this.listData = val;
        if (this.listData[0]) this.listData[0].show = true;
      }
    },
    created() {
      this.listData = this.data;
      if (this.listData[0]) this.listData[0].show = true;
    },
    methods: {
      //
      handleChange(index, type) {
        switch (type) {
          case 0:
            // 单条
            this.listData[index].show = !this.listData[index].show;
            break;
          case 1:
            // 全部
            if (this.listData[index].show) {
              this.listData.forEach((item) => {
                item.show = false;
              })
            } else {
              this.listData.forEach((item) => {
                item.show = true;
              })
            }
            break;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .list {
    li {
      &.hover {
        transition: all .3s;
        &:hover {
          transition: all .3s;
          background-color: #f8f8f8;
        }
      }
      .a-link {
        color: inherit;
        font-weight: normal;
        transition: .3s all;
        &.fontWeight {
          transition: .3s all;
          font-weight: bold;
        }
        &.desc-link {
          display: inherit;
          overflow: hidden;
          max-height: 6em;
        }
        &:hover {
          color: #FFB148;
          transition: .3s all;
        }
      }
      &:hover {
        // color: #ffb148;
      }
      padding: 10px 0;
      .title-default {
        width: 100%;
        align-items: center;
        display: flex;
        .row {
          flex: 1;
          &.title {
            flex: 0 0 80%;
            font-size: 16px;
            color: rgba(50, 50, 50, 1);
            &.flex1 {
              flex: 1;
            }
          }
          &.right {
            text-align: right;
            font-size: 12px;
            color: rgba(174, 174, 174, 1);
            transition: all .3s;
            .set-break {
            }
            .set {
              display: none;
            }
            &:hover {
              .set-break {
                display: none;
              }
              .set {
                display: inline-block;
                span:hover {
                  color: #ffb148;
                }
              }
            }
          }
        }
        .effect {
          color: rgb(141, 141, 141)
        }
        .newLogo {
          width: 33px;
          height: 16px;
          font-weight: normal;
          line-height: 1;
          padding: 0;
          font-size: 13px;
          display: inline-block;
          // color: #ffb148;
          background: #ffb148;
          color: #fff;
          text-align: center;
          border: 1px solid #ffb148;
          border-radius: 2px;
          box-sizing: border-box;
        }
      }
      .desc-all {
        transition: all .3s;
        .desc {
          padding-top: 4px;
          font-size: 14px;
          color: rgba(141, 141, 141, 1);
          line-height: 1.5;
          /*text-align: justify;*/
        }
        .about {
          padding-top: 7px;
          font-size: 12px;
          font-weight: normal;
          color: rgba(174, 174, 174, 1);
          line-height: 16px;
          display: flex;
          .row {
            flex: 1;
            &.left {
              flex: 0 0 90%;
              transition: all .3s;
              span {
                line-height: 1;
              }
            }
            &.right {
              text-align: right;
              transition: all .3s;
              button {
                border: 0;
                padding: 0;
                background-color: inherit !important;
              }
              .set-break {
              }
              .set {
                display: none;
              }
              &:hover {
                .set-break {
                  display: none;
                }
                .set {
                  display: inline-block;
                  span:hover {
                    color: #ffb148;
                  }
                }
              }
            }
          }
        }
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
  }
</style>
