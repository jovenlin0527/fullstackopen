import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import sortBy from 'lodash.sortby'

import BlogForm from './BlogForm'
import { BlogType } from './PropTypes'

const BlogList = ({ blogs }) => {
  const sortedBlogs = sortBy(blogs, (blog) => -blog.likes)
  return (
    <div>
      <div className="blogList">
        {sortedBlogs.map((blog) => (
          <p key={blog.id} data-testid="blogItem">
            <Link to={`/blogs/${blog.id}`}> {blog.title} </Link>
          </p>
        ))}
      </div>
      <BlogForm />
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(BlogType),
}

export default BlogList
