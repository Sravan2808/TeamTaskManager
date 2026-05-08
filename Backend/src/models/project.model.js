import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: String,

  description: String,

  color: {
    type: String,
    default: '#6366f1'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.model('Project', projectSchema)