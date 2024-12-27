import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async() => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({authUser:res.data});

      get().connectSocket();

    } catch (error) {
      console.log(`Error in checkAuth: ${error}`)
      set({authUser:null})
    } finally {
      set({isCheckingAuth:false})
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data});
      toast.success("Account created successfully");

      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message);

    } finally {
      set({isSigningUp:false});
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({authUser: null});
      toast.success("Logged out successfully");


      // disconnect to socket after logout
      get().disconnectSocket()

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // after user logins, the socket is then connected!
      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  connectSocket: () => {

    // check if user auth status
    const {authUser} = get();
    // if (!authUser) {
    //   return;
    // }
    if (!authUser || get().socket?.connected) {
      return;
    }
    // io object client connects to socket server 
    // const socket = io(BASE_URL);
    // whenever socket client connects to socker server, we take out the online user from socket backend
    const socket = io(BASE_URL, {
      query:{
        userID: authUser._id
      }
    });
    socket.connect();

    set({socket:socket});

    socket.on("getOnlineUsers", (userIDs) => {
      set({onlineUsers: userIDs})
    })
    

  },

  disconnectSocket: () => {
    if ( get().socket?.connected) {
      get().socket.disconnect();
    }
  },

  updateProfile: async(data) => {
    // set global state of isUpdatingProfile: true;
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      // then, set the global state data of current user to new updated data
      set({authUser: res.data});
      toast.success("Profile updated successfully");

    } catch (error) {
      console.log(`Error in update profile ${error}`);
      toast.error(error.response.data.message);
    } finally {
      set({isUpdatingProfile: false});
    }
  },

  



}))