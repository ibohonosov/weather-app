<template>
  <div class="app">
    <a
      class="app__home-page"
      @click="isFavorites = false"
      :class="{ 'active-link': !isFavorites }"
      >Home</a
    >
    <a
      class="app__favotites-page"
      @click="isFavorites = true"
      :class="{ 'active-link': isFavorites }"
    >
      Favorites
    </a>
    <HomePage
      v-if="isFavorites === false"
      :isFavorites="isFavorites"
      :cities="cities"
      @add-city="addCity"
      @remove-city="removeCity"
      @toogle-favorite="toogleFavorite"
    />

    <FavoritePage
      v-if="isFavorites === true"
      :isFavorites="isFavorites"
      :favoriteCities="favoriteCities"
      @delete-city="removeCity"
      @toogle-favorite="toogleFavorite"
    />
  </div>
</template>

<script>
import FavoritePage from "@/components/FavoritePage";
import HomePage from "@/components/HomePage";

export default {
  name: "App",
  components: {
    FavoritePage,
    HomePage,
  },
  data() {
    return {
      cities: [
        {
          name: "Kyiv", // Назва міста за замовчуванням
          lat: 50.4501, // Широта міста
          lon: 30.5234, // Довгота міста
        },
      ],
      favoriteCities: JSON.parse(localStorage.getItem("favoriteCities")) || [],
      isFavorites: false,
    };
  },
  methods: {
    addCity(city) {
      if (this.cities.length < 5) {
        this.cities.push(city);
      }
    },
    removeCity(index) {
      this.cities.splice(index, 1);
    },
    toogleFavorite(city) {
      const index = this.favoriteCities.findIndex((i) => i.name === city.name);
      if (index !== -1) {
        this.favoriteCities.splice(index, 1);
      } else {
        if (this.favoriteCities.length <= 5) {
          this.favoriteCities.push(city);
        } else {
          alert("You can not add more than 5 favorite cities");
        }
      }
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify(this.favoriteCities)
      );
    },
  },
};
</script>

<style>
@import "styles/main.css";
@import "styles/blocks/App.css";
</style>
