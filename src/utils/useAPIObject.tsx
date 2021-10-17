import { useLoginContext } from "./LoginContext";

interface obj {
  type: string;
  body: APIBody | StreamBody;
}

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

interface Props {
  type: "api" | "connect";
  id: string;
  endpoint?: string;
  channel?: string;
  data?: Record<string, unknown>;
}

export const useAPIObject = (props: Props): obj => {
  const { token } = useLoginContext();
  const returnObject =
    props.type === "api"
      ? {
          type: props.type,
          body: {
            id: props.id,
            endpoint: props.endpoint,
            data: {
              i: token,
              ...props.data,
            },
          } as APIBody,
        }
      : {
          type: props.type,
          body: {
            id: props.id,
            channel: props.channel,
          } as StreamBody,
        };
  return returnObject as obj;
};
