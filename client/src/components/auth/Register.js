import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

class Register extends Component {
  constructor() {
    super();
    this.state={
        name: '', 
        email: '', 
        password: '', 
        password2:'', 
        error:{} 
        };

    this.onChange = this.onChange.bind(this); 
    this.onSubmit = this.onSubmit.bind(this); 
  }

  // when making the change on name input
  onChange(e){
        this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e){
    e.preventDefault();

    const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
    };

    //console.log(newUser);
    axios.post('/api/users/register', newUser) //return a promise
        .then( res => console.log(res.data))
        .catch(err => this.setState({errors: err.response.data}));
}

  render() {

    const { errors } = this.state;
    //const errors = this.state.errors;
    return (
        <div className="register">
            <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">Create your DevConnector account</p>
                <form onSubmit={this.onSubmit} >
                    <div className="form-group">
                    <input 
                        type="text" 
                        //className="is-invalid form-control form-control-lg" 
                        className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.name //is-invalid only valid when errors.name exist
                        })}
                        placeholder="Name" 
                        name="name" 
                        value = {this.state.name}
                        onChange = {this.onChange}
                    />
                    { errors.name && (<div className="invalid-feedback"></div>)}
                    </div>
                    <div className="form-group">
                    <input 
                        type="email" 
                        className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.name //is-invalid only valid when errors.name exist
                        })}
                        placeholder="Email Address" 
                        name="email"
                        value = {this.state.email}
                        onChange = {this.onChange}
                         />
                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                    </div>
                    <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        placeholder="Password" 
                        name="password" 
                        value = {this.state.password}
                        onChange = {this.onChange}
                        />
                    </div>
                    <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        placeholder="Confirm Password" 
                        name="password2" 
                        value = {this.state.password2}
                        onChange = {this.onChange}
                        /> 
                    </div>
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                </form>
                </div>
            </div>
            </div>
        </div>
    );
  }
}

export default Register;