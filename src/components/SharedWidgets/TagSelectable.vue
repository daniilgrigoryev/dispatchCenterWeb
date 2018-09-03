<template>
  <div>
    <div class="dc-tag-selectable" v-on:click="selectTag(tag)"
         :style="selected && {'background-color': tag.color}"
         title="Щелкните для переключения выделения">
      <div class="dc-tag-selectable__selectbox" :class="{ 'is-selected': selected }"></div>
      <div class="dc-tag-selectable__caption">{{tag.caption}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tag-selectable",
    props: {
      tag: Object
    },
    data() {
      return {
        selected: this.tag.selected
      }
    },
    methods: {
      selectTag: function (tag) {
        tag.selected = !tag.selected;
        this.selected = tag.selected;
      }
    }
  }
</script>

<style lang="scss">
  .dc-tag-selectable {
    display: inline-flex;
    align-items: center;
    padding: 4px 5px 5px 5px;
    margin-right: 10px;
    border-radius: 15px;
    background: #7e8c91;
    line-height: 1;
    color: black;
    cursor: pointer;
    user-select: none;
  }

  .dc-tag-selectable__selectbox {
    $size: 17px;
    width: $size;
    height: $size;
    margin-right: 5px;
    border-radius: 100%;
    background: #28282e no-repeat center;
    background-size: 75%;

    &.is-selected {
      background-image: url('../../assets/img/icon-tag-checked.svg');
    }
  }

  .dc-tag-selectable__caption {
    line-height: 1;
    font-size: 11px;
  }
</style>
