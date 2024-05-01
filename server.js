const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

const fs = require('fs');

const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}


const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect('mongodb+srv://kalyan_smarden:28a42b2e@cluster0.bdgvuqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose schema and model
const ImageSchema = new mongoose.Schema({
  name: String,
  image: String,
  code: String,
  city: String,
});
const Image = mongoose.model('Image', ImageSchema);

//root endpoint to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
  });

// Endpoint to upload image and save data
app.post('/upload', upload.single('image'), async (req, res) => {
    const { name, code, city } = req.body;
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`; // Using template string for PORT
  
    const image = new Image({ name, image: imageUrl, code, city });
    await image.save();
  
    res.status(201).send({ message: 'Image uploaded and data saved!', data: image });
  });
  

// Serve images statically
app.use('/uploads', express.static('uploads'));

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
