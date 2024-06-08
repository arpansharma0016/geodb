import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    country: "",
    region: "",
  },
  mutations: {
    setCountry(state, country) {
      state.country = country;
      state.region = "";
    },
    setRegion(state, region) {
      state.region = region;
    },
  },
});

export default store;
