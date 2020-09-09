const express = require("express");
const ExperienceModel = require("./schema");
const UserModel = require("../registration/schema");
const e = require("express");
const multer = require("multer");
const upload = multer({});
const fs = require("fs-extra");
const path = require("path");
const json2csv = require("json2csv").parse;

const experienceRoute = express.Router();

experienceRoute.post("/:id", async (req, res) => {
  const newExperience = new ExperienceModel({
    ...req.body,
  });
  console.log(newExperience);

  await newExperience.save();

  const user = UserModel.findById(req.params.id);

  user.experiences.push(newExperience._id);
  await user.save();
  res.status(201).send("ok");
});

experienceRoute.get("/export/csv/:userName", async (req, res, next) => {
  const id = req.params.id;
  const experience = await ExperienceModel.find({
    username: req.params.userName,
  });

  const fields = [
    "_id",
    "role",
    "company",
    "startDate",
    "endDate",
    "description",
    "area",
    "username",
    "createdAt",
    "updatedAt",
  ];
  const data = { fields };
  const csvString = json2csv(experience, data);
  res.setHeader(
    "Content-disposition",
    "attachment; filename=shifts-report.csv"
  );
  res.set("Content-Type", "text/csv");
  res.status(200).send(csvString);
});

experienceRoute.get("/:id", async (req, res) => {
  try {
    const experience = await ExperienceModel.find({
      username: req.params.userName,
      _id: req.params.id,
    });

    res.send(experience);
  } catch (error) {
    console.log(error);
  }
});

experienceRoute.put("/:id", async (req, res) => {
  const id = req.params.id;
  const experience = await ExperienceModel.findOneAndUpdate(
    { username: req.params.userName, _id: req.params.id },
    {
      ...req.body,
    }
  );
  if (experience) {
    res.send("UPDATED");
  }
});

experienceRoute.delete("/:id", async (req, res) => {
  try {
    await ExperienceModel.findOneAndDelete({
      _id: req.params.id,
      username: req.params.userName,
    });
    res.send("deleted");
  } catch (error) {
    console.log(error);
  }
});

experienceRoute.post(":id/image", upload.single("image"), async (req, res) => {
  const imagesPath = path.join(__dirname, "/images");
  await fs.writeFile(
    path.join(
      imagesPath,
      req.params.id + "." + req.file.originalname.split(".").pop()
    ),
    req.file.buffer
  );

  var obj = {
    image: fs.readFileSync(
      path.join(
        __dirname +
          "/images/" +
          req.params.id +
          "." +
          req.file.originalname.split(".").pop()
      )
    ),
  };

  const experience = await ExperienceModel.findOneAndUpdate(
    {
      $and: [{ _id: req.params.id }, { username: req.params.userName }],
    },
    {
      ...obj,
    },
    { new: true }
  );

  res.send("IMAGE UPLOADED");
});

experienceRoute.post("");
module.exports = experienceRoute;
