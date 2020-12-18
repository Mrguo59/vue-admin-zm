<template>
  <el-card>
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
          :disabled="disabled"
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
          :disabled="disabled"
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
          :disabled="disabled"
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      // category1List: [],
      // category2List: [],
      // category3List: [],
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
      Newcategory: (state) => state.category.category,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    ...mapMutations(["category/SET_CATEGORY3_ID"]),

    async handleSelectChange1(category1Id) {
      //当点击一级分类的时候，要把二级，三级分类id和数据清空
      this.category.category2Id = "";
      this.category.category3Id = "";

      this["category/getCategory2List"](category1Id);

      // // 清空父组件的数据
      // this.$bus.$emit("switchClear");
    },
    async handleSelectChange2(category2Id) {
      //当点击二级分类的时候，要把三级分类id和数据清空
      this.category.category3Id = "";

      this["category/getCategory3List"](category2Id);

      // // 清空父组件的数据
      // this.$bus.$emit("switchClear");
    },
    async handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
    },
  },
  async mounted() {
    this["category/getCategory1List"]();
    this.category = this.Newcategory;
  },
};
</script>

<style lang="less" scoped>
</style>
