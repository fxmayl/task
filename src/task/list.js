import React, { Component } from 'react';

import { Table, Button, Input, Switch } from 'antd';
import {withRouter} from 'react-router-dom'
import '../App.css'
const Search = Input.Search;
class List extends Component {

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        dataResult: [],
    };

    componentDidMount = () => {
        fetch('http://localhost:8088/task', {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json()).then(
            (result) => {
                this.setState(
                    {
                        dataResult: result
                    }
                );
            }
        )
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };


    onJobStatusChange = (checked) => {
        console.log('任务状态值为:  ', checked)
    }

    onJobStatusChecked = (jobStatus) => {
        if (jobStatus === 1) {
            return true;
        }
        return false;
    }

    onSearch = (value) => {
        let url = 'http://localhost:8088/task/name/';
        if(value === undefined || value === null || value === '') {
            url = 'http://localhost:8088/task';
        } else {
            url = url + value;
        }
        fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json()).then(
            (result) => {
                this.setState(
                    {
                        dataResult: result
                    }
                );
            }
        )
    }




    render() {

        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection,
        };

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '任务ID',
                dataIndex: 'jobId',
                key: 'jobId',
            },
            {
                title: 'bean名称',
                dataIndex: 'beanName',
                key: 'beanName',
            },
            {
                title: '方法名称',
                dataIndex: 'methodName',
                key: 'methodName',
            },
            {
                title: '方法参数',
                dataIndex: 'methodParams',
                key: 'methodParams',
            },
            {
                title: 'cron表达式',
                dataIndex: 'cronExpression',
                key: 'cronExpression',
            },
            {
                title: '状态',
                dataIndex: 'jobStatus',
                key: 'jobStatus',
                render: (jobStatus) => (<Switch defaultChecked={this.onJobStatusChecked(jobStatus)} onChange={this.onJobStatusChange} />),
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
        ];



        return (
            <div>
                <div className="table-operations">
                    <Search
                        placeholder="请输入bean名称或者方法名称"
                        enterButton="搜索"
                        size="large"
                        onSearch={value => this.onSearch(value)}
                        width="10"
                    />
                    <Button onClick={() => this.props.history.push('/add')}>新增</Button>
                    <Button onClick={() => this.props.history.push('/update/' + this.state.selectedRowKeys[0])}>编辑</Button>
                    <Button >删除</Button>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataResult} rowKey={record => record.id}/>
            </div>
        );
    }
}


export default withRouter(List);