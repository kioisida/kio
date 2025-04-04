const express = require('express');
const path = require('path');
const stripe = require('stripe')('sk_test_51RADQQH48qelJN4O4rl0aYAurzqbDfV09qdFQgsxs3ptExbZ3dltuTitRktCQbtBS7STa2gnGHltJxsvHEYsc2Q900bL6ZBgpB');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json()); // Для парсинга JSON-данных

// Основной маршрут для отправки index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Создание сессии оплаты
app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body; // Сумма пополнения

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'rub',
                product_data: {
                    name: 'Пополнение аккаунта Steam',
                },
                unit_amount: amount * 100, // Сумма в копейках
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:4000/success',
        cancel_url: 'http://localhost:4000/cancel',
    });

    res.json({ id: session.id });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
