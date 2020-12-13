<template>
  <div>
    <Category @attrList="attrList" />
    <el-card style="margin-top: 20px" v-show="isShowAttr">
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px"
        >添加属性</el-button
      >
      <el-table :data="tableAttrList" border style="width: 100%">
        <el-table-column
          prop="date"
          type="index"
          label="序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="jumpAttr(row)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px" v-show="!isShowAttr">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px"
        >添加属性值</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column
          prop="date"
          type="index"
          label="序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="attrName" label="属性值名称">
          <template v-slot="{ row }">
            <span>{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";

export default {
  name: "AttrList",
  data() {
    return {
      tableAttrList: [],
      attr: {
        attrName: "",
        attrValueList: [],
      },
      isShowAttr: true,
    };
  },
  methods: {
    //请求属性列表数据函数
    async attrList({ category1Id, category2Id, category3Id }) {
      //当点击三级分类的时候，要把属性列表数据清空
      this.tableAttrList = [];
      //当点击三级分类的时候，去请求属性列表数据
      const result = await this.$API.attrs.attrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      if (result.code === 200) {
        this.tableAttrList = result.data;
      }
    },

    jumpAttr(row) {
      this.isShowAttr = false;
      this.attr = JSON.parse(JSON.stringify(row));
    },
  },
  components: {
    Category,
  },
};
</script>
