import React from 'react';
import { Button, Radio, message, Modal } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import axios from '../../lib/utils/axios';
import './index.less';

class HomePage extends React.Component {


    toPublishDoc = async () => {

        let res = await axios({
            method: 'post',
            url: '/api/publish/accessable',
            data: null
        });

        if (res.code == '000000') {
            // message.success(res.msg);
            Router.push('/publish/doc');
        } else {

            Modal.confirm({
                title: '当前未登录状态，是否前往登录页面？',
                // icon: <ExclamationCircleOutlined />,
                content: '',
                cancelText: '取消',
                okText: '前往登录',
                onOk() {
                    Router.push('/user/login');
                },
                onCancel() {
                    return;
                },
            });

            // message.error(res.msg);
        }

    }

    render() {
        return (
            <div className="home-wrapper">
                <span title="班级布道系统">bamboo(班布系统)</span>
                <div className="oper-btns">
                    <Link href="/doc/list">
                        <a> <Button>看文章</Button></a>
                    </Link>
                    {/* <Link href="/publish/doc"> */}
                    <a><Button onClick={this.toPublishDoc}>发文章</Button></a>
                    {/* </Link> */}
                </div>
            </div>
        )
    }
}

export default HomePage