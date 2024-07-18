import { Dialog } from "@yamada-ui/react";

import { useLoginStore } from "@/store/login";

export const LogoutDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { logout } = useLoginStore();
  return (
    <Dialog
      isOpen={isOpen}
      header="ログアウトしますか？"
      success="する"
      onSuccess={logout}
      cancel="しない"
      onCancel={onClose}
    />
  );
};
