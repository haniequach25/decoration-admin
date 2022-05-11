import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Card, Space } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

TotalOrder.propTypes = {
  total1: PropTypes.number,
  total0: PropTypes.number,
};

TotalOrder.defaultProps = {
  total1: 0,
  total0: 0,
};

function TotalOrder(props) {
  const { t } = useTranslation();
  const { total1, total0 } = props;
  return (
    <div>
      <Card
        title={t("layoutAdmin.TotalOrders")}
        style={{ width: "100%", marginBottom: "50px" }}
      >
        <Space size={20}>
          <p style={{ fontSize: "40px" }} title={"Completed orders"}>
            {total1} <CheckCircleOutlined style={{ color: "#82ca9d" }} />
          </p>
          <p style={{ fontSize: "40px" }} title={"uncompleted orders"}>
            {total0} <ClockCircleOutlined style={{ color: "#8884d8" }} />
          </p>
        </Space>
      </Card>
    </div>
  );
}

export default TotalOrder;
