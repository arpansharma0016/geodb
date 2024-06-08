<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <span>Select {{ selectType }}</span>
        <button class="btn-close" @click="close">x</button>
      </header>

      <div class="search-area">
        <input
          :placeholder="`Search ${selectType}`"
          class="search-input"
          v-model="query"
        />
        <button
          class="search-button"
          :class="{ disabled: !query.trim() || loading }"
          @click="searchQuery"
        >
          Search
        </button>
      </div>

      <section class="modal-body" v-if="response.length > 0">
        <div class="grid-area" v-for="(data, index) in response" :key="index">
          <div
            v-if="selectType === 'country'"
            @click="selectFromResponse(data.code)"
          >
            <div class="city-detail">
              <div class="detail-title">Country</div>
              <div class="city-name">{{ data.name }}</div>
            </div>
            <div class="city-detail">
              <div class="detail-title">Code</div>
              <div class="city-name">{{ data.code }}</div>
            </div>
          </div>
          <div
            v-if="selectType === 'region'"
            @click="selectFromResponse(data.isoCode)"
          >
            <div class="city-detail">
              <div class="detail-title">Region</div>
              <div class="city-name">{{ data.name }}</div>
            </div>
            <div class="city-detail">
              <div class="detail-title">ISO Code</div>
              <div class="city-name">{{ data.isoCode }}</div>
            </div>
          </div>
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
            {{ Math.floor(offset / 10) + 1 }} /
            {{ Math.ceil(pages / 10) }}
          </div>
          <div
            class="next"
            :class="{ disabled: offset >= pages || loading }"
            @click="showNextPage"
          >
            Next
          </div>
        </div>
      </section>
      <div v-else-if="query.trim() && gotResult && !loading">
        No {{ selectType }} found...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectComponent",
  props: {
    selectType: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      requestUrl: "https://wft-geo-db.p.rapidapi.com",
      apiUrl: "",
      loading: false,
      response: [],
      error: "",
      query: "",
      limit: 10,
      offset: 0,
      pages: 0,
      links: [],
      gotResult: false,
      paginatedQuery: false,
      paginateAction: "",
    };
  },
  mounted() {
    if (this.selectType === "country") {
      this.apiUrl = "/v1/geo/countries?limit=10&offset=0&namePrefix=";
    } else if (this.selectType === "region") {
      this.apiUrl = `/v1/geo/countries/${this.$store.state.country}/regions?limit=10&offset=0&namePrefix=`;
    }
  },
  methods: {
    async searchQuery() {
      if (!this.query.trim()) {
        return;
      }
      this.loading = true;
      this.gotResult = false;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a6871662ddmsh8713356544fcdb7p11c54fjsn7a3021abd923",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      };

      try {
        let query = this.requestUrl + this.apiUrl + this.query;
        if (this.paginatedQuery) {
          query = this.requestUrl + this.apiUrl;
        }
        const response = await fetch(query, options);
        const result = await response.json();
        if (result) {
          this.response = result.data;
          this.pages = result.metadata?.totalCount;
          this.links = result.links;
          this.gotResult = true;
          this.paginatedQuery = false;
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
        this.paginatedQuery = true;
        this.paginateAction = "prev";
        this.searchQuery();
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
        this.paginatedQuery = true;
        this.paginateAction = "next";
        this.searchQuery();
      }
    },
    close() {
      this.$emit("close");
    },
    selectFromResponse(id) {
      if (this.selectType === "country") {
        this.$store.commit("setCountry", id);
      } else if (this.selectType === "region") {
        this.$store.commit("setRegion", id);
      }
      this.close();
    },
  },
};
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 400px;
  overflow-y: auto;
}

.modal-header {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: cornflowerblue;
  justify-content: space-between;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: cornflowerblue;
  background: transparent;
}
.grid-area {
  width: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  border: 1px solid grey;
  border-radius: 6px;
  cursor: pointer;
}
.city-detail {
  width: 100px;
  margin: 4px;
}
.detail-title {
  font-size: 18px;
  font-weight: 600;
}
.search-area {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-around;
}

.search-input {
  width: 90%;
  height: 30px;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 6px;
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
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.grid-area:hover {
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
</style>
