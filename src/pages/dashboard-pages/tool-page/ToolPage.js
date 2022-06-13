import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import bigDecimal from "js-big-decimal";

import styled from "styled-components";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { Table, Input, Radio, Badge, message, Button } from "antd";
import { actionCreators as settingActionCreators } from "../setting-page/store";

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

const CostCalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  &.hide {
    display: none;
  }
`;

const ToolPage = (props) => {
  const { showSidebar, getSettings, settingValueFetched, settings } = props;
  const [costData, setCostData] = useState([
    { extraPostageAU: 0, domesticPostage: 0 },
  ]);

  useEffect(() => {
    getSettings();
  });

  const typeOptions = [
    { label: "Normal item", value: "normalPostage" },
    { label: "Baby formula", value: "babyFormulaPostage" },
  ];

  const handleInput = (record, target, value) => {
    record[target] = value;
    setCostData([record]);
  };

  const calculateCost = (record) => {
    try {
      if (!settingValueFetched) {
        return message.warn(
          "Failed to get exchange and postage rate. Refresh the page."
        );
      }
      if (record.price && record.qty && record.type) {
        const { price, qty, weight, type, extraPostageAU, domesticPostage } =
          record;
        var cost = 0;
        if (type === "babyFormulaPostage") {
          cost =
            ((price + settings[type].value / 3) * qty + extraPostageAU) *
              settings.exchangeRateInSetting.value +
            domesticPostage;
        } else {
          if (weight) {
            cost =
              ((price + weight * settings[type].value) * qty + extraPostageAU) *
                settings.exchangeRateInSetting.value +
              domesticPostage;
          } else {
            message.warn("Incompleted input.");
          }
        }
        const roundedPrettyCost = new bigDecimal(
          cost.toFixed(2)
        ).getPrettyValue();
        record.cost = roundedPrettyCost;
        setCostData([record]);
      } else {
        message.warn("Incompleted input.");
      }
    } catch (error) {
      console.log(error);
      message.warn("Oops, something wrong.");
    }
  };

  const clearRecord = () => {
    setCostData([{ extraPostageAU: 0, domesticPostage: 0 }]);
  };

  const costColumns = [
    {
      title: "Cost calculator",
      children: [
        {
          title: "Price / unit",
          key: "price",
          dataIndex: "price",
          render: (text, record) => {
            return (
              <Input
                value={text}
                type="number"
                suffix="AUD"
                min={0}
                onChange={(e) =>
                  handleInput(record, "price", Number(e.target.value))
                }
              />
            );
          },
        },
        {
          title: "Qty",
          key: "qty",
          dataIndex: "qty",
          render: (text, record) => (
            <Input
              value={text}
              type="number"
              min={0}
              onChange={(e) =>
                handleInput(record, "qty", Number(e.target.value))
              }
            />
          ),
        },
        {
          title: "Type",
          key: "type",
          dataIndex: "type",
          render: (text, record) => (
            <Radio.Group
              value={text}
              options={typeOptions}
              optionType="button"
              buttonStyle="solid"
              size="small"
              onChange={({ target: { value } }) =>
                handleInput(record, "type", value)
              }
            />
          ),
        },
        {
          title: "Weight / unit",
          key: "weight",
          dataIndex: "weight",
          render: (text, record) => (
            <Input
              disabled={record.type === "babyFormulaPostage" ? true : false}
              value={text}
              type="number"
              suffix="Kg"
              min={0}
              onChange={(e) =>
                handleInput(record, "weight", Number(e.target.value))
              }
            />
          ),
        },

        {
          title: "Extra postage in AU",
          key: "extraPostageAU",
          dataIndex: "extraPostageAU",
          render: (text, record) => (
            <Input
              value={text}
              type="number"
              suffix="AUD"
              min={0}
              defaultValue={0}
              onChange={(e) =>
                handleInput(record, "extraPostageAU", Number(e.target.value))
              }
            />
          ),
        },
        {
          title: "Domestic postage",
          key: "domesticPostage",
          dataIndex: "domesticPostage",
          render: (text, record) => (
            <Input
              value={text}
              type="number"
              suffix="RMB"
              min={0}
              defaultValue={0}
              onChange={(e) =>
                handleInput(record, "domesticPostage", Number(e.target.value))
              }
            />
          ),
        },
        {
          title: "Action",
          key: "action",
          dataIndex: "action",
          render: (text, record) => {
            return (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => calculateCost(record)}
                >
                  Calculate
                </Button>
                <Button size="small" onClick={() => clearRecord(record)}>
                  Clear
                </Button>
              </>
            );
          },
        },
        {
          title: "Subtotal",
          key: "cost",
          dataIndex: "cost",
          render: (text) => (
            <span style={{ fontWeight: "bold", color: "green" }}>
              ￥ {text}
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <PageContainer>
      <Left>
        <Sidebar selected="tool" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Tool" cartCount="hide" />
        <ContentWrapper>
          <CostCalculatorContainer>
            <h2>Cost Calculator</h2>
            <TableWrapper>
              <Badge.Ribbon
                text={
                  settingValueFetched
                    ? "Latest exchange and postage rate"
                    : "Failed to fetch exchange and postage rate"
                }
                color={settingValueFetched ? "green" : "red"}
              >
                <Table
                  styled={{ width: "100px" }}
                  tableLayout="auto"
                  columns={costColumns}
                  dataSource={costData}
                  pagination={{ position: ["none", "none"] }}
                  bordered
                />
              </Badge.Ribbon>
            </TableWrapper>
          </CostCalculatorContainer>
        </ContentWrapper>
      </Right>
    </PageContainer>
  );
};

const mapState = (state) => ({
  showSidebar: state.getIn(["static", "showSidebar"]),
  settingValueFetched: state.getIn(["tool", "settingValueFetched"]),
  settings: state.getIn(["setting", "settings"]).toJS(),
});

const mapDispatch = (dispatch) => ({
  getSettings() {
    dispatch(settingActionCreators.getSettingsAction);
  },
});

export default connect(mapState, mapDispatch)(ToolPage);
