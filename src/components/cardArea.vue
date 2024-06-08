<template>
  <div class="card-area">
    <card-component
      v-for="(cityData, index) in data"
      :key="index"
      :data="cityData"
      @click.native="showNearbyCitiesModal(cityData.id)"
    ></card-component>
    <modal-component
      v-if="showModal"
      :cityId="cityId"
      @close="closeModal"
    ></modal-component>
  </div>
</template>

<script>
import cardComponent from "./cardComponent.vue";
import modalComponent from "./modalComponent.vue";
export default {
  name: "CardArea",
  components: {
    cardComponent,
    modalComponent,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showModal: false,
      cityId: undefined,
    };
  },
  methods: {
    showNearbyCitiesModal(id) {
      this.cityId = id;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.card-area {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
</style>
