<template>
  <div id="result-detail">
    <div @mouseover="mouseOverRecognized" @mouseleave="mouseOutRecognized" class="recognized-wrapper" :class="fullwidth == 'recognized' ? 'full-width' : (fullwidth == 'original' ? 'zero-width' : 'half-width')">
      <div class="title">识别结果：{{detail.fileName}}</div>
      <div class="recognized">
        <table>
          <tr>
            <template v-if="detailRes" >
              <th v-for="(title, index) in detailRes.columns" v-bind:key="index" :style="index != 0 ? 'text-align: right' : ''">
                {{title}}
              </th>
            </template>
          </tr>
          <template v-if="detailRes" >
            <tr v-for="(row, index) in detailRes.data" v-bind:key="index">
              <td v-for="(text, jndex) in row" v-bind:key="jndex" :style="jndex != 0 ? 'text-align: right' : ''">
                {{text != 'nan' ? text : ''}}
              </td>
            </tr>
          </template>
        </table>
      </div>
      <div v-if="hoverOnRecognized" @click="smallRecognized" class='sm-btn'></div>
    </div>
    <div @mouseover="mouseOverOriginal" @mouseleave="mouseOutOriginal" class="original-wrapper" :class="fullwidth == 'original' ? 'full-width' : (fullwidth == 'recognized' ? 'zero-width' : 'half-width')">
      <div class="title">原文查看</div>
      <div class="original">
        <template v-if="detailRes" >
          <template v-for="(img, index) in detailRes.img_path">
            <img :class="index == imgUrlIndex ? '' : 'hidden'" :src="img.replace('/web/file/', fileServer)" v-bind:key="img.index" />
          </template>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-count="detailRes.img_path.length"
            :current-page.sync="imgPageIndex"
            @current-change="handleImgChange"
            >
          </el-pagination>
        </template>
      </div>
      <div v-if="hoverOnOriginal" @click="smallOriginal" class='sm-btn'></div>
    </div>
  </div>
</template>

<script>
import Xy from '@/service/testXyApi'
import Axios from '@/service/http'

export default {
  name: 'resultDetail',
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      detailRes: null,
      fullwidth: '',
      hoverOnRecognized: false,
      hoverOnOriginal: false,
      fileServer: '',
      imgPageIndex: 1,
      imgUrlIndex: 0
    }
  },
  async mounted() {
    this.fileServer = Xy.api.defaultUrl.replace("xiyu.in-hope.cn/xicha-web/", "xiyujpg.in-hope.cn/file-server/")

    this.$watch('detail', detail => { this.getDetailRes(detail) }, { immediate: true })
  },
  methods: {
    async getDetailRes() {
      let res = await Axios.get(Xy.api.findImagesByPidAndFId(), {
        params: {
          docId: localStorage.uploadedFileId,
          pageNumber: 0, // unclear
          reportNameCoding: this.detail.reportNameCoding,
          reportTypeCoding: this.detail.reportTypeCoding,
          tableId: this.detail.tableId
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-token': Xy.api.userToken
        }
      })

      this.detailRes = JSON.parse(res.data.json)
      this.imgUrlIndex = 0
      this.imgPageIndex = 1
    },
    mouseOverRecognized() {
      this.hoverOnRecognized = true
    },
    mouseOverOriginal() {
      this.hoverOnOriginal = true
    },
    mouseOutRecognized() {
      this.hoverOnRecognized = false
    },
    mouseOutOriginal() {
      this.hoverOnOriginal = false
    },
    smallRecognized() {
      if (this.fullwidth === 'recognized') {
        this.fullwidth = ''
      } else if (this.fullwidth === '') {
        this.fullwidth = 'original'
      }
    },
    smallOriginal() {
      if (this.fullwidth === 'original') {
        this.fullwidth = ''
      } else if (this.fullwidth === '') {
        this.fullwidth = 'recognized'
      }
    },
    handleImgChange(index) {
      this.imgUrlIndex = index - 1
      this.imgPageIndex = index
    }
  }
}
</script>

<style lang="sass" scoped>
  #result-detail
    display: flex

    .recognized-wrapper, .original-wrapper
      padding: 0 10px

      &.zero-width
        display: none

      &.half-width
        width: 50%

      &.full-width
        width: 100%

      .title
        font-weight: bold
        color: #545454

    .recognized-wrapper
      position: relative
      .recognized

        height: 700px
        overflow: scroll
        table
          width: 100%

          tr:nth-child(odd)
            background-color: #f2f2f2

          tr:first-child
            color: #FFB148
            background: rgba(255,247,235,1) !important

          th, td
            text-align: left
            padding: .75em

      .sm-btn
        position: absolute
        right: 0
        top: 50%
        width: 40px
        height: 80px
        display: inline-block
        background: rgba(0, 0, 0, .5)
        border-bottom-left-radius: 80px
        border-top-left-radius: 80px
        cursor: pointer
        transform: translateY(-50%)

    .original-wrapper
      position: relative
      .original
        height: 700px
        overflow-x: hidden
        overflow-y: scroll

        img
          width: 100%
          height: auto
        
          &.hidden
            display: none

      .sm-btn
        position: absolute
        left: 0
        top: 50%
        width: 40px
        height: 80px
        display: inline-block
        background: rgba(0, 0, 0, .5)
        border-bottom-right-radius: 80px
        border-top-right-radius: 80px
        cursor: pointer
        transform: translateY(-50%)
</style>

