const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const contentSchema = new Schema({
  spiderServiceContentId: {
    type: String,
    required: true
  },
  spiderServiceId: {
    type: ObjectId,
    required: true,
    index: true
  },
  contentType: String,
  content: {
    html: String,
    content: Array,
    originCreatedAt: String
  },
  title: String,
  tags: [
    {
      name: String,
      value: String,
      score: Number
    }
  ],
  createdAt: { type: Number, default: Date.now().valueOf() }
});

const ContentModel = mongoose.model("content", contentSchema);
module.exports = {
  model: ContentModel
};
