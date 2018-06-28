import * as ConstantUtils from "../../assets/js/utils/constantUtils";

export default {
  state: {
    moduleName: 'monitorViewData',
    cid: null,
    bean: 'MonitorView',
    data: null
  },
  mutations: {
    monitorDictSetCid(state, cid) {
      state.cid = cid;
    },
    monitorViewDataSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorDictSetCid: ({commit}, payload) => {
      commit('monitorDictSetCid', payload);
    },
    monitorViewDataSetData: ({commit}, payload) => {
      commit('monitorViewDataSetData', payload.data);
    }
  },
  getters: {}
};
