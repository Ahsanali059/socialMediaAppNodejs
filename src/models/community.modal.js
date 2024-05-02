const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
    },

    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    bannedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        default: [],
      },
    ],
  },

  {
    timestamps: true,
  }
);
//index(): This is a method provided by Mongoose to define indexes on fields of a schema. Indexes in MongoDB improve query performance by allowing the database to quickly locate documents based on the indexed fields.
//{ name: "text" }: This specifies the field on which the text index will be created. In this case, it's the name field. By creating a text index on the name field, you enable full-text search capabilities for that field within the communitySchema collection.
//name: Refers to the field name on which the index will be created.
//"text": Indicates the type of index to create. When using "text" as the index type, MongoDB creates a text index, which allows for efficient full-text search queries.


communitySchema.index({ name: "text" });

module.exports = mongoose.model("Community", communitySchema);