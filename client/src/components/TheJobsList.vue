<template>
    <ul>
        <JobCard v-for="job in jobs" :job="job" />
    </ul>
</template>

<script lang="ts" setup>
import { Job } from '@/job';
import JobCard from './JobCard.vue';

const props = defineProps<{ jobs: Partial<Job>[] }>();
</script>

<style lang="scss" scoped>
ul {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: visible;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }
}
</style>
