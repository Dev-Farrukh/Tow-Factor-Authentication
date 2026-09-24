import { Route, Routes } from 'react-router-dom'
import Login from './features/Authentication/pages/Login'
import Register from './features/Authentication/pages/Register'
import Home from './features/fileUpload/pages/Home'
import Protected from './features/fileUpload/pages/Protected'
import Logout from './features/Authentication/Logout'

const Router = () => {
  return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/logout" element={<Protected><Logout /></Protected>} />
    </Routes>
  )
}

export default Router