<script setup>

    // Import the ref function from Vue to create reactive variables that automatically update the UI when values change
    import { ref } from "vue";

    // Import Notyf to display success and error notification messages to the user
    import { Notyf } from "notyf";

    // Import the global store to access shared user data such as the authentication token
    import { useGlobalStore } from "../stores/global";

    // Import the configured API instance to simplify sending HTTP requests to the backend server
    import api from "../api";

    // Reactive variable for storing the new password input
    const newPassword = ref("");

    // Reactive variable for tracking the loading state
    const isLoading = ref(false);

    // Creates a new Notyf instance
    const notyf = new Notyf();

    // Async function for handling password reset
    const handleReset = async () => {

        try {

            // Enable the loading state while processing password reset request
            // While resetting the password
                // Disable the button
                // Change its text ("Reset Password" to "Reseting...")
            isLoading.value = true;

            // Retrieves the current use from the global store
            const {user} = useGlobalStore();

            // Checks if the user has a valid token
            if (!user.token) {
                // Display an error notification if unauthorized
                notyf.error("You are not authorized");
                // Disables loading state
                isLoading.value = false;
                // Stops the function execution
                return;
            }

            // Sends a POST request to reset the password
            let res = await api.post("/users/reset-password" , {
                newPassword: newPassword.value
            })

            // Log the API response in the console
            console.log(res);

            // Display a success notification
            notyf.success("Password reset successfully");

            newPassword.value = "";

        } catch (e) {

            // Logs the error in the console
            console.log(e);

            // ?. - optional chaining that safely checks if a value exists before accessing the next property to prevent runtime errors
            const msg = e.response?.data?.message || "Password reset failed";

            // Display the error notification
            notyf.error(msg);

        } finally {
            // Disable the loading state after the request is completed
                // Enable the button
                // Change its text ("Resetting..." to " Password Reset")
            isLoading.value = false;
        }

    }
    
</script>

<template>
    <section class="profile-card">
        <div class="profile-card-header">
            <div class="profile-card-icon"><i class="bi bi-key"></i></div>
            <div>
                <span class="form-eyebrow">Security</span>
                <h2>Reset Password</h2>
            </div>
        </div>

        <form @submit.prevent="handleReset" class="profile-form">
            <div class="field-group">
                <label for="newPassword" class="field-label">New Password</label>
                <div class="field-wrap" :class="{ 'field-filled': newPassword }">
                    <i class="bi bi-lock field-icon"></i>
                    <input type="password" id="newPassword" v-model="newPassword" class="field-input" placeholder="Enter new password" required />
                </div>
            </div>
            <button type="submit" class="btn-submit btn-ready" :disabled="isLoading">{{ isLoading ? "Resetting..." : "Reset Password" }}</button>
        </form>
    </section>
</template>