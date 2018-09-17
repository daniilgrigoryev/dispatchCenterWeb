<template>
  <div v-if="model !== null">
    <div
      :class="{bold: isFolder}"
      @click="toggle">
      {{ model.data.tableElement.caption }}
      <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <div style="padding-left: 20px">
      <div v-for="(field, ind) in model.data.tableElement.fields">
        <button @click="onFieldSelect(model.data, field)" type="button">{{field.description}}</button>
      </div>
    </div>
    <div v-show="open" v-if="isFolder">
      <tree-node
        style="padding-left: 40px"
        class="item"
        v-for="(modelChild, index) in model.children"
        :key="index"
        :model="modelChild">
      </tree-node>
    </div>
  </div>
</template>

<script>
  import { bus } from "../../assets/js/utils/bus";

  export default {
    name: "TreeNode",
    props: {
      model: Object
    },
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children && this.model.children.length > 0
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      onFieldSelect: function (tableElementExt, fieldElement) {
        bus.$emit('onFieldSelect', {
          tableElementExt: tableElementExt,
          fieldElement: fieldElement
        });
      }
    }
  }
</script>

<style scoped>
  .item {
    cursor: pointer;
  }
  .bold {
    font-weight: bold;
  }
</style>
