<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="名称" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="reqvo.status" placeholder="选择发布状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="reqvo.classifyId" placeholder="选择类型" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-checkbox v-model="reqvo.isTop" :true-label="1" :false-label="null" @change="getPage(1)">只看置顶</el-checkbox>
      </div>
    </div>

    <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="entityEditor({})">新增</el-button>
    </div>
    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="getSortPage"
    >
      <el-table-column align="center" label="封面" width="180">
        <template slot-scope="scope">
          <div class="cover">
            <img :src="scope.row.avatar">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name" width="180"></el-table-column>
      <el-table-column label="价格" align="left" width="120">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.priceType==1" :class="{ 'text-green': scope.row.sellPrice > scope.row.basePrice, 'text-red': scope.row.sellPrice < scope.row.basePrice }">销售价：{{scope.row.sellPrice}}</div>
            <div v-else class="text-blue">销售价：面议</div>
            <div>成本价：{{scope.row.basePrice}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览量" prop="partsView" width="100" sortable="custom"></el-table-column>
      <el-table-column label="所属分类" align="center" width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.classify">{{scope.row.classify.name}}</div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="updateEntity(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否置顶" width="100" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.isTop" :active-value="1" :inactive-value="0" @change="updateTop(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="left">
        <template slot-scope="scope">
          <pre>{{scope.row.description}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-edit" @click="$router.push('/device/parts/editor?id=' + scope.row.id)">修改</el-button> -->
          <el-button type="text" icon="el-icon-edit" @click="entityEditor(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-coin" @click="skuEditor(scope.row)">库存</el-button>
          <el-button v-if="scope.row.status == 0" type="text" class="text-red" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="page">
        <el-pagination 
            :current-page="reqvo.current" 
            background 
            layout="prev, pager, next" 
            :total="data.total" 
            :hide-on-single-page="true" 
            :page-size="reqvo.size"
            @current-change="getPage">
        </el-pagination>
    </div>

    <el-dialog
      title="编辑配件"
      :visible.sync="editorVisible"
      width="80%">
      <div v-if="entity" class="editor">
        <el-form ref="form" :model="entity" label-width="120px">
          <el-form-item label="封面" required>
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <img v-if="entity.avatar" :src="entity.avatar" class="cover">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="margin-top">
              <el-progress v-show="percentage > 0 && percentage < 100" :stroke-width="16" :text-inside="true" :percentage="percentage"></el-progress>
            </div>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="entity.name" maxlength="255" />
          </el-form-item>
          <el-form-item label="发布状态">
            <el-switch 
              active-color="#13ce66" 
              v-model="entity.status" 
              :active-value="1" 
              :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-switch 
              active-color="#13ce66" 
              v-model="entity.isTop" 
              :active-value="1" 
              :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="成本价" required>
            <el-input v-model="entity.basePrice" maxlength="32" type="number" />
          </el-form-item>
          <el-form-item label="价格类型" required>
            <el-radio v-model="entity.priceType" :label="1">固定金额</el-radio>
            <el-radio v-model="entity.priceType" :label="2">面议</el-radio>
          </el-form-item>
          <el-form-item label="销售价" required v-if="entity.priceType == 1">
            <el-input v-model="entity.sellPrice" maxlength="32" type="number" />
          </el-form-item>
          <el-form-item label="所属分类" required>
            <el-select v-model="entity.classifyId" placeholder="选择分类">
              <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" required>
            <el-select v-model="selectedBrands" multiple placeholder="选择品牌">
              <el-option v-for="item in brands" :label="item.name" :value="item.id" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="图集">
            <div class="images">
              <div class="img" v-for="item in images" :key="item">
                <div class="close" @click="removeImage(item)">×</div>
                <img :src="item">
              </div>
              <div class="img">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeImageUpload">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
            <div class="margin-top clear-both">
              <el-progress v-show="percentage2 > 0 && percentage2 < 100" :stroke-width="16" :text-inside="true" :percentage="percentage2"></el-progress>
            </div>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="entity.description" maxlength="200" type="textarea" placeholder="简介" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="库存"
      :visible.sync="skuVisible"
      width="80%">
      <div v-if="entity" class="sku-editor">
        <div class="f-df" style="margin-bottom:15px; line-height:40px;">
            <div class="f-flex1">{{entity.name}}</div>
        </div>
        <div>
            站点：
            <el-select v-model="groupId" placeholder="选择站点" @change="getSkus()">
                <el-option label="总部" :value="null" />
                <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id" />
            </el-select>
            <el-button type="primary" icon="el-icon-plus" @click="addCate" style="margin-left: 15px;">新增类别</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%; margin-top: 20px">
          <el-table-column prop="name" label="类别" align="center"></el-table-column>
          <el-table-column prop="skus" label="属性" width="1000">
              <template slot-scope="scope">
                <el-table
                    :data="scope.row.skus"
                    border
                    style="width: 100%;">
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="amount" label="数量"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="subScope">
                            <el-button type="text" @click="addNewSku(scope.row, subScope.row)">修改</el-button>
                            <el-button type="text" class="text-red" @click="removeSkuById(subScope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <el-button type="text" @click="addNewSku(scope.row)">新增</el-button>
                </div>
              </template>
          </el-table-column>
          <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateCate(scope.row)">修改</el-button>
                    <el-button type="text" class="text-red" @click="removeSkuById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="margin-top text-gray">
            总计：{{total}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="属性" :visible.sync="skuFormVisible" width="500px">
        <el-form :model="sku">
            <el-form-item label="类别" label-width="120px">
                <div>{{parentSku.name}}</div>
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="sku.name" autocomplete="off" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="120px">
                <el-input v-model="sku.amount" autocomplete="off" maxlength="9" type="number"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="skuFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSku">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import PartsApi from '@/api/parts'
import ClassifyApi from '@/api/classify'
import FileApi from '@/api/file'
import Constants from '@/constants'
import BrandApi from '@/api/brand'
import SkuApi from '@/api/sku'
import GroupApi from '@/api/group'

export default {
  name: 'parts',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null,
            classifyId: null,
            brandId: null,
            isTop: null,
            orderBy: 'id',
            order: 'desc',
        },
        data: {},
        dataLoading: true,
        editorVisible: false,
        entity: null,
        percentage: 0,
        percentage2: 0,
        classifies: [],
        brands: [],
        selectedBrands: [],
        images: [],
        // 库存管理
        skuVisible: false,
        tableData: [],
        skuFormVisible: false,
        parentSku: {},
        sku: {},
        groupId: null,
        groups: [], // 站点列表
        total: 0,
    }
  },
  mounted() {
    this.getPage(1)
    this.getClassifies()
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await PartsApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    entityEditor(entity) {
      if (this.brands.length == 0) {
        this.getBrands()
      }
      if (entity.id) {
        this.$showLoading()
        PartsApi.getInfo(entity.id).then(res => {
          this.entity = res.content
          if (this.entity.covers) {
            this.images = this.entity.covers.map(f => f.fileUrl)
          }
          if (this.entity.brands) {
            this.selectedBrands = this.entity.brands.map(b => b.id)
          }
          this.$hideLoading()
          this.editorVisible = true
        })
      } else { // 新增
        this.entity = {priceType: 1}
        this.editorVisible = true
      }
    },

    skuEditor(entity) {
      if (this.groups.length == 0) {
        this.getGroups()
      }
      this.$showLoading()
      PartsApi.getInfo(entity.id).then(res => {
        this.entity = res.content
        if (this.entity.covers) {
          this.images = this.entity.covers.map(f => f.fileUrl)
        }
        if (this.entity.brands) {
          this.selectedBrands = this.entity.brands.map(b => b.id)
        }
        this.$hideLoading()
        this.skuVisible = true
      })
      this.getSkus(entity.id)
    },

    updateCate(sku) {
        this.$prompt('请输入类别名称', '类别', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: sku.name,
        }).then(({value}) => {
            SkuApi.saveOrUpdate({
                name: value,
                partsId: this.entity.id,
                status: 1,
                id: sku.id
            }).then(res => {
                if (res.code == 0) {
                    this.getSkus(this.entity.id)
                } else {
                    this.$message.error(res.msg)
                }
            })
        })
      },

    addCate() {
        this.$prompt('请输入类别名称', '类别', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(({value}) => {
            SkuApi.saveOrUpdate({
                name: value,
                partsId: this.entity.id,
                groupId: this.groupId,
                status: 1
            }).then(res => {
                if (res.code == 0) {
                    this.getSkus(this.entity.id)
                } else {
                    this.$message.error(res.msg)
                }
            })
        })
    },

    saveSku() {
        SkuApi.saveOrUpdate({
            partsId: this.entity.id,
            parentId: this.parentSku.id,
            groupId: this.groupId,
            name: this.sku.name,
            amount: this.sku.amount,
            id: this.sku.id
        }).then(res => {
            if (res.code == 0) {
                this.skuFormVisible = false
                this.getSkus(this.entity.id)
            } else {
                this.$message.error(res.msg)
            }
        })
    },

    addNewSku(parentSku, sku) {
        this.parentSku = parentSku
        this.sku = sku || {}
        this.skuFormVisible = true
    },

    getGroups() {
        GroupApi.getPage({
            pageable: 0
        }).then(res => {
            this.groups = res.content.records || []
        })
    },

    getSkus(id) {
      id = id || this.entity.id
      SkuApi.getByParts(id, this.groupId).then(res => {
          this.tableData = res.content
          let total = 0
          res.content.forEach(s => {
              s.skus.forEach(ss => {
                  total += ss.amount
              })
          })
          this.total = total
      })
    },

    getSortPage(e) {
      if (e.order) {
        this.reqvo.orderBy = e.prop
        this.reqvo.order = e.order == 'descending' ? 'desc' : 'asc'
      } else {
        this.reqvo.orderBy = null
        this.reqvo.order = null
      }
      this.getPage(1)
      return false
    },

    updateTop(entity) {
      PartsApi.saveOrUpdate({
          id: entity.id,
          isTop: entity.isTop
      }).then(res => {
          if (res.code != 0) {
              this.$message.error(res.msg)
          } else {
              this.$message.success('更新成功')
          }
      })
    },

    updateEntity(entity) {
        PartsApi.saveOrUpdate({
            id: entity.id,
            status: entity.status
        }).then(res => {
            if (res.code != 0) {
                this.$message.error(res.msg)
            } else {
                this.$message.success('更新成功')
            }
        })
    },

    removeSkuById(id) {
        this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
          SkuApi.removeById(id).then(res => {
              if (res.code == 0) {
                  this.getSkus(this.entity.id)
                  this.$message.success('删除成功')
              } else {
                  this.$message.error(res.msg)
              }
          })
      })
    },

    removeById(id) {
        this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
          PartsApi.removeById(id).then(res => {
              if (res.code == 0) {
                  this.getPage(1)
                  this.$message.success('删除成功')
              } else {
                  this.$message.error(res.msg)
              }
          })
      })
    },

    getClassifies() {
      ClassifyApi.getPage({
        pageable: 0,
        type: 1,
        status: 1
      }).then(res => {
        this.classifies = res.content.records || []
      })
    },

    getBrands() {
      BrandApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.brands = res.content.records || []
      })
    },

    async onSubmit() {
      if (this.selectedBrands.length > 0) {
        this.entity.brands = this.selectedBrands.map(id => {
          return {
            id: id
          }
        })
      }
      if (this.images.length > 0) {
        this.entity.covers = this.images.map((f, i) => {
          return {
            fileUrl: f,
            sortNo: i + 1
          }
        })
      }
      let res = await PartsApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.getPage()
        this.$message.success('保存成功')
        this.editorVisible = false
      } else {
        this.$message.error(res.msg)
      }
    },

    removeImage(fileUrl) {
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] == fileUrl) {
          FileApi.deleteFile(fileUrl)
          this.images.splice(i, 1)
          break
        }
      }
    },

    beforeAvatarUpload(e) {
      let fileUrl = 'parts/cover/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage = parseInt(n * 100)
          if (this.percentage >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              if (this.entity.avatar) {
                FileApi.deleteFile(this.entity.avatar)
              }
              this.$set(this.entity, 'avatar', Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },

    beforeImageUpload(e) {
      let fileUrl = 'parts/cover/'+new Date().getTime() + e.name.substr(e.name.indexOf('.'))
      FileApi.upload({
        filename: fileUrl,
        file: e,
        progress: async (n) => {
          this.percentage2 = parseInt(n * 100)
          if (this.percentage2 >= 100) {
            setTimeout(async () => {
              await FileApi.publicRead(fileUrl)
              this.images = this.images.concat(Constants.OSS_URL + fileUrl)
            }, 100)
          }
        }
      })
      return false
    },
  }
}
</script>

<style lang="scss" scoped>
.cover {
    img {
        height: 100px;
    }
}
.editor {
  .cover {
    max-height: 200px;
  }
  .avatar-uploader {
    .el-upload {
      .el-icon-plus {
        border: 1px dashed #d9d9d9;
      }
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .images {
    .img {
      float: left;
      position: relative;
      margin-right: 15px;
      margin-bottom: 15px;
      &>img {
        height: 178px;
      }
      &>.close {
        position: absolute;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        background: #000000;
        opacity: .4;
        color: #ffffff;
        right: -10px;
        top: -10px;
        cursor: pointer;
        &:hover {
          color: brown;
        }
      }
    }
  }
}
</style>
