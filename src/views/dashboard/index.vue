<template>
  <div class="dash">
    <section class="dash-header">
      <div class="card dash-header__card">
        <div class="dash-header__start">
          <div class="dash-avatar">
            <img v-if="userStore.userInfo.avatar" :src="userStore.userInfo.avatar" alt="" />
            <el-icon v-else :size="22"><User /></el-icon>
          </div>
          <div class="dash-header__text">
            <h1 class="dash-header__greeting">{{ greetings }}</h1>
            <p class="dash-header__date">{{ currentDateStr }}</p>
          </div>
        </div>
        <div class="dash-header__end">
          <a href="https://github.com/youlaitech/vue3-element-admin" target="_blank" title="GitHub" class="quick-link">
            <span class="i-svg:github" />
            <span>GitHub</span>
          </a>
          <a href="https://gitee.com/youlaiorg/vue3-element-admin" target="_blank" title="Gitee" class="quick-link">
            <span class="i-svg:gitee" />
            <span>Gitee</span>
          </a>
          <a href="https://gitcode.com/youlai/vue3-element-admin" target="_blank" title="GitCode" class="quick-link">
            <span class="i-svg:gitcode" />
            <span>GitCode</span>
          </a>
          <a href="https://juejin.cn/post/7228990409909108793" target="_blank" :title="t('navbar.document')" class="quick-link">
            <el-icon><Document /></el-icon>
            <span>{{ t("navbar.document") }}</span>
          </a>
          <a href="https://www.bilibili.com/video/BV1eFUuYyEFj" target="_blank" :title="t('dashboard.video')" class="quick-link">
            <el-icon><VideoPlay /></el-icon>
            <span>{{ t("dashboard.video") }}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="dash-stats">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--online">
          <el-icon :size="18"><Connection /></el-icon>
        </div>
        <div class="stat-card__body">
          <span class="stat-card__label">{{ t("dashboard.onlineUsers") }}</span>
          <span class="stat-card__num">{{ onlineUserCount }}</span>
        </div>
        <span :class="['stat-card__badge', isConnected ? 'stat-card__badge--on' : 'stat-card__badge--off']">
          {{ isConnected ? t("dashboard.realtime") : t("dashboard.offline") }}
        </span>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--visitor">
          <el-icon :size="18"><User /></el-icon>
        </div>
        <div class="stat-card__body">
          <span class="stat-card__label">{{ t("dashboard.todayVisitors") }}</span>
          <span class="stat-card__num">{{ displayTransitionUvCount }}</span>
        </div>
        <span v-if="uvGrowthText !== '--'" :class="['stat-card__trend', `stat-card__trend--${uvTrendTone}`]">
          <el-icon :size="12">
            <ArrowUp v-if="uvIsUp" />
            <ArrowDown v-else />
          </el-icon>
          {{ uvGrowthText }}
        </span>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--view">
          <el-icon :size="18"><View /></el-icon>
        </div>
        <div class="stat-card__body">
          <span class="stat-card__label">{{ t("dashboard.todayViews") }}</span>
          <span class="stat-card__num">{{ displayTransitionPvCount }}</span>
        </div>
        <span v-if="pvGrowthText !== '--'" :class="['stat-card__trend', `stat-card__trend--${pvTrendTone}`]">
          <el-icon :size="12">
            <ArrowUp v-if="pvIsUp" />
            <ArrowDown v-else />
          </el-icon>
          {{ pvGrowthText }}
        </span>
      </div>

      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--account">
          <span class="stat-card__svg i-svg:group" />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__label">{{ t("dashboard.systemUsers") }}</span>
          <span class="stat-card__num">6</span>
        </div>
        <span :class="['stat-card__trend', `stat-card__trend--${systemTrendTone}`]">
          <el-icon :size="12"><ArrowUp /></el-icon>
          12.5%
        </span>
      </div>
    </section>

    <section class="dash-chart">
      <div class="card dash-chart__trend">
        <div class="card__head">
          <h3 class="card__title">{{ t("dashboard.visitTrend") }}</h3>
          <el-radio-group v-model="visitTrendDateRange" size="small">
            <el-radio-button :label="t('dashboard.last7Days')" :value="7" />
            <el-radio-button :label="t('dashboard.last30Days')" :value="30" />
          </el-radio-group>
        </div>
        <div class="card__body card__body--chart">
          <ECharts :options="visitTrendChartOptions" height="260px" />
        </div>
      </div>

      <div class="card dash-chart__overview">
        <div class="card__head">
          <h3 class="card__title">{{ t("dashboard.todoOverview") }}</h3>
          <el-tag type="primary" size="small" effect="plain">{{ t("dashboard.pendingItems", { count: 5 }) }}</el-tag>
        </div>
        <div class="card__body overview-card">
          <div class="overview-summary">
            <div v-for="item in todoSummaryItems" :key="item.label" class="overview-summary__item">
              <span class="overview-summary__label">{{ item.label }}</span>
              <strong class="overview-summary__value">{{ item.value }}</strong>
            </div>
          </div>
          <div class="overview-bars">
            <div v-for="item in todoOverviewItems" :key="item.label" class="overview-bars__item" :style="{ '--overview-percent': `${item.percent}%` }">
              <div class="overview-bars__meta">
                <span class="overview-bars__label">
                  <span class="overview-bars__dot" />
                  {{ item.label }}
                </span>
                <span class="overview-bars__value">{{ item.value }}</span>
              </div>
              <span class="overview-bars__track">
                <span class="overview-bars__bar" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="dash-bottom">
      <div class="card">
        <div class="card__head">
          <h3 class="card__title">{{ t("dashboard.todoItems") }}</h3>
          <el-tag size="small" round>{{ t("dashboard.pendingItems", { count: 5 }) }}</el-tag>
        </div>
        <div class="card__body">
          <div v-for="todo in todoItems" :key="todo.id" class="todo-row" :class="{ 'todo-row--done': todo.done }">
            <el-icon :size="16" :class="todo.done ? 'todo-row__icon--done' : 'todo-row__icon--pending'">
              <CircleCheck v-if="todo.done" />
              <Clock v-else />
            </el-icon>
            <span class="todo-row__title">{{ todo.title }}</span>
            <el-tag :type="todo.tone" size="small" effect="plain" class="todo-row__tag">
              {{ todo.tag }}
            </el-tag>
            <span class="todo-row__time">{{ todo.time }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <h3 class="card__title">{{ t("dashboard.systemActivity") }}</h3>
        </div>
        <div class="card__body card__body--scroll">
          <div class="feed">
            <div v-for="item in activities" :key="item.id" class="feed__item">
              <span class="feed__dot" />
              <span class="feed__text">{{ item.content }}</span>
              <span class="feed__time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineOptions({ name: "Dashboard", inheritAttrs: false });

import { dayjs } from "element-plus";
import { ref } from "vue";
import LogAPI from "@/api/system/log";
import { useUserStore } from "@/stores/user";
import { useSettingsStore } from "@/stores/settings";
import { formatGrowthRate } from "@/utils";
import { useTransition } from "@vueuse/core";
import {
  User, Connection, View, ArrowUp, ArrowDown, Clock, CircleCheck, Document, VideoPlay,
} from "@element-plus/icons-vue";
import { useOnlineCount } from "@/composables";
import { appConfig } from "@/settings";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { t, locale } = useI18n();
const { onlineUserCount, isConnected } = useOnlineCount({ autoInit: appConfig.sseEnabled });

const hours = new Date().getHours();
const greetings = computed(() => {
  const n = userStore.userInfo.nickname;
  if (hours >= 6 && hours < 8) return t("dashboard.morningEarly", { name: n });
  if (hours >= 8 && hours < 12) return t("dashboard.morning", { name: n });
  if (hours >= 12 && hours < 18) return t("dashboard.afternoon", { name: n });
  if (hours >= 18 && hours < 24) return t("dashboard.evening", { name: n });
  return t("dashboard.lateNight", { name: n });
});

const currentDateStr = computed(() => {
  const d = new Date();
  const language = locale.value === "en" ? "en-US" : "zh-CN";
  return new Intl.DateTimeFormat(language, { dateStyle: "full" }).format(d);
});

const todoItems = computed(() => [
  { id: 1, title: t("dashboard.todoLeave"), tag: t("dashboard.approval"), time: t("dashboard.minutesAgo", { count: 10 }), done: false, tone: "info" },
  { id: 2, title: t("dashboard.todoUserReview"), tag: t("dashboard.review"), time: t("dashboard.minutesAgo", { count: 30 }), done: false, tone: "info" },
  { id: 3, title: t("dashboard.todoPublishNotice"), tag: t("dashboard.notice"), time: t("dashboard.hoursAgo", { count: 1 }), done: false, tone: "info" },
  { id: 4, title: t("dashboard.todoTicket"), tag: t("dashboard.ticket"), time: t("dashboard.hoursAgo", { count: 2 }), done: false, tone: "warning" },
  { id: 5, title: t("dashboard.todoRoleUpdate"), tag: t("settings.configManagement"), time: t("dashboard.yesterdayAt", { time: "15:30" }), done: true, tone: "success" },
]);

const activities = computed(() => [
  { id: 1, content: t("dashboard.activityLogin"), time: t("dashboard.minutesAgo", { count: 3 }) },
  { id: 2, content: t("dashboard.activityUserAdded"), time: t("dashboard.minutesAgo", { count: 25 }) },
  { id: 3, content: t("dashboard.activityPolicyUpdated"), time: t("dashboard.hoursAgo", { count: 1 }) },
  { id: 4, content: t("dashboard.activityBackup"), time: t("dashboard.hoursAgo", { count: 3 }) },
  { id: 5, content: t("dashboard.activityPermissions"), time: t("dashboard.yesterdayAt", { time: "16:42" }) },
  { id: 6, content: t("dashboard.activityCertificate"), time: t("dashboard.yesterdayAt", { time: "09:15" }) },
]);

const todoOverviewItems = computed(() => [
  { label: t("dashboard.approval"), value: "2", percent: 40 },
  { label: t("dashboard.review"), value: "1", percent: 20 },
  { label: t("dashboard.notice"), value: "1", percent: 20 },
  { label: t("dashboard.ticket"), value: "1", percent: 20 },
]);

const todoSummaryItems = computed(() => [
  { label: t("dashboard.todayAdded"), value: "3" },
  { label: t("dashboard.nearlyOverdue"), value: "1" },
  { label: t("dashboard.completedToday"), value: "1" },
]);

const visitOverviewData = ref({
  todayUvCount: 0, uvGrowthRate: 0, totalUvCount: 0,
  todayPvCount: 0, pvGrowthRate: 0, totalPvCount: 0,
});

const uvGrowthText = computed(() => {
  const r = visitOverviewData.value.uvGrowthRate;
  return r == null ? "--" : formatGrowthRate(r);
});
const pvGrowthText = computed(() => {
  const r = visitOverviewData.value.pvGrowthRate;
  return r == null ? "--" : formatGrowthRate(r);
});
const uvIsUp = computed(() => (visitOverviewData.value.uvGrowthRate || 0) > 0);
const pvIsUp = computed(() => (visitOverviewData.value.pvGrowthRate || 0) > 0);
const uvTrendTone = computed(() => (uvIsUp.value ? "success" : "danger"));
const pvTrendTone = computed(() => (pvIsUp.value ? "success" : "danger"));
const systemTrendTone = "success";

const tUv = useTransition(
  computed(() => visitOverviewData.value.todayUvCount),
  { duration: 800, transition: [0.25, 0.1, 0.25, 1.0] }
);
const tPv = useTransition(
  computed(() => visitOverviewData.value.todayPvCount),
  { duration: 800, transition: [0.25, 0.1, 0.25, 1.0] }
);
const displayTransitionUvCount = computed(() => Math.round(Number(tUv.value)));
const displayTransitionPvCount = computed(() => Math.round(Number(tPv.value)));

const visitTrendDateRange = ref(7);
const visitTrendData = ref();
const visitTrendChartOptions = ref({});

function getCssVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function colorWithAlpha(color, alpha) {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value;
    const rgb = Number.parseInt(hex.slice(1), 16);
    return `rgba(${(rgb >> 16) & 255}, ${(rgb >> 8) & 255}, ${rgb & 255}, ${alpha})`;
  }
  const parts = value.match(/\d+(\.\d+)?/g);
  if (parts && parts.length >= 3) {
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return value;
}

function fetchVisitOverviewData() {
  LogAPI.getVisitOverview().then((d) => { visitOverviewData.value = d; });
}

function fetchVisitTrendData() {
  const s = dayjs().subtract(visitTrendDateRange.value - 1, "day").toDate();
  LogAPI.getVisitTrend({
    startDate: dayjs(s).format("YYYY-MM-DD"),
    endDate: dayjs(new Date()).format("YYYY-MM-DD"),
  }).then((d) => {
    visitTrendData.value = d;
    updateVisitTrendChartOptions(d);
  });
}

function updateVisitTrendChartOptions(d) {
  const primary = getCssVar("--el-color-primary", "#409eff");
  const success = getCssVar("--el-color-success", "#67c23a");
  const textSecondary = getCssVar("--el-text-color-secondary", "#909399");
  const borderLighter = getCssVar("--el-border-color-lighter", "#ebeef5");
  const gridLine = colorWithAlpha(borderLighter, 0.72);

  visitTrendChartOptions.value = {
    tooltip: { trigger: "axis", borderWidth: 0, padding: [8, 12], extraCssText: "box-shadow: var(--el-box-shadow-light); border-radius: 6px;" },
    legend: { data: [t("dashboard.pageViews"), t("dashboard.visitors")], bottom: 0, textStyle: { fontSize: 12, color: textSecondary }, itemWidth: 10, itemHeight: 8, itemGap: 24 },
    grid: { left: "0%", right: "3%", bottom: "14%", top: "5%", containLabel: true },
    xAxis: { type: "category", data: d.dates, axisTick: { show: false }, axisLine: { lineStyle: { color: colorWithAlpha(borderLighter, 0.82) } }, axisLabel: { fontSize: 11, color: textSecondary }, splitLine: { show: false } },
    yAxis: { type: "value", axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { type: "dashed", color: gridLine, width: 1 } }, axisLabel: { fontSize: 11, color: textSecondary } },
    series: [
      { name: t("dashboard.pageViews"), type: "line", data: d.pvList, smooth: true, symbol: "circle", symbolSize: 5, showSymbol: false, lineStyle: { color: primary, width: 2.2 }, itemStyle: { color: primary }, areaStyle: { opacity: 1, color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: colorWithAlpha(primary, 0.18) }, { offset: 0.52, color: colorWithAlpha(primary, 0.08) }, { offset: 1, color: colorWithAlpha(primary, 0.01) }] } } },
      { name: t("dashboard.visitors"), type: "line", data: d.uvList, smooth: true, symbol: "circle", symbolSize: 5, showSymbol: false, lineStyle: { color: colorWithAlpha(success, 0.9), width: 1.8, opacity: 0.86 }, itemStyle: { color: success }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: colorWithAlpha(success, 0.08) }, { offset: 1, color: colorWithAlpha(success, 0) }] } } },
    ],
  };
}

watch(
  () => visitTrendDateRange.value,
  () => {
    if (appConfig.analyticsEnabled) fetchVisitTrendData();
  },
  { immediate: true }
);
watch(() => [settingsStore.resolvedTheme, settingsStore.themeColors, locale.value], () => {
  if (!visitTrendData.value) return;
  requestAnimationFrame(() => { if (visitTrendData.value) updateVisitTrendChartOptions(visitTrendData.value); });
}, { deep: true });
onMounted(() => {
  if (appConfig.analyticsEnabled) fetchVisitOverviewData();
});
</script>

<style lang="scss" scoped>
$gap: 12px;
$pad: 10px;
%card {
  overflow: hidden;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.dash { display: flex; flex-direction: column; gap: $gap; padding: $pad; background: var(--page-bg); }

.dash-header {
  &__card { display: flex; flex-wrap: wrap; gap: 18px; align-items: center; justify-content: space-between; min-height: 78px; padding: 16px 18px; }
  &__start { display: flex; flex: 1; gap: 12px; align-items: center; min-width: 260px; }
  &__text { display: flex; flex-direction: column; gap: 3px; }
  &__greeting { margin: 0; font-size: 18px; font-weight: 500; line-height: 1.3; color: var(--el-text-color-primary); }
  &__date { margin: 0; font-size: 12px; color: var(--el-text-color-secondary); }
  &__end { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: flex-end; }
}

.dash-avatar { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; overflow: hidden; color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 14%, var(--el-bg-color-overlay)); border: 1px solid color-mix(in srgb, var(--el-color-primary) 18%, transparent); border-radius: 50%;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.quick-link { display: inline-flex; gap: 6px; align-items: center; justify-content: center; height: 30px; padding: 0 10px; font-size: 12px; color: var(--el-text-color-secondary); text-decoration: none; background: var(--el-fill-color-extra-light); border: 1px solid var(--el-border-color-lighter); border-radius: 6px; transition: color 0.15s, background-color 0.15s, border-color 0.15s;
  .el-icon, [class^="i-svg:"] { width: 15px; height: 15px; font-size: 15px; color: currentcolor; }
  &:hover { color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 7%, var(--el-bg-color-overlay)); border-color: color-mix(in srgb, var(--el-color-primary) 20%, var(--el-border-color-lighter)); }
}

.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: $gap; }

.stat-card { display: flex; gap: 14px; align-items: center; min-height: 84px; padding: 18px; @extend %card;
  &__icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 10px;
    &--online { color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 10%, var(--el-bg-color-overlay)); }
    &--visitor { color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color-overlay)); }
    &--view { color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color-overlay)); }
    &--account { color: var(--el-color-primary); background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color-overlay)); }
  }
  &__svg { width: 20px; height: 20px; font-size: 20px; color: currentcolor; }
  &__body { display: flex; flex: 1; flex-direction: column; min-width: 0; }
  &__num { font-size: 24px; font-weight: 600; line-height: 1.15; color: var(--el-text-color-primary); }
  &__label { margin-bottom: 3px; font-size: 13px; color: var(--el-text-color-secondary); }
  &__badge { flex-shrink: 0; font-size: 11px; font-weight: 500;
    &--on { color: var(--el-color-success); }
    &--off { color: var(--el-text-color-secondary); }
  }
  &__trend { display: inline-flex; flex-shrink: 0; gap: 3px; align-items: center; font-size: 12px; font-weight: 700; color: var(--el-text-color-secondary);
    &--success { color: var(--el-color-success); }
    &--danger { color: var(--el-color-danger); }
  }
}

.card { display: flex; flex-direction: column; @extend %card;
  &__head { display: flex; align-items: center; justify-content: space-between; min-height: 48px; padding: 13px 18px; border-bottom: 1px solid var(--card-border); }
  &__title { margin: 0; font-size: 14px; font-weight: 600; color: var(--el-text-color-primary); }
  &__body { padding: 16px 18px 18px;
    &--chart { padding: 14px 18px 16px; }
    &--scroll { flex: 1; padding: 0; overflow-y: auto; }
  }
}

.dash-header__card { flex-direction: row; }
.dash-chart { display: grid; grid-template-columns: minmax(0, 3fr) minmax(280px, 1fr); gap: $gap; }
.dash-chart__trend, .dash-chart__overview { min-width: 0; }

.overview-card { display: flex; flex: 1; flex-direction: column; gap: 20px; min-height: 0; }
.overview-bars { display: flex; flex: 1; flex-direction: column; justify-content: space-between; min-height: 142px; padding: 0;
  &__item { display: flex; flex-direction: column; gap: 7px; }
  &__meta { display: flex; gap: 10px; align-items: center; justify-content: space-between; min-width: 0; }
  &__label, &__value { font-size: 12px; color: var(--el-text-color-secondary); }
  &__value { flex-shrink: 0; text-align: right; }
  &__label { display: inline-flex; gap: 6px; align-items: center; min-width: 0; }
  &__dot { width: 6px; height: 6px; background: var(--el-color-primary); border-radius: 50%; }
  &__track { height: 5px; overflow: hidden; background: color-mix(in srgb, var(--el-color-primary) 10%, var(--el-fill-color-light)); border-radius: 999px; }
  &__bar { display: block; width: var(--overview-percent); height: 100%; background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3)); border-radius: inherit; }
}

.overview-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
  &__item { position: relative; display: flex; flex-direction: column; justify-content: center; min-width: 0; min-height: 64px; padding: 12px; overflow: hidden; background: color-mix(in srgb, var(--el-color-primary) 4%, var(--el-bg-color-overlay)); border: 1px solid color-mix(in srgb, var(--el-color-primary) 10%, var(--el-border-color-lighter)); border-radius: 6px;
    &:nth-child(2) { background: color-mix(in srgb, var(--el-color-primary) 6%, var(--el-bg-color-overlay)); border-color: color-mix(in srgb, var(--el-color-primary) 14%, var(--el-border-color-lighter));
      &::before { background: color-mix(in srgb, var(--el-color-primary) 48%, transparent); }
      .overview-summary__value { color: var(--el-color-warning); }
    }
    &:nth-child(3) { background: color-mix(in srgb, var(--el-color-primary) 3%, var(--el-bg-color-overlay)); border-color: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-border-color-lighter));
      &::before { background: color-mix(in srgb, var(--el-color-primary) 36%, transparent); }
      .overview-summary__value { color: var(--el-color-success); }
    }
    &::before { position: absolute; top: 0; left: 0; width: 100%; height: 2px; content: ""; background: color-mix(in srgb, var(--el-color-primary) 62%, transparent); }
  }
  &__label { overflow: hidden; text-overflow: ellipsis; font-size: 12px; color: var(--el-text-color-secondary); white-space: nowrap; }
  &__value { flex-shrink: 0; margin-top: 5px; font-size: 18px; font-weight: 600; line-height: 1.1; color: var(--el-color-primary); }
}

.dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: $gap; }

.todo-row { display: flex; gap: 10px; align-items: center; padding: 11px 0;
  & + & { border-top: 1px solid var(--el-border-color-lighter); }
  &--done { .todo-row__title { color: var(--el-text-color-placeholder); text-decoration: line-through; } }
  &__icon--pending { flex-shrink: 0; color: var(--el-color-primary); }
  &__icon--done { flex-shrink: 0; color: var(--el-color-success); }
  &__title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 13px; color: var(--el-text-color-regular); white-space: nowrap; }
  &__tag { flex-shrink: 0; color: var(--el-text-color-secondary); background: var(--el-fill-color-light);
    &.el-tag--warning { color: color-mix(in srgb, var(--el-color-warning) 78%, var(--el-text-color-primary)); background: color-mix(in srgb, var(--el-color-warning) 9%, var(--el-bg-color-overlay)); }
    &.el-tag--success { color: var(--el-color-success); background: color-mix(in srgb, var(--el-color-success) 8%, var(--el-bg-color-overlay)); }
  }
  &__time { flex-shrink: 0; font-size: 12px; color: var(--el-text-color-secondary); }
}

.feed { display: flex; flex-direction: column; padding: 10px 20px 16px;
  &__item { position: relative; display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; padding: 10px 0 10px 16px;
    &::before { position: absolute; top: 22px; bottom: -4px; left: 3px; width: 1px; content: ""; background: var(--el-border-color-lighter); }
    &:last-child::before { display: none; }
  }
  &__dot { position: absolute; top: 12px; left: 0; width: 7px; height: 7px; background: var(--el-color-primary); border: 2px solid var(--el-color-primary-light-8); border-radius: 50%; }
  &__text { flex: 1; min-width: 0; font-size: 13px; line-height: 1.4; color: var(--el-text-color-regular); }
  &__time { flex-shrink: 0; font-size: 12px; color: var(--el-text-color-secondary); }
}

@media (max-width: 1200px) { .dash-stats { grid-template-columns: repeat(2, 1fr); } .dash-header__card { flex-direction: column; align-items: flex-start; } .dash-header__end { justify-content: flex-start; } }
@media (max-width: 992px) { .dash-chart { grid-template-columns: 1fr; } .dash-bottom { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .dash { gap: 10px; padding: 10px; } .dash-stats { grid-template-columns: 1fr; } }
</style>
