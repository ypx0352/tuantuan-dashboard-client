import React from "react";
import mainImage from "../../image/not_found_page.png";
import styled from "styled-components";
import { Button } from "antd";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 200px;
`;

const StyledButton = styled(Button).attrs({ type: "primary" })`
  background-color: #189ab4;
  min-width: 65px;
  height: 50px;
  padding: 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  text-align: center;
  color: "white";
  :hover {
    background-color: #e8b4b8;
  }
`;

const NotFoundPage = () => {
  return (
    <Container>
      <img alt="Not found img" src={mainImage} style={{ width: "70%" }} />
      <a href="/dashboard/overview">
        <StyledButton>Home page</StyledButton>
      </a>
    </Container>
  );
};

export default NotFoundPage;
