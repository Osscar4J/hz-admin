<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="myAvatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item> 控制台 </el-dropdown-item>
          </router-link>
          <a @click="passwordFormVisible = true">
            <el-dropdown-item> 修改密码 </el-dropdown-item>
          </a>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="passwordFormVisible" width="500px">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="请输入旧密码" prop="oldPwd">
          <el-input type="password" v-model="form.oldPwd" autocomplete="off" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPwd">
          <el-input type="password" v-model="form.newPwd" autocomplete="off" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="reNewPwdRule">
          <el-input type="password" v-model="reNewPwd" autocomplete="off" maxlength="18"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import defaultAvatar from '@/assets/images/avatar.jpg'
import UserApi from '@/api/user'

export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    const validateRePwd = (rule, value, callback) => {
      if (this.reNewPwd != this.form.newPwd){
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }

    return {
      passwordFormVisible: false,
      reNewPwd: '',
      form: {
        oldPwd: '',
        newPwd: ''
      },
      formRules: {
        oldPwd: [{ required: true, trigger: 'blur', validator: validatePwd }],
        newPwd: [{ required: true, trigger: 'blur', validator: validatePwd }],
        reNewPwdRule: [{ required: true, trigger: 'blur', validator: validateRePwd }]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    myAvatar() {
      if (!this.avatar) {
        return defaultAvatar
      }
      return this.avatar
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async resetPassword() {
      this.$refs.form.validate( async valid => {
        if (valid) {
          let res = await UserApi.updatePassword({
            newPwd: this.$md5(this.form.newPwd),
            oldPwd: this.$md5(this.form.oldPwd)
          })
          if (res.code == 0) {
            this.$message.success('修改成功')
            this.passwordFormVisible = false
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
