import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './routes/Root'
import Index from './routes/Index'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{ index: true, element: <Index /> }],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
