const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})
userSchema.plugin(passportLocalMongoose); // Passport-Local Mongoose will automatically add a username, hash and salt field(keys) to store the username, the hashed password and the salt value.
/* // for example like this a document will be stored in User collection
  email: 'sujalagr20@gmail.com',
  _id: new ObjectId('678fc31adddf27f274df791c'),
  username: 'sujal',
  salt: '3529fa7e1f7bad08c2c0efb80b95f4dade4db5f5a7c4428d844c069032e1387d',
  hash: b6e36ad7a393289fedcec5750514cb6b5a1c0826b0f683bd1bea7eac6e90026b5df24655355.......too long
*/

module.exports = mongoose.model("User", userSchema);