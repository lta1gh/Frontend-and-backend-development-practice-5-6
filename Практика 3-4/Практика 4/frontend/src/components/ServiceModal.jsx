import React, { useEffect, useState } from "react";

export default function ServiceModal({ open, mode, initialService, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialService?.name ?? "");
    setPrice(initialService?.price != null ? String(initialService.price) : "");
    setDescription(initialService?.description ?? "");
    setCategory(initialService?.category ?? "");
  }, [open, initialService]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование услуги" : "Создание услуги";

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const parsedPrice = Number(price);
    if (!trimmed) {
      alert("Введите название услуги");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert("Введите корректную цену (положительное число)");
      return;
    }
    onSubmit({
      id: initialService?.id,
      name: trimmed,
      price: parsedPrice,
      description: description.trim(),
      category: category.trim(),
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">X</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Консультация"
              autoFocus
            />
          </label>
          <label className="label">
            Цена
            <input
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Например, 1500"
              inputMode="numeric"
            />
          </label>
          <label className="label">
            Описание
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например, Консультация по вопросам дизайна"
            />
          </label>
          <label className="label">
            Категория
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Например, Услуги Lite"
            />
          </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}