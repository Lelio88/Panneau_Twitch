require('dotenv').config();

const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get("/lastshort.png", async (req, res) => {
    try {
        // Étape 1 : Récupérer les 10 dernières vidéos
        const searchResp = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video`
        );

        const videoIds = searchResp.data.items.map(item => item.id.videoId).join(',');

        // Étape 2 : Obtenir les durées
        const detailsResp = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails,snippet&id=${videoIds}`
        );

        // Étape 3 : Filtrer le premier short (<= 60s)
        const shortVideo = detailsResp.data.items.find(video => {
            const durationISO = video.contentDetails.duration;
            const match = durationISO.match(/PT(\d+)S/);
            const seconds = match ? parseInt(match[1], 10) : 9999;
            return seconds <= 60;
        });

        if (!shortVideo) {
            res.status(404).send("Aucun short trouvé");
            return;
        }

        const title = shortVideo.snippet.title;
        const imageUrl = shortVideo.snippet.thumbnails.high.url;

        // Canvas
        const canvas = createCanvas(1280, 720);
        const ctx = canvas.getContext("2d");

        const image = await loadImage(imageUrl);
        ctx.drawImage(image, 0, 0, 1280, 720);

        // Bande et texte
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 600, 1280, 120);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 40px Arial";
        ctx.fillText(`Dernier short : ${title}`, 50, 680);

        res.setHeader("Content-Type", "image/png");
        canvas.pngStream().pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

app.get("/go", async (req, res) => {
    try {
        const searchResp = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video`
        );

        const videoIds = searchResp.data.items.map(item => item.id.videoId).join(',');

        const detailsResp = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails&id=${videoIds}`
        );

        const shortVideo = detailsResp.data.items.find(video => {
            const durationISO = video.contentDetails.duration;
            const match = durationISO.match(/PT(\d+)S/); // PT60S = 60 secondes
            const seconds = match ? parseInt(match[1], 10) : 9999;
            return seconds <= 60;
        });

        if (shortVideo) {
            res.redirect(`https://youtube.com/shorts/${shortVideo.id}`);
        } else {
            res.status(404).send("Aucun short trouvé");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur de redirection");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
