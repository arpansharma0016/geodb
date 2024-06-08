<template>
  <div class="home">
    <div class="country-region-area">
      <div class="area-area" @click="showModalOfType('country')">
        <span class="area-name" v-if="$store.state.country">{{
          $store.state.country
        }}</span>
        <span class="area-name" v-else>Click to select a country</span>
      </div>
      <div class="area-area" @click="showModalOfType('region')">
        <span class="area-name" v-if="$store.state.region">{{
          $store.state.region
        }}</span>
        <span class="area-name" v-else>Click to select a region</span>
      </div>
      <button
        class="search-button"
        @click="searchCity"
        :class="{ disabled: loading || !countryRegionValidate }"
      >
        Search
      </button>
      <span class="clear-search" @click="clearSearch">Clear Search</span>
    </div>
    <div class="view-toggle">
      <div
        class="city-records"
        :class="{ selected: toggleMode === 'grid' }"
        @click="toggleMode = 'grid'"
      >
        Records
      </div>
      <div
        class="city-cards"
        :class="{ selected: toggleMode === 'card' }"
        @click="toggleMode = 'card'"
      >
        Cards
      </div>
    </div>

    <div v-if="error">{{ error }}</div>
    <div v-if="response && response.length > 0">
      <div class="cities-area">
        <grid-area v-if="toggleMode === 'grid'" :data="response"></grid-area>
        <card-area v-if="toggleMode === 'card'" :data="response"></card-area>
      </div>
      <div class="pagination" v-if="links">
        <div
          class="previous"
          :class="{ disabled: offset === 0 || loading }"
          @click="showPreviousPage"
        >
          Previous
        </div>
        <div class="current-page">
          {{ Math.floor(offset / 10) + 1 }} / {{ Math.ceil(pages / 10) }}
        </div>
        <div
          class="next"
          :class="{ disabled: offset >= pages || loading }"
          @click="showNextPage"
        >
          Next
        </div>
      </div>
    </div>
    <div v-else-if="loading">Loading data...</div>
    <div v-else>No data found...</div>
    <select-component
      v-if="showModal"
      :selectType="modalType"
      @close="closeModal"
    ></select-component>
  </div>
</template>

<script>
import gridArea from "./gridArea.vue";
import cardArea from "./cardArea.vue";
import selectComponent from "./selectComponent.vue";
export default {
  name: "HomeComponent",
  components: {
    gridArea,
    cardArea,
    selectComponent,
  },
  data() {
    return {
      toggleMode: "grid",
      limit: 10,
      offset: 0,
      response: [],
      pages: 0,
      loading: false,
      requestUrl: "https://wft-geo-db.p.rapidapi.com",
      apiUrl: "/v1/geo/cities?limit=10&offset=0",
      links: [],
      error: "",
      showModal: false,
      modalType: "",
      cityQuery: "",
      gotResult: false,
      paginateAction: "",
    };
  },
  mounted() {
    this.getCities();
  },
  computed: {
    countryRegionValidate() {
      return this.$store.state.country && this.$store.state.region;
    },
  },
  methods: {
    async getCities() {
      if (!this.loading) {
        this.loading = true;
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "a6871662ddmsh8713356544fcdb7p11c54fjsn7a3021abd923",
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          },
        };

        try {
          const response = await fetch(this.requestUrl + this.apiUrl, options);
          const result = await response.json();
          if (result) {
            this.response = result.data;
            this.pages = result.metadata?.totalCount;
            this.links = result.links;
          } else {
            if (this.paginateAction === "prev") {
              this.offset += 10;
            } else if (this.paginateAction === "next") {
              this.offset -= 10;
            }
          }
          this.error = "";
        } catch (error) {
          this.error = "Something went wrong in the API...";
          console.log("Rapid API - 429 (Too Many Requests)");
          if (this.paginateAction === "prev") {
            this.offset += 10;
          } else if (this.paginateAction === "next") {
            this.offset -= 10;
          }
        } finally {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    },
    showPreviousPage() {
      let prevLink = undefined;
      this.links.forEach((link) => {
        if (link.rel === "prev") {
          prevLink = link.href;
        }
      });
      if (!this.loading && prevLink) {
        this.offset -= 10;
        this.apiUrl = prevLink;
        this.paginateAction = "prev";
        this.getCities();
      }
    },
    showNextPage() {
      let nextLink = undefined;
      this.links.forEach((link) => {
        if (link.rel === "next") {
          nextLink = link.href;
        }
      });
      if (!this.loading && nextLink) {
        this.offset += 10;
        this.apiUrl = nextLink;
        this.paginateAction = "next";
        this.getCities();
      }
    },
    showModalOfType(type) {
      if (type === "region" && this.$store.state.country === "") {
        alert("Please select a country first!");
        return;
      }
      this.modalType = type;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    searchCity() {
      if (!this.$store.state.country) {
        alert("Please select a country first!");
        return;
      }
      if (!this.$store.state.region) {
        alert("Please select a region first!");
        return;
      }
      this.apiUrl = `/v1/geo/countries/${this.$store.state.country}/regions/${this.$store.state.region}/places?limit=10&offset=0`;
      this.offset = 0;
      this.paginateAction = "";
      this.getCities();
    },
    clearSearch() {
      this.$store.commit("setCountry", "");
      this.$store.commit("setRegion", "");
      this.apiUrl = "/v1/geo/cities?limit=10&offset=0";
      this.offset = 0;
      this.paginateAction = "";
      this.getCities();
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
.search-button {
  width: 80px;
  height: auto;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: cornflowerblue;
  color: white;
}
.view-toggle {
  margin-top: 20px;
  width: 200px;
  display: flex;
  justify-content: space-around;
}
.city-records,
.city-cards {
  border: none;
  width: 60px;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
}
.selected {
  background-color: cornflowerblue;
  color: white;
}
.pagination {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin: 20px;
}
.previous,
.next {
  width: 60px;
  background-color: cornflowerblue;
  color: white;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.country-region-area {
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
}
.area-area {
  border: 1px solid grey;
  padding: 10px;
  margin: 6px;
}
.area-name {
  font-size: 18px;
  font-weight: 600;
}
.clear-search {
  color: cornflowerblue;
  text-decoration: underline;
  margin-left: 20px;
  cursor: pointer;
}
</style>
