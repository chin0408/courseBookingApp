<script>
import { ref } from "vue";
import { useGlobalStore } from "../stores/global.js";
import { useRouter } from "vue-router";

export default {
    props: {
        courseData: Object,
        editCourse: Function,
        archiveCourse: Function
    },

    setup(props) {
        const { user } = useGlobalStore();
        const router = useRouter();
        const isEnrolling = ref(false);

        async function handleEnroll() {
            if (!user.email) {
                router.push({ path: "/login" });
                return;
            }
            router.push({ path: `/courses/${props.courseData._id}` });
        }

        return {
            user,
            isEnrolling,
            handleEnroll,
            editCourse: props.editCourse,
            archiveCourse: props.archiveCourse
        };
    }
};
</script>

<template>
    <div class="course-grid-item">
        <article class="course-card-modern">

            <!-- Course Image -->
            <div class="course-card-media">
                <img
                    :src="courseData.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'"
                    :alt="courseData.name"
                    style="width:100%; height:220px; object-fit:cover;"
                />
                <span class="course-card-tag">Course</span>
            </div>

            <!-- Course Body -->
            <div class="course-card-body">
                <h3>{{ courseData.name }}</h3>
                <p>{{ courseData.description }}</p>

                <!-- Enrollment & seats info -->
                <div class="course-enrollment-count" v-if="courseData.enrollmentCount !== undefined">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {{ courseData.enrollmentCount }} enrolled
                    <span v-if="courseData.availableSeats !== null && courseData.availableSeats !== undefined">
                        · {{ courseData.availableSeats > 0 ? courseData.availableSeats : 0 }} seats left
                    </span>
                </div>

                <div class="course-card-footer">
                    <span class="price-badge">
                        ₱{{ Number(courseData.price).toLocaleString() }}
                    </span>

                    <button
                        v-if="!user.isAdmin"
                        class="btn-edit"
                        @click="handleEnroll"
                    >
                        View Details
                    </button>
                </div>

                <!-- Admin Actions -->
                <div class="action-group mt-3" v-if="user.isAdmin && editCourse && archiveCourse">
                    <button class="btn-edit" @click="editCourse(courseData._id)">Edit</button>
                    <button class="btn-archive" @click="archiveCourse(courseData._id)">Archive</button>
                </div>
            </div>

        </article>
    </div>
</template>