<script setup>
import { ref } from 'vue'

const props = defineProps({
    newsData: Object
})

const likes = ref(
    Number(
        localStorage.getItem(`news-likes-${props.newsData.id}`)
    ) || 0
)

function likeNews() {

    likes.value++

    localStorage.setItem(
        `news-likes-${props.newsData.id}`,
        likes.value
    )
}
</script>

<template>
    <article class="news-card">
        <span class="news-card-tag">Announcement</span>

        <h2 class="news-card-title">
            {{ newsData.name }}
        </h2>

        <p class="news-card-body">
            {{ newsData.description }}
        </p>

        <div class="news-card-footer">
            <span class="news-likes">
                Likes: {{ likes }}
            </span>

            <button
                v-if="likes < 10"
                class="news-like-btn"
                type="button"
                @click="likeNews"
            >
                Like
            </button>

            <button
                v-else
                class="news-like-btn disabled"
                type="button"
                disabled
            >
                Like
            </button>
        </div>
    </article>
</template>