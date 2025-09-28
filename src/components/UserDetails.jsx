import React, { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { httpService } from "../services/httpservice.service";
import RolesEnum from "../enums/RolesEnum";

const { Option } = Select;

const UserDetails = ({ mode, user, onBack }) => {
  const [form] = Form.useForm();
  const isPreview = mode === "preview";
  const isEdit = mode === "edit";

  const handleSubmit = (values) => {
    if (isEdit) {
      httpService.put(
        `/api/users/${user.id}`,
        values,
        () => {
          message.success("Përdoruesi u përditësua me sukses!");
          onBack();
        },
        () => {
          message.error("Përditësimi dështoi!");
        }
      );
    } else {
      httpService.post(
        `/api/users`,
        values,
        () => {
          message.success("Përdoruesi u shtua me sukses!");
          onBack();
        },
        () => {
          message.error("Shtimi dështoi!");
        }
      );
    }
  };

  console.log("Rendering UserDetails with user:", user, "and mode:", mode);

  return (
    <div className="border p-6 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {isPreview
          ? "Detajet e përdoruesit"
          : isEdit
          ? "Edito Përdorues"
          : "Shto Përdorues"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          roleId: user?.role.id || "",
        }}
        onFinish={handleSubmit}
        // disabled={isPreview}
      >
        <Form.Item
          name="firstName"
          label="Emri"
          rules={[{ required: true, message: "Ju lutem shkruani emrin" }]}
        >
          <Input placeholder="Shkruani emrin" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Mbiemri"
          rules={[{ required: true, message: "Ju lutem shkruani mbiemrin" }]}
        >
          <Input placeholder="Shkruani mbiemrin" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Email i pavlefshëm" },
          ]}
        >
          <Input placeholder="Shkruani emailin" />
        </Form.Item>

        <Form.Item
          name="roleId"
          label="Roli"
          rules={[{ required: true, message: "Ju lutem zgjidhni rolin" }]}
        >
          <Select
            allowClear
            placeholder="Zgjidh rolin"
            options={Object.entries(RolesEnum).map(([label, value]) => ({
              value,
              label,
            }))}
          />
        </Form.Item>

        <div className="flex gap-3 mt-6">
          <Button onClick={onBack}>Kthehu</Button>
          {!isPreview && (
            <Button type="primary" htmlType="submit">
              {isEdit ? "Ruaj Ndryshimet" : "Shto"}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default UserDetails;
