import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { getBlogs } from './reducers/blogsReducer'
import { getUsers } from './reducers/usersReducer'
import Root from './routes/Root'
import Index from './routes/Index'
import Users from './routes/Users'
import Blogs from './routes/Blogs'

// TODO: dispatch actions for getting data in the loaders.
// We can import the store from other modules and then call store.dispatch().

const App = () => {
  const dispatch = useDispatch()
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        { index: true, element: <Index />, loader: () => dispatch(getBlogs()) },
        {
          path: 'users/',
          element: <Users />,
          loader: () => dispatch(getUsers()),
          children: [
            {
              path: ':userId',
              element: <Users />,
              loader: () => {
                dispatch(getBlogs())
              },
            },
          ],
        },
        {
          path: 'blogs/:blogId',
          element: <Blogs />,
          loader: () => dispatch(getBlogs()),
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
