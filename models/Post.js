const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// mongoose schema is needed to tell how the trsucture is being arracnge when is being created

//create schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
        
});

module.exports = Post = mongoose.model('post', PostSchema);