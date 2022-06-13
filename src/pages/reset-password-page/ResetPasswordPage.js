import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, Input, Result } from "antd";
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

const FormWrapper = styled.div`
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

const InputWrapper = styled.div`
  width: 300px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  &.hide {
    display: none;
  }
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
  &.hide {
    display: none;
  }
`;

const Warning = styled.small`
  color: darkred;
  margin-top: 2px;
  &.hide {
    visibility: hidden;
  }
`;

const ResetPasswordPage = (props) => {
  const {
    handleSubmit,
    inputErrorObject,
    modifyInputErrorObject,
    submitButtonLoading,
    sendCodeSuccess,
    handleSendCode,
    sendCodeButtonLoading,
    resetSuccess,
  } = props;

  const [resetInfo, setResetInfo] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInput = (e) => {
    setResetInfo({ ...resetInfo, [e.target.name]: e.target.value });
    delete inputErrorObject[e.target.name];
    modifyInputErrorObject(inputErrorObject);
  };

  return (
    <Container containerHeight={props.containerHeight}>
      <ResultWrapper className={resetSuccess ? "" : "hide"}>
        <Result
          status="success"
          title="Your password has been reset."
          extra={
            <Link to="/login">
              <StyledButton>Login</StyledButton>
            </Link>
          }
        />
      </ResultWrapper>
      <FormWrapper className={resetSuccess ? "hide" : ""}>
        <LogoImage src={Logo}></LogoImage>
        <LogoText>Tuantuan Dashboard</LogoText>
        <Title>Reset Password</Title>
        <InputWrapper>
          <Label>EMAIL</Label>
          <StyledInput
            placeholder="Email address"
            type="text"
            name="email"
            onChange={handleInput}
            disabled={sendCodeSuccess}
            className={inputErrorObject.email === undefined ? "" : "error"}
          />
          <Warning
            className={inputErrorObject.email === undefined ? "hide" : ""}
          >
            {inputErrorObject.email}
          </Warning>
        </InputWrapper>
        <InputWrapper>
          <Label>USERNAME</Label>
          <StyledInput
            placeholder="Username"
            type="text"
            name="name"
            onChange={handleInput}
            disabled={sendCodeSuccess}
            className={inputErrorObject.name === undefined ? "" : "error"}
          />
          <Warning
            className={inputErrorObject.name === undefined ? "hide" : ""}
          >
            {inputErrorObject.email}
          </Warning>
        </InputWrapper>
        <StyledButton
          onClick={() => handleSendCode(resetInfo)}
          loading={sendCodeButtonLoading}
          className={sendCodeSuccess ? "hide" : ""}
        >
          Send verification code
        </StyledButton>
        <InputWrapper className={sendCodeSuccess ? "" : "hide"}>
          <Label>VERIFICATION CODE</Label>
          <StyledInput
            placeholder="Verification code in email"
            name="code"
            onChange={handleInput}
            className={inputErrorObject.code === undefined ? "" : "error"}
          />
        </InputWrapper>
        <Warning className={inputErrorObject.code === undefined ? "hide" : ""}>
          {inputErrorObject.code}
        </Warning>
        <InputWrapper className={sendCodeSuccess ? "" : "hide"}>
          <Label>NEW PASSWORD</Label>
          <StyledInput
            placeholder="New password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleInput}
            onPressEnter={() => handleSubmit(resetInfo)}
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

        <StyledButton
          onClick={() => handleSubmit(resetInfo)}
          loading={submitButtonLoading}
          className={sendCodeSuccess ? "" : "hide"}
        >
          Submit
        </StyledButton>
      </FormWrapper>
    </Container>
  );
};

const mapState = (state) => ({
  inputErrorObject: state.getIn(["register", "inputErrorObject"]).toJS(),
  submitButtonLoading: state.getIn(["resetPassword", "submitButtonLoading"]),
  sendCodeSuccess: state.getIn(["resetPassword", "sendCodeSuccess"]),
  sendCodeButtonLoading: state.getIn([
    "resetPassword",
    "sendCodeButtonLoading",
  ]),
  resetSuccess: state.getIn(["resetPassword", "resetSuccess"]),
});

const mapDispatch = (dispatch) => ({
  handleSubmit(resetInfo) {
    dispatch(actionCreators.resetPasswordAction(resetInfo));
  },

  modifyInputErrorObject(newObject) {
    dispatch({
      type: registerActionTypes.MODIFY_INPUT_ERROR_OBJECT,
      value: fromJS(newObject),
    });
  },

  handleSendCode(resetInfo) {
    dispatch(actionCreators.sendVerificationCodeAction(resetInfo));
  },
});

export default connect(mapState, mapDispatch)(ResetPasswordPage);
