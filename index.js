

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Adres URL bazy danych MongoDB (zmień na swój własny)
const mongoURL = 'mongodb://localhost:27017/mojaBazaDanych';

// Nazwa bazy danych
const dbName = 'mojaBazaDanych';

async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();
        console.log('Połączono z bazą danych');

        // Przykładowa operacja na bazie danych (np. wypisanie kolekcji)
        const database = client.db(dbName);
        const collection = database.collection('mojaKolekcja');
        const result = await collection.find({}).toArray();
        console.log('Zawartość kolekcji:', result);

        // Zamykanie połączenia z bazą danych
        await client.close();
        console.log('Zamknięto połączenie z bazą danych');
    } catch (error) {
        console.error('Błąd podczas łączenia z bazą danych:', error);
    }
}

// Dodaj funkcję connectToDatabase do obsługi połączenia z bazą danych
connectToDatabase();

//nie wiem czy dobre miejsce tbh
app.get('/users', async (req, res) => {
    try {
        const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection('uzytkownicy');

        // Pobierz wszystkie dane z kolekcji
        const users = await collection.find({}).toArray();

        await client.close();

        // Przekaż dane do strony i wyświetl je
        res.send(`
            <h1>Lista użytkowników:</h1>
            <ul>
                ${users.map(user => `<li>${user.name} - ${user.email}</li>`).join('')}
            </ul>
        `);
    } catch (error) {
        console.error('Błąd podczas pobierania danych z bazy danych:', error);
        res.status(500).send('Błąd podczas pobierania danych z bazy danych');
    }
});
//koniec dziwnego paragrafu

app.post('/submit', async (req, res) => {
    try {
        const { name, email } = req.body;

        const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection('uzytkownicy');

        // Dodaj dane do bazy danych
        await collection.insertOne({ name, email });

        await client.close();
        console.log('Dane dodane do bazy danych');

        res.status(200).send('Dane dodane do bazy danych');
    } catch (error) {
        console.error('Błąd podczas dodawania danych do bazy danych:', error);
        res.status(500).send('Błąd podczas dodawania danych do bazy danych');
    }
});


// Ustawienie katalogu statycznego
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Aplikacja działa na http://localhost:${port}`);
});


