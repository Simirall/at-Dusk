import { UserDetailed } from "misskey-js/built/entities";
import useSWR from "swr";

import { useAppSelector } from "../../app/hooks";
import { settings } from "../settingsSlice";

export const useGetUserData = (
  id: string | undefined
): { data: UserDetailed; error: Error; isLoading: boolean } => {
  const userInfo = useAppSelector(settings).userInfo;
  const fetcher = (path: string, id: string) =>
    fetch(`https://${userInfo.instance}/api${path}`, {
      method: "POST",
      body: JSON.stringify({
        i: userInfo.userToken,
        username: id.split("@")[1].split("/")[0],
        host: id.split("@")[2] ? id.split("@")[2] : null,
      }),
    }).then((r) => r.json());
  const { data, error } = useSWR(["/users/show", id], fetcher);
  return { data, error, isLoading: !error && !data };
};
