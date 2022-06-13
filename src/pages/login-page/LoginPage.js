import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Input } from "antd";
import { fromJS } from "immutable";
import Logo from "../../image/tuan-logo.jpeg";
import { actionCreators } from "./store";
import { actionTypes as registerActionTypes } from "../register-page/store";

const Container = styled.div`
  min-height: ${(props) =>
    props.containerHeight === undefined ? "100vh" : "100%"};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Wrapper = styled.div`
  height: 70%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  -webkit-box-shadow: 0px 0px 20px -6px #000000;
  box-shadow: 0px 0px 20px -6px #000000;
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

const StyledInput = styled(Input)`
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

const ForgotPassword = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  font-weight: bold;
  color: #9fa2b4;
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
const StyledA = styled.a`
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

const LoginPage = (props) => {
  const {
    handleSubmit,
    inputErrorObject,
    modifyInputErrorObject,
    loginButtonLoading,
  } = props;

  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      navigate(
        props.redirectTo === undefined
          ? "/dashboard/overview"
          : props.redirectTo
      );
    }
  });

  const handleInput = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    delete inputErrorObject[e.target.name];
    modifyInputErrorObject(inputErrorObject);
  };

  return (
    <Container containerHeight={props.containerHeight}>
      <Wrapper>
        <LogoImage src={Logo}></LogoImage>
        <LogoText>Tuantuan Dashboard</LogoText>
        <Title>Log In to Dashboard</Title>
        <Subtitle>Enter your email and password below</Subtitle>
        <InputWrapper>
          <Label>EMAIL</Label>
          <StyledInput
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
          <Label>PASSWORD</Label>
          <StyledInput
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleInput}
            className={inputErrorObject.password === undefined ? "" : "error"}
            onPressEnter={() => handleSubmit(loginInfo, props.parentCallback)}
          />
          <ForgotPassword>
            <StyledA href="/reset_password">Forgot password?</StyledA>
          </ForgotPassword>
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

        <StyledButton
          onClick={() => handleSubmit(loginInfo, props.parentCallback)}
          loading={loginButtonLoading}
        >
          Log In
        </StyledButton>
        <TextWrapper>
          <Text>Don't have an account?</Text>
          <StyledA href="/register">Sign up</StyledA>
        </TextWrapper>
      </Wrapper>
    </Container>
  );
};

const mapState = (state) => ({
  inputErrorObject: state.getIn(["register", "inputErrorObject"]).toJS(),
  loginButtonLoading: state.getIn(["login", "loginButtonLoading"]),
});

const mapDispatch = (dispatch) => ({
  handleSubmit(loginInfo, parentCallback) {
    dispatch(actionCreators.loginAction(loginInfo, parentCallback));
  },

  modifyInputErrorObject(newObject) {
    dispatch({
      type: registerActionTypes.MODIFY_INPUT_ERROR_OBJECT,
      value: fromJS(newObject),
    });
  },
});

export default connect(mapState, mapDispatch)(LoginPage);
