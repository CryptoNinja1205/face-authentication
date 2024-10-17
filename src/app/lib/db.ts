import mongoose from 'mongoose'

const Schema = mongoose.Schema
const baseURL = process.env.MONGODB_URI;
// Connect to MongoDB with error handling
mongoose
  .connect(baseURL!)
  .then(() => {
    console.log('Connected successfully')
  })
  .catch(error => {
    console.error('Connection error:', error)
  })

mongoose.Promise = global.Promise

// Define and export the database object
export const db = {
  Users: userModel()
}

// Function to define the user model schema
function userModel() {
  const schema = new Schema({
    email: {type: String, require: true},
    faceFeatures: { type: String, required: true },
  })

  // // Define a partial index for the avatar field
  // schema.index({ avatar: 1 }, { sparse: true })

  // Return the existing model if already defined, else create a new one
  return mongoose.models.Users || mongoose.model('Users', schema)
}
