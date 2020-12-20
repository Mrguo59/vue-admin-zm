<template>
  <el-card class="box-card">
    <el-table :data="allSkuListData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="190">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="190">
      </el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template v-slot="{ row }">
          <img
            style="width: 80px"
            :src="row.skuDefaultImg"
            :alt="row.skuDefaultImg"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="190">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{ row }">
          <el-button
            v-if="row.isSale == 1"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            @click="offSku(row.id)"
          ></el-button>
          <el-button
            v-if="row.isSale == 0"
            type="info"
            icon="el-icon-top"
            size="mini"
            @click="onSku(row.id)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="$emit('ejectDrawer', row.id)"
          ></el-button>
          <el-popconfirm
            :title="`确认要删除${row.skuName}吗`"
            @onConfirm="delSku(row)"
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
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      :page-size.sync="limit"
      :current-page="page"
      :total="total"
      @size-change="reqAllSkuList(1, $event)"
      @current-change="reqAllSkuList($event, limit)"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SkuAdmin",
  data() {
    return {
      allSkuListData: [],
      page: 1,
      limit: 10,
      total: 0,
      isOnSale: true,
    };
  },
  methods: {
    async reqAllSkuList(page, limit) {
      const result = await this.$API.sku.allSkuList({ page, limit });
      // console.log(result);
      if (result.code === 200) {
        this.allSkuListData = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error(result.message);
      }
    },
    //删除sku
    async delSku(row) {
      const result = await this.$API.sku.deleteSku(row.id);
      if (result.code === 200) {
        this.$message.success(`删除${row.skuName}成功`);
        this.reqAllSkuList(this.page, this.limit);
      } else {
        this.$message.error(result.message);
      }
    },

    //下架sku
    async offSku(skuId) {
      const result = await this.$API.sku.cancelSaleSku(skuId);
      if (result.code === 200) {
        this.$message.success("下架成功");
        this.isOnSale = false;
        this.reqAllSkuList(this.page, this.limit);
      } else {
        this.$message.error(result.message);
      }
    },
    //上架sku
    async onSku(skuId) {
      const result = await this.$API.sku.onSaleSku(skuId);
      if (result.code === 200) {
        this.$message.success("上架成功");
        this.isOnSale = true;
        this.reqAllSkuList(this.page, this.limit);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.reqAllSkuList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
>>>.el-button+.el-button
  margin-left: 0px
>>>.el-pagination
  margin-top: 20px
  margin-left: 50px
>>>.el-pagination__jump
  margin-right: 235px
</style>
