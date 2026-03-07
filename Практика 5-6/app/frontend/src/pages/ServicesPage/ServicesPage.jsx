import React, { useState, useEffect } from "react";
import "./ServicesPage.css";

import ServicesList from "../../components/ServicesList";
import ServiceModal from "../../components/ServiceModal";
import { api } from "../../api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки услуг");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingService(null);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setModalMode("edit");
    setEditingService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить услугу?");
    if (!ok) return;

    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления услуги");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newService = await api.createService(payload);
        setServices((prev) => [...prev, newService]);
      } else {
        const updatedService = await api.updateService(payload.id, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === payload.id ? updatedService : s))
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения услуги");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Services App</div>
          <div className="header__right">React</div>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Услуги</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Создать
            </button>
          </div>
          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ServicesList
              services={services}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Services App
        </div>
      </footer>
      <ServiceModal
        open={modalOpen}
        mode={modalMode}
        initialService={editingService}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}