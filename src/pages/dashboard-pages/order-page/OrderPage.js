import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Table,
  Input,
  Spin,
  message,
  BackTop,
  Button,
  Modal,
  DatePicker,
  Select,
} from "antd";

import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";

const { TextArea } = Input;
const { Option } = Select;

const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  min-width: 1200px;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;
  /* margin: 15px 20px; */
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

const OrderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* padding: 10px; */
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const OrderExistMessage = styled.div`
  text-align: center;
  margin-bottom: 15px;
  &.hide {
    display: none;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding-bottom: 5px;
  border-bottom: 1px dashed grey;
`;

const Btn = styled.div`
  width: 10%;
  padding: 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background-color: #3751ff;
  cursor: pointer;
  color: white;
`;

const StyledButton = styled(Button)`
  width: 10%;
  height: 50px;
  padding: 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background-color: #3751ff;
  color: white;
  :hover {
    opacity: 0.9;
    background-color: #3751ff;
    color: white;
  }
  :focus {
    background-color: #3751ff;
    color: white;
  }
`;

const ExchangeRateWrapper = styled.a.attrs({ target: "_blank" })`
  text-align: right;
  color: #3751ff;
  padding: 0 10px;
  font-weight: bold;
  &.hide {
    display: none;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  &.hide {
    display: none;
  }
`;

const ReviewContainer = styled.div``;

const SubmitWrapper = styled.div`
  &.hide {
    display: none;
  }
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#3751ff" }} spin />
);

const OrderPage = (props) => {
  const {
    originalOrder,
    handleSearch,
    spinning,
    exchangeRate,
    initializeExchangeRate,
    exchangeRateSpinning,
    handleReview,
    showReview,
    setShowReview,
    reviewData,
    handleSubmit,
    showSubmitResultDialog,
    handleOnOk,
    setShowSubmitResultDialog,
    submitResult,
    submitLoading,
    normalPostage,
    babyFormulaPostage,
    adultFormula3Postage,
    adultFormula6Postage,
    otherItemPostage,
    exchangeRateInSetting,
    initializeSettings,
    showSidebar,
    showExistMessage,
    modifyOriginalOrder,
    getReceivers,
    receivers,
    setReceiverBySelection,
  } = props;

  const userRole = localStorage.getItem("role");

  const [searchInput, setSearchInput] = useState("");
  const [tableEditabled, setTableEditable] = useState(true);

  // get settings
  useEffect(() => initializeSettings(), []);

  // get current exchange rate
  useEffect(
    () => userRole === "admin" && initializeExchangeRate(exchangeRate),
    []
  );

  // fetch receiver data from store
  const receiverData = [
    {
      key: "receiverData",
      receiver: originalOrder.get("receiver_name"),
      phone: originalOrder.get("receiver_phone"),
      address: originalOrder.get("receiver_address"),
    },
  ];

  // set receiver columns
  const receiverColumns = [
    {
      title: "Receiver Information",
      children: [
        {
          title: (
            <>
              <p>Receiver</p>
              {tableEditabled ? (
                <Select
                  showSearch
                  placeholder="Select a receiver"
                  bordered={true}
                  onFocus={() => getReceivers(receivers)}
                  onChange={(value) => {
                    setReceiverBySelection(value, receivers);
                  }}
                  style={{ width: "100%" }}
                >
                  {receivers !== null
                    ? receivers.map((receiver) => {
                        return (
                          <Option
                            key={receiver.get("id")}
                            value={
                              receiver.get("id") + "/" + receiver.get("name")
                            }
                          >
                            {receiver.get("name") +
                              " " +
                              receiver.get("address")}
                          </Option>
                        );
                      })
                    : ""}
                </Select>
              ) : (
                ""
              )}
            </>
          ),
          dataIndex: "receiver",
          key: "receiver",
          render: (text) => {
            return tableEditabled ? (
              <>
                <Input
                  type="text"
                  size="small"
                  bordered={false}
                  value={text}
                  onChange={(e) =>
                    modifyOriginalOrder(
                      "receiver_name",
                      e.target.value,
                      originalOrder
                    )
                  }
                />
              </>
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          title: "Phone",
          dataIndex: "phone",
          key: "phone",
          render: (text) => {
            return tableEditabled ? (
              <Input
                type="number"
                size="small"
                bordered={false}
                value={text}
                prefix="+86 "
                onChange={(e) =>
                  modifyOriginalOrder(
                    "receiver_phone",
                    e.target.value,
                    originalOrder
                  )
                }
              />
            ) : (
              <span>+86 {text}</span>
            );
          },
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
          render: (text) => {
            return tableEditabled ? (
              <Input
                type="text"
                size="small"
                bordered={false}
                value={text}
                onChange={(e) =>
                  modifyOriginalOrder(
                    "receiver_address",
                    e.target.value,
                    originalOrder
                  )
                }
              />
            ) : (
              <span>{text}</span>
            );
          },
        },
      ],
    },
  ];

  // fetch package data from store
  const [postage, setPostage] = useState(null);

  const calculatePostage = (packageType) => {
    switch (packageType) {
      case "非奶粉":
        setPostage(
          Number(
            (
              (originalOrder.get("package_weight") <= 1
                ? 1
                : Number(originalOrder.get("package_weight")).toFixed(2)) *
              normalPostage
            ).toFixed(2)
          )
        );
        break;
      case "奶粉":
        setPostage(babyFormulaPostage);
        break;
      case "蓝胖子3":
        setPostage(adultFormula3Postage);
        break;
      case "蓝胖子6":
        setPostage(adultFormula6Postage);
        break;
      case "其他":
        setPostage(
          Number(
            (
              (originalOrder.get("package_weight") <= 1
                ? 1
                : Number(originalOrder.get("package_weight")).toFixed(2)) *
              otherItemPostage
            ).toFixed(2)
          )
        );
        break;
    }
  };

  const setAdultFormulaWeight = (originalOrder) => {
    if (
      originalOrder.get("item_type") === "蓝胖子3" &&
      originalOrder.get("package_weight") !== 4.05
    ) {
      modifyOriginalOrder("package_weight", 4.05, originalOrder);
    } else if (
      originalOrder.get("item_type") === "蓝胖子6" &&
      originalOrder.get("package_weight") !== 7.8
    ) {
      modifyOriginalOrder("package_weight", 7.8, originalOrder);
    }
  };

  const setAdultFormulaCount = (originalOrder) => {
    if (
      originalOrder.get("item_type") === "蓝胖子3" &&
      originalOrder.get("item_count") !== 3
    ) {
      modifyOriginalOrder("item_count", 3, originalOrder);
    } else if (
      originalOrder.get("item_type") === "蓝胖子6" &&
      originalOrder.get("item_count") !== 6
    ) {
      modifyOriginalOrder("item_count", 6, originalOrder);
    }
  };

  useEffect(() => {
    calculatePostage(originalOrder.get("item_type"));
    setAdultFormulaWeight(originalOrder);
    setAdultFormulaCount(originalOrder);
  }, [originalOrder]);

  const packageData = [
    {
      key: "packageData",
      pk_id: originalOrder.get("package_id"),
      sendTimeACST: originalOrder.get("sendTimeACST"),
      type: originalOrder.get("item_type"),
      weight: originalOrder.get("package_weight"),
      count: originalOrder.get("item_count"),
      postage: postage,
      exchangeRate: exchangeRateInSetting,
      sendTimeISO: originalOrder.get("sendTimeISO"),
    },
  ];

  // set package columns
  const packageColumns = [
    {
      title: "Package Information",
      children: [
        {
          title: "ID",
          dataIndex: "pk_id",
          key: "pk_id",
          render: (text) => {
            return tableEditabled ? (
              <Input
                type="text"
                size="small"
                bordered={false}
                value={text}
                onChange={(e) =>
                  modifyOriginalOrder(
                    "package_id",
                    e.target.value,
                    originalOrder
                  )
                }
              />
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          title: "Send time (ACST)",
          dataIndex: "sendTimeACST",
          key: "sendTimeACST",
          render: (text) => {
            return tableEditabled ? (
              <DatePicker
                format={"DD/MM/YYYY HH:mm:ss"}
                size="small"
                bordered={false}
                onChange={(value) =>
                  modifyOriginalOrder("sendTimeISO", value, originalOrder)
                }
              />
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          width: "15%",
          render: (text) => {
            return tableEditabled ? (
              <Select
                showSearch
                placeholder="Select a type"
                bordered={false}
                size="small"
                onChange={(value) =>
                  modifyOriginalOrder("item_type", value, originalOrder)
                }
              >
                <Option value="蓝胖子3">蓝胖子3</Option>
                <Option value="蓝胖子6">蓝胖子6</Option>
                <Option value="其他">其他</Option>
              </Select>
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          title: "Weight (Kg)",
          dataIndex: "weight",
          key: "weight",
          render: (text) => {
            return tableEditabled ? (
              <Input
                type="number"
                size="small"
                bordered={false}
                value={text}
                onChange={(e) =>
                  modifyOriginalOrder(
                    "package_weight",
                    Number(e.target.value),
                    originalOrder
                  )
                }
              />
            ) : (
              <span>{text}</span>
            );
          },
        },
        {
          title: "Count",
          dataIndex: "count",
          key: "count",
          render: (text) => {
            return (
              <Input
                type="number"
                size="small"
                bordered={false}
                value={text}
                onChange={(e) =>
                  modifyOriginalOrder(
                    "item_count",
                    Number(e.target.value),
                    originalOrder
                  )
                }
              />
            );
          },
        },
        {
          title: "Exchange rate",
          dataIndex: "exchangeRate",
          key: "exchangeRate",
        },
        {
          title: "Postage (AU$)",
          dataIndex: "postage",
          key: "postage",
        },
      ],
    },
  ];

  // fetch item data from store
  const packageWeight = Number(originalOrder.get("package_weight"));

  const itemData = originalOrder
    .get("items")
    .map((item) => ({
      key: item.split("*")[0].trim(),
      item: item.split("*")[0].trim(),
      qty: parseInt(item.split("*")[1].trim()),
      price: null,
      weight: null,
      stock: 0,
      employee: 0,
      subtotalWeight: null,
      cost: null,
      note: "",
    }))
    .toJS();

  const [itemTableData, setItemTableData] = useState([]);

  useEffect(() => {
    setItemTableData(itemData);
  }, [originalOrder]);

  const [totalWeight, setTotalWeight] = useState(0);

  const setEachWeight = (data, index) => {
    data[index]["weight"] = Number(
      (data[index]["subtotalWeight"] / data[index]["qty"]).toFixed(2)
    );
  };

  const addWeight = (data) => {
    var newTotalWeight = 0;
    data.forEach((item) => {
      newTotalWeight += item["subtotalWeight"];
    });
    setTotalWeight(newTotalWeight);
  };

  const calculateCost = (data, index) => {
    data[index]["cost"] = Number(
      (
        (data[index]["price"] +
          (data[index]["weight"] / packageWeight) * postage) *
        exchangeRateInSetting
      ).toFixed(2)
    );
  };

  const handleAutoFill = (index) => {
    const newData = [...itemTableData];
    newData[index]["subtotalWeight"] =
      packageWeight - totalWeight - newData[index]["subtotalWeight"] < 0
        ? 0
        : Number(
            (
              packageWeight -
              totalWeight -
              newData[index]["subtotalWeight"]
            ).toFixed(2)
          );
    setEachWeight(newData, index);
    addWeight(newData);
    calculateCost(newData, index);
    setItemTableData(newData);
  };

  const onInputChange = (key, index) => (e) => {
    const newData = [...itemTableData];
    if (key === "item" || key === "note") {
      newData[index][key] = e.target.value;
    } else {
      newData[index][key] = Number(e.target.value);
    }
    setEachWeight(newData, index);
    addWeight(newData);
    calculateCost(newData, index);
    setItemTableData(newData);
  };

  const handleAdd = () => {
    setItemTableData([
      ...itemTableData,
      {
        key: new Date().toLocaleString(),
        item: null,
        qty: null,
        price: null,
        weight: null,
        stock: 0,
        employee: 0,
        note: "",
        subtotalWeight: null,
      },
    ]);
  };

  // set item columns
  const itemColumns = [
    {
      title: "Item Information",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
          width: "20%",
          render: (text, record, index) => {
            return (
              <TextArea
                bordered={false}
                autoSize
                value={text}
                style={{ padding: "0 0" }}
                onChange={onInputChange("item", index)}
              />
            );
          },
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
          width: "8%",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                bordered={false}
                value={text}
                controls={false}
                style={{ padding: "0 0" }}
                onChange={onInputChange("qty", index)}
              />
            );
          },
        },
        {
          title: "Price / each",
          dataIndex: "price",
          key: "price",
          width: "12%",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                bordered={false}
                min={0}
                size="small"
                value={text}
                prefix="$"
                style={{ padding: "0 0" }}
                onChange={onInputChange("price", index)}
              />
            );
          },
        },
        {
          title: "Weight / each",
          dataIndex: "weight",
          key: "weight",
          width: "1%",
        },
        {
          title: "Stock",
          dataIndex: "stock",
          key: "stock",
          width: "5%",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["employee"]
                }
                value={text}
                bordered={false}
                style={{ padding: "0 0" }}
                onChange={onInputChange("stock", index)}
              />
            );
          },
        },
        {
          title: "Emplyee purchase",
          dataIndex: "employee",
          key: "employee",
          width: "5%",
          render: (text, record, index) => {
            return (
              <Input
                type="number"
                min={0}
                max={
                  itemTableData[index]["qty"] - itemTableData[index]["stock"]
                }
                bordered={false}
                value={text}
                style={{ padding: "0 0" }}
                onChange={onInputChange("employee", index)}
              />
            );
          },
        },
        {
          title: "Subtotal weight",
          dataIndex: "subtotalWeight",
          key: "subtotalWeight",
          width: "10%",
          render: (text, record, index) => {
            return (
              <>
                <Input
                  type="number"
                  min={0}
                  max={packageWeight}
                  value={text}
                  style={{ padding: "0 0" }}
                  bordered={false}
                  onChange={onInputChange("subtotalWeight", index)}
                />
                <Button size="small" onClick={() => handleAutoFill(index)}>
                  Auto Fill
                </Button>
              </>
            );
          },
        },
        {
          title: "Cost / each",
          dataIndex: "cost",
          key: "cost",
          width: "8%",
          render: (text) => {
            return <span>￥{text}</span>;
          },
        },
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          width: "15%",
          render: (text, record, index) => {
            return (
              <TextArea
                value={text}
                autoSize
                bordered={false}
                onChange={onInputChange("note", index)}
              />
            );
          },
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          width: "5%",
          render: (text, record, index) => {
            const handleDelete = () => {
              var newData = [...itemTableData];
              newData = newData.filter(
                (item, itemIndex) => itemIndex !== index
              );
              setItemTableData(newData);
            };
            return (
              <Button size="small" onClick={handleDelete}>
                Delete
              </Button>
            );
          },
        },
      ],
    },
  ];

  // set sold columns
  const soldColumns = [
    {
      title: "Sold items",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
        },
        {
          title: "Cost / each (￥)",
          dataIndex: "cost",
          key: "cost",
        },
      ],
    },
  ];

  // set stock columns
  const stockColumns = [
    {
      title: "Stock items",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
        },
        {
          title: "Cost / each (￥)",
          dataIndex: "cost",
          key: "cost",
        },
      ],
    },
  ];

  // set employee columns
  const employeeColumns = [
    {
      title: "Employee items",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
        },
        {
          title: "Cost / each (￥)",
          dataIndex: "cost",
          key: "cost",
        },
      ],
    },
  ];

  // get review element ref
  const reviewRef = useRef(null);

  // set time to let system get the height of the review element
  const scrollToReview = () =>
    setTimeout(() => {
      reviewRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);

  return (
    <Container>
      <Left>
        <Sidebar selected="order" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Order" cartCount="hide" />

        <OrderContainer>
          <SearchContainer>
            <Input
              placeholder="Please enter the package ID"
              style={{ width: "50%" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => {
                handleSearch(searchInput);
                setTableEditable(false);
              }}
              allowClear
            />
            <StyledButton
              onClick={() => {
                handleSearch(searchInput);
                setTableEditable(false);
              }}
              loading={spinning}
            >
              Search & Fill
            </StyledButton>
            <StyledButton
              onClick={() => setTableEditable(true)}
              loading={spinning}
            >
              Manual input
            </StyledButton>
          </SearchContainer>

          <OrderExistMessage className={showExistMessage ? "" : "hide"}>
            <span
              className="material-symbols-outlined"
              style={{ verticalAlign: "middle", color: "green" }}
            >
              new_releases
            </span>
            <span>
              This order has already been saved. View it at package page:{" "}
              <Link
                to={`/dashboard/package/?pk_id=${searchInput}`}
                target="_blank"
              >
                {searchInput}
              </Link>
            </span>
          </OrderExistMessage>

          <ExchangeRateWrapper
            href="https://www.boc.cn/sourcedb/whpj/"
            className={userRole === "admin" ? "" : "hide"}
          >
            Current exchange rate:{" "}
            <Spin spinning={exchangeRateSpinning} indicator={antIcon} />
            {exchangeRate}
          </ExchangeRateWrapper>

          <Spin spinning={spinning} tip="Loading...">
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                columns={packageColumns}
                dataSource={packageData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>

            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                columns={receiverColumns}
                dataSource={receiverData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={itemColumns}
                dataSource={itemTableData}
                pagination={{ position: ["none", "none"] }}
                bordered
              />
            </TableWrapper>
            <BtnWrapper>
              <Btn onClick={handleAdd}>Add</Btn>
              <StyledButton
                onClick={() => {
                  handleReview({
                    items: itemTableData,
                    package: packageData[0],
                    receiver: receiverData[0]["receiver"],
                  });
                  scrollToReview();
                }}
              >
                Review
              </StyledButton>
            </BtnWrapper>
          </Spin>
          <ReviewContainer ref={reviewRef}>
            <SubmitWrapper className={showReview ? "" : "hide"}>
              <TableWrapper
                className={reviewData["sold"].length === 0 ? "hide" : ""}
              >
                <Table
                  style={{ width: "100%" }}
                  columns={soldColumns}
                  dataSource={reviewData["sold"]}
                  pagination={{ position: ["none", "none"] }}
                  bordered
                  size="small"
                />
              </TableWrapper>
              <TableWrapper
                className={reviewData["stock"].length === 0 ? "hide" : ""}
              >
                <Table
                  style={{ width: "100%" }}
                  columns={stockColumns}
                  dataSource={reviewData["stock"]}
                  pagination={{ position: ["none", "none"] }}
                  bordered
                  size="small"
                />
              </TableWrapper>
              <TableWrapper
                className={reviewData["employee"].length === 0 ? "hide" : ""}
              >
                <Table
                  style={{ width: "100%" }}
                  columns={employeeColumns}
                  dataSource={reviewData["employee"]}
                  pagination={{ position: ["none", "none"] }}
                  bordered
                  size="small"
                />
              </TableWrapper>
              <BtnWrapper>
                <Btn onClick={() => setShowReview(false)}>Back</Btn>
                <StyledButton
                  loading={submitLoading}
                  onClick={() =>
                    handleSubmit(reviewData, packageData[0], receiverData[0])
                  }
                >
                  Submit
                </StyledButton>
              </BtnWrapper>
            </SubmitWrapper>
          </ReviewContainer>
        </OrderContainer>
      </Right>
      <BackTop />

      <Modal
        title={
          submitResult.get("success") ? (
            <span
              className="material-icons-outlined"
              style={{ color: "#18a16d" }}
            >
              thumb_up_off_alt
            </span>
          ) : (
            <span
              className="material-icons-outlined"
              style={{ color: "#DF362D" }}
            >
              error
            </span>
          )
        }
        visible={showSubmitResultDialog}
        okText="Place a new order"
        cancelText="Close"
        style={{ top: "20px" }}
        onOk={() => {
          handleOnOk();
          setSearchInput("");
        }}
        onCancel={() => setShowSubmitResultDialog(false)}
      >
        <p>{submitResult.get("msg")}</p>
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  originalOrder: state.getIn(["order", "originalOrder"]),
  spinning: state.getIn(["order", "spinning"]),
  exchangeRate: state.getIn(["order", "exchangeRate"]),
  exchangeRateSpinning: state.getIn(["order", "exchangeRateSpinning"]),
  submitLoading: state.getIn(["order", "submitLoading"]),
  showReview: state.getIn(["order", "showReview"]),
  reviewData: state.getIn(["order", "reviewData"]).toJS(),
  showSubmitResultDialog: state.getIn(["order", "showSubmitResultDialog"]),
  submitResult: state.getIn(["order", "submitResult"]),
  normalPostage: state.getIn(["order", "normalPostage"]),
  babyFormulaPostage: state.getIn(["order", "babyFormulaPostage"]),
  adultFormula3Postage: state.getIn(["order", "adultFormula3Postage"]),
  adultFormula6Postage: state.getIn(["order", "adultFormula6Postage"]),
  otherItemPostage: state.getIn(["order", "otherItemPostage"]),
  exchangeRateInSetting: state.getIn(["order", "exchangeRateInSetting"]),
  showSidebar: state.getIn(["static", "showSidebar"]),
  showExistMessage: state.getIn(["order", "showExistMessage"]),
  receivers: state.getIn(["order", "receivers"]),
});

const mapDispatch = (dispatch) => ({
  handleSearch(pk_id) {
    if (pk_id.trim().length === 0) {
      message.warning("Input must not be null!");
    } else {
      dispatch(actionCreators.searchAction(pk_id));
    }
  },

  initializeExchangeRate(exchangeRate) {
    if (exchangeRate === "") {
      dispatch(actionCreators.initializeExchangeRateAction);
    }
  },

  handleReview(tableData) {
    dispatch(actionCreators.reviewTableDataAction(tableData));
  },

  handleSubmit(reviewData, packageData, receiverData) {
    dispatch(
      actionCreators.submitAction(reviewData, packageData, receiverData)
    );
  },

  setShowReview(value) {
    dispatch({ type: actionTypes.SHOW_REVIEW, value: fromJS(value) });
  },

  handleOnOk() {
    dispatch({ type: actionTypes.RESET_ORDER_STORE });
    dispatch({
      type: actionTypes.SHOW_SUBMIT_RESULT_DIALOG,
      value: fromJS(false),
    });
    dispatch(actionCreators.initializeSettingsAction);
  },

  setShowSubmitResultDialog(value) {
    dispatch({
      type: actionTypes.SHOW_SUBMIT_RESULT_DIALOG,
      value: fromJS(value),
    });
  },

  initializeSettings() {
    dispatch(actionCreators.initializeSettingsAction);
  },

  modifyOriginalOrder(key, value, originalOrder) {
    dispatch(
      actionCreators.modifyOriginalOrderAction(key, value, originalOrder)
    );
  },

  setReceiverBySelection(receiverIdNameString, receivers) {
    dispatch(
      actionCreators.setReceiverBySelectionAction(
        receiverIdNameString,
        receivers
      )
    );
  },

  getReceivers(receivers) {
    if (receivers == null) {
      dispatch(actionCreators.getReceiversAction);
    }
  },
});

export default connect(mapState, mapDispatch)(OrderPage);
