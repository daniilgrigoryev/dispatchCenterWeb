<template>
  <!--Главное меню-->
  <el-aside width="200px" class="dc-main-aside flex-parent flex-parent--column"
            v-bind:class="{ 'dc-main-aside--collapsed': isMainMenuCollapsed }">
    <div class="dc-main-aside__logo" v-on:click="toggleMainMenu"></div>
    <el-menu default-active="1" :collapse="isMainMenuCollapsed">
      <el-menu-item index="1">
        <i class="el-icon-news"></i>
        <span slot="title">Меню первое</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">Меню второе</span>
        </template>
        <el-menu-item-group>
          <!--<span slot="title">Group One</span>-->
          <el-menu-item index="1-1" v-on:click="getPrev()">Назад</el-menu-item>
          <el-menu-item index="1-2" v-on:click="getNext()">Вперед</el-menu-item>
          <el-menu-item index="1-3" v-on:click="logout()">Выход</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-menu"></i>
        <span slot="title">Меню третье</span>
      </el-menu-item>
    </el-menu>

    <div class="dc-main-aside__user">
      <img src="../assets/img/icon-user-white.svg" width="24" height="24" alt="">
      <span>Иван <br> Петров</span>
    </div>
  </el-aside>
  <!--/Главное меню-->
</template>

<script>
  import * as funcUtils from "./../assets/js/utils/funcUtils";

  export default {
    name: "PageAside",
    data() {
      return {
        isMainMenuCollapsed: true
      };
    },
    methods: {
      toggleMainMenu() {
        this.isMainMenuCollapsed = !this.isMainMenuCollapsed;
      },
      getNext: function () {
        let count = 0;
        let parent = 'this.$parent';
        while (funcUtils.isUndefined(eval(parent + '.getNext')) && count < 300) {
          parent += '.$parent';
          count++;
        }
        eval(parent + '.getNext()');
      },
      getPrev: function () {
        let count = 0;
        let parent = 'this.$parent';
        while (funcUtils.isUndefined(eval(parent + '.getPrev')) && count < 300) {
          parent += '.$parent';
          count++;
        }
        eval(parent + '.getPrev()');
      },
      logout: function () {
        this.$root.logout();
      }
    }
  }
</script>

<style lang="scss">
  $-dc-main-aside--collapsed-width: 72px;
  $-dc-color-bg-1: rgba(40, 40, 46, 0.65);

  .dc-main-aside {
    background: $-dc-color-bg-1;
    transition-delay: 150ms;

    .el-menu-item [class^="el-icon-"] {
      font-size: 24px !important;
    }

    &.dc-main-aside--collapsed {
      width: $-dc-main-aside--collapsed-width !important;

      .el-tooltip, .el-submenu__title {
        padding: 0 25px !important;
      }
    }

    .dc-main-aside__logo {
      height: 64px;
      background: #7e8c91 url("../assets/img/logo-menu.svg") no-repeat center;
      background-size: 42px;
    }

    .dc-main-aside__user {
      display: flex;
      flex-direction: column;
      padding: 8px;
      align-items: center;
      height: 80px;
      margin-top: auto;
      background: #7e8c91;
      background-size: 28px;
      text-align: center;
      color: white;
      font-size: 15px;
      line-height: 1.1;

      img {
        display: block;
        margin: auto;
      }
    }

    .el-menu {
      border-right: none;
    }

    .el-menu--collapse {
      width: $-dc-main-aside--collapsed-width !important;
    }

    .el-menu-item, .el-menu-item,
    .el-submenu__title, .el-submenu__title {
      color: #7e8c91;
      font-size: 16px;
    }

    .el-menu-item:hover, .el-menu-item:focus,
    .el-submenu__title:hover, .el-submenu__title:focus {
      background-color: rgba(144, 144, 144, 0.22);
    }

    .el-menu-item.is-active, .el-menu-item.is-active {
      background-color: rgba(255, 255, 255, 0.12);
      color: white;
    }

    .el-menu-item-group__title {
      padding: 7px 0 7px 20px;
      line-height: normal;
      font-size: 12px;
      color: #909399;
      background: rgba(148, 148, 148, 0.15);
    }
  }
</style>
