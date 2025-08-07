const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get("/lastshort.png", async (req, res) => {
    try {
        const resp = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1&type=video`
        );

        const video = resp.data.items[0];
        const { title, thumbnails } = video.snippet;
        const videoId = video.id.videoId;
        const imageUrl = thumbnails.high.url;

        const canvas = createCanvas(1280, 720);
        const ctx = canvas.getContext("2d");

        const image = await loadImage(imageUrl);
        ctx.drawImage(image, 0, 0, 1280, 720);

        // Bande noire + texte
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

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});

app.get("/go", async (req, res) => {
    const resp = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1&type=video`
    );
    const videoId = resp.data.items[0].id.videoId;
    res.redirect(`https://youtube.com/shorts/${videoId}`);
});
