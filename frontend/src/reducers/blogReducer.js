import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const blog = action.payload;
      return state.filter(b => b.id !== blog.id);
    }
  }
});

export const { setBlogs, appendBlog, removeBlog } = blogSlice.actions;

export default blogSlice.reducer;