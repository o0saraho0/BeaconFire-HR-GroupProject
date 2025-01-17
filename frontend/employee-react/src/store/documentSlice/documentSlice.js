import { createSelector, createSlice } from '@reduxjs/toolkit';

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    // Structure: { userId: { documentType: key } }
    userDocuments: {},
  },
  reducers: {
    setDocumentKey: (state, action) => {
      const { userId, documentType, key } = action.payload;
      if (!state.userDocuments[userId]) {
        state.userDocuments[userId] = {};
      }
      state.userDocuments[userId][documentType] = key;
    },
  },
});

export const { setDocumentKey } = documentSlice.actions;
export const selectDocumentKeys = (state) => state.documents.userDocuments;
export const selectUserDocuments = createSelector(
  [selectDocumentKeys, (_, userId) => userId],
  (userDocuments, userId) => userDocuments[userId] || {}
);
export default documentSlice.reducer;