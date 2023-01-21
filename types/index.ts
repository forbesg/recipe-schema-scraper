export default {};

declare global {
  interface RecipeImage {
    url: string;
    thumbnail: string | null;
  }

  interface Recipe {
    title: string;
    description: string;
    cuisine: string;
    ingredients: Array<string> | null;
    method: Array<string> | Object;
    serves: string | null;
    rating: {
      average: Number;
      count: Number;
      total: Number;
    };
    self_url: string;
    time: {
      prep: string | null;
      cook: string | null;
      total: string | null;
    };
    image: RecipeImage | string | any;
    slug: string;
    saved: boolean;
  }
}
