import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'your-github-username'; // 👈 replace this
const REPO = 'sushitools-games-repo';
const BRANCH = 'main';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/public'));

app.get('/game/:appid', async (req, res) => {
  const { appid } = req.params;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${appid}.zip?ref=${BRANCH}`;

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3.raw'
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('File not found');
    const buffer = await response.buffer();

    res.setHeader('Content-Disposition', `attachment; filename="${appid}.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    res.send(buffer);
  } catch (err) {
    res.status(404).send('❌ No file found for this App ID.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sushi backend running on port ${PORT}`);
});
