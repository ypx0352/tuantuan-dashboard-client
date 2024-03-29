import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { actionCreators } from "./store";
import { Skeleton, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1200px;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;  
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

const TodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const BlockWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const colors = {
  new: " #145DA0",
  stock: "sandybrown",
  exception: "#DF362D",
  transaction: "#18a16d",
};

const Block = styled.a`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #dfe0eb;
  border-radius: 15px;
  padding: 15px;
  background-color: white;
  cursor: pointer;
  div {
    color: black;
  }
  span {
    color: ${(props) => colors[props.name]};
  }
  :hover {
    border-color: ${(props) => colors[props.name]};
    div {
      color: ${(props) => colors[props.name]};
    }
  }
`;

const BlockTitle = styled.div`
  font-size: 19px;
  font-weight: bold;
`;

const BlockContent = styled.span`
  font-size: 40px;
  font-weight: bold;
  margin-top: 10px;
`;

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkeletonWrapper = styled.div`
  &.hide{
    display: none;
  }
`
const Diagram = styled.div`
  &.hide {
    display: none;
  }
`;

const Chart = styled.div`
  margin: 10px auto;
  border-radius: 15px;
  border: 1px solid #dfe0eb;
  max-width: 1100px;
  overflow: hidden;
`;

const antIcon = (
  <LoadingOutlined style={{ fontSize: 48, color: "#3751ff" }} spin />
);

const sdk = new ChartsEmbedSDK({
  baseUrl: "https://charts.mongodb.com/charts-project-0-ohscc",
});

const qtyofParcelsChart = sdk.createChart({
  chartId: "63209283-2840-42da-888d-8634b99c128f",
  height: "380px",
});

const qtyofItemsChart = sdk.createChart({
  chartId: "6320a0fb-180c-47eb-8dd4-fec7a93566d9",
  height: "380px",
});

const qtyofItemsandParcelsChart = sdk.createChart({
  chartId: "63209fe2-215c-4e5e-86c1-6d5418a02319",
  height: "380px",
});

const productSoldRankingChart = sdk.createChart({
  chartId: "632154a4-57a9-451e-82e7-8db094a90bdd",
  height: "380px",
});

const profitsRankingChart = sdk.createChart({
  chartId: "6321ccad-a053-49e6-8187-3779d0dc23d8",
  height: "600px",
});

const OverviewPage = (props) => {
  const { showSidebar, initializeTodos, todosData, todosSpinning } = props;

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      initializeTodos();
    }
  }, []);

  useEffect(() => {
    qtyofParcelsChart.render(document.getElementById("qtyofParcelsChar"));
    qtyofItemsChart.render(document.getElementById("qtyofItemsChart"));
    qtyofItemsandParcelsChart.render(
      document.getElementById("qtyofItemsandParcelsChart")
    );
    productSoldRankingChart.render(
      document.getElementById("productSoldRankingChart")
    );
    profitsRankingChart.render(document.getElementById("profitsRankingChart"));
  }, []);

  return (
    <Container>
      <Left>
        <Sidebar selected="overview" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Overview" cartCount="hide" />
        <TodoContainer>
          <h2>Todos</h2>
          <BlockWrapper>
            <Block name="new" href="/dashboard/checkout">
              <BlockTitle>New item</BlockTitle>
              {todosSpinning ? (
                <Spin spinning={todosSpinning} indicator={antIcon} />
              ) : (
                <BlockContent>{todosData.newItem.count}</BlockContent>
              )}
            </Block>
            <Block name="stock" href="/dashboard/checkout?type=Stock">
              <BlockTitle>Stock item</BlockTitle>
              {todosSpinning ? (
                <Spin spinning={todosSpinning} indicator={antIcon} />
              ) : (
                <BlockContent>{todosData.stockItem.count}</BlockContent>
              )}
            </Block>
            <Block name="transaction" href="/dashboard/transaction">
              <BlockTitle>Pending transaction</BlockTitle>
              {todosSpinning ? (
                <Spin spinning={todosSpinning} indicator={antIcon} />
              ) : (
                <BlockContent>
                  {todosData.pendingTransaction.count}
                </BlockContent>
              )}
            </Block>
            <Block name="exception" href="/dashboard/checkout?type=Exception">
              <BlockTitle>Pending exception</BlockTitle>
              {todosSpinning ? (
                <Spin spinning={todosSpinning} indicator={antIcon} />
              ) : (
                <BlockContent>{todosData.pendingException.count}</BlockContent>
              )}
            </Block>
          </BlockWrapper>
        </TodoContainer>
        <DiagramContainer>
          <h2>Statistics</h2>
          <SkeletonWrapper className={todosSpinning?"":"hide"}>
            <Skeleton active paragraph={{rows:6}}></Skeleton>
          </SkeletonWrapper>
          <Diagram className={todosSpinning ? "hide" : ""}>
            <Chart>
              <div id="productSoldRankingChart"></div>
            </Chart>
            <Chart>
              <div id="profitsRankingChart"></div>
            </Chart>
            <Chart>
              <div id="qtyofItemsandParcelsChart"></div>
            </Chart>
            <Chart>
              <div id="qtyofParcelsChar"></div>
            </Chart>
            <Chart>
              <div id="qtyofItemsChart"></div>
            </Chart>
          </Diagram>
        </DiagramContainer>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
  todosData: state.getIn(["overview", "todosData"]).toJS(),
  todosSpinning: state.getIn(["overview", "todosSpinning"]),
});

const mapDispatch = (dispatch) => ({
  initializeTodos() {
    dispatch(actionCreators.initializeTodosAction);
  },
});

export default connect(mapState, mapDispatch)(OverviewPage);
