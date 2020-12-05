const { Post, User, Profile } = require("../models");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { post } = require("request");
const e = require("express");
const addPosts = async (req, res, next) => {
  // res.send("testing");
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: err.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error);
  }
};
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const deletePostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //We need to check ownership of whether user deleting this post owns this post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.status(200).json({ msg: "Post Deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const likeAPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post is already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post is already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json({
      msg: "Liked this Post",
      likes: post.likes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const unlikeAPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post is already unliked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.status(200).json({
      msg: "unliked this Post",
      likes: post.likes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const addComments = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: err.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    const newcomment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    post.comments.unshift(newcomment);
    await post.save();
    res.status(200).json({ msg: "New Comment Added", post });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
const deleteCommentById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (!post.comments) {
      return res.status(404).json({ msg: "No comments to delete" });
    }
    //pull out a comment for post array
    const comment = post.comments.find((comment) => {
      return comment._id == req.params.comment_id;
    });

    //Make sure comment Exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment Does not Exist" });
    }
    //We need to check ownership of whether user deleting this comment owns this comment
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "User not authorized to delete this comment" });
    }
    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.status(200).json({
      msg: "Comments Deleted",
      comments: post.comments,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  addPosts: addPosts,
  getAllPosts: getAllPosts,
  getPostById: getPostById,
  deletePostById: deletePostById,
  likeAPost: likeAPost,
  unlikeAPost: unlikeAPost,
  addComments: addComments,
  deleteCommentById: deleteCommentById,
};
