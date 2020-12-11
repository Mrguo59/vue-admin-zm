<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0px">
      <el-table-column prop="serNum" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img :src="scope.row.logo" alt="" class="trademart-img" />
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
    <el-pagination
      layout="prev, pager, next,jumper,sizes,total"
      :total="50"
      :page-sizes="[3, 6, 9]"
      :page-size="3"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [
        {
          serNum: 1,
          name: "iphone",
          logo:
            "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2340886709,253774581&fm=26&gp=0.jpg",
        },
      ],
    };
  },
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