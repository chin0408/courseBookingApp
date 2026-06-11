<script setup>
    import { ref } from "vue";
    import { Notyf } from "notyf";
    import api from '../api.js';
    import CourseComponent from "./CourseComponent.vue";
    import { useGlobalStore } from "../stores/global.js";
    import { useRouter } from "vue-router";

    const notyf = new Notyf();
    const { user } = useGlobalStore();
    const router = useRouter();

    const courseName = ref("");
    const courses = ref([]);
    const isLoading = ref(false);
    const hasSearched = ref(false);

    const searchCourses = async () => {
        try {
            if (!courseName.value.trim()) {
                notyf.error("Please enter a course name.");
                return;
            }

            isLoading.value = true;
            hasSearched.value = true;

            const response = await api.post("/courses/search", {
                courseName: courseName.value.trim()
            });

            courses.value = response.data || [];

            if (courses.value.length) {
                notyf.success(`Found ${courses.value.length} course(s).`);
            } else {
                notyf.error("No courses found.");
            }
        } catch (error) {
            console.log(error);
            notyf.error("Something went wrong while searching.");
        } finally {
            isLoading.value = false;
        }
    };

    // FIX: Clear search results and reset state
    function clearSearch() {
        courseName.value = "";
        courses.value = [];
        hasSearched.value = false;
    }

    function editCourse(courseId) {
        router.push({ path: `/edit-course/${courseId}` });
    }

    async function archiveCourse(courseId) {
        try {
            let { data } = await api.delete(`/courses/${courseId}/archive`);
            notyf.success("Course Archived");
            courses.value = courses.value.filter(c => c._id !== courseId);
        } catch (error) {
            notyf.error(error.response?.data?.message || "Something went wrong");
        }
    }
</script>

<template>
    <div class="search-panel">
        <form @submit.prevent="searchCourses" class="search-form">
            <div class="field-wrap search-wrap">
                <i class="bi bi-search field-icon"></i>
                <input
                    type="text"
                    v-model="courseName"
                    class="field-input"
                    placeholder="Search for a course"
                />
                <!-- FIX: Clear button appears when there is a search term or results -->
                <button
                    v-if="courseName || courses.length"
                    type="button"
                    class="search-clear-btn"
                    @click="clearSearch"
                    title="Clear search"
                >
                    <i class="bi bi-x-lg"></i>
                </button>
                <button class="btn-submit btn-ready search-btn" type="submit" :disabled="isLoading">
                    {{ isLoading ? "Searching..." : "Search" }}
                </button>
            </div>
        </form>

        <div v-if="courses.length" class="search-results">
            <div class="search-results-header">
                <span class="dash-eyebrow">Results</span>
                <button class="search-clear-text-btn" @click="clearSearch">
                    <i class="bi bi-arrow-left"></i> Back to all courses
                </button>
            </div>
            <div class="course-grid">
                <CourseComponent
                    v-for="course in courses"
                    :key="course._id"
                    :courseData="course"
                    :editCourse="user.isAdmin ? editCourse : undefined"
                    :archiveCourse="user.isAdmin ? archiveCourse : undefined"
                />
            </div>
        </div>

        <div v-else-if="!isLoading && hasSearched" class="empty-state">
            No courses found.
            <button class="search-clear-text-btn mt-2" @click="clearSearch">
                <i class="bi bi-arrow-left"></i> Back to all courses
            </button>
        </div>
    </div>
</template>