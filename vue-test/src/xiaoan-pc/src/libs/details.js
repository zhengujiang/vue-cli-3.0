/*
* @prams 详情页宽度自适应
* */
export default {
  data() {
    return {}
  },
  watch: {
    // $data: {
    //   contentHtml: function (i) {
    //     console.log('===================', i);
    //   }
    // }
  },
  created() {
    console.log('=======================>', this.$data);
  },
  mounted() {
    this.$nextTick(() => {
      window.onresize = this.contentWidth();
      //
      this.contentHeaderInit();
    })
  },
  methods: {
    contentWidth() {
      if (document.querySelector('#pdf-wrap')) {
        let widthId = document.querySelector('#pdf-wrap');
        console.log('details=-=-=-=-=-=-=-=>', widthId.clientWidth);
      }
    },
    contentHeaderInit() {
      this.$nextTick(() => {
        if (document.querySelector('#content_header')) {
          let head = document.querySelector('#content_header');
          if (document.querySelector('#rules-contents')) {
            let cont = document.querySelector('#rules-contents');
            cont.style.top = head.clientHeight;
            console.log(234234, head.clientHeight);
          }
        }
      })
    }
  }
}
