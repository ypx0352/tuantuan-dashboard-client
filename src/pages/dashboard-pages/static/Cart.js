import { fromJS } from "immutable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { Empty, Modal, Card, message, Popconfirm } from "antd";
import { actionCreators, actionTypes } from "./store";
import wechatQRCode from "../../../image/wechat_qr_code.jpg";
import alipayQRCode from "../../../image/alipay_qr_code.jpg";

const CartContainer = styled.div`
  @keyframes display_cart {
    from {
      height: 0;
    }
    to {
      height: 70vh;
    }
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  height: 70vh;
  background-color: #363740;
  padding: 20px;
  animation-name: display_cart;
  animation-duration: 1s;
  &.hide {
    display: none;
  }
`;

const CartContent = styled.div`
  //min-height: 80%;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #bcbbb4;
  font-weight: bold;
  padding: 15px;
  border-bottom: 2px solid rgba(255, 254, 242, 0.1);
`;

const Items = styled.div`
  max-height: 100%;
  overflow: auto;
  position: relative;
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #bcbbb4;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 254, 242, 0.1);
  :hover {
    border-bottom: 0.1px solid white;
    .remove {
      display: inline;
    }
    .payAmountToSender {
      display: none;
    }
    .allProfits {
      display: inline;
    }
  }
`;

const Remove = styled.span`
  display: none;
  color: red;
  cursor: pointer;
`;

const CartSummaryWrapper = styled.div`
max-height: 35%;
  display: flex;
  justify-content: flex-end;
`;

const CartSummary = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  display: flex;

  
  flex-direction: column;
  color: #bcbbb4;
  animation: fadeIn 2s ease-in;
`;

const Subtotal = styled.div`
  display: flex;
  width: 480px;
  justify-content: space-between;
  align-items: baseline;
`;

const Button = styled.button`
  width: 480px;
  box-sizing: border-box;
  padding: 21px 23px;
  border: 1px solid rgb(234, 234, 223);
  color: #212121;
  font-size: 14px;
  margin-top: 20px;
  cursor: pointer;
`;

const CompanyLogo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-top: 15px;
`;

const colors = {
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
  allProfitsNotSelected: "#EC8FD0",
  allProfitsSelected: "#D43790",
};

const Tag = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 2px 5px;
  border-radius: 10px;
  color: white;
  &.allProfits {
    display: none;
    cursor: pointer;
  }
  &.keep {
    display: inline;
  }
  &.hide {
    display: none;
  }
`;

const Cart = (props) => {
  const {
    setShowCart,
    cartItems,
    initializeCart,
    cartSubtotal,
    handleRemove,
    handleSetReturnAllProfitsItem,
    handleFinishPayment,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalActiveTabKey, setModalActiveTabKey] = useState("Alipay");

  useEffect(() => {
    initializeCart();
  }, []);

  const modalContent = {
    Alipay: (
      <img alt="Alipay QR code" src={alipayQRCode} style={{ maxWidth: "100%", maxHeight: "100%" }} />
    ),
    Wechat: (
      <img alt="Wechat QR code" src={wechatQRCode} style={{ maxWidth: "100%", maxHeight: "100%" }} />
    ),
    Bank: (
      <div>
        <p>
          Account: {`${process.env.REACT_APP_BANK_ACCOUNT}`}
          <span
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
            onClick={() =>
              copyTextToClipboard(process.env.REACT_APP_BANK_ACCOUNT)
            }
          >
            content_copy
          </span>
        </p>
        <p>Account Bank: 中国银行大同市分行营业部 </p>
      </div>
    ),
  };

  const copyTextToClipboard = async (text) => {
    try {
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
        message.success("Copied.");
      } else {
        throw new Error("Your broswer does not support this action.");
      }
    } catch (error) {
      message.warn(error.message);
    }
  };

  const modalTabList = [
    {
      key: "Alipay",
      tab: <span className="iconfont icon-zhifubaozhifu-copy-copy"></span>,
    },
    {
      key: "Wechat",
      tab: <span className="iconfont icon-weixinzhifu1-copy-copy"></span>,
    },
    {
      key: "Bank",
      tab: <span className="iconfont icon-zhongguoyinhang"> </span>,
    },
  ];

  const generateCartItem = () => {
    return cartItems.map((item, index) => {
      return (
        <Record key={index}>
          <span style={{ width: "35%" }}>
            {item.get("item") + " "}
            {item.get("originalType") !== "sold" ? (
              <Tag type={item.get("originalType")}>
                {item.get("originalType")}
              </Tag>
            ) : (
              ""
            )}
            <Tag
              type={
                item.get("returnAllProfits")
                  ? "allProfitsSelected"
                  : "allProfitsNotSelected"
              }
              className={
                ["employee", "exception"].includes(item.get("originalType"))
                  ? "hide"
                  : item.get("returnAllProfits")
                  ? "keep allProfits"
                  : "allProfits"
              }
              onClick={() =>
                handleSetReturnAllProfitsItem(
                  item.get("_id"),
                  !item.get("returnAllProfits")
                )
              }
            >
              All profits
            </Tag>
          </span>
          <span style={{ width: "10%" }}>{item.get("qty")}</span>
          <span style={{ width: "15%" }}>
            <span>{item.get("receiver")} </span>

            <Link
              to={`/dashboard/package/?pk_id=${item.get("pk_id")}`}
              target="_blank"
            >
              {item.get("pk_id")}
            </Link>
          </span>

          <span style={{ width: "10%" }}>
            {item.get("originalType") === "employee"
              ? "————"
              : `￥${item.get("payAmountFromCustomer")}`}
          </span>
          <span style={{ width: "10%" }}>
            {item.get("originalType") === "employee"
              ? "———— "
              : `￥${item.get("profits")}`}
          </span>
          <span style={{ width: "15%" }}>{item.get("note")}</span>
          <span style={{ width: "5%" }} className="payAmountToSender">
            ￥ {item.get("payAmountToSender")}
          </span>
          <Remove
            className="remove"
            style={{ width: "5%" }}
            onClick={() =>
              handleRemove(
                item.get("_id"),
                item.get("original_id"),
                item.get("originalType"),
                item.get("qty")
              )
            }
          >
            Remove
          </Remove>
        </Record>
      );
    });
  };

  return (
    <CartContainer className={props.className}>
      <CartContent>
        <Header>
          <span style={{ width: "35%" }}>Item</span>
          <span style={{ width: "10%" }}>Quantity</span>
          <span style={{ width: "15%" }}>Receiver</span>
          <span style={{ width: "10%" }}>Customer pay</span>
          <span style={{ width: "10%" }}>Profits</span>
          <span style={{ width: "15%" }}>Note</span>
          <span
            style={{ width: "5%", cursor: "pointer" }}
            className="material-icons-outlined"
            onClick={() => setShowCart(false)}
          >
            close
          </span>
        </Header>

        {cartItems.size === 0 ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: "50%",
              marginTop: "10%",
            }}
            style={{ color: "#bcbbb4" }}
            description={<span>Your cart is empty</span>}
          />
        ) : (
          <Items>{generateCartItem()}</Items>
        )}
      </CartContent>

      {cartItems.size === 0 ? (
        ""
      ) : (
        <CartSummaryWrapper>
          <CartSummary>
            <Subtotal>
              <span style={{ fontSize: "15px" }}>Subtotal</span>
              <span style={{ fontSize: "25px" }}>￥ {cartSubtotal}</span>
            </Subtotal>
            <Button onClick={() => setModalVisible(true)}>Checkout</Button>
            <CompanyLogo>
              <span
                className="iconfont icon-zhifubaozhifu-copy-copy"
                style={{ marginRight: "10px" }}
              ></span>
              <span
                className="iconfont icon-weixinzhifu1-copy-copy"
                style={{ marginRight: "10px" }}
              ></span>
              <span className="iconfont icon-zhongguoyinhang"> </span>
            </CompanyLogo>
          </CartSummary>
        </CartSummaryWrapper>
      )}

      <Modal
        title={
          <>
            <span>Please pay </span>{" "}
            <span
              style={{
                color: "#145DA0",
                fontWeight: "bold",
                fontSize: "large",
              }}
            >{`￥${cartSubtotal}`}</span>
          </>
        }
        visible={modalVisible}
        okText={
          <Popconfirm
            placement="topRight"
            title={
              <>
                <p>
                  Please make sure you have paid ￥{cartSubtotal} via{" "}
                  {modalActiveTabKey}.
                </p>
                <p>After clicking "Yes", you cannot make any changes. </p>
              </>
            }
            onConfirm={() => {
              handleFinishPayment(modalActiveTabKey);
              setModalVisible(false);
              setShowCart(false);
            }}
            okText={`Yes, I have paid ￥${cartSubtotal}`}
            cancelText="Cancel"
          >
            <span>Finish Payment</span>
          </Popconfirm>
        }
        onCancel={() => setModalVisible(false)}
      >
        <Card
          tabList={modalTabList}
          activeTabKey={modalActiveTabKey}
          onTabChange={(key) => setModalActiveTabKey(key)}
        >
          {modalContent[modalActiveTabKey]}
        </Card>
      </Modal>
    </CartContainer>
  );
};

const mapState = (state) => ({
  cartItems: state.getIn(["static", "cartItems"]),
  cartSubtotal: state.getIn(["static", "cartSubtotal"]),
});

const mapDispatch = (dispatch) => ({
  setShowCart(value) {
    dispatch({ type: actionTypes.SET_SHOW_CART, value: fromJS(value) });
  },

  initializeCart() {
    dispatch(actionCreators.initializeCartAction);
  },

  handleRemove(record_id, solid_id, type, addToCart) {
    dispatch(
      actionCreators.removeFromCartAction(record_id, solid_id, type, addToCart)
    );
  },

  handleSetReturnAllProfitsItem(_id, returnAllProfits) {
    dispatch(
      actionCreators.setReturnAllProfitsItemAction(_id, returnAllProfits)
    );
  },

  handleFinishPayment(paymentMethod) {
    dispatch(actionCreators.finishPaymentAction(paymentMethod));
  },
});

export default connect(mapState, mapDispatch)(Cart);
