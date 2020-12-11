<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table
      :data="tradeMarkList"
      border
      style="width: 100%; margin: 20px 0px"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img :src="scope.row.logoUrl" alt="" class="trademart-img" />
        </template>
      </el-table-column>
      <el-table-column prop="operaTion" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
    };
  },
  methods: {
    // handleCurrentChange(page) {
    //   // console.log(page);
    //   // console.log(this.limit);
    //   this.repeatPagesList(page, this.limit);
    // },
    // handleSizeChange(limit) {
    //   // console.log(limit);
    //   this.repeatPagesList(this.page, limit);
    // },
    // 请求分页列表数据
    async repeatPagesList(page, limit) {
      const result = await this.$API.trademark.getPagesList(page, limit);

      // console.log(result);
      // console.log(this.page, this.limit);
      if (result.code === 200) {
        this.$message.success("获取品牌分页列表成功");
        this.tradeMarkList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },
  mounted() {
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
<style lang="sass">
.trademart-img
  width: 100px
  height: 60px
.el-pagination
  text-align: right
.el-pagination__jump
  margin-right: 320px
</style>