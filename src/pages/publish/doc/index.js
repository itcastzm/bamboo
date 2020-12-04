import React, { Component } from 'react';
import { Button, Upload, Input, message, Tree, Anchor } from 'antd';
import './index.less';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import ReactMarkdown from '../../../components/ReactMarkdown';

import axios from '../../../lib/utils/axios';

const { DirectoryTree } = Tree;
const CodeMirror = dynamic(() => import('../../../components/CodeMirrorEditor'), { ssr: false });

// const ReactMarkdown = dynamic(() => import('../../../components/ReactMarkdown'), { ssr: false });


export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '# 标题',
            title: '',
            mode: 'write',
            fileList: [],
            dfileList: [],
            contentMap: {},
            expandType: 'jsx',
            treeData: [{
                title: '/',
                // key: '0-0',
                key: '0',
                children: []
            }],
            currentPath: '',
            prefix_uri: ''
            // treeData: []
        }

        // 从表单初始值中获取值
        // for (let p in this.state.contentMap) {
        //     this.addFileToTreeData(this.state.treeData, p);
        // }
    }



    handleChanges = (instance, change) => {
        // console.log(instance, change);
        let code = instance.getValue();
        // this.props.onChange(code);
        this.setState({
            code
        });
    }

    handleSave = async () => {
        const { mode, code, title, contentMap } = this.state;

        if (!title) {
            message.warning(`请输入文章标题！`);
            return ;
        }

        let isEmpty = true;
        for (let p in contentMap) {
            isEmpty = false;
        }
        if (isEmpty) {
            message.warning(`文章资源不能为空！`)
            return;
        }


        let res = await axios({
            method: 'post',
            url: '/api/publish/doc',
            data: {
                contentMap,
                doc_name: title
            }
        });

        if (res.code == '000000') {
            message.success(res.message)
            Router.push('/');
        } else {
            message.error(res.message)
        }

        console.log(res, 'res');

    }

    changeMode = () => {
        const { mode } = this.state;
        this.setState({
            mode: mode == 'write' ? 'view' : 'write'
        });
    }

    handleTitleChange = (evt) => {

        console.log(evt.target.value);

        this.setState({
            title: evt.target.value
        });
    }

    onSelect = (keys, event) => {
        let that = this;

        let node = event.node;
        // let file = node.file;
        // console.log(file, node, event);
        // 使用 FileReader 来读取文件
        // let reader = new FileReader()

        let path = node.path;
        console.log('path', node, event)

        if (node.isLeaf) {

            let pathArr = path.split('.');
            let expandType = pathArr[pathArr.length - 1];

            this.setState({
                code: this.state.contentMap[path],
                currentPath: path,
                expandType: expandType == 'js' ? 'jsx' : expandType
            });

            // let expandType = path.split('.')[1];
            // 读取纯文本文件,且编码格式为 utf-8
            // reader.readAsText(node.file, 'UTF-8')

            // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
            // reader.onload = function (e) {
            //     let fileContent = e.target.result
            //     console.log('fileContent', fileContent);

            //     that.setState({
            //         code: fileContent
            //     });
            // }
        } else {
            return false;
        }
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    addFileToTreeData = (root, file) => {

        let pathArr = file.webkitRelativePath.split('/');
        let parentNode = root;

        if (pathArr.length <= 3) {
            for (let i = 0; i < pathArr.length; i++) {

                // 根目录
                if (i == 0) {
                    // root.key=
                    if (!root.desc) root.desc = pathArr[i];
                    continue;
                }

                let children = parentNode.children;
                let name = pathArr[i];
                let isLeaf = (name.indexOf('\.') > -1 && name == file.name && i == pathArr.length - 1);
                let isHas = false;

                children.forEach((v, i, a) => {
                    if (v.desc == name) {
                        isHas = true;
                        parentNode = v;
                    }
                });

                if (!isHas) {
                    let obj = {
                        title: name,
                        desc: name,
                        key: `${parentNode.key}-${children.length}`
                        // key: `${root.key}/${name}`
                    }
                    if (isLeaf) {
                        obj.isLeaf = isLeaf;
                        obj.path = file.webkitRelativePath;
                        // obj.file = file
                    } else {
                        obj.children = []
                    }

                    parentNode = obj;
                    children.push(obj);
                }
            }

        } else {
            message.warn(`目录层次不能超过三层！`);
            console.log('目录层次不能超过三层！');
        }
    }

    getRightContent() {
        const { mode, code, currentPath, contentMap } = this.state;

        // 第一种情况，如果文件为图片
        let pathArr = currentPath.split('.');
        let expandType = pathArr[pathArr.length - 1];
        const imageTypes = ['png', 'jpg', 'gif', 'jpeg'];
        if (imageTypes.indexOf(expandType) > -1) {
            return <div className="img-wrapper">
                <img src={`${contentMap[currentPath]}`} />
            </div>
        }

        // 第二种情况 当前选中为文本 如果为编辑态markDown
        if (mode == 'write') {
            return <div className="editor-wrapper">
                <CodeMirror
                    height={450}
                    width={920}
                    value={code}
                    options={{
                        theme: 'monokai',
                        tabSize: 2,
                        keyMap: 'sublime',
                        mode: 'markdown',
                        lineNumbers: true,
                        // mode: 'markdown',
                    }}
                    onChanges={this.handleChanges}
                />
            </div>
        } else {

            // 第三种情况 当前选中为文本 预览模式
            return <ReactMarkdown source={code} transformImageUri={this.transformImageUri} />
        }


    }

    transformImageUri = (uri) => {
        const { contentMap, prefix_uri } = this.state;
        // console.log(uri, 'uri///')
        return contentMap[`${prefix_uri}/${uri}`];
    }

    render() {

        let { code, mode, fileList, title, dfileList, treeData } = this.state;
        let that = this;

        console.log('treeData', treeData);
        const props = {
            beforeUpload: file => {
                console.log(file);
                // 使用 FileReader 来读取文件
                let reader = new FileReader()

                let pathArr = file.webkitRelativePath.split('.');
                let expandType = pathArr[pathArr.length - 1];
                // 读取纯文本文件,且编码格式为 utf-8
                reader.readAsText(file, 'UTF-8')

                // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
                reader.onload = function (e) {
                    let fileContent = e.target.result;

                    that.setState({
                        code: fileContent,
                        treeData: [{
                            title: '/',
                            // key: '0-0',
                            key: '0',
                            children: [{
                                title: file.name,
                                desc: file.name,
                                key: `0-0`,
                                isLeaf: true,
                                path: file.webkitRelativePath,
                                // key: `${root.key}/${name}`
                            }]
                        }],
                        expandType,
                        currentPath: file.webkitRelativePath,
                        contentMap: {
                            [file.webkitRelativePath]: fileContent
                        }
                    });
                }
                return false;
            },
            fileList,
        };

        return (
            <div className="publish-doc-wrapper">
                <Anchor>
                    <header>
                        <h2 className="title">发布文章</h2>
                        <Button className="oper-btns" onClick={this.handleSave}>保存文章</Button>
                        <Upload {...props} className="oper-btns" >
                            <Button >导入</Button>
                        </Upload>
                        <Upload
                            directory
                            fileList={dfileList}
                            onChange={(a, b, c) => {
                                console.log(a, b, c, 'a,b,c');
                            }}
                            beforeUpload={(file, fileList) => {

                                let { treeData } = this.state;
                                let that = this;

                                this.addFileToTreeData(treeData[0], file);


                                // 使用 FileReader 来读取文件
                                let reader = new FileReader();
                                let pathLevels = file.webkitRelativePath.split('/');
                                let pathArr = file.webkitRelativePath.split('.');
                                let expandType = pathArr[pathArr.length - 1];

                                this.setState({
                                    treeData: [...treeData],
                                    prefix_uri: pathLevels[0]
                                });


                                const imageTypes = ['png', 'jpg', 'gif', 'jpeg'];
                                if (expandType == 'md') {
                                    // 读取纯文本文件,且编码格式为 utf-8
                                    reader.readAsText(file, 'UTF-8')
                                } else if (imageTypes.indexOf(expandType) > -1) {
                                    // .gif image/gif .jpeg或.jpg image/jpeg
                                    // var reader = new FileReader();

                                    // reader.onloadend = function (e) {
                                    //     new Blob([this.result], { type: "image/jpeg" });
                                    // };

                                    // reader.readAsArrayBuffer(file);

                                    reader.readAsDataURL(file);
                                }


                                // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
                                reader.onload = function (e) {
                                    let fileContent = e.target.result;
                                    that.state.contentMap[file.webkitRelativePath] = fileContent;
                                }
                                return false;
                            }}

                            className="oper-btns" >
                            <Button >导入文件夹</Button>
                        </Upload>
                        <Button className="oper-btns" onClick={this.changeMode} >切换模式</Button>
                        <Link href="/"  >
                            <a className="oper-btns" > <Button>返回首页</Button></a>
                        </Link>
                    </header>
                </Anchor>

                <main>
                    <div className="title">
                        <div className="title-label">文章标题：</div>
                        <div className="input-field"><Input value={title} onChange={this.handleTitleChange} />
                        </div>
                    </div>

                    <section>
                        <div className="left">
                            <DirectoryTree
                                multiple
                                defaultExpandAll
                                onSelect={this.onSelect}
                                onExpand={this.onExpand}
                                treeData={this.state.treeData}
                            />
                        </div>
                        <div className="right">
                            {this.getRightContent()}
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}
