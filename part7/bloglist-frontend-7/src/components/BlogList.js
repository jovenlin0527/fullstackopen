import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import PropTypes from 'prop-types'
import sortBy from 'lodash.sortby'

import Blog from './Blog'
import BlogForm from './BlogForm'

import { blogsSelector } from '../reducers/blogsReducer'

const selectBlogsSorted = createSelector(blogsSelector, (blogs) =>
  sortBy(blogs, (blog) => -blog.likes)
)

const BlogList = ({ header }) => {
  const blogs = useSelector(selectBlogsSorted)
  return (
    <div>
      {header}
      <div className="blogList">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      <BlogForm />
    </div>
  )
}

BlogList.propTypes = {
  header: PropTypes.element,
}

export default BlogList
