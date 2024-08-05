<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="22">
          <el-input
            v-model="searchModel.search_key.account"
            placeholder="账号"
            clearable
            @clear="searchModel.search_key.account = ''"
          />
          <el-input v-model="searchModel.search_key.name" placeholder="用户名称" clearable @clear="searchModel.search_key.name = ''" />
          <!-- <el-input
            v-model="searchModel.status"
            placeholder="状态"
            clearable
          /> -->
          <el-select v-model="searchModel.search_key.status" placeholder="请选择状态" clearable @clear="searchModel.search_key.status = null">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="searchModel.search_key.mobile" placeholder="手机号" clearable @clear="searchModel.search_key.mobile = ''" />
          <el-input v-model="searchModel.search_key.memo" placeholder="备注" clearable @clear="searchModel.search_key.memo = ''" />
          <el-date-picker
            v-model="searchModel.search_key.created_at"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="创建开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <el-date-picker
            v-model="searchModel.search_key.updated_at"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="更新开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
          <!-- <el-input
            v-model="searchModel.memo"
            placeholder="备注"
            clearable
          /> -->
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getUserList"
          >查询</el-button>
          <el-button
            icon="el-icon-refresh"
            @click="clearSearchParams"
          >重置</el-button>
        </el-col>
        <el-col :span="2" align="right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="openEditUI(null)"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table
        :data="userList"
        stripe
        style="width: 100%"
        header-align="center"
      >
        <el-table-column label="序号" width="70">
          <template slot-scope="scope">
            <!-- (page-1) * pageSize + index + 1 -->
            {{
              (searchModel.page - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" width="100" />
        <el-table-column prop="name" label="用户名称" width="100" />

        <el-table-column prop="mobile" label="手机号" width="120" />
        <el-table-column prop="status" label="用户状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" />
        <!-- <el-table-column prop="name" label="权限" width="80"/> -->
        <el-table-column prop="created_at" label="创建日期" width="170" />
        <el-table-column prop="updated_at" label="更新日期" width="170" />
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope" width="220">
            <el-button
              type="text"
              @click="openEditMenu(scope.row.id)"
            >权限设置</el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="openEditUI(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleteUser(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="searchModel.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 用户信息编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="clearForm"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="account"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userForm.account" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-if="userForm.id == null || userForm.id == undefined"
          label="登录密码"
          prop="password"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="用户名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus"
          />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="userForm.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="memo" :label-width="formLabelWidth">
          <el-input v-model="userForm.memo" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 树形菜单 -->
    <el-dialog
      title="权限设置"
      :visible.sync="dialogMenuVisible"
      @close="clearMenu"
    >
      <el-tree
        ref="ruleTree"
        v-loading="ruleLoading"
        :data="menuList"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps"
        highlight-current
        @check-change="ruleChange"
      >
        <!-- <span class="custom-tree-node"
                  slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="isAllCheck(data)"
                    class="margin-left-10">
                <el-button type="text"
                          size="mini"
                          @click.stop="setCheckAll(data)">
                  全选
                </el-button>
              </span> -->
        <!-- </span> -->
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearMenuDialog">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userManage";
import menuApi from "@/api/menu";
// import userApi from "@/api/user";
export default {
  data() {
    // var checkaccount = (rule, value, callback) => {
    //   var reg =
    //     /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    //   if (!reg.test(value)) {
    //     return callback(new Error("邮箱格式错误"));
    //   }
    //   callback();
    // };
    return {
      status: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "禁用",
        },
      ],
      formLabelWidth: "130px",
      userForm: {},
      dialogFormVisible: false,
      dialogMenuVisible: false,
      parentIdArr: [],
      title: "",
      total: 0,
      searchModel: {
        page: 1,
        pageSize: 5,
        search_key: {
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      userList: [],
      // 总菜单
      menuList: [],
      // 用户id菜单
      userIdMenuList: [],
      // 菜单编辑
      dataForm: {
        userId: '',
        permissionList: []
        // roleIds: []
      },
      deletRules: [],
      actionItems: [],
      actionRules: {},
      ruleLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录初始密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        // status: [
        //   { required: true, message: "请", trigger: "blur" },
        //   { validator: checkaccount, trigger: "blur" },
        // ],
        // account: [
        //   { required: true, message: "请输入描述", trigger: "blur" },
        //   { validator: checkaccount, trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    // this.getUserList();
  },
  mounted() {
    if (!this.$store.state.user.menuList || this.$store.state.user.menuList.length === 0) {
      // this.getMenuTreeAll();
    } else {
      this.menuList = this.$store.state.user.menuList
    }
  },
  methods: {
    // 修改启用状态
    changeStatus(e) {
      if (!this.userForm.id) return
      console.log(e, "status");
      const status = e ? "启用" : "禁用";
      this.$confirm(`您确认${status}用户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.userForm, "this.userForm");
          userApi.updateUserStatus(this.userForm).then((response) => {
            this.$message({
              type: "success",
              // message: response.msg,
              message: status + "成功",
            });
            // this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已禁用用户",
          });
        });
    },
    deleteUser(user) {
      this.$confirm(`您确认删除用户 ${user.name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.deleteUserById(user.id).then((response) => {
            this.$message({
              type: "success",
              // message: response.msg,
              message: "删除成功",
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveUser() {
      // 触发表单验证
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          // 提交请求给后台
          userApi.saveUser(this.userForm).then((response) => {
            // 成功提示
            this.$message({
              // message: response.msg,
              message: this.userForm.id ? "修改成功" : "添加成功",
              type: "success",
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格
            this.getUserList();
          }).catch(() => {
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 确定权限
    saveMenu() {
      //
      console.log(this.dataForm.permissionList, 'this.dataForm.permissionList');
      this.dialogMenuVisible = false
      const params = { menu_ids: this.dataForm.permissionList, user_id: this.userForm.id }
      menuApi.updateUser(params).then((response) => {
        console.log(response.data);
        this.$message({
          type: "success",
          // message: response.msg,
          message: "修改成功",
        });
        // this.userList = response.data.data;
        // this.total = response.data.total;
      });
    },
    clearForm() {
      this.userForm = {};
      this.$refs.userFormRef.clearValidate();
    },
    // 取消权限菜单 对话框
    clearMenuDialog() {
      this.dialogMenuVisible = false
      // 清空
      if (this.$refs.ruleTree) {
        this.$refs.ruleTree.setCheckedKeys([]);
      }
      console.log('clearMenuDialog');
    },
    // 关闭权限菜单 对话框
    clearMenu() {
      // 清空
      console.log('clearMenu');
    },
    // 编辑菜单
    openEditMenu(id) {
      // this.getMenuTreeAll();
      this.userForm.id = id
      this.dialogMenuVisible = true;
      // 初始化
      if (this.$refs.ruleTree) {
        this.$refs.ruleTree.setCheckedKeys([]);
      }
      this.getUserMenu(id)
    },
    // 菜单回显
    openEditUI(id) {
      this.userForm = {};
      if (id == null) {
        this.title = "新增用户";
      } else {
        this.title = "修改用户";
        // 根据id查询用户数据！！后端
        // userApi.getUserById(id).then((response) => {
        //   this.userForm = response.data;
        // });
        // 根据分页筛选
        this.userForm = Object.assign({}, this.userList.filter((item) => item.id === id)[0]);
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(page) {
      this.searchModel.page = page;
      this.getUserList();
    },
    getUserList() {
      console.log(this.searchModel, "this.searchModel");
      userApi.getUserList(this.searchModel).then((response) => {
        //
        this.userList = response.data.data;
        this.total = response.data.total;
        const { current_page, data, last_page } = response.data;
        if (data.length === 0 && current_page > last_page) {
          this.searchModel.page = last_page
          userApi.getUserList(this.searchModel).then((response) => {
            this.userList = response.data.data;
            this.total = response.data.total;
          })
        }
      });
    },
    // 重置
    clearSearchParams() {
      this.searchModel = {
        page: 1,
        pageSize: 5,
        search_key: {
        }
      }
      this.getUserList()
    },
    // 请求菜单
    getMenuTreeAll() {
      console.log(this.searchModel, 'this.searchModel');
      this.ruleLoading = true
      menuApi.getMenuTreeAll(this.searchModel).then((response) => {
        //
        this.menuList = response.data;
        this.ruleLoading = false
        // this.total = response.data.total;
      });
    },
    // 根据id请求菜单
    getUserMenu(id) {
      this.ruleLoading = true
      menuApi.getUserMenuIds(id).then((response) => {
        this.userIdMenuList = response.data;
        console.log(this.userIdMenuList);
        // this.ruleLoading = false
        // this.total = response.data.total;
        if (response.data.length !== 0) {
          // menuApi.getMenuTreeUser().then((res) => {
          //   this.ruleLoading = false
          //   res.data.forEach(item => {
          //     this.collectIdsWithChildren(item, this.parentIdArr);
          //   });
          //   console.log(this.userIdMenuList, 'this.userIdMenuList');
          //   console.log(this.parentIdArr, 'this.parentIdArr');
          //   const newMenuList = this.userIdMenuList.filter(item => !this.parentIdArr.includes(item));
          //   console.log(newMenuList, 'newMenuList');
          //   // this.$refs.ruleTree.setCheckedKeys(this.userIdMenuList);
          //   this.$refs.ruleTree.setCheckedKeys(newMenuList);
          // })
          this.ruleLoading = false;
          this.menuList.forEach((item) => {
            this.collectIdsWithChildren(item, this.parentIdArr);
          });
          console.log(this.userIdMenuList, "this.userIdMenuList");
          console.log(this.parentIdArr, "this.parentIdArr");
          const newMenuList = this.userIdMenuList.filter(
            (item) => !this.parentIdArr.includes(item)
          );
          console.log(newMenuList, "newMenuList");
          // this.$refs.ruleTree.setCheckedKeys(this.userIdMenuList);
          this.$refs.ruleTree.setCheckedKeys(newMenuList);
        }
      });
    },
    collectIdsWithChildren(item, parentIdArr) {
      if (item.children && item.children.length > 0) {
        this.$set(parentIdArr, parentIdArr.length, item.id);
        item.children.forEach(child => {
          this.collectIdsWithChildren(child, parentIdArr);
        });
      }
    },
    ruleChange(node, check) {
      console.log(node, 'node');
      console.log(check, 'check');
      let myMenuList = this.dataForm.permissionList
      if (check) {
        myMenuList.push(node.id)
        myMenuList = [...new Set(myMenuList)]
      } else {
        // 获取选中的菜单的已选中的子级
        myMenuList.forEach((item, index) => {
          if (item === node.id) {
            myMenuList.splice(index, 1)
          }
        })
      }
      console.log(myMenuList, 'ids');
    }
  },
};
</script>

<style>
#search {
  display: flex;
  flex-wrap: wrap;
  .el-input {
    width: 200px;
    margin-right: 12px;
    margin-bottom: 12px;
  }
  .el-date-editor {
    margin-right: 15px;
    /* margin-bottom: 12px; */
  }
}
.el-dialog .el-input {
  width: 75%;
}
</style>

