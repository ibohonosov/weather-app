<template>
  <div class="weather-card" v-if="weather">
    <div class="weather-card__buttons" v-if="isFavorites === false">
      <button class="weather-card__add-btn" @click="addCity">+</button>
      <button class="weather-card__modal-btn" @click="showModal = true">
        X
      </button>
    </div>

    <div class="modal-delete modal" v-if="showModal === true">
      <p class="modal-delete__text">
        Are you sure you want to delete this city?
      </p>
      <div class="modal-delete__buttons">
        <button class="modal-delete__btn" @click="deleteCity">Yes</button>
        <button class="modal-delete__btn" @click="showModal = false">No</button>
      </div>
    </div>
    <h2 class="weather-card__title">
      {{ weather.name }}, {{ weather.sys.country }}
      <span
        class="weather-card__favorite"
        @click="toogleFavorite"
        :class="{ favorite: isFavorite }"
        >★</span
      >
    </h2>
    <div class="weather-card__info" v-if="viewMode === 'day'">
      <p class="info__temperature">
        Температура: {{ Math.round(weather.main.temp) }} °C
      </p>
      <p class="info__feels">
        Відчувається як: {{ Math.round(weather.main.feels_like) }}°C
      </p>
      <p class="info__weather">Погода: {{ weather.weather[0].description }}</p>
    </div>
    <p class="info__temperature" v-if="viewMode === 'week'">
      Середня температура: {{ weekAverageTemperatures }} °C
    </p>
    <div class="view-toogle">
      <button
        class="view-toogle__btn"
        @click="setView('day')"
        :class="{ active: viewMode === 'day' }"
      >
        Day
      </button>
      <button
        class="view-toogle__btn"
        @click="setView('week')"
        :class="{ active: viewMode === 'week' }"
      >
        Week
      </button>
    </div>

    <TemperatureChart
      :city="city"
      :updateChart="updateChart"
      :viewMode="viewMode"
      @week-average="updateWeekAverages"
      @chart-updated="updateChart = false"
    />
    <div v-if="showLimitModal" class="weather-card__modal-limit modal">
      <p class="modal-limit__text">
        Ви не можете додати більше 5 карток. Видаліть одну з карток перед
        додаванням нової.
      </p>
      <button class="modal-limit__btn" @click="showLimitModal = false">
        Закрити
      </button>
    </div>
  </div>
</template>

<script>
import TemperatureChart from "@/components/TemperatureChart";
import { getWeather } from "@/services/api";

export default {
  components: { TemperatureChart },
  props: {
    city: Object,
    currentCount: Number,
    isFavorites: Boolean,
  },
  data() {
    return {
      showModal: false,
      showLimitModal: false,
      weather: null,
      viewMode: "day",
      weekAverageTemperatures: null,
      updateChart: false,
    };
  },
  async mounted() {
    await this.fetchWeather();
    console.log("Weather", this.weather);
  },
  computed: {
    isFavorite() {
      return this.$root.favoriteCities.some(
        (item) => item.name === this.city.name
      );
    },
  },
  watch: {
    city: {
      immediate: true,
      handler(newCity) {
        if (newCity.lat && newCity.lon) {
          this.fetchWeather();
        }
      },
    },
  },
  methods: {
    async fetchWeather() {
      try {
        const response = await getWeather(this.city.lat, this.city.lon);
        this.weather = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    addCity() {
      if (this.currentCount < 5) {
        this.$emit("add-city", this.city);
        this.updateChart = !this.updateChart;
      } else {
        this.showLimitModal = true;
      }
    },
    deleteCity() {
      this.$emit("delete");
      this.showModal = false;
    },
    toogleFavorite() {
      this.$emit("toogle-favorite", this.city);
    },
    setView(mode) {
      this.viewMode = mode;
      this.updateChart = !this.updateChart;
    },
    updateWeekAverages(averageTemperatures) {
      this.weekAverageTemperatures = averageTemperatures;
    },
  },
};
</script>

<style scoped>
@import "@/styles/blocks/WeatherCard.css";
</style>
