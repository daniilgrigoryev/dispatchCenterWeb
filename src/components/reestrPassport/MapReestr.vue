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
            <h1>Список мониторов</h1>
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

      <!--Область контента-->
      <el-main class="dc-page-content">
        <div id="cameras-map" class="dc-object-passport__map"></div>
        <div style="width: 400px; height: calc(100vh - 32px); position: relative; background: black; opacity: 0.6;">
          <div id="cameras-list" style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow-y: auto;">

          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import * as RequestEntity from './../../assets/js/api/requestEntity';
  import {RequstApi} from './../../assets/js/api/requestApi';
  import * as funcUtils from "./../../assets/js/utils/funcUtils";
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout
  import PageAside from "./../SharedWidgets/PageAside";
  import iconCamera from '../../assets/img/map-cam-b.svg'
  import * as ConstantUtils from './../../assets/js/utils/constantUtils';
  import mapboxgl from 'mapbox-gl'
  import supercluster from 'supercluster'

  export default {
    name: "MapReestr",
    components: {
      PageAside,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    mounted: function () {
      let vm = this;
      let wid = sessionStorage.getItem('wid');
      let cameraReestr = funcUtils.getfromLocalStorage('cameraReestr');
      vm.$store.watch(vm.$store.getters.cameraReestrGetData, state => {
        if (state.isMap && !vm.map) {
          vm.createMap(state);
        }
      });
      vm.$store.watch(vm.$store.getters.cameraReestrGetCommand, state => {
        vm.updateOnCommand(state);
      });

      let getData = (methodName) => {
        let cid = cameraReestr;
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, vm.$store.state.cameraReestr.bean, methodName);
        let requestParam = new RequestEntity.RequestParam(requestHead, {filter: null});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              vm.$store.dispatch('fillModule', {'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      };
      if (funcUtils.isNull(cameraReestr)) {
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, vm.$store.state.cameraReestr.bean, null);
        let requestParam = new RequestEntity.RequestParam(requestHead, null);
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              let data = eventResponse.response;
              if (data.length > 0) {
                let dataJson = JSON.parse(data);
                let respData = dataJson.data;
                let respError = dataJson.error;
                if (!funcUtils.isNull(respData)) {
                  if (dataJson.method === 'addCID') {
                    vm.$store.dispatch('cameraReestrSetCid', respData.cid);
                    cameraReestr = respData.cid;
                    funcUtils.addToLocalStorage('cameraReestr', cameraReestr);
                    getData('getData');
                  }
                } else {
                  if (!funcUtils.isNull(respError)) {
                    alert(respError.errorMsg);
                  }
                }
              }
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      } else {
        getData('restore');
      }
    },
    data() {
      return {
        headerSwitch: false,
        map: null
      }
    },
    computed: {
      mapData: function () {
        return this.$store.state.cameraReestr.data
      }
    },
    methods: {
      createMap: function (data) {
        let vm = this;
        this.map = new mapboxgl.Map(
          {
            container: 'cameras-map',
            style: ConstantUtils.MAP_STYLE,
            center: [data.centerLng, data.centerLat],
            zoom: data.zoom,
            hash: false,
            showCompass: false,
          }
        );
        let map = this.map;
        let layer = {
          "id": "points",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": []
            }
          },
          "layout": {
            "icon-image": "iconCamera",
            "icon-size": 0.5
          }
        };
        let cameras = data.data;
        cameras.forEach((camera) => {
          /*if (vm.isVisible([camera.camera.lng, camera.camera.lat])) {
            let feature = {
              'properties': {
                "camera": camera
              },
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [camera.camera.lng, camera.camera.lat]
              }
            };
            layer.source.data.features.push(feature);
          }*/
          let feature = {
            'properties': {
              "camera": camera
            },
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [camera.camera.lng, camera.camera.lat]
            }
          };
          layer.source.data.features.push(feature);
        });
        let canvas = map.getCanvasContainer();
        map.on('style.load', () => {
          let poi = new Image(52, 52);
          poi.onload = () => {
            map.addImage('iconCamera', poi);
          };
          poi.src = iconCamera;
          map.addLayer(layer);
        });
        map.on('click', 'points', (e) => {
          let camera = e.features[0].properties.camera;
          if (funcUtils.isNotEmpty(camera)) {
            let parsedCamera = JSON.parse(camera);
            let camerasList = document.getElementById('cameras-list');
            camerasList.innerHTML += `<div id="${parsedCamera.camera.id}" style="display: flex; flex-direction: column;"><span style="color: white; word-break: break-word;">${camera}</span><button style="color: white; border: 1px solid white" type="button" onclick="document.getElementById(${parsedCamera.camera.id}).remove();">Remove</button></div>`;
          }
        });
        map.on('moveend', function () {
          let wid = sessionStorage.getItem('wid');
          let cid = funcUtils.getfromLocalStorage('cameraReestr');
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, vm.$store.state.cameraReestr.bean, 'changeMap');
          let requestParam = new RequestEntity.RequestParam(requestHead, {
            lat: vm.map.getCenter().lat,
            lng: vm.map.getCenter().lng,
            zoom: vm.map.getZoom()
          });
          RequstApi.sendHttpRequest(requestParam);
        });
      },
      // проверяет, входит ли заданная точка в область видимо экрана на карте
      isVisible: function (coords, leftBottomCoords, topRightCoords) {
        let southWestCoords = leftBottomCoords || this.map.getBounds().getSouthWest();
        let northEastCoords = topRightCoords || this.map.getBounds().getNorthEast();
        return coords[0] > southWestCoords.lng &&
          coords[0] < northEastCoords.lng &&
          coords[1] > southWestCoords.lat &&
          coords[1] < northEastCoords.lat;
      }
    },
  }
</script>

<style lang="scss">
  $-dc-main-aside--collapsed-width: 72px;
  $-dc-color-bg-1: rgba(40, 40, 46, 0.65);

  .dc-object-passport__map {
    position: absolute;
    top: 32px;
    bottom: 0;
    left: 72px;
    right: 0;

    .mapboxgl-missing-css {
      display: none;
    }
  }

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

  /* Тайл грида */
  .dc-widget-grid__item {
    background: $-dc-color-bg-1;
    border-radius: 4px;

    .dc-widget-grid__item__header {
      display: flex;
      align-items: flex-start;
      padding: 4px;
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
      background: #7e8c91 url("../../assets/img/logo-menu.svg") no-repeat center;
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
