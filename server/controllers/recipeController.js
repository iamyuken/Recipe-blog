require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
/*
*Get/
* Homepage
*/
exports.homepage = async (req, res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);


        const thai = await Recipe.find({'category':'Thai'}).limit(limitNumber);
        const american = await Recipe.find({'category':'American'}).limit(limitNumber);
        const indian = await Recipe.find({'category':'Indian'}).limit(limitNumber);

        const food = {latest,thai,american,indian};


        res.render("index", { title: 'Cooking Blog - Home', categories, food});
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/categories
* Categories
*/
exports.exploreCategories = async (req, res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render("categories", { title: 'Cooking Blog - categories', categories });
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/categories/:id
* Categories By Id
*/
exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params._id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
        res.render("categories", { title: 'Cooking Blog - categories', categoryById });
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/recipe/:id
* Recipe
*/
exports.exploreRecipe = async (req, res) => {
    try {


        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        res.render("recipe", { title: 'Cooking Blog - Recipe', recipe});
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*POST/search
* Search
*/

exports.searchRecipe = async (req, res) => {
    try{
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true}});
        res.render('search', { title: 'Cooking Blog - Search', recipe});
    }catch (error){
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/explore-latest
* Explore-latest
*/
exports.exploreLatest = async (req, res) => {
    try {


        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        res.render("explore-latest", { title: 'Cooking Blog - Explore Latest', recipe});
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/explore-random
* Explore-Random as JSON
*/
exports.exploreRandom = async (req, res) => {
    try {

        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render("explore-random", { title: 'Cooking Blog - Explore Random', recipe});
    }
    catch (error) {
        res.Status(500).send({ message: error.message || "Error Occured" })
    }
}

/*
*Get/submit-recipe
*Submit Recipe
*/
exports.submitRecipe = async (req, res) => {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    res.render("submit-recipe", { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj});
}

/*
*POST/submit-recipe
*Submit Recipe
*/
exports.submitRecipeOnPost = async (req, res) => {
    try{
       let imageUploadFile;
       let uploadPath;
       let newImageName;

       if(!req.files || Object.keys(req.files).length === 0){
        console.log("NO Files where uploaded");
       }
       else{
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

        imageUploadFile.mv(uploadPath,function(err){
            if(err) return res.status(500).send(err);
        })
       }
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });
        await newRecipe.save();
        req.flash("infoSubmit","Recipe has been added.");
        res.redirect("/submit-recipe");
    }catch(error){
        // res.json(error);
        req.flash("infoErrors",error);
        res.redirect("/submit-recipe");
    }
}

// async function insertDymmyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"thai-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"Butter-Chicken.jpg"
//             }
//         ]);
//     } catch (error){
//         console.log("err,"+error);
//     }
// }

// insertDymmyCategoryData();
// async function insertDymmyRecipeData(){
//     try{
//         await Category.insertMany();
//     } catch (error){
//         console.log("err,"+error);
//     }
// }

// insertDymmyRecipeData();
// async function insertDymmyRecipeData() {
//     try {
//         await Recipe.insertMany([
//             {
//                 "name": "Black Pepper Soy Chicken Wings",
//                 "description": "These peppery Asian inspired chicken wings are great as a finger-licking appetizer or as a main served with green beans and rice. Either way, it will leave your mouth tingling for more!",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "3 lbs Chicken Wings",
//                     "1/2 Cup Shallot, finely diced",
//                     "1 Tbsp Garlic, minced",
//                     "1 tsp Ginger, grated or minced",
//                     "1 Tbsp Black pepper, coarsley ground",
//                     "1/4 Cup Sweet Black Soy",
//                     "1/4 Cup Low Sodium Soy",
//                     "2 Tbsp Oyster Sauce",
//                     "1 Tbsp Sriracha (optional)",
//                     "2 Tbsp Brown Sugar/ Honey",
//                     "2 Tbs Oil",
//                     "2-3 green onions, sliced (for garnish)"
//                 ],
//                 "category": "American",
//                 "image": "Black-Pepper-Soy-Chicken-Wings.jpg"
//             },
//             {
//                 "name": "Bombay Grilled Chutney Sandwich",
//                 "description": "A green chutney sandwich in India is the equivalent of the American PB & J. It’s the unassuming tea-time staple, the quick finger sandwich you slap together and offer to unannounced guests along with a pipping hot cup of chai. It’s the sandwich of choice for road trips, breakfast, school lunch boxes and a quick after-work street snack before your commute home. There isn’t a person in India or who grew up there that I know of, that hasn’t had or known some form of a green chutney sandwich.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "Soft White Bread",
//                     "Butter/ margarine",
//                     "Green Chutney",
//                     "Boiled potato, thinly sliced",
//                     "Tomato, thinly sliced",
//                     "Cucumber, thinly sliced",
//                     "Bell pepper, thinly sliced",
//                     "Cheese, grated (optional. leave out for vegan sandwich)",
//                     "Chat Masala powder",
//                     "Ketchup (to serve it with)"
//                 ],
//                 "category": "Indian",
//                 "image": "Bombay Grilled Chutney Sandwich.jpg"
//             },
//             {
//                 "name": "Butter-Chicken",
//                 "description": "Indian restaurants simply use the previous day’s tandoori chicken in the sauce for the night day, there by avoiding waste and re-purposing it as a new dish. Not only does the spices and smokey flavor of the chicken add to the flavor of the sauce, but the sauce also re hydrates the grilled chicken and keeps it juicy and tender. If you taste a version of butter chicken where raw chicken is simply added to sauce, versus a grilled spiced chicken added to the sauce you’ll really appreciate that extra step of grilling the meat.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "3-4 Chicken Breasts/ Thighs boneless",
//                     "1 Tbsp Ginger-Garlic paste",
//                     "2 tsp Chili Powder Kashmiri Chilli or a mix of Cayenne & Paprika",
//                     "2 Tbsp Greek Yogurt plain",
//                     "1 Lime juiced",
//                     "Salt to taste",
//                     "Spices",
//                     "1 / 2 inch Cinnamon Stick",
//                     "2 - 3 Cloves",
//                     "2 - 3 Green Cardamom Pods",
//                     "1 Bay Leaf",
//                     "1 / 4 cup Butter",
//                     "1 medium Onion diced",
//                     "1 Tbsp Ginger - Garlic paste",
//                     "1 - 2 green chillies(thai)",
//                     "1(15oz) can Tomato Puree(not suace)",
//                     "6 - 8 cashews soaked in hot water",
//                     "1 Tbsp Coriander Powder",
//                     "1 / 2 tsp Cumin powder",
//                     "2 tsp Red chili powder(mix of cayenne & Paprika works)",
//                     "2 Tbsp Sugar",
//                     "Chicken stock / water",
//                     "1 / 2 cup heavy cream",
//                     "1 handful fresh cilantro chopped"
//                 ],
//                 "category": "Indian",
//                 "image": "Butter-Chicken.jpg"
//             },
//             {
//                 "name": "Chicken 65 Wings",
//                 "description": "Chicken 65 is a widely popular crispy fried, red hot chicken dish originating in Chennai, India, that is commonly served up as an appetizer or street food. There are a number of theories of how it got it’s name, one of which, is that it gained popularity in 1965. The other that seems quite plausible to me, is that it was featured on a restaurant menu as the 65th dish and was often ordered as “Chicken 65”. Other theories include that the chicken was cut up into 65 little pieces, or that there were 65 ingredients in the dish…both of these seem far-fetched to me. Whatever the case, it’s popular now and is featured on most Indian restaurant menus and there’s no two recipes of it alike. It is however essentially a batter marinated chicken (most commonly boneless small pieces) with garlic-ginger and red chili powder along with other spices.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "2-3lbs Chicken Wings ( 24-30 wings)",
//                     "Oil for frying",
//                     "1/4 cup Yogurt",
//                     "2 tsp red chili powder (Kashmiri preferably)",
//                     "1 tsp coriander powder",
//                     "½ tsp garam masala",
//                     "1 tsp grated fresh ginger",
//                     "2 tsp grated fresh garlic",
//                     "1/4 tsp black pepper",
//                     "Juice of 1/2 Lime",
//                 ],
//                 "category": "Indian",
//                 "image": "Chicken-65-Wings-Indian-Masala-Wings.jpg"
//             },
//             {
//                 "name": "Vanilla Cardamom Kulfi",
//                 "description": "A creamy frozen treat similar to ice-cream paired with fresh citrus in a syrup flavored with a hint of ginger & a splash of rose water. It’s a delicious and refreshing  fusion dessert!",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "2 1/2 cups heavy cream",
//                     "1 cup milk",
//                     "1 tsp vanilla essence",
//                     "1.5 tsp cardamom pods seeded and powdered",
//                     "1/3 cup sugar",
//                     "pinch salt",
//                     "2-4 Citrus fruits (like navel oranges, grapefruit, tangerines, blood oranges etc.)",
//                     "1/3 cup sugar",
//                     "1/3 cup water",
//                     "1 inch ginger sliced",
//                     "1/2 tsp rose water"
//                 ],
//                 "category": "Indian",
//                 "image": "Vanilla-Cardamom-Kulfi.jpg"
//             },
//             {
//                 "name": "Chinese food",
//                 "description": " Dried aromatics like shiitake mushrooms and various forms of seafood, like scallops, are also a valuable source of flavor when added to soups, stews, and braises.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "Fresh Ginger",
//                     "Fresh Garlic",
//                     "Spring onions",
//                     "corn",
//                     "Egg"
//                 ],
//                 "category": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Chocolate banoffe whoopie",
//                 "description": "The whoopie pie, a beloved American dessert, is a baked good comprised of two mound-shaped cookie-cakes with a creamy marshmallow-based filling sandwiched between them.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "2 heaped tablespoons cocoa powder , plus extra for dusting",
//                     "350 g self-raising flour",
//                     "175 g sugar",
//                     "200 ml milk",
//                     "100 ml nut or rapeseed oil",
//                     "1 large free-range egg",
//                     "BANOFFEE FILLING",
//                     "240 g dulce de leche",
//                     "3 bananas",
//                     "icing sugar , for dusting",
//                 ],
//                 "category": "American",
//                 "image": "chocolate-banoffe-whoopie-pies.jpg"
//             },
//             {
//                 "name": "Sweet",
//                 "description": "This versatile dessert that can be served hot or cold. Although there are different types of kheer recipes in India—like payasam made with lentils, semolina kheer, vermicelli kheer, apple kheer, tapioca kheer, almond kheer and even carrot kheer—the most popular kheer is made with rice and milk.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "1 cup basmati or long grain white rice, washed and rinsed",
//                     "1/2 cup water",
//                     "1 cup unsweetened condensed milk or evaporated milk",
//                     "5 cups milk",
//                     "3/4 cup slivered almonds",
//                     "3/4 cup sugar",
//                     "1 teaspoon cardamom powder"
//                 ],
//                 "category": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Mexican-food",
//                 "description": "Mexican cuisine is renowned for its vibrant flavours, bold spices, and diverse range of dishes that cater to all taste preferences. If you’re just starting to explore the world of Mexican food, the myriad of ingredients and their uses may seem overwhelming. Fear not, as this beginner’s guide will introduce you to some of the must-have elements in Mexican cuisine",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "Avocado",
//                     "Salsa Verde",
//                     "Rice",
//                     "Beans",
//                     "Corn",
//                     "Tortilla Wraps",
//                     "Chillies",
//                     "Tomatoes",
//                     "Cheese"
//                 ],
//                 "category": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Spanish-food",
//                 "description": "Spanish food varies by region and season, but there are a dozen ingredients—including spices and herbs—that appear again and again that, for people who plan on cooking Spanish recipes very often, are well worth keeping on hand.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "1 medium (ripe) mango",
//                     "1 medium tomato, finely diced",
//                     "2 medium scallions, thinly sliced",
//                     "1/4 medium habanero, seeded and minced, more to taste",
//                     "1/2 teaspoon minced fresh ginger",
//                     "1/4 teaspoon fine salt, more to taste",
//                     "1/4 teaspoon granulated sugar, more to taste",
//                     "Freshly grated zest of 1 lime, about 2 teaspoons",
//                     "1 tablespoon freshly squeezed lime juice",
//                     "Freshly grated zest of 1/2 orange, about 2 teaspoons",
//                     "1 tablespoon freshly squeezed orange juice",
//                     "1/3 cup finely chopped cilantro leaves"
//                 ],
//                 "category": "Spanish",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "Thai",
//                 "description": "Try this delicious version of Thai tom yum soup made with coconut milk (tom kha). The coconut milk gives it a little more thickness and flavor. It's an easy recipe and quick to cook up but tastes like it is Thai restaurant-quality.",
//                 "email": "yukendran@gmail.com",
//                 "ingredients": [
//                     "4 cups low-sodium chicken stock",
//                     "1 stalk lemongrass, minced",
//                     "3 makrut lime leaves, or 1 teaspoon grated lime zest",
//                     "3 to 4 medium cloves garlic, minced",
//                     "1 to 2 finely sliced red chiles, or 1/2 to 3/4 teaspoon dried crushed chile",
//                     "1 1/2 cups sliced shiitake mushrooms",
//                     "12 medium peeled shrimp",
//                     "2 cups broccoli florets, or other greens of choice",
//                     "3/4 cup cherry tomatoes",
//                     "1/2 can coconut milk",
//                     "3 tablespoons fish sauce",
//                     "1 tablespoon freshly squeezed lime juice",
//                     "1/3 cup coarsely chopped fresh cilantro",
//                     "1/2 teaspoon sugar, optional",
//                 ],
//                 "category": "Thai",
//                 "image": "thai-food.jpg"
//             },
//         ]);
//     } catch (error) {
//         console.log('err',error)
//     }
// }

// insertDymmyRecipeData();