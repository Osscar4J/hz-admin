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
      <el-form-item label="计费规则">
        <div class="policy">
            <div>
                路程成本价：<input type="number" v-model="entity.roadBasePrice" class="el-input__inner"> 元/公里，
                售价：<input type="number" v-model="entity.roadSellPrice" class="el-input__inner"> 元/公里，
                含基础路程：<input type="number" v-model="entity.baseDist" class="el-input__inner"> 公里。
            </div>
            <div>
                <span v-if="entity.baseDist > 0">超出{{entity.baseDist}}公里后，</span>
                每 <input type="number" v-model="entity.perDist" class="el-input__inner"> 公里增加 <input type="number" v-model="entity.stepHour" class="el-input__inner"> 工时。
            </div>
            <div>
                工时费成本价： <input type="number" v-model="entity.checkBasePrice" class="el-input__inner"> 元/工时，售价： <input type="number" v-model="entity.checkSellPrice" class="el-input__inner"> 元/工时，含基础工时： <input type="number" v-model="entity.baseHour" class="el-input__inner"> 工时，
                超出后每工时 <input type="number" v-model="entity.hourPrice" class="el-input__inner"> 元。
            </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CheckFeePolicyApi from '@/api/checkFeePolicy'

export default {
  name: 'checkFeePolicyEditor',
  data() {
    return {
        entity: {
          status: 0,
          roadBasePrice: 0,
          roadSellPrice: 0,
          baseDist: 0,
          perDist: 0,
          stepHour: 0,
          baseHour: 0,
          checkBasePrice: 0,
          checkSellPrice: 0,
          hourPrice: 0
        },
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      CheckFeePolicyApi.getInfo(id).then(res => {
        this.entity = res.content
        this.$hideLoading()
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      let res = await CheckFeePolicyApi.saveOrUpdate(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.policy {
  .el-input__inner {
    display: inline-block;
    width: 80px;
    text-align: center;
    height: 34px;
    line-height: 34px;
  }
}
</style>
