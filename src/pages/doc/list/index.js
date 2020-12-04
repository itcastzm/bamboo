import React, { Component } from 'react'
import Link from 'next/link';
import { message, Button, Switch, Table, Form, Input } from 'antd';
import Router from 'next/router';

import './index.less';

export async function getServerSideProps(context) {
    // Fetch data from external API
    const { Doc } = require('../../../models');
    const { Op } = require('sequelize');
    let pageSize = 20;
    let pageNo = 0;
    let totalCount = 0;
    let limit = pageSize;
    let offset = pageNo * pageSize;
    let rs = { pageNo, pageSize };


    const data = await Doc.findAndCountAll({ limit, offset, where: { flag: 0 } }).then(docs => {
        return JSON.parse(JSON.stringify(docs));
    });

    rs.totalCount = data.count;
    rs.list = data.rows;

    return { props: { data: rs } }
}



export default class extends Component {




    render() {

        const { data } = this.props;

        console.log(data);

        return (
            <div className="doc-list-wrapper">
                <header>

                    <span className="title">文章列表</span>
                    <Link href="/"  >
                        <a className="oper-btns" > <Button>返回首页</Button></a>
                    </Link>

                </header>

                <section>

                    {data.list.map((v, i, a) => (
                        <div className={'doc-item'} key={v.id}>
                            <Link href={`/doc/detail/${v.id}`} ><a>{v.doc_name}<span> 最新修改时间： {v.updatedAt}</span></a></Link>
                        </div>
                    ))}

                </section>


            </div>
        )
    }
}
