import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  height: 100%;
  width: 160px;
  display: flex;
  flex-direction: column;
  background-color: #363740;
  transition: 1s ease-in-out;
  overflow: auto;
  &.hide {
    width: 0px;
  }
`;

const DashboardTitle = styled.a.attrs({ href: "/" })`
  font-size: 19px;
  color: #a4a6b3;
  text-align: center;
  margin-top: 10px;
  :hover {
    color: white;
  }
`;

const List = styled.div`
  margin-top: 20px;
  border-bottom: 1px #3c3e4c solid;
  font-size: 16px;
`;

const ListItemWrapper = styled.a`
  height: 56px;
  display: flex;
  align-items: center;
  color: #a4a6b3;
  padding-left: 20px;
  cursor: pointer;
  text-decoration: none;
  :hover {
    color: white;
    background-color: #3c3e4c;
    border-bottom: 2px solid white;
  }
  &.selected {
    color: white;
    background-color: #3c3e4c;
    border-left: 10px solid white;
  }
`;

const ListItemText = styled.span`
  margin-left: 15px;
`;

const ListItemIcon = styled.span``;

const Sidebar = (props) => {
  const { selected, showSidebar } = props;
  return (
    <SidebarWrapper className={showSidebar ? "" : "hide"}>
      <DashboardTitle>Tuantuan Dashbord</DashboardTitle>
      <List>
        <ListItemWrapper
          href="/dashboard/overview"
          className={selected === "overview" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            timeline
          </ListItemIcon>
          <ListItemText>Overview</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/order"
          className={selected === "order" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            shopping_bag
          </ListItemIcon>
          <ListItemText>Order</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/checkout"
          className={selected === "checkout" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            shopping_cart_checkout
          </ListItemIcon>
          <ListItemText>Checkout</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/transaction"
          className={selected === "transaction" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            shopping_cart_checkout
          </ListItemIcon>
          <ListItemText>Transaction</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/package"
          className={selected === "package" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            flight_takeoff
          </ListItemIcon>
          <ListItemText>Package</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/address"
          className={selected === "address" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            import_contacts
          </ListItemIcon>
          <ListItemText>Address</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/tool"
          className={selected === "tool" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            <span className="material-symbols-outlined">
              home_repair_service
            </span>
          </ListItemIcon>
          <ListItemText>Tool</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/log"
          className={selected === "log" ? "selected" : ""}
        >
          <ListItemIcon className="material-symbols-outlined">
            receipt_long
          </ListItemIcon>
          <ListItemText>Log</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/settings"
          className={selected === "settings" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            settings
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </ListItemWrapper>
        <ListItemWrapper
          href="/dashboard/user"
          className={selected === "user" ? "selected" : ""}
        >
          <ListItemIcon className="material-icons-outlined">
            person
          </ListItemIcon>
          <ListItemText>User</ListItemText>
        </ListItemWrapper>
      </List>
    </SidebarWrapper>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
});

export default connect(mapState, null)(Sidebar);
