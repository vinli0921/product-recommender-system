import { useState } from 'react';
import { LoginForm, LoginMainFooterBandItem, LoginPage, ListVariant } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthProvider';

export const SimpleLoginPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setEmail(value);
    setIsValidEmail(true);
    setErrorMessage('');
  };

  const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setPassword(value);
    setIsValidPassword(true);
    setErrorMessage('');
  };

  const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // Basic validation
    const emailValid = !!email && email.includes('@');
    const passwordValid = !!password;

    setIsValidEmail(emailValid);
    setIsValidPassword(passwordValid);

    if (!emailValid || !passwordValid) {
      setErrorMessage('Please enter valid email and password.');
      return;
    }

    try {
      await login({ email, password });
      // Redirect to dashboard or home after successful login
      navigate({ to: '/' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
      setIsValidEmail(false);
      setIsValidPassword(false);
    }
  };

  const signUpForAccountMessage = (
    <LoginMainFooterBandItem>
      Need an account? <Link to="/signup">Sign up.</Link>
    </LoginMainFooterBandItem>
  );

  const forgotCredentials = (
    <LoginMainFooterBandItem>
      {/* <a href="">Forgot username or password?</a> */}
    </LoginMainFooterBandItem>
  );

  const loginForm = (
    <LoginForm
      showHelperText={!!errorMessage}
      helperText={errorMessage}
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Email"
      usernameValue={email}
      onChangeUsername={handleEmailChange}
      isValidUsername={isValidEmail}
      passwordLabel="Password"
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel={isLoading ? 'Logging in...' : 'Log in'}
      isLoginButtonDisabled={isLoading}
    />
  );

  return (
    <LoginPage
      footerListVariants={ListVariant.inline}
      loginTitle="Log in to your account"
      signUpForAccountMessage={signUpForAccountMessage}
      forgotCredentials={forgotCredentials}
    >
      {loginForm}
    </LoginPage>
  );
};
