<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <span v-if="loading">Loading nearby cities...</span>
        <span v-else-if="error">{{ error }}</span>
        <span v-else>Nearby cities</span>
        <button class="btn-close" @click="close">x</button>
      </header>

      <section class="modal-body" v-if="response">
        <div
          class="grid-area"
          v-for="(cityData, index) in response"
          :key="index"
        >
          <div class="city-detail">
            <div class="detail-title">City</div>
            <div class="city-name">{{ cityData.city }}</div>
          </div>
          <div class="city-detail">
            <div class="detail-title">Distance</div>
            <div class="city-name">{{ cityData.distance }}</div>
          </div>
          <div class="city-detail">
            <div class="detail-title">Region</div>
            <div class="city-name">{{ cityData.region }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalComponent",
  props: {
    cityId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      requestUrl: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${this.cityId}/nearbyCities?radius=100`,
      loading: false,
      response: [],
      error: "",
    };
  },
  mounted() {
    this.getNearbyCities();
  },
  methods: {
    async getNearbyCities() {
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
        const response = await fetch(this.requestUrl, options);
        const result = await response.json();
        this.response = result.data;
        this.error = "";
      } catch (error) {
        this.error = "Something went wrong in the API...";
        console.log("Rapid API - 429 (Too Many Requests)");
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit("close");
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
</style>
