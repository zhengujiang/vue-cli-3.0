<template>
  <div id="r-a-upload">
    <div class="content content-wrapper">
      <div class="banner vxa-image-reportAudit-bg-banner"></div>
      <div class="title-wrapper">
        <div class="divider"></div>
        <div class="title">
          <h2><img class="icon" style="width: 25px" :src="$image.reportAudit.lock"/>三季度报告财务检测<span>（试用版）</span>
          </h2>
          <p>敬请期待更多功能</p>
        </div>
      </div>
      <div class="file-upload-wrapper">
        <div class="hint">
          <img class="icon" :src="$image.reportAudit.lock"/>
          <p>为保护公司敏感信息，该文件将于上传后24小时内自动销毁</p>
        </div>
        <file-uploader/>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/service/http'
  import Xy from '@/service/testXyApi'
  import fileUploader from '@/view/reportAudit/components/fileUploader.vue'

  export default {
    name: "RAUpload",
    components: {
      fileUploader
    },
    data() {
      return {}
    },
    created() {

    },
    methods: {}
  }
</script>

<style lang="sass">
  #r-a-upload
    width: 100%
    background-color: rgb(246, 246, 246)
    display: flex
    flex-direction: column
    align-items: center

    .content-wrapper
      height: 80vh
      min-height: 800px
      background-color: white

      .banner
        margin-bottom: 60px
        height: 260px
      .title-wrapper
        width: 100%
        color: #FFB148
        text-align: center

        .divider
          width: 100%
          height: 1px
          background: rgba(255, 177, 72, 1)

        .title
          transform: translateY(-30%)

          h2, span, p
            background: white

          img
            margin: 0 10px
            vertical-align: sub

          h2
            font-size: 20px
            font-weight: bold
            display: inline
            margin-bottom: .1em

            span
              font-size: 14px
              font-weight: nomal

          p
            font-size: 12px

      .file-upload-wrapper
        margin: 60px auto
        width: 80%
        display: block

        .hint
          font-size: 16px
          color: grey
          display: flex
          align-items: center
          padding-bottom: 5px

          img
            margin-right: 5px
</style>
