import React, { Component } from 'react'
import ReactMarkdown from '../../../components/ReactMarkdown';
import { Button, Form, Input, message, BackTop } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import axios from '../../../lib/utils/axios';

import './index.less';

// This gets called on every request
export async function getServerSideProps(context) {
    // Fetch data from external API
    const { Doc, Comment } = require('../../../models');
    const { logger } = require('../../../config/logger');
    const fs = require('fs');
    const path = require('path');
    const { getAllFileContent } = require('../../../lib/files');
    const { params, query, req, res } = context;
    const { id } = params;
    const currentPath = process.cwd();
    let doc = null;
    let comments = null;

    if (id) {
        doc = await Doc.findByPk(id).then(doc => {
            return JSON.parse(JSON.stringify(doc));
        });

        comments = await Comment.findAndCountAll({
            where: { flag: 0, obj_id: id }, order: [
                ['updatedAt', 'DESC'],
            ]
        }).then(comments => {
            return JSON.parse(JSON.stringify(comments));
        });

        // 文章存放目录
        let docBaseDirPath = path.join(currentPath, '/src/docs/', `${id}/`);
        if (fs.existsSync(docBaseDirPath)) {
            // 读取数据存储结构的内容
            // let docPath = path.join(docBaseDirPath, 'index.md');
            // if (fs.existsSync(docPath)) {
            //     doc.content = fs.readFileSync(docPath, 'utf8');
            // }
            let doc_content_map = {};
            doc.contentMap = getAllFileContent(doc_content_map, path.join(currentPath, '/src/docs/'), `${id}/`);
        }

    }

    return { props: { data: doc, comments } }
}


export default class extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            comments: this.props.comments.rows
        }
    }


    handleSubmit = async (values) => {


        let { comments } = this.state;
        console.log('values', values);

        let doc = this.props.data;

        let res = await axios({
            method: 'post',
            url: '/api/publish/comment',
            data: {
                obj_id: doc.id,
                user_name: values.nick_name,
                text: values.text,
                email: values.email
            }
        });

        if (res.code == '000000') {
            message.success('评论成功！')
            this.setState({
                comments: [
                    { ...res.data },
                    ...comments
                ]
            })
            // location.reload();
        } else {
            message.error(res.message)
        }

        console.log(res, 'res');

    }

    transformImageUri = (uri) => {
        const { data } = this.state;
        // console.log(uri, 'uri///')
        return data.contentMap[`${data.id}/${uri}`];
    }


    render() {
        const { data, comments } = this.state;
        console.log(this.props);

        return (
            <div className="doc-detail-wrapper">
                <BackTop />
                <header>
                    <Link href="/"  >
                        <a className="oper-btns" > <Button>返回首页</Button></a>
                    </Link>
                </header>


                <section>
                    <ReactMarkdown source={data.contentMap[`${data.id}/index.md`]} transformImageUri={this.transformImageUri} />
                </section>

                {/* 评论区 */}
                <section className="comment-area">

                    <div className="comment-area-head">评论区：</div>


                    {comments.map((v, i, a) => (
                        <div className="comment-item" key={v.id}>
                            <div>
                                {`${v.user_name}说：   `}
                            </div>
                            <div className="comment-text">
                                <span className="text-content">{v.text}</span>
                                <span className="text-date" >{v.createdAt}</span>
                            </div>
                        </div>
                    ))}


                    <Form onFinish={this.handleSubmit} >
                        <Form.Item label="您的留言"
                            name={'text'}
                            wrapperCol={{ span: 8 }}
                            rules={[
                                {
                                    required: true,
                                    message: '留言不能为空',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="请输入您的留言" />
                        </Form.Item>
                        <Form.Item label="您的昵称"
                            name={'nick_name'}
                            wrapperCol={{ span: 8 }}
                            rules={[
                                {
                                    required: true,
                                    message: '请留下您的昵称',
                                },
                            ]}
                        >
                            <Input placeholder="请输入您的昵称" />
                        </Form.Item>
                        <Form.Item label="电子邮件："
                            wrapperCol={{ span: 8 }}
                            name={'email'}
                            rules={[
                                {
                                    type: 'email',
                                    message: '请输入正确的电子邮件',
                                }
                            ]}>
                            <Input placeholder="请输入您的电子邮件" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 8 }}>
                            <Button htmlType="submit" type="primary">提交评论</Button>
                        </Form.Item>
                    </Form>

                </section>
            </div>
        )
    }
}
