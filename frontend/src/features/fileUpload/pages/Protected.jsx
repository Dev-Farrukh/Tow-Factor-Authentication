import { useEffect } from 'react'
import { getUser } from '../../Authentication/api/auth.api'
import { App, Spin } from 'antd'
import { useState } from 'react'
import { useContext } from 'react'
import { userContext } from '../../Authentication/Context.user'
import { Navigate } from 'react-router-dom'

const Protected = ({ children }) => {
    const { notification } = App.useApp()
    const [loading, setLoading] = useState(true)
    const { user, setUser } = useContext(userContext)
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                if (user) {
                    setLoading(false)
                    return
                }
                let token = localStorage.getItem("token")
                if (!token) {
                    setLoading(false);
                    return;
                }
                if (!token) return notification.error({ title: "Please login again " })
                let userData = await getUser(token)
                setUser(userData.user)
                console.log(userData);
            } catch {
                localStorage.removeItem("token")
                setUser(null)
                notification.error({ title: "Session expired", description: "Please log in again" })
            } finally {
                setLoading(false)
            }
        }
        getUserData()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected