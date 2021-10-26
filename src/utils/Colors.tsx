import { useColorModeValue } from "@chakra-ui/color-mode";

export const useColors = (): Record<string, string> => {
  const AccordionButtonColor = useColorModeValue(
    "blackAlpha.200",
    "whiteAlpha.200"
  );
  const baseColor = useColorModeValue("light.base", "dark.base");
  const panelColor = useColorModeValue("light.panel", "dark.panel");
  const primaryColor = useColorModeValue("light.primary", "dark.primary");
  const secondaryColor = useColorModeValue("light.secondary", "dark.secondary");
  const textColor = useColorModeValue("light.text", "dark.text");
  const headerTextColor = useColorModeValue(
    "light.headerText",
    "dark.headerText"
  );
  const borderColor = useColorModeValue("light.secondary", "dark.secondary");
  return {
    AccordionButtonColor: AccordionButtonColor,
    baseColor: baseColor,
    panelColor: panelColor,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    textColor: textColor,
    headerTextColor: headerTextColor,
    borderColor: borderColor,
  };
};
