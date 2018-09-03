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

    <el-tabs v-model="activeTab" class="dc-alert-passport__action-tabs">
      <!-- Работающие экшены -->
      <el-tab-pane label="действия в работе" name="working-actions">
                <span @click="setGraphVisible(true)" slot="label" class="dc-alert-passport__tab-title flex-parent flex-parent--center-cross">
                    <i class="dc-alert-passport__icon dc-alert-passport__icon--working-actions "></i>
                    действия в работе
                </span>

        <template v-for="action in workingActionsList">
          <div @click="setActiveWorkingAction(action, true)"
            :class="['dc-alert-passport__action-item', action.cssClass, {'is-active': action.active}, {'is-disabled': !action.enabled}]">
            <div class="dc-alert-passport__action-item__cols">
              <div class="dc-alert-passport__action-item__status"></div>
              <div class="dc-alert-passport__action-item__info">
                <div class='grid'>
                  <div class='col col--9'>
                    <div class="dc-alert-passport__action-tabs__action-item__info__title">
                      {{action.title}}
                    </div>
                    <div class="dc-alert-passport__action-tabs__action-item__info__status-name">
                      {{action.status}}
                    </div>
                  </div>
                  <div class='col col--3 align-r'>
                    <div class="dc-alert-passport__action-tabs__action-item__info__date-1">
                      {{action.date | formatRelativeDate()}}
                    </div>
                    <div class="dc-alert-passport__action-tabs__action-item__info__date-2">
                      {{action.date | formatDateTime('HH:mm')}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="action.person" class="dc-alert-passport__action-tabs__action-item__person">
              {{action.person}}
            </div>
          </div>
        </template>
      </el-tab-pane>
      <!-- Работающие экшены -->

      <!-- Выбор экшенов -->
      <el-tab-pane label="шаблоны действий" name="actions-chooser">
                <span @click="activeActionsTemplate = null; setGraphVisible(true)" slot="label" class="dc-alert-passport__tab-title flex-parent flex-parent--center-cross">
                    <i class="dc-alert-passport__icon dc-alert-passport__icon--actions-chooser"></i>
                    шаблоны действий
                </span>
        <div v-if="actionsTemplateList.length > 0" :class="['dc-alert-passport__carousel',  {'dc-alert-passport__carousel--expanded': activeActionsTemplate} ]">
          <div class="dc-alert-passport__carousel__wrap">
            <!-- Список темплейтов -->
            <div class="dc-alert-passport__carousel__slide">
              <el-input
                size="mini"
                clearable
                placeholder="Поиск шаблонов..."
                suffix-icon="el-icon-search"
                class="dc-widget-grid__item__header__search mt6 mb12">
              </el-input>

              <template v-for="template in actionsTemplateList">
                <div :class="['dc-alert-passport__template-item', {'is-active': template.active}]"
                     @click="setActiveActionsTemplate(template)">
                  <div class="dc-alert-passport__template-item__title">{{template.title}}</div>
                  <div class="dc-alert-passport__template-item__actions-count">
                    шаблонов: <span>{{template.templateActions.length}}</span>
                  </div>
                </div>
              </template>
            </div>
            <!-- /Список темплейтов -->

            <!-- Действия темплейта -->
            <div v-if="activeActionsTemplate" class="dc-alert-passport__carousel__slide">
              <div class="dc-alert-passport__carousel__slide__header flex-parent flex-parent--space-between-main"
                   title="Закрыть подменю шаблонов"
                   @click="activeActionsTemplate = null; setGraphVisible(true)">
                <div>
                  <div class="dc-alert-passport__carousel__slide__heading">
                    {{activeActionsTemplate.title}}
                  </div>
                  <div class="dc-alert-passport__carousel__slide__subheading">
                    действий: <span>{{activeActionsTemplate.templateActions.length}}</span>
                  </div>
                </div>

                <i class="el-icon-arrow-down color-white txt-h3"></i>
              </div>

              <template v-for="templateActions in activeActionsTemplate.templateActions">
                <div @click="setActiveWorkingAction(templateActions)"
                  :class="['dc-alert-passport__action-item', 'is-paused', {'is-active': templateActions.active}, {'is-disabled': !templateActions.enabled}]">
                  <div class="dc-alert-passport__action-item__cols">
                    <div class="dc-alert-passport__action-item__status"></div>
                    <div class="dc-alert-passport__action-item__info">
                      <div class='grid'>
                        <div class='col col--9'>
                          <div class="dc-alert-passport__action-tabs__action-item__info__title">
                            {{templateActions.title}}
                          </div>
                          <div class="dc-alert-passport__action-tabs__action-item__info__status-name">
                            {{templateActions.status}}
                          </div>
                        </div>
                        <div class='col col--3 align-r'>
                          <el-switch
                            style="zoom: 0.85;"
                            v-model="templateActions.enabled"
                            active-color="#0068ff"
                            inactive-color="#7e8c91"
                            title="Пометить для выполнения">
                          </el-switch>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!-- /Действия темплейта -->
          </div>
        </div>
      </el-tab-pane>
      <!-- Выбор экшенов -->
    </el-tabs>

    <div class="dc-alert-passport__action__buttons">
      <template v-if="activeTab ==='working-actions'">
        <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--clear-queue">
          Очистить очередь
        </button>
        <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--close">
          Закрыть алерт
        </button>
      </template>

      <template v-if="activeTab ==='actions-chooser'">
        <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--run">
          Запустить
        </button>
        <button class="dc-alert-passport__action-tabs__button dc-alert-passport__action-tabs__button--run-all">
          Запустить всё
        </button>
      </template>
    </div>
  </div>
</template>

<script>
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import { bus } from "../../assets/js/utils/bus";

  export default {
    name: "alert-passport-tile-actions",
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        // activeTab: 'working-actions',
        activeTab: 'actions-chooser',
        activeActionsTemplate: null
      };
    },
    computed: {
      workingActionsList: function () {
        let res = [];
        let data = this.$store.state.alarmViewData.data;
        if (data) {
          let actions = data.actions;
          actions.forEach((action) => {
            let actionRes = {};
            actionRes.date = action.lastOperTime;
            actionRes.title = action.note;
            actionRes.person = action.lastOperIspName;
            actionRes.action = action;
            actionRes.status = funcUtils.lookupValue('stateActions', action.actionStatus).label;
            switch (action.actionStatus) {
              case 2: {
                actionRes.cssClass = 'is-working';
                break;
              }
              case 3: {
                actionRes.cssClass = 'is-done';
                break;
              }
              case 5: {
                actionRes.cssClass = 'is-paused';
                break;
              }
            }
            actionRes.enabled = true;
            actionRes.active = false;
            res.push(actionRes);
          });
        }
        return res;
      },
      actionsTemplateList: function () {
        let res = [];
        let data = this.$store.state.alarmViewData.data;
        if (data) {
          let templates = data.templates;
          templates.forEach((template) => {
            let templateRes = {};
            templateRes.note = template.note;
            templateRes.title = template.name;
            templateRes.active = false;
            templateRes.templateActions = [];
            template.items.forEach((templateAction) => {
              let templateActionRes = {};
              templateActionRes.title = templateAction.name;
              templateActionRes.status = funcUtils.lookupValue('stateActions', templateAction.finalState).label;
              templateActionRes.enabled = true;
              templateActionRes.active = false;
              templateActionRes.action = templateAction;
              templateRes.templateActions.push(templateActionRes);
            });
            res.push(templateRes);
          });
        }
        return res;
      }
    },
    methods: {
      setActiveWorkingAction: function (item, disabled) {
        if (disabled) {
          item.disabled = disabled;
        }
        bus.$emit('setActiveAction', item);
        this.setGraphVisible(false);
      },
      setGraphVisible: function (visible) {
        bus.$emit('setGraphVisible', visible);
      },
      setActiveActionsTemplate: function (item) {
        this.activeActionsTemplate = item;
      }
    }
  }
</script>

<style lang="scss">
  .dc-alert-passport__action-tabs {
    padding: 5px;

    .el-tabs__header {
      margin-bottom: 0;
    }

    .dc-alert-passport__tab-title {
      color: #343442;
      text-transform: lowercase;
    }

    .dc-alert-passport__icon {
      margin-right: 5px;
      width: 20px;
      height: 20px;

      &--working-actions {
        background: url("../../assets/img/icon-arrows-circle-gray.svg") no-repeat center;
      }

      &--actions-chooser {
        background: url("../../assets/img/icon-many-checks-gray.svg") no-repeat center;
      }
    }

    .el-tabs__item.is-active .dc-alert-passport__tab-title {
      color: #0068ff;

      .dc-alert-passport__icon--working-actions {
        background-image: url("../../assets/img/icon-arrows-circle-blue.svg");
      }

      .dc-alert-passport__icon--actions-chooser {
        background-image: url("../../assets/img/icon-many-checks-blue.svg");
      }
    }

    .el-tabs__nav {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__nav-wrap:after {
      display: none;
    }

    .dc-alert-passport__action-item {
      margin-bottom: 5px;
      padding: 5px;
      border-radius: 6px;
      border: 2px solid transparent;
      transition: all 200ms ease-in;

      &.is-paused {
        .dc-alert-passport__action-item__status {
          background-image: url('../../assets/img/icon-pause-white.svg');
          background-size: 16px;
        }
      }

      &.is-done {
        .dc-alert-passport__action-item__status {
          background-image: url('../../assets/img/icon-tmp-thumbup.svg');
          background-size: 26px;
        }
      }

      &.is-queue {
        .dc-alert-passport__action-item__status {
          background-image: url('../../assets/img/icon-tmp-timer.svg');
          background-size: 26px;
        }

        .dc-alert-passport__action-tabs__action-item__info__date-1,
        .dc-alert-passport__action-tabs__action-item__info__date-2 {
          visibility: hidden;
        }
      }

      &.is-working {
        .dc-alert-passport__action-item__status {
          background-color: #0068ff;
          background-image: url('../../assets/img/icon-play-white-black-circle.svg');
          background-size: 36px;
        }
      }

      &.is-active {
        border-color: rgba(0, 104, 255, 0.65);

        .dc-alert-passport__action-item__status,
        .dc-alert-passport__action-item__info {
          background-color: #0068ff !important;

          .el-switch__core {
            box-shadow: 0 0 2px white;
          }
        }
      }

      &.is-disabled {
        opacity: 0.42;

        .dc-alert-passport__action-item__status,
        .dc-alert-passport__action-item__info {
          filter: brightness(0.6) contrast(0.65);
        }

        .dc-alert-passport__action-tabs__action-item__person {
          display: none;
        }
      }

      &:hover {
        border-color: #0068ff;
        opacity: 1;

        .dc-alert-passport__action-item__status,
        .dc-alert-passport__action-item__info {
          filter: none;
        }
      }

      .dc-alert-passport__action-item__cols {
        display: flex;

        .dc-alert-passport__action-item__status,
        .dc-alert-passport__action-item__info {
          min-height: 100px;
          padding: 10px;
          background-color: #28282e;
          border-radius: 4px;
        }

        .dc-alert-passport__action-item__status {
          width: 20%;
          margin-right: 3px;
          background-repeat: no-repeat;
          background-position: center 25px;
          transition: all 150ms ease-in;
        }

        .dc-alert-passport__action-item__info {
          flex: 1;
          transition: all 150ms ease-in;
        }

        .dc-alert-passport__action-tabs__action-item__info__title {
          color: white;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.25px;
        }

        .dc-alert-passport__action-tabs__action-item__info__status-name {
          margin-top: 2px;
          color: #a2a9b1;
          font-size: 16px;
        }

        .dc-alert-passport__action-tabs__action-item__info__date-1 {
          font-size: 14px;
          font-weight: 300;
          color: #d1d1d1;
        }

        .dc-alert-passport__action-tabs__action-item__info__date-2 {
          font-size: 24px;
          color: #d1d1d1;
        }
      }
    }

    .dc-alert-passport__action-tabs__action-item__person {
      padding: 4px 8px;
      border-radius: 5px;
      margin-top: -2px;
      background-color: rgba(40, 40, 46, 0.65);
      box-shadow: 0 5px 6px rgba(0, 0, 0, 0.55) inset;
      color: rgba(255, 255, 255, 0.65);
    }
  }

  .dc-alert-passport__template-item {
    border-radius: 4px;
    margin-top: 5px;
    padding: 10px 15px;
    transition: all 250ms ease-in;
    opacity: 0.85;
    background: #28282e url("../../assets/img/icon-arrow-right-white.svg") no-repeat calc(100% - 15px) center;
    background-size: 10px;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &.is-active {
      background-color: #0068ff;

      .dc-alert-passport__template-item__title,
      .dc-alert-passport__template-item__actions-count {
        color: white;
      }
    }

    .dc-alert-passport__template-item__title {
      color: rgba(255, 255, 255, 0.65);
      text-transform: uppercase;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.25px;
    }

    .dc-alert-passport__template-item__actions-count {
      margin-top: 5px;
      color: #7e8c91;
      font-size: 13px;
      font-weight: 500;

      span {
        margin-left: 3px;
        font-size: 16px;
        color: white;
      }
    }
  }

  .dc-alert-passport__action__buttons {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
    background: rgba(40, 40, 46, 0.65);
    border-radius: 4px;
  }

  .dc-alert-passport__action-tabs__button {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
    opacity: 0.9;
    transition: all 120ms ease-in;

    &:hover {
      opacity: 1;
      color: white;
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &:before {
      $size: 36px;
      display: inline-block;
      margin-right: 10px;
      content: '';
      width: $size;
      height: $size;
      border-radius: 4px;
      background-repeat: no-repeat;
      background-position: center;
    }

    &.dc-alert-passport__action-tabs__button--clear-queue:before {
      background-color: #ff6600;
      background-image: url('../../assets/img/icon-delete-white.svg');
      background-size: 11px;

    }

    &.dc-alert-passport__action-tabs__button--stop:before {
      background-color: #d39909;
      background-image: url('../../assets/img/icon-stop-white.svg');
      background-size: 14px;

    }

    &.dc-alert-passport__action-tabs__button--close:before {
      background-color: #f72806;
      background-image: url('../../assets/img/icon-close-white.svg');
      background-size: 14px;
    }

    &.dc-alert-passport__action-tabs__button--run:before {
      background-color: #0068ff;
      background-image: url('../../assets/img/icon-play-white-btn.svg');
      background-size: 14px;
    }

    &.dc-alert-passport__action-tabs__button--run-all:before {
      background-color: #0068ff;
      background-image: url('../../assets/img/icon-link-white-btn.svg');
      background-size: 14px;
    }

    &.dc-alert-passport__action-tabs__button--save:before {
      background-color: #0068ff;
      background-image: url('../../assets/img/icon-check-white-btn.svg');
      background-size: 18px;
    }

    &.dc-alert-passport__action-tabs__button--save:before {
      background-color: #0068ff;
      background-image: url('../../assets/img/icon-check-white-btn.svg');
      background-size: 18px;
    }
  }

  .dc-alert-passport__carousel {
    position: relative;
    overflow: hidden;

    &.dc-alert-passport__carousel--expanded {
      .dc-alert-passport__carousel__wrap {
        transform: translateX(-50%);
      }
    }
  }

  .dc-alert-passport__carousel__wrap {
    transition: all 200ms ease-in;
    display: flex;
    width: 200%;
  }

  .dc-alert-passport__carousel__slide {
    width: 100%;
    overflow-y: auto;
  }

  .dc-alert-passport__carousel__slide__header {
    padding: 0 8px;
    cursor: pointer;
  }

  .dc-alert-passport__carousel__slide__heading {
    font-size: 17px;
    text-transform: uppercase;
    color: white;
    line-height: 1.2;
  }

  .dc-alert-passport__carousel__slide__subheading {
    margin-bottom: 5px;
    color: #7e8c91;
    font-size: 13px;
    line-height: 1.5;

    span {
      margin-left: 3px;
      font-size: 120%;
      color: white;
      font-weight: 500;
    }
  }
</style>
