import { create } from 'zustand'
import api from "../services/api.js"
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
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
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Sign Up Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success(" Logged in Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Log in Failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Log out Failed");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Update Profile Failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketURL, {
      query: {
        userId: authUser._id,
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