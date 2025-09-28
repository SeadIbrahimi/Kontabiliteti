import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Switch,
  message,
  Steps,
  Collapse,
  DatePicker,
  Select,
  Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { httpService } from "../services/httpservice.service";

const { Step } = Steps;
const { Panel } = Collapse;

const BusinessDetails = ({ mode, business, onBack }) => {
  const [form] = Form.useForm();
  const [currentView, setCurrentView] = useState(0);
  const isPreview = mode === "preview";
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  // Fetch units for a business
  const getBusinessUnits = (businessId, goNext = false) => {
    setLoading(true);
    httpService.get(
      `/api/businesses/${businessId}/units`,
      (res) => {
        const unitsData = (res.data || []).map((u, index) => ({
          ...u,
          isDefault: index === 0,
        }));

        setUnits(unitsData);
        // ✅ Make sure Form has those values
        form.setFieldsValue({
          units: unitsData.map((u) => ({
            name: u.name, // must match Form.Item field name
            address: u.address,
            isDefault: u.isDefault,
          })),
        });

        if (goNext) setCurrentView((prev) => prev + 1);
        setLoading(false);
      },
      () => {
        message.error("Nuk u ngarkuan njësitë");
        setLoading(false);
      }
    );
  };

  const createBusiness = (values) => {
    setLoading(true);
    httpService.post(
      `/api/businesses`,
      values,
      (res) => {
        message.success("Biznesi u shtua me sukses!");
        const newBusinessId = res.data;
        form.setFieldsValue({ id: newBusinessId });
        getBusinessUnits(newBusinessId, true); // fetch units and go to step 2
      },
      () => {
        message.error("Shtimi dështoi!");
        setLoading(false);
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const updateBusiness = (values, businessId) => {
    setLoading(true);
    httpService.put(
      `/api/businesses/${businessId}`,
      values,
      () => {
        message.success("Biznesi u përditësua me sukses!");
        getBusinessUnits(businessId, true);
      },
      () => {
        message.error("Përditësimi dështoi!");
        setLoading(false);
      }
    );
  };

  const addUnits = (values) => {
    const params = values
      .filter((value) => !value.isDefault)
      .map((value) => ({
        name: value.name,
        address: value.address,
      }));
    setLoading(true);
    params?.length > 0
      ? httpService.post(
          `/api/units/${business?.id || form.getFieldValue("id")}`,
          params,
          () => {
            message.success("Njësitë u ruajtën me sukses!");
            setCurrentView(2);
            setLoading(false);
          },
          () => {
            message.error("Ruajtja e njësive dështoi!");
            setLoading(false);
          }
        )
      : setCurrentView(2);
  };

  const addProjects = (values) => {
    setLoading(true);
    httpService.post(
      `/api/projects/bulk`,
      values,
      () => {
        message.success("Projektet u ruajtën me sukses!");
        setLoading(false);
        onBack();
      },
      () => {
        message.error("Ruajtja e projekteve dështoi!");
        setLoading(false);
      }
    );
  };

  const handleSubmit = (values) => {
    if (currentView === 0) {
      if (isEdit) {
        updateBusiness(values, business?.id);
      } else {
        createBusiness(values);
      }
    } else if (currentView === 1) {
      addUnits(values.units);
    } else if (currentView === 2) {
      addProjects(values.projects);
    }
  };

  return (
    <div className="border p-6 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-center mt-5 mb-10">
        {isPreview
          ? "Detajet e biznesit"
          : isEdit
          ? "Edito Biznes"
          : "Shto Biznes"}
      </h2>

      <Steps current={currentView} className="mb-8">
        <Step title="Biznesi" />
        <Step title="Njësitë" />
        <Step title="Projektet" />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={business || {}}
        onFinish={handleSubmit}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.length > 0) {
            form.scrollToField(errorFields[0].name, {
              behavior: "smooth",
              block: "center",
            });
          }
        }}
        disabled={isPreview}
      >
        {/* Step 1: Business */}
        {currentView === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Emri"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani emrin e biznesit",
                },
              ]}
            >
              <Input placeholder="Shkruani emrin e biznesit" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Ju lutem shkruani email-in" },
              ]}
            >
              <Input type="email" placeholder="Shkruani email-in" />
            </Form.Item>
            <Form.Item
              name="UniqueIdentificationNumber"
              label="Numri i identifikimit unik"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani numrin e identifikimit unik",
                },
              ]}
            >
              <Input placeholder="Shkruani numrin e identifikimit unik" />
            </Form.Item>
            <Form.Item
              name="FiscalNumber"
              label="Numri fiskal"
              rules={[
                { required: true, message: "Ju lutem shkruani numrin fiskal" },
              ]}
            >
              <Input placeholder="Shkruani numrin fiskal" />
            </Form.Item>
            <Form.Item
              name="BusinessNumber"
              label="Numri i biznesit"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani numrin e biznesit",
                },
              ]}
            >
              <Input placeholder="Shkruani numrin e biznesit" />
            </Form.Item>
            <Form.Item
              name="tradeName"
              label="Emri tregtarë"
              rules={[
                { required: true, message: "Ju lutem shkruani emrin tregtarë" },
              ]}
            >
              <Input placeholder="Shkruani emrin tregtarë" />
            </Form.Item>
            <Form.Item
              name="Address"
              label="Adresa"
              rules={[{ required: true, message: "Ju lutem shkruani adresën" }]}
            >
              <Input placeholder="Shkruani adresën" />
            </Form.Item>
            <Form.Item
              name="City"
              label="Qyteti"
              rules={[{ required: true, message: "Ju lutem shkruani qytetin" }]}
            >
              <Input placeholder="Shkruani qytetin" />
            </Form.Item>
            <Form.Item
              name="Municipality"
              label="Komuna"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani emrin e komunes",
                },
              ]}
            >
              <Input placeholder="Shkruani komunën" />
            </Form.Item>
            <Form.Item
              name="TaxOffice"
              label="Zyra Tatimore"
              rules={[
                { required: true, message: "Ju lutem shkruani zyren tatimore" },
              ]}
            >
              <Input placeholder="Shkruani zyrën tatimore" />
            </Form.Item>
            <Form.Item name="HasVat" label="A ka TVSH?" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item shouldUpdate={(prev, cur) => prev.HasVat !== cur.HasVat}>
              {({ getFieldValue }) =>
                getFieldValue("HasVat") ? (
                  <Form.Item
                    name="VatNumber"
                    label="Numri i TVSH-së"
                    rules={[
                      {
                        required: true,
                        message: "Ju lutem shkruani numrin e TVSH-së",
                      },
                    ]}
                  >
                    <Input placeholder="Shkruani numrin e TVSH-së" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item
              name="HasExport"
              label="A ka eksport?"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="HasImport"
              label="A ka import?"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="TradeRegistrationNumber"
              label="Numri tregtarë"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani numrin tregtarë",
                },
              ]}
            >
              <Input placeholder="Shkruani numrin tregtarë" />
            </Form.Item>
            <Form.Item
              name="PhoneNumber"
              label="Numri i telefonit"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani nr. e telefonit",
                },
              ]}
            >
              <Input placeholder="Shkruani numrin e telefonit" />
            </Form.Item>
            <Divider />
            <h3 className="text-lg font-semibold col-span-2 mb-4">
              Detajet e pronarit
            </h3>
            <Form.Item
              name="OwnerPhoneNumber"
              label="Numri i telefonit të pronarit"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani numrin e pronarit të biznesit",
                },
              ]}
            >
              <Input placeholder="Shkruani numrin e telefonit të pronarit" />
            </Form.Item>
            <Form.Item
              name="ownerName"
              label="Emri i pronarit"
              rules={[
                {
                  required: true,
                  message: "Ju lutem shkruani emrin e pronarit",
                },
              ]}
            >
              <Input placeholder="Shkruani emrin e pronarit" />
            </Form.Item>
          </div>
        )}

        {/* Step 2: Units */}
        {currentView === 1 && (
          <Form.List name="units">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Collapse key={key} defaultActiveKey={[key]} className="mb-4">
                    <Panel
                      header={`Njësia ${name + 1}`}
                      extra={
                        !form.getFieldValue(["units", name, "isDefault"]) && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: "red" }}
                          />
                        )
                      }
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          label="Emri i njësisë"
                          rules={[
                            { required: true, message: "Shkruani emrin" },
                          ]}
                        >
                          <Input
                            disabled={form.getFieldValue([
                              "units",
                              name,
                              "isDefault",
                            ])}
                            placeholder="Shkruani emrin e njësisë..."
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "address"]}
                          label="Adresa"
                          rules={[
                            { required: true, message: "Shkruani adresën" },
                          ]}
                        >
                          <Input
                            placeholder="Shkruani adresën e njësisë..."
                            disabled={form.getFieldValue([
                              "units",
                              name,
                              "isDefault",
                            ])}
                          />
                        </Form.Item>
                      </div>
                    </Panel>
                  </Collapse>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Shto Njësi
                </Button>
              </>
            )}
          </Form.List>
        )}

        {/* Step 3: Projects */}
        {currentView === 2 && (
          <Form.List name="units" initialValue={units}>
            {(unitFields) => (
              <>
                {unitFields.map(({ key, name }) => (
                  <Collapse key={key} className="mb-4">
                    <Panel header={`Projektet për Njësinë ${name + 1}`}>
                      <Form.List name={[name, "projects"]}>
                        {(projectFields, { add, remove }) => (
                          <>
                            {projectFields.map(
                              ({
                                key: pKey,
                                name: pName,
                                ...restProjectField
                              }) => (
                                <div
                                  key={pKey}
                                  className="border p-4 rounded-lg mb-4 bg-gray-50"
                                >
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <Form.Item
                                      {...restProjectField}
                                      name={[pName, "projectName"]}
                                      label="Emri i projektit"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Ju lutem shkruani emrin e projektit",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      {...restProjectField}
                                      name={[pName, "status"]}
                                      label="Statusi"
                                    >
                                      <Select
                                        options={[
                                          { value: "active", label: "Aktiv" },
                                          {
                                            value: "pending",
                                            label: "Në pritje",
                                          },
                                          {
                                            value: "finished",
                                            label: "I përfunduar",
                                          },
                                        ]}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...restProjectField}
                                      name={[pName, "startDate"]}
                                      label="Data e fillimit"
                                    >
                                      <DatePicker className="w-full" />
                                    </Form.Item>
                                    <Form.Item
                                      {...restProjectField}
                                      name={[pName, "endDate"]}
                                      label="Data e mbarimit"
                                    >
                                      <DatePicker className="w-full" />
                                    </Form.Item>
                                  </div>
                                  <Button
                                    type="link"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(pName)}
                                  >
                                    Fshij Projektin
                                  </Button>
                                </div>
                              )
                            )}
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Shto Projekt
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Panel>
                  </Collapse>
                ))}
              </>
            )}
          </Form.List>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 w-full justify-center">
          {currentView < 2 && (
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
            >
              Vazhdo
            </Button>
          )}
          {currentView === 2 && !isPreview && (
            <Button loading={loading} type="primary" htmlType="submit">
              {isEdit ? "Ruaj Ndryshimet" : "Shto Biznesin"}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BusinessDetails;
