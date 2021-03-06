<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="状态">
        <div>
          <el-tag v-if="entity.auth.status == 0">待审核</el-tag>
          <el-tag v-else-if="entity.auth.status == 1" type="success">已通过</el-tag>
          <el-tag v-else-if="entity.auth.status == 2" type="danger">已拒绝</el-tag>
        </div>
      </el-form-item>
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
          <div>{{entity.longitude}} - {{entity.latitude}}</div>
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
      <el-form-item label="维修站" required>
        <el-select v-model="entity.groupId" placeholder="选择维修站">
          <el-option v-for="item in groups" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="管理员">
        <div v-if="entity.manager">
          <div>姓名：{{entity.manager.name}}</div>
          <div>电话：{{entity.manager.phone}}</div>
        </div>
      </el-form-item>
      <el-form-item label="认证资料">
        <div v-if="entity.auth">
          <div v-if="entity.auth.source == 1">
            <div>
                <div>认证资料：</div>
                <div class="auth-images">
                  <viewer :images="entity.auth.files">
                    <div v-for="item in entity.auth.files" :key="item.id">
                        <img :src="item.fileUrl" preview-text="" class="f-csp">
                    </div>
                  </viewer>
                </div>
                <div class="clear-both"></div>
            </div>
            <div>
                <div>维保协议：</div>
              <div v-show="entity.auth.signPic">
                  <viewer :images="[entity.auth.signPic]">
                    <img :src="entity.auth.signPic" style="max-height: 150px" class="f-csp">
                  </viewer>
              </div>
            </div>
          </div>
          <div v-else> 继承上级单位 </div>
        </div>
      </el-form-item>

      <el-form-item v-if="entity.auth.status == 0">
        <el-button type="success" @click="checkAuth(1)">通过</el-button>
        <el-button type="danger" @click="checkAuth(2)">拒绝</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrgAPi from '@/api/org'
import FileApi from '@/api/file'
import GroupApi from '@/api/group'

export default {
  name: 'orgChecker',
  data() {
    return {
        entity: {
          auth: {
            status: -1
          }
        },
        groups: []
    }
  },
  mounted() {
    this.$showLoading()
    OrgAPi.getAuthInfo(this.$route.query.id).then(async res => {
      if (res.content.auth) {
        if (res.content.auth.signPic) {
            let fileRes = await FileApi.getFileAuth({ file: res.content.auth.signPic })
            res.content.auth.signPic = fileRes.content
        }
        
        if (res.content.auth.files) {
          for (let i = 0; i < res.content.auth.files.length; i++) {
            let file = res.content.auth.files[i]
            let fileRes = await FileApi.getFileAuth({ file: file.fileUrl })
            file.fileUrl = fileRes.content
          }
        }
      }
      this.entity = res.content
      this.$hideLoading()
    })
    this.getGroups()
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
    },

    checkAuth(status) {
      if (status == 1) {
        if (!this.entity.groupId) {
          this.$message.warning('请选择维修站')
          return false
        }

        this.$confirm('确定要通过该单位的认证吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OrgAPi.checkOrgAuth({
            orgId: this.entity.id,
            status: status,
            groupId: this.entity.groupId
          }).then(res => {
            if (res.code == 0){
              this.$message.success('审核通过')
              this.$router.back()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
      } else if (status == 2) {
        this.$prompt('请输入拒绝原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          OrgAPi.checkOrgAuth({
            orgId: this.entity.id,
            status: status,
            reason: value
          }).then(res => {
            if (res.code == 0){
              this.$message.success('已拒绝认证')
              this.$router.back()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
      }
    },

    getGroups() {
      GroupApi.getPage({
        pageable: 0,
        status: 1
      }).then(res => {
        this.groups = res.content.records || []
      })
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
.auth-images {
  &>div>div {
    height: 150px;
    margin-right: 15px;
    margin-bottom: 15px;
    float: left;
    &>img {
      height: 100%;
      border-radius: 10px;
    }
  }
}
</style>
