const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    creatorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    next: { type: mongoose.SchemaTypes.ObjectId, ref: 'Recipe' },
    prev: { type: mongoose.SchemaTypes.ObjectId, ref: 'Recipe' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    prepTime: { type: String, required: true },
    cookTime: { type: String, required: true },
    totalTime: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: Array, required: true },
})

module.exports = mongoose.model('Recipe', recipeSchema);
