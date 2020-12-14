<template>
  <div>
    <!-- 当isShowAttr为false的时候，就需要禁用三级分类列表，传给Category组件 -->
    <Category
      @attrList="attrList"
      :disabled="!isShowAttr"
      @switchClear="switchClear"
    />
    <el-card style="margin-top: 20px" v-show="isShowAttr">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        :disabled="!category.category3Id"
        @click="switchAttr"
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
          <!-- 结构出来一个row，row就是当前行数据 -->
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
              @click="delAttr(row)"
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        @click="addAttr"
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
          <!-- 结构出row, $index，row就是当前行数据，$index就是当前数据的下标 -->
          <template v-slot="{ row, $index }">
            <!--
              事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
             -->
            <el-input
              ref="input"
              v-if="row.edit"
              v-model="row.valueName"
              @blur="enterInput(row, $index)"
              @keyup.enter.native="enterInput(row, $index)"
              size="mini"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              @click="switchInput(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 文档有问题：onConfirm -->
            <el-popconfirm
              :title="`确认要删除${row.valueName}吗`"
              @onConfirm="delAttrVal($index)"
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
      <el-button type="primary" @click="preAttr">保存</el-button>
      <el-button @click="isShowAttr = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

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
      category: {
        // 代表三个分类id数据
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //请求属性列表数据函数
    async attrList({ category1Id, category2Id, category3Id }) {
      //把category1Id, category2Id, category3Id存到data的category属性中，将来让preAttr函数使用
      this.category = { category1Id, category2Id, category3Id };
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
    // 显示添加属性列表
    switchAttr() {
      this.isShowAttr = false;
      //切换到添加属性页面，把attr.attrName及attr.attrValueList清空
      (this.attr.attrName = ""), (this.attr.attrValueList = []);
    },
    //删除属性函数
    delAttr(row) {
      console.log(row.id);
      this.$API.attrs.deleteAttr(row.id);
    },
    //清除tableAttrList数据及改变添加按钮的状态
    switchClear() {
      // 禁用按钮
      this.category.category3Id = "";
      // 清空数据
      this.tableAttrList = [];
    },

    //点击切换到添加属性页面，并传row
    jumpAttr(row) {
      this.isShowAttr = false;
      // 为了防止attr变化时直接修改原数据
      // 深度克隆：防止对象中对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(row));
    },
    //点击的时候把span切换成input输入框，并获取焦点
    switchInput(row) {
      //给attrValueList添加一个新属性edit
      this.$set(row, "edit", true);
      //获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //当失去焦点或者按下enter键触发
    enterInput(row, index) {
      //判断当前文本框内是否有内容，如果没有，找到下标为index的，删除掉
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      //当失去焦点或者按下enter键，切换为span
      row.edit = false;
    },
    //点击添加新属性按钮触发
    addAttr() {
      //往attrValueList里添加一个新对象（新数据），对象里有属性edit，从而可以显示input输入框
      this.attr.attrValueList.push({ edit: true });
      //获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //点击删除按钮的确定时触发
    delAttrVal(index) {
      //找到下标为index的，删除掉
      this.attr.attrValueList.splice(index, 1);
    },
    //当前及保存的时候触发
    async preAttr() {
      //判断是否有id，如果有，说明是修改，如果没有说明是添加
      const isAdd = !!this.attr.id;
      //请求需要的参数
      const attr = this.attr;
      //如果没有id，就需要在请求参数里添加categoryId和categoryLevel
      if (!isAdd) {
        attr.categoryId = this.category.category3Id;
        attr.categoryLevel = 3;
      }
      //发送请求
      const result = await this.$API.attrs.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("更新属性成功");
        //成功了以后，切换回属性列表页面
        this.isShowAttr = true;
        //发送请求，重新更新数据
        this.attrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    //让Category组件触发
    this.$bus.$on("attrList", this.attrList);
    this.$bus.$on("switchClear", this.switchClear);
  },
  beforeDestroy() {
    this.$bus.$off("attrList", this.attrList);
    this.$bus.$off("switchClear", this.switchClear);
  },
  components: {
    Category,
  },
};
</script>
