<template>
    <div class="icon-button">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.icon-button {
    cursor: pointer;

    :deep(i) {
        font-size: 1.6rem;
        color: var(--text);
    }

    &:hover {
        filter: brightness(0.9);
    }
}
</style>
