import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { InputNumber, message, Card, Tooltip, Popconfirm } from "antd";
import { EditOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { actionCreators } from "./store";
import currencyImg from "../../../image/exchange.png";
import babyFormulaImg from "../../../image/babyFormula.avif";
import normalItemImg from "../../../image/normalItem.png";
const { Meta } = Card;

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

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SettingPage = (props) => {
  const { getSettings, settings, updateSetting, showSidebar, updateSpinning } =
    props;

  const [showPopConfirm, setShowPopConfirm] = useState({
    normalPostage: false,
    babyFormulaPostage: false,
    exchangeRateInSetting: false,
  });

  const [settingsInput, setSettingsInput] = useState({});

  useEffect(() => getSettings(), []);

  // Close popConfirm when updates successfully
  useEffect(() => {
    if (!updateSpinning) {
      setShowPopConfirm({
        normalPostage: false,
        babyFormulaPostage: false,
        exchangeRateInSetting: false,
      });
    }
  }, [updateSpinning]);

  const handleInput = (name) => (e) => {
    setSettingsInput({ [name]: e });
  };

  const handleShowPopConfirm = (name, value) => {
    // Reset the state to close opened pop (in case)
    setShowPopConfirm({
      normalPostage: false,
      babyFormulaPostage: false,
      exchangeRateInSetting: false,
    });
    setShowPopConfirm((prevState) => ({ ...prevState, [name]: value }));
  };

  const imgs = [normalItemImg, babyFormulaImg, currencyImg];
  const descriptions = [
    "Normal item postage per Kg",
    "Baby formula postage per 3 cans",
    "Exchange rate AUD/RMB",
  ];

  const generateCard = (settings) => {
    const settingsInArray = Object.entries(settings);
    return settingsInArray.map((item, index) => {
      const propertyName = item[0];
      const attribute = item[1];
      return (
        <Card
          style={{
            width: "300px",
            margin: "0 20px",
          }}
          cover={
            <img
              alt={propertyName}
              src={imgs[index]}
              style={{ height: "132px" }}
            />
          }
          actions={[
            <Popconfirm
              title={
                <>
                  <h5>Update settings</h5>
                  <InputNumber
                    style={{ width: "150px" }}
                    placeholder="New value"
                    onChange={handleInput(propertyName)}
                  />
                </>
              }
              placement="bottom"
              visible={showPopConfirm[propertyName]}
              onCancel={() => handleShowPopConfirm(propertyName, false)}
              onConfirm={() =>
                updateSetting(propertyName, settingsInput[propertyName])
              }
              okButtonProps={{ loading: updateSpinning }}
              okText="Update"
            >
              <EditOutlined
                key="edit"
                onClick={() => {
                  handleShowPopConfirm(propertyName, true);
                }}
              />
            </Popconfirm>,
            <Tooltip placement="top" title={attribute.updatedAtLocale}>
              <FieldTimeOutlined key="update" />
            </Tooltip>,
          ]}
        >
          <Meta
            title={
              propertyName === "exchangeRateInSetting"
                ? attribute.value
                : attribute.value + " AUD"
            }
            description={descriptions[index]}
          />
        </Card>
      );
    });
  };

  return (
    <Container>
      <Left>
        <Sidebar selected="settings" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Settings" cartCount="hide" />
        <ContentWrapper>{generateCard(settings)}</ContentWrapper>
      </Right>
    </Container>
  );
};

const mapState = (state) => ({
  settings: state.getIn(["setting", "settings"]).toJS(),
  showSidebar: state.getIn(["static", "showSidebar"]),
  updateSpinning: state.getIn(["setting", "updateSpinning"]),
});

const mapDispatch = (dispatch) => ({
  getSettings() {
    dispatch(actionCreators.getSettingsAction);
  },

  updateSetting(name, value) {
    if (value === undefined) {
      message.warn("Error! Input must not be empty.");
    } else {
      dispatch(actionCreators.updateSettingAction(name, value));
    }
  },
});

export default connect(mapState, mapDispatch)(SettingPage);
