export default {};

declare global {
  interface Recipe {
    title: String;
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
    image: string;
    slug: string;
    saved: boolean;
  }
}
