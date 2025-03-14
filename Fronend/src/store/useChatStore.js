import {create} from "zustand"
import api from "../services/api.js"
import { useAuthStore } from "./useAuthstore.js"
import Message from "../../../Backend/src/models/message.models.js"
import { getMessage } from "../../../Backend/src/controllers/message.controller.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  useStore: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isFriend: false,
  
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching users"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get("/message/" + userId);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while getting messages users"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending messages users"
      );
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));

import { create } from "zustand";
import api from "../src/services/api.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in CheckAuth", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  Signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Accout create Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Sign Up Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await api.post("/auth/signin", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Sign In Failed");
    } finally {
      set({ isSigningIn: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logout is Successfully");
    } catch (error) {
      toast.error(error.response.data.message | "Log Out Failed");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("updating Profile is Successfully");
    } catch (error) {
      toast.error(error.response.data.message | "Log Out Failed");
    } finally {
      set({ isUpdatingProfile: true });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketURL, {
      query: {
        userID: authUser._id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });
    //listen for online users
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
  },
}));