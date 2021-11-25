<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="reqvo.phone" placeholder="手机号" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="reqvo.orgName" placeholder="输入单位名称关键词" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="reqvo.roleId" placeholder="选择角色" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in roles" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/users/repairManEditor')">新增维修员</el-button>
      </div>
    </div>

    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="头像" width="80">
        <template slot-scope="scope">
          <div class="cover">
            <img :src="scope.row.avatar">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="80">
        <template slot-scope="scope">
          <span> {{ scope.row.name }} </span>
          <transition name="el-zoom-in-center">
            <span v-if="del" class="el-icon-delete text-red f-csp" @click="delUserFarewell(scope.row.id)"></span>
          </transition>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender == 0 ? '女' : ( scope.row.gender == 1 ? '男' : '未知' ) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="210">
        <template slot-scope="scope">
          <div v-if="scope.row.roles">
            <span>{{scope.row.roles.map(v => v.name).join(' / ')}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.org">{{scope.row.org.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="left">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <div v-if="isRepairMan(scope.row)">
            <el-button type="text" icon="el-icon-edit" @click="$router.push('/users/repairManEditor?id=' + scope.row.id)">修改</el-button>
            <el-button type="text" icon="el-icon-warning-outline" @click="resetPwd(scope.row.id)">重置密码</el-button>
            <el-button type="text" class="text-red" icon="el-icon-delete" @click="delUserFarewell(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UserAPi from '@/api/user'
import RoleApi from '@/api/role'

export default {
  name: 'users',
  data() {
    return {
      reqvo: {
        current: 1,
        phone: '',
        orgName: ''
      },
      del: false,
      data: {},
      dataLoading: true,
      catchedKeys: '',
      delKey: 'deleteuser',
      roles: []
    }
  },
  beforeDestroy() {
    window.document.onkeydown = null
  },
  mounted() {
    this.getPage(1)
    this.getRoles()
    window.document.onkeydown = e => {
      this.catchedKeys += e.key
      if (this.delKey.indexOf(this.catchedKeys) == 0) {
        if (this.delKey == this.catchedKeys) {
          this.del = true
        }
      } else {
        this.catchedKeys = ''
        this.del = false
      }
    }
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await UserAPi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    delUserFarewell(id) {
      this.$confirm('确定删除吗（将删除所有相关数据且无法恢复）？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        UserAPi.deleteUserFarewell(id).then(res => {
          if (res.code == 0) {
            this.$message.success('删除成功')
            this.getPage()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(res => {})
    },

    isRepairMan(entity) {
      if (!entity.roles || entity.roles.length == 0)
        return false
      for (let role of entity.roles) {
        if (role.id == 4) {
          return true
        }
      }
      return false
    },

    getRoles() {
      RoleApi.getPage({
        pageable: 0
      }).then(res => {
        this.roles = res.content.records || []
      })
    },

    resetPwd(userId) {
      this.$prompt('输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        UserAPi.resetPassword(userId, this.$md5(value)).then(res => {
          if (res.code == 0) {
            this.$message.success('已重置密码')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
    img {
        height: 60px;
    }
}
</style>
