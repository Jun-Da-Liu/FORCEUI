import { useDictSync } from "./useDictSync";
import { useOnlineCount } from "./useOnlineCount";
import { cleanupSse } from "./useSse";

export function setupSse() {
  const dictSync = useDictSync();
  dictSync.initialize();

  const onlineCount = useOnlineCount({ autoInit: false });
  onlineCount.initialize();
}

export function cleanupSseServices() {
  const dictSync = useDictSync();
  dictSync.cleanup();

  const onlineCount = useOnlineCount({ autoInit: false });
  onlineCount.cleanup();

  cleanupSse();
}

export { useDictSync } from "./useDictSync";
export { useOnlineCount } from "./useOnlineCount";
export { useSse, cleanupSse, SseConnectionState } from "./useSse";
