
import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction"
// import {setTokenIsThere} from "@/config/redux/reducer/postReducer"

const initialState = {
  
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere:false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_profiles_fetched:false,
  allUser:[],
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleloginUser: (state) => {
      state.message = "hello"
    },
    emptyMessage: (state) => {
      state.message = ""
    },
    setTokenIsThere:(state)=>{
      state.isTokenThere = true
    },
    setTokenIsNotThere:(state)=>{
      state.isTokenThere = false
      
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.message = "Knocking the door..."
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is Successful"
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you..."
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // state.loggedIn = true;
        // FIXED HERE
        state.message = {
          message: "Registration successful, please login"}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
      })
      .addCase(getAboutUser.fulfilled,(state, action) =>{
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
        console.log("USER SET:", action.payload.profile)
        // if(action.payload?.profile){
        //   state.user = action.payload.profile
        // }
       
      })
      .addCase(getAllUsers.fulfilled,(state,action)=>{
         console.log("getAllUsers payload:", action.payload)
        state.isLoading = false;
        state.isError=false;
        state.all_profiles_fetched =true;
        state.allUser = action.payload.users

        console.log(state.allUser)
      })
      .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
        state.connections=action.payload
      })
      .addCase(getConnectionsRequest.rejected,(state,action)=>{
        state.message=action.payload
      })
      .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
        state.connectionRequest= action.payload
      })
      .addCase(getMyConnectionRequests.rejected,(state,action)=>{
        state.message=action.payload
      })
  }
})

export const { reset, emptyMessage,setTokenIsThere,setTokenIsNotThere } = authSlice.actions
export default authSlice.reducer