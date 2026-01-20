const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

app.use('/uploads', express.static(uploadsDir))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

const products = require('./products.json')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/products', (req, res) => {
  res.json(products)
})

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
  res.json({ 
    message: 'Image uploaded successfully',
    imageUrl: imageUrl
  })
})

app.post('/products', upload.single('image'), (req, res) => {
  const { name, detail, price, category1, category2, img_src } = req.body

  if(!name || !price) {
    return res.status(400).json({error: 'Product is missing name or price'})
  }
  
  let imageUrl = img_src || ''
  if (req.file) {
    imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`
  }
  
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    detail: detail || '',
    price: parseFloat(price),
    img_src: imageUrl,
    category1: category1 || '',
    category2: category2 || ''
  }
  
  products.push(newProduct)
  res.status(201).json({
    message: "Product added successfully",
    product: newProduct
  })
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((p) => p.id == id)
  res.json(product)
})

app.put('/products/:id', (req, res) => {
  const { id } = req.params
  const { name, detail, price, category1, category2, img_src } = req.body

  const product = products.find(p => p.id == id)
  const index = products.indexOf(product)

  products[index].name = name
  products[index].detail = detail
  products[index].price = price
  products[index].category1 = category1
  products[index].category2 = category2
  products[index].img_src = img_src

  res.json(product)
})

app.delete('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((p) => p.id == id)
  products.splice(products.indexOf(product), 1)
  res.json(product)
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})