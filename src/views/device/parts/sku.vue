<template>
  <div class="app-container">
    <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="addCate">新增类别</el-button>
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
                        <el-button type="text" class="text-red" @click="removeById(subScope.row.id)">删除</el-button>
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
                <el-button type="text" class="text-red" @click="removeById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog title="属性" :visible.sync="skuFormVisible" width="500px">
        <el-form :model="sku">
            <el-form-item label="类别" label-width="120px">
                <div>{{parentSku.name}}</div>
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="sku.name" autocomplete="off" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="120px">
                <el-input v-model="sku.amount" autocomplete="off" maxlength="9"></el-input>
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
import SkuApi from '@/api/sku'

export default {
  name: 'parts',
  data() {
    return {
        entity: {},
        tableData: [],
        skuFormVisible: false,
        parentSku: {},
        sku: {},
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      PartsApi.getInfo(id).then(res => {
        this.entity = res.content
        if (this.entity.covers) {
          this.images = this.entity.covers.map(f => f.fileUrl)
        }
        if (this.entity.brands) {
          this.selectedBrands = this.entity.brands.map(b => b.id)
        }
      })
        this.getSkus(id)
    }
  },
  methods: {
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

    removeById(id) {
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

    getSkus(id) {
        SkuApi.getByParts(id).then(res => {
            this.tableData = res.content
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
