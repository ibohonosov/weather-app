<template>
  <div class="home-page">
    <CitySearch v-if="cities.length < 5" @city-selected="addCity" />
    <span class="home-page__text-warning" v-if="cities.length >= 5"
      >You can not add more than 5 cities</span
    >
    <div class="home-page-cards">
      <div class="card" v-for="(city, index) in cities" :key="index">
        <WeatherCard
          :isFavorites="isFavorites"
          :city="city"
          :currentCount="cities.length"
          @delete="removeCity(index)"
          @toogle-favorite="toogleFavorite(city)"
          @add-city="addCity"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";

export default {
  components: {
    WeatherCard,
    CitySearch,
  },
  props: {
    cities: Array,
    isFavorites: Boolean,
  },
  methods: {
    addCity(city) {
      this.$emit("add-city", city);
    },
    removeCity(index) {
      this.$emit("remove-city", index);
    },
    toogleFavorite(city) {
      this.$emit("toogle-favorite", city);
    },
  },
};
</script>

<style scoped>
@import "@/styles/blocks/HomePage.css";
</style>
