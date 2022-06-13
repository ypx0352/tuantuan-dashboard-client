import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { Table, Badge, Button, Input } from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";

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
  width: auto;
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
  width: 100%;
  padding: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 60px;
`;

const colors = {
  search: "#3751ff",
  sold: "darkgreen",
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
  pending: "#04D4F0",
  completed: "#059DC0",
};

const StyledInput = styled(Input).attrs({
  placeholder: "Enter transaction ID",
})`
  width: 50%;
  height: 50px;
  ::placeholder {
    color: grey;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledSpan = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 10px;
  color: white;
`;

const TransactionPage = (props) => {
  const {
    showSidebar,
    allTransactions,
    initializeAllTransactions,
    tableLoading,
    approveTransaction,
    approvedButtonLoading,
  } = props;

  const userRole = localStorage.getItem("role");
  const [params] = useSearchParams();
  const transaction_idFromUrl = params.get("transaction_id");
  const [searchInput, setSearchInput] = useState(transaction_idFromUrl || "");
  const [tableData, setTableData] = useState();

  useEffect(() => {
    initializeAllTransactions();
  },[]);

  useEffect(() => {
    setTableData(allTransactions);
  }, [allTransactions]);

  useEffect(() => {
    if (transaction_idFromUrl !== null && tableData !== undefined) {
      searchTransaction(transaction_idFromUrl);
    }
  }, [tableLoading]);

  const searchTransaction = (transaction_id) => {
    if (transaction_id.trim() === "") {
      setTableData(allTransactions);
    } else {
      const searchPatten = new RegExp(`\W*${searchInput.trim()}\W*`);
      setTableData(
        tableData.filter((item) => {
          return (
            searchPatten.test(item._id) ||
            searchPatten.test(item.createdAtLocale)
          );
        })
      );
    }
  };

  const mainColumns = [
    {
      title: "Time",
      dataIndex: "createdAtLocale",
      key: "createdAtLocale",
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Subtotal",
      dataIndex: "payAmountToSender",
      key: "payAmountToSender",
      render: (text) => <span>￥{text}</span>,
    },
    {
      title: "Approved",
      dataIndex: "approved",
      key: "approved",
      render: (text, record) => {
        return text ? (
          <span style={{ color: "green" }} className="material-icons-outlined">
            check
          </span>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "red" }} className="material-icons-outlined">
              clear
            </span>
            {userRole === "admin" && (
              <Button
                style={{
                  backgroundColor: "#18a16d",
                  color: "white",
                  borderRadius: "5px",
                  border: "none",
                  marginLeft: "10px",
                }}
                onClick={() => approveTransaction(record._id)}
                loading={approvedButtonLoading}
              >
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const ExpandedTable = (props) => {
    const expandedColumns = [
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
        title: "Type",
        dataIndex: "originalType",
        key: "originalType",
        render: (text) => <StyledSpan type={text}>{text}</StyledSpan>,
      },
      {
        title: "Cost",
        dataIndex: "cost",
        key: "cost",
        render: (text) => <span>￥ {text}</span>,
      },
      {
        title: "Profits",
        dataIndex: "profits",
        key: "profits",
        render: (text) => {
          return typeof text === "undefined" ? (
            <span>——</span>
          ) : (
            <span>￥ {text}</span>
          );
        },
      },
      {
        title: "Price each",
        dataIndex: "price",
        key: "price",
        render: (text) => <span>$ {text}</span>,
      },
      {
        title: "Weight each",
        dataIndex: "weight",
        key: "weight",
        render: (text) => <span>{text} Kg</span>,
      },

      {
        title: "Package",
        dataIndex: "pk_id",
        key: "pk_id",
        render: (text) => (
          <Link to={`/dashboard/package/?pk_id=${text}`} target="_blank">
            {text}
          </Link>
        ),
      },
      {
        title: "Receiver",
        dataIndex: "receiver",
        key: "receiver",
      },
      {
        title: "All profits",
        dataIndex: "returnAllProfits",
        key: "returnAllProfits",
        render: (text) => {
          return text ? (
            <Badge status="success" text="Yes" />
          ) : (
            <Badge status="error" text="No" />
          );
        },
      },
      {
        title: "Customer pay",
        dataIndex: "payAmountFromCustomer",
        key: "payAmountFromCustomer",
        render: (text) => {
          return typeof text === "undefined" ? (
            <span>——</span>
          ) : (
            <span>￥ {text}</span>
          );
        },
      },
      {
        title: "Pay sender",
        dataIndex: "payAmountToSender",
        key: "payAmountToSender",
        render: (text) => <span>￥ {text}</span>,
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
      },
    ];

    return (
      <Table
        style={{ width: "100%" }}
        tableLayout="auto"
        columns={expandedColumns}
        dataSource={props.record.items}
        pagination={false}
        bordered
      />
    );
  };

  return (
    <PageContainer>
      <Left>
        <Sidebar selected="transaction" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Transaction" cartCount="hide" />

        <SearchContainer>
          <StyledInput
            defaultValue={transaction_idFromUrl}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              searchTransaction(e.target.value);
            }}
            allowClear
          />
        </SearchContainer>

        <ContentWrapper>
          <TableWrapper>
            <Table
              style={{ width: "100%" }}
              tableLayout="auto"
              rowKey={(record) => record._id}
              columns={mainColumns}
              expandable={{
                expandedRowRender: (record) => (
                  <ExpandedTable record={record} />
                ),
              }}
              dataSource={tableData}
              bordered
              sticky
              loading={tableLoading}
              scroll={{ x: "100%" }}
            />
          </TableWrapper>
        </ContentWrapper>
      </Right>
    </PageContainer>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
  allTransactions: state.getIn(["transaction", "allTransactions"]).toJS(),
  tableLoading: state.getIn(["transaction", "tableLoading"]),
  approvedButtonLoading: state.getIn(["transaction", "approvedButtonLoading"]),
});

const mapDispatch = (dispatch) => ({
  initializeAllTransactions() {
    dispatch(actionCreators.initializeAllTransactionsAction);
  },
  approveTransaction(transaction_id) {
    dispatch(actionCreators.approveTransactionAction(transaction_id));
  },
});
export default connect(mapState, mapDispatch)(TransactionPage);
