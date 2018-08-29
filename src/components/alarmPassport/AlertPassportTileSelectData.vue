<template>
  <div>
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
      </div>

      <div class="dc-widget-grid__item__header__right-column">
        <div class="dc-widget-grid__item__header__buttons">

          <el-tooltip class="item" effect="dark" content="Раскрыть на весь экран" placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-zoomin-small-white.svg" alt="">
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Меню операций" placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-burger-small-white.svg" alt="">
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!--/Хедер тайла-->

    <!-- Выбор тегов -->
    <div class="dc-inner-tile-box bg-transparent py3 mt-neg6">
      <div class="dc-alert-passport__selected-tags-number">
        выбрано: <span class="active">{{ selectedTags.length }}</span> из <span>{{ tags.length }}</span>
      </div>
    </div>

    <div class="dc-alert-passport__selected-tags-wrapper dc-inner-tile-box bg-transparent py3">
      <div v-for="(tag, index) in tags" @click="selectsTag(tag)">
        <tag-selectable :tag="tag"></tag-selectable>
      </div>
    </div>
    <!-- /Выбор тегов -->

    <button :class="['dc-alert-passport__fab', {'active': selectedTags.length > 0}]"
            title="Фильтр по выделенным">
    </button>
  </div>
</template>

<script>
  import TagSelectable from "../SharedWidgets/TagSelectable";
  import * as funcUtils from "../../assets/js/utils/funcUtils";

  export default {
    name: "alert-passport-tile-select-data",
    components: {
      TagSelectable,
    },
    props: {
      title: String,
    },
    data() {
      return {
        // Список тайлов виджетов для грида макета
        selectedTags: [],
      };
    },
    computed: {
      tags: function () {
        let res = [];
        let data = this.$store.state.alarmViewData.data;
        if (data) {
          let methods = data.modelMethods;
          if (funcUtils.isNotEmpty(methods)) {
            methods.forEach((method) => {
              if (funcUtils.isUndefined(method.selected)) {
                method.selected = false;
              }
              method.caption = method.descr;
              method.id = funcUtils.guid();
              res.push(method);
            });
          }
        }
        return res;
      }
    },
    methods: {
      selectsTag: function (tag) {
        if (!tag.selected) {
          let index = this.selectedTags.indexOf(tag.id);
          if (index !== -1) {
            this.selectedTags.splice(index, 1);
          }
        } else {
          this.selectedTags.push(tag.id);
        }
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

  .dc-alert-passport__selected-tags-number {
    font-size: 14px;
    line-height: 1;

    span {
      font-size: 110%;
      font-weight: 500;

      &.active {
        color: #0068ff;
      }
    }
  }

  .dc-alert-passport__selected-tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    line-height: 2.2;
  }

  .dc-alert-passport__fab {
    $size: 54px;
    $offset: 15px;
    position: absolute;
    left: $offset;
    bottom: $offset;
    width: $size;
    height: $size;
    border-radius: 100%;
    background: rgba(114, 135, 165, 0.46) url('../../assets/img/icon-graph-bars-gray.svg') no-repeat center;
    background-size: 16px;

    &.active {
      background-color: #ff6600;
      background-image: url('../../assets/img/icon-graph-bars-white.svg');
    }
  }

</style>
