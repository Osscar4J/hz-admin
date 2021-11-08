<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="entity.name" maxlength="255" />
      </el-form-item>
      <el-form-item label="所在地区">
        <div>{{ entity.city }}</div>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="entity.address" maxlength="255" />
      </el-form-item>
      <el-form-item label="经纬度">
        <div class="lonlat">
          <div class="item">
            <el-input v-model="entity.longitude" type="number" placeholder="经度" />
          </div>
          <div class="splitor"> - </div>
          <div class="item">
            <el-input v-model="entity.latitude" type="number" placeholder="纬度" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="结账周期">
        <el-radio-group v-model="entity.accountPeriod">
          <el-radio label="一个月" :value="1" />
          <el-radio label="三个月" :value="3" />
          <el-radio label="半年" :value="6" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="认证">
        <div>
          <el-tag v-if="entity.authed == 1" type="success">已认证（单位）</el-tag>
          <el-tag v-else-if="entity.authed == 2" type="success">已认证（个人）</el-tag>
          <el-tag v-else type="info">未认证</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="注册时间">
        <div>{{ new Date(entity.createTime).Format('yyyy/MM/dd hh:mm') }}</div>
      </el-form-item>
      <el-form-item label="管理员">
        <div v-if="entity.manager">
          <div>姓名：{{entity.manager.name}}</div>
          <div>电话：{{entity.manager.phone}}</div>
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
import OrgAPi from '@/api/org'

export default {
  name: 'orgEditor',
  data() {
    return {
        entity: {}
    }
  },
  mounted() {
    OrgAPi.getInfo(this.$route.query.id).then(res => {
      this.entity = res.content
    })
  },
  methods: {
    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      let res = await OrgAPi.updateById(this.entity)
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
.lonlat {
  display: flex;
  width: 350px;
  &>.item {
    flex: 1;
  }
  .splitor {
    padding: 0 10px;
  }
}
</style>
