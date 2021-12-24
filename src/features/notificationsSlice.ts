import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface NotificationsState {
  notifications: Array<Notification>;
  moreNotification: boolean;
  isLastNotification: boolean;
  readNotification: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  moreNotification: true,
  isLastNotification: false,
  readNotification: true,
};
export const notificationsSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    addNotifications: (state, action: PayloadAction<Array<Notification>>) => {
      state.notifications = state.notifications.concat(action.payload);
      if (action.payload.length < 15) state.isLastNotification = true;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    updateMoreNotification: (state, action: PayloadAction<boolean>) => {
      state.moreNotification = action.payload;
    },
    updateReadNotification: (state, action: PayloadAction<boolean>) => {
      state.readNotification = action.payload;
    },
  },
});

export const {
  addNotification,
  addNotifications,
  removeNotification,
  updateMoreNotification,
  updateReadNotification,
} = notificationsSlice.actions;

export const allNotifications = (state: RootState): Array<Notification> =>
  state.notifications.notifications;
export const oldestNotificationId = (state: RootState): string =>
  state.notifications.notifications.length > 0
    ? state.notifications.notifications[
        state.notifications.notifications.length - 1
      ].id
    : "";
export const moreNotification = (state: RootState): boolean =>
  state.notifications.moreNotification;
export const isLastNotification = (state: RootState): boolean =>
  state.notifications.isLastNotification;
export const readNotification = (state: RootState): boolean =>
  state.notifications.readNotification;

export default notificationsSlice.reducer;
