const mongoose = require('mongoose');

const Recipe = require('../models/recipe');

const createRecipe = (req, res, func) => {
    const image = req.file ? req.file.location : req.body.image;
    console.log(req.body)
    const divider = req.body.divider + ',';

    const recipeObj = {
        _id: new mongoose.Types.ObjectId(),
        creatorId: req.body.creatorId,
        name: req.body.name,
        description: req.body.description,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        totalTime: req.body.totalTime,
        image: image,
        date: req.body.date,
        ingredients: req.body.ingredients.split(divider),
        instructions: req.body.instructions.split(divider),
    }

    const prev = req.body.prevRecipeId;
    if (prev) recipeObj['prev'] = prev;

    const recipe = new Recipe(recipeObj);

    recipe.save()
        .then(recipe => {
            if (func) {
                func(req, res, recipe);
            } else {
                res.status(200).json(recipe);
            }
        })
        .catch(err => res.status(500).json({ error: err }));
}

const patchRecipe = (req, res, newRecipe) => {
    Recipe.findOneAndUpdate({ _id: req.body.prevRecipeId }, { $set: { next: newRecipe._id } })
        .exec()
        .then(() => {
            res.status(200).json(newRecipe);
        })
        .catch(err => res.status(500).json({ error: err }));
}

const getVersions = (recipeId, direction, callback) => {
    return new Promise((resolve) => {
        if (!recipeId) resolve([]);
        Recipe.findOne({ _id: recipeId })
            .exec()
            .then((recipe) => {
                if (recipe[direction]) {
                    callback(recipe[direction], direction, getVersions)
                        .then(prevRecipe => {
                            resolve([...prevRecipe, recipe])
                        })
                } else {
                    resolve([recipe])
                }
            })
    })
}



/** CONTROLLERS */

exports.getRecipes = (req, res, next) => {
    const skip = +req.query.skip;
    const limit = +req.query.limit;

    let query = { next: { $exists: false } };
    if (req.body.userId) query['creatorId'] = req.body.userId;

    Recipe.find(query)
        .populate({ path: 'creatorId' })
        .sort('-date')
        .skip(skip)
        .limit(limit)
        .exec()
        .then(recipes => {
            res.status(200).json(recipes);
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
};

exports.getRecipesCount = (req, res, next) => {
    let query = { next: { $exists: false } };
    if (req.body.userId) query['creatorId'] = req.body.userId;

    Recipe.countDocuments(query)
        .exec()
        .then(count => {
            res.status(200).json(count);
        })
        .catch(err => {
            console.log('err')
            res.status(500).json({ error: err })
        });
};

exports.postRecipe = (req, res, next) => {
    createRecipe(req, res);
};

exports.patchRecipe = (req, res, next) => {
    createRecipe(req, res, patchRecipe);
};

exports.getRecipe = (req, res, next) => {
    const recipeId = req.params.recipeId;

    Recipe.findOne({ _id: recipeId })
        .populate({ path: "creatorId" })
        .exec()
        .then(recipe => {
            res.status(200).json(recipe);
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.getRecipeVersions = (req, res, next) => {
    const recipeId = req.params.recipeId;

    Recipe.findOne({ _id: recipeId })
        .exec()
        .then((recipe) => {
            Promise.all([
                getVersions(recipe.prev, 'prev', getVersions),
                getVersions(recipe.next, 'next', getVersions),
            ]).then((recipes => {
                const result = [...recipes[0], recipe, ...recipes[1].reverse()];
                res.status(200).json(result);
            }))
        })
};

/** CONTROLLERS */

