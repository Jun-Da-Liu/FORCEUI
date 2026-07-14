<template>
  <ErrorPage
    status-code="401"
    :label="t('errorPage.accessLabel')"
    :title="t('errorPage.accessTitle')"
    :description="t('errorPage.accessDescription')"
    variant="locked"
  >
    <template #actions>
      <el-button type="primary" :icon="House" @click="goHome">{{ t("errorPage.backHome") }}</el-button>
      <el-button :icon="Back" @click="router.back()">{{ t("errorPage.backPrevious") }}</el-button>
    </template>
  </ErrorPage>
</template>

<script setup>
import { Back, House } from "@element-plus/icons-vue";
import ErrorPage from "./components/ErrorPage.vue";

defineOptions({ name: "Page401" });

const router = useRouter();
const { t } = useI18n();

function goHome() {
  router.push("/");
}
</script>
