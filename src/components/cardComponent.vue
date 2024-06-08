<template>
  <div class="card-area">
    <div class="city-detail" v-if="data.city">
      <div class="detail-title">City</div>
      <div class="city-name">{{ data.city }}</div>
    </div>
    <div class="city-detail" v-else-if="data.name">
      <div class="detail-title">Name</div>
      <div class="city-name">{{ data.name }}</div>
    </div>
    <div class="city-detail" v-if="data.country">
      <div class="detail-title">Country</div>
      <div class="city-country">{{ data.country }}</div>
    </div>
    <div class="city-detail" v-if="data.region">
      <div class="detail-title">Region</div>
      <div class="city-region">{{ data.region }}</div>
    </div>
    <div class="city-detail">
      <div class="detail-title">Latitude</div>
      <div class="city-latitude">{{ data.latitude }}</div>
    </div>
    <div class="city-detail">
      <div class="detail-title">Longitude</div>
      <div class="city-longitude">{{ data.longitude }}</div>
    </div>
    <div class="city-detail">
      <div class="detail-title">Population</div>
      <div class="city-population">{{ data.population }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.card-area {
  width: 25%;
  margin: 10px;
  border: 1px solid grey;
  border-radius: 6px;
  cursor: pointer;
  padding: 16px;
}
.card-area > div {
  display: block;
}
.card-area:hover {
  background-color: cornflowerblue;
  color: white;
}
.city-detail {
  margin: 4px;
}
.detail-title {
  font-size: 18px;
  font-weight: 600;
}
</style>
