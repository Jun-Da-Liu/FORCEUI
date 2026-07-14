<template>
  <div class="app-container">
    <el-empty :description="t('dynamicMenu.developing', { name: route.meta.title || 'Menu' })" />
  </div>
</template>

<script setup>
defineOptions({ name: "DynamicMenuPlaceholder" });

const route = useRoute();
const { t } = useI18n();
</script>
