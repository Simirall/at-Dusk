import { useLoginStore } from "@/store/login";

export const fetcher = async <T>([path, args]: [
  path: string,
  args?: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
]): Promise<T> => {
  const url = `https://${useLoginStore.getState().instance}/api${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      i: useLoginStore.getState().token,
      ...(args ?? {}),
    }),
  });
  return await res.json();
};
