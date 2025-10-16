<template>
    <Card class="full-width">
        <header>
            <div class="name-department-tags">
                <h2>{{ job.title }}</h2>
                <span>{{ job.humanReadableAgency }}</span>
                <div class="tags">
                    <span v-if="job.telecommutingAllowed"><Tag color="green">Telecommuting Allowed</Tag></span>
                    <!-- <span>• <Tag color="orange">Tag 1</Tag></span> -->
                    <!-- <span>• <Tag color="orange">Tag 1</Tag></span> -->
                    <span>Salary Grade {{ job.salaryGrade }}</span>
                </div>
            </div>
            <div class="location-date">
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>{{ job.county }}</p>
                </div>
                <div class="date">
                    <p class="muted">Posted on {{ job.publishDate?.toDateString() }}</p>
                </div>
            </div>
        </header>
        <!-- <p>BULLET POINTS</p> -->
        <!-- <a :href="job.link" target="_blank">{{ job.link }}</a> -->
    </Card>
</template>

<script setup lang="ts">
import { Job } from '../job';
defineProps<{
    job: Partial<Job>;
}>();
</script>

<style scoped lang="scss">
.card {
    cursor: pointer;
    transition: box-shadow, 0.2s;
    &:hover {
        box-shadow: var(--shadow-md);
    }
}

header {
    display: flex;
    width: 100%;
    gap: 2rem;
    .name-department-tags {
        flex: 1;
        font-size: 1.2rem;

        .tags {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            > *:not(:first-of-type)::before {
                content: '•';
                margin: 0 0.4rem;
            }
        }
    }

    .location-date {
        .location {
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }
    }
}
</style>
