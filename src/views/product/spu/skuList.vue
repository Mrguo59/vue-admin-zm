<template>
  <el-card style="margin-top: 20px">
    <el-form ref="form" :model="sku" :rules="rules" label-width="80px">
      <el-form-item label="SPU名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <!-- v-model="num"  @change="handleChange"-->
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU价格"
          class="skulist-input-number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU重量"
          class="skulist-input-number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="SPU规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select"
          v-for="attr in tableAttrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请选择" v-model="spu.attrId">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select"
          v-for="sale in SpuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="attrValue in sale.spuSaleAttrValueList"
              :key="attrValue.id"
              :label="attrValue.saleAttrValueName"
              :value="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          ref="multipleTable"
          :data="spuImageList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('switchModSpu', spu.category3Id)"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SkuList",
  props: {
    skuItem: Object,
  },
  data() {
    return {
      spu: this.skuItem, // spu数据
      sku: {
        // sku数据
        skuName: "",
      },
      spuImageList: [], // 图片列表
      SpuSaleAttrList: [], // 销售属性数据
      tableAttrList: [], // 平台属性数据
      rules: {}, // 表单验证规则
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.spuImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取销售列表数据成功");
        this.SpuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    //请求平台属性列表数据函数
    async attrList() {
      //当点击三级分类的时候，要把属性列表数据清空
      // this.tableAttrList = [];
      //当点击三级分类的时候，去请求属性列表数据
      const result = await this.$API.attrs.attrInfoList(this.category);
      if (result.code === 200) {
        this.tableAttrList = result.data;
      }
    },
  },
  mounted() {
    this.attrList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="sass" scoped>
>>>.skulist-input-number
  width: 1050px
>>>.el-input-number .el-input__inner
  text-align: left
>>>.skulist-select
  display: inline-block
  margin-right: 20px
</style>
