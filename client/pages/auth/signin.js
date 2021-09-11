import { useState } from 'react';
// import axios from 'axios';
import Router from 'next/router'
import Userequest from '../../hooks/use-request';

const Signin = () => {
    const [email, setEmail] =  useState('')
    const [password, setPassword] =  useState('')
    // const [errors, setErrors] =  useState([])
    const { doRequest, errors } = Userequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async event => {
        event.preventDefault();
        // try{
        //     const response = await axios.post('/api/users/signup', {
        //         email, password
        //     });
        //     console.log(response.data)
        // } catch (err) {
        //     // console.log(err.response.data)
        //     setErrors(err.response.data.errors)
        // }
        
        doRequest();

    }
    return(
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                    value ={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    type="password" 
                    className="form-control" 
                />
            </div>
            {errors}
            
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
}

export default Signin