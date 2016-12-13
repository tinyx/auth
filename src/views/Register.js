import React from 'react';
import { Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;
import { checkHttpStatus, parseJSON } from '../utils.js';
import './register.css';

const Register = Form.create()(React.createClass({
  getInitialState() {
    return {
      passwordDirty: false,
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    let redirectUrl = null;
    if('redirect' in this.props.location.query) {
      redirectUrl = this.props.location.query.redirect;
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        fetch('http://crabfactory.net/api-token-register/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: values.userName,
            password: values.password,
            email: values.email,
          })
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
          if(response.token) {
            let token = response.token;
            var expires = new Date();
            // add one day
            expires.setDate(expires.getDate() + 1);
            // set the cookie
            document.cookie = 'jwt_token=' + token +
            ';expires=' + expires.toUTCString() +
            ';path=/' +
            ';domain=.crabfactory.net';

            if(redirectUrl) {
              // perform redirect
              setTimeout( function(token){
                  window.location = redirectUrl;
              }.bind(null, token), 500);
            }
            else {
              message.info('Register successfully!', 5);
            }
          }
          else {
            message.error('Please check the inputs and try again.', 5);
          }
        })
        .catch(error => {
          console.log(error);
        })
      }
    });
  },
  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  },
  checkPassowrd(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  },
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    return (
      <Form horizontal onSubmit={this.handleSubmit} className="register-form">
        <FormItem
          {...formItemLayout}
          label="User Name"
          hasFeedback
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your user name!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" onBlur={this.handlePasswordBlur} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassowrd,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="register-form-button"
          >
            Register
          </Button>
        </FormItem>
      </Form>
    );
  },
}));

export default Register;
