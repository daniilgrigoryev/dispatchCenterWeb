import * as ConstantUtils from './../utils/constantUtils';

export class RequstApi {
  static sendRequest(type, body, selfStore) {
    let json = JSON.stringify(body);
    if (type === ConstantUtils.REQUEST_TYPE_HTTP) {
      return this.__sendHttpRequest__(json);
    } else if (type === ConstantUtils.REQUEST_TYPE_WS) {
      this.__sendSocketRequest__(json, selfStore);
    }
  }

  static __sendSocketRequest__(body, selfStore) {
    if (undefined === this.socketInstance || null === this.socketInstance) {
      this.socketInstance = new WebSocket(ConstantUtils.WS_URL);
      // When a connection is made
      this.socketInstance.onopen = () => {
        console.log('Opened connection');
      };

      // When data is received
      this.socketInstance.onmessage = (event) => {
        selfStore.$store.dispatch('fillModule', {'selfStore': selfStore, 'event': event});
      };

      // A connection could not be made
      this.socketInstance.onerror = (event) => {
        console.log(event);
      };

      // A connection was closed
      this.socketInstance.onclose = (code, reason) => {
        console.log(code, reason);
        this.socketInstance = null;
        if (localStorage.auth === 'true') {
          this.socketInstance = new WebSocket(ConstantUtils.WS_URL);
        }
      };
      // Close the connection when the window is closed
      window.addEventListener('beforeunload', () => {
        this.socketInstance.close();
        this.socketInstance = null;
      });
    }
    let wsSend = (data) => {
      if (!this.socketInstance.readyState) {
        setTimeout(() => {
          wsSend(data);
        }, 100);
      } else {
        this.socketInstance.send(data);
      }
    };
    wsSend(body);
  }

  static __sendHttpRequest__(body) {
    let res = null;
    // let startTime = new Date().getTime();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', ConstantUtils.HTTP_URL, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
      res = e.currentTarget;
    };
    xhr.send(body);
/*    let difference = new Date().getTime() - startTime;
    while ((undefined === res || null === res) && difference < 5000) {
      setTimeout(() => {
        difference = new Date().getTime() - startTime;
      }, 100);
    }*/
    return res;
  }
}
