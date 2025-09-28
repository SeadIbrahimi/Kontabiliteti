import React, { useState } from "react";
import { Dropdown, Badge, List, Typography, Avatar, Button } from "antd";
import { LuBellRing } from "react-icons/lu";

const notifications = [
  {
    id: 1,
    title: "Dokumenti u Regjistrua",
    description:
      'Dokumenti "shpenzime-zyra-mars.jpg" është regjistruar me sukses nga kontabilisti.',
    time: "10/08, 18:44",
    read: true,
  },
  {
    id: 2,
    title: "Dokumenti u Regjistrua",
    description:
      'Dokumenti "fatura-tvsh-mars-2024.pdf" është regjistruar me sukses nga kontabilisti.',
    time: "10/08, 18:44",
    read: false,
  },
];

const NotificationDropdown = () => {
  const [data, setData] = useState(notifications);

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottom"
      popupRender={() => (
        <div
          style={{
            width: 340,
            background: "#fff",
            borderRadius: 8,
          }}
          className="shadow border"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Typography.Text strong>Njofimet</Typography.Text>
            <Typography.Link
              onClick={() =>
                setData((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            >
              Shëno të gjitha si të lexuara
            </Typography.Link>
          </div>

          <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                style={{
                  background: item.read ? "#f0f7ff" : "#fff",
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={24}
                      style={{ background: "#e6f7ff" }}
                      icon={<LuBellRing style={{ fontSize: 14 }} />}
                    />
                  }
                  title={
                    <Typography.Text strong style={{ fontSize: 14 }}>
                      {item.title}
                    </Typography.Text>
                  }
                  description={
                    <>
                      <Typography.Paragraph
                        style={{
                          marginBottom: 4,
                          fontSize: 13,
                          color: "#555",
                        }}
                      >
                        {item.description}
                      </Typography.Paragraph>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                      >
                        {item.time}
                      </Typography.Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    >
      <Badge count={data.filter((n) => !n.read).length} offset={[0, 6]}>
        <LuBellRing style={{ fontSize: 22, cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
