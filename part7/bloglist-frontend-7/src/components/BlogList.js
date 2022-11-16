import PropTypes from 'prop-types'
import sortBy from 'lodash.sortby'

import { useSelector } from 'react-redux'

import Blog from './Blog'
import BlogForm from './BlogForm'

import { blogsSelector } from '../reducers/blogsReducer'

const BlogList = ({ username, header, likeBlog, deleteBlog }) => {
  const blogs = useSelector((state) => {
    const blogs = blogsSelector(state)
    return sortBy(blogs, (blog) => -blog.likes)
  })
  return (
    <div>
      {header}
      <div className="blogList">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            doLike={() => likeBlog(blog)}
            doDelete={
              username === blog.user.username
                ? () => {
                    deleteBlog(blog)
                  }
                : null
            }
          />
        ))}
      </div>
      <BlogForm />
    </div>
  )
}

BlogList.propTypes = {
  username: PropTypes.string,
  header: PropTypes.element,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default BlogList
