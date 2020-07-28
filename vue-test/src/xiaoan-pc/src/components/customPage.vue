<template>
  <div class="flip">
    <div class="imgBox" @click="subtraction">
      <img :src="$image.affiche.left" :class="{prohibit: this.flip == 1}">
    </div>

    <span> <p style="color:#f0b148">{{ flip }}</p> / {{ total }}</span>
    <div class="imgBox" @click="addition">
      <img :src="$image.affiche.left" :class="{prohibit: this.flip == this.total}">
    </div>

  </div>
</template>
<script>
  export default {
    name: 'flip',
    props: {
      flip: {
        type: Number,
        required: true,
        default: 1
      },
      total: {
        type: Number,
        required: true,
        default: 50
      }
    },
    methods: {
      subtraction () {
        this.$emit('subtraction')
      },
      addition () {
        this.$emit('addition')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .flip {
    font-size: 14px;
    color: #8d8d8d;
    float: right;
    .imgBox {
      height: 100%;
      width: 10px;
      display: inline-block;
      img {
        cursor: pointer;
      }
      .prohibit {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    span {
      margin: 0 10px;
      p {
        display: inline-block;
      }
    }
    .imgBox:last-child {
      img {
        transform: rotate(180deg);
      }
    }
  }
</style>
