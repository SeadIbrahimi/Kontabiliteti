import React, { useState } from "react";
import DocumentTypes from "../enums/DocumentCategoryEnum";
import DocumentList from "./DocumentList";
import { Tabs } from "antd";
import Filters from "./Filters";

const DocumentTypeTabs = () => {
  const [filters, setFilters] = useState({
    Search: "",
    IgnorePagination: false,
    PaymentMethod: null,
    Category: 1,
    BusinessId: null,
    month: null,
    year: null,
  });

  const handleTabChange = (key) => {
    setFilters((prev) => ({
      ...prev,
      Category: Number(key),
    }));
  };

  const tabItems = DocumentTypes.map((docType) => ({
    key: String(docType.value),
    label: (
      <div className="flex flex-row gap-1">
        <p>{docType.label}</p>
        <span className="ml-2 flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full border bg-gray-100">
          0
        </span>
      </div>
    ),
    children: (
      <>
        <h3 className="mb-3 ms-4 font-semibold text-gray-800 text-lg mt-10">
          {DocumentTypes.find((item) => item.value === filters.Category)?.label}
        </h3>
        <DocumentList filters={filters} setFilters={setFilters} />
      </>
    ),
  }));

  return (
    <>
      <Filters filters={filters} setFilters={setFilters} />
      <Tabs
        onChange={handleTabChange}
        className="mt-10"
        defaultActiveKey="1"
        items={tabItems}
      />
    </>
  );
};

export default DocumentTypeTabs;
