import React from "react";
import { logOutIcon, userIcon } from "../assets/exportIcons";
import { Button, Dropdown, Image, Space, Tooltip } from "antd";
import { LuBellRing } from "react-icons/lu";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../context/AuthContext";

const NavbarMenu = () => {
  const { logout } = useAuth();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto  p-4 flex items-center justify-between ">
        <h1 className="text-xl font-semibold text-gray-800 text-nowrap">
          Kontabiliteti Digjital
        </h1>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 cursor-default select-none">
            <Image
              src={userIcon}
              alt="User Icon"
              preview={false}
              width={18}
              height={18}
              className="rounded-full"
            />
            <span className="text-gray-700 font-medium text-nowrap">
              User Name
            </span>
          </div>

          <Tooltip title="Notifications">
            <NotificationDropdown />
          </Tooltip>

          <Button
            icon={
              <Image
                src={logOutIcon}
                alt="Log Out Icon"
                preview={false}
                width={18}
                height={18}
                className="mr-2"
              />
            }
            onClick={logout}
            className="flex items-center border-none hover:text-red-500"
          >
            Dil
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavbarMenu;
