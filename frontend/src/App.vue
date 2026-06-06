<!-- App.vue - main layout where we place and organize components -->
<!-- Single File Component - one .vue file that contains logic, user interface, and styles -->

<!-- Script - contains JavaScript code such as data, functions, and imports -->
<script>

  // Import the BannerComponent from the components folder so we can use it in this file
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';

  // useGlobalStore - imports the global Pinia store used for managing login state and updating the Navbar
  import {useGlobalStore} from './stores/global';

  // onBeforeMount - runs before the component is displayed and is used to prepare or load data before rendering 
  import {onBeforeMount} from 'vue';

  // Exports the component so Vue can use it
  export default {
    // components - contains the list of components that can be used in the template
    components: {
      // BannerComponent,
      NavbarComponent,
      // HomePage,
      // CoursesPage,
      // NewsPage,
      // RegisterPage,
      // LoginPage
    },
    setup() {
      // getUserDetails - gets the global function from the store used to update the shared user data
      // const store = useGlobalStore();
      // const getUserDetails = store.getUserDetails;
      const {getUserDetails} = useGlobalStore();

      // onBeforeMount() - runs before the component is displayed
      // getUserDetails() - updates the global user state
      // localStorage.getItem("email") - gets the saved email from browser storage
      onBeforeMount(() => getUserDetails(localStorage.getItem("token")));
    }
  }

</script>

<!-- Template - contains what is displayed in the browser -->
<template>

  <NavbarComponent />
  <!-- <BannerComponent /> -->
  <!-- <HomePage />
  <CoursesPage />
  <NewsPage />
  <RegisterPage />
  <LoginPage /> -->

  <!-- <router-view /> is a placeholder that displays the component based on the current URL (route). -->
  <router-view />

</template>

<!-- Style - contains the design that applies only to this component -->
<!-- scoped - contains styles that affect only this component and not others -->
<style scoped>


</style>