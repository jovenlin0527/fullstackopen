import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { blogsSelector } from '../reducers/blogsReducer'
import BlogDisplay from '../components/Blog'

const Blogs = () => {
  // TODO: <Root /> fetches bloglist for us, might want to fix that later.
  const { blogId } = useParams()
  const blogs = useSelector(blogsSelector)
  if (blogs == null) {
    return null
  }

  const blog = blogs.find(({ id }) => id === blogId)
  if (blog == null) {
    return null
  }

  return <BlogDisplay blog={blog} />
}

export default Blogs