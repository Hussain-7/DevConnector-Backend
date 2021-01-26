const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { ProfileController } = require("../../controllers");
const { check, validationResult } = require("express-validator");
const { Profile } = require("../../models");
const profileController = require("../../controllers/profileController");

//@route Get api/profile/me
//@desc Get current Users profile
//@access Private
router.get("/me", auth, ProfileController.getCurrentUserProfile);

//@route post api/profile
//@desc Create and update User profile
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  ProfileController.createUser
);

//@route get api/profile
//@desc Get all Profiles
//@access Public
router.get("/", profileController.getAllProfiles);

//@route get api/profile/:id
//@desc Get profile by id
//@access Public
router.get("/user/:user_id", profileController.getProfileById);

//@route delete api/profile
//@desc Get all Profile,user & posts
//@access Private
router.delete("/", profileController.deleteProfile);

//@route Put api/profile/experience
//@desc Add or Update experiences
//@access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  profileController.updateExperience
);

//@route Delete api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access Private
router.delete("/experience/:exp_id", auth, profileController.deleteExperience);

//@route Put api/profile/education
//@desc Add or Update experiences
//@access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "title is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "field of study is required").not().isEmpty(),
      check("from", "from is required").not().isEmpty(),
    ],
  ],
  profileController.updateEducation
);

//@route Delete api/profile/education/:edu_id
//@desc Delete education from profile
//@access Private
router.delete("/education/:edu_id", auth, profileController.deleteEducation);

//@route Get api/profile/github/:username
//@desc Get user repos from Github
//@access Public
router.get("/github/:username", auth, profileController.getGithubRepos);
module.exports = router;
