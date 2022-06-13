import { fromJS } from "immutable";
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Logo from "../../image/tuan-logo.jpeg";
import { actionCreators, actionTypes } from "./store";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const FormWrapper = styled.div`
  height: 90%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  -webkit-box-shadow: 0px 0px 20px -6px #000000;
  box-shadow: 0px 0px 20px -6px #000000;
  &.hide {
    display: none;
  }
`;

const ResultWrapper = styled.div`
  &.hide {
    display: none;
  }
`;

const LogoImage = styled.img`
  width: 30%;
`;

const LogoText = styled.div`
  font-weight: bold;
  font-style: 19px;
  color: #a4a6b3;
`;

const Title = styled.h1`
  font-style: 24px;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-style: 14px;
  color: #9fa2b4;
`;

const InputWrapper = styled.div`
  width: 300px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Label = styled.label`
  width: 100%;
  font-weight: bold;
  color: #9fa2b4;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  line-height: 30px;
  padding: 5px;
  border: 1px solid #9fa2b4;
  border-radius: 5px;
  background-color: #fcfdfe;
  outline: none;
  margin-top: 5px;
  font-weight: bold;
  ::placeholder {
    color: #9fa2b4;
    font-weight: normal;
  }
  &.error {
    border-color: darkred;
  }
`;

const ShowPassword = styled.span`
  position: absolute;
  right: 3%;
  bottom: 10%;
  color: #9fa2b4;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  width: 312px;
  height: 52px;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  background-color: #3751ff;
  color: white;
  :hover {
    background-color: #3751ff;
    opacity: 0.9;
    color: white;
  }
  :focus {
    background-color: #3751ff;
    color: white;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Text = styled.div``;
const StyledLink = styled.a`
  margin-left: 5px;
  color: #3751ff;
  font-weight: bold;
  text-decoration: none;
`;

const Warning = styled.small`
  color: darkred;
  margin-top: 2px;
  &.hide {
    visibility: hidden;
  }
`;

const RegisterPage = (props) => {
  const {
    handleSubmit,
    inputErrorObject,
    modifyInputErrorObject,
    registered,
    registerButtonLoading,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    password: "",
    email: "",
    registerCode: "",
  });

  const handleInput = (e) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
    delete inputErrorObject[e.target.name];
    modifyInputErrorObject(inputErrorObject);
  };

  return (
    <Container>
      <ResultWrapper className={registered ? "" : "hide"}>
        <Result
          status="success"
          title="If you are registered as a visitor, that's all done! Please login. Otherwise, you'll need to activate your account via the email we just sent you, then log in."
          extra={
            <Link to="/login">
              <StyledButton>Login</StyledButton>
            </Link>
          }
        />
      </ResultWrapper>
      <FormWrapper className={registered ? "hide" : ""}>
        <LogoImage src={Logo}></LogoImage>
        <LogoText>Tuantuan Dashboard</LogoText>
        <Title>Sign Up to Dashboard</Title>
        <Subtitle>Enter your email, name and password below</Subtitle>
        <InputWrapper>
          <Label>EMAIL</Label>
          <Input
            placeholder="Email address"
            type="text"
            name="email"
            onChange={handleInput}
            className={inputErrorObject.email === undefined ? "" : "error"}
          />
          <Warning
            className={inputErrorObject.email === undefined ? "hide" : ""}
          >
            {inputErrorObject.email}
          </Warning>
        </InputWrapper>

        <InputWrapper>
          <Label>NAME</Label>
          <Input
            placeholder="Name"
            type="text"
            name="name"
            onChange={handleInput}
            className={inputErrorObject.name === undefined ? "" : "error"}
          />
          <Warning
            className={inputErrorObject.name === undefined ? "hide" : ""}
          >
            {inputErrorObject.name}
          </Warning>
        </InputWrapper>
        <InputWrapper>
          <Label>PASSWORD</Label>
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleInput}
            className={inputErrorObject.password === undefined ? "" : "error"}
          />
          <ShowPassword
            className="material-icons-outlined"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </ShowPassword>
        </InputWrapper>
        <Warning
          className={inputErrorObject.password === undefined ? "hide" : ""}
        >
          {inputErrorObject.password}
        </Warning>
        <InputWrapper>
          <Label>REGISTER CODE</Label>
          <Input
            placeholder="Register code"
            type="text"
            name="registerCode"
            onChange={handleInput}
            className={
              inputErrorObject.registerCode === undefined ? "" : "error"
            }
          />
          <Warning
            className={
              inputErrorObject.registerCode === undefined ? "hide" : ""
            }
          >
            {inputErrorObject.registerCode}
          </Warning>
        </InputWrapper>

        <StyledButton
          onClick={() => handleSubmit(registerInfo)}
          loading={registerButtonLoading}
        >
          Sign Up
        </StyledButton>

        <TextWrapper>
          <Text>Already have an account?</Text>
          <StyledLink href="/login">Log In</StyledLink>
        </TextWrapper>
      </FormWrapper>
    </Container>
  );
};

const mapState = (state) => ({
  inputErrorObject: state.getIn(["register", "inputErrorObject"]).toJS(),
  registered: state.getIn(["register", "registered"]),
  registerButtonLoading: state.getIn(["register", "registerButtonLoading"]),
});

const mapDispatch = (dispatch) => ({
  handleSubmit(registerInfo) {
    dispatch(actionCreators.submitRegisterAction(registerInfo));
  },

  modifyInputErrorObject(newObject) {
    dispatch({
      type: actionTypes.MODIFY_INPUT_ERROR_OBJECT,
      value: fromJS(newObject),
    });
  },
});

export default connect(mapState, mapDispatch)(RegisterPage);
