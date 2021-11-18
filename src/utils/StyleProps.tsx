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
    PrimaryButton: {
      bgColor: colors.primaryColor,
      _hover: {
        bgColor: colors.primaryDarkerColor,
      },
      _active: {
        bgColor: colors.primaryDarkerColor,
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
