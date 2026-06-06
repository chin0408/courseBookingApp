<script>
    
    import CourseComponent from './CourseComponent.vue';
    import CourseSearch from './CourseSearch.vue';

    export default {
        components: {
                CourseComponent,
                CourseSearch
            },

        props: {
          coursesData: Array
        }
    }

</script>

<template>
    <main class="courses-shell">
        <div class="section-header">
            <span class="dash-eyebrow">Courses Offered</span>
            <h1 class="section-title">Choose your next course</h1>
            <p class="section-subtitle">Browse available programs and enroll when you find the right fit.</p>
        </div>

        <CourseSearch />

        <div class="course-grid">
            <div v-if="coursesData.length === 0" class="empty-state">
                No courses available.
            </div>

            <CourseComponent
                v-for="course in coursesData.filter(c => c && c.name)"
                :key="course._id"
                :courseData="course"
            />
        </div>
    </main>
</template>