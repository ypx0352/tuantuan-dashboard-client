import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100px;
  width: 100%;
  background: red;
`;

const Footer = () => {
  return <Container></Container>;
};

export default Footer;
