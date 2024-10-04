<template>
  <div class="temperature-chart">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { getForecast } from "@/services/api";

export default {
  props: {
    city: Object,
    viewMode: String,
    updateChart: Boolean,
  },
  data() {
    return {
      chart: null,
    };
  },
  async mounted() {
    await this.fetchHourlyData();
  },
  watch: {
    city(oldVal, newVal) {
      if (newVal !== oldVal) {
        this.fetchHourlyData();
      }
    },
    viewMode() {
      this.fetchHourlyData();
    },
    updateChart() {
      this.fetchHourlyData();
    },
  },
  methods: {
    async fetchHourlyData() {
      try {
        const response = await getForecast(this.city.lat, this.city.lon);
        const data =
          this.viewMode === "week"
            ? this.processWeekData(response.data)
            : this.processDayData(response.data);
        if (this.viewMode === "week") {
          let averagesTemperatures = (
            data.temperatures.reduce((prev, item) => prev + item, 0) /
            data.temperatures.length
          ).toFixed(2);
          this.$emit("week-average", averagesTemperatures);
        }

        this.renderChart(data);
      } catch (error) {
        console.error("Hourly error", error);
      }
    },
    processWeekData(data) {
      const dailyAverages = {};
      data.list.forEach((item) => {
        const date = new Date(item.dt_txt).toLocaleDateString("ua-UA");
        if (!dailyAverages[date]) {
          dailyAverages[date] = { tempSum: 0, count: 0 };
        }
        dailyAverages[date].tempSum += item.main.temp;
        dailyAverages[date].count += 1;
      });
      const labels = Object.keys(dailyAverages);
      const temperatures = labels.map(
        (date) => dailyAverages[date].tempSum / dailyAverages[date].count
      );

      return { labels, temperatures };
    },
    processDayData(data) {
      const hourlyData = data.list.slice(0, 8);
      const labels = hourlyData.map(
        (item) => new Date(item.dt * 1000).getHours() + ":00"
      );
      const temperatures = hourlyData.map((item) => item.main.temp);
      return { labels, temperatures };
    },
    renderChart(data) {
      const ctx = this.$refs.chart.getContext("2d");
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Температура (°C)",
              data: data.temperatures,
              color: "#FFF",
              borderColor: "rgba(20, 78, 212, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            x: {
              grid: {
                color: "rgba(200, 200, 200, 0.2)",
              },
            },
            y: {
              grid: {
                color: "rgba(200, 200, 200, 0.2)",
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
};
</script>

<style scoped>
@import "@/styles/blocks/TemperatureChart.css";
</style>
