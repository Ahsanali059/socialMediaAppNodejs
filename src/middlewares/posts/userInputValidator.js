const {body,validationResult } = require("express-validator");

const MAX_LENGTH = 3000;

const postValidator = [
    body("content")
        .isLength({min:10})
        .withMessage("Your post is too short,Shere more of your thoughts")
        .isLength({max:MAX_LENGTH})
        .withMessage("Post cannot exceed 3000 Charcters")
        .trim(),
];

const commentValidator = [
    body("content")
      .isLength({ min: 1 })
      .withMessage("Your comment is too short. Share more of your thoughts!")
      .isLength({ max: MAX_LENGTH })
      .withMessage("Comment cannot exceed 3000 characters.")
      .trim(),
  ];