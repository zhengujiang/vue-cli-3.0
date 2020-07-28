<template>
  <div id="regulation-manage">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never" body-style="padding:0px">
          <div class="item">
            <el-autocomplete class="searchbox" style="width:100%" size="small" :fetch-suggestions="querySearchAsync"
                             :trigger-on-focus="false" v-model="something" @select="handleSearchSelect"
                             placeholder="搜索制度分类名称" suffix-icon="el-icon-search">
              <template slot-scope="{ item }">
                <span v-html="keywordHighlight(item)"></span>
              </template>
            </el-autocomplete>
          </div>
          <el-menu class="menu" :default-active="activeIndex" @select="handleSelect" unique-opened
                   v-loading="loadingCatalog">
            <!-- 常规制度分类 -->
            <el-submenu :index="index+1+''" v-for="(catalog, index) in catalogArr" :key="index"
                        v-if="catalog.children.length && catalog.label != '我的制度'">
              <template slot="title">
                <span :title="catalog.label">{{wordClamp(catalog.label)}}<span class="num"> ({{catalog.count}}项)</span></span>
              </template>
              <el-menu-item v-for="(item, subIndex) in catalog.children" :index="`${index+1}_${subIndex+1}`"
                            :key="item.key" :title="item.label">
                <span :title="item.label">{{wordClamp(item.label)}}<span class="num"> ({{item.count||0}}项)</span></span>
              </el-menu-item>
            </el-submenu>
            <!-- 未分类的制度 -->
            <el-menu-item v-for="(catalog, index) in catalogArr" :key="index" v-if="!catalog.children.length"
                          :index="index+1+''" @select="handleSelect">
              <span style="white-space:normal;width:160px" :title="catalog.label"
                    v-line-clamp:22="1">{{catalog.label}}<span class="num"> ({{catalog.count}}项)</span></span>
            </el-menu-item>
            <div style="width:100%;height:1px;content:'';background:#e3e3e3"></div>
            <!-- 我的制度 -->
            <el-submenu :index="index+1+''" v-for="(catalog, index) in catalogArr" :key="catalog.id"
                        v-if="catalog.label == '我的制度'">
              <template slot="title">
                <span :title="catalog.label">{{wordClamp(catalog.label)}}<span class="num"> ({{catalog.count}}项)</span></span>
              </template>
              <el-menu-item v-for="(item, subIndex) in catalog.children" :index="`${index+1}_${subIndex+1}`"
                            :key="subIndex">
                <div v-if="item.placeholder">
                  <el-button type="primary" class="menu-btn" size="mini"><i class="iconfont web-editor"></i>
                    添加制度分类
                  </el-button>
                </div>
                <div class="has-hover-btn" v-else :title="item.label">
                  <span style="flex:1">{{wordClamp(item.label)}}<span class="num"> ({{item.count||0}}项)</span></span>
                  <el-button class="hover-btn" type="text" icon="el-icon-edit-outline" size="mini"
                             @click="editMycatalog(index,subIndex)"></el-button>
                  <el-button class="hover-btn" type="text" icon="el-icon-delete" size="mini"
                             @click="deleteMyCatalog(index,subIndex)"></el-button>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <!-- pdf -->
        <el-card class="box-card" shadow="never" v-if="pdfName.length>0">
          <div slot="header" style="display: flex;align-items: center;">
            <el-button type="text" @click="pdfName = ''">
              <i class="el-icon-arrow-left" style="color: #ffb148;font-weight: bolder;"></i>返回
            </el-button>
            <span style="flex:1;text-align:center;font-weight:bolder">{{pdfName}}</span>
          </div>
          <v-iframe :src="pdfUrl"></v-iframe>
          <!-- card body -->
        </el-card>
        <!-- pdfList -->
        <el-card class="box-card" shadow="never" v-else>
          <div slot="header" class="card-header">
            <h4 style="font-size:16px" v-if="catalogArr[rootIndex-1]">{{rootLabel}}<span
              v-if="rootLabel!==''&&subLabel!==''">/</span>{{subLabel}}
              <span class="badge required"
                    v-if="subIndex && catalogArr[rootIndex-1].children && catalogArr[rootIndex-1].children[subIndex-1] && catalogArr[rootIndex-1].children[subIndex-1].isRequired">
                必备
              </span>
              <span v-else class="badge optional">可选</span>
            </h4>
            <el-button type="text" icon="el-icon-upload2" @click="uploadDialogVisible = true">上传</el-button>
          </div>
          <ul class="regulation-list">
            <li v-for="(item, index) in institutions" :key="index">
              <div class="text" @click="openPdf(item.institutionName,item.institutionFileUrl)">
                <h4>{{item.institutionName}}</h4>
                <p>发布日期：{{$common.transTime(item.publishDate)[1]}} | {{item.updateUserName}}
                  编辑于{{$common.transTime(item.updateTime)[1]}}
                </p>
              </div>
              <div class="btn-group">
                <el-button type="text" @click="handleEdit(item)">编辑</el-button>
                <span>/</span>
                <el-button type="text" @click="handleDelete(item.id)">删除</el-button>
              </div>
            </li>
          </ul>
          <div class="empty vxa-image-index-bg-empty2" v-if="institutions.length<=0"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="编辑" :visible.sync="editFormDialogVisible" width="60%">
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item label="名称：">
          <el-input v-model="editForm.institutionName" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="分类：">
          <el-select v-model="editForm.catalogName" v-if="catalogArr.length>0" style="width:100%">
            <el-option v-for="item in queryArr" :key="item.id" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加制度分类" :visible.sync="createFormDialogVisible" width="40%">
      <el-form :model="createForm" ref="createForm" label-width="80px">
        <el-form-item label="名称：" prop="catalogName" :rules="[{ required: true, message: '请输入分类名称'}]">
          <el-input v-model="createForm.catalogName" style="width:100%" placeholder="输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="createFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传规章制度" :visible.sync="uploadDialogVisible" width="400px" @closed="cancelUpload"
               :before-close="beforeUploaderClose">
      <el-upload v-if="stepIndex == 1" class="uploader" ref="upload" accept="application/pdf" drag
                 :before-upload="beforeUploadHandler" :action="this.$api.institution.addRegulations">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请上传大小在20mb以内的pdf文件</div>
      </el-upload>
      <el-form v-if="stepIndex == 2" :model="addNewRegulationForm" ref="addNewRegulationForm" label-width="80px">
        <el-form-item label="名称：">
          <el-input v-model="addNewRegulationForm.regulationsName"></el-input>
        </el-form-item>
      </el-form>
      <el-progress v-if="isUploading" :show-text="false" :stroke-width="18"
                   :percentage="uploadingPercentage"></el-progress>
      <span slot="footer">
        <el-button type="primary" v-if="stepIndex == 2" @click="handleUpload(0)">上一步</el-button>
        <el-button type="primary" v-if="stepIndex != 1" :disabled="isUploading && stepIndex == 2"
                   @click="handleUpload(stepIndex)">{{steps[stepIndex]}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import iframe from "../../components/iframe.vue";
  export default {
    components: {
      "v-iframe": iframe
    },
    data() {
      return {
        userInfo: {},
        catalogArr: [],
        loadingCatalog: true,
        activeIndex: "1_1",
        rootIndex: "1",
        subIndex: "1",
        institutions: [],
        pageNum: 1,
        editForm: {},
        createForm: {
          catalogName: ""
        },
        editFormDialogVisible: false,
        uploadDialogVisible: false,
        createFormDialogVisible: false,
        steps: ["上一步", "下一步", "确定"],
        stepIndex: 1,
        addNewRegulationForm: {},
        editMyCatalogDialogVisible: false,
        myCatalogEditForm: {},
        pdfName: "",
        pdfUrl: "",
        queryArr: [],
        something: "",
        isUploading: false,
        uploadPercentage: 0,
        uploadingPercentage: 0
      };
    },
    watch: {
      uploadPercentage: function (val) {
        this.uploadingPercentage = val;
        if (val <= 10) {
          this.uploadingPercentage = 0;
        } else {
          this.uploadingPercentage = val - 10;
        }
        if (val == 100) {
          setTimeout(() => {
            this.selectAllForCompanyCatalog(this.catalogId);
          }, 3000)
        }
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.userInfo.superviseUser) {
        if (this.$route.query.companyCode) {
          this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
        }
      }
      this.activeIndex = this.$cookie.get("regulation_index") || "1_1";
      this.rootIndex = this.activeIndex.split("_")[0];
      this.subIndex = this.activeIndex.split("_")[1];
      this.selectAllByCatalogType();
    },
    methods: {
      wordClamp(text) {
        if (text.length > 12) {
          return text.substr(0, 12) + "...";
        } else {
          return text;
        }
      },
      // 根据ID获取显示内容
      bindData() {
        let id = this.$route.query.id
        let key1 = 0
        let key2 = 0
        if (id) {
          this.catalogArr.forEach((item, index) => {
            if (item.id == id) {
              key1 = index + 1
            } else if (item.children.length > 0) {
              item.children.forEach((item2, index2) => {
                if (item2.id == id) {
                  key1 = index + 1
                  key2 = index2 + 1
                }
              })
            }
          })
          this.activeIndex = key1 + '_' + key2
          this.rootIndex = this.activeIndex.split("_")[0];
          this.subIndex = this.activeIndex.split("_")[1];
          // this.selectAllByCatalogType();
        }
      },
      selectAllByCatalogType() {
        this.loadingCatalog = true;
        this.catalogArr = [];
        this.$http({
          url: this.$api.institution.selectAllByCatalogType,
          method: "GET",
          params: {
            catalogType: "0",
            companyId: this.userInfo.companyId,
            stockCode: this.companyCode
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.catalogArr = res.data.returnObject;
            // this.rootIndex = 1;
            // this.subIndex = 1;
            // this.activeIndex = "1_1";
            let myIndex = this.catalogArr.findIndex(e => e.label === "我的制度");

            this.bindData()
            console.log(this.catalogArr)

            this.$http({
              url: this.$api.institution.listCompanyCatalog,
              method: "GET",
              params: {
                userId: this.userInfo.id,
                parentCatalogId: this.catalogArr[myIndex].id
              }
            })
              .then(res => {
                if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                  let count = 0;
                  res.data.returnObject.forEach(item => {
                    count += item.count;
                  });
                  this.$set(this.catalogArr[myIndex], "count", count);
                  this.$set(
                    this.catalogArr[myIndex],
                    "children",
                    res.data.returnObject
                  );
                  const arr = [];
                  this.catalogArr.forEach((catalog, index) => {
                    if (catalog.children.length) {
                      catalog.children.forEach((child, subIndex) => {
                        let obj = {
                          label: child.label,
                          value: child.label,
                          id: child.id,
                          rootIndex: index,
                          subIndex: subIndex
                        };
                        arr.push(obj);
                      });
                      let id = "";
                      if (
                        this.catalogArr[this.rootIndex - 1].children.length > 0
                      ) {
                        id = this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1].id;
                      } else {
                        id = this.catalogArr[this.rootIndex - 1].id;
                      }
                      this.selectAllForCompanyCatalog(id);
                      this.loadingCatalog = false;
                    } else {
                      let obj = {
                        label: catalog.label,
                        value: catalog.label,
                        id: catalog.id,
                        rootIndex: index,
                        subIndex: ""
                      };
                      arr.push(obj);
                      this.loadingCatalog = false;
                    }
                  });
                  this.queryArr = arr;
                  this.catalogArr[myIndex].children.unshift({
                    placeholder: true,
                    id: 0,
                    isRequired: 0
                  });
                }
              })
              .catch(err => {
              });
          } else {
            this.loadingCatalog = false;
          }
        });
      },
      selectAllForCompanyCatalog(catalogId) {
        this.$http({
          url: this.$api.institution.selectAllForCompanyCatalog,
          method: "GET",
          params: {
            catalogId: catalogId,
            companyId: this.userInfo.companyId,
            stockCode: this.companyCode,
            pageNum: this.pageNum,
            pageSize: "100"
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.institutions = res.data.returnObject;
          }
        });
      },
      handleSelect(e) {
        this.activeIndex = e;
        this.rootIndex = e.split("_")[0];
        this.subIndex = e.split("_")[1] || "";
        if (this.rootLabel == "我的制度" || this.rootLabel == "未分类制度") {
        } else {
          this.$cookie.set("regulation_index", e);
        }
        this.pageNum = 1;
        this.pdfName = "";
        if (this.rootLabel == "我的制度" && this.subIndex == "1") {
          console.log("我的制度");
          this.createMyCatalog();
        }
        this.selectAllForCompanyCatalog(this.catalogId);
      },
      handleEdit(row) {
        console.log(row);
        this.editForm = {
          catalogId: this.catalogId,
          institutionName: row.institutionName,
          companyId: this.userInfo.companyId,
          catalogName: row.catalogName,
          id: row.id
        };
        this.editFormDialogVisible = true;
      },
      handleDelete(id) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: this.$api.institution.deleteRegulations,
              method: "post",
              params: {
                regulationsId: id,
                companyId: this.userInfo.companyId,
                stockCode: this.companyCode
              }
            }).then(res => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                this.$message({
                  type: "success",
                  shwoClose: true,
                  message: "删除"
                });
                this.selectAllForCompanyCatalog(this.catalogId);
              } else {
                this.$message({
                  type: "error",
                  shwoClose: true,
                  message: "删除失败"
                });
              }
            });
          }).catch(() => {
        });
      },
      updateFormSubmit() {
        let index = this.queryArr.findIndex(
          e => e.label == this.editForm.catalogName
        );
        this.$http({
          url: this.$api.institution.editRegulations,
          method: "POST",
          data: {
            catalogId: this.queryArr[index].id,
            catalogName: this.editForm.catalogName,
            companyId: this.editForm.companyId,
            stockCode: this.companyCode,
            id: this.editForm.id,
            institutionName: this.editForm.institutionName
          }
          // data:this.editForm
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({
              type: "success",
              shwoClose: true,
              message: "更新成功"
            });
            this.editFormDialogVisible = false;
            this.selectAllByCatalogType();
            // this.selectAllForCompanyCatalog(this.catalogId);
          } else {
            this.$message({
              type: "error",
              shwoClose: true,
              message: "更新失败"
            });
          }
        });
      },
      handleUpload(step) {
        if (step == 1) {
          this.$refs.upload.submit();
        } else if (step == 2) {
          let index = this.queryArr.findIndex(
            e => e.label == this.addNewRegulationForm.catalogName
          );
          if (index) {
            this.$set(this.addNewRegulationForm, "id", this.queryArr[index].id);
          }
          console.log("param:", this.addNewRegulationForm);
          for (let i in this.addNewRegulationForm) {
            console.log(i, this.addNewRegulationForm[i]);
            // this.param.append(i, this.addNewRegulationForm[i] || "未命名制度");
            this.param.append(i, this.addNewRegulationForm[i]);
          }

          console.log("param:", this.param);
          this.isUploading = true;
          this.$http({
            url: this.$api.institution.addRegulations,
            method: "post",
            data: this.param,
            headers: {"Content-Type": "multipart/form-data"},
            timeout: 1000 * 60 * 2,
            onUploadProgress: progressEvent => {
              console.log(progressEvent);
              this.uploadPercentage = (progressEvent.loaded / progressEvent.total * 100 | 0);
              var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
              console.log(complete);
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              // console.log('uploadPercentage===>', this.uploadPercentage);
              if (this.uploadPercentage == 100) {
                this.$nextTick(() => {
                  this.isUploading = false;
                  setTimeout(() => {
                    this.selectAllForCompanyCatalog(this.catalogId);
                    this.$message({message: "上传成功", showClose: true, type: "success"});
                  }, 2000)
                  this.uploadDialogVisible = false;
                  this.addNewRegulationForm = {};
                  this.stepIndex = 1;
                  this.uploadPercentage = 0;
                })
              }
            } else {
              this.$message({message: "网络错误，请重试", type: "error", showClose: true});
              this.uploadDialogVisible = false;
              this.isUploading = false;
              this.uploadPercentage = 0;
              this.addNewRegulationForm = {};
              this.stepIndex = 1;
            }
          }).catch(err => {
            this.uploadPercentage = 0;
            this.isUploading = false;
            console.log(err);
          });
        } else {
          this.stepIndex--;
        }
      },
      beforeUploaderClose(e) {
        if (this.isUploading) {
          this.$message({message: "上传中，请稍候", showClose: true, type: "warning"});
          return false;
        } else {
          this.uploadDialogVisible = false;
        }
      },
      beforeUploadHandler(file) {
        console.log(file);
        if (file.size / (1024 * 1024) >= 20) {
          this.$message({type: "warning", shwoClose: true, message: "上传20m以下的文件"});
          return false;
        }
        this.param = new FormData();
        this.param.append("regulationsFile", file);
        this.stepIndex++;
        this.addNewRegulationForm.regulationsName = file.name.split(".")[0];
        this.addNewRegulationForm.userId = this.$store.state.userData.id;
        if (this.userInfo.superviseUser) {
          this.addNewRegulationForm.stockCode = this.companyCode
          this.addNewRegulationForm.companyId = ''
        } else {
          this.addNewRegulationForm.stockCode = ''
          this.addNewRegulationForm.companyId = this.userInfo.companyId
        }

        this.addNewRegulationForm.catalogId = this.catalogId;
        if (this.subLabel) {
          this.addNewRegulationForm.catalogName = this.subLabel;
        } else {
          this.addNewRegulationForm.catalogName = this.rootLabel;
        }

        return false;
      },
      cancelUpload() {
        this.addNewRegulationForm = {};
        this.stepIndex = 1;
        this.uploadDialogVisible = false;
      },
      createMyCatalog() {
        this.createFormDialogVisible = true;
        // this.subIndex++;
      },
      createFormSubmit() {
        this.$refs["createForm"].validate(valid => {
          if (!valid) {
            return false;
          } else {
            this.$http({
              url: this.$api.institution.addCompanyCatalog,
              method: "POST",
              params: {
                parentCatalogId: this.catalogArr[this.rootIndex - 1].id,
                catalogName: this.createForm.catalogName,
                userId: this.userInfo.id
              }
            }).then(res => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                this.subIndex = 2;
                this.activeIndex = `${this.rootIndex}_${this.subIndex}`;
                this.$message({
                  type: "success",
                  shwoClose: true,
                  message: "添加制度分类成功"
                });
                this.createFormDialogVisible = false;
                this.selectAllByCatalogType();
              } else {
                this.$message({
                  type: "error",
                  shwoClose: true,
                  message: "添加失败"
                });
              }
            });
          }
        });
      },
      editMycatalog(index, subIndex) {
        console.log(index, subIndex);
        this.$prompt("请输入新分类名", "提示", {
          inputValue: this.catalogArr[index].children[subIndex].label,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({value}) => {
            if (value.length === 0) {
              value = "未命名分类";
            }
            this.$http({
              url: this.$api.institution.editCompanyCatalog,
              method: "post",
              params: {
                catalogId: this.catalogArr[index].children[subIndex].id,
                userId: this.userInfo.id,
                catalogName: value
              }
            }).then(res => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                this.selectAllByCatalogType();
                this.$message({
                  message: "修改成功",
                  shwoClose: true,
                  type: "success"
                });
              } else {
                this.$message({
                  type: "error",
                  shwoClose: true,
                  message: "更新失败"
                });
              }
            });
          })
          .catch(err => {
            // console.log(err);
            // this.$message({
            //   type: "info",
            //   message: "取消输入"
            // });
          });
      },
      deleteMyCatalog(index, subIndex) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: this.$api.institution.deleteCompanyCatalog,
              method: "post",
              params: {
                catalogId: this.catalogArr[index].children[subIndex].id,
                userId: this.userInfo.id
              }
            }).then(res => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                this.selectAllByCatalogType();
                this.$message({
                  message: "删除成功",
                  shwoClose: true,
                  type: "success"
                });
              } else {
                this.$message({
                  type: "error",
                  shwoClose: true,
                  message: "删除失败"
                });
              }
            });
          })
          .catch(() => {
          });
      },
      openPdf(name, url) {
        this.pdfName = name;
        this.pdfUrl = url;
      },
      querySearchAsync(string, cb) {
        if (string) {
          var results = string
            ? this.queryArr.filter(this.createStateFilter(string))
            : this.queryArr;
          cb(results);
        } else {
          const result = [];
          cb(result);
        }
      },
      createStateFilter(string) {
        return state => {
          // console.log(state.label)
          return state.value.toLowerCase().indexOf(string.toLowerCase()) != -1;
        };
      },
      handleSearchSelect(e) {
        console.log(e.rootIndex);
        this.rootIndex = e.rootIndex + 1;
        if (e.subIndex === "") {
          this.subIndex = "";
        } else {
          this.subIndex = e.subIndex + 1;
        }
        this.activeIndex = this.rootIndex + "_" + this.subIndex;
        this.selectAllForCompanyCatalog(this.catalogId);
      },
      keywordHighlight(item) {
        let index = item.value
          .toLowerCase()
          .indexOf(this.something.toLowerCase());
        if (index < 0) {
          return item.value;
        } else {
          console.log(
            "filter:",
            item.value.substr(0, index) /
            item.value.substr(index, this.something.length) /
            item.value.substr(this.something.length + 1, item.value.length)
          );
          let html = `${item.value.substring(
            0,
            index
          )}<span style="color:#ffb148">${item.value.substr(
            index,
            this.something.length
          )}</span>${item.value.substr(index + this.something.length)}`;
          return html;
        }
      }
    },
    computed: {
      rootLabel() {
        // console.log("test:", this.catalogArr[this.rootIndex-1]);
        if (!this.catalogArr[this.rootIndex - 1]) return "";
        return this.catalogArr[this.rootIndex - 1].label
          ? this.catalogArr[this.rootIndex - 1].label
          : "";
      },
      subLabel() {
        if (!this.catalogArr[this.rootIndex - 1] || !this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]) {
          return "";
        }
        if (this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]) {
          return this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1].label ? this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]
            .label : "";
        } else {
          return "";
        }
      },
      catalogId() {
        if (this.catalogArr.length <= 0) return "0";
        if (this.subIndex.length <= 0) {
          return this.catalogArr[this.rootIndex - 1].id;
        }
        return this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1].id;
      }
    }
  };
</script>
<style lang="scss">
  #regulation-manage {
    min-height: 600px;
    width: 100%;
    .box-card {
      min-height: 785px;
      margin-bottom: 20px;
      iframe {
        height: 700px;
      }
      .uploader {
        width: 100%;
      }
      .el-upload {
        width: 100%;
      }
      .el-uploader-dragger {
        width: 100%;
      }
      .item {
        padding: 15px 10px;
        border-bottom: 1px solid #f0f1f5;
        .searchbox {
          width: 100%;
          .el-input-group__prepend {
            background: #fff;
            i {
              color: #ffb148;
            }
          }
        }
      }
      .empty {
        width: 100%;
        height: 500px;
      }
      .menu.el-menu {
        border: none;
      }

      .el-menu-item {
        font-size: 16px;
      }
      .el-menu-item,
      .el-submenu__title {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        .num {
          color: #aeaeae;
          font-size: 12px;
        }
      }
    }
    .el-menu {
      .el-button--primary {
        margin-left: -20px;
        width: 240px;
        margin-bottom: 20px;
        span {
          color: #fff !important;
        }
        i {
          color: #fff !important;
        }
      }
      .el-submenu__title {
        background-color: #fff;
        z-index: 10;
      }
      .el-submenu {
        span {
          font-size: 16px;
        }
        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 1px;
          background: #e3e3e3;
        }
        .el-menu-item {
          &.is-active {
            span {
              color: #ffb148;
            }
          }
          span {
            color: #8d8d8d;
            font-size: 14px;
            .num {
              font-size: 12px;
            }
          }
        }
      }
    }
    .regulation-list li {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      border: solid 1px #ebeef5;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #f9f9f9;
        .btn-group {
          visibility: visible;
        }
      }
      .text {
        flex: 1;
        h4 {
          margin: 6px 0;
        }
        p {
          color: #aeaeae;
          font-size: 12px;
          font-weight: 400;
        }
      }
      .btn-group {
        visibility: hidden;
        color: #aeaeae;
        font-size: 12px;
      }
      .el-button--text {
        color: #aeaeae;
        font-size: 12px !important;
        &:hover {
          color: #a1a1a1;
        }
      }
    }
    .el-card__header {
      margin: 0 15px;
      padding: 18px 0;
    }
    .card-header {
      display: flex;
      align-items: center;
    }
    .card-header h4 {
      flex: 1;
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      .badge {
        display: inline-block;
        padding: 2px 4px;
        font-size: 10px;
        font-weight: 400;
        border-radius: 4px;
        color: #fff;
        transform: scale(0.8);
        &.required {
          background-color: #ff7b35;
        }
        &.optional {
          background-color: #6ddc6e;
        }
      }
    }
    .has-hover-btn {
      display: flex;
      &:hover {
        .hover-btn {
          visibility: visible;
        }
      }
      .hover-btn {
        margin-left: 0;
        visibility: hidden;
      }
      .hover-btn i {
        color: #ffb148;
      }
    }

  }
</style>
