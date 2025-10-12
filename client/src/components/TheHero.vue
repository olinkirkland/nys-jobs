<template>
    <section v-if="heroImage" class="hero" :style="{ backgroundImage: backgroundCSS }">
        <div class="content">
            <div class="content-nested">
                <h1>Find your dream job</h1>
                <p>
                    Looking for a job with New York State? This listing includes vacancies open to the general public
                    parsed from
                    <a href="https://statejobs.ny.gov/" target="_blank">
                        <i class="fas fa-external-link-square-alt"></i>
                        <span>https://statejobs.ny.gov/</span>
                    </a>
                </p>
                <h6 class="muted">{{ heroImage.name }} • {{ heroImage.author }}</h6>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import heroImagesJson from '@/assets/hero-images.json';

const heroImage = ref();
onMounted(() => {
    heroImage.value = heroImagesJson[Math.floor(Math.random() * heroImagesJson.length)];
});

const backgroundCSS = computed(() => 'url(/assets/hero-images/' + heroImage.value.url + ')');
</script>

<style lang="scss" scoped>
section.hero {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .content {
        width: 100%;
        .content-nested {
            color: var(--surface);
            display: flex;
            flex-direction: column;
            padding: 4rem 2rem;
            max-width: 96rem;
            margin: 0 auto;

            h1 {
                margin-bottom: 2rem;
            }

            p {
                max-width: 40rem;
                margin-bottom: 2rem;
            }

            h6 {
                width: 100%;
                text-align: right;
            }
        }

        color: var(--surface);
    }
}
</style>
