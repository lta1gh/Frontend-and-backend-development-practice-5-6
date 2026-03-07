import React from "react";
import ServiceItem from "./ServiceItem";

export default function ServicesList({ services, onEdit, onDelete }) {
  if (!services.length) {
    return <div className="empty">Услуг пока нет</div>;
  }

  return (
    <div className="list">
      {services.map((s) => (
        <ServiceItem key={s.id} service={s} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}