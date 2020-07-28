<template>
  <div id="lookupTables"  class="mainbox">
    <div class="content">
      <div class="left">
        <div class="leftUp">
          <el-popover ref="popover4" placement="bottom" width="180" trigger="click" popper-class="inputCodeTable"
                      v-on:click="selectCode">
            <ul>
              <li v-for="(list,index) in autoCode" :key="index" @click="selectCode(index)">
                <span v-html="$common.highlight(inputCode,list.code)"></span>
                <span>{{ list.name }}</span>
              </li>
            </ul>
          </el-popover>
          <input type="text" placeholder="添加证券代码/简称" v-popover:popover4 @focus="loadCode" @input="loadCode"
                 v-model="inputCode" @keyup.13="searchMethod">
          <i class="iconfont web-jia2 addCompany" @click="addFocus"></i>
        </div>
        <div class="leftDown">
          <ul>
            <li v-for="(list,index) in userFocusList" :key="index">
              <span>{{ list.code }}</span>
              <span>{{ list.name }}</span>
              <i class="iconfont web-shanchu delCompany" @click="cancelFocus(list.name,list.code)"></i>
            </li>
            <li v-show="this.userFocusList.length == 0" style="cursor: default">快去关注公司吧！</li>
          </ul>
        </div>
      </div>
      <div class="right">
        <v-companyList :infoArr="userFocusList"></v-companyList>
        <!--<router-view></router-view>-->
      </div>
    </div>
  </div>
</template>
<script>
  import nav from '../nav.vue'
  import list from './companyList.vue'

  export default {
    name: 'lookupTables',
    data () {
      return {
        inputCode: '',
        pagesize: 10,
        autoCode: [],
        userFocusList: [],
        userObj: {},
        companyCode: '',
        companyName: '',
        isExternal: false
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav,
      'v-companyList': list
    },
    watch: {
      autoCode: function (val) {
//        if (val.length == 0) {
//          document.getElementsByClassName('inputCodeTable')[0].style.display = 'none'
//        } else {
//          document.getElementsByClassName('inputCodeTable')[0].style.display = 'block'
//        }
        console.log(val)
      }
    },
    created () {
      this.getMyInfo()
    },
    mounted () {
//      if (this.userObj.level == 1) {
//        this.getUserFocus()
//      }
    },
    methods: {
      // 获取用户信息
      getMyInfo () {
        this.$http({
          methods: 'GET',
          url: this.$api.user.getMyInfo,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.level == 0 || res.data.returnObject.superviseUser) {
              window.sessionStorage.setItem('companyCode', res.data.returnObject.companyCode)
              window.sessionStorage.setItem('companyName', this.companyName)
              this.$router.replace('/accessTables')
            } else if (res.data.returnObject.level == 1 || res.data.returnObject.level == 9) {  // 1是内部用户； 9是监管用户
              this.getUserFocus()
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取用户关注的公司
      getUserFocus () {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.userFocus,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          // console.log('获取用户关注的公司', res)
          if (res.data.returnCode == 1) {
            this.userFocusList = res.data.returnObject
          } else {
            this.userFocusList = []
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '内部用户暂无关注数据！'
            })
          }
        }).catch((err) => {
          console.log('获取用户关注的公司', err)
        })
      },
      // 取消关注公司
      cancelFocus (name, code) {
        this.$confirm('取消关注' + name + ' ' + code + '?', '取消关注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            methods: 'GET',
            url: this.$api.lookuptables.delFocus,
            params: {
              userId: this.$cookie.get('userId'),
              code: code
            }
          }).then((res) => {
            // console.log('取消关注该公司', res)
            if (res.data.returnCode == 1) {
              this.$message({
                showClose: true,
                type: 'success',
                duration: 3000,
                message: '取消成功！'
              })
              this.getUserFocus()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                duration: 3000,
                message: '取消失败！'
              })
            }
          }).catch((err) => {
            console.log('取消关注该公司', err)
          })
        }).catch(() => {
          console.log('2')
        })
      },
      // 添加关注公司
      addFocus (status) {
        if (status == -1) {
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: '已关注该公司！'
          })
        } else {
          // console.log('------', this.autoCode)
          for (let i = 0; i < this.autoCode.length; i++) {
            if (this.inputCode == this.autoCode[i].code) {
              if (this.autoCode[i].status == -1) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  duration: 3000,
                  message: '已关注该公司！'
                })

              } else {
                this.$http({
                  methods: 'GET',
                  url: this.$api.lookuptables.addFocus,
                  params: {
                    userId: this.$cookie.get('userId'),
                    code: this.inputCode
                  }
                }).then((res) => {
                  console.log('添加关注公司', res)
                  if (res.data.returnCode == 1) {
                    this.$message({
                      showClose: true,
                      type: 'success',
                      duration: 3000,
                      message: '添加成功！'
                    })
                    this.getUserFocus()
                    // console.log('autoCode = ', this.autoCode)

                    for (let i = 0; i < this.autoCode.length; i++) {
                      if (this.inputCode == this.autoCode[i].code) {
                        this.autoCode[i].status = -1
                      }
                    }
                    // this.inputCode = ''
                  } else {
                    this.$message({
                      showClose: true,
                      type: 'error',
                      duration: 3000,
                      message: '添加失败！'
                    })
                  }
                }).catch((err) => {

                })
              }
            }
          }
        }
      },
      // auto选中
      selectCode (index) {
        this.inputCode = this.autoCode[index].code
        this.addFocus(this.autoCode[index].status)
      },
      // 公司代码autocomplete
      loadCode () {
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.checkIsAttend,
          params: {
            userId: this.$cookie.get('userId'),
            key: this.inputCode
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.autoCode = res.data.returnObject
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>
<style lang="scss">
  .inputCodeTable {
    li {
      width: auto;
      height: auto;
      overflow: hidden;
      padding: 10px 0;
      box-sizing: border-box;
      span {
        float: left;
        width: 50%;
      }
      &:hover {
        background: rgba(240, 241, 245, .6);
      }
    }
  }
</style>
<style lang="scss" scoped>
  #lookupTables {
    padding: 20px 0;
    min-height: 760px;
    background-color: #f6f6f6;
    .left {
      float: left;
      width: 240px;
      height: 720px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      border-radius: 2px;
      .leftUp {
        width: 100%;
        height: 52px;
        border-bottom: 1px solid #e3e3e3;
        padding: 10px 18px;
        box-sizing: border-box;
        position: relative;
        input {
          width: 100%;
          height: 100%;
          border: 1px solid #e3e3e3;
          border-radius: 2px;
          font-size: 13px;
          padding: 7px;
        }
        .addCompany {
          position: absolute;
          right: 20px;
          top: 10px;
          color: #ffb148;
          font-weight: bold;
          font-size: 25px;
        }
      }
      .leftDown {
        width: 100%;
        height: auto;
        max-height: 666px;
        overflow-y: auto;
        ul {
          width: 100%;
          height: auto;
          li {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: #323232;
            padding: 0 18px;
            box-sizing: border-box;
            position: relative;
            span {
              margin-right: 5px;
            }
            i {
              display: none;
              position: absolute;
              right: 18px;
              top: 0px;
              color: #ffb148;
            }
            &:hover {
              background: #fff3e4;
              i {
                display: block;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .right {
      padding: 0 !important;
      float: right;
      width: 940px;
      min-height: 600px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
    }
  }
</style>
