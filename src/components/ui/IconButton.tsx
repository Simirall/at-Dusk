import {
  IconButton as CkIconButton,
  IconButtonProps,
  forwardRef,
} from "@chakra-ui/react";
import React, { memo } from "react";

import { useColorContext } from "../../utils/ColorContext";

export const IconButton = memo(
  forwardRef<
    IconButtonProps & { model?: "alpha" | "alpha-primary" | "primary" } & {
      state?: boolean;
    } & { label: string },
    "button"
  >(({ model = "alpha", state, label, ...props }, ref) => {
    const { colors } = useColorContext();
    const colorProps: Omit<IconButtonProps, "aria-label"> =
      model === "alpha"
        ? {
            color: colors.text,
            bgColor: colors.alpha50,
            _hover: {
              bgColor: colors.alpha400,
            },
            _active: {
              bgColor: colors.alpha200,
            },
          }
        : model === "alpha-primary"
        ? {
            color: state ? colors.textPrimary : colors.text,
            bgColor: state ? colors.primaryColor : colors.alpha50,
            _hover: {
              bgColor: state ? colors.primaryThick : colors.alpha400,
            },
            _active: {
              bgColor: state ? colors.primaryThin : colors.alpha200,
            },
          }
        : model === "primary"
        ? {
            color: colors.textPrimary,
            bgColor: colors.primary,
            _hover: {
              bgColor: colors.primaryThick,
            },
            _active: {
              bgColor: colors.primaryThin,
            },
          }
        : {};
    return (
      <CkIconButton ref={ref} {...props} {...colorProps} aria-label={label} />
    );
  })
);
