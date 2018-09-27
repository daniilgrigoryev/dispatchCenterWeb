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
        <el-radio-group v-model="cameraColors"
                        style="position: absolute; left: 45%; z-index: 10;background: black; top: 40px;">
          <el-radio :label="1">По последнему алерту</el-radio>
          <el-radio :label="2">По максимальному уровню алерта</el-radio>
        </el-radio-group>
        <div id="cameras-map" class="dc-object-passport__map"></div>
        <div id="cameras-list"
             style="width: 400px; height: calc(100vh - 32px); position: relative; background: black; opacity: 0.6; display: flex; flex-direction: column; overflow-y: auto; z-index: 3">
          <span v-if="cameras !== null" @click="selectCamera(camera)" :id="camera.id"
                v-for="(camera) in cameras"
                style="padding-bottom: 25px; border-bottom: 1px solid white; color: white; word-break: break-word;">{{camera}}</span>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import * as RequestEntity from './../../assets/js/api/requestEntity';
  import {RequstApi} from './../../assets/js/api/requestApi';
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout
  import PageAside from "./../SharedWidgets/PageAside";
  import iconCamera from '../../assets/img/map-cam-b.svg'
  import iconCameraLev1 from '../../assets/img/map-cam-b-level-1.svg'
  import iconCameraLev2 from '../../assets/img/map-cam-b-level-2.svg'
  import iconCameraLev3 from '../../assets/img/map-cam-b-level-3.svg'
  import iconCameraLev4 from '../../assets/img/map-cam-b-level-4.svg'
  import iconCameraLev5 from '../../assets/img/map-cam-b-level-5.svg'
  import iconCameraSelected from '../../assets/img/camera-select-map.svg'
  import * as ConstantUtils from './../../assets/js/utils/constantUtils';
  import mapboxgl from 'mapbox-gl'
  import '../../assets/mapbox/mapbox-gl.css'
  import supercluster from 'supercluster'
  import * as funcUtils from "~/assets/js/utils/funcUtils";

  export default {
    name: "MapReestr",
    components: {
      PageAside,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    mounted: function () {
      let cameras = document.getElementById('cameras-list');
      if (funcUtils.isNotEmpty(cameras)) {
        cameras.addEventListener('scroll', this.handleScroll);
      }

      let vm = this;
      let wid = sessionStorage.getItem('wid');
      let cameraReestr = funcUtils.getfromLocalStorage('cameraReestr');
      vm.$store.watch(vm.$store.getters.cameraReestrGetData, state => {
        if (state.isMap && !vm.map) {
          vm.setCurrentCoord(state);
          vm.selectedCameras = state.select;
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
        map: null,
        selectedCameras: [],
        scrollCount: 40,
        cameraColors: 1,
        mapCoord: {},
        layers: {},
        clusterLayers: {},
        allFeatures: [],
        observersSuperCluster: null,
        cameraIdsInClusters: []
      }
    },
    computed: {
      cameras: function () {
        let res = null;
        let data = this.$store.state.cameraReestr.data;
        if (data) {
          res = [];
          let cameras = data.data.filter((item) => {
            return funcUtils.isNotEmpty(item.camera.lat) && funcUtils.isNotEmpty(item.camera.lng);
          });
          for (let i = 0; i < this.scrollCount; i++) {
            let camera = cameras[i];
            res.push(camera);
          }
        }
        return res;
      }
    },
    watch: {
      // whenever question changes, this function will run
      cameraColors: function () {
        this.drawCluster();
        this.drawCameras();
      }
    },
    methods: {
      handleScroll() {
        if (this.checkScroll()) {
          this.scrollCount += 40;
        }
      },
      checkScroll() {
        let cameras = document.getElementById('cameras-list');
        return (cameras.offsetHeight + cameras.scrollTop >= cameras.scrollHeight);
      },
      updateOnCommand: function (resp) {
        let wid = sessionStorage.getItem('wid');
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, resp.cid, this.$store.state.cameraReestr.bean, 'restore');
        let requestParam = new RequestEntity.RequestParam(requestHead, {filter: null});
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
      cameraInCluster(cameraId) {
        let res = false;
        let clusterFeatures = this.getClusterFeatures();
        for (let i = 0; i < clusterFeatures.length; i++) {
          let item = clusterFeatures[i];
          let cluster_id = item.properties.cluster_id;
          if (cluster_id != null) { // если это кластер
            let leaves = this.observersSuperCluster.getLeaves(cluster_id, Infinity);
            for (let j = 0; j < leaves.length; j++) {
              let item2 = leaves[j];
              res = item2.properties.camera.camera.id === cameraId;
              if (res) return res;
            }
          }
        }
        return res;
      },
      getPieSvg(num, st0, st1, st2, st3, st4, st5, selected) {
        function rotate(xy, cxy, angle) {
          let radians = angle / 180 * Math.PI;
          let cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (xy[0] - cxy[0])) + (sin * (xy[1] - cxy[1])) + cxy[0],
            ny = (cos * (xy[1] - cxy[1])) - (sin * (xy[0] - cxy[0])) + cxy[1];
          let res = [nx, ny];
          return res;
        }

        let pieIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 -2 52 52">' +
          '<circle r="#rad" cx="25" cy="25" fill="circleColor" />' +
          '<path d="M 25,25 l #st0_beg# a#rad,#rad 0 #st0_ang#,0 #st0_end# z" fill="#FFFFFF" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<path d="M 25,25 l #st1_beg# a#rad,#rad 0 #st1_ang#,0 #st1_end# z" fill="#406677" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<path d="M 25,25 l #st2_beg# a#rad,#rad 0 #st2_ang#,0 #st2_end# z" fill="#0FAC56" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<path d="M 25,25 l #st3_beg# a#rad,#rad 0 #st3_ang#,0 #st3_end# z" fill="#D89A0F" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<path d="M 25,25 l #st4_beg# a#rad,#rad 0 #st4_ang#,0 #st4_end# z" fill="#D85803" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<path d="M 25,25 l #st5_beg# a#rad,#rad 0 #st5_ang#,0 #st5_end# z" fill="#BC1B0A" stroke="black" stroke-width="0" stroke-linejoin="round"/>' +
          '<circle r="#rw" cx="25" cy="25" fill="fillColor" />' +
          '</svg>';

        let all = num;
        let rad = 20;
        let rw = 15;
        /*if (all < 10) {
          rad = 16;
          rw = 9;
        } else if (all < 30) {
          rad = 20;
        } else if (all < 60) {
          rad = 23;
        }*/

        if (st1 === 0 && st2 === 0 && st3 === 0 && st4 === 0 && st5 === 0 && st0 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#FFFFFF');
        } else if (st0 === 0 && st2 === 0 && st3 === 0 && st4 === 0 && st5 === 0 && st1 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#406677');
        } else if (st0 === 0 && st1 === 0 && st3 === 0 && st4 === 0 && st5 === 0 && st2 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#0FAC56');
        } else if (st0 === 0 && st1 === 0 && st2 === 0 && st4 === 0 && st5 === 0 && st3 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#D89A0F');
        } else if (st0 === 0 && st1 === 0 && st2 === 0 && st3 === 0 && st5 === 0 && st4 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#D85803');
        } else if (st0 === 0 && st1 === 0 && st2 === 0 && st3 === 0 && st4 === 0 && st5 > 0) {
          pieIcon = pieIcon.replace('circleColor', '#BC1B0A');
        } else {
          pieIcon = pieIcon.replace('circleColor', '#666');
        }

        st0 = 360 * st0 / all;
        st1 = 360 * st1 / all;
        st2 = 360 * st2 / all;
        st3 = 360 * st3 / all;
        st4 = 360 * st4 / all;
        st5 = 360 * st5 / all;
        let st0_a = 0;
        let st1_a = 0;
        let st2_a = 0;
        let st3_a = 0;
        let st4_a = 0;
        let st5_a = 0;
        if (st0 > 0 && st0 < 10) {
          st0 = 15;
        }
        if (st1 > 0 && st1 < 10) {
          st1 = 15;
        }
        if (st2 > 0 && st2 < 10) {
          st2 = 15;
        }
        if (st3 > 0 && st3 < 10) {
          st3 = 15;
        }
        if (st4 > 0 && st4 < 10) {
          st4 = 15;
        }
        if (st5 > 0 && st5 < 10) {
          st5 = 15;
        }
        all = st0 + st1 + st2 + st3 + st4 + st5;
        st0 = 360 * st0 / all;
        st1 = 360 * st1 / all;
        st2 = 360 * st2 / all;
        st3 = 360 * st3 / all;
        st4 = 360 * st4 / all;
        st5 = 360 * st5 / all;
        if (st0 > 180) {
          st0_a = 1;
        }
        if (st1 > 180) {
          st1_a = 1;
        }
        if (st2 > 180) {
          st2_a = 1;
        }
        if (st3 > 180) {
          st3_a = 1;
        }
        if (st4 > 180) {
          st4_a = 1;
        }
        if (st5 > 180) {
          st5_a = 1;
        }

        if (st0 > 359) {
          st0 = 359;
        }
        if (st1 > 359) {
          st1 = 359;
        }
        if (st2 > 359) {
          st2 = 359;
        }
        if (st3 > 359) {
          st3 = 359;
        }
        if (st4 > 359) {
          st4 = 359;
        }
        if (st5 > 359) {
          st5 = 359;
        }

        let st0_beg = [rad, 0];
        let st0_end = rotate([rad, 0], [rad, rad], st0);
        st0_end[0] = st0_end[0] - st0_beg[0];
        st0_end[1] = st0_end[1] - st0_beg[1];
        st0_beg[0] = st0_beg[0] - rad;
        st0_beg[1] = st0_beg[1] - rad;
        all = st0;

        let st1_beg = rotate([rad, 0], [rad, rad], all);
        let st1_end = rotate([rad, 0], [rad, rad], all + st1);
        st1_end[0] = st1_end[0] - st1_beg[0];
        st1_end[1] = st1_end[1] - st1_beg[1];
        st1_beg[0] = st1_beg[0] - rad;
        st1_beg[1] = st1_beg[1] - rad;
        all = all + st1;

        let st2_beg = rotate([rad, 0], [rad, rad], all);
        let st2_end = rotate([rad, 0], [rad, rad], all + st2);
        st2_end[0] = st2_end[0] - st2_beg[0];
        st2_end[1] = st2_end[1] - st2_beg[1];
        st2_beg[0] = st2_beg[0] - rad;
        st2_beg[1] = st2_beg[1] - rad;
        all = all + st2;

        let st3_beg = rotate([rad, 0], [rad, rad], all);
        let st3_end = rotate([rad, 0], [rad, rad], all + st3);
        st3_end[0] = st3_end[0] - st3_beg[0];
        st3_end[1] = st3_end[1] - st3_beg[1];
        st3_beg[0] = st3_beg[0] - rad;
        st3_beg[1] = st3_beg[1] - rad;
        all = all + st3;

        let st4_beg = rotate([rad, 0], [rad, rad], all);
        let st4_end = rotate([rad, 0], [rad, rad], all + st4);
        st4_end[0] = st4_end[0] - st4_beg[0];
        st4_end[1] = st4_end[1] - st4_beg[1];
        st4_beg[0] = st4_beg[0] - rad;
        st4_beg[1] = st4_beg[1] - rad;
        all = all + st4;

        let st5_beg = rotate([rad, 0], [rad, rad], all);
        let st5_end = rotate([rad, 0], [rad, rad], all + st5);
        st5_end[0] = st5_end[0] - st5_beg[0];
        st5_end[1] = st5_end[1] - st5_beg[1];
        st5_beg[0] = st5_beg[0] - rad;
        st5_beg[1] = st5_beg[1] - rad;
        all = all + st5;

        let res = pieIcon;
        res = res.replace('#st5_beg#', st5_beg[0] + ',' + st5_beg[1]).replace('#st5_end#', st5_end[0] + ',' + st5_end[1]);
        res = res.replace('#st4_beg#', st4_beg[0] + ',' + st4_beg[1]).replace('#st4_end#', st4_end[0] + ',' + st4_end[1]);
        res = res.replace('#st3_beg#', st3_beg[0] + ',' + st3_beg[1]).replace('#st3_end#', st3_end[0] + ',' + st3_end[1]);
        res = res.replace('#st2_beg#', st2_beg[0] + ',' + st2_beg[1]).replace('#st2_end#', st2_end[0] + ',' + st2_end[1]);
        res = res.replace('#st1_beg#', st1_beg[0] + ',' + st1_beg[1]).replace('#st1_end#', st1_end[0] + ',' + st1_end[1]);
        res = res.replace('#st0_beg#', st0_beg[0] + ',' + st0_beg[1]).replace('#st0_end#', st0_end[0] + ',' + st0_end[1]);
        res = res.replace('#st5_ang#', st5_a).replace('#st4_ang#', st4_a).replace('#st3_ang#', st3_a).replace('#st2_ang#', st2_a).replace('#st1_ang#', st1_a).replace('#st0_ang#', st0_a);
        res = res.replace(new RegExp('#rad', 'g'), rad);
        res = res.replace('#rw', rw);
        if (selected) {
          res = res.replace('fillColor', '#00bcd4');
        } else {
          res = res.replace('fillColor', '#E2E0E0');
        }

        return res;
      },
      selectCluster(feature) {
        let clusterZoom = 13;
        let zoom = this.observersSuperCluster.getClusterExpansionZoom(feature.properties.cluster_id);
        let mapZoom = this.map.getZoom();
        if (zoom === clusterZoom && mapZoom === clusterZoom || zoom < mapZoom) {
          zoom = clusterZoom + 1;
        }
        this.map.flyTo({
          center: feature.geometry.coordinates,
          zoom: zoom,
          bearing: 0,
          easing: function (t) {
            return t;
          }
        });
      },
      selectCamera: function (camera) {
        this.clearSelectedCamera();
        this.selectedCameras.push(camera.camera.id);
        let cameraInCluster = this.cameraInCluster(camera.camera.id);
        this.map.flyTo({
          center: [camera.camera.lng, camera.camera.lat],
          zoom: 15,
          bearing: 0,
          easing: function (t) {
            return t;
          }
        });
        if (cameraInCluster) return;
        let cameraEl = document.getElementById(camera.camera.id);
        if (cameraEl) {
          cameraEl.className += ' iconCameraSelected';
        }
        let wid = sessionStorage.getItem('wid');
        let cid = funcUtils.getfromLocalStorage('cameraReestr');
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.cameraReestr.bean, 'selectObjects');
        let requestParam = new RequestEntity.RequestParam(requestHead, {ids: this.selectedCameras});
        RequstApi.sendHttpRequest(requestParam, false);
      },
      createMap: function () {
        let vm = this;
        this.map = new mapboxgl.Map({
            container: 'cameras-map',
            style: ConstantUtils.MAP_STYLE,
            center: [this.mapCoord.centerLng, this.mapCoord.centerLat],
            zoom: this.mapCoord.zoom,
            hash: false,
            showCompass: false,
          }
        );
        this.map.addControl(new mapboxgl.NavigationControl());
        this.map.on('style.load', () => {
          // vm.addImage();
          vm.fakeLayer();
          vm.drawCluster();
          vm.drawCameras();
          vm.map.on('moveend', () => {
            let lat = vm.map.getCenter().lat;
            let lng = vm.map.getCenter().lng;
            let zoom = vm.map.getZoom();
            vm.setCurrentCoord({
              centerLat: lat,
              centerLng: lng,
              zoom: zoom
            });
            let wid = sessionStorage.getItem('wid');
            let cid = funcUtils.getfromLocalStorage('cameraReestr');
            let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, vm.$store.state.cameraReestr.bean, 'changeMap');
            let requestParam = new RequestEntity.RequestParam(requestHead, {
              lat: lat,
              lng: lng,
              zoom: zoom
            });
            RequstApi.sendHttpRequest(requestParam, false);
            vm.fakeLayer();
            vm.drawCluster();
            vm.drawCameras();
          });
        });
      },
      getHtmlForCluster: function (num, a, b, c, d, e, f) {
        let resultHtml = '';
        resultHtml += '<div class="pie">';
        if (a <= 180) {
          resultHtml += '<div class="pie_common slice slice_0_c">';
          resultHtml += `<div style="transform: rotate(${-(180 - a)}deg);" class="pie_common slice slice_0_w"></div>`;
          resultHtml += '</div>';
        }
        if (a > 180) {
          resultHtml += '<div class="pie_common slice slice_0_c">';
          resultHtml += `<div style="transform: rotate(${-(180 - a / 2)}deg);" class="pie_common slice slice_0_w"></div>`;
          resultHtml += '</div>';

          resultHtml += `<div style="transform: rotate(${(90 + a / 2)}deg);" class="pie_common slice slice_0_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - a / 2)}deg);" class="pie_common slice slice_0_w"></div>`;
          resultHtml += `</div>`;
        }

        if (b <= 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a)}deg);" class="pie_common slice slice_1_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - b)}deg);" class="pie_common slice slice_1_w"></div>`;
          resultHtml += `</div>`;
        }
        if (b > 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a)}deg);" class="pie_common slice slice_1_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - b / 2)}deg);" class="pie_common slice slice_1_w"></div>`;
          resultHtml += `</div>`;

          resultHtml += `<div style="transform: rotate(${(90 + a + b / 2)}deg);" class="pie_common slice slice_1_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - b / 2)}deg);" class="pie_common slice slice_1_w"></div>`;
          resultHtml += `</div>`;
        }

        if (c <= 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b)}deg);" class="pie_common slice slice_2_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - c)}deg);" class="pie_common slice slice_2_w"></div>`;
          resultHtml += `</div>`;
        }
        if (c > 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b)}deg);" class="pie_common slice slice_2_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - c / 2)}deg);" class="pie_common slice slice_2_w"></div>`;
          resultHtml += `</div>`;

          resultHtml += `<div style="transform: rotate(${(90 + a + b + c / 2)}deg);" class="pie_common slice slice_2_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - c / 2)}deg);" class="pie_common slice slice_2_w"></div>`;
          resultHtml += `</div>`;
        }

        if (d <= 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c)}deg);" class="pie_common slice slice_3_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - d)}deg);" class="pie_common slice slice_3_w"></div>`;
          resultHtml += `</div>`;
        }
        if (d > 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c)}deg);" class="pie_common slice slice_3_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - d / 2)}deg);" class="pie_common slice slice_3_w"></div>`;
          resultHtml += `</div>`;

          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d / 2)}deg);" class="pie_common slice slice_3_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - d / 2)}deg);" class="pie_common slice slice_3_w"></div>`;
          resultHtml += `</div>`;
        }

        if (e <= 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d)}deg);" class="pie_common slice slice_4_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - e)}deg);" class="pie_common slice slice_4_w"></div>`;
          resultHtml += `</div>`;
        }
        if (e > 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d)}deg);" class="pie_common slice slice_4_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - e / 2)}deg);" class="pie_common slice slice_4_w"></div>`;
          resultHtml += `</div>`;

          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d + e / 2)}deg);" class="pie_common slice slice_4_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - e / 2)}deg);" class="pie_common slice slice_4_w"></div>`;
          resultHtml += `</div>`;
        }

        if (f <= 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d + e)}deg);" class="pie_common slice slice_5_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - f)}deg);" class="pie_common slice slice_5_w"></div>`;
          resultHtml += `</div>`;
        }
        if (f > 180) {
          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d + e)}deg);" class="pie_common slice slice_5_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - f / 2)}deg);" class="pie_common slice slice_5_w"></div>`;
          resultHtml += `</div>`;

          resultHtml += `<div style="transform: rotate(${(90 + a + b + c + d + e + f / 2)}deg);" class="pie_common slice slice_5_c">`;
          resultHtml += `<div style="transform: rotate(${-(180 - f / 2)}deg);" class="pie_common slice slice_5_w"></div>`;
          resultHtml += `</div>`;
        }
        resultHtml += '<div class="pie_common pie_base"/>';
        resultHtml += `<div class="pie_num">${num}</div>`;
        resultHtml += '</div>';
        return resultHtml;
      },
      fakeLayer() {
        let vm = this;
        let fakeLayer = document.getElementById('fakeLayer');
        if (fakeLayer) {
          fakeLayer.remove();
        }
        let el = document.createElement('div');
        el.id = 'fakeLayer';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style['z-index'] = '1';
        new mapboxgl.Marker(el)
          .setLngLat([this.mapCoord.centerLng, this.mapCoord.centerLat])
          .addTo(this.map);
        el.addEventListener('click', function () {
          vm.clearSelectedCamera();
          vm.clearSelectedCluster();
        });
      },
      clearSelectedCluster() {
        let vm = this;
        let selected = document.querySelectorAll('div[selected="true"]')[0];
        if (selected) {
          document.getElementById(selected.id).remove();
          let selectedCluster = this.getClusterFeatures().filter((feature) => {
            let cluster_id = feature.properties.cluster_id;
            return cluster_id !== null && cluster_id == selected.id;
          })[0];
          let el = document.createElement('div');
          el.className += 'cluster';
          let img_str = this.getPieSvg(selectedCluster.properties.point_count, selectedCluster.properties.status0, selectedCluster.properties.status1, selectedCluster.properties.status2, selectedCluster.properties.status3, selectedCluster.properties.status4, selectedCluster.properties.status5, false);
          el.innerHTML = '<p>' + selectedCluster.properties.point_count +'</p>' +
            '<img src="data:image/svg+xml,' + escape(img_str) + '" />';
          new mapboxgl.Marker(el)
            .setLngLat(selectedCluster.geometry.coordinates)
            .addTo(this.map);
          el.addEventListener('click', function () {
            vm.selectCluster(selectedCluster);
          });
        }
      },
      drawCluster() {
        this.observersSuperCluster = supercluster({
          maxZoom: 13,
          radius: 100,
          initial: function () {
            return {
              status0: 0,
              status1: 0,
              status2: 0,
              status3: 0,
              status4: 0,
              status5: 0,
              selectedCount: 0
            }
          },
          map: function (props) {
            return {
              status0: props.levelCamera === 0 ? 1 : 0,
              status1: props.levelCamera === 1 ? 1 : 0,
              status2: props.levelCamera === 2 ? 1 : 0,
              status3: props.levelCamera === 3 ? 1 : 0,
              status4: props.levelCamera === 4 ? 1 : 0,
              status5: props.levelCamera === 5 ? 1 : 0,
              selectedCount: props.selectedCount === 1 ? 1 : 0
            }
          },
          reduce: function (accumulated, props) {
            accumulated.status0 += props.status0;
            accumulated.status1 += props.status1;
            accumulated.status2 += props.status2;
            accumulated.status3 += props.status3;
            accumulated.status4 += props.status4;
            accumulated.status5 += props.status5;
            accumulated.selectedCount += props.selectedCount;
          }
        });
        document.querySelectorAll('.cluster').forEach(function (cluster) {
          cluster.remove();
        });
        let vm = this;
        this.cameraIdsInClusters = [];
        let clusterFeatures = [];
        let data = this.$store.state.cameraReestr.data;
        let cameras = data.data.filter((item) => {
          return vm.isVisible([item.camera.lng, item.camera.lat]);
        });
        cameras.forEach((camera) => {
          let levelCamera;
          if (!funcUtils.isNull(camera.lastAlarm) && !funcUtils.isNull(camera.maxAlarm)) {
            levelCamera = vm.cameraColors === 1 ? camera.lastAlarm.level : camera.maxAlarm.level;
          } else {
            levelCamera = 0;
          }
          let feature = {
            'properties': {
              "camera": camera,
              "levelCamera": levelCamera,
              "selectedCount": vm.selectedCameras.includes(camera.camera.id) ? 1 : 0,
            },
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [camera.camera.lng, camera.camera.lat]
            }
          };
          clusterFeatures.push(feature);
        });
        this.observersSuperCluster.load(clusterFeatures);
        vm.getClusterFeatures().forEach(item => {
          let cluster_id = item.properties.cluster_id;
          if (cluster_id != null) { // если это кластер
            let selected = item.properties.selectedCount === 1;
            let el = document.createElement('div');
            el.className += 'cluster';
            if (selected) {
              el.id = cluster_id;
              el.setAttribute('selected', selected);
            }
            let full = item.properties.status0 + item.properties.status1 + item.properties.status2 + item.properties.status3 + item.properties.status4 + item.properties.status5;
            let status0 = item.properties.status0 * 100 / full * 3.6;
            let status1 = item.properties.status1 * 100 / full * 3.6;
            let status2 = item.properties.status2 * 100 / full * 3.6;
            let status3 = item.properties.status3 * 100 / full * 3.6;
            let status4 = item.properties.status4 * 100 / full * 3.6;
            let status5 = item.properties.status5 * 100 / full * 3.6;
            // el.innerHTML = this.getHtmlForCluster(item.properties.point_count, status0, status1, status2, status3, status4, status5);
            let img_str = this.getPieSvg(item.properties.point_count, item.properties.status0, item.properties.status1, item.properties.status2, item.properties.status3, item.properties.status4, item.properties.status5, selected);
            el.innerHTML = '<p>' + item.properties.point_count +'</p>' +
                           '<img src="data:image/svg+xml,' + escape(img_str) + '" />';
            /*var mysvg = new Image();
            mysvg.src = 'data:image/svg+xml,' + escape(img_str);
            el.src = 'data:image/svg+xml,' + escape(svg);*/
            new mapboxgl.Marker(el)
              .setLngLat(item.geometry.coordinates)
              .addTo(vm.map);
            el.addEventListener('click', function () {
              vm.selectCluster(item);
            });
            vm.observersSuperCluster.getLeaves(cluster_id, Infinity).forEach(item2 => {
              vm.cameraIdsInClusters.push(item2.properties.camera.camera.id);
            });
          }
        });
      },
      drawCameras() {
        let vm = this;
        let data = this.$store.state.cameraReestr.data;
        let selectedCameras = this.selectedCameras;
        document.querySelectorAll('.marker').forEach(function (marker) {
          marker.remove();
        });
        let cameras = data.data.filter((item) => {
          return vm.isVisible([item.camera.lng, item.camera.lat]);
        });
        cameras.forEach((camera) => {
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
          let levelCamera;
          if (!funcUtils.isNull(camera.lastAlarm) && !funcUtils.isNull(camera.maxAlarm)) {
            levelCamera = this.cameraColors === 1 ? camera.lastAlarm.level : camera.maxAlarm.level;
          } else {
            levelCamera = 0;
          }
          let el = document.createElement('div');
          el.className = 'marker';
          el.setAttribute('id', camera.camera.id);
          el.setAttribute('levelCamera', levelCamera);

          switch (levelCamera) {
            case 1: {
              el.className += ' iconCameraLev1';
              break;
            }
            case 2: {
              el.className += ' iconCameraLev2';
              break;
            }
            case 3: {
              el.className += ' iconCameraLev3';
              break;
            }
            case 4: {
              el.className += ' iconCameraLev4';
              break;
            }
            case 5: {
              el.className += ' iconCameraLev5';
              break;
            }
            default: {
              el.className += ' iconCamera';
              break;
            }
          }

          el.addEventListener('click', function () {
            vm.selectCamera(camera);
          });

          if (!vm.cameraIdsInClusters.includes(camera.camera.id)) {
            if (selectedCameras.includes(camera.camera.id)) {
              el.className += ' iconCameraSelected';
            }
            new mapboxgl.Marker(el)
              .setLngLat(feature.geometry.coordinates)
              .addTo(vm.map);
          }
        });
      },
      addImage() {
        let poiSelected = new Image(52, 52);
        poiSelected.onload = () => {
          this.map.addImage('iconCameraSelected', poiSelected);
        };
        poiSelected.src = iconCameraSelected;

        let poi = new Image(52, 52);
        poi.onload = () => {
          this.map.addImage('iconCamera', poi);
        };
        poi.src = iconCamera;

        let poi1 = new Image(52, 52);
        poi1.onload = () => {
          this.map.addImage('iconCameraLev1', poi1);
        };
        poi1.src = iconCameraLev1;

        let poi2 = new Image(52, 52);
        poi2.onload = () => {
          this.map.addImage('iconCameraLev2', poi2);
        };
        poi2.src = iconCameraLev2;

        let poi3 = new Image(52, 52);
        poi3.onload = () => {
          this.map.addImage('iconCameraLev3', poi3);
        };
        poi3.src = iconCameraLev3;

        let poi4 = new Image(52, 52);
        poi4.onload = () => {
          this.map.addImage('iconCameraLev4', poi4);
        };
        poi4.src = iconCameraLev4;

        let poi5 = new Image(52, 52);
        poi5.onload = () => {
          this.map.addImage('iconCameraLev5', poi5);
        };
        poi5.src = iconCameraLev5;
      },
      getClusterFeatures() {
        /*let coords2 = [];
        let canvas = this.map.getCanvas();
        let w = canvas.width;
        let h = canvas.height;
        coords2[0] = this.map.unproject([0, 0]).toArray();
        coords2[1] = this.map.unproject([0, h]).toArray();
        coords2[2] = this.map.unproject([w, h]).toArray();
        coords2[3] = this.map.unproject([w, 0]).toArray();
        let leftBottom = [coords2[0][0], coords2[0][1]];
        let topRight = [coords2[0][0], coords2[0][1]];
        coords2.forEach(item => {
          if (leftBottom[0] > item[0]) leftBottom[0] = item[0];
          if (leftBottom[1] > item[1]) leftBottom[1] = item[1];
          if (topRight[0] < item[0]) topRight[0] = item[0];
          if (topRight[1] < item[1]) topRight[1] = item[1];
        });*/
        let coords2 = [];
        let canvas = this.map.getCanvas();
        let w = canvas.width;
        let h = canvas.height;
        coords2[0] = this.map.unproject([-50,-50]).toArray();
        coords2[1] = this.map.unproject([-50,h+50]).toArray();
        coords2[2] = this.map.unproject([w+50,h+50]).toArray();
        coords2[3] = this.map.unproject([w+50,-50]).toArray();
        let leftBottom = [coords2[0][0], coords2[0][1]];
        let topRight = [coords2[0][0], coords2[0][1]];
        coords2.forEach(item => {
          if (leftBottom[0] > item[0]) leftBottom[0] = item[0];
          if (leftBottom[1] > item[1]) leftBottom[1] = item[1];
          if (topRight[0] < item[0]) topRight[0] = item[0];
          if (topRight[1] < item[1]) topRight[1] = item[1];
        });
        return this.observersSuperCluster.getClusters([leftBottom[0], leftBottom[1], topRight[0], topRight[1]], Math.floor(this.map.getZoom()));
      },
      clearSelectedCamera() {
        let cameraEl = document.getElementById(this.selectedCameras[0] + '');
        this.selectedCameras = [];
        if (cameraEl) {
          cameraEl.classList.remove('iconCameraSelected');
        }
        let wid = sessionStorage.getItem('wid');
        let cid = funcUtils.getfromLocalStorage('cameraReestr');
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.cameraReestr.bean, 'selectObjects');
        let requestParam = new RequestEntity.RequestParam(requestHead, {ids: this.selectedCameras});
        RequstApi.sendHttpRequest(requestParam, false);
      },
      // проверяет, входит ли заданная точка в область видимо экрана на карте
      isVisible: function (coords, leftBottomCoords, topRightCoords) {
        let southWestCoords = leftBottomCoords || this.map.getBounds().getSouthWest();
        let northEastCoords = topRightCoords || this.map.getBounds().getNorthEast();
        return coords[0] > southWestCoords.lng &&
          coords[0] < northEastCoords.lng &&
          coords[1] > southWestCoords.lat &&
          coords[1] < northEastCoords.lat;
      },
      setCurrentCoord(data) {
        this.mapCoord.centerLat = data.centerLat;
        this.mapCoord.centerLng = data.centerLng;
        this.mapCoord.zoom = data.zoom;
      }
    },
  }
</script>

<style lang="scss">
  $-dc-main-aside--collapsed-width: 72px;
  $-dc-color-bg-1: rgba(40, 40, 46, 0.65);

  .marker {
    width: 20px;
    height: 20px;
    z-index: 2;

    &.iconCameraLev1 {
      background: url('../../assets/img/map-cam-b-level-1.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCameraLev2 {
      background: url('../../assets/img/map-cam-b-level-2.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCameraLev3 {
      background: url('../../assets/img/map-cam-b-level-3.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCameraLev4 {
      background: url('../../assets/img/map-cam-b-level-4.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCameraLev5 {
      background: url('../../assets/img/map-cam-b-level-5.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCamera {
      background: url('../../assets/img/map-cam-b.svg') no-repeat center;
      background-size: contain;
    }
    &.iconCameraSelected {
      background: url('../../assets/img/camera-select-map.svg') no-repeat center !important;
      z-index: 3 !important;
    }
  }

  .cluster {
    width: 54px;
    height: 54px;
    z-index: 3;

    p {
      position: absolute;
      top: 25%;
      right: 7%;
      font-size: 100%;
      line-height: 2;
      letter-spacing: -1px;
      color: #1a3042;
      text-align: center;
      font-family: 'GothamPro', sans-serif;
      font-weight: 600;
      width: 100%;
      height: 100%;
    }
  }

  .pie {
    /*margin: 50px;*/
    /*opacity: 0.7;*/
    /* margin: -11px 0 0 -11px; */
    position: relative;
    /*По размерам надо смотреть*/
    height: 48px;
    width: 48px;
  }

  .pie_common {
    position: absolute;
    height: inherit;
    width: inherit;
    border-radius: 50%;
  }

  .pie_base {
    position: relative;
    width: 54px;
    height: 54px;
    background: url('../../assets/img/cluster_frame_b.svg') no-repeat center;
    background-size: contain;
  }

  .pie_num {
    position: absolute;
    top: 8px;
    font-size: 14px;
    line-height: 2;
    letter-spacing: -1px;
    color: #1a3042;
    text-align: center;
    font-family: 'GothamPro', sans-serif;
    font-weight: 500;
    width: 100%;
    height: 100%;
  }

  .slice {
    clip: rect(0px, 24px, 48px, 0px);
    z-index: 3;
  }

  .slice_0_c {
    transform: rotate(90deg);
    margin: 3px;
  }

  .slice_0_w {
    border: 4px solid #FFFFFF;
  }

  .slice_1_c {
    margin: 3px;
  }

  .slice_1_w {
    border: 4px solid #406677;
  }

  .slice_2_c {
    margin: 3px;
  }

  .slice_2_w {
    border: 4px solid #0FAC56;
  }

  .slice_3_c {
    margin: 3px;
  }

  .slice_3_w {
    border: 4px solid #D89A0F;
  }

  .slice_4_c {
    margin: 3px;
  }

  .slice_4_w {
    border: 4px solid #D85803;
  }

  .slice_5_c {
    margin: 3px;
  }

  .slice_5_w {
    border: 4px solid #BC1B0A;
  }

  .dc-object-passport__map {
    position: absolute;
    top: 32px;
    bottom: 0;
    left: 472px;
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
