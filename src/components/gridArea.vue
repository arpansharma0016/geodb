<template>
  <div class="grid-area">
    <grid-component
      v-for="(cityData, index) in data"
      :key="index"
      :data="cityData"
      @click.native="showNearbyCitiesModal(cityData.id)"
    ></grid-component>
    <modal-component
      v-if="showModal"
      :cityId="cityId"
      @close="closeModal"
    ></modal-component>
  </div>
</template>

<script>
import gridComponent from "./gridComponent.vue";
import modalComponent from "./modalComponent.vue";
export default {
  name: "GridArea",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    gridComponent,
    modalComponent,
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
.grid-area {
  padding: 10px;
}
</style>
