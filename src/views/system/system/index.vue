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
        <el-form-item>
          <el-button type="primary" @click="getPage(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="dataLoading"
      :data="data.records"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column label="排序" align="center" width="150" prop="sortNo"></el-table-column>
      <el-table-column class-name="status-col" label="发布状态" width="110" align="center">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="updateEntity(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="KEY" align="center" prop="dKey"></el-table-column>
      <el-table-column label="内容" align="left">
        <template slot-scope="scope">
          <pre>{{scope.row.dValue}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="entity = scope.row; dictEditorVisible = true">修改</el-button>
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

    <el-dialog
      title="编辑"
      :visible.sync="dictEditorVisible"
      width="40%">
      <div>
        <div>{{entity.name}}</div>
        <div class="margin-top">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="entity.dValue" maxlength="250"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dictEditorVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateEntity(entity)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SystemDictApi from '@/api/systemDict'

export default {
  name: 'systemDict',
  data() {
    return {
        reqvo: {
            current: 1,
            size: 10,
            status: null,
            pos: null
        },
        data: {},
        dataLoading: true,
        entity: {},
        dictEditorVisible: false,
    }
  },
  mounted() {
    this.getPage(1)
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await SystemDictApi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    updateEntity(entity) {
        SystemDictApi.update(entity).then(res => {
            if (res.code != 0) {
                this.$message.error(res.msg)
            } else {
              this.getPage()
              this.$message.success('更新成功')
            }
            if (this.dictEditorVisible == true) {
              this.dictEditorVisible = false
            }
        })
    },
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
