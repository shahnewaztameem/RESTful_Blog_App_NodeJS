var express = require('express'),
bodyParser = require('body-parser'),
mongoose    = require('mongoose'),
app         = express();

//db connection config
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true }));

//blog Schema config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

// RESTful routes

var Blog = mongoose.model("Blog", blogSchema);

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX route
app.get('/blogs', (req, res) => {
    Blog.find({}, (error, blogs) => {
        if(error) {
            console.log(error);
        }
        else {
            res.render('index',{blogs: blogs});
        }
    });
    
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
    // create a blog
    Blog.create(req.body.blog, (error, newBlog) => {
        if(error) {
            res.render('new');
        }
        else {
            // redirest to index
            res.redirect('/blogs');
        }
    });
});

// SHOW route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (error, foundPost) => {
        if(error) {
            res.redirect('/blogs');
        }
        else {
            res.render('show', {post: foundPost});
        }
    })
});

// EDIT route
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (error, foundPost) => {
        if(error) {
            res.redirect('/blogs');
        }
        else {
            res.render('edit', {post: foundPost});
        }
    });
});

app.listen(3000, () => {
    console.log("Server is runnig on port 3000");
})