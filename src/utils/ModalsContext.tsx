import { useDisclosure } from "@chakra-ui/hooks";
import { Note } from "misskey-js/built/entities";
import React, { useState, createContext, useContext } from "react";

import { NoteType } from "../features/notesSlice";

interface ModalsType {
  isPostModalOpen: boolean;
  onPostModalOpen: () => void;
  onPostModalClose: () => void;
  isEmojiModalOpen: boolean;
  onEmojiModalOpen: () => void;
  onEmojiModalClose: () => void;
  postModalType: string;
  setPostModalType: React.Dispatch<React.SetStateAction<string>>;
  emojiModalType: string;
  setEmojiModalType: React.Dispatch<React.SetStateAction<string>>;
  modalNoteData: Note;
  updateModalNoteData: React.Dispatch<React.SetStateAction<Note>>;
  modalNoteType: NoteType;
  updateModalNoteType: React.Dispatch<React.SetStateAction<NoteType>>;
}

const ModalsContext = createContext({} as ModalsType);

const ModalsProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const [postModalType, setPostModalType] = useState("");
  const [emojiModalType, setEmojiModalType] = useState("");
  const [modalNoteData, updateModalNoteData] = useState({} as Note);
  const [modalNoteType, updateModalNoteType] = useState({} as NoteType);
  const postModal = useDisclosure();
  const emojiModal = useDisclosure();
  const isPostModalOpen = postModal.isOpen;
  const onPostModalOpen = postModal.onOpen;
  const onPostModalClose = () => {
    setPostModalType("");
    updateModalNoteData({} as Note);
    updateModalNoteType({} as NoteType);
    postModal.onClose();
  };
  const isEmojiModalOpen = emojiModal.isOpen;
  const onEmojiModalOpen = emojiModal.onOpen;
  const onEmojiModalClose = () => {
    setEmojiModalType("");
    updateModalNoteData({} as Note);
    emojiModal.onClose();
  };
  return (
    <>
      <ModalsContext.Provider
        value={{
          isPostModalOpen,
          onPostModalOpen,
          onPostModalClose,
          isEmojiModalOpen,
          onEmojiModalOpen,
          onEmojiModalClose,
          postModalType,
          setPostModalType,
          emojiModalType,
          setEmojiModalType,
          modalNoteData,
          updateModalNoteData,
          modalNoteType,
          updateModalNoteType,
        }}
      >
        {children}
      </ModalsContext.Provider>
    </>
  );
};

const useModalsContext = (): ModalsType => useContext(ModalsContext);

export { ModalsProvider, useModalsContext };
