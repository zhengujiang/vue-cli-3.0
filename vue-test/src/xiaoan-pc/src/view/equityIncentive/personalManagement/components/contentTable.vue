<template>
  <div id="contentTable">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="" label="" width="52">
        <template slot="header" slot-scope="scope">
          <el-select size="mini" v-model="value6" placeholder="">
            <el-option label="" value="1">全选</el-option>
            <el-option label="" value="2">全不选</el-option>
            <el-option label="" value="3">已停用账号</el-option>
            <el-option label="" value="4">正常状态账号</el-option>
          </el-select>
        </template>
        <template slot-scope="scope"><el-checkbox></el-checkbox></template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="110"></el-table-column>
      <el-table-column prop="tel" label="手机号" width="120">
        <template slot-scope="scope">
          <el-input type="text" size="mini" :placeholder="scope.row.tel"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
      <el-table-column prop="state" label="状态" width="150"></el-table-column>
      <el-table-column prop="handle" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">停用</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000">
      </el-pagination>
      <el-radio-group v-model="radio" size="mini">
        <el-radio-button label="30">30条</el-radio-button>
        <el-radio-button label="50">50条</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contentTable",
    data() {
      return {
        value6:'',
        tableData: [
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          },
          {
            number: '9999', name: '张三某某', tel: '15099996666', email: 'huanhuan.song@infaith.com.cn', state: '2019.12.30 22:32'
          }
        ],
        currentPage: 1,
        radio: '30',
        tel: ''
      }
    },
    methods: {
      handleSizeChange() {

      },
      handleCurrentChange() {

      }
    }
  }
</script>

<style lang="scss">
  #contentTable {
    .el-table {
      margin-bottom: 28px;
      th {
        height: 40px;
        background: rgba(0, 0, 0, 0.03);
        padding: 0;
        border: none;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(141,141,141,1);
        line-height:20px;
      }
      th:nth-child(6) {
        .cell {
          text-align: center;
        }
      }
      tr:nth-child(even) {
        td {
          background:rgba(0,0,0,0.03);
        }
      }
      td {
        height: 40px;
        padding: 0;
        border: none;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(50,50,50,1);
        line-height:17px;
      }
      td:nth-child(5) {
        color:rgba(141,141,141,1);
      }
      td:last-child {
        .el-button {
          color: rgba(141,141,141,1);
        }
      }
      .el-input {
        padding: 0;
        .el-input__inner {
          padding: 0;
          border: none;
          background: none;
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(50,50,50,1);
          line-height:17px;
          &:focus {
            width:84px;
            height:20px;
            background:rgba(238,238,238,1);
          }
        }
      }
    }
    .el-table::before {
      background: none;
    }
    .page {
      display: flex;
      justify-content: space-between;

    }
     thead {
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
            border: 1px solid #e3e3e3;
            background-color: #fff;
           }
         }
       }
     }
     tbody {
      tr {
        td:first-child {
          .cell {
            padding-left: 13px;
          }
        }
      }
    }
  }
</style>
