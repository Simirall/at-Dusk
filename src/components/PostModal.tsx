import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { memo } from "react";

import { useColorContext } from "../utils/ColorContext";
import { useModalsContext } from "../utils/ModalsContext";

import { PostForm } from "./PostForm";

export const PostModal: React.VFC = memo(function Fn() {
  const { colors } = useColorContext();
  const { isPostModalOpen, onPostModalClose } = useModalsContext();

  return (
    <>
      <Modal isOpen={isPostModalOpen} onClose={onPostModalClose} size="xl">
        <ModalOverlay />
        <ModalContent bgColor={colors.panelColor}>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody mt="1">
            <PostForm isModal />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
