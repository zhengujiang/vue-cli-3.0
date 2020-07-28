<template>
  <div id="r-a-result">
    <div class="content">
      <div class="nav-back">
        <router-link :to="{ name: 'audit-upload' }"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
      </div>
      <div id="title-bar">
        <div class="title-wrapper">
          <span class="title">财务检测</span>
          <span class="amount"><span :class="resultType == 'error' ? 'error' : 'risk'">{{results.data.length}}</span>项{{resultType == 'error' ? '错误' : '风险'}}</span>
          <span class="filename">文件名称：<span>{{filename}}</span></span>
        </div>
        <div class="nav-link" @click="changeResultType">
          <span :class="resultType == 'error' ? 'risk' : 'error'">{{resultType == 'error' ? '风险提示' : '错误问题'}}</span><i
          class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="digests-wrapper">
        <el-tabs v-model="activeTable" @tab-click="handleTabClick">
          <el-tab-pane label="资产负债表" name="first">
            <template v-for="res in liabilityResults">
              <digest-entry
                v-bind:key="res.index"
                v-bind:digest="res"
                v-bind:resultType="resultType"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="利润表" name="second">
            <template v-for="res in profitResults">
              <digest-entry
                v-bind:key="res.index"
                v-bind:digest="res"
                v-bind:resultType="resultType"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="现金流量表" name="third">
            <template v-for="res in cashResults">
              <digest-entry
                v-bind:key="res.index"
                v-bind:digest="res"
                v-bind:resultType="resultType"
              />
            </template>
          </el-tab-pane>
          <el-tab-pane label="其他" name="forth">
            <template v-for="res in otherResults">
              <digest-entry
                v-bind:key="res.index"
                v-bind:digest="res"
                v-bind:resultType="resultType"
              />
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/service/http'
  import Xy from '@/service/testXyApi'
  import digestEntry from '@/view/reportAudit/components/digestEntry.vue'

  export default {
    name: "RAResult",
    components: {
      digestEntry
    },
    data() {
      return {
        filename: '',
        activeTable: 'first',
        resultType: 'error',
        results: {
          data: []
        },
        liabilityResults: [],
        profitResults: [],
        cashResults: [],
        otherResults: []
      }
    },
    async created() {
      if (this.$cookie.get('xyUserId').length === 0) {
        await Axios.get(Xy.api.createUser(), {
          params: {
            dengluZh: this.$cookie.get('userId').slice(0, 30),
            yonghuMm: 'in-hope.cn'
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        let loginRes = await Axios.get(Xy.api.login(), {
          params: {
            username: this.$cookie.get('userId').slice(0, 30),
            password: 'in-hope.cn'
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.$cookie.set('xyUserId', loginRes.data.data.user.userId)
        this.$cookie.set('xyUserToken', loginRes.data.data['user-token'])
      }

      Xy.api.userId = this.$cookie.get('xyUserId')
      Xy.api.userToken = this.$cookie.get('xyUserToken')

      this.filename = localStorage.uploadedFileName
      this.resultType = this.$route.params.resultType

      let response = await Axios.get(Xy.api.findResults(), {
          params: {
            id: localStorage.uploadedFileId,
            // id: '8160228757570560',
            typeGj: '9000710002004,9000710002002,9000710002003',
            typeIssue: this.resultType === 'error' ? '9000690001' : '9000690002',
            typeTable: '9000150015,9000150016,9000150017,fb',
            shifouhulue: '9000570008,9000570007,9000570006'
          },
          headers: {
            'Content-Type': 'multipart/form-data',
            'user-token': Xy.api.userToken
          }
        }
      );

      this.results = response.data

      response.data.data.forEach(d => {
        if (d.baogaoMc === '资产负债表') {
          this.liabilityResults.push(d)
        } else if (d.baogaoMc === '利润表') {
          this.profitResults.push(d)
        } else if (d.baogaoMc === '现金流量表') {
          this.cashResults.push(d)
        } else {
          this.otherResults.push(d)
        }
      })
    },
    methods: {
      handleTabClick(tab, event) {
        // console.log(tab, event);
      },
      async changeResultType() {
        let tempResultType = this.resultType === 'error' ? 'risk' : 'error'

        this.liabilityResults.length = 0
        this.profitResults.length = 0
        this.cashResults.length = 0
        this.otherResults.length = 0

        let response = await Axios.get(Xy.api.findResults(), {
            params: {
              id: localStorage.uploadedFileId,
              // id: '8160228757570560',
              typeGj: '9000710002004,9000710002002,9000710002003',
              typeIssue: tempResultType === 'error' ? '9000690001' : '9000690002',
              typeTable: '9000150015,9000150016,9000150017,fb',
              shifouhulue: '9000570008,9000570007,9000570006'
            },
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            }
          }
        );

        this.results = response.data

        response.data.data.forEach(d => {
          if (d.baogaoMc === '资产负债表') {
            this.liabilityResults.push(d)
          } else if (d.baogaoMc === '利润表') {
            this.profitResults.push(d)
          } else if (d.baogaoMc === '现金流量表') {
            this.cashResults.push(d)
          } else {
            this.otherResults.push(d)
          }
        })

        this.resultType = tempResultType
      }
    }
  }
</script>

<style lang="sass" scoped>
  #r-a-result
    width: 100%
    min-height: 800px
    background-color: rgb(246, 246, 246)
    display: flex
    flex-direction: column
    align-items: center

    .nav-back
      width: 100%
      margin: 20px auto

      i
        color: #AEAEAE

      span
        color: #323232

    #title-bar
      margin: 20px auto
      width: 100%
      padding: 10px 20px
      display: flex
      justify-content: space-between
      align-items: baseline
      background: #FFFFFF
      box-shadow: 0 1px 9px 0 rgba(230, 230, 230, .5)

      .title-wrapper
        display: flex
        align-items: baseline

        .title
          font-weight: bold
          margin-right: 10px

        .amount
          font-size: 14px
          margin-right: 16px

          span
            font-size: 20px
            font-weight: bold
            margin-right: 4px

          .error
            color: red

          .risk
            color: #FFA691

        .filename
          font-size: 12px

      .nav-link
        cursor: pointer

        .error
          color: red

        .risk
          color: #FFA691

        i
          color: #EAEAEA

    .digests-wrapper
      margin-bottom: 100px
      width: 100%
      background: #FFFFFF
      padding: 10px 20px

      .pagination-wrapper
        margin-top: 30px

</style>

