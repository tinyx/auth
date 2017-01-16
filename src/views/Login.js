import React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { Link } from 'react-router';
const FormItem = Form.Item;
import { checkHttpStatus, parseJSON } from '../utils.js';
import 'antd/dist/antd.css';
import './login.css';

const Login = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    let redirectUrl = null;
    if('redirect' in this.props.location.query) {
      redirectUrl = this.props.location.query.redirect;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('http://crabfactory.net/api-token-auth/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username: values.userName, password: values.password})
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
              message.info('Login successfully!', 5);
            }
          }
          else {
            message.error('Please check the username and password and try again.', 5);
          }
        })
        .catch(error => {
          console.log(error);
        })
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h1>Crabfactory</h1>
        <p>Login to your account</p>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <Link to={{ pathname: '/register', query: this.props.location.query }}>register now!</Link>
        </FormItem>
      </Form>
    );
  },
}));

export default Login
