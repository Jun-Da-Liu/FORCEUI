<template>
  <el-icon v-if="isElementPlusIcon" class="layout-menu-icon">
    <component :is="iconName" />
  </el-icon>
  <span v-else-if="icon" class="layout-menu-icon" :class="svgIconClass" />
  <span v-else class="layout-menu-icon i-svg:menu" />
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: "" },
});

const isElementPlusIcon = computed(() => {
  return props.icon.startsWith("el-icon-");
});

const svgIconClass = computed(() =>
  props.icon.startsWith("i-svg:") ? props.icon : `i-svg:${props.icon}`
);

const iconName = computed(() => {
  if (!isElementPlusIcon.value) return "";
  return props.icon.replace("el-icon-", "");
});
</script>
