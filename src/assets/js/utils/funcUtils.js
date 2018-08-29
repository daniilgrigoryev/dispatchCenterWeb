import * as RequestEntity from './../api/requestEntity';
import {RequstApi} from './../api/requestApi';
import * as ConstantUtils from './../utils/constantUtils';
import $ from "jquery";

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function webGlId() {
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
    if (gl.hasOwnProperty(a) && typeof gl[a] !== 'function') {
      sum += a + ':' + gl[a] + '\n';
    }
  }
  canvas.remove();
  return sum.hashCode();
}

export function isUndefined(obj) {
  return undefined === obj;
}

export function isNull(obj) {
  return null === obj;
}

export function isEmpty(obj) {
  return isUndefined(obj) || isNull(obj);
}

export function isNotEmpty(obj) {
  return !isUndefined(obj) && !isNull(obj);
}

export function addToLocalStorage(key, value) {
  if (isNotEmpty(key) && isNotEmpty(value)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function addToSessionStorage(key, value) {
  if (isNotEmpty(key) && isNotEmpty(value)) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export function getfromLocalStorage(key) {
  let res = null;
  let item = localStorage.getItem(key);
  if (isNotEmpty(item)) {
    res = JSON.parse(item);
  }
  return res;
}

export function getFromSessionStorage(key) {
  let res = null;
  let item = sessionStorage.getItem(key);
  if (isNotEmpty(item)) {
    res = JSON.parse(item);
  }
  return res;
}

export function getCurrentComponent(componentArr) {
  let currentComponent = null;
  if (isNull(componentArr) || componentArr.length === 0) {
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

export function getNextComponent(beanName, callback) {
  let currentComponent;
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = getFromSessionStorage(wid);
  currentComponent = getCurrentComponent(componentsRoute);
  if (componentsRoute.length > 0) {
    currentComponent.current = false;
    addToSessionStorage(wid, componentsRoute);
    currentComponent = null;
  }
  if (isEmpty(currentComponent)) {
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, beanName, null);
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    RequstApi.sendHttpRequest(requestParam)
      .then(eventResponse => {
        if (eventResponse.status === 200) {
          let data = eventResponse.response;
          if (data.length > 0) {
            let dataJson = JSON.parse(data);
            let respData = dataJson.data;
            let respError = dataJson.error;
            if (!isNull(respData)) {
              if (dataJson.method === 'addCID') {
                currentComponent = {
                  'count': componentsRoute.length,
                  'cid': respData.cid,
                  'current': true
                };
                componentsRoute.push(currentComponent);
                addToSessionStorage(wid, componentsRoute);
                if (!isUndefined(callback)) {
                  callback();
                }
              }
            } else {
              if (!isNull(respError)) {
                alert(respError.errorMsg);
              }
            }
          }
        }
      })
      .catch(eventResponse => {
        alert(eventResponse.message);
      });
  }
}

export function getPrevComponent(callback) {
  let currentComponent;
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = getFromSessionStorage(wid);
  if (componentsRoute.length > 0) {
    currentComponent = getCurrentComponent(componentsRoute);
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, null, 'removeCID');
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    RequstApi.sendHttpRequest(requestParam)
      .then(eventResponse => {
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
              addToSessionStorage(wid, componentsRoute);
              if (!isUndefined(callback)) {
                callback();
              }
            }
            if (!isNull(respError)) {
              alert(respError.errorMsg);
            }
          }
        }
      })
      .catch(eventResponse => {
        alert(eventResponse.message);
      });
  }
}

export function removeComponent(cid) {
  let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), cid, null, 'removeCID');
  let requestParam = new RequestEntity.RequestParam(requestHead, null);
  RequstApi.sendHttpRequest(requestParam)
    .then(eventResponse => {
    })
    .catch(eventResponse => {
      alert(eventResponse.message);
    });
}

export function removeAllComponents() {
  let wid = sessionStorage.getItem('wid');
  let componentsRoute = getFromSessionStorage(wid);
  for (let i = 0; i < componentsRoute.length; i++) {
    let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, componentsRoute[i].cid, null, 'removeCID');
    let requestParam = new RequestEntity.RequestParam(requestHead, null);
    RequstApi.sendHttpRequest(requestParam)
      .then(eventResponse => {
      })
      .catch(eventResponse => {
        alert(eventResponse.message);
      });
  }
  sessionStorage.removeItem(wid);
}

export function getCurrentPage(path) {
  let currentPage = null;
  if (isNull(path) || path.length === 0) {
    return currentPage;
  }
  for (let i = 0; i < path.length; i++) {
    let page = path[i];
    if (page.current) {
      currentPage = page;
      return currentPage;
    }
  }
}

export function getNextPage(router, pageName, params) {
  let path = getFromSessionStorage('path');
  let currPage = getCurrentPage(path);
  currPage.current = false;
  path.push({
    'routeName': pageName,
    'current': true,
    'params': params
  });
  addToSessionStorage('path', path);
  router.push({name: pageName, params});
}

export function getPrevPage(router, pageName, params) {
  let path = getFromSessionStorage('path');
  path.splice(path.length - 1, 1);
  path[path.length - 1].current = true;
  addToSessionStorage('path', path);
  router.push({name: pageName, params});
}



export function lookupValue(dictName, key) {
  let res = {
    label: null,
    value: null
  };
  let dict = ConstantUtils[dictName];
  for (let i = 0; i < dict.length; i++) {
    let object = dict[i];
    if (object.value == key) {
      return object;
    }
  }
  return res;
}
