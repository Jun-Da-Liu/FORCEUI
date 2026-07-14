<template>
  <ErrorPage
    status-code="404"
    :label="t('errorPage.notFoundLabel')"
    :title="t('errorPage.notFoundTitle')"
    :description="t('errorPage.notFoundDescription')"
    variant="missing"
  >
    <template #actions>
      <el-button type="primary" :icon="House" @click="goHome">{{ t("errorPage.backHome") }}</el-button>
      <el-button :icon="Refresh" @click="reload">{{ t("errorPage.reload") }}</el-button>
    </template>
  </ErrorPage>
</template>

<script setup>
import { House, Refresh } from "@element-plus/icons-vue";
import ErrorPage from "./components/ErrorPage.vue";

defineOptions({ name: "Page404" });

const router = useRouter();
const { t } = useI18n();

function goHome() {
  router.push("/");
}

function reload() {
  window.location.reload();
}
</script>
