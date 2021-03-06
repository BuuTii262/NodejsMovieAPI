const Joi = require("@hapi/joi");
const { MongoDBNamespace } = require("mongodb");
const { dbCon } = require("../configuration");

class Comment {
  constructor(commentData) {
    this.data = commentData;
    this.data.createdAt = new Date();
    this.data.updatedAt = new Date();
  }

  static validate(commentText) {
    const validation = Joi.string().max(300).validate(commentText);

    if (validation.error) {
      const error = new Error(validation.error.message);
      error.statusCode = 400;
      return error;
    }

    return null;
  }

  save() {
    return new Promise((resolve, reject) => {
      dbCon(
        "comments",
        async (db, db2) => {
          try {
            const comment = await db.insertOne(this.data);

            this.data["id"] = comment.insertedId;

            await db2.updateOne(
              { _id: this.data["movieId"] },
              {
                $push: {
                  comments: {
                    $each: [
                      {
                        _id: this.data["id"],
                        username: this.data["username"],
                        text: this.data["text"],
                      },
                    ],
                    $slice: -10,
                  },
                },
              }
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        "movies"
      );
    });
  }

  static edit(commentId, text) {
    return new Promise((resolve, reject) => {
      dbCon("comments", async (db) => {
        try {
          await db.updateOne(
            { _id: commentId },
            {
              $set: { text: text },
              $currentDate: { updatedAt: true },
            }
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static delete(commentId) {
    return new Promise((resolve, reject) => {
      dbCon("comments", async (db) => {
        try {
          await db.deleteOne({ _id: commentId });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = Comment;
