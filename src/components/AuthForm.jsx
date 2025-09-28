import { useAuth } from "../context/AuthContext";
import { Form, Input, Button, message, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import { httpService } from "../services/httpservice.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Images/Logo.png";

const AuthForm = () => {
  const [form] = useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    const params = {
      email: values.email,
      password: values.password,
    };

    httpService.post(
      "/api/auth/login",
      params,
      (response) => {
        login(response?.data);
        navigate("/dashboard");
        setLoading(false);
      },
      (error) => {
        message.error(error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="  mt-10">
        <Image
          className="m-0 p-0"
          width={200}
          preview={false}
          src={logo}
          alt="MTC Logo"
        />
      </div>
      <div className="flex items-center justify-center mt-10">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center tracking-tight">
            Hyr në Portalin e Kontabilitetit
          </h2>

          <Form.Item
            name="email"
            label="Email"
            className="mb-4"
            rules={[
              { required: true, message: "Ju lutem shkruani email-in tuaj" },
            ]}
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder="ju@kompania.com"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Fjalëkalimi"
            className="mb-4"
            rules={[
              { required: true, message: "Ju lutem shkruani fjalëkalimin" },
            ]}
          >
            <Input.Password
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-lg py-2"
            />
          </Form.Item>
          {/* 
          <Button
            type="primary"
            htmlType="submit"
            className="w-full font-semibold py-2 rounded-lg shadow-sm"
            loading={loading}
          >
            Hyr
          </Button> */}
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            className="bg-gray-600 hover:bg-gray-800 "
            loading={loading}
          >
            Hyr
          </Button>

          <div className="mt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Kontabiliteti Digital Albania
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
