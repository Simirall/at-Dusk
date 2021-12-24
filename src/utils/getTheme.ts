import { extendTheme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";

export const getTheme = (
  lightTheme?: string,
  darkTheme?: string
): Dict<string> => {
  return extendTheme({
    colors: {
      light: getLightTheme(lightTheme),
      dark: getDarkTheme(darkTheme),
    },
    styles: {
      global: (props: Record<"colorMode", string>) => ({
        "::selection": {
          color:
            props.colorMode === "dark"
              ? "var(--chakra-colors-dark-headerText)"
              : "var(--chakra-colors-light-headerText)",
          backgroundColor:
            props.colorMode === "dark"
              ? "var(--chakra-colors-dark-primary)"
              : "var(--chakra-colors-light-primary)",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${
            props.colorMode === "dark"
              ? "var(--chakra-colors-dark-primary)"
              : "var(--chakra-colors-light-primary)"
          } ${
            props.colorMode === "dark"
              ? "var(--chakra-colors-dark-base_lighter)"
              : "var(--chakra-colors-light-base_darker)"
          }`,
          transitionDuration: "normal",
          transitionProperty: "color, background-color, border-color",
        },
        "*::-webkit-scrollbar": {
          width: "0.5rem",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor:
            props.colorMode === "dark" ? "dark.primary" : "light.primary",
          borderRadius: "5px",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor:
            props.colorMode === "dark"
              ? "dark.base_lighter"
              : "light.base_darker",
        },
      }),
    },
  });
};

const getLightTheme = (lightTheme: string | undefined) => {
  const theme = lightTheme ? lightTheme : localStorage.getItem("light-theme");
  switch (theme) {
    case "moss":
      return {
        base: "#5f736a",
        base_darker: "#85a798",
        panel: "#6a7b74",
        primary: "#f2e5a2",
        primary_darker: "#e1cc5b",
        secondary: "#d9af8b",
        text: "#fcf7e6",
        headerText: "#1a1117",
      };
    default:
      return {
        base: "#f2f8f3",
        base_darker: "#182521",
        panel: "#f0f3e9",
        primary: "#f5df4d",
        primary_darker: "#e2d055",
        secondary: "#1a9069",
        text: "#182521",
        headerText: "#182521",
      };
  }
};

const getDarkTheme = (darkTheme: string | undefined) => {
  const theme = darkTheme ? darkTheme : localStorage.getItem("dark-theme");
  switch (theme) {
    case "Ginkgo":
      return {
        base: "#1a1117",
        base_lighter: "#5f3c47",
        panel: "#1f151b",
        primary: "#3367d7",
        primary_darker: "#2d54a6",
        secondary: "#fae732",
        text: "#fefde2",
        headerText: "#fefde2",
      };
    default:
      return {
        base: "#001520",
        base_lighter: "#0f2f59",
        panel: "#0a2635",
        primary: "#075f73",
        primary_darker: "#085061",
        secondary: "#89f3f8",
        text: "#dff8f9",
        headerText: "#a7d9cb",
      };
  }
};
