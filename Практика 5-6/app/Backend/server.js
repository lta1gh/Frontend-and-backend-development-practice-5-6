const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальные данные (услуги)
let services = [
  { id: nanoid(6), name: 'Сайт под ключ Lite', price: 20000, description: 'Пакет включает в себя: Создание сайта по запросу, а также пакет "Дизайн Lite" (Обслуживание не включено)', category: 'Услуги Lite' },
  { id: nanoid(6), name: 'Сайт под ключ Standart', price: 35000, description: 'Пакет включает в себя: Создание сайта по запросу, пакет "Дизайн Standart", а также одно обслуживание.', category: 'Услуги Standart' },
  { id: nanoid(6), name: 'Сайт под ключ Deluxe', price: 40000, description: 'Пакет включает в себя: Создание сайта по запросу, а также пакет "Дизайн Deluxe", а также полгода (180 дней) подписки на обслуживание.)', category: 'Услуги Deluxe' },
  { id: nanoid(6), name: 'Дизайн Lite', price: 5000, description: 'Создание дизайна для сайта специалистом категории Lite', category: 'Услуги Lite' },
  { id: nanoid(6), name: 'Дизайн Standart', price: 8500, description: 'Создание дизайна для сайта специалистом категории Standart', category: 'Услуги Standart' },
  { id: nanoid(6), name: 'Дизайн Deluxe', price: 10000, description: 'Создание дизайна для сайта специалистом категории Deluxe', category: 'Услуги Deluxe' },
  { id: nanoid(6), name: 'Обслуживание (Один раз)', price: 10000, description: 'Изменение дизайна специалистом класса Standart или Lite, изменение настроек, структуры и другого. Услуга предоставляется на одно обращение.', category: 'Услуги Lite' },
  { id: nanoid(6), name: 'Обслуживание (Подписка) (Месяц)', price: 15000, description: 'Изменение дизайна специалистом класса Standart или Lite, изменение настроек, структуры и другого. Доступ к услуге предоставляется на один месяц (30 дней).', category: 'Услуги Standart' },
  { id: nanoid(6), name: 'Обслуживание (Подписка) (Полгода)', price: 20000, description: 'Изменение дизайна специалистом любого класса, изменение настроек, структуры и другого. Доступ к услуге предоставляется на полгода (180 дней).', category: 'Услуги Deluxe' },
  { id: nanoid(6), name: 'Обслуживание (Подписка) (Год)', price: 40000, description: 'Изменение дизайна специалистом любого класса, изменение настроек, структуры и другого. Доступ к услуге предоставляется на один год (360 дней).', category: 'Услуги Deluxe' },
];

app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// CORS – разрешаем запросы только с фронтенда (порт 3001)
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Вспомогательная функция для поиска услуги по id
function findServiceOr404(id, res) {
  const service = services.find(s => s.id == id);
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return null;
  }
  return service;
}

// ---------- Swagger настройка ----------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления услугами',
      version: '1.0.0',
      description: 'API для интернет-магазина услуг',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
  },
  // Путь к файлу с JSDoc-комментариями (текущий файл)
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID услуги
 *         name:
 *           type: string
 *           description: Название услуги
 *         price:
 *           type: integer
 *           description: Цена услуги в рублях
 *         description:
 *           type: string
 *           description: Подробное описание услуги
 *         category:
 *           type: string
 *           description: Категория услуги
 *       example:
 *         id: "abc123"
 *         name: "Консультация"
 *         price: 1500
 *         description: "Профессиональная консультация"
 *         category: "Консультации"
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Создаёт новую услугу
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               name: "Новая услуга"
 *               price: 5000
 *               description: "Описание"
 *               category: "Категория"
 *     responses:
 *       201:
 *         description: Услуга успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
app.post("/api/services", (req, res) => {
  const { name, price, description, category } = req.body;
  const newService = {
    id: nanoid(6),
    name: name.trim(),
    price: Number(price),
    description: description ? description.trim() : '',
    category: category ? category.trim() : '',
  };
  services.push(newService);
  res.status(201).json(newService);
});

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Возвращает список всех услуг
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Список услуг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
app.get("/api/services", (req, res) => {
  res.json(services);
});

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Получает услугу по ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID услуги
 *     responses:
 *       200:
 *         description: Данные услуги
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Услуга не найдена
 */
app.get("/api/services/:id", (req, res) => {
  const id = req.params.id;
  const service = findServiceOr404(id, res);
  if (!service) return;
  res.json(service);
});

/**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     summary: Обновляет существующую услугу
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID услуги
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               name: "Обновлённое название"
 *               price: 6000
 *     responses:
 *       200:
 *         description: Обновлённая услуга
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Нет полей для обновления
 *       404:
 *         description: Услуга не найдена
 */
app.patch("/api/services/:id", (req, res) => {
  const id = req.params.id;
  const service = findServiceOr404(id, res);
  if (!service) return;

  if (req.body?.name === undefined && req.body?.price === undefined &&
      req.body?.description === undefined && req.body?.category === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, price, description, category } = req.body;
  if (name !== undefined) service.name = name.trim();
  if (price !== undefined) service.price = Number(price);
  if (description !== undefined) service.description = description.trim();
  if (category !== undefined) service.category = category.trim();

  res.json(service);
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Удаляет услугу
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID услуги
 *     responses:
 *       204:
 *         description: Услуга успешно удалена (нет тела ответа)
 *       404:
 *         description: Услуга не найдена
 */
app.delete("/api/services/:id", (req, res) => {
  const id = req.params.id;
  const exists = services.some((s) => s.id === id);
  if (!exists) return res.status(404).json({ error: "Service not found" });
  services = services.filter((s) => s.id !== id);
  res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});