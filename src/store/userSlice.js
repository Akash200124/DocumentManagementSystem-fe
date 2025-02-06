import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',

  initialState: {
    userData: {
      email: "",
      acessToken: "",
      refreshtoken:""
    },
  },


  reducers: {
    setUserData: (state,action) => {
     state.userData = action.payload
    },


    clearUserData: (state) => {
      state.userData = {
        email: "",
        accessToken: "",
        refreshtoken:""
      };
    },

   
  },
})

// Action creators are generated for each case reducer function
export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer