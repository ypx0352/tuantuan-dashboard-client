import React, { useEffect } from "react";
import styled from "styled-components";
import { Descriptions, Button, Badge } from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { connect } from "react-redux";
import { actionCreators } from "./store";

const PageContainer = styled.div`
  display: flex;
  min-width: 1200px;
  min-height: 100vh;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;
  margin: 15px 20px;
`;

const Left = styled.div`
  max-width: 15%;
`;

const Right = styled.div`
  min-width: 88%;
  padding: 20px;
  &.expand {
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserPage = (props) => {
  const { getUserInfo, userInfo } = props;

  useEffect(() => {
    getUserInfo();
  });

  return (
    <PageContainer>
      <Left>
        <Sidebar selected="user" />
      </Left>
      <Right>
        <Header title="User" cartCount="hide" />
        <ContentWrapper>
          <Descriptions
            bordered
            title="User info"
            size="default"
            column={2}
            extra={<Button href="/reset_password">Change password</Button>}
          >
            <Descriptions.Item label="Username">
              {userInfo.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {userInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">{userInfo.role}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {userInfo.active ? (
                <Badge status="success" text="Actived" />
              ) : (
                <Badge status="error" text="Inactive" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Email verified">
              {userInfo.emailVerified ? (
                <Badge status="success" text="Verified" />
              ) : (
                <Badge status="error" text="Unverified" />
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Created at">
              {userInfo.createdAtLocale}
            </Descriptions.Item>
          </Descriptions>
        </ContentWrapper>
      </Right>
    </PageContainer>
  );
};

const mapState = (state) => ({
  userInfo: state.getIn(["user", "userInfo"]).toJS(),
});

const mapDispatch = (dispatch) => ({
  getUserInfo() {
    dispatch(actionCreators.getUserInfoAction);
  },
});

export default connect(mapState, mapDispatch)(UserPage);
