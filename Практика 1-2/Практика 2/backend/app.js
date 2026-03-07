const express = require('express');
const app = express();
const port = 3000;
let services = [
{id: 1, name: 'Дизайн', price: 16000},
{id: 2, name: 'Сайт под ключ', price: 36000},
{id: 3, name: 'Обслуживание', price: 9000},
]
app.use(express.json());
app.get('/', (req, res) => {
res.send('Главная страница');
});

app.post('/services', (req, res) => {
const { name, price } = req.body;
const newservice = {
id: Date.now(),
name,
price
};
services.push(newservice);
res.status(201).json(newservice);
});
app.get('/services', (req, res) => {
res.send(JSON.stringify(services));
});
app.get('/services/:id', (req, res) => {
let service = services.find(u => u.id == req.params.id);
res.send(JSON.stringify(service));
});
app.patch('/services/:id', (req, res) => {
const service = services.find(u => u.id == req.params.id);
const { name, price } = req.body;
if (name !== undefined) service.name = name;
if (price !== undefined) service.price = price;
res.json(service);
});
app.delete('/services/:id', (req, res) => {
services = services.filter(u => u.id != req.params.id);
res.send('Ok');
});

app.listen(port, () => {
console.log(`Сервер запущен на http://localhost:${port}`);
});