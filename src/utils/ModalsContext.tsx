import { useDisclosure } from "@chakra-ui/hooks";
import { Note } from "misskey-js/built/entities";
import React, { useState, createContext, useContext } from "react";

import { NoteType } from "../features/notesSlice";

interface ModalsType {
  isPostModalOpen: boolean;
  onPostModalOpen: () => void;
  onPostModalClose: () => void;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  modalNoteData: Note;
  updateModalNoteData: React.Dispatch<React.SetStateAction<Note>>;
  modalNoteType: NoteType;
  updateModalNoteType: React.Dispatch<React.SetStateAction<NoteType>>;
}

const ModalsContext = createContext({} as ModalsType);

const ModalsProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const [type, setType] = useState("");
  const [modalNoteData, updateModalNoteData] = useState({} as Note);
  const [modalNoteType, updateModalNoteType] = useState({} as NoteType);
  const postModal = useDisclosure();
  const isPostModalOpen = postModal.isOpen;
  const onPostModalOpen = postModal.onOpen;
  const onPostModalClose = () => {
    setType("");
    updateModalNoteData({} as Note);
    updateModalNoteType({} as NoteType);
    postModal.onClose();
  };
  return (
    <>
      <ModalsContext.Provider
        value={{
          isPostModalOpen,
          onPostModalOpen,
          onPostModalClose,
          type,
          setType,
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
