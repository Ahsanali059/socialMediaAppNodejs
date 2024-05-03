const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const { promisify } = require("util");

const pendingPostSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending"],
      default: "pending",
    },
    confirmationToken: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

pendingPostSchema.pre("remove", async function (next) {
  try {
    if (this.fileUrl) 
    {
      
      const filename = path.basename(this.fileUrl);
      const deleteFilePromise = promisify(fs.unlink)(
        path.join(__dirname, "../assets/userFiles", filename)
      );
      await deleteFilePromise;
    }
    next();
  } catch (error) {
    next(error);
  }
});

pendingPostSchema.pre("deleteMany", async function (next) {
  try 
  {
    const pendingPosts = await this.model.find(this.getFilter());
    for (const post of pendingPosts) {
      if (post.fileUrl) {
        const filename = path.basename(post.fileUrl);
        const deleteFilePromise = promisify(fs.unlink)(
          path.join(__dirname, "../assets/userFiles", filename)
        );
        await deleteFilePromise;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("PendingPost", pendingPostSchema);


/*
This code appears to be a middleware function defined using Mongoose's Schema middleware functionality. It's a pre-remove hook, meaning it will execute before a document is removed from the database.

Let's break down what this code does:

Schema Middleware: It attaches a function to the remove event of a document in a Mongoose model. This means that whenever a document is removed from the database, this function will be executed.
Error Handling: It wraps the core functionality in a try-catch block to handle any potential errors that might occur during the removal process. If an error occurs, it calls next(error) to pass the error to the next middleware or error handler in the chain.
*/


