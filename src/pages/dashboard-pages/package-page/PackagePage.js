import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Document, Page, pdfjs } from "react-pdf";
import { useSearchParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import Sidebar from "../static/Sidebar";
import Header from "../static/Header";
import {
  Button,
  Input,
  Table,
  Steps,
  Spin,
  message,
  Select,
  Badge,
  Modal,
} from "antd";
import { actionCreators, actionTypes } from "./store";
import { updateNoteAction } from "../static/store/actionCreators";
import { fromJS } from "immutable";
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

const Container = styled.div`
  display: flex;
  min-width: 1200px;
  min-height: 100vh;
  background-color: #f7f8fc;
  font-family: "Mulish", sans-serif;  
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
  // padding: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 60px;
`;

const StyledInput = styled(Input).attrs({
  placeholder: "Please enter package ID",
})`
  width: 50%;
  ::placeholder {
    color: grey;
  }
`;

const PackageTagContainer = styled.div`
  width: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 20px 50px;
  justify-content: center;
`;

const PackageTagHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PackageTagWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 100px);
  grid-template-rows: repeat(3, 70px);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  box-sizing: border-box;
`;

const colors = {
  search: "#3751ff",
  sold: "darkgreen",
  stock: "sandybrown",
  employee: "#18a16d",
  exception: "#DF362D",
  pending: "#04D4F0",
  completed: "#059DC0",
  奶粉: "#E8B4B8",
  非奶粉: "#189AB4",
  蓝胖子3: "#154c79",
  蓝胖子6: "#154c79",
  其他: "#eab676",
};

const StyledButton = styled(Button)`
  width: 10%;
  min-width: 65px;
  height: 50px;
  padding: 12px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background-color: ${(props) => colors[props.type]};
  color: white;
  :hover {
    background-color: ${(props) => colors[props.type]};
    color: white;
  }
  :focus {
    background-color: ${(props) => colors[props.type]};
    color: white;
  }
`;

const StyledSpan = styled.span.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 10px;
  color: white;
`;

const PackageTag = styled.div.attrs((props) => ({
  style: { backgroundColor: colors[`${props.type}`] },
}))`
  color: white;
  border-radius: 8px;
  padding: 0 5px;
  //margin: 10px;
  min-width: 105px;
  height: 50px;
  cursor: pointer;
`;

const LegendWrapper = styled.div`
  display: flex;  
  justify-content: center;
  margin-top:20px;
  margin-bottom:20px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 1070px;
  &.hide {
    visibility: hidden;
  }
`;

const PdfWrapper = styled.div`
  .react-pdf__Page__canvas {
    margin: 0 auto;
    width: 80% !important;
    height: 100% !important;
  }
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  &.hide {
    display: none;
  }
`;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PackagePage = (props) => {
  const {
    searchPackage,
    tableData,
    tablesDisplayed,
    tableSpinning,
    getLatestPackages,
    latestPackagesSpinning,
    latestPackages,
    showSidebar,
    updateNote,
    getPostSlip,
    pdfLoading,
    pdfFile,
    showModal,
    setShowModal,
  } = props;

  const [params] = useSearchParams();
  const pk_idFromUrl = params.get("pk_id");

  const [searchInput, setSearchInput] = useState(pk_idFromUrl || "");
  const [tableDataState, setTableDataState] = useState({});

  useEffect(() => {
    getLatestPackages("10");
  }, []);

  useEffect(() => {
    setTableDataState(tableData);
  }, [tableData]);

  useEffect(() => {
    if (pk_idFromUrl !== null) {
      searchPackage(pk_idFromUrl);
    }
  }, [pk_idFromUrl]);

  const packageColumns = [
    {
      title: "Package Information",
      children: [
        {
          title: "ID",
          dataIndex: "pk_id",
          key: "pk_id",
        },
        {
          title: "Send time (ACST)",
          dataIndex: "sendTimeACST",
          key: "sendTimeACST",
        },
        { title: "Status", dataIndex: "status", key: "status" },
        {
          title: "Domestic courier",
          dataIndex: "domesticCourier",
          key: "domesticCourier",
        },
        {
          title: "Domestic parcel ID",
          dataIndex: "domesticParcelID",
          key: "domesticParcelID",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          width: "15%",
        },
        {
          title: "Weight",
          dataIndex: "weight",
          key: "weight",
          render: (text) => text + " Kg",
        },
        {
          title: "Count",
          dataIndex: "count",
          key: "count",
        },
        {
          title: "Exchange rate",
          dataIndex: "exchangeRate",
          key: "exchangeRate",
        },
        {
          title: "Postage",
          dataIndex: "postage",
          key: "postage",
          render: (text) => "$ " + text,
        },
        {
          title: "Post slip",
          dataIndex: "postSlip",
          key: "postSlip",
          render: (text, record) => (
            <Button
              disabled={
                tableDataState.packageData[0].type == "蓝胖子3" ||
                tableDataState.packageData[0].type == "蓝胖子6"
                  ? true
                  : false
              }
              loading={pdfLoading}
              type="primary"
              size="small"
              onClick={() => {
                getPostSlip(record.pk_id);
              }}
            >
              View
            </Button>
          ),
        },
      ],
    },
  ];

  const receiverColumns = [
    {
      title: "Receiver Information",
      children: [
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver",
        },
        {
          title: "Phone",
          dataIndex: "phone",
          key: "phone",
          render: (text) => "+86 " + text,
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
        },
      ],
    },
  ];

  const itemColumns = [
    {
      title: "Item Information",
      children: [
        {
          title: "Item",
          dataIndex: "item",
          key: "item",
          width: "20%",
          render: (text) => <TextArea bordered={false} autoSize value={text} />,
        },
        {
          title: "Qty",
          dataIndex: "qty",
          key: "qty",
          width: "10%",
        },
        {
          title: "Qty in cart",
          dataIndex: "qty_in_cart",
          key: "qty_in_cart",
          width: "10%",
        },
        {
          title: "Price / each",
          dataIndex: "price",
          key: "price",
          render: (text) => "$ " + text,
        },
        {
          title: "Weight / each",
          dataIndex: "weight",
          key: "weight",
          render: (text) => text + " Kg",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          render: (text) => <StyledSpan type={text}>{text}</StyledSpan>,
        },
        {
          title: "Cost / each (Total cost for paid item)",
          dataIndex: "cost",
          key: "cost",
          render: (text) => "￥ " + text,
        },
        {
          title: "Transaction",
          dataIndex: "transaction_id",
          key: "transaction_id",
          render: (text, record) =>
            text === undefined ? (
              <Badge status="error" text="Unpaid" />
            ) : record.transactionApproved ? (
              <>
                <Badge status="success" text="Completed" />
                <p>
                  <Link
                    to={`/dashboard/transaction/?transaction_id=${record.transaction_id}`}
                    target="_blank"
                  >
                    {record.transaction_id}
                  </Link>
                </p>
              </>
            ) : (
              <>
                <Badge status="warning" text="Pending" />
                <p>
                  <Link
                    to={`/dashboard/transaction/?transaction_id=${record.transaction_id}`}
                    target="_blank"
                  >
                    {record.transaction_id}
                  </Link>
                </p>
              </>
            ),
        },
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          render: (text, record) => {
            return (
              <TextArea
                defaultValue={text}
                autoSize
                bordered={false}
                onChange={(e) => {
                  record.newNote = e.target.value.trim();
                }}
                onBlur={() => {
                  const { newNote, note, type, _id } = record;
                  updateNote({ newNote, note, type, _id });
                }}
              />
            );
          },
        },
      ],
    },
  ];

  const generateStep = () => {
    return tableDataState?.trackData?.length === 0 ? (
      <span>Loading...</span>
    ) : (
      <Steps
        current={tableDataState.trackData?.length - 1}
        direction="vertical"
        size="small"
      >
        {tableDataState.trackData?.map((item) => (
          <Step
            key={item.message}
            title={item.message}
            description={item.time}
          />
        ))}
      </Steps>
    );
  };

  const generatePackageTag = () => {
    return latestPackages.map((item) => (
      <PackageTag
        key={item.pk_id}
        type={item.type}
        onClick={() => {
          searchPackage(item.pk_id);
          setSearchInput(item.pk_id);
        }}
      >
        {item.pk_id} {item.receiver} {item.sendDateInADL}
      </PackageTag>
    ));
  };

  return (
    <Container>
      <Left>
        <Sidebar selected="package" />
      </Left>
      <Right className={showSidebar ? "" : "expand"}>
        <Header title="Package" cartCount="hide" />
        <ContentWrapper>
          <SearchContainer>
            <StyledInput
              defaultValue={pk_idFromUrl}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => searchPackage(searchInput)}
              allowClear
            />
            <StyledButton
              type="search"
              onClick={() => searchPackage(searchInput)}
              loading={tableSpinning}
            >
              Search
            </StyledButton>
          </SearchContainer>
          <Spin spinning={latestPackagesSpinning} tip="Loading...">
            <PackageTagContainer>
              <PackageTagHeaderWrapper>
                <>
                  <h3>Recently added packages</h3>
                  <Select
                    defaultValue={10}
                    onChange={(e) => getLatestPackages(e)}
                  >
                    <Option key="10" value="10">
                      10
                    </Option>
                    <Option key="20" value="20">
                      20
                    </Option>
                    <Option key="30" value="30">
                      30
                    </Option>
                  </Select>{" "}                  
                </>
                <LegendWrapper>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#E8B4B8" }}
                  >
                    blur_on
                  </span>
                  <span>Baby Formulas</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#189AB4" }}
                  >
                    blur_on
                  </span>
                  <span>Regular</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#154c79" }}
                  >
                    blur_on
                  </span>
                  <span>Adult formulas</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#eab676" }}
                  >
                    blur_on
                  </span>
                  <span>Other</span>
                </LegendWrapper>
              </PackageTagHeaderWrapper>

              <PackageTagWrapper>{generatePackageTag()}</PackageTagWrapper>
            </PackageTagContainer>
          </Spin>
          <Spin spinning={tableSpinning} tip="Loading...">
            <TableWrapper
              key="package"
              className={tablesDisplayed ? "" : "hide"}
            >
              <Table
                key="packageTable"
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={packageColumns}
                rowKey={(record) => record.id}
                dataSource={tableDataState.packageData}
                pagination={false}
                bordered
              />
            </TableWrapper>
            <TableWrapper
              key="receiver"
              className={tablesDisplayed ? "" : "hide"}
            >
              <Table
                key="receiverTable"
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={receiverColumns}
                rowKey={(record) => record.receiver}
                dataSource={tableDataState.receiverData}
                pagination={false}
                bordered
              />
            </TableWrapper>
            <TableWrapper key="item" className={tablesDisplayed ? "" : "hide"}>
              <Table
                key="itemTable"
                style={{ width: "100%" }}
                tableLayout="auto"
                columns={itemColumns}
                rowKey={(record) => record._id}
                dataSource={tableDataState.itemData}
                bordered
              />
            </TableWrapper>
            <StepWrapper className={tablesDisplayed ? "" : "hide"}>
              <h3>Parcel Track (Local time)</h3>
              {generateStep()}
            </StepWrapper>
          </Spin>
        </ContentWrapper>
      </Right>

      <Modal
        title="Post slip"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <PdfWrapper>
          <Document file={pdfFile}>
            <Page pageNumber={1} scale={2} />
          </Document>
        </PdfWrapper>
      </Modal>
    </Container>
  );
};

const mapState = (state) => ({
  tableData: state.getIn(["package", "tableData"]).toJS(),
  tablesDisplayed: state.getIn(["package", "tablesDisplayed"]),
  tableSpinning: state.getIn(["package", "tableSpinning"]),
  latestPackagesSpinning: state.getIn(["package", "latestPackagesSpinning"]),
  latestPackages: state.getIn(["package", "latestPackages"]).toJS(),
  showSidebar: state.getIn(["static", "showSidebar"]),
  pdfLoading: state.getIn(["package", "pdfLoading"]),
  pdfFile: state.getIn(["package", "pdfFile"]),
  showModal: state.getIn(["package", "showModal"]),
});

const mapDispatch = (dispatch) => ({
  searchPackage(pk_id) {
    if (pk_id.trim() === "") {
      return message.warn("Input must not be null.");
    }
    dispatch(actionCreators.searchPackageAction(pk_id.trim()));
  },
  getLatestPackages(limit) {
    dispatch(actionCreators.getLatestPackagesAction(limit));
  },
  updateNote(info) {
    dispatch(updateNoteAction(info));
  },
  getPostSlip(pk_id) {
    dispatch(actionCreators.getPostSlipAction(pk_id));
  },
  setShowModal(value) {
    dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(value) });
  },
});

export default connect(mapState, mapDispatch)(PackagePage);
