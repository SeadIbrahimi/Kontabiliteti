import React, { useEffect, useState } from "react";
import { filterIcon } from "../assets/exportIcons";
import { DatePicker, Form, Image, Input, Select, Row, Col } from "antd";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/sq";
import { httpService } from "../services/httpservice.service";

dayjs.locale("sq");

const albanianLocale = {
  lang: {
    locale: "sq",
    monthFormat: "MMMM",
    placeholder: "Zgjidh muajin",
    yearPlaceholder: "Zgjidh vitin",
    monthPlaceholder: "Zgjidh muajin",
  },
};

const currentRoleName = localStorage.getItem("roleName");

const Filters = ({ setFilters }) => {
  const [showFilters, setShowFilters] = useState(true);
  const [businesses, setBusinesses] = useState([]);

  const handleFilterChange = (changedValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...changedValues,
    }));
  };

  useEffect(() => {
    httpService.get(`/api/businesses?ignorePagination=true`, (response) => {
      setBusinesses(
        response?.data.map((item) => ({
          value: item.id,
          label: item.name,
        })) || []
      );
    });
  }, []);

  return (
    <div className="border border-gray-200 rounded-md p-5 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Image src={filterIcon} alt="filter icon" />
        <h3 className="text-lg font-semibold">Filtrat</h3>
      </div>

      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item name="search" className="my-5">
              <Input
                suffix={<SearchOutlined />}
                onChange={(e) => {
                  e.preventDefault();
                  handleFilterChange({ Search: e.target.value });
                }}
                placeholder="Kërko sipas emrit të dokumentit..."
              />
            </Form.Item>
            <div
              className=" text-gray-500 cursor-pointer select-none text-right"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <div className="flex items-center gap-1 justify-end">
                  Largo filtrat
                  <UpOutlined />
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-end">
                  Shfaq më shumë filtra
                  <DownOutlined />
                </div>
              )}
            </div>
          </Col>

          {showFilters && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="month" label="Muaji">
                  <DatePicker
                    defaultValue={dayjs()}
                    onChange={(date) => {
                      handleFilterChange({ month: date });
                    }}
                    picker="month"
                    format="MMMM"
                    locale={albanianLocale}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Viti">
                  <DatePicker
                    onChange={(date) => {
                      handleFilterChange({ year: date });
                    }}
                    defaultValue={dayjs()}
                    picker="year"
                    locale={albanianLocale}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {(currentRoleName === "System Admin" ||
                currentRoleName === "Accountant") && (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="BusinessId" label="Klienti">
                    <Select
                      onChange={(value) => {
                        handleFilterChange({ BusinessId: value || null });
                      }}
                      placeholder="Zgjidh klientin"
                      options={businesses}
                      allowClear
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )}
            </>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default Filters;
