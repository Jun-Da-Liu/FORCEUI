import { constantRoutes } from "@/router";
import { store } from "@/stores";
import router from "@/router";
import { useUserStoreHook } from "@/stores/user";
import i18n from "@/lang";
import { ElMessageBox } from "element-plus";

import MenuAPI from "@/api/system/menu";
const modules = import.meta.glob("../views/**/**.vue");
const Layout = () => import("../layouts/index.vue");

function resolveViewComponent(componentPath) {
  const normalized = componentPath
    .trim()
    .replace(/^\/+/, "")
    .replace(/\.vue$/i, "");
  return (
    modules[`../views/${normalized}.vue`] ||
    modules[`../views/${normalized}/index.vue`] ||
    modules[`../views/dynamic-menu/index.vue`]
  );
}

export const usePermissionStore = defineStore("permission", () => {
  // 所有路由（静态路由 + 动态路由）
  const routes = ref([]);
  // 混合布局的左侧菜单路由
  const mixLayoutSideMenus = ref([]);
  // 动态路由是否已生成
  const isRouteGenerated = ref(false);

  /** 生成动态路由 */
  async function generateRoutes() {
    try {
      const data = await MenuAPI.getRoutes(); // 获取当前登录人的菜单路由
      const dynamicRoutes = transformRoutes(transformMenuNodes(data));

      routes.value = [...constantRoutes, ...dynamicRoutes];
      isRouteGenerated.value = true;

      return dynamicRoutes;
    } catch (error) {
      // 路由生成失败，重置状态
      isRouteGenerated.value = false;
      throw error;
    }
  }

  /** 设置混合布局左侧菜单 */
  const setMixLayoutSideMenus = (parentPath) => {
    const parentMenu = routes.value.find((item) => item.path === parentPath);
    mixLayoutSideMenus.value = parentMenu?.children || [];
  };

  /** 重置路由状态 */
  const resetRouter = () => {
    // 移除动态添加的路由
    const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));
    routes.value.forEach((route) => {
      if (route.name && !constantRouteNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 重置所有状态
    routes.value = [...constantRoutes];
    mixLayoutSideMenus.value = [];
    isRouteGenerated.value = false;
  };

  let reloadPromise = null;

  /**
   * 重新加载动态路由（单飞）。
   *
   * 典型场景：后端权限变更导致接口返回权限不足（A0301），前端需要刷新路由和菜单以同步最新权限。
   */
  async function reloadDynamicRoutesOnce() {
    if (reloadPromise) return reloadPromise;

    reloadPromise = (async () => {
      try {
        resetRouter();
        const dynamicRoutes = await generateRoutes();
        dynamicRoutes.forEach((route) => {
          router.addRoute(route);
        });
        return dynamicRoutes;
      } finally {
        reloadPromise = null;
      }
    })();

    return reloadPromise;
  }

  let snapshotPromise = null;

  /**
   * 刷新权限快照（单飞）。
   *
   * - 刷新用户信息（包含 perms/roles 等）
   * - 重新加载动态路由
   */
  async function reloadPermissionSnapshotOnce() {
    if (snapshotPromise) return snapshotPromise;

    snapshotPromise = (async () => {
      try {
        const userStore = useUserStoreHook();
        await userStore.getUserInfo();
        await reloadDynamicRoutesOnce();
      } finally {
        snapshotPromise = null;
      }
    })();

    return snapshotPromise;
  }

  return {
    routes,
    mixLayoutSideMenus,
    isRouteGenerated,
    generateRoutes,
    setMixLayoutSideMenus,
    resetRouter,
    reloadDynamicRoutesOnce,
    reloadPermissionSnapshotOnce,
  };
});

/**
 * 转换后端路由数据为Vue Router配置
 * 处理组件路径映射和Layout层级嵌套
 */
const transformRoutes = (routes, isTopLevel = true) => {
  return routes.map((route) => {
    const { component, children, ...args } = route;

    // 处理组件：顶层或非Layout保留组件，中间层Layout设为undefined
    const processedComponent = isTopLevel || component !== "Layout" ? component : undefined;

    const normalizedRoute = { ...args };

    if (!processedComponent) {
      // 多级菜单的父级菜单，不需要组件
      normalizedRoute.component = undefined;
    } else {
      // 动态导入组件，Layout特殊处理，找不到组件时返回404
      normalizedRoute.component =
        processedComponent === "Layout" ? Layout : resolveViewComponent(processedComponent);
    }

    // 递归处理子路由
    if (children && children.length > 0) {
      normalizedRoute.children = transformRoutes(children, false);
    }

    return normalizedRoute;
  });
};

/**
 * Convert the menu schema returned by /api/v1/menus/my to route records.
 * nodeUrl is treated as both the browser path and the view component path.
 */
const CHILD_NODE_ICON = "el-icon-Document";
const LOGOUT_NODE_ID = 1026;

const parentNodeIcons = {
  1001: "el-icon-Connection", // GroupID
  1007: "el-icon-DataBoard", // SAP
  1010: "el-icon-Van", // FUYU
  1013: "el-icon-Stamp", // Customs
  1014: "el-icon-Files", // Master Data
  1022: "el-icon-Setting", // System
  1026: "el-icon-SwitchButton", // Login Out
  1040: "el-icon-DataAnalysis", // Report Search
  1048: "el-icon-DocumentAdd", // Customs Registration
  1107: "el-icon-Lock", // Customs_VCGL
};

const fallbackParentIcons = [
  "el-icon-Folder",
  "el-icon-Menu",
  "el-icon-Grid",
  "el-icon-Box",
  "el-icon-Tickets",
  "el-icon-Collection",
];

const transformMenuNodes = (nodes = [], isTopLevel = true) => {
  return [...nodes]
    .sort((a, b) => (a.nodeSort ?? 0) - (b.nodeSort ?? 0))
    .map((node) => {
      const children = transformMenuNodes(node.children || [], false);
      const nodeUrl = normalizeNodeUrl(node.nodeUrl);
      const fallbackPath = normalizePathSegment(node.nodeName) || `menu-${node.nodeId}`;
      const path = nodeUrl ? `/${nodeUrl}` : isTopLevel ? `/${fallbackPath}` : fallbackPath;
      const hasChildren = children.length > 0;
      const isParentNode = isTopLevel || hasChildren;
      const isLogoutNode = Number(node.nodeId) === LOGOUT_NODE_ID;

      return {
        path,
        name: `Menu_${node.nodeId}`,
        component: isTopLevel ? "Layout" : hasChildren ? undefined : nodeUrl,
        redirect: hasChildren ? findFirstLeafPath(children) : undefined,
        ...(isLogoutNode ? { beforeEnter: handleLogoutMenuAction } : {}),
        meta: {
          title: node.nodeName,
          icon: isParentNode ? resolveParentNodeIcon(node.nodeId) : CHILD_NODE_ICON,
          action: isLogoutNode ? "logout" : undefined,
          alwaysShow: hasChildren,
          keepAlive: false,
        },
        children,
      };
    });
};

async function handleLogoutMenuAction(_to, from) {
  const { t } = i18n.global;

  try {
    await ElMessageBox.confirm(t("toolbar.logoutConfirm"), t("common.tip"), {
      confirmButtonText: t("settings.confirm"),
      cancelButtonText: t("settings.cancel"),
      type: "warning",
      lockScroll: false,
    });
  } catch {
    return false;
  }

  await useUserStoreHook().logout();

  const redirect = ["/404", "/401"].includes(from.path) ? "/" : from.fullPath;
  return {
    path: "/login",
    query: { redirect },
    replace: true,
  };
}

function resolveParentNodeIcon(nodeId) {
  if (parentNodeIcons[nodeId]) return parentNodeIcons[nodeId];

  const numericNodeId = Number(nodeId);
  const iconIndex = Number.isFinite(numericNodeId)
    ? Math.abs(numericNodeId) % fallbackParentIcons.length
    : 0;
  return fallbackParentIcons[iconIndex];
}

function normalizeNodeUrl(nodeUrl = "") {
  return nodeUrl.trim().replace(/^\/+|\/+$/g, "");
}

function normalizePathSegment(value = "") {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/^\/+|\/+$/g, "");
}

function findFirstLeafPath(routes) {
  for (const route of routes) {
    if (route.children?.length) {
      const childPath = findFirstLeafPath(route.children);
      if (childPath) return childPath;
    } else {
      return route.path;
    }
  }
}

/** 非组件环境使用权限store */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
