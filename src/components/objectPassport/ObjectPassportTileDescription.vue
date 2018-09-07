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

        <!-- ID и статус -->
        <div class='dc-inner-tile-box dc-object-passport__id'>
            <p class="dc-object-passport__id__field">
                ID: <span class="txt-h3 txt-uppercase txt-bold">{{objectData.name}}</span>
            </p>
            <p class="dc-object-passport__id__field">
                Тип: <span>{{objectData.typeName}}</span>
            </p>
            <p class="dc-object-passport__id__field">
                Статус: <span>работает</span>
            </p>
        </div>
        <!-- /ID и статус -->

        <!-- Местоположение -->
        <div class='dc-inner-tile-box dc-inner-tile-box--medium-gray dc-object-passport__location'>
            <div class="dc-object-passport__location__heading">Местоположение:</div>

            <p class="dc-object-passport__location__text">
                Ул. щелковское шоссе д.92
            </p>
        </div>
        <!-- /Местоположение -->

        <!-- Описание объекта -->
        <div class="dc-inner-tile-box dc-inner-tile-box--medium-gray">
            <h5>Описание объекта</h5>

            <p class="dc-object-passport__descriptions-text">
              {{objectData.note}}
            </p>
        </div>
        <!-- /Описание объекта -->
    </div>
</template>

<script>
    export default {
      name: "metrica-passport-table",
        props: {
            title: {
                type: String
            }
        },
      data() {
        return {};
      },
      computed: {
        objectData: function () {
          let res = {};
          let data = this.$store.state.objectViewData.data;
          if (data) {
            res = data;
          }
          return res;
        }
      },
      methods: {}
    }
</script>

<style lang="scss">
    $icon-left-padding: 72px;

    .dc-object-passport__id {
        padding-left: $icon-left-padding;
        background: url("../../assets/img/icon-object-camera.svg") no-repeat 15px center;
        background-size: 38px;
    }

    .dc-object-passport__id__field {
        color: #7e8c91;

        span {
            margin-left: 5px;
            color: white;
        }
    }

    .dc-object-passport__location {
        padding-left: $icon-left-padding;
        background: url("../../assets/img/icon-map-pin-white.svg") no-repeat 22px center;
        background-size: 22px;
    }

    .dc-object-passport__location__heading {
        color: #7e8c91;
    }

    .dc-object-passport__location__text {
        color: white;
        text-transform: uppercase;
    }

    .dc-object-passport__descriptions-text {
        margin-top: 5px;
        font-size: 12px;
        line-height: 1.3;
    }
</style>
