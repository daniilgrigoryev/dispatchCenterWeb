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

    <div id="object-map" class="dc-object-passport__map"></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import supercluster from 'supercluster'
  import iconCamera from '../../assets/img/map-cam-b.svg'

  export default {
    name: "object-passport-map",
    props: {
      title: {
        type: String
      }
    },
    data: function () {
      return {
        map: null
      }
    },
    methods: {
      createMap: function (data) {
        this.map = new mapboxgl.Map(
          {
            container: 'object-map',
            style: 'http://172.20.255.199:8080/facecontrol-api/map/styles/facecontrol-dark/style.json?optimize=true',
            center: [data.gps_y, data.gps_x],
            zoom: 15,
            hash: false,
            showCompass: false,
          }
        );
        let map = this.map;
        map.on('style.load', () => {
          let poi = new Image(52, 52);
          poi.onload = () => {
            map.addImage('iconCamera', poi);
          };
          poi.src = iconCamera;
          map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": [{
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [data.gps_y, data.gps_x]
                  }
                }]
              }
            },
            "layout": {
              "icon-image": "iconCamera",
              "icon-size": 0.5
            }
          });

        });
      },
    },
    mounted: function () {
      let vm = this;
      this.$store.watch(this.$store.getters.objectViewDataGetData, state => {
        vm.createMap(state);
      });
    }
  }
</script>

<style lang="scss">
  .dc-object-passport__map {
    position: absolute;
    top: 32px;
    bottom: 0;
    left: 0;
    right: 0;

    .mapboxgl-missing-css {
      display: none;
    }
  }
</style>
