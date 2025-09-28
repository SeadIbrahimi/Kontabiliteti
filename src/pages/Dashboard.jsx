import { Image, Tabs } from "antd";
import UploadForm from "../components/UploadForm";
import DocumentTypeTabs from "../components/DocumentTypeTabs";
import NavbarMenu from "../components/NavbarMenu";
import { docxFileIcon, plusIcon } from "../assets/exportIcons";
import { SlSettings } from "react-icons/sl";
import DocumentList from "../components/DocumentList";
import { FaRegUser } from "react-icons/fa";
import UsersList from "../components/UsersList";
import BusinessesList from "../components/BusinessesList";
import { ShopOutlined } from "@ant-design/icons";
import DocumentStatusEnum from "../enums/DocumentStatusEnum";
import HeaderCards from "../components/HeaderCards";

const Dashboard = () => {
  const currentRoleName = localStorage.getItem("roleName");

  const tabItems = [
    ...(currentRoleName === "Business" || currentRoleName === "Employee"
      ? [
          {
            label: (
              <div className="flex flex-nowrap gap-2 items-center">
                <Image
                  src={plusIcon}
                  alt="Plus Icon"
                  preview={false}
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <p>Ngarko Dokumente</p>
              </div>
            ),
            key: "1",
            children: <UploadForm />,
          },
        ]
      : []),
    {
      label: (
        <div className="flex flex-nowrap gap-2 items-center">
          <Image
            src={docxFileIcon}
            alt="Plus Icon"
            preview={false}
            width={18}
            height={18}
            className="mr-2"
          />
          <p>
            {currentRoleName === "System Admin" ||
            currentRoleName === "Accountant"
              ? "Dokumentet e Klienteve"
              : "Dokumentet e Ngarkuara"}
          </p>
        </div>
      ),
      key: "2",
      children: <DocumentTypeTabs status={DocumentStatusEnum.registered} />,
    },
    ...(currentRoleName === "System Admin" || currentRoleName === "Accountant"
      ? [
          {
            label: (
              <div className="flex flex-nowrap gap-2 items-center">
                <SlSettings className="text-black" />
                <p>Regjistro Dokumente</p>
              </div>
            ),
            key: "3",
            children: (
              <div className="flex flex-col gap-6">
                <DocumentList status={DocumentStatusEnum.initial} />
                <DocumentList status={DocumentStatusEnum.registered} />
              </div>
            ),
          },
          {
            label: (
              <div className="flex flex-nowrap gap-2 items-center">
                <FaRegUser className="text-black" />
                <p>Menaxho Punëtorët</p>
              </div>
            ),
            key: "4",
            children: <UsersList />,
          },
          {
            label: (
              <div className="flex flex-nowrap gap-2 items-center">
                <ShopOutlined className="text-black" />
                <p>Menaxho Bizneset</p>
              </div>
            ),
            key: "5",
            children: <BusinessesList />,
          },
        ]
      : []),
  ];

  return (
    <div className=" bg-gray-50 w-full min-h-[100vh]">
      <NavbarMenu />
      <div className="container mx-auto mt-10 flex flex-col gap-10">
        <HeaderCards />
        <Tabs
          type="card"
          animated
          centered
          items={tabItems}
          className="w-full"
          destroyOnHidden
        />
      </div>
    </div>
  );
};

export default Dashboard;
