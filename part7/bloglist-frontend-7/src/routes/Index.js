import { useSelector } from 'react-redux'

import { loginSelector } from '../reducers/loginReducer'
import BlogList from '../components/BlogList'

const Index = () => {
  const user = useSelector(loginSelector)
  return <BlogList username={user?.username} />
}

export default Index
