<template>
  <div :id="id">
  </div>
</template>

<script>
  export default {
    name: 'qrcode',
    data() {
      return {
        id: 'qrcode'
      }
    },
    props: {
      text: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: 256
      },
      height: {
        type: Number,
        default: 256
      },
      propId: String
    },
    created() {
      if (this.propId) {
        this.id = this.propId
      }
    },
    /* watch: {
      text (val) {
        alert(val)
        this.qrcode()
      }
    }, */
    mounted() {
      this.qrcode()
    },
    // 方法
    methods: {
      qrcode () {
        let id = this.id
        let qrcode = new QRCode(id, {
          text: this.text,
          width: this.width,
          height: this.height,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }
  }
</script>
