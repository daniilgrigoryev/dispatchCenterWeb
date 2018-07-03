<template>
    <el-form label-width="120px" style="padding: 40px;">
      <el-row>
        <el-col :span="8" :offset="8">
          <el-form-item label="Логин:">
            <el-input placeholder="" v-model="userName"></el-input>
          </el-form-item>

          <el-form-item label="Пароль:">
            <el-input type="password" placeholder="" v-model="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="12">
          <el-button v-on:click="authorize" round type="primary">Войти</el-button>
        </el-col>
      </el-row>
    </el-form>
</template>

<script>
  import * as ConstantUtils from './../assets/js/utils/constantUtils';
  import * as RequestEntity from './../assets/js/api/requestEntity';
  import Fingerprint from "./../assets/js/vendor/fingerprint";
  import {RequstApi} from './../assets/js/api/requestApi';
  import * as funcUtils from "./../assets/js/utils/funcUtils";

  export default {
    name: 'Authorization',
    data() {
      return {
        userName: '',
        password: ''
      }
    },

    methods: {
      authorize: function () {
        // debugger;
        if (this.userName !== '' && this.password !== '') {
          let loginParams = new RequestEntity.LoginParams(new Fingerprint().get(), funcUtils.webGlId(), navigator.platform, navigator.userAgent, null, this.userName, null, this.password);
          let requestHead = new RequestEntity.RequestHead(null, sessionStorage.getItem('wid'), null, null, 'login');
          let requestParam = new RequestEntity.RequestParam(requestHead, loginParams);
          let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
          if (eventResponse.status === 200) {
            let data = eventResponse.response;
            if (data.length > 0) {
              let dataJson = JSON.parse(data);
              let respData = dataJson.data;
              let respError = dataJson.error;
              if (null !== respData) {
                if (dataJson.method === 'login') {
                  localStorage.setItem('auth', 'true');
                  localStorage.setItem('sid', respData.sid);
                  if (null === sessionStorage.getItem(sessionStorage.getItem('wid'))) {
                    sessionStorage.setItem((sessionStorage.getItem('wid')), '[]');
                  }
                  this.$root.activateTimer();
                }
              } else {
                alert(respError.errorMsg);
              }
            }
          }
          if (undefined !== localStorage.getItem('sid') && null !== localStorage.getItem('sid')) {
            let temp = new RequestEntity.RequestParam(new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'addWID'), null);
            RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_WS, temp, this);
            this.$router.push('/monitorDict');
          }
        } else {
          let message = '';
          if (this.userName === '') {
            message += 'Не заполнен логин!\n\r';
          }
          if (this.password === '') {
            message += 'Не заполнен пароль!';
          }
          alert(message);
        }
      }
    }
  }
</script>
