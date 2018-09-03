<template>
  <!--Хедер экрана-->
  <el-header height="30" class="dc-page-header">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col
        :span="12"
        class="flex-parent flex-parent--center-cross">
        <h1>{{ title }}</h1>
        <!--<div class="dc-widget-item__caption" style="margin-left: 10px;">год 6 мес. 24 дня 6ч 11м</div>-->
      </el-col>
      <el-col :span="4" class="flex-parent flex-parent--end-main flex-parent--center-cross">
        <el-switch
          v-model="headerSwitch"
          active-color="#13ce66"
          inactive-color="#ff4949"
          class="dc-page-header__switch"
          style="margin-right: 10px;"
          title="Уведомления">
        </el-switch>


        <el-button size="mini" class="dc-button-icon-medium" title="Действие">
          <img src="../../assets/img/icon-reload-white.svg" alt="">
        </el-button>

        <el-button size="mini" class="dc-button-icon-medium" title="Действие">
          <img src="../../assets/img/icon-alarmclock-white.svg" alt="">
        </el-button>

        <el-popover
          placement="bottom"
          title="Title"
          width="200"
          trigger="click"
          content="this is content, this is content, this is content">
          <p>Are you sure to delete this?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">cancel</el-button>
            <el-button type="primary" size="mini" @click="visible2 = false">confirm</el-button>
          </div>
          <el-button slot="reference" size="mini" class="dc-button-icon-medium" title="Действие">
            <img src="../../assets/img/icon-burger-large-white.svg" alt="">
          </el-button>
        </el-popover>
      </el-col>
    </el-row>
  </el-header>
  <!--/Хедер экрана-->
</template>

<script>
  export default {
    name: "PageHeader",
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        headerSwitch: false,
        visible2: false
      }
    }
  }
</script>

<style lang="scss">
  $-dc-main-aside--collapsed-width: 72px;
  $-dc-color-bg-1: rgba(40, 40, 46, 0.65);

  .dc-widget-item__caption {
    display: flex;
    align-items: center;
    color: #7e8c91;
    font-size: 12px;
    line-height: 0.8;

    .dc-widget-item__caption__value--1 {
      margin: 0 4px;
      color: #9560e0;
      font-weight: 600;
    }

    .dc-widget-item__caption__value--2 {
      margin: 0 4px;
      color: white;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }

  .dc-widget-grid__item__header__search {
    width: 40%;
    margin-left: 30px;
    background: transparent;

    input {
      background: rgba(126, 140, 145, 0.12);
      border: none;
    }
  }

  .dc-page-header {
    padding: 0 5px 0 10px;
  }

  .dc-page-header__switch {

    .el-switch__label {
      line-height: 1;
    }

    .el-switch__core {
      width: 25px !important;
      height: 10px !important;
    }

    .el-switch__core:after {
      width: 11px;
      height: 11px !important;
      top: -1px;
      margin-left: -3px;
    }

    &.is-checked .el-switch__core::after {
      margin-left: -10px !important;
    }

  }

  .dc-button-icon-medium {
    /*width: 40px !important;*/
    margin-left: 0 !important;
    padding: 7px 10px;
    border: none;
    background: none !important;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    span {
      display: block;
      width: 18px;
      height: 18px;
    }

    img {
      display: block;
      width: inherit;
      height: inherit;
    }
  }

  .dc-button-icon-small {
    $size: 14px;

    padding: 0;
    border: none;
    background: none !important;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    span {
      display: inline-block;
      width: $size;
      height: $size;
    }

    img {
      display: inline-block;
      width: inherit;
      height: inherit;
    }
  }
</style>
