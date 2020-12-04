import React from 'react';
import { Button, Radio, Form, Input, Checkbox, message } from 'antd';
import Router from 'next/router';

import axios from '../../../lib/utils/axios';

import './index.less';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class HomePage extends React.Component {


    onFinish = async values => {

        // let { username, password } = values;

        // if (!userinfo.phone || !(/^1[3456789]\d{9}$/.test(userinfo.phone))) {
        // if (!username) {
        //     message.warn('请输入用户名！');
        //     return;
        // }

        //密码登录
        // if (!password) {
        //     message.warn('请输入密码！');
        //     return;
        // }

        let res = await axios({
            method: 'post',
            url: '/api/login',
            data: {
                ...values
            }
        });


        if (res.code == '000000') {
            message.success(res.msg)
            Router.push('/publish/doc');
        } else {
            message.error(res.msg)
        }
    };

    render() {
        return <div className="user-login-wrapper">
            <h3>登录</h3>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
            // onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                    wrapperCol={{ span: 8 }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ span: 8, offset: 8 }}
                    name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 8 ,offset: 8}}>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    }
}

export default HomePage