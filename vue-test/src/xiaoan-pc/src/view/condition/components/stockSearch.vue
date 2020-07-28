<template>
  <div class="stock-search">
    <el-autocomplete size="small" popper-class="stock-autocomplete" v-model="stockInput"
                     :fetch-suggestions="querySearch" placeholder="请输入股票代码或拼音缩写" :trigger-on-focus="false">
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div class="popover-header" v-if="item.placeholder">
          <span>代码</span>
          <span>简称</span>
          <span>添加自选</span>
        </div>
        <div class="stock-row" v-else>
          <span class="code" @click="goDetail(item.fullCode)">{{ item.code }}</span>
          <span class="name" @click="goDetail(item.fullCode)">{{ item.name }}</span>
          <span class="favorite" v-if="item.status">
            <el-tag type="info" size="mini" v-if="type == 'attention'">已关注</el-tag>
            <el-tag type="info" size="mini" v-else>已添加</el-tag>
          </span>
          <span class="favorite" v-if="!item.status">
            <el-button type="primary" plain @click="addStock(item.fullCode, item.code)" v-if="type == 'attention'">+ 关注</el-button>
            <el-button type="primary" plain @click="addStock(item.code)" v-else>+ 添加</el-button>
          </span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
  export default {
    name: 'stock-search',
    data() {
      return {
        stockInput: '',
        userInfo: ''
      }
    },
    props: {
      type: {
        type: String,
        default: 'attention'
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
    },
    methods: {
      addStock(fullCode, code) {
        switch (this.type) {
          case 'attention':
            this.addAttention(fullCode, code);
            break;
          case 'compare':
            this.addCompanyCompare(fullCode);
            break;
        }
      },
      //
      addAttention(fullCode, code) {
        this.$http({
          method: "GET",
          url: this.$api.stock.addAttention,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: code,
            companyFullCode: fullCode
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.stockInput = '';
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'});
            this.$emit('onAddAttentionSuccess', fullCode);
          }
        }).catch(err => {
        });
      },
      // 添加可比公司
      addCompanyCompare(fullCode) {
        this.$http({
          method: "POST",
          url: this.$api.enterpriseCompany.addCompanyCompare,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.userInfo.companyId,
            companyCode: fullCode.replace('SH', '').replace('SZ', '')
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.stockInput = '';
            this.$message({showClose: true, type: 'success', duration: 3000, message: '添加成功'});
            this.$emit('onSelectSuccess', fullCode);
          }
        }).catch(err => {
        });
      },
      //
      querySearch(queryString, cb) {
        switch (this.type) {
          case 'attention':
            this.searchStock(queryString, cb);
            break;
          case 'compare':
            this.searchCompany(queryString, cb);
            break;
        }
      },
      //
      searchStock(queryString, cb) {
        this.$http({
          method: "GET",
          url: this.$api.stock.searchStock,
          params: {
            userId: this.$cookie.get('userId'),
            searchStr: queryString.trim()
          }
        }).then(res => {
          let result = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            result = [{placeholder: true}].concat(res.data.returnObject)
            cb(result);
          } else {
            cb(result);
          }
        }).catch(err => {
          let result = [];
          cb(result);
        });
      },
      // 对比
      searchCompany(queryString, cb) {
        this.$http({
          method: "GET",
          url: this.$api.enterpriseCompany.searchCompany,
          params: {
            companyId: this.userInfo.companyId,
            key: queryString.trim()
          }
        }).then(res => {
          let result = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            data.forEach((item) => {
              if (item.status == -1) {
                item.status = false
              } else {
                item.status = true
              }
            })
            result = [{placeholder: true}].concat(data);
            console.log('234234', result);
            cb(result);
          } else {
            cb(result);
          }
        }).catch(err => {
          let result = [];
          cb(result);
        });
      },
      //
      goDetail(code) {
        this.$router.push({path: '/company-condition/' + code});
      }
    }
  }
</script>
<style lang="scss" scoped>
  .stock-search {
    width: 100%;
    .el-autocomplete,
    .el-input {
      width: 100%;
    }
  }
  .stock-autocomplete {
    .el-autocomplete-suggestion__wrap {
      padding: 6px 10px;
    }

    li {
      line-height: 1;
      padding: 6px;
      &:first-of-type {
        cursor: default;
        &:hover {
          background-color: transparent;
        }
      }
      .popover-header {
        display: flex;
        width: 100%;
        border-bottom: solid 1px #e6e6e6;
        > span {
          flex: 1;
        }
      }
      .stock-row {
        display: flex;
        align-items: center;
      }
      .code {
        flex: 1;
      }
      .name {
        flex: 1;
      }
      .price {
        flex: 1;
      }
      .favorite {
        flex: 1;
        .el-tag--info {
          border-color: rgba(144, 147, 153, 0.1);
          font-size: 12px;
          padding: 4px 10px;
          height: auto;
          line-height: 1;
        }
        .el-button {
          font-size: 12px;
          padding: 4px 10px;
        }
      }
    }
  }
</style>
