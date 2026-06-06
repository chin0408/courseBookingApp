<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { Notyf } from 'notyf';
    import { useGlobalStore } from '../stores/global';
    import api from '../api.js';

    const route = useRoute();
    const router = useRouter();
    const store = useGlobalStore();
    const notyf = new Notyf();

    const name = ref("");
    const description = ref("");
    const price = ref("");
    const category = ref("Frontend");
    const level = ref("Beginner");
    const duration = ref("4 Weeks");
    const imageUrl = ref("");

    const categoryOptions = ["Frontend","Backend","Full Stack","QA","Cloud","Mobile","DevOps","Data Science"];
    const levelOptions = ["Beginner","Intermediate","Advanced"];
    const durationOptions = ["4 Weeks","6 Weeks","8 Weeks","10 Weeks","12 Weeks"];

    onBeforeMount(async () => {
        try {
            let { data } = await api.get(`/courses/specific/${route.params.courseId}`);
            name.value = data.name;
            description.value = data.description;
            price.value = data.price;
            category.value = data.category || "Frontend";
            level.value = data.level || "Beginner";
            duration.value = data.duration || "4 Weeks";
            imageUrl.value = data.imageUrl || "";
        } catch (error) {
            notyf.error("Failed to load course data.");
        }
    });

    async function updateCourse() {
        try {
            let response = await fetch(
                `${import.meta.env.VITE_COURSE_BOOKING_API}/courses/${route.params.courseId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${store.user.token}`
                    },
                    body: JSON.stringify({
                        name: name.value,
                        description: description.value,
                        price: Number(price.value),
                        category: category.value,
                        level: level.value,
                        duration: duration.value,
                        imageUrl: imageUrl.value
                    })
                }
            );
            let data = await response.json();
            if (response.ok) {
                notyf.success("Course Updated Successfully");
                router.push({ path: '/courses' });
            } else {
                notyf.error(data.message || "Something went wrong");
            }
        } catch (error) {
            notyf.error("Something went wrong");
        }
    }
</script>

<template>
    <div class="add-shell">
        <div class="add-card">

            <!-- Left accent -->
            <aside class="add-accent">
                <div class="accent-content">
                    <div class="accent-icon"><i class="bi bi-pencil-square fs-2"></i></div>
                    <h1 class="accent-title">Edit Course</h1>
                    <p class="accent-sub">Update the course details below. Changes are saved immediately.</p>
                    <div class="accent-dots"><span></span><span></span><span></span></div>
                </div>
            </aside>

            <!-- Right form -->
            <section class="add-form-panel">
                <span class="form-eyebrow">Admin Console</span>
                <h2 class="form-title">Update Course</h2>

                <form @submit.prevent="updateCourse" class="add-form">

                    <div class="field-group">
                        <label class="field-label">Course Name</label>
                        <div class="field-wrap" :class="{ 'field-filled': name }">
                            <i class="bi bi-book field-icon"></i>
                            <input type="text" class="field-input" v-model="name" placeholder="Course name" required />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Description</label>
                        <div class="field-wrap textarea-wrap" :class="{ 'field-filled': description }">
                            <i class="bi bi-card-text field-icon"></i>
                            <textarea class="field-input" rows="3" v-model="description" placeholder="Course description" required></textarea>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Price</label>
                        <div class="field-wrap" :class="{ 'field-filled': price > 0 }">
                            <i class="bi bi-cash-stack field-icon"></i>
                            <input type="number" class="field-input" v-model="price" placeholder="0" required />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Category</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="category">
                                <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Level</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="level">
                                <option v-for="opt in levelOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Duration</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="duration">
                                <option v-for="opt in durationOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Image URL</label>
                        <div class="field-wrap" :class="{ 'field-filled': imageUrl }">
                            <i class="bi bi-image field-icon"></i>
                            <input type="text" class="field-input" v-model="imageUrl" placeholder="https://example.com/image.jpg" />
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-cancel" @click="router.push('/courses')">Cancel</button>
                        <button type="submit" class="btn-submit btn-ready">
                            Save Changes
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>

                </form>
            </section>
        </div>
    </div>
</template>