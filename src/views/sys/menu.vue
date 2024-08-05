<template>
  <div>
    <!-- 搜索栏 -->
    <!-- <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.name"
            placeholder="用户名"
            clearable
          />
          <el-input
            v-model="searchModel.account"
            placeholder="账号"
            clearable
          />
          <el-select v-model="searchModel.status" placeholder="请选择状态">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="searchModel.mobile"
            placeholder="电话"
            clearable
          />
          <el-button type="primary" round icon="el-icon-search" @click="getMenuTreeAll">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openEditUI(null)" />
        </el-col>
      </el-row>
    </el-card> -->

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%" row-key="id" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <!-- <el-table-column label="菜单" width="60" /> -->
        <!-- <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.page - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="菜单名称" width="160" />
        <!-- <el-table-column prop="icon" label="图标" width="80" /> -->
        <el-table-column prop="icon" label="图标" width="100">
          <template slot-scope="scope">
            <!-- <span style="background-color:'';display: inline-block;padding: 2px;"> -->
            <SvgIcon :icon-class="scope.row.icon" />
            <!-- </span> -->
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <!-- <el-table-column prop="id" label="菜单id" width="80" /> -->
        <!-- <el-table-column prop="pid" label="菜单上级id" width="100" /> -->
        <el-table-column prop="status" label="菜单状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="菜单类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0">板块</el-tag>
            <el-tag v-else-if="scope.row.type == 1" type="success">模块</el-tag>
            <el-tag v-else-if="scope.row.type == 2" type="warning">功能</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="identification" label="权限标识" width="120" /> -->
        <!-- <el-table-column prop="memo" label="描述" /> -->
        <el-table-column prop="url" label="组件路由" width="180" />
        <el-table-column prop="created_at" label="创建时间" />
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="openEditUI(scope.row.id)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteUser(scope.row)" />
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <!-- <el-pagination
      :current-page="searchModel.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <!-- 用户信息编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="clearForm"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="rules">
        <el-form-item
          label="用户名"
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
        <el-form-item label="用户状态" :label-width="formLabelWidth">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
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
  </div>
</template>

<script>
import menuApi from "@/api/menu";
// import menuApi from "@/api/user";
import SvgIcon from '@/components/SvgIcon/index.vue';
export default {
  components: {
    SvgIcon,
  },
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
          value: -1,
          label: '不限'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],
      formLabelWidth: "130px",
      userForm: {},
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        page: 1,
        pageSize: 5,
      },
      userList: [],
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
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
    // this.getMenuTreeAll();
  },
  methods: {
    // 修改启用状态
    changeStatus(e) {
      console.log(e, 'status')
      const status = e ? '启用' : '禁用'
      this.$confirm(`您确认${status}用户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.userForm, 'this.userForm');
          menuApi.updateUserStatus(this.userForm).then((response) => {
            this.$message({
              type: "success",
              // message: response.msg,
              message: status + '成功',
            });
            // this.getMenuTreeAll();
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
          menuApi.deleteUserById(user.id).then((response) => {
            this.$message({
              type: "success",
              // message: response.msg,
              message: '删除成功',
            });
            this.getMenuTreeAll();
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
          menuApi.saveUser(this.userForm).then((response) => {
            // 成功提示
            this.$message({
              // message: response.msg,
              message: this.userForm.id ? '修改成功' : '添加成功',
              type: "success",
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格
            this.getMenuTreeAll();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
      this.userForm = {};
      this.$refs.userFormRef.clearValidate();
    },
    openEditUI(id) {
      this.userForm = {};
      if (id == null) {
        this.title = "新增用户";
      } else {
        this.title = "修改用户";
        // 根据id查询用户数据！！后端
        // menuApi.getUserById(id).then((response) => {
        //   this.userForm = response.data;
        // });
        // 根据分页筛选
        this.userForm = this.userList.filter((item) => item.id === id)[0];
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getMenuTreeAll();
    },
    handleCurrentChange(page) {
      this.searchModel.page = page;
      this.getMenuTreeAll();
    },
    getMenuTreeAll() {
      console.log(this.searchModel, 'this.searchModel');
      menuApi.getMenuTreeAll(this.searchModel).then((response) => {
        //
        this.userList = response.data;
        this.total = response.data.total;
      });
    },
  }
};
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>

<!-- [
  {
    "id": 1,
    "pid": 0,
    "status": 1,
    "type": 0,
    "code": "A01",
    "name": "基础管理",
    "sort": 0,
    "children": [
      {
        "id": 2,
        "pid": 1,
        "status": 1,
        "type": 1,
        "code": "A0102",
        "name": "用户管理",
        "identification": null,
        "sort": 2,
        "children": []
      },
      {
        "id": 6,
        "pid": 1,
        "status": 1,
        "type": 0,
        "code": "A0101",
        "name": "菜单管理",
        "sort": 1,
        "children": []
      }
    ]
  },
  {
    "id": 3,
    "pid": 0,
    "status": 1,
    "type": 0,
    "code": "B01",
    "name": "会员管理",
    "sort": 0,
    "children": [
      {
        "id": 4,
        "pid": 3,
        "status": 1,
        "type": 1,
        "code": "B0101",
        "name": "会员列表",
        "sort": 0,
        "children": [
          {
            "id": 5,
            "pid": 4,
            "status": 1,
            "type": 1,
            "code": "B010101",
            "name": "车辆进出记录",
            "sort": 0,
            "children": []
          }
        ]
      }
    ]
  }
] -->
