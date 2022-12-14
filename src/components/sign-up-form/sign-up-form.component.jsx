import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";

import {SignUpContainer} from './sign-up-form.styles.jsx';

const defaultFormFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { name, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(password !== confirmPassword) {
        alert('passwords do not match');
        return;
    }

    try {
        const {user} = await createAuthUserWithEmailAndPassword(email, password);

        await createUserDocumentFromAuth(user, {name});
        resetFormFields();
    } catch(error) {
        if(error.code === 'auth/email-already-in-use') {
            alert('Cannot create user, email already in use');
        } else{
            console.log(error.message);
        }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignUpContainer>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        {/* <label>Name</label> */}
        <FormInput label="Name" type="text" onChange={handleChange} name="name" value={name} />

        {/* <label>E-mail</label> */}
        <FormInput
          label="E-mail"
          type="email"
          onChange={handleChange}
          name="email"
          value={email}
        />

        {/* <label>Password</label> */}
        <FormInput
          label="Password"
          type="password"
          onChange={handleChange}
          name="password"
          value={password}
        />

        {/* <label>Confirm Password</label> */}
        <FormInput
          label="Confirm Password"
          type="password"
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <Button type="submit">Sign Up</Button>
      </form>
    </SignUpContainer>
  );
};

export default SignUpForm;
