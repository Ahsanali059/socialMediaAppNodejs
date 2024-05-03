const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require("fs");
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
  Text Indexing: postSchema.index({ content: "text" }) creates a text index on the content field of the Post schema. This allows for efficient text-based searches on the content field.
Pre-remove Hook: This code defines a pre-remove middleware function that will execute before a Post document is removed from the database.
Error Handling: The code wraps the core functionality in a try-catch block to handle any potential errors that might occur during the removal process. If an error occurs, it calls next(err) to pass the error to the next middleware or error handler in the chain.
File Removal: If the Post document being removed has a fileUrl property, it extracts the filename from the URL using path.basename(this.fileUrl). Then, it constructs the absolute path to the file on the server using path.join(__dirname, "../assets/userFiles", filename). After that, it asynchronously deletes the file from the filesystem using fs.unlink.
Cascade Deletion: It deletes associated data/documents related to the post being removed:
It deletes all comments associated with the post using await this.model("Comment").deleteMany({ _id: this.comments }).
It deletes any report related to the post using await this.model("Report").deleteOne({ post: this._id }).
It removes the reference to the post from any user's savedPosts array using $pull operator in updateMany.
Call to next(): Once the cleanup tasks are complete, it calls next() to proceed with the removal of the Post document from the database.




*/