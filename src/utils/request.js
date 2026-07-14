import axios from "axios";
import qs from "qs";
import { ApiCodeEnum } from "@/enums/api";
import { useUserStoreHook } from "@/stores/user";
import { usePermissionStoreHook } from "@/stores/permission";
import { AuthStorage, redirectToLogin } from "@/utils/auth";
import { ElMessage } from "element-plus";
import i18n from "@/lang";

const translate = (key) => i18n.global.t(key);

// 记录已重试的请求，防止无限循环
const retriedConfigs = new WeakSet();

// HTTP 请求实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getAccessToken();

    if (config.headers.Authorization === "no-auth") {
      delete config.headers.Authorization;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { responseType } = response.config;

    // 二进制数据直接返回
    if (responseType === "blob" || responseType === "arraybuffer") {
      return response;
    }

    const { code, data, msg } = response.data;

    if (code === ApiCodeEnum.SUCCESS) {
      return data;
    }

    // 需要选择租户（特殊业务码，传递给调用方处理）
    if (code === ApiCodeEnum.CHOOSE_TENANT) {
      return Promise.reject({ code, data, msg });
    }

    ElMessage.error(msg || translate("request.systemError"));
    return Promise.reject(new Error(msg || translate("request.systemError")));
  },

  async (error) => {
    const { config, response } = error;

    if (!response) {
      ElMessage.error(translate("request.networkError"));
      return Promise.reject(error);
    }

    const { code, msg } = response.data;

    // Token 过期：尝试刷新 token 后自动重试一次
    if (code === ApiCodeEnum.ACCESS_TOKEN_INVALID) {
      // 已重试过，直接跳登录
      if (retriedConfigs.has(config)) {
        await redirectToLogin(translate("request.loginExpired"), false);
      }

      retriedConfigs.add(config);

      try {
        const userStore = useUserStoreHook();
        await userStore.refreshTokenOnce();

        const token = AuthStorage.getAccessToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }

        return http(config);
      } catch {
        await redirectToLogin(translate("request.loginExpired"));
        return Promise.reject(new Error("Token refresh failed"));
      }
    }

    // Refresh token 失效：无法续期，跳转登录
    if (code === ApiCodeEnum.REFRESH_TOKEN_INVALID) {
      await redirectToLogin(translate("request.loginExpired"), false);
      return Promise.reject(new Error(msg || "Token Invalid"));
    }

    // 权限不足：刷新权限快照后提示
    if (code === ApiCodeEnum.PERMISSION_DENIED) {
      const permissionStore = usePermissionStoreHook();
      await permissionStore.reloadPermissionSnapshotOnce();
      ElMessage.error(msg || translate("request.permissionDenied"));
      return Promise.reject(new Error(msg || translate("request.permissionDenied")));
    }

    ElMessage.error(msg || translate("request.failed"));
    return Promise.reject(new Error(msg || translate("request.failed")));
  }
);

export default http;
