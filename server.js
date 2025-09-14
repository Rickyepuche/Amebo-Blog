import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import { formatContent, preserveParagraphs, formatTopic } from "./index.js";

const port = process.env.port || 3000;
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-"+file.originalname);
  }
})
const upload = multer({storage: storage})

app.use(express.json())
app.use(express.static("public"));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uniqueId = new Date().toISOString().split('T')[0];
const DATA_FILE = "./data/blogs.json";
let blogItems = [];

if (fs.existsSync(DATA_FILE)){
  const fileData = fs.readFileSync(DATA_FILE);
  blogItems = JSON.parse(fileData);
}

function SaveToFile(){
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogItems, null, 2))
}


app.get("/", (req, res) => {
  res.render("index.ejs", {blogPosts: blogItems});
});

app.get("/blog/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let selected = blogItems[id]
  if (!selected){
    return res.send("Topic not found");
  }
  let othersId = id;
  if (othersId > blogItems.length-1){
    othersId = id - 1;
  }else if (othersId < blogItems.length-1){
    othersId = id + 1;
  }
    

  res.render("blog.ejs", {
    blogPosts: blogItems,
    blogTopic: selected.topic,
    blogDescription: selected.description,
    blogContent: selected.content,
    blogImage: selected.image,
    blogTag: selected.tag,
    blogUniqueId: selected.uniqueId,
    id: id,
    ID: othersId
  });
});

app.get("/add-blog", (req, res) => {
  res.render("add-form.ejs");
});

app.get("/login", (req, res)=> {
  res.render("login-form.ejs");
});

app.post("/", (req, res)=>{
  const email = "richardedigin@gmail.com";
  const password = "richard";
  let { userEmail, userPassword } = req.body;
  if (userEmail===email){
    
  }
})

app.get("/articles", (req, res) => {
  res.render("articles.ejs", {blogPosts: blogItems});
});

app.get("/subscribe", (req, res) => {
  res.render("subscribe.ejs");
});


app.post("/add", upload.single("image"), (req, res)=>{

  let { tag, topic, content, description } = req.body;
  content = preserveParagraphs(content);
  description = formatContent(description);
  topic = formatTopic(topic);
  let image = "/uploads/default.jpg";
  let newBlog = {
    tag: tag,
    uniqueId: uniqueId,
    topic: topic,
    content: content,
    description: description,
    image: image 
  };
  if (req.file) {
    newBlog.image = "/uploads/" + req.file.filename;
  }


  // if (description.length > 220){
   // description = description.substring(0, 220);
  //}
  //if (topic.length > 60){
    //topic = topic.substring(0, 60);
  //}

  blogItems.push(newBlog);
  SaveToFile();

  res.redirect("/");
});


app.post("/delete:index", (req, res) => {
    let index = parseInt(req.params.index);
    if (index >= 0 && index < blogItems.length){
        blogItems.splice(index, 1);
    }
    res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});