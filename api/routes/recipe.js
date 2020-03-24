const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const recipeController = require('../controllers/recipes');
const storage = require('../../multer-storage/multer-storage');

const upload = multer({ storage });

router.post('/', checkAuth, upload.single('image'), recipeController.postRecipe);

router.patch('/', checkAuth, upload.single('image'), recipeController.patchRecipe);

router.get('/:recipeId', recipeController.getRecipe);

router.post('/list', recipeController.getRecipes);

router.post('/recipes-count', recipeController.getRecipesCount);

router.get('/recipe-versions/:recipeId', recipeController.getRecipeVersions);

module.exports = router;
