import { Eye, User} from 'lucide-react';
import './Login.css'
import Loader from '../Loader/Loader';
import { useState } from 'react';
function Login({handleLoginForm,loginMessage}){
    const [showPassword,setShowPassword]= useState(false)
    const showPasswordIcon = document.querySelector(".show-password-icon");
    function handleMouseDown(e){
        setShowPassword(true)
    }
    function handleMouseUpLeave(e){
        setShowPassword(false)
        
    }
   
    return(
        <>
            <div className='login-section'>
                <div className='login-card'>
                    <div className='user-icon'>
                        <User size={40} fill='white' className='icon'/>    
                    </div>
                    <h2>Log in</h2>
                    <form className='login-form'>
                        <input type='email' className='login-email' placeholder='Email' name='email' required/>
                        <div className='password-input'>
                            <Eye color={showPassword ? "#0EA5E9" : "grey"} className='show-password-icon' onMouseDown={handleMouseDown} onMouseUp={handleMouseUpLeave} onMouseLeave={handleMouseUpLeave}/>    
                            <input type={showPassword ? "text" : "password"} className='login-password' placeholder='Password' minLength={8} name='password' required/>
                        </div>
                        {loginMessage && <h5 className='login-msg'>{loginMessage}</h5>                        }
                        <button type='submit' onClick={handleLoginForm}>Log in</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;