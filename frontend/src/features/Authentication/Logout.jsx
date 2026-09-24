import { useEffect } from 'react'
import { logoutUser } from './api/auth.api'
import { App, Spin } from 'antd'
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const { notification } = App.useApp()
    let navigate = useNavigate()
    // Logout effect 
    useEffect(() => {
        const logout = async () => {
            const token = localStorage.getItem("token")
            try {
                await logoutUser(token)
                localStorage.removeItem("token")
                navigate("/login")
                notification.success({ title: "Logget out successfully" })
            } catch (error) {
                console.error(error);
                notification.error({ title: "Something went wrong " })

            }
        }
        logout()
    }, [])

    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </div>
    )
}

export default Logout