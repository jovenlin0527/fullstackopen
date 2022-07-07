const Blog = ({blog, visible, doShow, doHide}) => {
  const blogstyle = {
    paddingLeft: 2,
    border: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '5px',
  }
  const toggleVisible = visible
    ? (<button onClick={doHide}>hide</button>)
    : (<button onClick={doShow}>show</button>) 
  return (
  <div style={blogstyle}>
    <p> {blog.title} {blog.author} {toggleVisible}</p>
    <div style={{display: visible ? '' : 'none'}} >
    <p> {blog.url} </p>
    <p> likes: {blog.likes} <button> like </button> </p>
    <p> {blog.user.name} </p>
    </div>
  </div>

)}

export default Blog
