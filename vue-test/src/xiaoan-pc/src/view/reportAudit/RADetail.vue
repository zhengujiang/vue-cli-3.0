<template>
  <div id="r-a-detail">
    <div class="nav-back">
      <router-link :to="{ name: 'audit-result', params: { resultType: resultType } }"><i class="el-icon-arrow-left"></i><span>返回</span></router-link>
    </div>
    <div class="detail-wrapper">
      <div class="header">
        <div class="title-wrapper">
          <span class="title">原文定位</span>
          <span class="filename-title">文件名称：</span>
          <span class="filename">{{filename}}</span>
        </div>
        <div class="nav">
          <span class="nav-link" @click="preDetail"><i class="el-icon-arrow-left"></i>上一条</span>
          |
          <span class="nav-link" @click="nextDetail">下一条<i class="el-icon-arrow-right"></i></span>
        </div>
      </div>
      <div class="detail">
        <template v-if="curDetail">
          <result-detail :detail.sync="curDetail" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '@/service/http'
import Xy from '@/service/testXyApi'
import resultDetail from '@/view/reportAudit/components/resultDetail.vue'

export default {
  name: "RADetail",
  components: {
    resultDetail
  },
  computed: {
    curDetail() {
      return this.results[this.curIndex]
    }
  },
  data() {
    return {
      results: [],
      resultType: 'error',
      tableId: '',
      curIndex: 0,
      filename: ''
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
    this.tableId = this.$route.params.tableId

    let response = await Axios.get(Xy.api.findFilesByProjectId(), {
        params: {
          docId: localStorage.uploadedFileId
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-token': Xy.api.userToken
        }
      }
    );

    this.results = response.data
    this.results.forEach((element, index) => {
      if ((element.tableId + ',') === this.tableId) {
        this.curIndex = index
      }
    });
  },
  methods: {
    preDetail() {
      if (this.curIndex === 0) {
        return
      }
      this.curIndex -= 1
    },
    nextDetail() {
      if (this.curIndex === this.results.length - 1) {
        return
      }
      this.curIndex += 1
    }
  }
}
</script>

<style lang="sass" scoped>
  #r-a-detail
    width: 100%
    min-height: 800px
    background-color: rgb(246, 246, 246)
    display: flex
    flex-direction: column
    align-items: center

    .nav-back
      width: 80%
      margin: 20px auto

      i
        color: #AEAEAE

      span
        color: #323232

    .detail-wrapper
      width: 80%
      padding: 20px 20px
      background-color: white
      box-shadow: 0 1px 9px 0 rgba(242, 242, 242, .5)

      .header
        display: flex
        justify-content: space-between

        .title-wrapper
          .title
            font-weight: bold
            color: #323232

          .filename-title
            font-weight: bold
            font-size: 12px
            color: #545454

          .filename
            font-size: 12px
            color: #545454

        .nav
          color: #FFB148

          .nav-link
            cursor: pointer
            font-weight: bold
            color: #FFB148

      .detail
        margin-top: 20px
        width: 100%
</style>
