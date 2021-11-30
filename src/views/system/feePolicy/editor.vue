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
                <input type="number" v-model="entity.baseDist" class="el-input__inner"> 公里内
                售价：<input type="number" v-model="entity.roadSellPrice" class="el-input__inner"> 元/公里，
                超出后<input type="number" v-model="entity.roadPrice" class="el-input__inner"> 元/公里。
            </div>
            <div>
                <span v-if="entity.baseDist > 0">超出{{entity.baseDist}}公里后，</span>
                每 <input type="number" v-model="entity.perDist" class="el-input__inner"> 公里增加 <input type="number" v-model="entity.stepHour" class="el-input__inner"> 工时。
            </div>
            <div>
                工时费成本价： <input type="number" v-model="entity.checkBasePrice" class="el-input__inner"> 元/工时，
                <input type="number" v-model="entity.baseHour" class="el-input__inner"> 时内
                售价： <input type="number" v-model="entity.checkSellPrice" class="el-input__inner"> 元/时，
                超出后每工时 <input type="number" v-model="entity.hourPrice" class="el-input__inner"> 元。
            </div>
        </div>
      </el-form-item>

      <el-form-item label="是否优惠">
        <el-switch 
          active-color="#13ce66" 
          v-model="isDiscount" 
          :active-value="true" 
          :inactive-value="false"></el-switch>
      </el-form-item>

      <template v-if="isDiscount">
        <el-form-item label="优惠方式">
          <el-radio-group v-model="entity.dType">
            <el-radio :label="1" > 打折 </el-radio>
            <el-radio :label="2" > 金额 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠折扣(%)" v-show="entity.dType == 1">
          <el-input v-model="entity.discount" maxlength="4" type="number" placeholder="请输入0 - 100之间的数字" />
        </el-form-item>
        <el-form-item label="优惠金额" v-show="entity.dType == 2">
          <el-input v-model="entity.reducedFee" maxlength="4" type="number" placeholder="请输入优惠金额" />
        </el-form-item>
      </template>

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
          roadPrice: 0,
          checkBasePrice: 0,
          checkSellPrice: 0,
          hourPrice: 0,
          discount: 100,
          reducedFee: 0,
        },
        isDiscount: false, // 是否有优惠
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.$showLoading()
      CheckFeePolicyApi.getInfo(id).then(res => {
        this.entity = res.content
        this.isDiscount = this.entity.dType != 0
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
