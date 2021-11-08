<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="名称">
        <div>{{entity.name}}</div>
      </el-form-item>
      <el-form-item label="所在地区">
        <div>{{ entity.city }}</div>
      </el-form-item>
      <el-form-item label="详细地址">
        <div>{{entity.address}}</div>
      </el-form-item>
      <el-form-item label="经纬度">
          <div>{{entity.latitude}} - {{entity.longitude}}</div>
      </el-form-item>
      <el-form-item label="结账周期">
          <div v-if="entity.accountPeriod == 1">一个月</div>
          <div v-else-if="entity.accountPeriod == 3">三个月</div>
          <div v-else-if="entity.accountPeriod == 6">半年</div>
          <div v-else>{{entity.accountPeriod}}个月</div>
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
      <el-form-item label="认证资料">
          <div>
              <div>认证资料：</div>
              <div v-show="entity.auth && entity.auth.files.length > 0">
                  <div v-for="item in entity.auth.files" :key="item.id">
                    <img :src="item.fileUrl" preview="1" preview-text="" style="max-height: 150px" class="f-csp">
                  </div>
              </div>
          </div>
          <div>
              <div>维保协议：</div>
            <div v-show="entity.auth && entity.auth.signPic">
                <img :src="entity.auth.signPic" preview="0" preview-text="维保协议" style="max-height: 150px" class="f-csp">
            </div>
          </div>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="onSubmit">通过</el-button>
        <el-button type="danger" @click="onSubmit">拒绝</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrgAPi from '@/api/org'
import FileApi from '@/api/file'

export default {
  name: 'orgChecker',
  data() {
    return {
        entity: {auth: {}}
    }
  },
  mounted() {
    OrgAPi.getAuthInfo(this.$route.query.id).then(async res => {
      console.log(res)
      if (res.content.auth && res.content.auth.signPic) {
          let fileRes = await FileApi.getFileAuth({ file: res.content.auth.signPic })
          res.content.auth.signPic = fileRes.content
      }
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
