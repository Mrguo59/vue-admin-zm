<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addBrand"
      >添加</el-button
    >
    <!--
      :count="count"
      v-bind:count="count" 单向数据流 / 强制绑定数据
        子组件只能读取不能修改
        问题：子组件需要修改数据
        解决：数据源在哪，更新数据的方法就定义在哪

      :count.sync="count" 给子组件传递xxx数据以及更新数据的方法update:xxx
        相当于：
          :count="count" @update:count="xxx"

        .sync用于父子通信（子向父）
     -->
    <!-- <Test :count="count" :updateCount="updateCount" /> -->
    <!-- <Test :count.sync="count" /> -->
    <el-table
      v-loading="loading"
      :data="tradeMarkList"
      border
      style="width: 100%; margin: 20px 0px"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img :src="scope.row.logoUrl" alt="" class="trademart-img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataBrand(scope.row, scope)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delBrand(scope.row.id, scope.row.tmName)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--
      :page-size.sync="limit"   可以让limit更新变成同步更新
      :current-page.sync="page" 可以让page更新变成同步更新

      $event
        1.  在DOM事件中代表 event
        <button @click="handle(123, $event)"></button>
        触发事件是浏览器的行为，所以$event代表event

        2. 在自定义事件中代表 第一个参数
          <button @aaa="handle($event)"></button>
          假设这样触发自定义事件： this.$emit('aaa', 123, 456);
          那么$event就为123（第一个参数）
    -->
    <!-- page-size.sync 如果传数据，只是传输数据，这样传，数据是只读的，不能被修改，加上sync以后，即会传数据，还会传更新数据的方法，这样一旦值发生变化，子组件内部就会调用更新数据的方法，去更新父组件的数据，导致外面的值也发生了变化，这样就可以让limit更新变成同步更新了 -->
    <el-pagination
      layout="prev, pager, next,jumper,sizes,total"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      :total="total"
      @current-change="repeatPagesList($event, limit)"
      @size-change="repeatPagesList(page, $event)"
    >
    </el-pagination>
    <!-- 加上.sync,就说明dialog这个子组件内部也会修改visible这个数据 -->
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--
            前提允许跨域
              action="http://182.92.128.115/admin/product/fileUpload"
              目标服务器地址: 代理配置中 (vue.config.js)

            不允许跨域，就使用proxy
              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tradeMarkList: [], // 所有数据
      page: 1, // 页码
      limit: 3, // 每页条数
      total: 0, // 总数
      loading: false,
      visible: false, // 对话框显示&隐藏
      trademarkForm: {
        // 表单数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 表单校验规则
        tmName: [
          {
            // 必填项
            required: true,
            // 错误信息
            message: "请输入活动名称",
            // 触发表单校验时机
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    //当点击页码的时候传入最新的参数，请求数据
    // handleCurrentChange(page) {
    //   // console.log(page);
    //   // console.log(this.limit);
    //   this.repeatPagesList(page, this.limit);
    // },
    //当点击每页多少条的时候传入最新的参数，请求数据
    // handleSizeChange(limit) {
    //   // console.log(limit);
    //   this.repeatPagesList(this.page, limit);
    // },
    // 请求分页列表数据
    async repeatPagesList(page, limit) {
      this.loading = true;
      const result = await this.$API.trademark.getPagesList(page, limit);

      // console.log(result);
      // console.log(this.page, this.limit);
      //如果code为200，代表请求成功
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        //更新data里的数据
        this.tradeMarkList = result.data.records;
        this.page = result.data.current; // 代表当前页码
        this.limit = result.data.size; // 代表每页显示的条数
        this.total = result.data.total; // 总数
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
      this.loading = false;
    },
    // 当点击确认的时候，会触发，提交表单
    submitForm(formName) {
      // 校验表单
      this.$refs[formName].validate(async (valid) => {
        // console.log(valid);
        //当校验通过的时候，valid才为ture
        if (valid) {
          const { trademarkForm } = this;
          // 代表是否是更新，!!代表强制转换为布尔值
          const isUpdata = !!trademarkForm.id;
          // console.log(isUpdata);
          // 如果是修改需要验证
          if (isUpdata) {
            const tm = this.tradeMarkList.find(
              (tm) => tm.id === trademarkForm.id
            );

            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交和之前相同的数据");
              return;
            }
          }

          // 表单校验通过,发送请求
          let result;
          //如果是修改，就发送修改的请求，否则发送添加的请求
          if (isUpdata) {
            result = await this.$API.trademark.updataPagesList(trademarkForm);
          } else {
            result = await this.$API.trademark.addPagesList(trademarkForm);
          }

          if (result.code === 200) {
            this.$message.success(`${isUpdata ? "修改" : "添加"}品牌数据成功`);
            this.visible = false; // 隐藏对话框
            this.repeatPagesList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res) {
      // console.log(res);
      this.trademarkForm.logoUrl = res.data; // 图片地址
    },
    //上次图片之前触发的回调
    beforeAvatarUpload(file) {
      // console.log(file);
      const ImgType = ["image/jpeg", "image/jpg", "image/png"];
      // 检测文件类型
      const fitImgType = ImgType.indexOf(file.type) > -1;
      // 检测文件大小
      const fitSize = file.size / 1024 < 50;

      if (!fitImgType) {
        this.$message.error("上传头像图片只能是jpeg/png/jpg格式!");
      }
      if (!fitSize) {
        this.$message.error("上传头像图片大小不能超过50kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return fitImgType && fitSize;
    },
    //添加弹框函数
    addBrand() {
      // 显示对话框
      this.visible = true;
      // 清空（从修改 - 添加要清空修改的数据）
      //把trademarkForm重新赋值为一个对象，对象里有tmName和logoUrl属性
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
      // 清空表单的校验,不点击添加按钮的时候，from组件不会渲染，就不能调用clearValidate方法，此时会报错，所以要先判断一下
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    //修改功能函数
    updataBrand(row) {
      // row 代表当前行的数据 {}
      // console.log(row, scope);
      // 显示对话框
      this.visible = true;
      this.trademarkForm = { ...row };
      // 清空表单的校验,不点击修改按钮的时候，from组件不会渲染，就不能调用clearValidate方法，此时会报错，所以要先判断一下
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    //删除功能函数
    async delBrand(id, tmName) {
      // console.log(id);
      this.$confirm(`您确定要删除${tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.delPagesList(id);
          if (result.code === 200) {
            this.$message.success("删除成功");
            this.repeatPagesList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
  mounted() {
    //一上来就发请求，渲染页面
    const { page, limit } = this;
    this.repeatPagesList(page, limit);
  },

  /*
  lang="less"
    完整写法
    深度选择器 /deep/
  lang="sass"
    可以省略 {}
    可以省略 ;
    深度选择器 /deep/  >>>
  lang="scss"
    完整写法

  lang="stylus"
    可以省略 {}
    可以省略 :
    可以省略 ;

  scoped
    让样式只在当前组件生效
    问题：加上scoped，会让设置的子组件样式失效
    解决：使用深度选择器
*/
};
</script>
<style lang="sass" scoped>
.trademart-img
  width: 100px
  height: 80px
.el-pagination
  text-align: right
>>>.el-pagination__jump
  margin-right: 320px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>