import React, {useState} from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './Authentication';

function Login() {
  const {gomap} = useAuth()
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // not used?

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    // Handle login success (e.g., send the token to your server)

    // save loggedIn state so user can now access map and make tehere location search
    gomap(true)
    localStorage.setItem('gomap', true);

    navigate('/map');
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
    setErrorMessage('Login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="873620413271-cr4vb7e1n1kgneeg7sjqj4pl6c40nhmf.apps.googleusercontent.com">
      <div className="login-page">
        <div className="login-container">
          <h1>Login/Signup to Location Search</h1>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            buttonText="Login with Google"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;