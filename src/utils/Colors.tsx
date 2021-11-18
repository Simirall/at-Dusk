import { useColorModeValue } from "@chakra-ui/color-mode";

export const useColors = (props?: string): Record<string, string> => {
  const alpha50 = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const alpha200 = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const alpha400 = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
  const alpha600 = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
  const baseColor = useColorModeValue("light.base", "dark.base");
  const panelColor = useColorModeValue("light.panel", "dark.panel");
  const primaryColor = useColorModeValue("light.primary", "dark.primary");
  const primaryDarkerColor = useColorModeValue(
    "light.primary_darker",
    "dark.primary_darker"
  );
  const secondaryColor = useColorModeValue("light.secondary", "dark.secondary");
  const textColor = useColorModeValue("light.text", "dark.text");
  const headerTextColor = useColorModeValue(
    "light.headerText",
    "dark.headerText"
  );
  const borderColor = useColorModeValue("light.secondary", "dark.secondary");
  if (props === "alpha") {
    return {
      alpha50: alpha50,
      alpha200: alpha200,
      alpha400: alpha400,
      alpha600: alpha600,
    };
  } else {
    return {
      alpha50: alpha50,
      alpha200: alpha200,
      alpha400: alpha400,
      alpha600: alpha600,
      baseColor: baseColor,
      panelColor: panelColor,
      primaryColor: primaryColor,
      primaryDarkerColor: primaryDarkerColor,
      secondaryColor: secondaryColor,
      textColor: textColor,
      headerTextColor: headerTextColor,
      borderColor: borderColor,
    };
  }
};
