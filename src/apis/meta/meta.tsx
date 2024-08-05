import useSWR from "swr";

import type { MetaDetailed } from "misskey-js/entities.js";

export const useMeta = () => {
  const { data } = useSWR<MetaDetailed>(["/meta", { detail: true }]);

  return { data };
};
