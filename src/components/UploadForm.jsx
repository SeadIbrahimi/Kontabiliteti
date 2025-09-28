import React, { useState } from "react";
import { Form, Select, Upload, Image, message, Button, Row, Col } from "antd";
import { useForm } from "antd/es/form/Form";
import { httpService } from "../services/httpservice.service";
import DocumentTypes from "../enums/DocumentCategoryEnum";
import PaymentMethods from "../enums/PaymentMethods";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadForm = () => {
  const [form] = useForm();
  const [selectedDocType, setSelectedDocType] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer">
      <svg
        className="w-8 h-8 mb-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
      <span className="text-sm">Ngarko</span>
    </div>
  );

  const handleSubmit = (values) => {
    if (!values?.upload?.fileList?.length) {
      message.error("Ju lutem ngarkoni të paktën një dokument.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    const { docType, paymentMethod, upload } = values;
    const { fileList } = upload;

    formData.append("Category", docType);
    if (paymentMethod) formData.append("PaymentMethod", paymentMethod);
    fileList.forEach((file) => {
      formData.append("InvoiceImages", file.originFileObj);
    });

    formData.append("Date", today);

    httpService.post(
      "/api/invoices",
      formData,
      (response) => {
        message.success(response.message || "U dërgua me sukses");
        form.resetFields();
        setFileList([]);
        setSelectedDocType(1);
      },
      (error) => message.error(error.message),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  return (
    <div className="mx-auto bg-white rounded-b-lg shadow-md p-10 m-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-500">
          Ngarko Dokumente
        </h1>
        <p className="text-gray-600">
          Ngarko foto ose PDF të faturave dhe dokumenteve të tjera
        </p>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          docType: 1,
          paymentMethod: 1,
        }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col
            xs={24}
            md={selectedDocType < 5 ? 12 : 24}
            className={selectedDocType < 5 ? "" : "flex justify-center"}
          >
            <Form.Item
              name="docType"
              label="Lloji i dokumentit"
              rules={[
                { required: true, message: "Zgjidhni llojin e dokumentit!" },
              ]}
            >
              <Select
                options={DocumentTypes}
                onChange={(value) => {
                  setSelectedDocType(value);
                  if (value >= 5) {
                    form.setFieldsValue({ paymentMethod: undefined });
                  }
                }}
                placeholder="Zgjidhni dokumentin"
                size="large"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          {selectedDocType < 5 && (
            <Col xs={24} md={12}>
              <Form.Item
                name="paymentMethod"
                label="Menyra E Pageses"
                rules={[
                  { required: true, message: "Zgjidhni mënyrën e pagesës!" },
                ]}
              >
                <Select
                  options={PaymentMethods}
                  placeholder="Zgjidhni mënyrën e pagesës"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Form.Item
          name="upload"
          className="mb-4 flex justify-center"
          rules={[
            { required: true, message: "Ngarkoni të paktën një dokument!" },
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            multiple
            beforeUpload={() => false}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </Form.Item>

        {/* <DocumentScanner /> */}

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}

        <Row gutter={[16, 16]} justify="center" className="mt-6">
          {/* <Col xs={24} sm={12} lg={8}>
            <Button
              block
              type="default"
              size="large"
              onClick={() => {
                form.resetFields();
                setFileList([]);
                setSelectedDocType(1);
              }}
              className="border hover:border-gray-700 hover:text-gray-700"
            >
              Anulo
            </Button>
          </Col> */}
          <Col xs={24} sm={12} lg={8}>
            <Button
              block
              type="primary"
              size="large"
              htmlType="submit"
              className="bg-gray-600 hover:bg-gray-800 "
            >
              Dërgo
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UploadForm;
