import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    prority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
    },

    dueDate: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Task", taskSchema);