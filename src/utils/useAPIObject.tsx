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

interface Props {
  type: "api" | "connect";
  id: string;
  endpoint?: string;
  channel?: string;
  data?: Record<string, unknown>;
}

export const useAPIObject = (props: Props): APIObject | StreamObject => {
  const { token } = useLoginContext();
  return props.type === "api"
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
    : ({
        type: props.type,
        body: {
          id: props.id,
          channel: props.channel,
        },
      } as StreamObject);
};
