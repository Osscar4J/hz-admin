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

      <el-form-item label="设备" required>
        <el-select v-model="entity.deviceId" placeholder="选择所属设备">
          <el-option :value="null" label="无" />
          <el-option v-for="item in devices" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="品牌" required>
        <el-select v-model="entity.brandId" placeholder="选择所属品牌">
          <el-option :value="null" label="无" />
          <el-option v-for="item in brands" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="简介">
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
import DeviceModelApi from '@/api/deviceModel'
import DeviceApi from '@/api/device'
import BrandApi from '@/api/brand'

export default {
  name: 'deviceEditor',
  data() {
    return {
        entity: {
          status: 0
        },
        brands: [],
        devices: [],
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      DeviceModelApi.getInfo(id).then(res => {
        this.entity = res.content
      })
    }
    this.getBrands()
    this.getDevices()
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      if (!this.entity.deviceId) {
        this.$message.warning('请选择所属设备')
        return false
      }
      if (!this.entity.brandId) {
        this.$message.warning('请选择所属品牌')
        return false
      }
      let res = await DeviceModelApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    getBrands() {
      BrandApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.brands = res.content.records || []
      })
    },

    getDevices() {
      DeviceApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.devices = res.content.records || []
      })
    }
  }
}
</script>

