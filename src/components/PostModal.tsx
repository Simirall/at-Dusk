import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";

import { useColors } from "../utils/Colors";
import { useModalsContext } from "../utils/ModalsContext";

import { PostForm } from "./PostForm";

export const PostModal: React.VFC = () => {
  const colors = useColors();
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
            <PostForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
