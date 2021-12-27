<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="reqvo" class="demo-form-inline" onsubmit="return false">
        <el-form-item label="名称">
          <el-input v-model="reqvo.name" placeholder="订单名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="发布人姓名">
          <el-input v-model="reqvo.creatorName" placeholder="发布人姓名" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="reqvo.status" placeholder="选择订单状态" @change="getPage(1)">
            <el-option label="全部" :value="null" />
            <el-option label="待审核" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="审核不通过" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已取消" :value="4" />
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
       <el-table-column align="center" label="封面" width="100">
        <template slot-scope="scope">
          <div class="cover" v-if="scope.row.cover">
            <viewer :images="[scope.row.cover]">
                <img :src="scope.row.cover" class="f-csp">
            </viewer>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
            <i v-if="scope.row.type == 1" class="el-icon-s-cooperation text-blue" title="维修"></i>
            <i v-else-if="scope.row.type == 2" class="el-icon-goods text-red" title="配件"></i>
            {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="发布人" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.creator">
            <div>姓名：{{ scope.row.creator.name }}</div>
            <div>电话：{{ scope.row.creator.phone }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="单位" prop="orgName"></el-table-column>
      <el-table-column align="center" label="上门费" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.checkFee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="总金额" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.totalFee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额" width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.fee }}
          </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status == 1">进行中</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="danger">审核不通过</el-tag>
          <div v-else-if="scope.row.status == 3">
              <i v-if="scope.row.confirmed == 0" class="el-icon-warning-outline text-red" title="待客户确认"></i>
              <i v-else-if="scope.row.confirmed == 1" class="el-icon-circle-check text-green" title="客户已确认"></i>
              <el-tag type="success"> 已完成 </el-tag>
          </div>
          <el-tag v-else-if="scope.row.status == 4" type="warning">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维修员" width="140" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.state == 1">
              <div v-if="scope.row.deviceOrder">
                <div>{{scope.row.deviceOrder.repairUserName}}</div>
                <div>{{scope.row.deviceOrder.repairUserPhone}}</div>
              </div>
              <div v-else class="text-red">数据异常</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="140" align="center">
        <template slot-scope="scope">
          <span> {{ new Date(scope.row.createTime).Format('yyyy/MM/dd hh:mm') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" align="left">
        <template slot-scope="scope">
          <pre v-if="scope.row.deviceOrder">{{scope.row.deviceOrder.description}}</pre>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
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

    <el-dialog title="订单详情" :visible.sync="orderDetailVisible" width="60%">
      <el-form ref="form" :model="entity" label-width="120px" v-if="entity">
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
        <el-form-item label="上门费" v-if="entity.type == 1">
          <div>￥{{entity.checkFee}}</div>
        </el-form-item>
        <el-form-item label="配送费" v-else-if="entity.type == 2">
          <div>￥{{entity.checkFee}}</div>
        </el-form-item>

        <el-form-item label="维修员">
          <div v-if="entity.deviceOrder && entity.deviceOrder.repairUserId != 0">
              <span>{{entity.deviceOrder.repairUserName}}（{{entity.deviceOrder.repairUserPhone}}）</span>
          </div>
          <div v-if="entity.status == 0 || entity.status == 1">
              <el-button type="success" size="mini" @click="repairMenVisible = true">更换维修员</el-button>
          </div>
        </el-form-item>

        <el-form-item label="问题描述" v-if="entity.type == 1">
            <div v-if="entity.deviceOrder">
              <div>{{entity.deviceOrder.description || '暂无描述'}}</div>
              <div>
                  <div class="auth-images">
                    <viewer :images="images" :zIndex="999999">
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
              <div class="parts-list" v-if="entity.deviceOrder.parts.length > 0">
                  <div class="f-df" v-for="item in entity.deviceOrder.parts" :key="item.id">
                      <div class="f-flex1">
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
        <el-form-item label="备注" v-else-if="entity.type == 2">
            <div v-if="entity.deviceOrder">
              <div>{{entity.deviceOrder.description || '暂无'}}</div>
              <div class="text-gray">配件列表</div>
              <div class="parts-list" v-if="entity.deviceOrder.parts.length > 0">
                  <div class="f-df" v-for="item in entity.deviceOrder.parts" :key="item.id">
                      <div class="f-flex1">
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

      </el-form>
    </el-dialog>

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
  name: 'orders',
  data() {
    return {
        reqvo: {
            creatorName: '',
            current: 1,
            size: 10,
            status: null
        },
        data: {},
        dataLoading: true,
        entity: null,

        orderDetailVisible: false,
        images: [],
        videos: [],
        repairMenVisible: false,
        repairMen: [],
    }
  },
  created() {

  },
  mounted() {
    this.getPage(1)
  },
  methods: {
    async getPage(pageNo) {
      this.reqvo.current = pageNo || this.reqvo.current
      let res = await OrderAPi.getPage(this.reqvo)
      this.dataLoading = false
      this.data = res.content
    },

    getInfo(id) {
      return OrderAPi.getInfo(id).then(res => {
          if (res.content.deviceOrder) {
              this.images = res.content.deviceOrder.files.filter(f => f.type == 1)
              this.videos = res.content.deviceOrder.files.filter(f => f.type == 2)
          }
          this.entity = res.content
          this.getRepairMen(this.entity.groupId)
      })
    },

    showDetail(entity) {
      this.$showLoading()
      this.getInfo(entity.id).then(res => {
        this.$hideLoading()
        this.orderDetailVisible = true
      })
    },

    async onSubmit() {
      let res = await OrderAPi.updateById(this.entity)
      if (res.code == 0){
        this.getPage()
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
          this.getInfo(this.entity.id)
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
.cover {
    img {
        height: 60px;
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
