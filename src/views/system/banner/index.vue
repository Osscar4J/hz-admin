<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="发布状态">
          <el-select v-model="reqvo.status" placeholder="选择发布状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="reqvo.pos" placeholder="选择位置" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="开机广告" value="WELCOM" />
            <el-option label="首页" value="HOME" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="text-right" style="margin-bottom:15px;">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/system/banners/editor')">新增</el-button>
    </div>
    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="封面">
        <template slot-scope="scope">
          <div class="cover">
              <viewer :images="[scope.row.cover]">
                <img :src="scope.row.cover">
              </viewer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column label="位置" align="center">
        <template slot-scope="scope">
          <div>
              <span v-if="scope.row.pos == 'WELCOM'">开机广告</span>
              <span v-else-if="scope.row.pos == 'HOME'">首页</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sortNo"></el-table-column>
      <el-table-column class-name="status-col" label="发布状态" width="110" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="updateEntity(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="$router.push('/system/banners/editor?id=' + scope.row.id)">修改</el-button>
          <el-button type="text" class="text-red" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
import BannerApi from '@/api/banner'

export default {
  name: 'banners',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null,
            pos: null
        },
        data: {},
        dataLoading: true
    }
  },
  mounted() {
    this.getPage(1)
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await BannerApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    updateEntity(entity) {
        BannerApi.saveOrUpdate({
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

    removeById(id) {
        this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
            BannerApi.removeById(id).then(res => {
                if (res.code == 0) {
                    this.getPage(1)
                    this.$message.success('删除成功')
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
        height: 100px;
    }
}
</style>
