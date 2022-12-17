import Blog from './Blog'

const UserDetail = ({ user }) => {
  const blogs = user.blogs
  const blogList = blogs.map((blog) => {
    blog = { ...blog, user }
    return <Blog key={blog.id} blog={blog} />
  })
  return (
    <div>
      <h2> {user.name} </h2>
      <div className="blogList">{blogList}</div>
    </div>
  )
}

export default UserDetail
