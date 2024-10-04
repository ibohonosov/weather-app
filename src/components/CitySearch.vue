<template>
  <div class="search-block">
    <input
      type="text"
      v-model="query"
      class="search-block__input"
      @input="fetchCities"
      placeholder="Enter a city name"
    />
    <ul class="search-block__nav nav" v-if="allCities.length">
      <li
        class="nav__list"
        v-for="city in allCities"
        :key="city.id"
        @click="selectedCity(city)"
      >
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getGeo } from "@/services/api";

export default {
  data() {
    return {
      query: "",
      allCities: [],
    };
  },
  methods: {
    async fetchCities() {
      if (this.query.length > 2)
        try {
          const response = await getGeo(this.query);
          this.allCities = response.data;
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      else {
        this.allCities = [];
      }
    },
    selectedCity(city) {
      this.$emit("city-selected", city);
      this.query = `${city.name}, ${city.country}`;
      this.allCities = [];
      this.query = "";
    },
  },
};
</script>

<style scoped>
@import "@/styles/blocks/CitySearch.css";
</style>
