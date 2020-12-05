const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const { PostController } = require("../../controllers");

const { Post } = require("../../models");
//@route Post api/posts
//@desc Create a Post
//@access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  PostController.addPosts
);
//@route Get api/posts
//@desc Get all Post
//@access Private
router.get("/", auth, PostController.getAllPosts);

//@route Get api/posts
//@desc Get Post by Id
//@access Private
router.get("/:id", auth, PostController.getPostById);

//@route Delete api/posts/:id
//@desc Delete Post by Id
//@access Private
router.delete("/:id", auth, PostController.deletePostById);

//@route  Put api/posts/like/:id
//@desc   Like a post
//@access Private
router.put("/like/:id", auth, PostController.likeAPost);

//@route  Put api/posts/like/:id
//@desc   Like a post
//@access Private
router.put("/unlike/:id", auth, PostController.unlikeAPost);

//@route  Put api/posts/comment/:id
//@desc   Comment on a post
//@access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  PostController.addComments
);

//@route  Put api/posts/comment/:id
//@desc   Comment on a post
//@access Private
router.delete(
  "/comment/:id/:comment_id",
  auth,
  PostController.deleteCommentById
);

module.exports = router;
