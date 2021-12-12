<template>
  <div class="app-container">
    <el-form ref="form" :model="entity" label-width="120px">
      <el-form-item label="订单名称">
        <div>{{entity.name}}</div>
      </el-form-item>
      <el-form-item label="状态">
        <div>
            <el-tag v-if="entity.status == 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="entity.status == 1">进行中</el-tag>
            <el-tag v-else-if="entity.status == 2" type="danger">审核不通过</el-tag>
            <div v-else-if="entity.status == 3">
                <i v-if="entity.confirmed == 0" class="el-icon-warning-outline text-red" title="待客户确认"></i>
                <i v-else-if="entity.confirmed == 1" class="el-icon-circle-check text-green" title="客户已确认"></i>
                <el-tag type="success"> 已完成 </el-tag>
            </div>
            <el-tag v-else-if="entity.status == 4" type="warning">已取消</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="发布人">
        <div v-if="entity.creator">{{ entity.creator.name }} （{{entity.creator.phone}}）</div>
      </el-form-item>
      <el-form-item label="单位名称">
        <div>{{entity.orgName}}</div>
      </el-form-item>
      <el-form-item label="提交时间">
        <div>{{new Date(entity.createTime).Format('yyyy/MM/dd hh:mm')}}</div>
      </el-form-item>
      <el-form-item label="实付金额">
        <div>￥{{entity.fee}}</div>
      </el-form-item>
      <el-form-item label="上门费">
        <div>￥{{entity.checkFee}}</div>
      </el-form-item>

      <el-form-item label="维修员">
        <div v-if="entity.deviceOrder && entity.deviceOrder.repairUserId != 0">
            <span>{{entity.deviceOrder.repairUserName}}（{{entity.deviceOrder.repairUserPhone}}）</span>
        </div>
        <div>
            <el-button type="success" size="mini" @click="repairMenVisible = true">更换维修员</el-button>
        </div>
      </el-form-item>

      <el-form-item label="问题描述">
          <div v-if="entity.deviceOrder">
            <div>{{entity.deviceOrder.description || '暂无描述'}}</div>
            <div>
                <div class="auth-images">
                  <viewer :images="images">
                    <div v-for="item in images" :key="item.id">
                        <img :src="item.fileUrl" preview-text="" class="f-csp">
                    </div>
                  </viewer>
                </div>
                <div class="clear-both"></div>
                <div class="auth-images" v-if="videos.length > 0">
                    <div class="text-gray">视频</div>
                    <div v-for="item in videos" :key="item.id">
                        <video :src="item.fileUrl" controls style="height:180px;"></video>
                    </div>
                </div>
                <div class="clear-both"></div>
            </div>
            <div class="text-gray">配件列表</div>
            <div class="margin-top-sm parts-list" v-if="entity.deviceOrder.parts.length > 0">
                <div class="f-df" v-for="item in entity.deviceOrder.parts" :key="item.id">
                    <div class="f-flex1 margin-top-sm">
                      <div>{{item.name}} × {{item.amount}}</div>
                      <div v-if="item.skus && item.skus.length > 0">
                        <el-tag type="info" v-for="sku in item.skus" :key="sku.id" size="mini">{{sku.name}}</el-tag>
                      </div>
                      <div>
                        <span class="text-gray" style="font-size:12px;">单价：</span>
                        <span class="text-green">￥{{item.price}} <span v-if="item.priceType == 2" class="text-red">（面议）</span> </span>
                      </div>
                      <div v-if="item.priceType == 2">
                        <div class="text-gray" v-if="item.priceContent">
                          <pre style="margin:0;">{{item.priceContent}}</pre>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray">无</div>
          </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>

    </el-form>

    <el-dialog title="选择维修员" :visible.sync="repairMenVisible">
      <el-table :data="repairMen">
        <el-table-column property="date" label="头像" width="150">
          <template slot-scope="scope">
            <div class="cover">
              <img :src="scope.row.avatar" style="width: 60px; max-height: 100px">
            </div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="phone" label="电话"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.workStatus == 0" size="small" type="success">空闲</el-tag>
              <el-tag v-else-if="scope.row.workStatus == 1" size="small" type="danger">忙碌</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button v-if="entity.deviceOrder && entity.deviceOrder.repairUserId != scope.row.id" type="text" @click="changeRepairMan(scope.row)">选择</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import OrderAPi from '@/api/order'
import RepairManApi from '@/api/repairMan'

export default {
  name: 'orderEditor',
  data() {
    return {
        entity: {},
        images: [],
        videos: [],
        repairMenVisible: false,
        repairMen: []
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      OrderAPi.getInfo(this.$route.query.id).then(res => {
          if (res.content.deviceOrder) {
              this.images = res.content.deviceOrder.files.filter(f => f.type == 1)
              this.videos = res.content.deviceOrder.files.filter(f => f.type == 2)
          }
          this.entity = res.content
          this.getRepairMen(this.entity.groupId)
      })
    },

    onCancel() {
      this.$router.back()
    },

    async onSubmit() {
      let res = await OrderAPi.updateById(this.entity)
      if (res.code == 0){
        this.$message.success('修改成功')
        this.onCancel()
      } else {
        this.$message.error(res.msg)
      }
    },

    changeRepairMan(repairMan) {
      this.$confirm('确定要更换为 ' + repairMan.name + ' 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async value => {
        let res = await OrderAPi.changeRepairMan(this.entity.id, repairMan.id)
        if (res.code == 0) {
          this.repairMenVisible = false
          this.$message.success('已更换维修员')
          this.getInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    getRepairMen(groupId) {
      RepairManApi.getPage({
        pageable: 0,
        groupId: groupId,
      }).then(res => {
        this.repairMen = (res.content.records || []).filter(v => v.id != this.entity.deviceOrder.repairUserId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.parts-list {
  .f-flex1 {
    padding: 10px 0;
    &>div {
      line-height: 170%;
      .el-tag {
        margin-right: 10px;
      }
    }
  }
  .f-df+.f-df {
    border-top: 1px solid #f1f1f1;
  }
}
</style>
