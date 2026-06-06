// Axios lets your frontend app send requests to an API (like GET or POST) and receive data (like JSON) in return
import axios from 'axios';

// axios.create() - creates a reusable axios instance.
const api = axios.create({
	// baseURL - default backend URL used in every request.
    // import.meta - used to access Vite project information.
    // env - contains environment variables.
    // VITE_COURSE_BOOKING_API - stores the backend API URL.
	baseURL: import.meta.env.VITE_COURSE_BOOKING_API
})

// api - reusable axios instance.
// interceptors - used to run code before or after requests.
// request - targets outgoing requests.
// use() - adds a function before the request is sent.
// config - contains request settings such as headers and URL.
api.interceptors.request.use((config) => {

	// localStorage.getItem() - retrieves saved data from localStorage.
    // token - saved login token of the user.
	const token = localStorage.getItem("token");

	// Check if the token exists
	if (token) {
		// headers - contains additional request information.
        // Authorization - commonly used for sending login tokens.
        // Bearer - token type used for authentication.
		config.headers.Authorization = `Bearer ${token}`
	}

	// Return the updated request
	return config;

})

export default api;