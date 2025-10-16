<template>
    <div class="tag" :class="`tag--${color}`">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    color: string;
}>();
</script>

<style lang="scss" scoped>
.tag {
    padding: 0.2rem 1rem;
    display: inline-flex;
    border-radius: 99px;
}
.tag.tag--red {
    color: var(--color-red);
    background-color: var(--color-red-light);
}
.tag.tag--orange {
    color: var(--color-orange);
    background-color: var(--color-orange-light);
}
.tag.tag--green {
    color: var(--color-green);
    background-color: var(--color-green-light);
}
</style>
