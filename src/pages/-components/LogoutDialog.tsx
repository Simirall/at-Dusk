import { Dialog } from "@yamada-ui/react";

import { useLoginStore } from "@/store/login";
import { useNavigate } from "@tanstack/react-router";

export const LogoutDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { logout } = useLoginStore();
  const navigate = useNavigate();

  return (
    <Dialog
      isOpen={isOpen}
      header="ログアウトしますか？"
      success="する"
      onSuccess={() => {
        logout();
        navigate({ to: "/login" });
      }}
      cancel="しない"
      onCancel={onClose}
    />
  );
};
