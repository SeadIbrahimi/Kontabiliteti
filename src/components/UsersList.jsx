import React, { useEffect, useState } from "react";
import { Button, Image, message, Pagination, Tooltip, Popconfirm } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { MdOutlineRemoveRedEye, MdDeleteOutline, MdEdit } from "react-icons/md";

import { httpService } from "../services/httpservice.service";
import UserDetails from "./UserDetails";

const UsersList = () => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState(null);

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
    if (mode) return; // do not fetch list while in details view
    setLoading(true);
    const queryString = buildQueryParams();

    httpService.get(
      `/api/users?${queryString}`,
      (response) => {
        setUsers(response?.data || []);
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
      `/api/users/${id}`,
      () => {
        message.success("Përdoruesi u fshi me sukses!");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      },
      () => {
        message.error("Fshirja dështoi, provoni përsëri!");
      }
    );
  };

  // If we are adding/editing/previewing → show UserDetails component
  if (mode) {
    return (
      <UserDetails
        mode={mode}
        user={selectedUser}
        onBack={() => {
          setMode(null);
          setSelectedUser(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col !gap-4 !mb-10">
      <div className="flex flex-col gap-4 border !border-gray-300 p-5 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          {pagination.total > 0 ? (
            <p className="flex gap-2">
              <span className="font-semibold">Total:</span>
              {pagination.total === 1
                ? "1 Përdorues"
                : pagination.total + " Përdorues"}
            </p>
          ) : (
            <span />
          )}
          <Button
            type="primary"
            className="!bg-gray-600 hover:bg-gray-800"
            onClick={() => setMode("add")}
          >
            Shto Përdorues
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users?.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="border py-3 px-5 rounded-lg flex justify-between items-center border-gray-300 bg-white shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                  <UserOutlined style={{ fontSize: "24px" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="ms-3 font-semibold text-md text-gray-800">
                    {user.firstName || user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "Pa emër"}
                  </h2>
                  <div className="flex flex-col text-sm text-gray-600">
                    <span>
                      <MailOutlined className="mr-2" />
                      {user.email || "Mungon emaili"}
                    </span>
                    <span>
                      <PhoneOutlined className="mr-2" />
                      {user.phoneNumber || "Mungon numri i telefonit"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Tooltip title="Shfaq">
                  <Button
                    type="text"
                    icon={<MdOutlineRemoveRedEye size={18} />}
                    onClick={() => {
                      setSelectedUser(user);
                      setMode("preview");
                    }}
                  />
                </Tooltip>
                <Tooltip title="Edito">
                  <Button
                    type="text"
                    icon={<MdEdit size={18} />}
                    onClick={() => {
                      setSelectedUser(user);
                      setMode("edit");
                    }}
                  />
                </Tooltip>
                <Tooltip title="Fshij">
                  <Popconfirm
                    title="Jeni të sigurt që doni ta fshini?"
                    onConfirm={() => handleDelete(user.id)}
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
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-4 items-center text-gray-400 font-semibold">
            <UserOutlined style={{ fontSize: "48px" }} />
            Nuk ka përdorues
          </div>
        )}

        {users?.length > 0 && (
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

export default UsersList;
