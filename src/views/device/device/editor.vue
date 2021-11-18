<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
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

      <el-form-item label="品牌" required>
        <el-select v-model="selectedBrands" multiple placeholder="选择品牌">
          <el-option v-for="item in brands" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="所属分类" required>
        <el-select v-model="entity.classifyId" placeholder="选择分类">
          <el-option label="无" value="0" />
          <el-option v-for="item in classifies" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="简介" required>
        <el-input v-model="entity.description" maxlength="255" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DeviceApi from '@/api/device'
import BrandApi from '@/api/brand'
import ClassifyApi from '@/api/classify'

export default {
  name: 'deviceEditor',
  data() {
    return {
        entity: {
          status: 0
        },
        classifies: [],
        brands: [],
        selectedBrands: [],
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      DeviceApi.getInfo(id).then(res => {
        this.entity = res.content
        if (this.entity.brands) {
          this.selectedBrands = this.entity.brands.map(b => b.id)
        }
        this.$hideLoading()
      })
    }
    this.getBrands()
    this.getClassifies()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      if (this.selectedBrands.length > 0) {
        this.entity.brands = this.selectedBrands.map(id => {
          return {
            id: id
          }
        })
      }
      let res = await DeviceApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    getClassifies() {
      ClassifyApi.getPage({
        pageable: 0,
        type: 3,
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
    }
  }
}
</script>

