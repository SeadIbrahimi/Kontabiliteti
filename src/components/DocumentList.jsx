import React, { useEffect, useState } from "react";
import { Button, Checkbox, Image, message, Pagination, Tooltip } from "antd";
import { calendarIcon, docxFileIcon } from "../assets/exportIcons";
import DocumentCategoryEnum from "../enums/DocumentCategoryEnum";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GrDownload } from "react-icons/gr";

import { httpService } from "../services/httpservice.service";
import DocumentStatusEnum from "../enums/DocumentStatusEnum";

import useGeneratePdf from "../hooks/useGeneratePdf";
import { FaFilePdf } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_API_URL;

const DocumentList = (params) => {
  const { generatePdfFromImageLinks, loading: pdfLoading } = useGeneratePdf();

  const { filters, status } = params;
  const isManaging = status !== null;
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  });

  const buildQueryParams = () => {
    const queryParams = {
      ...(filters ? filters : {}),
      Status: status || DocumentStatusEnum.registered,
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

    const queryString = new URLSearchParams(queryParams).toString();
    return queryString;
  };

  useEffect(() => {
    setLoading(true);
    const queryString = buildQueryParams();

    httpService.get(
      `/api/invoices?${queryString}`,
      (response) => {
        setDocuments(response?.data || []);
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
  }, [filters, isManaging, pagination.pageNumber, pagination.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: page,
      pageSize: pageSize,
    }));
  };

  const handlePreview = (imageUrl) => {
    window.open(`${baseUrl}/${imageUrl}`, "_blank");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="space-y-4 border p-5  rounded-lg bg-white">
        {pagination.total > 0 && (
          <div className="w-full flex justify-end">
            <p className="flex gap-2">
              <span className="font-semibold">Total:</span>
              {pagination.total === 1
                ? "1 Dokument"
                : pagination.total + " Dokumente"}
            </p>
          </div>
        )}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : documents?.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className={`border ${
                status === DocumentStatusEnum.initial
                  ? "border-orange-500"
                  : status === DocumentStatusEnum.registered
                  ? "border-green-500"
                  : "border-gray-300"
              } px-5 py-3 rounded-lg flex justify-between items-center bg-${
                status === DocumentStatusEnum.registered ? "green-50" : "white"
              } shadow-sm hover:scale-[1.02] transition-all cursor-pointer`}
            >
              <div className="flex items-center space-x-6">
                <div
                  className={`${
                    status === DocumentStatusEnum.initial
                      ? "bg-orange-100 text-orange-600"
                      : status === DocumentStatusEnum.registered
                      ? "bg-green-100 text-green-600"
                      : "bg-indigo-100 text-indigo-600"
                  } rounded-lg p-3 flex align-middle justify-center`}
                >
                  <Image
                    src={docxFileIcon}
                    alt="Document icon"
                    width={30}
                    preview={false}
                    style={{
                      filter:
                        status === DocumentStatusEnum.initial
                          ? "invert(48%) sepia(98%) saturate(350%) hue-rotate(350deg)"
                          : status === DocumentStatusEnum.registered
                          ? "invert(50%) sepia(60%) saturate(400%) hue-rotate(90deg)"
                          : "invert(30%) sepia(80%) saturate(300%) hue-rotate(220deg)",
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <h2 className="ms-3 font-semibold text-md  text-gray-800">
                    {doc.fileName || "Fajlli nuk ka emër"}
                  </h2>
                  <div className="flex space-x-4 items-center text-sm text-gray-600">
                    <span
                      className={`${
                        status === DocumentStatusEnum.initial
                          ? "bg-orange-100 text-orange-600"
                          : status === DocumentStatusEnum.registered
                          ? "bg-green-100 text-green-600"
                          : "bg-indigo-100 text-indigo-600"
                      } text-nowrap px-3 py-1  rounded-full font-semibold`}
                    >
                      {DocumentCategoryEnum.find(
                        (item) => item.value === doc.category
                      )?.label || "Pa kategori"}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Image
                        src={calendarIcon}
                        alt="Calendar icon"
                        // width={16}
                        preview={false}
                      />
                      <div className="flex flex-col">
                        <span className="text-nowrap">
                          {status === DocumentStatusEnum.registered
                            ? "Regjistruar"
                            : "Ngarkuar"}{" "}
                          me datë
                        </span>
                        <span className="text-nowrap">
                          {doc.date ? formatDate(doc.date) : "Pa datë"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <Tooltip title="Gjenero PDF">
                  <Button
                    type="text"
                    className="p-0 px-2"
                    onClick={() => generatePdfFromImageLinks(doc.invoiceImages)}
                    loading={pdfLoading}
                  >
                    <FaFilePdf size={18} />
                  </Button>
                </Tooltip>
                <Tooltip title="Shfaq">
                  <Button
                    type="text"
                    className="p-0"
                    icon={<MdOutlineRemoveRedEye size={18} />}
                    aria-label="Notifications"
                    onClick={() => handlePreview(doc.invoiceImages[0])}
                  />
                </Tooltip>
                <Tooltip title="Shkarko">
                  <Button
                    type="text"
                    className="p-0"
                    icon={<GrDownload size={18} />}
                    aria-label="Notifications"
                  />
                </Tooltip>
                {status === DocumentCategoryEnum.initial && (
                  <Checkbox>Regjistruar</Checkbox>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-4 items-center text-gray-400 font-semibold">
            <Image
              src={docxFileIcon}
              preview={false}
              width="80px"
              className="filter grayscale opacity-40"
            />
            Nuk ka dokumente në këtë kategori
          </div>
        )}

        {documents?.length > 0 && (
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

export default DocumentList;
