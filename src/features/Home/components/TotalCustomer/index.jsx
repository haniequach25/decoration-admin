import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { Card, Space } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

TotalCustomers.propTypes = {
  total1: PropTypes.number,
  total0: PropTypes.number,
};

TotalCustomers.defaultProps = {
  total1: 0,
  total0: 0,
};

function TotalCustomers(props) {
  const { t } = useTranslation();
  const { total1, total0 } = props;
  return (
    <div>
      <Card
        title={t("layoutAdmin.TotalCustomers")}
        style={{ width: "100%", marginBottom: "50px" }}
      >
        <Space size={20}>
          <p style={{ fontSize: "40px" }} title={"Active customers"}>
            {total1} <SmileOutlined style={{ color: "#82ca9d" }} />
          </p>
          <p style={{ fontSize: "40px" }} title={"Deactive customers"}>
            {total0} <FrownOutlined style={{ color: "#CC0000" }} />
          </p>
        </Space>
      </Card>
    </div>
  );
}

export default TotalCustomers;
