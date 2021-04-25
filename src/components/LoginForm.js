import React from 'react';
import {Redirect} from 'react-router-dom';
import "./../stylesheets/LoginForm.css";
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import {Link} from "react-router-dom";
import {Button} from 'react-bootstrap';

class LoginForm extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: '',
		}
	}
	
	setInputValue(property, val){
		val = val.trim();
		this.setState({
			[property]: val
		})
	}
	
	resetForm() {
		this.setState({
			username: '',
			password: '',
		})
	}
	
	async doLogin()	{
		if(this.state.username !== null && this.state.password !== null){
			fetch("/professors/getByUsername/?username=" + this.state.username)
				.then(res => res.json())
			    .then(
			        (result) => {
			        	this.validate(result)
			        }
				)
		}
	}

	validate(info){
		if (info.password === this.state.password){
			sessionStorage.setItem('loggedin', true)
			this.props.history.push('/AdminPanel/SearchStudent')
		}
	}
	
  render() {
	  
	  return (
	  	<div>
	  		<Link to="/"><Button style={{ float: "right" }} className="btn dash-btn">Form</Button></Link>
		    <div className="loginForm">
				<meta
					name="description"
					content="UNO Professor Login"
				/>

				<h1>
				Professor Login
				</h1>
				
			  <InputField
				type = 'text'
				placeholder='Username'
				value={this.state.username ? this.state.username : ''}
				onChange= { (val) => this.setInputValue('username', val)}
				/>
				
				 <InputField
				type = 'password'
				placeholder='Password'
				value={this.state.password ? this.state.password : ''}
				onChange= { (val) => this.setInputValue('password', val)}
				/>
				
				<SubmitButton
					text='Login'
					disabled={this.state.buttonDisabled}
					onClick= { () => this.doLogin() }
					/> 
		    </div>
		</div>
	  );
	}
}

export default LoginForm;
