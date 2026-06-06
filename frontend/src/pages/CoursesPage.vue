<script>
    import api from '../api.js';
    import { reactive, watch } from 'vue';
    import AdminView from '../components/AdminView.vue';
    import UserView from '../components/UserView.vue';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global';
    import { Notyf } from 'notyf';

    export default {
        components: { AdminView, UserView },

        setup() {
            const router = useRouter();
            const store = useGlobalStore();
            const notyf = new Notyf();
            const courses = reactive({ data: [] });

            async function getCourses() {
                try {
                    let response = store.user.isAdmin
                        ? await api.get('/courses/all')
                        : await api.get('/courses');

                    const courseList = response.data;

                    // Fetch enrollment count for each course and attach it
                    const withCounts = await Promise.all(
                        courseList.map(async (course) => {
                            try {
                                const countRes = await api.get(`/courses/${course._id}/students`);
                                return { ...course, enrollmentCount: countRes.data.studentCount || 0 };
                            } catch {
                                return { ...course, enrollmentCount: 0 };
                            }
                        })
                    );

                    courses.data = withCounts;
                } catch (error) {
                    console.log(error);
                }
            }

            function editCourse(courseId) {
                router.push({ path: `/edit-course/${courseId}` });
            }

            async function archiveCourse(courseId) {
                try {
                    let response = await fetch(
                        `${import.meta.env.VITE_COURSE_BOOKING_API}/courses/${courseId}/archive`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${store.user.token}`
                            }
                        }
                    );
                    let data = await response.json();
                    if (response.ok) {
                        notyf.success("Course Archived");
                        getCourses();
                    } else {
                        notyf.error(data.message || "Something went wrong");
                    }
                } catch (error) {
                    notyf.error("Something went wrong");
                }
            }

            async function activateCourse(courseId) {
                try {
                    let response = await fetch(
                        `${import.meta.env.VITE_COURSE_BOOKING_API}/courses/${courseId}/activate`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${store.user.token}`
                            }
                        }
                    );
                    let data = await response.json();
                    if (response.ok) {
                        notyf.success("Course Activated");
                        getCourses();
                    } else {
                        notyf.error(data.message || "Something went wrong");
                    }
                } catch (error) {
                    notyf.error("Something went wrong");
                }
            }

            watch(
                () => store.user,
                async () => { await getCourses(); },
                { immediate: true, deep: true }
            );

            return { store, courses, editCourse, archiveCourse, activateCourse };
        }
    }
</script>

<template>
    <AdminView
        v-if="store.user.isAdmin"
        :coursesData="courses.data"
        :editCourse="editCourse"
        :archiveCourse="archiveCourse"
        :activateCourse="activateCourse"
    />
    <UserView
        v-if="!store.user.isAdmin"
        :coursesData="courses.data"
    />
</template>