<script setup>

	import {onBeforeMount} from 'vue';

	// useGlobalStore - imports the global Pinia store used for managing login state and updating the Navbar
	import {useGlobalStore} from '../stores/global';
	// useRouter - imports Vue Router functions for redirecting users after logout
	import {useRouter} from 'vue-router';

	// { getUserDetails } - gets the getUserDetails function from the store so we can use it in this component
	const {getUserDetails} = useGlobalStore();

	// useRouter() - creates the router object for redirecting users after logout
	const router = useRouter();

	onBeforeMount(() => {
		// Removes all stored data in the browser (logs out the user)
		localStorage.removeItem("token");

		// getUserDetails(null) - resets/clears the global user data during logout
		getUserDetails(null);

		router.push({name: "Login"});


		// changes the current page URL
		// window.location.href = "/login"
	})


</script>

<template>
	
</template>

<style>
	
</style>