const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  text: String,
  path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

const instructionsSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
},
text: String,
completed: Boolean,
})
const Instruction = mongoose.model("Instuction", instructionsSchema);

const commentsSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item'
  },
  user: String,
  text: String,
})
const Comment = mongoose.model("Comment", commentsSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});
// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    text: req.body.text,
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.put('/api/items/:id', async (req, res) => {
  
  try {
    const item = await Item.findOne({
      _id: req.params.id,
    });
    item.title = req.body.title;
    item.text = req.body.text;
    await item.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//instructions commands

app.put('/api/items/:itemID/instructions/:instructionID', async (req, res) => {
  try {
      let instruction = await Instruction.findOne({_id:req.params.instructionID, item: req.params.itemID});
      if (!instruction) {
          res.sendStatus(404);
          return;
      }
      instruction.text = req.body.text;
      instruction.completed = req.body.completed;
      await instruction.save();
      res.send(instruction);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});
app.delete('/api/items/:itemID/instructions/:instructionID', async (req, res) => {
  try {
      let instruction = await Instruction.findOne({_id:req.params.instructionID, item: req.params.itemID});
      if (!instruction) {
          res.sendStatus(404);
          return;
      }
      await instruction.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.post('/api/items/:itemID/instructions', async (req, res) => {
  try {
      let item = await Item.findOne({_id: req.params.itemID});
      if (!item) {
          res.sendStatus(404);
          return;
      }
      let instruction = new Instruction({
          item: item,
          text: req.body.text,
          completed: false,
      });
      await instruction.save();
      res.send(instruction);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.get('/api/items/:itemID/instructions', async (req, res) => {
  try {
      let item = await Item.findOne({_id: req.params.itemID});
      if (!item) {
          res.sendStatus(404);
          return;
      }
      let instructions = await Instruction.find({item:item}).populate('item');
      res.send(instructions);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//comments commands
app.post('/api/items/:itemID/comments', async (req, res) => {
  try {
      let item = await Item.findOne({_id: req.params.itemID});
      if (!item) {
          res.sendStatus(404);
          return;
      }
      let comment = new Comment({
          item: item,
          user: req.body.user,
          text: req.body.text,
      });
      await comment.save();
      res.send(comment);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.delete('/api/items/:itemID/comments/:commentID', async (req, res) => {
  try {
      let comment = await Comment.findOne({_id:req.params.commentID, item: req.params.itemID});
      if (!comment) {
          res.sendStatus(404);
          return;
      }
      await comment.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.get('/api/items/:itemID/comments', async (req, res) => {
  try {
      let item = await Item.findOne({_id: req.params.itemID});
      if (!item) {
          res.sendStatus(404);
          return;
      }
      let comments = await Comment.find({item:item}).populate('item');
      res.send(comments);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
