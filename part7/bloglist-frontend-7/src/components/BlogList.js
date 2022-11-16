import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import sortBy from 'lodash.sortby'

import Blog from './Blog'
import BlogForm from './BlogForm'

import { blogsSelector } from '../reducers/blogsReducer'

const selectBlogsSorted = createSelector(blogsSelector, (blogs) =>
  sortBy(blogs, (blog) => -blog.likes)
)

const BlogList = () => {
  const blogs = useSelector(selectBlogsSorted)
  return (
    <div>
      <div className="blogList">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      <BlogForm />
    </div>
  )
}

BlogList.propTypes = {}

export default BlogList
