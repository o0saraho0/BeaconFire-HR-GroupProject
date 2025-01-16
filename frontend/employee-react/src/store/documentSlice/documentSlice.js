import { createSlice } from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    keys: {},
  },
  reducers: {
    setDocumentKey: (state, action) => {
      const { documentType, key } = action.payload;
      state.keys[documentType] = key;
    },
  },
});

export const { setDocumentKey } = documentSlice.actions;
export const selectDocumentKeys = (state) => state.documents.keys;
export default documentSlice.reducer;