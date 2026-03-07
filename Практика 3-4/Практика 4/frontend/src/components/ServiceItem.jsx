import React from "react";

export default function ServiceItem({ service, onEdit, onDelete }) {
  return (
    <div className="serviceRow">
      <div className="serviceMain">
        <div className="serviceId">#{service.id}</div>
        <div className="serviceName">{service.name}</div>
        <div className="servicePrice">{service.price} руб.</div>
      </div>
      <div className="serviceDetails">
        {service.category && <div className="serviceCategory">Категория: {service.category}</div>}
        {service.description && <div className="serviceDescription">{service.description}</div>}
      </div>
      <div className="serviceActions">
        <button className="btn" onClick={() => onEdit(service)}>Редактировать</button>
        <button className="btn btn--danger" onClick={() => onDelete(service.id)}>Удалить</button>
      </div>
    </div>
  );
}