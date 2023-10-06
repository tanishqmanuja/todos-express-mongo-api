import mongoose, { Schema, SchemaTypes } from "mongoose";

export const TodoEntitySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Todo = mongoose.model("Todo", TodoEntitySchema);
