import React, {Component} from 'react';

import {Button, Input, notification, Switch, Table} from 'antd';
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
        this.setState({selectedRowKeys});
    };

    onJobStatusChange = (id, e) => {
        console.log('任务状态值为:  ', e)
        console.log('id为:  ', id)
    }

    onJobStatusChecked = (jobStatus) => {
        if (jobStatus === 1) {
            return true;
        }
        return false;
    }

    onSearch = (value) => {
        let url = 'http://localhost:8088/task/name/';
        if (value === undefined || value === null || value === '') {
            url = 'http://localhost:8088/task';
        } else {
            url = url + value;
        }
        fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json()).then(
            (result) => {
                if (result.code === null || result.code === '' || result.code === undefined
                    || result.code === 400) {
                    notification['error']({
                                              message: result.message,
                                              description: result.message,
                                          });
                }
            }
        )
    }

    deleteEvent = () => {
        const that = this;
        fetch('http://localhost:8088/task/' + parseInt(that.state.selectedRowKeys[0]), {
                                                                                           method: 'DELETE',
                                                                                           credentials: 'include',
                                                                                       })
            .then(response => response.json()).then(
            (result) => {
                if (result.code === null || result.code === '' || result.code === undefined
                    || result.code === 400) {
                    notification['error']({
                                              message: result.message,
                                              description: result.message,
                                          });
                } else {
                    fetch('http://localhost:8088/task', {
                        method: 'GET',
                        credentials: 'include',
                    }).then(response => response.json()).then(
                        (result) => {
                            that.setState(
                                {
                                    dataResult: result
                                }
                            );
                        }
                    );
                    notification['success']({
                                                message: result.message,
                                                description: result.message,
                                            });
                }
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
        const that = this;
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
                render: (jobStatus, record) => (
                    <Switch defaultChecked={this.onJobStatusChecked(jobStatus)}
                            onChange={(checked) => {
                                console.log('任务状态值为:  ', checked);
                                console.log('id为:  ', record.id);
                                fetch('http://localhost:8088/task/' + parseInt(record.id) + '/'
                                      + (checked ? 1 : 0), {
                                                               method: 'PUT',
                                                               credentials: 'include',
                                                           })
                                    .then(response => response.json()).then(
                                    result => {
                                        if (result.code === null || result.code === ''
                                            || result.code === undefined
                                            || result.code === 400) {
                                            notification['error']({
                                                                      message: result.message,
                                                                      description: result.message,
                                                                  });
                                        } else {
                                            notification['success']({
                                                                        message: result.message,
                                                                        description: result.message,
                                                                    });
                                        }
                                    }
                                )
                            }}/>),
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
                    <Button onClick={() => {
                        if (this.state.selectedRowKeys[0] !== undefined
                            && this.state.selectedRowKeys[0] !== '' && this.state.selectedRowKeys[0]
                            !== null) {
                            this.props.history.push('/update/' + this.state.selectedRowKeys[0])
                        } else {
                            notification['error']({
                                                      message: '请选择编辑对象',
                                                      description: '请选择编辑对象.',
                                                  });
                        }
                    }}>编辑</Button>
                    <Button onClick={() => {
                        const that = this;
                        if (this.state.selectedRowKeys[0] !== undefined
                            && this.state.selectedRowKeys[0] !== '' && this.state.selectedRowKeys[0]
                            !== null) {
                            that.deleteEvent();
                        } else {
                            notification['error']({
                                                      message: '请选择删除对象',
                                                      description: '请选择删除对象.',
                                                  });
                        }
                    }}>删除</Button>
                </div>
                <Table rowSelection={rowSelection} columns={columns}
                       dataSource={this.state.dataResult} rowKey={record => record.id}/>
            </div>
        );
    }
}

export default withRouter(List);