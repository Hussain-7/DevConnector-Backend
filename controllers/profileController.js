const { Profile, User } = require("../models");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const request = require("request");
//@route Get api/profile/me
//@desc Get current Users profile
//@access Private

const getCurrentUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//@route post api/profile
//@desc Create and update User profile
//@body company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin
//@access Private
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  // Skills - Spilt into array
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  // Social
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;
  console.log(profileFields);
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      console.log("Successfully Updated user Object");
      return res.json({ profile: profile });
    }
    //create
    //Using Profile as an constructor
    profile = new Profile(profileFields);
    await profile.save();
    console.log("Successfully created a new User Object");
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
const getProfileById = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ message: "There is no profile" });
    }
    res.json(profile);
  } catch (error) {
    if ((error.kind = "ObjectId")) {
      return res.status(400).json({ message: "There is no profile" });
    }
    res.status(500).res.send("Server Error");
  }
};
const deleteProfile = async (req, res, next) => {
  try {
    //Deleting Profile
    await Profile.findOneAndRemove({ user: req.params.id });
    //Delete User
    await User.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ message: "Profile deleted Succesfuly!!!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
const updateExperience = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    res.status(200).json({ profile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
const deleteExperience = async (req, res, next) => {
  console.log(req.params);
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const updateEducation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;

  const neweducation = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(req.body);
    await profile.save();
    res.status(200).json({ profile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
const deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (removeIndex == -1)
      return res.json({ message: "No education record exist!!" });
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
const getGithubRepos = async (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        process.env.githubClientId
      )}&client_secret=${process.env.githubSecret}`,
      mehod: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode != 200) {
        return res.status(404).json({ msg: "No Github Profile Found" });
      }
      res.json({ Repos: JSON.parse(body) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getCurrentUserProfile: getCurrentUserProfile,
  createUser: createUser,
  getAllProfiles: getAllProfiles,
  getProfileById: getProfileById,
  deleteProfile: deleteProfile,
  updateExperience: updateExperience,
  deleteExperience: deleteExperience,
  updateEducation: updateEducation,
  deleteEducation: deleteEducation,
  getGithubRepos: getGithubRepos,
};
