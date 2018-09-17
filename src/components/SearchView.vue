<template>
  <el-container class="dc-page-container">
    <!--Главное меню-->
    <page-aside></page-aside>
    <!--/Главное меню-->
    <el-container>
      <!--Хедер экрана-->
      <el-header height="30" class="dc-page-header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col
            :span="12"
            class="flex-parent flex-parent--center-cross">
            <el-button size="mini" class="dc-button-icon-medium" title="Вернуться на предыдущий экран">
              <img src="../assets/img/icon-back-blue.svg" alt="">
            </el-button>
            <h1>Паспорт алерта</h1>
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
              <img src="../assets/img/icon-reload-white.svg" alt="">
            </el-button>

            <el-button size="mini" class="dc-button-icon-medium" title="Действие">
              <img src="../assets/img/icon-alarmclock-white.svg" alt="">
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
                <img src="../assets/img/icon-burger-large-white.svg" alt="">
              </el-button>
            </el-popover>

          </el-col>
        </el-row>
      </el-header>
      <!--/Хедер экрана-->

      <!--Область контента-->
      <el-main class="dc-page-content">
        <div style="display: flex;">
          <tree-node style="height: 1500px; overflow-y: auto; min-width: 500px;" :model="searchView"></tree-node>
          <div style="display: flex; flex-direction: column;">
            <div v-for="searchItemExt in searchItems">
              {{searchItemExt.pathCaption}} {{searchItemExt.fieldElement.description}}
              <button type="button" @click="removeSearchItemExt(searchItemExt.uuid)">Удалить атрибут</button>

              <div style="display: flex" v-for="searchValue in searchItemExt.valuesExt">
                <el-select v-model="searchValue.operator" @change="store()" placeholder="Select">
                  <el-option label=" " :value="null"></el-option>
                  <el-option
                    v-for="item in getSearchOperators(searchItemExt)"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label">
                  </el-option>
                </el-select>

                <el-select v-if="searchItemExt.fieldElement.list !== null" @change="store()" v-model="searchValue.value1" placeholder="Select">
                  <el-option label=" " :value="null"></el-option>
                  <el-option
                    v-for="item in getSearchItemValues(searchItemExt.fieldElement.list)"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label">
                  </el-option>
                </el-select>

                <el-input v-if="searchItemExt.fieldElement.list === null && !(searchItemExt.fieldElement.type === 'date')" @change="store()" v-model="searchValue.value1" />

                <el-input @change="store()" v-if="searchItemExt.fieldElement.list === null && !(searchItemExt.fieldElement.type === 'date') &&
                                                 showSearchValue2(searchValue.operator)" v-model="searchValue.value2" />

                <el-date-picker v-model="searchValue.valueDate1"
                                @change="store()"
                                v-if="searchItemExt.fieldElement.list === null && searchItemExt.fieldElement.type === 'date'"
                                format="dd.MM.yyyy HH:mm" type="datetime" placeholder="Pick a value1">
                </el-date-picker>

                <el-date-picker v-model="searchValue.valueDate2"
                                @change="store()"
                                v-if="searchItemExt.fieldElement.list === null && searchItemExt.fieldElement.type === 'date' &&
                                                    showSearchValue2(searchValue.operator)"
                                format="dd.MM.yyyy HH:mm" type="datetime" placeholder="Pick a value2">
                </el-date-picker>

                <button type="button" @click="addSearchValue(searchItemExt)">Добавить вариант атрибута</button>
                <button type="button" @click="removeSearchValueExt(searchItemExt, searchValue.uuid)">Удалить вариант атрибута</button>
              </div>
            </div>
          </div>
          <button @click="setSerachView()" type="button">Сохранить</button>
        </div>
      </el-main>
      <!--/Область контента-->
    </el-container>
  </el-container>
</template>


<script>
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout
  import * as RequestEntity from '../assets/js/api/requestEntity';
  import {RequstApi} from '../assets/js/api/requestApi';
  import * as funcUtils from "../assets/js/utils/funcUtils";
  import PageAside from "../components/SharedWidgets/PageAside";
  import TreeNode from "../components/SharedWidgets/TreeNode";
  import {bus} from "../assets/js/utils/bus";

  export default {
    name: "SearchView",
    components: {
      PageAside,
      TreeNode,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem
    },
    data() {
      return {
        // Список тайлов виджетов для грида макета
        gridTilesLayout: [
          {i: 'Описание и время', x: 0, y: 0, w: 7, h: 35},
          {i: 'Показать данные', x: 0, y: 35, w: 7, h: 30},
          {i: 'Действия с алертом', x: 7, y: 0, w: 6, h: 65},
          {i: 'График показателей', x: 13, y: 0, w: 11, h: 4},
          {i: 'Редактирование действия', x: 13, y: 0, w: 11, h: 65}
        ],
        isMainMenuCollapsed: true,
        headerSwitch: false,
        treeNode: null,
        searchItems: [],
        savedItems: []
      };
    },
    computed: {
      searchView: function () {
        return this.treeNode;
      }
    },
    beforeCreate: function () {
      let vm = this;
      let wid = sessionStorage.getItem('wid');
      let componentsRoute = funcUtils.getFromSessionStorage(wid);
      let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
      this.$store.dispatch('searchViewSetCid', currentComponent.cid);
      (async () => {
        try {
          let params = this.$route.params;
          if (funcUtils.isNotEmpty(params.searchItems)) {
            let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.searchView.bean, 'store');
            let requestParam = new RequestEntity.RequestParam(requestHead, {
              data: params.searchItems.list,
              negative: params.searchItems.negativ
            });
            let eventResponse = await RequstApi.sendHttpRequest(requestParam);
          }
          let requestHead1 = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.searchView.bean, 'restore');
          let requestParam1 = new RequestEntity.RequestParam(requestHead1, null);
          let eventResponse1 = await RequstApi.sendHttpRequest(requestParam1);
          if (eventResponse1.status === 200) {
            let data1 = JSON.parse(eventResponse1.response).data;
            if (data1.list) {
              data1.list.forEach((item) => {
                let key = item.tableRoute + ',' + item.name;
                vm.savedItems[key] = item;
              });
            }
          }

          let requestHead2 = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.searchView.bean, 'selectType');
          let requestParam2 = new RequestEntity.RequestParam(requestHead2, {type: 2});
          let eventResponse2 = await RequstApi.sendHttpRequest(requestParam2);
          if (eventResponse2.status === 200) {
            let data = JSON.parse(eventResponse2.response).data;
            let tableElementExt = {
              pathName: data.name,
              pathCaption: data.caption,
              tableElement: data
            };
            if (Object.keys(vm.savedItems).length > 0) {
              data.fields.forEach((field) => {
                let key = data.name + ',' + field.caption;
                let savedItem = vm.savedItems[key];
                if (savedItem) {
                  vm.fillByFilter(field);
                  let searchItemExt = vm.fillSearchItemExt(data.name, data.caption, field);
                  searchItemExt.valuesExt = [];
                  savedItem.values.forEach((searchValue) => {
                    let searchValueExt = {};
                    searchValueExt.uuid = funcUtils.guid();
                    searchValueExt.operator = searchValue.operator;
                    searchValueExt.value1 = searchValue.value1;
                    searchValueExt.value2 = searchValue.value2;
                    searchItemExt.valuesExt.push(searchValueExt);
                  });
                  vm.searchItems.push(searchItemExt);
                }
              });
            }
            let node = {
              data: tableElementExt,
              children: [],
              parent: null
            };
            vm.fillRoot(tableElementExt, node);
            vm.treeNode = node;
          }
        } catch (e) {
          alert(e.message);
        }
      })();
    },
    mounted: function () {
      let vm = this;
      this.$store.watch(this.$store.getters.searchViewGetCommand, state => {
        vm.updateOnCommand(state);
      });
      bus.$on('onFieldSelect', function (payLoad) {
        vm.onFieldSelect(payLoad.tableElementExt, payLoad.fieldElement);
      });
    },
    methods: {
      fillRoot: function (tableElementExt, treeNode) {
        let vm = this;
        tableElementExt.tableElement.childs.forEach((tableRef) => {
          let name = tableElementExt.pathName + "," + tableRef.table.name;
          let caption = tableElementExt.pathCaption + "," + tableRef.table.caption;
          let elementExt = {
            pathName: name,
            pathCaption: caption,
            tableElement: tableRef.table
          };
          if (Object.keys(vm.savedItems).length > 0) {
            tableRef.table.fields.forEach((field) => {
              let key = name + ',' + field.caption;
              let savedItem = vm.savedItems[key];
              if (savedItem) {
                vm.fillByFilter(field);
                let searchItemExt = vm.fillSearchItemExt(name, caption, field);
                searchItemExt.valuesExt = [];
                savedItem.values.forEach((searchValue) => {
                  let searchValueExt = {};
                  searchValueExt.uuid = funcUtils.guid();
                  searchValueExt.operator = searchValue.operator;
                  searchValueExt.value1 = searchValue.value1;
                  searchValueExt.value2 = searchValue.value2;
                  searchItemExt.valuesExt.push(searchValueExt);
                });
                vm.searchItems.push(searchItemExt);
              }
            });
          }
          let node = newTreeNode(elementExt, treeNode);
          if (tableRef.table.childs && tableRef.table.childs.length > 0) {
            this.fillRoot(elementExt, node);
          }
        });
        
        function newTreeNode(data, parent) {
          let res = {};
          res.data = data;
          if (null !== parent) {
            res.children = [];
            parent.children.push(res);
          }
          return res;
        }
      },
      onFieldSelect: function (tableElementExt, fieldElement) {
        if (!this.fillByFilter(fieldElement)) {
          return;
        }
        let searchItemExt = this.fillSearchItemExt(tableElementExt.pathName, tableElementExt.pathCaption, fieldElement);
        this.searchItems.push(searchItemExt);
        this.store();
      },
      fillSearchItemExt: function (tableRoute, pathCaption, fieldElement) {
        let searchItemExt = {};
        searchItemExt.uuid = funcUtils.guid();
        searchItemExt.fieldElement = fieldElement;
        searchItemExt.pathCaption = pathCaption;

        searchItemExt.searchOperators = [];
        searchItemExt.tableRoute = tableRoute;
        searchItemExt.name = fieldElement.name;
        searchItemExt.valuesExt = [];

        let searchValueExt = {};
        searchValueExt.uuid = funcUtils.guid();
        searchValueExt.operator = 'eq';
        searchItemExt.valuesExt.push(searchValueExt);

        if (null !== searchItemExt.fieldElement.list) {
          searchItemExt.searchOperators.push('eq');
          searchItemExt.searchOperators.push('neq');
        } else if (null === searchItemExt.fieldElement.list && searchItemExt.fieldElement.type === 'string') {
          searchItemExt.searchOperators.push('eq');
          searchItemExt.searchOperators.push('neq');
          searchItemExt.searchOperators.push('equs');
          searchItemExt.searchOperators.push('nequs');
          searchItemExt.searchOperators.push('like');
          searchItemExt.searchOperators.push('nlike');
        } else if (null === searchItemExt.fieldElement.list && searchItemExt.fieldElement.type === 'date') {
          searchItemExt.searchOperators.push('eq');
          searchItemExt.searchOperators.push('neq');
          searchItemExt.searchOperators.push('btwn');
        } else {
          searchItemExt.searchOperators.push('eq');
          searchItemExt.searchOperators.push('neq');
          searchItemExt.searchOperators.push('gt');
          searchItemExt.searchOperators.push('egt');
          searchItemExt.searchOperators.push('ls');
          searchItemExt.searchOperators.push('els');
          searchItemExt.searchOperators.push('btwn');
        }
        return searchItemExt;
      },
      fillByFilter: function(fieldElement) {
        let res = true;
        if (fieldElement.filters && fieldElement.filters.length > 0) {
          let filters = {};
          let vm = this;
          fieldElement.filters.forEach((fieldFilter) => {
            let optional = vm.searchItems.find((searchItemExt) => {
              return searchItemExt.fieldElement.name === fieldFilter.ref;
            });
            if (fieldFilter.required) { // если фильтр обзательный
              if (optional) { // найден
                res = vm.fillFilters(optional, filters);
              } else { // не найден
                res = false;
              }
            } else { // если фильтр не обзательный
              if (optional) { // найден
                this.fillFilters(optional, filters);
              }
            }
          });
          if (Object.keys(filters).length > 0) {
            let wid = sessionStorage.getItem('wid');
            let cid = this.$store.state.searchView.cid;
            let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.searchView.bean, 'getDictData');
            let requestParam = new RequestEntity.RequestParam(requestHead, {
              name: fieldElement.listSource,
              keyFld: fieldElement.keyName,
              valueFld: fieldElement.valueName,
              filters: filters
            });
            RequstApi.sendHttpRequest(requestParam)
              .then(eventResponse => {
                if (eventResponse.status === 200) {
                  fieldElement.list = JSON.parse(eventResponse.response).data;
                }
              })
              .catch(eventResponse => {
                alert(eventResponse.message);
              });

          }
        }
        return res;
      },
      fillFilters: function(searchItemExt, filters) {
        let res = true;
        let searchValueExts = searchItemExt.valuesExt.filter((searchValueExt) => {
          if ((searchValueExt.value1 && searchValueExt.value1.length > 0) || searchValueExt.valueDate1) {
            return searchValueExt;
          }
        });
        if (searchValueExts && searchValueExts.length > 0) {
          let searchValueExt = searchValueExts[0];
          let value = null;
          if (null !== searchValueExt.value1) {
            value = searchValueExt.value1;
          } else if (null !== searchValueExt.valueDate1)  {
            value = funcUtils.parseDateTime(searchValueExt.valueDate1, "dd.MM.yyyy HH:mm");
          }
          if (null != value) {
            filters[searchItemExt.name] = value;
          }
        } else {
          res = false;
        }
        return res;
      },
      removeSearchItemExt: function(uuid) {
        this.searchItems.forEach((searchItemExt, index, object) => {
          if (searchItemExt.uuid === uuid) {
            object.splice(index, 1);
          }
        });
        this.store();
      },
      addSearchValue: function (searchItemExt) {
        if (null === searchItemExt) {
          return;
        }
        let searchValueExt = {};
        searchValueExt.uuid = funcUtils.guid();
        searchItemExt.valuesExt.push(searchValueExt);
        this.store();
      },
      removeSearchValueExt: function (searchItemExt, uuid) {
        if (searchItemExt.valuesExt.length === 1) {
          this.removeSearchItemExt(searchItemExt.uuid);
        } else {
          searchItemExt.valuesExt.forEach((searchValueExt, index, object) => {
            if (searchValueExt.uuid === uuid) {
              object.splice(index, 1);
            }
          });
          this.store();
        }
      },
      store: function () {
        let searchItems = [];
        this.searchItems.forEach((searchItemExt) => {
          searchItems.push(this.convertSearchItemExt(searchItemExt));
        });
        let wid = sessionStorage.getItem('wid');
        let cid = this.$store.state.searchView.cid;
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.searchView.bean, 'store');
        let requestParam = new RequestEntity.RequestParam(requestHead, {
          data: searchItems,
          negative: false
        });
        RequstApi.sendHttpRequest(requestParam);
      },
      convertSearchItemExt: function(searchItemExt) {
        let searchItem = {
          tableRoute: searchItemExt.tableRoute,
          name: searchItemExt.name,
          values: []
        };
        searchItemExt.valuesExt.forEach((searchValueExt) => {
          let searchValue = {
            operator: searchValueExt.operator
          };
          let value1 = null;
          let value2 = null;
          if (searchValueExt.value1) {
            value1 = searchValueExt.value1;
          } else if (searchValueExt.valueDate1)  {
            value1 = funcUtils.formatDateTime(searchValueExt.valueDate1, "DD.MM.YYYY HH:mm");
          }
          if (searchValueExt.value2) {
            value2 = searchValueExt.value2;
          } else if (searchValueExt.valueDate2) {
            value2 = funcUtils.formatDateTime(searchValueExt.valueDate2, "DD.MM.YYYY HH:mm");
          }
          searchValue.value1 = value1;
          searchValue.value2 = value2;
          searchItem.values.push(searchValue);
        });
        return searchItem;
      },
      getFullPath: function(searchItemExt) {
        let res = [];
        if (searchItemExt) {
          let pathCaptionList = searchItemExt.pathCaption.split(",");
          res.concat(pathCaptionList);
          res.push(searchItemExt.fieldElement.description);
        }
        return res;
      },
      getSearchOperators: function(searchItemExt) {
        let res = [];
        if (null === searchItemExt) {
          return res;
        }
        if (searchItemExt.searchOperators.includes('eq')) {
          res.push({label: 'eq', value: "равно"});
        }
        if (searchItemExt.searchOperators.includes('neq')) {
          res.push({label: 'neq', value: "не равно"});
        }
        if (searchItemExt.searchOperators.includes('equs')) {
          res.push({label: 'equs', value: "РаВнО"});
        }
        if (searchItemExt.searchOperators.includes('nequs')) {
          res.push({label: 'nequs', value: "Не РаВнО"});
        }
        if (searchItemExt.searchOperators.includes('gt')) {
          res.push({label: 'gt', value: "больше"});
        }
        if (searchItemExt.searchOperators.includes('egt')) {
          res.push({label: 'egt', value: "больше или равно"});
        }
        if (searchItemExt.searchOperators.includes('ls')) {
          res.push({label: 'ls', value: "меньше"});
        }
        if (searchItemExt.searchOperators.includes('els')) {
          res.push({label: 'els', value: "меньше или равно"});
        }
        if (searchItemExt.searchOperators.includes('btwn')) {
          res.push({label: 'btwn', value: "между"});
        }
        if (searchItemExt.searchOperators.includes('like')) {
          res.push({label: 'like', value: "содержит"});
        }
        if (searchItemExt.searchOperators.includes('nlike')) {
          res.push({label: 'nlike', value: "не содержит"});
        }
        return res;
      },
      getSearchItemValues: function(values) {
        let res = [];
        for (let key in values) {
          if (values.hasOwnProperty(key)) {
            res.push({label: key, value: values[key]});
          }
        }
        res.sort((a,b) => {
          return a.label.toLowerCase() === b.label.toLowerCase();
        });
        return res;
      },
      showSearchValue2: function(searchOperator) {
        return null !== searchOperator && searchOperator === 'btwn';
      },
      updateOnCommand: function (resp) {
        let wid = sessionStorage.getItem('wid');
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, resp.cid, this.$store.state.searchView.bean, 'restore');
        let requestParam = new RequestEntity.RequestParam(requestHead, null);
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              this.$store.dispatch('fillModule', {'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      },
      getPrev: function () {
        funcUtils.getPrevComponent(() => {
          funcUtils.getPrevPage(this.$router, this.$store.state.monitorEdit.routeName);
        });
      },
      toggleMainMenu() {
        this.isMainMenuCollapsed = !this.isMainMenuCollapsed;
      },
      tileMoveEvent: function (i, newX, newY) {
        console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
      },
      setSerachView: function () {
        let wid = sessionStorage.getItem('wid');
        let searchItems = [];
        this.searchItems.forEach((searchItemExt) => {
          searchItems.push(this.convertSearchItemExt(searchItemExt));
        });
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let prevComponent = componentsRoute[componentsRoute.length - 2];
        let searchItem = {
          list: searchItems,
          negativ: false
        };
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, prevComponent.cid, this.$store.state.monitorEdit.bean, 'setObjectFillter');
        let requestParam = new RequestEntity.RequestParam(requestHead, {searchItem: searchItem});
        RequstApi.sendHttpRequest(requestParam);
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
    /*width: 40%;*/
    /*margin-left: 30px;*/
    background: transparent;

    input {
      background: rgba(126, 140, 145, 0.18);
      border: none;
    }
  }

  /* Тайл грида */
  .dc-widget-grid__item {
    background: $-dc-color-bg-1;
    border-radius: 4px;

    .dc-widget-grid__item__header {
      display: flex;
      align-items: flex-start;
      padding: 4px 4px 4px 12px;
      font-weight: 300;
      transition: background-color 200ms linear 80ms;

      &:hover {
        background-color: rgba(39, 40, 45, 0.65);
      }
    }

    .dc-widget-grid__item__footer {
      $offset: 8px;
      position: absolute;
      bottom: $offset;
      left: $offset;
      right: $offset;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      text-align: center;
      background: $-dc-color-bg-1;
      border-radius: 4px;
    }

    .dc-widget-grid__item__header__right-column {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .dc-widget-grid__item__header__buttons {
      display: flex;
      margin-left: 10px;
      background: #050511;
      padding: 5px;
      border-radius: 4px;

      &.dc-widget-grid__item__header__buttons--vertical {
        flex-direction: column;
        align-items: center;
        background: #28282e;

        .dc-button-icon-small:last-child {
          margin-left: 0;
          margin-top: 5px;
        }
      }
    }

  }

  .dc-page-container {
    height: 100vh;
    background: #000;
  }

  .dc-page-content {
    padding: 0;
    overflow: hidden;
  }

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
