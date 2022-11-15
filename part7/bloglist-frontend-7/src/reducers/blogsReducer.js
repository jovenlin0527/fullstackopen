import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import blogsService from '../services/blogs'

const initialState = []

export const getBlogs = createAsyncThunk('blogs/getBlogs', async () => {
  return blogsService.getAll()
})

export const submitBlog = createAsyncThunk(
  'blogs/submitBlog',
  async ({ title, author, url }) => {
    return await blogsService.post({ title, author, url, likes: 0 })
  }
)

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id) => {
  await blogsService.deleteBlog(id)
  return id
})

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (_state, action) => {
      return action.payload
    },
    removeBlog: (state, action) => {
      const idToRemove = action.payload
      return state.filter(({ id }) => id === idToRemove)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitBlog.fulfilled, (state, action) => {
      state.push(action.payload)
    })
    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      const idToRemove = action.payload
      return state.filter(({ id }) => id !== idToRemove)
    })
    builder.addCase(getBlogs.fulfilled, (_state, action) => {
      return action.payload
    })
  },
})

export const { setBlogs, removeBlog } = blogsSlice.actions

export const blogsSelector = (state) => state.blogs
export default blogsSlice.reducer
