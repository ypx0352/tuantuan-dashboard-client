import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import userImage from "../../../image/tuan-logo.jpeg";
import LoginPage from "../../login-page/LoginPage";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.span.attrs({ className: "material-icons-outlined" })`
  font-size: 30px;
  cursor: pointer;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-left: 5px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &.hide {
    display: none;
  }
  .link {
    color: #363740;
  }
`;

const Name = styled.span`
  font-weight: bold;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 10px;
  border-radius: 20px;
`;

const Cart = styled.div`
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  &.hide {
    display: none;
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
`;

const CartIcon = styled.span.attrs({ className: "material-symbols-outlined" })`
  font-size: 35px;
`;

const CartItemCount = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  top: -15px;
  right: -10px;
  background-color: #145da0;
  color: white;
  border-radius: 50%;
  &.hide {
    display: none;
  }
`;

const Header = (props) => {
  const { setShowCart, showSidebar, handleShowSidebar, handleLogout } = props;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      setLogged(false);
      setShowLoginModal(true);
    } else {
      setLogged(true);
      setShowLoginModal(false);
    }
  });

  const name = localStorage.getItem("name");

  return (
    <Container>
      <Left>
        <Icon onClick={() => handleShowSidebar(!showSidebar)}>
          {showSidebar ? "menu_open" : "menu"}
        </Icon>
        <Title>{props.title}</Title>
      </Left>

      <Right>
        <Cart
          className={props.cartCount === "hide" ? "hide" : ""}
          onClick={() => setShowCart(true)}
        >
          <CartIconWrapper>
            <CartIcon>shopping_cart_checkout</CartIcon>
            <CartItemCount className={props.cartCount === 0 ? "hide" : ""}>
              {props.cartCount}
            </CartItemCount>
          </CartIconWrapper>
        </Cart>
        <UserWrapper className={logged ? "" : "hide"}>
          <Link to="/dashboard/user" className="link">
            <Name>{name}</Name>
            <UserImage src={userImage}></UserImage>
          </Link>

          <Link to={"/"} className='link'>
            <span
              className="material-symbols-outlined"
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              logout
            </span>
          </Link>
        </UserWrapper>
      </Right>

      <Modal
        title="Please login again"
        visible={showLoginModal}
        closable={false}
        footer={
          <Link to="/">
            <Button
              type="primary"
              onClick={() => {
                setShowLoginModal(false);
                handleLogout();
              }}
            >
              Log out
            </Button>
          </Link>
        }
      >
        {
          <LoginPage
            redirectTo={useLocation().pathname}
            containerHeight="100%"
            parentCallback={(childData) => {
              if (childData) {
                setShowLoginModal(false);
                setLogged(true);
                window.location.reload();
              }
            }}
          />
        }
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
  loginSuccess: state.getIn(["login", "loginSuccess"]),
});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },

  handleShowSidebar(value) {
    dispatch({ type: actionTypes.SET_SHOW_SIDEBAR, value: fromJS(value) });
  },

  handleLogout() {
    dispatch(actionCreators.logoutAction);
  },
});

export default connect(mapState, mapDispatch)(Header);
