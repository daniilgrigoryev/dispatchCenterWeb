import * as ConstantUtils from './constantUtils';
import * as RequestEntity from './../api/requestEntity';
import {RequstApi} from './../api/requestApi';
import $ from "jquery";

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function webGlId () {
  String.prototype.hashCode = function () {
    let hash = 0;
    if (this.length === 0)
      return hash;
    for (let i = 0; i < this.length; i++) {
      let character = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash = hash & hash;
    }
    return hash;
  };
  let canvas = $('<canvas />', {width: '1', height: '1'}).appendTo('body');
  let gl = canvas[0].getContext("webgl");
  let sum = '';
  for (let a in gl) {
    if (typeof gl[a] !== 'function') {
      sum += a + ':' + gl[a] + '\n';
    }
  }
  canvas.remove();
  return sum.hashCode();
}

export function getCurrentComponent(componentArr) {
  let currentComponent = null;
  if (null === componentArr || componentArr.length === 0) {
    return currentComponent;
  }
  for (let i = 0; i < componentArr.length; i++) {
    let component = componentArr[i];
    if (component.current) {
      currentComponent = component;
      return currentComponent;
    }
  }
}

export function getNextComponent(beanName) {
  debugger;
  let currentComponent;
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = JSON.parse(sessionStorage.getItem(wid));
  currentComponent = getCurrentComponent(componentsRoute);
  if (componentsRoute.length > 0) {
    currentComponent.current = false;
    sessionStorage.setItem(wid, JSON.stringify(componentsRoute));
    currentComponent = null;
  }
  if (null === currentComponent || undefined === currentComponent) {
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, beanName, null);
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
    if (eventResponse.status === 200) {
      let data = eventResponse.response;
      if (data.length > 0) {
        let dataJson = JSON.parse(data);
        let respData = dataJson.data;
        let respError = dataJson.error;
        if (null !== respData) {
          if (dataJson.method === 'addCID') {
            currentComponent = {
              'count': componentsRoute.length,
              'cid': respData.cid,
              'current': true
            };
            componentsRoute.push(currentComponent);
            sessionStorage.setItem(wid, JSON.stringify(componentsRoute));
            return currentComponent;
          }
        } else {
          alert(respError.errorMsg);
        }
      }
    }
  }
}

export function getPrevComponent() {
  debugger;
  let currentComponent;
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = JSON.parse(sessionStorage.getItem(wid));
  if (componentsRoute.length > 0) {
    currentComponent = getCurrentComponent(componentsRoute);
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, null, 'removeCID');
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
    if (eventResponse.status === 200) {
      let data = eventResponse.response;
      if (data.length > 0) {
        let dataJson = JSON.parse(data);
        let respError = dataJson.error;
        if (dataJson.method === 'removeCID') {
          componentsRoute.splice(currentComponent.count, 1);
          if (componentsRoute.length > 0) {
            currentComponent = componentsRoute[currentComponent.count - 1];
            currentComponent.current = true;
          }
          sessionStorage.setItem(wid, JSON.stringify(componentsRoute));
          return currentComponent;
        }
        if (null !== respError) {
          alert(respError.errorMsg);
        }
      }
    }
  }
}

export function removeAllComponents() {
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = JSON.parse(sessionStorage.getItem(wid));
  for (let i = 0; i < componentsRoute.length; i++) {
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, componentsRoute[i].cid, null, 'removeCID');
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
  }
  sessionStorage.removeItem(wid);
}
