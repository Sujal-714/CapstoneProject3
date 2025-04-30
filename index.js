import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;
const posts = [];

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
  res.render("index.ejs",{posts});
});
app.get("/create",(req,res)=>{
    res.render("create");
  });
  
const upload = multer({ dest: 'public/uploads' }); 
app.post("/submit", upload.single('image'),(req,res) =>{
  const { title, description } = req.body;
  const id = uuidv4();
  const image = req.file ? req.file.filename : null;
  posts.push({id,title,description,image});

  res.redirect("/"); 
});

app.get("/post/:id",(req,res) =>{
  const post = posts.find(p=>p.id === req.params.id);
  if(!post) return res.status(404).send("Post not found");
  res.render("post",{post});
});
app.get("/edit/:id",(req,res) =>{
  const post = posts.find(p=>p.id === req.params.id);
  if(!post) return res.status(404).send("Post not found");
  res.render("edit",{post});
});

app.post("/edit/:id",upload.single('image'),(req,res)=>{
  const post = posts.find(p=>p.id === req.params.id);
if(post){
  if(req.body.title && req.body.title !== post.title){
  post.title = req.body.title;  
  }
  if(req.body.description && req.body.description !== post.description){
    post.description = req.body.description; 
    }
    if (req.file) {
      post.image = req.file.filename;
    }
}
res.redirect("/post/"+req.params.id);
});
app.post("/delete/:id",(req,res) =>{
const index = posts.findIndex(p => p.id === req.params.id);
if(index !== -1) posts.splice(index,1);
res.redirect("/");
});
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
});