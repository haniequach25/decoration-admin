import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Column } from "@ant-design/charts";
import moment from "moment";
import { getAllOrd } from "features/DonHang/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFilterOrder } from "api/orderApi";
import { format } from "fecha";
import { filter, groupBy } from "lodash";
import { Button, Card, Col, DatePicker, Pagination, Row, Space } from "antd";
import Benefit from "./components/Benefit";
import TodayOrder from "./components/TodayOrder";
import { getAllCus } from "features/KhachHang/customerSlice";
import { useTranslation } from "react-i18next";
import { getAllCatProduct } from "api/categoryProduct";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAllProduct } from "api/productApi";
import TotalOrder from "./components/TotalOrder";
import { getAllCustomer } from "api/customer";
import TotalCustomers from "./components/TotalCustomer";

Home.propTypes = {};

function Home(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const { RangePicker } = DatePicker;
  const [data, setData] = useState([]);

  const [dataTotal, setDataTotal] = useState([]);

  const [categories, setCategories] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([]);

  const [productsPages, setProductsPages] = useState(0);

  const [filterProducts, setFilterProducts] = useState({
    pageNo: 1,
    pageSize: 5,
    sort: "-SoLuong",
  });

  const [pagination, setPagination] = useState({});

  const [analystTotal, setAnalystTotal] = useState("week");

  const customAnalystTotal = (date1, date2) => {
    if (!date1) {
      setData([]);
      return;
    } else {
      let dataFake = [];
      let a = orders?.filter(
        (p) =>
          moment(p.createdAt) > moment(date1[0]) &&
          moment(p.createdAt) < moment(date1[1])
      );
      let days = moment(date1[1]).diff(moment(date1[0]), "days");
      for (var i = days; i >= -1; i--) {
        let a = orders.filter(
          (p) =>
            moment(p.createdAt).format("DD/MM/YYYY") ==
            moment(moment(date1[1]).subtract(i.toString(), "days")).format(
              "DD/MM/YYYY"
            )
        );
        dataFake.push({
          type: moment(moment(date1[1]).subtract(i.toString(), "days")).format(
            "DD/MM"
          ),
          IncompletedOrder: a?.filter((p) => p.TrangThai == 0).length
            ? a
                ?.filter((p) => p.TrangThai == 0)
                .map((p) => p.TongTien)
                .reduce((a, b) => a + b, 0)
            : 0,
          CompletedOrder: a?.filter((p) => p.TrangThai == 1).length
            ? a
                ?.filter((p) => p.TrangThai == 1)
                .map((p) => p.TongTien)
                .reduce((a, b) => a + b, 0)
            : null,
        });
      }
      console.log(dataFake);
      setDataTotal(dataFake);
    }
  };

  useEffect(() => {
    const action = getAllCus();
    dispatch(action);
    async function fetchCate() {
      const cate = await getAllCatProduct();
      setCategories(cate.result.data);
      console.log("cate", cate);
      const products = await getAllProduct();
      var tempCate = [];
      for (var i = 0; i < cate.result.data.length; i++) {
        var SoLuongDaBan = 0;
        for (var j = 0; j < products.result.data.length; j++) {
          if (
            cate.result.data[i].TenDanhMucSP ===
            products.result.data[j].DanhMucSP.TenDanhMucSP
          ) {
            SoLuongDaBan += products.result.data[j].SoLuongDaBan;
          }
        }
        console.log(cate.result.data[i].TenDanhMucSP, SoLuongDaBan);
        tempCate.push({
          TenDanhMucSP: cate.result.data[i].TenDanhMucSP,
          SoLuongDaBan: SoLuongDaBan,
        });
      }
      setCategories(tempCate);
    }
    async function fetchApi() {
      const data = await getFilterOrder();
      setOrders(orders);
      let dataFake = [];
      for (var i = 6; i >= 0; i--) {
        let a = data.data?.filter(
          (p) =>
            moment(p.createdAt).format("DD/MM/YYYY") ==
            moment(moment().subtract(i.toString(), "days")).format("DD/MM/YYYY")
        );
        dataFake.push(a);
      }
      setData(dataFake);
    }
    async function fetchCustomer() {
      const data = await getAllCustomer();
      console.log("customer", data.result.data);
      setCustomers(data.result?.data);
    }
    fetchCate();
    fetchApi();
    fetchCustomer();
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      const data = await getAllProduct(filterProducts);
      console.log("products", data.result);
      setProducts(data.result?.data);
      setProductsPages(data.result?.totalPage);
      setPagination({
        ...pagination,
        totalCount: data.result.totalCount,
      });
    }
    fetchProduct();
  }, [filterProducts]);

  useEffect(() => {
    async function fetchApi() {
      const data = await getFilterOrder();
      setOrders(data.data);
      const totalAmount = data.data
        ?.filter((p) => p.TrangThai == 1)
        .map((p) => p.TongTien)
        .reduce((a, b) => a + b, 0);
      if (totalAmount) setTotal(totalAmount);
      let dataFakeTotal = [];
      if (analystTotal == "week") {
        for (var i = 6; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            IncompletedOrder: a?.filter((p) => p.TrangThai == 0).length
              ? a
                  ?.filter((p) => p.TrangThai == 0)
                  .map((p) => {
                    return p.TongTien;
                  })
                  .reduce((a, b) => a + b, 0)
              : 0,
            CompletedOrder: a?.filter((p) => p.TrangThai == 1).length
              ? a
                  ?.filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : 0,
          });
        }
      } else if (analystTotal == "month") {
        for (var i = 30; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            IncompletedOrder: a.filter((p) => p.TrangThai == 0).length
              ? a
                  .filter((p) => p.TrangThai == 0)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : 0,
            CompletedOrder: a.filter((p) => p.TrangThai == 1).length
              ? a
                  .filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : 0,
          });
        }
      } else if (analystTotal == "year") {
        for (var i = 11; i >= 0; i--) {
          let a = data.data?.filter((p) => {
            return (
              moment(p.createdAt) <
                moment(moment().subtract(i.toString(), "months")) &&
              moment(p.createdAt) >
                moment(moment().subtract((i + 1).toString(), "months"))
            );
          });
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "months")).format(
              "MM/YYYY"
            ),
            IncompletedOrder: a.filter((p) => p.TrangThai == 0).length
              ? a
                  .filter((p) => p.TrangThai == 0)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : 0,
            CompletedOrder: a.filter((p) => p.TrangThai == 1).length
              ? a
                  .filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : 0,
          });
        }
      }
      setDataTotal(dataFakeTotal);
    }
    fetchApi();
  }, [analystTotal]);

  console.log("dataTotal", dataTotal);

  console.log("Product page", productsPages);

  const handleChange = (page) => {
    console.log(page, "number");
    setFilterProducts({
      ...filterProducts,
      pageNo: page,
    });
  };

  return (
    <div>
      <Row style={{ width: "100%" }} gutter={40}>
        <Col xs={24} lg={6}>
          <Benefit total={total} />
        </Col>

        <Col xs={24} lg={6}>
          <TotalCustomers
            total1={customers?.filter((p) => p.TrangThai == true).length}
            total0={customers?.filter((p) => p.TrangThai == false).length}
          />
        </Col>

        <Col xs={24} lg={6}>
          <TotalOrder
            total1={orders?.filter((p) => p.TrangThai == 1).length}
            total0={orders?.filter((p) => p.TrangThai == 0).length}
          />
        </Col>

        <Col xs={24} lg={6}>
          <TodayOrder
            total={
              orders
                ?.filter(
                  (p) =>
                    moment(p.createdAt).format("DD/MM/YYYY") ==
                    moment(moment()).format("DD/MM/YYYY")
                )
                .filter((p) => p.TrangThai == 0).length
            }
          />
        </Col>
      </Row>

      <Card
        title={t("layoutAdmin.AnalystTotal")}
        extra={
          <Space size={5}>
            <Button
              type={analystTotal == "week" && "primary"}
              onClick={() => setAnalystTotal("week")}
            >
              {t("layoutAdmin.Week")}
            </Button>
            <Button
              type={analystTotal == "month" && "primary"}
              onClick={() => setAnalystTotal("month")}
            >
              {t("layoutAdmin.Month")}
            </Button>
            <Button
              type={analystTotal == "year" && "primary"}
              onClick={() => setAnalystTotal("year")}
            >
              {t("layoutAdmin.Year")}
            </Button>
            <Button
              type={analystTotal == "custom" && "primary"}
              onClick={() => setAnalystTotal("custom")}
            >
              {t("layoutAdmin.Custom")}
            </Button>
            <RangePicker
              disabled={analystTotal != "custom"}
              onChange={customAnalystTotal}
            />
          </Space>
        }
      >
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              width={730}
              height={400}
              data={dataTotal}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="CompletedOrder" stroke="#82ca9d" />
              <Line
                type="monotone"
                dataKey="IncompletedOrder"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title={t("layoutAdmin.ProductCategories")}>
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart barSize={50} width={730} height={400} data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="TenDanhMucSP" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="SoLuongDaBan" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title={t("layoutAdmin.RemainingProducts")}>
        <div style={{ width: "100%" }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart barSize={50} width={730} height={400} data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="TenSanPham" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="SoLuong" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <Pagination
            defaultCurrent={1}
            current={filterProducts.pageNo}
            pageSize={5}
            total={pagination.totalCount}
            onChange={handleChange}
            style={{ textAlign: "right" }}
          />
        </div>
      </Card>
    </div>
  );
}

export default Home;
