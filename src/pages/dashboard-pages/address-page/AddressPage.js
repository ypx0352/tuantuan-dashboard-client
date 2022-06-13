import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  Table,
  Input,
  Button,
  Form,
  Select,
  Spin,
  Popconfirm,
  Modal,
} from "antd";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import { province, city, area } from "province-city-china/data";
import { actionCreators, actionTypes } from "./store";
import { fromJS } from "immutable";
const { Option } = Select;

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
  flex-direction: column;
  justify-content: center;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const StyledInput = styled(Input).attrs({
  placeholder: "To search an address, please enter the receiver's name",
})`
  width: 50%;
  ::placeholder {
    color: grey;
  }
`;

const colors = {
  search: "#3751ff",
  add: "#18a16d",
  submit: "#145DA0",
  reset: "#DF362D",
  cancel: "#189AB4",
  update: "#145DA0",
};

const StyledButton = styled(Button).attrs((props) => ({
  style: {
    width: "10%",
    "min-width": "65px",
    height: "50px",
    padding: "12px",
    "marginLeft": "10px",
    "borderRadius": "8px",
    border: "none",
    "textAlign": "center",
    "backgroundColor": colors[props.type],
    color: "white",
  },
}))``;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  &.hide {
    display: none;
  }
`;

const AddressPage = (props) => {
  const {
    submitNewAddress,
    onCancel,
    addFormDisplayed,
    displayAddForm,
    initializeAddress,
    allAddress,
    tableSpinning,
    deleteAddress,
    showModal,
    handleShowModal,
    updateAddress,
    showSidebar,
  } = props;

  const [params] = useSearchParams();
  const receiverFromUrl = params.get("receiver");

  const [addressInput, setAddressInput] = useState({});

  const [optionCode, setOptionCode] = useState({});

  const [form] = Form.useForm();

  const [tableData, setTableData] = useState();

  useEffect(() => {
    initializeAddress();
  }, []);

  useEffect(() => {
    setTableData(allAddress);
  }, [allAddress]);

  useEffect(() => {
    if (receiverFromUrl !== null) {
      handleSearch(receiverFromUrl);
    }
  }, [tableSpinning]);

  const onReset = () => {
    form.resetFields();
    setAddressInput({});
  };

  const generateButton = (record, name) => {
    return name === "Update" ? (
      <Button
        size="small"
        type="primary"
        ghost
        style={{ margin: "1px", width: "70px" }}
        onClick={() => {
          setAddressInput(record);
          onCancel();
          handleShowModal(true);
        }}
      >
        {name}
      </Button>
    ) : (
      <Popconfirm
        title={<p>Delete this address?</p>}
        onConfirm={() => deleteAddress(record._id)}
      >
        <Button
          size="small"
          style={{ margin: "1px", width: "70px" }}
          danger
          ghost
        >
          {name}
        </Button>
      </Popconfirm>
    );
  };

  const tableColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Province", dataIndex: "province", key: "province" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "District", dataIndex: "district", key: "district" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Created at", dataIndex: "createdAtLocale", key: "createAt" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => {
        return (
          <>
            <div>{generateButton(record, "Update")}</div>
            <div> {generateButton(record, "Delete")}</div>
          </>
        );
      },
    },
  ];

  const generateOption = (provinceCode, cityCode) => {
    if (provinceCode === undefined) {
      return province.map((item) => (
        <Option value={item.name} provincecode={item.province}>
          {item.name}
        </Option>
      ));
    } else {
      if (cityCode === undefined) {
        switch (provinceCode) {
          case "11":
            return [
              <Option key="北京市" value="北京市" citycode={0}>
                北京市
              </Option>,
            ];
          case "12":
            return [
              <Option key="天津市" value="天津市" citycode={0}>
                天津市
              </Option>,
            ];
          case "31":
            return [
              <Option key="上海市" value="上海市" citycode={0}>
                上海市
              </Option>,
            ];
          case "50":
            return [
              <Option key="重庆市" value="重庆市" citycode={0}>
                重庆市
              </Option>,
            ];
          default:
            const cityPatten = new RegExp(`${provinceCode}[0-9][0-9]00`);
            return city
              .filter((item) => cityPatten.exec(item.code))
              .map((item) => (
                <Option key={item.name} value={item.name} citycode={item.city}>
                  {item.name}
                </Option>
              ));
        }
      } else {
        const districtPatten =
          cityCode === 0
            ? new RegExp(`${provinceCode}01[0-9][0-9]`)
            : new RegExp(`${provinceCode}${cityCode}[0-9][0-9]`);

        return area
          .filter((item) => districtPatten.exec(item.code))
          .map((item) => (
            <Option value={item.name} areacode={item.area}>
              {item.name}
            </Option>
          ));
      }
    }
  };

  const handleInputChange = (entry, value) => {
    switch (entry) {
      case "province":
        setAddressInput({
          ...addressInput,
          province: value,
          city: "",
          district: "",
        });
        break;
      case "city":
        setAddressInput({
          ...addressInput,
          province: addressInput.province,
          city: value,
          district: "",
        });
        break;
      case "district":
        setAddressInput({
          ...addressInput,
          province: addressInput.province,
          city: addressInput.city,
          district: value,
        });
        break;
      default:
        const newData = { ...addressInput };
        newData[entry] = value.trim();
        setAddressInput(newData);
    }
  };

  const generateForm = (record) => {
    form.setFieldsValue(addressInput);

    return (
      <Form
        form={form}
        name="add_new_address"
        labelWrap={false}
        labelAlign="right"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12, offset: 1 }}
        onFinish={
          record === undefined
            ? () => {
                submitNewAddress(addressInput);
                onReset();
              }
            : () => {
                updateAddress(addressInput);
              }
        }
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required." }]}
        >
          <Input onChange={(e) => handleInputChange("name", e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone number is required." }]}
        >
          <Input onChange={(e) => handleInputChange("phone", e.target.value)} />
        </Form.Item>

        <Form.Item label="Area" name="area" wrapperCol={{ offset: 1 }}>
          <h3>
            {addressInput["province"] === undefined
              ? ""
              : addressInput["province"]}{" "}
            {addressInput["city"] === undefined ? "" : addressInput["city"]}{" "}
            {addressInput["district"] === undefined
              ? ""
              : addressInput["district"]}
          </h3>
          <Input.Group compact>
            <Form.Item
              name="province"
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select
                placeholder="Province"
                onChange={(value, option) => {
                  handleInputChange("province", value);
                  setOptionCode({
                    provinceCode: option.provincecode,
                  });
                }}
                showSearch
                style={{ width: "23%" }}
              >
                {generateOption()}
              </Select>
            </Form.Item>
            <Form.Item
              name="city"
              noStyle
              rules={[{ required: true, message: "City is required" }]}
            >
              <Select
                placeholder="City"
                disabled={optionCode.provinceCode === undefined ? true : false}
                onChange={(value, option) => {
                  handleInputChange("city", value);
                  setOptionCode({
                    ...optionCode,
                    cityCode: option.citycode,
                  });
                }}
                showSearch
                style={{ width: "23%" }}
              >
                {generateOption(optionCode.provinceCode)}
              </Select>
            </Form.Item>
            <Form.Item
              name="district"
              noStyle
              rules={[{ required: true, message: "District is required" }]}
            >
              <Select
                placeholder="District"
                onChange={(value) => {
                  handleInputChange("district", value);
                }}
                disabled={
                  optionCode.provinceCode === undefined ||
                  optionCode.cityCode === undefined
                    ? true
                    : false
                }
                showSearch
                style={{ width: "25%" }}
              >
                {generateOption(optionCode.provinceCode, optionCode.cityCode)}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Address is required." }]}
        >
          <Input
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <Input onChange={(e) => handleInputChange("note", e.target.value)} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 10 }}
          hidden={record === undefined ? false : true}
        >
          <StyledButton type="submit" htmlType="submit">
            Submit
          </StyledButton>
          <StyledButton type="reset" htmlType="button" onClick={onReset}>
            Reset
          </StyledButton>
          <StyledButton
            type="cancel"
            htmlType="button"
            onClick={() => {
              onCancel();
              onReset();
            }}
          >
            Cancel
          </StyledButton>
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 11 }}
          hidden={record === undefined ? true : false}
        >
          <StyledButton type="update" htmlType="submit" onClick={onCancel}>
            Update
          </StyledButton>
        </Form.Item>
      </Form>
    );
  };

  const handleSearch = (searchWord) => {
    if (searchWord.trim() === "") {
      setTableData(allAddress);
    } else {
      const searchPatten = new RegExp(`\W*${searchWord.trim()}\W*`);
      setTableData(allAddress.filter((item) => searchPatten.test(item.name)));
    }
  };

  return (
    <Container>
      <Left>
        <Sidebar selected="address" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Address" cartCount="hide" />
        <ContentWrapper>
          <SearchContainer>
            <StyledInput
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={receiverFromUrl}
              allowClear
            />
            <StyledButton
              type="add"
              style={{ background: "#18a16d" }}
              onClick={displayAddForm}
            >
              New address
            </StyledButton>
          </SearchContainer>

          <FormWrapper className={addFormDisplayed ? "" : "hide"}>
            {generateForm()}
          </FormWrapper>
          <Spin spinning={tableSpinning} tip="Loading...">
            <TableWrapper>
              <Table
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={tableColumns}
                rowKey={(record) => record._id}
                dataSource={tableData}
              />
            </TableWrapper>
          </Spin>
        </ContentWrapper>
      </Right>

      <Modal
        visible={showModal}
        onCancel={() => {
          handleShowModal(false);
          onReset();
        }}
        okText="Finish"
        width={"50%"}
        onOk={() => {
          handleShowModal(false);
          onReset();
        }}
      >
        {generateForm(addressInput)}
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  addFormDisplayed: state.getIn(["address", "addFormDisplayed"]),
  allAddress: state.getIn(["address", "allAddress"]).toJS(),
  tableSpinning: state.getIn(["address", "tableSpinning"]),
  showModal: state.getIn(["address", "showModal"]),
  showSidebar: state.getIn(["static", "showSidebar"]),
});

const mapDispatch = (dispatch) => ({
  initializeAddress() {
    dispatch(actionCreators.initializeAddressAction);
  },

  submitNewAddress(address) {
    dispatch(actionCreators.submitNewAddressAction(address));
  },

  onCancel() {
    dispatch({ type: actionTypes.SHOW_ADD_FORM, value: fromJS(false) });
  },

  displayAddForm() {
    dispatch({ type: actionTypes.SHOW_ADD_FORM, value: fromJS(true) });
  },

  deleteAddress(_id) {
    dispatch(actionCreators.deleteAddressAction(_id));
  },

  handleShowModal(value) {
    dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(value) });
  },

  setRecordToBeUpdated(value) {
    dispatch({ type: actionTypes.RECORD_TO_BE_UPDATED, value: fromJS(value) });
  },

  updateAddress(address) {
    dispatch(actionCreators.updateAddressAction(address));
  },
});

export default connect(mapState, mapDispatch)(AddressPage);
