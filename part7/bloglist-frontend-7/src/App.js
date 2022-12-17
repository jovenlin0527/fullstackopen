import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './routes/Root'
import Index from './routes/Index'
import Users from './routes/Users'
import Blogs from './routes/Blogs'

// TODO: dispatch actions for getting data in the loaders.
// We can import the store from other modules and then call store.dispatch().
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'users/:userId',
        element: <Users />,
      },
      {
        path: 'blogs/:blogId',
        element: <Blogs />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
