const Joi = require("joi");
const express = require("express");
const app = express();

//parse JSON data for all incoming requests
app.use(express.json());

//data
let courses = [
    { id: 1, name: "Introduction to Computer Science" },
    { id: 2, name: "Data Structures and Algorithms" },
    { id: 3, name: "Object-Oriented Programming" },
    { id: 4, name: "Web Development" },
    { id: 5, name: "Database Systems" },
];


// route handler for GET requests to "/"" and "/api/courses"
app.get("/", (req, res) => {
    res.send(courses);
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    let course = courses.find((course) => course.id === +req.params.id);
    const index = courses.indexOf(course);
    if (!course) res.status(404).send("the course  with the given ID is not found");

    console.log(courses);
    res.send({ course, index });
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(course, schema);
}

//route handler for POST requests to  "/api/courses"
app.post("/api/courses", (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    courses.push(course);
    console.log(courses);
    res.send(course);
});



//route handler for Put requests to  "/api/courses/:id"
app.put("/api/courses/:id", (req, res) => {
    let course = courses.find((course) => course.id === +req.params.id);
    const index = courses.indexOf(course);
    if (!course) {
        return res.status(404).send("the course with the given ID is not found");
    }

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const updatedCourse = {
        id: course.id,
        name: req.body.name,
    };
    courses[index] = updatedCourse;
    console.log(courses);
    return res.status(200).send(updatedCourse);
});



//route handler for delete requests to  "/api/courses/:id"
app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find((course) => course.id === +req.params.id);
    if (!course) {
        res.status(404).send("the course with the given ID is not found");
        res.send(course);
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    console.log(courses);

    res.send(course);

});

// env. variable to handle production & dev port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
