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

    <el-form
      label-position="top"
      label-width="100px"
      :model="actionForm"
      class="dc-alert-passport__form">
      <el-collapse v-model="actionForm.activeTab">
        <el-collapse-item v-if="null !== actionForm.dataForm" title="Основные" name="1">
          <div v-for="(value, key) in actionForm.dataForm">
            <el-form-item :label="key">
              <el-input :disabled="actionForm.disableEdit" v-model="actionForm.dataForm[key]"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <div class="dc-alert-passport__action__buttons flex-parent flex-parent--space-between-main">
      <button @click="store()" :disabled="actionForm.disableEdit" class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--save mb0">
        Сохранить
      </button>
      <button :disabled="actionForm.disableEdit" class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--close mb0">
        Выйти без сохранения
      </button>
    </div>
  </div>
</template>

<script>
  import {bus} from "../../assets/js/utils/bus";
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";

  export default {
    name: "alert-passport-edit-form",
    props: {
      title: {
        type: String
      }
    },
    mounted: function() {
      let vm = this;
      bus.$on('setActiveAction', function (payLoad) {
        vm.action = payLoad;
        vm.actionForm.disableEdit = payLoad.disabled;
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, vm.$store.state.alarmViewData.bean, 'decodeActionData');
        let requestParam = new RequestEntity.RequestParam(requestHead, {actionType: payLoad.action.actionType, data: payLoad.action.actionData});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              vm.actionForm.dataForm = JSON.parse(eventResponse.response).data;
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      });
      bus.$on('startActionTemplate', function () {
        debugger;
        this.store();
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, vm.$store.state.alarmViewData.bean, 'startTemplate');
        let requestParam = new RequestEntity.RequestParam(requestHead, {template: vm.action.template});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              vm.$store.dispatch('fillModule', {'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      });
    },
    data() {
      return {
        actionForm: {
          editEnabled: true,
          activeTab: ['1'],
          dataForm: null,
          disableEdit: false
        },
        action: null
      }
    },
    methods: {
      store: function () {
        let vm = this;
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.alarmViewData.bean, 'encodeActionData');
        let requestParam = new RequestEntity.RequestParam(requestHead, {actionType: this.action.action.actionType, data: this.actionForm.dataForm});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              vm.action.action.actionData = JSON.parse(eventResponse.response).data;
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      }
    }
  }
</script>

<style lang="scss">
  .dc-alert-passport__form {
    padding: 10px;
  }

  .dc-radio-group-block .el-radio {
    display: block;
    margin: 0 0 10px 0;
  }

  .dc-alert-passport__form__field {
    min-width: 47%;
    margin-right: 3%;
  }

  .dc-alert-passport__form__delete-field {
    $size: 18px;
    margin: 8px 0 0 5px;
    width: $size;
    height: $size;
    background: url('../../assets/img/icon-minus-round-blue.svg') no-repeat center;
  }

  .dc-alert-passport__form__add-field {
    $size: 42px;
    width: $size;
    height: $size;
    background: url('../../assets/img/icon-plus-round-blue.svg') no-repeat center;
    background-size: cover;
    opacity: 0.65;

    &:hover {
      opacity: 1;
    }
  }
</style>
