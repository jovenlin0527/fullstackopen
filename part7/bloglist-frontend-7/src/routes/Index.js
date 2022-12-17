import { useSelector } from 'react-redux'

import { blogsSelector } from '../reducers/blogsReducer'
import BlogList from '../components/BlogList'

const Index = () => {
  const blogs = useSelector(blogsSelector)
  return <BlogList blogs={blogs} />
}

export default Index
