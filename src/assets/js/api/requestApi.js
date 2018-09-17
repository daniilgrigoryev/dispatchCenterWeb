import * as ConstantUtils from './../utils/constantUtils';
import $ from "jquery";
import {Spinner} from 'spin.js';
import * as funcUtils from "~/assets/js/utils/funcUtils";

export class RequstApi {
  static sendSocketRequest(body, selfStore) {
    if (funcUtils.isEmpty(this.socketInstance)) {
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
    wsSend(JSON.stringify(body));
  }

  static sendHttpRequest(body, withSpinner = true) {
    let spinner;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: ConstantUtils.HTTP_URL,
        type: 'post',
        async: true,
        timeout: 120000,
        contentType: 'application/json',
        data: JSON.stringify(body),
        beforeSend: () => {
          if (withSpinner) {
            let opts = {
              lines: 13, // The number of lines to draw
              length: 38, // The length of each line
              width: 17, // The line thickness
              radius: 45, // The radius of the inner circle
              scale: 0.85, // Scales overall size of the spinner
              corners: 1, // Corner roundness (0..1)
              color: '#ffffff', // CSS color or array of colors
              fadeColor: 'transparent', // CSS color or array of colors
              speed: 0.7, // Rounds per second
              rotate: 0, // The rotation offset
              animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
              direction: 1, // 1: clockwise, -1: counterclockwise
              zIndex: 2e9, // The z-index (defaults to 2000000000)
              className: 'spinner', // The CSS class to assign to the spinner
              top: '50%', // Top position relative to parent
              left: '50%', // Left position relative to parent
              shadow: '0 0 1px transparent', // Box-shadow for the lines
              position: 'absolute' // Element positioning
            };
            let target = document.getElementById('indicator');
            $('#indicator').show();
            spinner = new Spinner(opts).spin(target);
          }
        },
        success: (data) => {
          // перевод Promise в состояние fulfilled.
          resolve({
            status: 200,
            response: JSON.stringify(data)
          });
        },
        error: (data) => {
          // перевод Promise в состояние rejected
          reject(new Error("Network Error"));
        },
        complete: () => {
          if (withSpinner) {
            spinner.stop();
            $('#indicator').hide();
          }
        }
      });
    });
  }
}
