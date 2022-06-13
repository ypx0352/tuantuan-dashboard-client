import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { Table, Spin, Input } from "antd";
import { actionCreators } from "./store";

const Container = styled.div`
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

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  margin-bottom: 60px;
`;

const StyledInput = styled(Input).attrs({
  placeholder:
    "To search a log, please enter the action, user, package or time.",
})`
  width: 50%;
  ::placeholder {
    color: grey;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogPage = (props) => {
  const { showSidebar, getAllLogs, allLogs, tableSpinning } = props;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getAllLogs();
  }, []);

  useEffect(() => {
    setTableData(allLogs);
  }, [allLogs]);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      filters: [
        { text: "Create order", value: "Create order" },
        { text: "Create transaction", value: "Create transaction" },
        { text: "Transfer", value: "Transfer" },
        { text: "Approve exception", value: "Approve exception" },
        { text: "Approve transaction", value: "Approve transaction" },
        { text: "Login", value: "Login" },
        { text: "Update setting", value: "Update setting" },
        { text: "Register", value: "Register" },
      ],
      onFilter: (value, record) => record.action.indexOf(value) === 0,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      filters: [
        { text: "Pengxiang Yue", value: "Pengxiang Yue" },
        { text: "Yanan Zhang", value: "Yanan Zhang" },
      ],
      onFilter: (value, record) => record.user.indexOf(value) === 0,
    },
    {
      title: "Transaction / package ID",
      dataIndex: "id",
      key: "id",
      render: (text) => {
        return text === "" ? (
          text
        ) : text.length === 11 ? (
          <Link to={`/dashboard/package/?pk_id=${text}`}>{text}</Link>
        ) : (
          <Link to={`/dashboard/transaction/?transaction_id=${text}`}>
            {text}
          </Link>
        );
      },
    },
    { title: "Time", dataIndex: "createdAtLocale", key: "createdAtLocale" },
  ];

  const handleSearch = (searchWord) => {
    if (searchWord.trim() === "") {
      setTableData(allLogs);
    } else {
      const searchPatten = new RegExp(`\W*${searchWord.trim()}\W*`);
      setTableData(
        allLogs.filter(
          (item) =>
            searchPatten.test(item.action) ||
            searchPatten.test(item.user) ||
            searchPatten.test(item.package) ||
            searchPatten.test(item.createdAtLocale)
        )
      );
    }
  };

  return (
    <Container>
      <Left>
        <Sidebar selected="log" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Log" cartCount="hide" />
        <SearchContainer>
          <StyledInput
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            allowClear
          />
        </SearchContainer>
        <ContentWrapper>
          <Spin spinning={tableSpinning} tip="Loading...">
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={tableData}
              rowKey={(record) => record.createdAtLocale}
              bordered
            />
          </Spin>
        </ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
  allLogs: state.getIn(["log", "allLogs"]).toJS(),
  tableSpinning: state.getIn(["log", "tableSpinning"]),
});

const mapDispatch = (dispatch) => ({
  getAllLogs() {
    dispatch(actionCreators.getAllLogsAction);
  },
});

export default connect(mapState, mapDispatch)(LogPage);
