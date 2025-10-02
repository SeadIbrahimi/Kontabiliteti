import React, { useEffect, useState } from "react";
import { Button, message, Pagination, Tooltip, Popconfirm } from "antd";
import { ShopOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { MdOutlineRemoveRedEye, MdDeleteOutline, MdEdit } from "react-icons/md";

import { httpService } from "../services/httpservice.service";
import BusinessDetails from "./BusinessDetails";
import { FaChevronDown } from "react-icons/fa";

const BusinessesList = () => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "edit" | "preview"

  const buildQueryParams = () => {
    const queryParams = {
      ...(filters ? filters : {}),
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };

    Object.keys(queryParams).forEach((key) => {
      if (
        queryParams[key] === null ||
        queryParams[key] === "" ||
        queryParams[key] === false
      ) {
        delete queryParams[key];
      }
    });

    return new URLSearchParams(queryParams).toString();
  };

  useEffect(() => {
    if (mode) return; // don’t fetch while editing/previewing
    setLoading(true);
    const queryString = buildQueryParams();

    httpService.get(
      `/api/businesses?${queryString}`,
      (response) => {
        setBusinesses(response?.data || []);
        const metaData = response?.metaData;
        const { pageNumber, pageSize, totalItemCount } = metaData;
        setPagination({
          pageNumber,
          pageSize,
          total: totalItemCount,
        });
        setLoading(false);
      },
      () => {
        message.error("Diçka shkoi keq, ju lutem provoni përseri!");
        setLoading(false);
      }
    );
  }, [filters, pagination.pageNumber, pagination.pageSize, mode]);

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: page,
      pageSize: pageSize,
    }));
  };

  const handleDelete = (id) => {
    httpService.delete(
      `/api/businesses/${id}`,
      () => {
        message.success("Biznesi u fshi me sukses!");
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
      },
      () => {
        message.error("Fshirja dështoi, provoni përsëri!");
      }
    );
  };

  if (mode) {
    return (
      <BusinessDetails
        mode={mode}
        business={selectedBusiness}
        onBack={() => {
          setMode(null);
          setSelectedBusiness(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex flex-col gap-4 border !border-gray-300 p-5 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          {pagination.total > 0 ? (
            <p className="flex gap-2">
              <span className="font-semibold">Total:</span>
              {pagination.total === 1
                ? "1 Biznes"
                : pagination.total + " Biznese"}
            </p>
          ) : (
            <span />
          )}
          <Button
            type="primary"
            className="!bg-gray-600 hover:bg-gray-800"
            onClick={() => setMode("add")}
          >
            Shto Biznes
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : businesses?.length > 0 ? (
          businesses.map((business) => (
            <div
              key={business.id}
              className="border !border-gray-200 py-3 px-5 rounded-lg flex justify-between items-center bg-white shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="bg-green-100 text-green-600 rounded-full p-3">
                  <ShopOutlined style={{ fontSize: "24px" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="ms-3 font-semibold text-md text-gray-800">
                    {business.name || "Pa emër"}
                  </h2>
                  <div className="flex flex-col text-sm text-gray-600">
                    <span>
                      <MailOutlined className="mr-2" />
                      {business.email || "Pa email"}
                    </span>
                    <span>
                      <PhoneOutlined className="mr-2" />
                      {business.phoneNumber || "Pa telefon"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Tooltip title="Njesitë e biznesit">
                  <Button
                    type="text"
                    icon={<FaChevronDown size={18} />}
                    onClick={() => {
                      setSelectedBusiness(business);
                      setMode("preview");
                    }}
                  />
                </Tooltip>
                <Tooltip title="Shfaq">
                  <Button
                    type="text"
                    icon={<MdOutlineRemoveRedEye size={18} />}
                    onClick={() => {
                      setSelectedBusiness(business);
                      setMode("preview");
                    }}
                  />
                </Tooltip>
                <Tooltip title="Edito">
                  <Button
                    type="text"
                    icon={<MdEdit size={18} />}
                    onClick={() => {
                      setSelectedBusiness(business);
                      setMode("edit");
                    }}
                  />
                </Tooltip>
                <Tooltip title="Fshij">
                  <Popconfirm
                    title="Jeni të sigurt që doni ta fshini?"
                    onConfirm={() => handleDelete(business.id)}
                    okText="Po"
                    cancelText="Jo"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<MdDeleteOutline size={18} />}
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
              {/* {business?.} */}
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-4 items-center text-gray-400 font-semibold">
            <ShopOutlined style={{ fontSize: "48px" }} />
            Nuk ka biznese
          </div>
        )}

        {businesses?.length > 0 && (
          <Pagination
            align="center"
            current={pagination.pageNumber}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessesList;
