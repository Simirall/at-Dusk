import React from "react";
import { Global, css } from "@emotion/react";

const focusVisibleStyle = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

export const FocusVisible: React.VFC = () => {
  return (
    <>
      <Global styles={focusVisibleStyle} />
    </>
  );
};
