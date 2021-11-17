import { useColors } from "./Colors";

export const useStyleProps = (): Record<
  string,
  Record<string, string | Record<string, string>>
> => {
  const colors = useColors();
  return {
    AlphaButton: {
      bgColor: colors.alpha200,
      _hover: {
        bgColor: colors.alpha600,
      },
      _active: {
        bgColor: colors.alpha400,
      },
    },
    DisabledBgColor: {
      bgColor: colors.alpha50,
      _hover: {
        bgColor: colors.alpha50,
      },
      _active: {
        bgColor: colors.alpha0,
      },
    },
  };
};
