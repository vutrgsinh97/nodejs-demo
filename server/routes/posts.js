const express = require("express");
const router = express.Router();

const Post = require("../models/posts");
const verifyToken = require("../middleware/auth");

/**
 * @route /api/posts
 * @method POST
 * @desc add new post
 * @access Private
 */

router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is requirement",
    });
  }

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();

    res
      .status(200)
      .json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route /api/posts
 * @method GET
 * @desc get all posts
 * @access Private
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route /api/posts/id
 * @method PUT
 * @desc update post
 * @access Private
 */

router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is requirement",
    });
  }

  try {
    let updatedPost = {
      title,
      description: description || "",
      url: url ? (url.startsWith("https://") ? url : `https://${url}`) : "",
      status: status || "TO LEARN",
    };

    // condition check if post is existing and this user can mofify him/her post
    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      {
        new: true,
      }
    );

    // user not authorised to update post
    if (!updatedPost) {
      return res
        .status(401)
        .json({ success: false, message: "Post not found or user anthorised" });
    }

    res.status(200).json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route /api/post/id
 * @method DELETE
 * @desc delete post
 * @access Private
 */

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    if (!deletedPost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    }

    res.status(200).json({
      success: true,
      post: deletedPost,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
