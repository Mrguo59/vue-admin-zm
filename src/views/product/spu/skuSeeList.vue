<template>
  <el-dialog
    :title="`${spu.spuName} => SKU列表`"
    :visible.sync="dialogTableVisible"
  >
    <el-table :data="SeeList" v-loading="loading">
      <el-table-column
        property="skuName"
        label="名称"
        width="150"
      ></el-table-column>
      <el-table-column
        property="price"
        label="价格(元)"
        width="200"
      ></el-table-column>
      <el-table-column property="weight" label="重量(KG)"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row }">
          <img
            style="width: 100px; height: 100px"
            :src="row.skuDefaultImg"
            :alt="row.skuDefaultImg"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: "SkuSeeList",
  data() {
    return {
      spu: {},
      SeeList: [],
      dialogTableVisible: false,
      loading: false,
    };
  },
  methods: {
    async ejectSku(SeeItem) {
      this.loading = true;
      this.dialogTableVisible = true;
      this.spu = SeeItem;
      const result = await this.$API.sku.findBySpuId(SeeItem.id);
      if (result.code === 200) {
        this.SeeList = result.data;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
  },
  mounted() {
    this.$bus.$on("ejectSku", this.ejectSku);
  },
};
</script>

<style lang="less" scoped>
</style>
