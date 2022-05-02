import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Column } from "@ant-design/charts";
import moment from "moment";
import { getAllOrd } from "features/DonHang/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFilterOrder } from "api/orderApi";
import { format } from "fecha";
import { groupBy } from "lodash";
import { Button, Card, Col, DatePicker, Row, Space } from "antd";
import Benefit from "./components/Benefit";
import TodayOrder from "./components/TodayOrder";
import { getAllCus } from "features/KhachHang/customerSlice";
import { useTranslation } from "react-i18next";
Home.propTypes = {};

function Home(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const { RangePicker } = DatePicker;
  useEffect(() => {
    const action = getAllCus();
    dispatch(action);
  }, []);
  return (
    <div>
      <Row style={{ width: "100%" }} gutter={40}>
        <Col xs={24} lg={12}>
          <Benefit total={total} />
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

    </div>
  );
}

export default Home;
