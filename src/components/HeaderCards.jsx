import React from "react";
import { FiUsers } from "react-icons/fi";
import { IoCalendarClearOutline, IoDocumentTextOutline } from "react-icons/io5";
import { PiChartLineUp } from "react-icons/pi";

const HeaderCards = () => {
  const cards = [
    {
      title: "Klientë Total",
      value: 120,
      icon: <FiUsers size={30} color="#0096FF" />,
    },
    {
      title: "Dokumente Total",
      value: 5,
      icon: <IoDocumentTextOutline size={30} color="green" />,
    },
    {
      title: "Këtë Muaj",
      value: 95,
      icon: <IoCalendarClearOutline size={30} color="purple" />,
    },
    {
      title: "Në Pritje",
      value: 20,
      icon: <PiChartLineUp size={30} color="red" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
        >
          <div>
            <h2 className="text-gray-500 ">{card.title}</h2>
            <p className="text-lg font-semibold">{card.value}</p>
          </div>
          <div>{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default HeaderCards;
