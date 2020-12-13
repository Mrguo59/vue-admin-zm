<template>
  <el-card>
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
        >
          <el-option
            v-for="c1 in category1List"
            :label="c1.name"
            :value="c1.id"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleSelectChange2"
        >
          <el-option
            v-for="c2 in category2List"
            :label="c2.name"
            :value="c2.id"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleSelectChange3"
        >
          <el-option
            v-for="c3 in category3List"
            :label="c3.name"
            :value="c3.id"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    async handleSelectChange1(category1Id) {
      //当点击一级分类的时候，要把二级，三级分类id和数据清空
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      // console.log(category1Id);
      //当点击一级分类的时候，去请求二级分类数据
      const result = await this.$API.attrs.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    async handleSelectChange2(category2Id) {
      //当点击二级分类的时候，要把三级分类id和数据清空
      this.category.category3Id = "";
      this.category3List = [];
      //当点击二级分类的时候，去请求三级分类数据
      const result = await this.$API.attrs.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    async handleSelectChange3() {
      //当点击三级分类的时候，要把属性列表数据清空（在list组件）
      const { category1Id, category2Id, category3Id } = this.category;
      //当点击三级分类的时候，去请求属性列表数据（在list组件）
      this.$emit("attrList", { category1Id, category2Id, category3Id });
    },
  },
  async mounted() {
    const result = await this.$API.attrs.getCategory1();
    // console.log(result);
    if (result.code === 200) {
      this.category1List = result.data;
    }
  },
};
</script>

<style lang="less" scoped>
</style>
