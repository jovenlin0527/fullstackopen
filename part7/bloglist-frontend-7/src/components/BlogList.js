import PropTypes from 'prop-types'
import sortBy from 'lodash.sortby'

import { useSelector } from 'react-redux'

import Blog from './Blog'
import BlogForm from './BlogForm'

import { blogsSelector } from '../reducers/blogsReducer'

const BlogList = ({ header }) => {
  const blogs = useSelector((state) => {
    const blogs = blogsSelector(state)
    return sortBy(blogs, (blog) => -blog.likes)
  })
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
