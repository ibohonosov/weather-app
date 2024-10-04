<template>
  <div class="favorite-page">
    <h2 class="favorite-page__title">Favorites</h2>
    <div class="favourites__page-cards">
      <div class="card" v-for="(city, index) in favoriteCities" :key="index">
        <WeatherCard
          :isFavorites="true"
          :city="city"
          @delete="removeCity(index)"
          @toogle-favorite="toogleFavorite(city)"
          class="cards__card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WeatherCard from "@/components/WeatherCard";

export default {
  components: {
    WeatherCard,
  },
  props: {
    favoriteCities: Array,
    isFavorites: Boolean,
  },
  data() {
    return {
      showButtons: false,
    };
  },
  methods: {
    removeCity(index) {
      this.$emit("delete-city", index);
    },
    toogleFavorite(city) {
      this.$emit("toogle-favorite", city);
    },
  },
};
</script>

<style scoped>
@import "@/styles/blocks/FavoritePage.css";
</style>
