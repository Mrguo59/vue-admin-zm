<template>
  <div>
    <el-card style="margin-top: 20px">
      <!-- 触发switchModShow事件，传category3Id，spuUpdateList组件需要发请求的时候使用 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        :disabled="!category.category3Id"
        @click="$emit('switchModShow', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >
      <el-table :data="spuList" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="date"
          type="index"
          label="序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$emit('switchModSku', { ...row, ...category })"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('switchModShow', row)"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="$emit('switchModSee', row)"
            ></el-button>
            <el-popconfirm
              :title="`确认要删除${row.spuName}吗`"
              @onConfirm="delSpu(row)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next,jumper,sizes,total"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page.sync="page"
        :total="total"
        @current-change="repeatPagesList($event, limit)"
        @size-change="repeatPagesList(page, $event)"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
      spuList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        if (!category3Id) return;
        this.repeatPagesList(this.page, this.limit);
      },
      immediate: true, // 一上来触发一次
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    //删除SPU
    async delSpu(row) {
      const result = await this.$API.spu.deleteSpu(row.id);
      if (result.code === 200) {
        this.$message.success("删除SPU成功");
        this.repeatPagesList(this.page, this.limit);
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取SPU分页列表
    async repeatPagesList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.$message.success("获取SPU分页列表成功~");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      // console.log(result);
      this.loading = false;
    },
    // 当选中1级或2级分类触发
    clearList() {
      this.spuList = [];
      this.category.category3Id = "";
      this.page = 1;
      this.limit = 3;
      this.total = 0;
    },
  },
  mounted() {
    // //让Category组件触发
    // this.$bus.$on("attrList", this.handleCategory);
    // this.$bus.$on("switchClear", this.clearList);
  },
  beforeDestroy() {
    // // 通常情况下：清除绑定的全局事件
    // this.$bus.$off("attrList", this.handleCategory);
    // this.$bus.$off("switchClear", this.clearList);
  },
};
</script>

<style lang="sass" scoped>
</style>