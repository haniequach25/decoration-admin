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
import { Chart } from "react-charts";

Home.propTypes = {};

function Home(props) {
 

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const { RangePicker } = DatePicker;
  const [data, setData] = useState([]);

  useEffect(() => {
    const action = getAllCus();
    dispatch(action);
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
        dataFake.push(a)
      }
      setData(dataFake)
    }
    fetchApi()
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
      <div style={{ width: '100%' , height: '400px'}}>
        <Chart data={[
      {
        label: "Series 1",
        data: [
          [0, (data[0]?.length || 0)],
          [1, (data[1]?.length || 0)],
          [2, (data[2]?.length || 0)],
          [3, (data[3]?.length || 0)],
          [4, (data[4]?.length || 0)],
          [5, (data[5]?.length || 0)],
          [6, (data[6]?.length || 0)],

        ],
      },
    ]} axes={axes} />
      </div>
    </div>
  );
}

export default Home;
