import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Flex, Form, Input } from 'antd';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { userContext } from '../Context.user';
const Login = () => {
    const { notification } = App.useApp();
    const navigate = useNavigate()
    const { setUser } = useContext(userContext)
    const [loading, setLoading] = useState(false)

    const onFinish = async values => {
        setLoading(true)
        try {
            const response = await loginUser(values)
            notification.success({ title: `Hello ${response?.user?.firstName || "User"}` })
            localStorage.setItem("token" , response?.authToken);
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
            <h2 className='text-3xl'>Login</h2>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ width: '100%', maxWidth: 360 }}
                onFinish={onFinish}
            >
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
                    <Input prefix={<LockOutlined style={{ marginRight: '10px' }} />} type="password" className="h-12  " placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password</a>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={loading} style={{ marginBottom: "10px" }}>
                        Login
                    </Button>
                    <div className="mt-3 text-center text-sm text-zinc-400">
                        or <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register now!</Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};
export default Login;