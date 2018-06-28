<template></template>

<script>
  import * as ConstantUtils from './../assets/js/utils/constantUtils';
  export default {
    name: "RequestApi",
    data () {
      return {};
    },
    methods: {
      sendRequest: (type, body) => {
        debugger;
        let json = JSON.stringify(body);
        if (type === ConstantUtils.REQUEST_TYPE_HTTP) {
          this.__sendHttpRequest__(json);
        } else if (type === ConstantUtils.REQUEST_TYPE_WS) {
          this.__sendSocketRequest__(json);
        }
      },
      __sendSocketRequest__: (body) => {
        debugger;
        if (undefined === this.socketInstance || null === this.socketInstance) {
          this.socketInstance = new WebSocket(ConstantUtils.WS_URL);
          // When a connection is made
          this.socketInstance.onopen = () => {
            console.log('Opened connection');
          };

          let self = this;
          // When data is received
          this.socketInstance.onmessage = (event) => {
            debugger;
            let t = self;
            console.log(event.data);
          };

          // A connection could not be made
          this.socketInstance.onerror = (event) => {
            console.log(event);
          };

          // A connection was closed
          this.socketInstance.onclose = (code, reason) => {
            console.log(code, reason);
            this.socketInstance = null;
          };
          // Close the connection when the window is closed
          window.addEventListener('beforeunload', () => {
            this.socketInstance.close();
          });
        }
        this.socketInstance.send(body);
      },
      __sendHttpRequest__: (body) => {
        debugger;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', ConstantUtils.HTTP_URL, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = (e) => {
          let respEvent = e.currentTarget;
          let response = respEvent.response;
          if (respEvent.status === 200) {
            sessionStorage.auth = true;
          }
        };
        xhr.send(body);
      }
    }
  }
</script>
