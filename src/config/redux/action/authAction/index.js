// import { clientServer } from "@/config";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// // import axios from "axios";


// export const loginUser = createAsyncThunk(
//   "user/login",
//   async(userAgent,thunkAPI)=>{
//     try{
//       const response = await clientServer.post('/login', {
//         email: userAgent.email,
//         password: userAgent.password
//       })
//       if(response.data.token){
//         localStorage.setItem("token",response.data.token)
//       }else{
//         return thunkAPI.rejectWithValue({
//           message: "token not provided"
//         })
//       }
//       return thunkAPI.fulfillWithValue(response.data.token)
//     }catch(error){
//       return thunkAPI.rejectWithValue(error.response.data

//       )
//     }
//   }
// )


// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (user,thunkAPI)=>{
//     try{
//       const request= await clientServer.post("/register",{
//         username: user.username,
//         password: user.password,
//         email: user.email,
//         name: user.name,
       
//       })
//     }catch(err){
//       return            thunkAPI.rejectWithValue(err.response.data)
//     }
//   }
// )


// export const getAboutUser = createAsyncThunk(
//   "user/getAboutUser",
//   async(user,thunkAPI)=>{
//     try{
        

//       const response = await clientServer.get("/get_user_and_profile",{
//         params:{
//           token: user.token
//         }
//       })
//       return thunkAPI.fulfillWithValue(response.data)
//     }catch(err){
//       return thunkAPI.rejectWithValue(err.response.data)
//     }
//   }
// )


// export const getAllUsers = createAsyncThunk(
//   "user/getAllUsers",
//   async(_, thunkAPI)=>{
//     try{
//       const response = await clientServer.get("/user/get_all_users")
//       return thunkAPI.fulfillWithValue(response.data)

//     }catch(err){
//       return thunkAPI.rejectWithValue(err.response.data)
//     }
//   }
// )

// export const sendConnectionRequest = createAsyncThunk(
//   "user/sendConnectionRequest",
//   async(user,thunkAPI)=>{
//     try{
//       const response = await clientServer.post("/user/send_connection_request",{
//         token:usertoken,
//         connectionId:user.user_id

//       })
//       thunkAPI.dispatch(getConnectionsRequest
//         ({token:user.token})
//       )
//       return thunkAPI.fulfillWithValue(response.data)

//     }catch(error){
//       return thunkAPI.rejectWithValue(error.response.data.message)

//     }
//   }
// )


// export const getConnectionsRequest= createAsyncThunk(
//   "user/getConnectionRequests",
//   async(user,thunkAPI)=>{
//     try {
//       const response =await clientServer.get("/user/getConnectionRequests",{
//         params:{
//           token:user.token
//         }
       

//       })
//        return thunkAPI.fulfillWithValue(response.data.connections)
//     } catch (error) {
//       console.log(error)
//       return thunkAPI.rejectWithValue(error.response.data.message)
      
//     }
//   }
// )

// export const getMyConnectionRequests = createAsyncThunk(
//   "user/getMyConnectionRequests",
//   async(user,thunkAPI)=>{
//     try {
//       const response = await clientServer.get("/user/user_connection_request",{
      
//         params: {token:user.token}
//       })
//       return thunkAPI.fulfillWithValue(response.data.connections)
//       } catch (error) {
//         return thunkAPI.rejectWithValue(error.response.data.message)
//     }
//   }
// )

// export const AcceptConnection = createAsyncThunk(
//   "user/acceptConnection",
//   async(user,thunkAPI)=>{
//     try {
//       const response= await clientServer.post("/user/accept_connection_request",{
//         token:user.token,
//         requestId:user.connectionId,
//         action_type:user.action
//       })
//       thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
//       thunkAPI.dispatch(getMyConnectionRequests({token:user.token}))
//       return thunkAPI.fulfillWithValue(response.data)
      
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data)
      
//     }
//   }
// )



import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (userAgent, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: userAgent.email,
        password: userAgent.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=86400`
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }
      
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      console.log("getAboutUser called with token:", user.token)
      const response = await clientServer.post("/get_user_and_profile", {
        token: user.token,
      });
      console.log("getAboutUser response:", response.data)

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      console.llog("getAboutUser Error:",err.response?.data)
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ✅ GET ALL USERS (already correct)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      // Auth state se token lo
      const token = thunkAPI.getState().auth.token  // ya jahan token store hai
      
      const response = await clientServer.get("/user/get_all_users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


// ✅ 🔥 FIXED (usertoken → user.token)
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );

      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/getConnectionRequests",
        {
          params: { token: user.token },
        }
      );

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/user_connection_request",
        {
          params: { token: user.token },
        }
      );

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


// ✅ 🔥 FIXED (route spelling)
export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          token: user.token,
          requestId: user.connectionId,
          action_type: user.action,
        }
      );

      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);