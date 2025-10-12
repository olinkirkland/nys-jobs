<template>
    <Card>
        <div class="flex spread">
            <h3>#{{ job.id }}</h3>
        </div>
        <h3>
            {{ job.publishDate?.toLocaleDateString() }} -
            {{ job.deadline?.toLocaleDateString() }}
        </h3>
        <h2>{{ job.title }}</h2>
        <p>{{ job.county }}</p>
        <div class="full-width flex spread">
            <button @click="job.link && openJobPosting(job.link)">View Job Posting</button>
            <button @click="console.log(job)">Console log</button>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { openJobPosting } from '@/job-utils';
import { Job } from '../job';
defineProps<{
    job: Partial<Job>;
}>();
</script>

<style scoped lang="scss">
h2 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
