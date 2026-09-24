import { LockOutlined, UserOutlined, } from '@ant-design/icons';
import { App, Button, Form, Input } from 'antd';
import { registerUser } from '../api/auth.api';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../Context.user';

const Register = () => {
    const { notification } = App.useApp();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { setUser } = useContext(userContext)
    

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const response = await registerUser(values)
            notification.success({ title: "User created successfully" })
            localStorage.setItem("token" ,response?.authToken);
            setUser(response?.user)
            navigate("/")
        } catch (error) {
            notification.error({
                title: 'Something went wrong',
                description: error?.response?.data?.message || error?.message
            });
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className='flex h-dvh justify-center items-center flex-col gap-6 '>
            <h2 className='text-3xl'>Register</h2>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ width: '100%', maxWidth: 360 }}
                onFinish={onFinish}
            >
                <div className='flex gap-4' >
                    <Form.Item
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your first name!' }]}>
                        <Input className="h-12" placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your last name!' }]}>
                        <Input className="h-12" placeholder="Last Name" />
                    </Form.Item>
                </div>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined style={{ marginRight: '10px' }} />} className="h-12" placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password prefix={<LockOutlined style={{ marginRight: '10px' }} />} type="password" className="h-12  " placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" style={{ marginBottom: "10px" }} loading={loading}>
                        Register
                    </Button>
                    <div className="text-center text-sm text-zinc-400 mt-3">
                        or <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Login now!</Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register