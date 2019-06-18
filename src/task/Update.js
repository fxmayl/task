import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Form, notification, Radio, Button } from 'antd';

class Update extends Component {
    state = {
        dataResult: {},
        jobStatus: 1,
    }

    componentDidMount = () => {
        fetch('http://localhost:8088/task/' + parseInt(this.props.match.params.id), {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json()).then(
            result => {
                if (result === null && result === '' && result === undefined) {
                    notification['warning']({
                        message: '错误',
                        description:
                            '错误.',
                    });
                } else {
                    this.setState({
                        dataResult: result,
                        jobStatus: result.jobStatus,
                    })
                }
            }
        )
    }

    handleSubmit = (e) => {
        //阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）。
        e.preventDefault();
        const that = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            const tempValues = values;
            tempValues["jobStatus"] = that.state.jobStatus;
            if (!err) {
                fetch('http://localhost:8088/task/' + parseInt(this.props.match.params.id), {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json;charset:UTF-8',
                    },
                    body: JSON.stringify(tempValues),
                }).then(response => response.json()).then(
                    result => {
                        if (result.code === null || result.code === '' || result.code === undefined
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
                            that.props.history.push("/")
                        }
                    }
                )
            }
        });
    }

    jobIdConfirm = (e) => {
        const form = this.props.form;
        const jobId = form.getFieldValue('jobId');
        if (jobId !== undefined && jobId !== '') {
            fetch('http://localhost:8088/task/jobId/' + jobId, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.json()).then(
                result => {
                    if (result.jobId !== null && result.jobId !== '' && result.jobId !== undefined) {
                        notification['warning']({
                            message: '任务ID重复',
                            description:
                                '当前任务ID已存在，请重新输入.',
                        });
                    }
                }
            )
        }
    }

    beanNameConfirm = (e) => {
        const form = this.props.form;
        const beanName = form.getFieldValue('beanName');
        if (beanName !== undefined && beanName !== '') {
            fetch('http://localhost:8088/task/beanName/' + beanName, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.json()).then(
                result => {
                    if (result.isExistBean === null || result.isExistBean === '' || result.isExistBean === undefined
                        || result.isExistBean === false) {
                        notification['warning']({
                            message: 'bean名称对应的bean不存在',
                            description:
                                '当前bean名称对应的bean不存在，请重新输入.',
                        });
                    }
                }
            )
        }
    }

    methodNameConfirm = (e) => {
        const form = this.props.form;
        const beanName = form.getFieldValue('beanName');
        const methodName = form.getFieldValue('methodName');
        if (beanName !== undefined && beanName !== '' && methodName !== undefined && methodName !== '') {
            fetch('http://localhost:8088/task/' + beanName + '/' + methodName, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.json()).then(
                result => {
                    if (result.isExistMethod === null || result.isExistMethod === '' || result.isExistMethod === undefined
                        || result.isExistMethod === false) {
                        notification['warning']({
                            message: '方法名称对应的方法不存在',
                            description:
                                '当前方法名称对应的方法在当前bean中不存在，请重新输入.',
                        });
                    }
                }
            )
        }
    }

    cronExpressionConfirm = (e) => {
        const form = this.props.form;
        const cronExpression = form.getFieldValue('cronExpression');
        if (cronExpression !== undefined && cronExpression !== '') {
            fetch('http://localhost:8088/task/cron/', {
                method: 'POST',
                credentials: 'include',
                body: '{"cronExpression":"' + cronExpression + '"}',
            }).then(response => response.json()).then(
                result => {
                    if (result.isValidate === null || result.isValidate === '' || result.isValidate === undefined
                        || result.isValidate === false) {
                        notification['warning']({
                            message: 'cron表达式无效',
                            description:
                                '当前cron表达式无效，请重新输入.',
                        });
                    }
                }
            )
        }
    }

    onStatusChange = (e) => {
        this.setState({
            jobStatus: e.target.value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };


        return (
            <div style={{ marginLeft: '40%', marginRight: '40%', marginTop: '2%' }}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="任务ID">
                        {getFieldDecorator(
                            'jobId', {
                                initialValue: this.state.dataResult.jobId,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入任务ID!',
                                    }
                                ]
                            }
                        )(<Input placeholder="请输入任务ID" onBlur={this.jobIdConfirm} disabled/>)
                        }
                    </Form.Item>
                    <Form.Item label="Bean名称">
                        {getFieldDecorator(
                            'beanName', {
                                initialValue: this.state.dataResult.beanName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入bean名称!',
                                    }
                                ]
                            }
                        )(<Input placeholder="请输入bean名称" onBlur={this.beanNameConfirm} />)
                        }
                    </Form.Item>
                    <Form.Item label="方法名称">
                        {getFieldDecorator(
                            'methodName', {
                                initialValue: this.state.dataResult.methodName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入方法名称!',
                                    }
                                ]
                            }
                        )(<Input placeholder="请输入方法名称" onBlur={this.methodNameConfirm} />)
                        }
                    </Form.Item>
                    <Form.Item label="方法参数">
                        {getFieldDecorator(
                            'methodParams', {
                                initialValue: this.state.dataResult.methodParams,
                                rules: [
                                ]
                            }
                        )(<Input placeholder="请输入方法参数" />)
                        }
                    </Form.Item>
                    <Form.Item label="Cron表达式">
                        {getFieldDecorator(
                            'cronExpression', {
                                initialValue: this.state.dataResult.cronExpression,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入Cron表达式!',
                                    }
                                ]
                            }
                        )(<Input placeholder="请输入Cron表达式" onBlur={this.cronExpressionConfirm} />)
                        }
                    </Form.Item>
                    <Form.Item label="任务状态">
                        <Radio.Group onChange={this.onStatusChange} value={this.state.jobStatus}>
                            <Radio value={1}>正常</Radio>
                            <Radio value={0}>暂停</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator(
                            'remark', {
                                initialValue: this.state.dataResult.remark,
                                rules: [
                                ]
                            }
                        )(<Input.TextArea placeholder="请输入备注" />)
                        }
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
          </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withRouter(Update);