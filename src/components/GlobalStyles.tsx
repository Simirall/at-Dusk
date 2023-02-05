import { Global } from "@mantine/core";

export const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[1]
              : theme.colors.gray[1],
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        },
      })}
    />
  );
};
