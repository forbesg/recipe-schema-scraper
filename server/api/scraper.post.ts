import fetch from "node-fetch";
import { CheerioAPI, load } from "cheerio";
import { parse } from "iso8601-duration";

export default defineEventHandler(async (event) => {
  const {
    node: { req },
  } = event;
  if (req.method !== "POST") {
    return {
      statusCode: 404,
      statusMessage: "",
      message: "Unable to access route",
    };
  }
  const { data } = await readBody(event);

  if (!data || !data.url) {
    return {
      statusCode: 404,
      message: "Unable to access route",
    };
  }

  const url = data.url;

  /**
   * Some Recipe Schema data list methods as @HowToSteps
   */
  function formatMethodSchema(methodsArray: any) {
    return Array.isArray(methodsArray)
      ? methodsArray.map((method) => method.text || method)
      : { type: "String", content: methodsArray };
  }

  interface RecipeSchema {
    name: String;
    description: string;
    recipeYield: string;
    recipeIngredient: Array<string>;
    recipeInstructions: Array<string>;
    prepTime: string | null;
    cookTime: string | null;
    totalTime: string | null;
    image: string[] | string;
  }

  function scrapeRecipeSchema($: CheerioAPI) {
    const recipe: Recipe = {
      title: "",
      description: "",
      cuisine: "",
      ingredients: [],
      method: [],
      serves: null,
      rating: {
        average: 0,
        count: 0,
        total: 0,
      },
      self_url: url,
      time: {
        prep: null,
        cook: null,
        total: null,
      },
      image: "",
      slug: "",
      saved: false,
    };
    /**
     *  Load Recipe Schema and populate recipe data from that
     */
    const schemaJSON = $("script[type='application/ld+json']")
      .map((i, el) => {
        console.log(el.children[0].type);

        return JSON.parse((el.children[0] as unknown as Text).data);
      })
      .filter((i, el) => {
        return (
          el["@type"] === "Recipe" ||
          (el["@type"] &&
            el["@type"].includes &&
            el["@type"].includes("Recipe"))
        );
      });
    const recipeData = (schemaJSON["0"] as RecipeSchema) || null;

    if (!recipeData) {
      return null;
    }

    recipe.title = recipeData.name;
    recipe.ingredients = recipeData.recipeIngredient;
    recipe.method = formatMethodSchema(recipeData.recipeInstructions);
    recipe.time = { prep: null, cook: null, total: null };
    recipe.slug = recipe.title.toLowerCase().trim().replaceAll(" ", "-");
    recipe.saved = false;
    if (recipeData.prepTime && recipeData.cookTime) {
      let prepTime: any, cookTime: any;
      try {
        prepTime = parse(recipeData.prepTime);
      } catch (err) {
        console.log(err);
      }
      try {
        cookTime = parse(recipeData.cookTime);
      } catch (err) {
        console.log(err);
      }
      recipe.time = {
        prep: prepTime
          ? `${prepTime.hours ? "" + prepTime.hours + " hours" : ""} ${
              prepTime.minutes ? "" + prepTime.minutes + " minutes" : ""
            }`.trim()
          : null,
        cook: cookTime
          ? `${cookTime.hours ? "" + cookTime.hours + " hours" : ""} ${
              cookTime.minutes ? "" + cookTime.minutes + " minutes" : ""
            }`.trim()
          : null,
        total: null,
      };
    }

    if (recipeData.totalTime) {
      try {
        const totalTime = parse(recipeData.totalTime);
        recipe.time.total = `${
          totalTime.hours ? "" + totalTime.hours + " hours" : ""
        } ${
          totalTime.minutes ? "" + totalTime.minutes + " minutes" : ""
        }`.trim();
      } catch (err) {
        recipe.time.total = recipeData.totalTime;
      }
    }

    recipe.description = recipeData.description;
    recipe.serves = recipeData.recipeYield;
    recipe.image = Array.isArray(recipeData.image)
      ? recipeData.image[0]
      : recipeData.image;

    return recipe;
  }
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = load(html);
    const parsedRecipe = scrapeRecipeSchema($);

    if (!parsedRecipe) {
      return {
        statusCode: 401,
        error: "Failed to parse recipe. This site may not be supported",
      };
    } else {
      console.log("!NEED TO GET THE RATING!");
      return { statusCode: 200, recipe: { ...parsedRecipe } };
    }
  } catch (err) {
    console.log(err);
    return { statusCode: 401, error: "Invalid URI" };
  }
});
