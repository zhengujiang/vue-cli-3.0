<template>
  <div id="tableTotal" class="el-table">
    <div class="el-table__footer-wrapper" style="">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__footer" style="width: 1156px;">
        <colgroup>
          <col name="el-table_7_column_67" width="70">
          <col name="el-table_7_column_68" width="113">
          <col name="el-table_7_column_69" width="115">
          <col name="el-table_7_column_70" width="150">
          <col name="el-table_7_column_71" width="100">
          <col name="el-table_7_column_72" width="70">
          <col name="el-table_7_column_73" width="115">
          <col name="el-table_7_column_74" width="100">
          <col name="el-table_7_column_75" width="128">
          <col name="el-table_7_column_76" width="95">
          <col name="el-table_7_column_77" width="100">
          <col name="gutter" width="10">
        </colgroup>
        <tbody class="has-gutter">
          <tr>
            <td colspan="1" rowspan="1" class="el-table_7_column_67 is-center is-leaf"><div class="cell">合计</div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_68 is-center is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_69 is-right is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_70 is-right date-column-sort is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_71 is-right date-column is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_72 is-right split-column is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_73 is-right is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_74 is-right date-column is-leaf"><div class="cell"></div></td>
            <td colspan="1" rowspan="1" class="el-table_7_column_75 is-right date-column is-leaf">
              <div class="cell" style="padding-right: 10px"><i v-if="!type">{{amountAbs(total.allAmount)}}</i></div>
            </td>
            <td colspan="1" rowspan="1" class="el-table_7_column_76 is-right is-leaf">
              <div class="cell" style="padding-right: 0">
                <i v-if="type" style="padding-right: 1px">{{amountAbs(total.allAmount)}}</i>
                <i v-else style="padding-right: 5px">{{total.allRatio}}</i>
              </div>
            </td>
            <td colspan="1" rowspan="1" class="el-table_7_column_77 is-right date-column is-leaf">
              <div class="cell" style=""><i v-if="type">{{total.allRatio}}</i></div>
            </td>
            <td class="gutter" style="width: 10px;height: 35px;color: #fff"></td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
</template>
<script>
export default {
    data() {
      return {

      }
    },
    props: ['total', 'type'],
    methods: {
      amountAbs(val) {
        if (val == null || val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      }
    }
}
</script>
<style lang="scss">
  #tableTotal {
    .cell {
      // padding-right: 0
    }
  }
</style>
