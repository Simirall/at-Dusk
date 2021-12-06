import { useMemo } from "react";

import { useLoginContext } from "./LoginContext";

interface APIBody {
  id: string;
  endpoint: string;
  data: {
    i: string;
  };
}

interface StreamBody {
  id: string;
  channel: string;
}

export interface APIObject {
  type: string;
  body: APIBody;
}

export interface StreamObject {
  type: string;
  body: StreamBody;
}

export interface DisconnectObject {
  type: string;
  body: {
    id: string;
  };
}

interface Props {
  type: "api" | "connect" | "disconnect";
  id: string;
  endpoint?: string;
  channel?: string;
  data?: Record<string, unknown>;
}

export const useAPIObject = (
  props: Props
): APIObject | StreamObject | DisconnectObject => {
  const { token } = useLoginContext();
  return useMemo(
    () =>
      props.type === "api"
        ? ({
            type: props.type,
            body: {
              id: props.id,
              endpoint: props.endpoint,
              data: {
                i: token,
                ...props.data,
              },
            },
          } as APIObject)
        : props.type === "connect"
        ? ({
            type: props.type,
            body: {
              id: props.id,
              channel: props.channel,
            },
          } as StreamObject)
        : ({
            type: props.type,
            body: {
              id: props.id,
            },
          } as DisconnectObject),
    [props, token]
  );
};
