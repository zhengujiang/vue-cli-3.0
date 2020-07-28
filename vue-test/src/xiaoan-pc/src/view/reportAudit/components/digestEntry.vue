<template>
  <div id="digest-entry">
    <div class="title-wrapper" @click="handleDigestToggle">
      <span class="title">{{digest.gongshiMs}}</span>
      <div class="badge">
        <div class="tag">
          <div class="rect" :class="resultType == 'error' ? 'error' : 'risk'"></div>
          <span>{{resultType == 'error' ? '错误' : '风险'}}</span>
        </div>
        <span v-if="collapsed" class="digest-toggle">显示摘要</span>
      </div>
    </div>
    <div v-if="!collapsed" class="digest-wrapper">
      <div class="original-position-wrapper">
        <router-link :to="{ name: 'audit-detail', params: { resultType: resultType, tableId: digest.biaotiId } }"><span class="original-position text-primary">原文定位：P{{digest.yema}}</span></router-link>
        <span class="digest-toggle" @click="collapseDigest">隐藏摘要</span>
      </div>
      <div class="digest">
        <table>
          <tr>
            <th align="left" colspan="2">项目</th>
            <th align="right">值</th>
          </tr>
          <tr v-for="row in digestDetails" :key="row.index">
            <td align="left">{{row.colOne}}</td>
            <td align="left">{{row.colTwo}}</td>
            <!-- <td align="right" :class="highlight == row.ziduanMc ? (resultType == 'error' ? 'bg-error' : 'bg-risk') : ''">{{row.zhi}}</td> -->
            <td align="right" :class="row.highlight ? (resultType == 'error' ? 'bg-error' : 'bg-risk') : ''">{{strNumToHuman(row.colThree)}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '@/service/http'
import Xy from '@/service/testXyApi'

export default {
  name: "digestEntry",
  props: {
    resultType: {
      type: String,
      required: true,
      default: ''
    },
    digest: {
      type: Object,
      required: true,
      default: null
    }
  },
  data () {
    return {
      digestDetail: null,
      digestDetails: [],
      projectColNumber: 1,
      highlight: '',
      highlight2: '',
      highlights: [],
      collapsed: true
    }
  },
  async created () {
    let response = await Axios.get(Xy.api.findTableValues(), {
        params: {
          docId: localStorage.uploadedFileId,
          // docId: '8160228757570560',
          guizeIdSx: this.digest.guizeIdSx,
          baogaoRq: this.digest.baogaoRq,
          baogaoLxBm: this.digest.baogaoLxBm,
          baogaoMcBm: this.digest.baogaoMcBm,
          biaotiIdJg: this.digest.biaotiId == 'null' ? '' : this.digest.biaotiId
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-token': Xy.api.userToken
        }
      }
    )

    // console.log(this.digest)

    switch (this.digest.guizeIdSx) {
      case 'KBGJ':
        this.highlight = JSON.parse(this.digest.ziduan).ziduanMc
        this.highliagts = [ JSON.parse(this.digest.ziduanZl).ziduanMcX, JSON.parse(this.digest.ziduanZl).ziduanMcY ]
        break;
      case 'BNGJ':
        this.highlight = JSON.parse(this.digest.ziduan)[0].ziduanMc
        break;
      case 'BNGJJS':
        this.highlight = JSON.parse(this.digest.ziduan)[0].ziduanMc
        this.highlight2 = JSON.parse(this.digest.ziduanzl).ziduanMc
        break;
    }

    this.digestDetail = response.data
    this.digestDetail.data.forEach(element => {
      if (['9000150015', '9000150016', '9000150017'].indexOf(element.baogaoMcBm) !== -1) {
        if (this.highlight === element.ziduanMc || this.highlight2 === element.ziduanMc) {
          this.digestDetails.push({
            colOne: element.ziduanMc,
            colTwo: `单位：${element.danwei}`,
            colThree: element.zhi,
            highlight: true
          })
        } else {
          this.digestDetails.push({
            colOne: element.ziduanMc,
            colTwo: `单位：${element.danwei}`,
            colThree: element.zhi,
            highlight: false
          })
        }
      } else {
        if (this.highlights[0] === element.ziduanMcX && this.highlights[1] === element.ziduanMcY) {
          this.digestDetails.push({
            colOne: element.ziduanMcX ? element.ziduanMcX : '',
            colTwo: element.ziduanMcY ? element.ziduanMcY : '',
            colThree: element.zhi,
            highlight: true
          })
        } else {
          this.digestDetails.push({
            colOne: element.ziduanMcX ? element.ziduanMcX : '',
            colTwo: element.ziduanMcY ? element.ziduanMcY : '',
            colThree: element.zhi,
            highlight: false
          })
        }
      }
    });

  },
  methods: {
    handleDigestToggle() {
      this.collapsed = !this.collapsed
    },
    collapseDigest() {
      this.collapsed = true
    },
    strNumToHuman(strNum) {
      strNum = parseFloat(strNum).toFixed(2)
      let prefix = strNum.toString().split('.')[0]
      let suffix = strNum.toString().split('.')[1]
      prefix = prefix.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return prefix + '.' + suffix
    }
  }
}
</script>

<style lang="sass" scoped>
  #digest-entry
    padding: 10px 0
    border-bottom: 1px solid #EAEAEA
    .digest-toggle
      margin-left: 16px
      font-size: 12px
      color: #AEAEAE
      cursor: pointer

    .title-wrapper
      cursor: pointer
      width: 100%
      display: flex
      justify-content: space-between

      .title
        font-weight: bold
        font-size: 14px
        color: #323232

      .badge
        display: flex
        align-items: center

        .tag
          display: flex
          align-items: center
          color: #5B5B5B
          font-size: 14px

          .rect
            margin-right: 6px
            width: 14px
            height: 14px

            &.error
              background-color: red
            &.risk
              background-color: #FFA691

    .original-position-wrapper
      margin: 10px 0 16px 0
      width: 100%
      display: flex
      justify-content: space-between

      .original-position
        font-weight: bold
        font-size: 14px
        color: #FFB148

    .digest
      table
        width: 100%

        tr:nth-child(odd)
          background-color: #f2f2f2

        th, td
          padding: .75em

        td.bg-error
          background: red

        td.bg-risk
          background: #FFA691



</style>

