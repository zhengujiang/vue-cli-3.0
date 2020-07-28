<template>
  <div id="newStockholderAnalysis" class="content">
    <div class="vxa-flax-box align vux-1px-b" style="width: 100%">
      <div class="col">
        <ul class="menu">
          <li v-for="(item,index) in menuList" :class="{active: item.active}" @click="handleMenu(item, index)">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="col t-right">
        <div class="vxa-flax-box align vxa-border-data" style="display: inline-flex">
          <span class="row-span">当前期数</span>
          <el-select size="mini" v-model="selectVal" placeholder="请选择" @change="timeChange">
            <el-option v-for="item in recordDate" :key="item.value"
                       :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checked: false,
        showDialog: false,
        menuList: [
          {name: '重要股东', tabName: 'importantStock', active: true, link: '/stockholder/importantStock'},
          {name: '股东结构', tabName: 'stockStruct', active: false, link: '/stockholder/stockStruct'},
          {name: '股东名册', tabName: 'stockRollOfficial', active: false, link: '/stockholder/stockRollOfficial'}
        ],
        selectVal: '',
        recordDate: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route: function () {
        this.menuLoad()
      }
    },
    // 生命周期函数
    created() {
      this.getGroupListInfo();
      this.menuLoad()
    },
    mounted() {
    },
    // 方法
    methods: {
      timeChange(val) {
        console.log(val);
        this.$router.replace({query: {time: this.$array.getTimestamps(this.selectVal), index: 1}})
      },
      //
      getGroupListInfo() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.getLastedRecordDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let recordDate = res.data.returnObject;
            // recordDate.reverse();
            this.recordDate = recordDate.map((e, i) => {
              return {label: e, value: e}
            });
            this.$nextTick(() => {
              if (this.recordDate.length > 0) {
                if (this.$route.query.time) {
                  console.warn(1231231223);
                  let selectVal = this.$common.transTime(this.$route.query.time)[1];
                  let set = false;
                  for (let i = 0; i < this.recordDate.length; i++) {
                    if (this.recordDate[i].value == selectVal) {
                      set = true;
                      break;
                    }
                  }
                  if (set) {
                    this.selectVal = selectVal;
                  } else {
                    this.selectVal = this.recordDate[0].value;
                  }
                } else {
                  this.selectVal = this.recordDate[0].value;
                }
              }
              this.$router.replace({query: {time: this.$array.getTimestamps(this.selectVal)}})
              console.log('23411', this.recordDate);
            })
          }
        })
      },
      //
      menuLoad() {
        let name = this.$route.name;
        this.menuList.forEach((item, index) => {
          if (name.indexOf(item.tabName) > -1) {
            item.active = true
          } else {
            item.active = false
          }
        })
      },
      //
      handleMenu(item, index) {
        this.menuList.forEach((item2, index2) => {
          if (index2 == index) {
            this.$set(this.menuList[index2], 'active', true)
          } else {
            this.$set(this.menuList[index2], 'active', false)
          }
        });
        // if (!!!this.selectVal) {
          if (this.recordDate.length > 0) {
            this.selectVal = this.recordDate[0].value;
          }
        // }
        this.$router.push({path: item.link, query: {time: this.$array.getTimestamps(this.selectVal)}})
      },
      //
      close() {
        if (this.checked) {
          this.showDialog = false
        } else {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先同意用户协议'});
        }
      }
    }
  }
</script>

<style lang="scss">
  #newStockholderAnalysis {
    min-height: 600px;
    .vxa-border-data {
      border: 1px solid #e3e3e3;
      padding: 0 0 0 10px;
      border-radius: 4px;
      .el-select {
        width: 120px;
      }
      .el-select .el-input--suffix .el-input__inner {
        border: none;
        padding: 0 0 0 0;
      }
      .row-span {
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
      }
    }
    .menu {
      width: 100%;
      height: 50px;
      // border-bottom: 1px solid #e3e3e3;
      margin-bottom: 0;
      li {
        position: relative;
        padding: 18px 0;
        margin-right: 40px;
        line-height: 1;
        float: left;
        font-size: 14px;
      }
      .active {
        color: #ffb148;
        &::before {
          content: '';
          position: absolute;
          width: 55px;
          height: 2px;
          top: 48px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ffb148;
        }
      }
    }
  }
</style>
