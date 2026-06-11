// defineStore - function from Pinia used to create a global store
import { defineStore } from 'pinia';

// reactive - makes an object reactive so the UI updates automatically when data changes
import { reactive } from 'vue';

import axios from 'axios';

// useGlobalStore - exported function used to access this global store in other components
export const useGlobalStore = defineStore('global', () => {

    // Data (Global Variable)
    let user = reactive({
        id: null,
        token: localStorage.getItem('token'),
        firstName: null,
        lastName: null,
        email: null,
        mobileNo: null,
        isAdmin: null
    })

    // Function
    async function getUserDetails(token) {

        // If the token does not exist, treat the user logged out
        if (!token) {
            user.id = null;
            user.token = null;
            user.firstName = null;
            user.lastName = null;
            user.email = null;
            user.mobileNo = null;
            user.isAdmin = null;

            return;
        }

        // Send a GET request to retrieve the user's details from the server
        let { data } = await axios.get(
            `${import.meta.env.VITE_COURSE_BOOKING_API}/users/details`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // Save user details in the global state
        user.id = data._id;
        user.token = token;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.mobileNo = data.mobileNo;
        user.isAdmin = data.isAdmin;
    }

    return {
        user,
        getUserDetails
    }

})