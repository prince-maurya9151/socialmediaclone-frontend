

/*
steps for State management 
submit Action
handle action in it's reducer
register here -> Reducer
 */

// import authReducer from "./reducer/authReducer";

const { configureStore } = require("@reduxjs/toolkit");
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

 export const store = configureStore({
  reducer:{
    auth:authReducer,
    postReducer: postReducer,
  }
})