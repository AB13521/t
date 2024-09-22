const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Configuration de la base de données SQLite
const db = new sqlite3.Database(path.join(__dirname, '../database/db.sqlite'), (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            userId TEXT PRIMARY KEY,
            points INTEGER DEFAULT 10
        )`);
    }
});

// API pour la connexion de l'utilisateur
app.post('/api/login', (req, res) => {
    const { userId } = req.body;

    db.get(`SELECT * FROM users WHERE userId = ?`, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }

        if (row) {
            // Si l'utilisateur existe, on lui retire 1 point s'il a des points restants
            if (row.points > 0) {
                db.run(`UPDATE users SET points = points - 1 WHERE userId = ?`, [userId], (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour des points.' });
                    }

                    return res.json({ success: true, points: row.points - 1 });
                });
            } else {
                return res.json({ success: false, message: "Vous n'avez plus de points de fidélité." });
            }
        } else {
            // Si l'utilisateur n'existe pas, on le crée avec 10 points de fidélité
            db.run(`INSERT INTO users (userId, points) VALUES (?, 9)`, [userId], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur.' });
                }

                return res.json({ success: true, points: 9 });
            });
        }
    });
});

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, '../public')));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
