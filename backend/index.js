const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

const projectId = 'your-project-id'; // TODO: replace with your project ID
const translate = new Translate({ projectId });

app.post('/translate', upload.single('file'), async (req, res) => {
  try {
    const { file, sourceLang, targetLang } = req.body;
    const { path } = req.file;

    const [results] = await translate.translate(
      fs.readFileSync(path, 'utf8'),
      { from: sourceLang, to: targetLang }
    );

    const translatedFilePath = `uploads/translated_${req.file.originalname}`;
    const writeStream = fs.createWriteStream(translatedFilePath);
    writeStream.write(results);
    writeStream.end();

    res.download(translatedFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while translating the file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
