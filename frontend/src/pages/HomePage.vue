<script>
  import BannerComponent from '../components/BannerComponent.vue';
  import HighlightsComponent from '../components/HighlightsComponent.vue';

  export default {
    components: {
      BannerComponent,
      HighlightsComponent
    },
    // data() defines the reactive state of the component using the Options API
    // Reactive state refers to data that can change over time and automatically update the UI when it changes
    data() {
      return {
        // bannerProps is an object that groups related data to be passed a single prop.
        bannerProps: {
          title: "Zuitt Course Booking System",
          tagline: "Opportunities for Everyone, Everywhere!",
          destination: "Courses",
          buttonLabel: "View Our Courses"
        }
      }
    }
  }
</script>

<template>
  <main class="home-shell">
    <BannerComponent :bannerProps="bannerProps" />
    <HighlightsComponent />
  </main>
</template>