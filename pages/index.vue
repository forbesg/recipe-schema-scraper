<template>
  <div>
    <Head>
      <title>Recipe Scraper</title>
    </Head>
    <RecipeForm />
    <div
      v-if="savedRecipes && savedRecipes.length"
      class="bg-white p-6 md:p-12 mt-6 rounded-lg max-w-screen-lg mx-auto"
    >
      <h2 class="text-xl font-medium">Your Saved Recipes</h2>
      <div
        v-for="savedRecipe in savedRecipes"
        :key="savedRecipe.self_url"
        class="relative grid grid-cols-1 sm:grid-cols-5 gap-4 shadow-md rounded p-4 my-4 mb-6"
      >
        <div
          v-if="savedRecipe.image"
          class="aspect-[4/3] overflow-hidden mr-4 w-full h-fit"
        >
          <img
            v-if="savedRecipe.image.url"
            :src="savedRecipe.image.url"
            :alt="savedRecipe.title"
            class="w-full h-full object-cover"
          />
          <img
            v-else
            :src="savedRecipe.image"
            :alt="savedRecipe.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="sm:col-span-4">
          <h3 class="text-lg font-medium mb-2">{{ savedRecipe.title }}</h3>
          <p class="text-sm">{{ savedRecipe.description }}</p>
          <div class="flex justify-between utems-center mt-4">
            <a
              :href="`/${savedRecipe.slug}#remove`"
              class="absolute flex justify-center items-center top-0 right-0 inline-block bg-red-600 text-white text-xs font-medium mt-2 p-0 w-6 h-6 rounded-full shadow-lg transform -translate-y-4 translate-x-2"
              @click.prevent="() => handleRemoveRecipe(savedRecipe.slug)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                width="48"
                viewBox="0 0 48 48"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  d="M18.05 33.05 24 27l6 6.05 2.35-2.4-5.95-6.05 5.95-6.05-2.35-2.4-6 6.05-5.95-6.05-2.4 2.4 6 6.05-6 6.05Zm-5 8.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-21.9 0V39Z"
                /></svg
            ></a>
            <a
              :href="`/${savedRecipe.slug}`"
              class="inline-block text-blue-900 text-sm font-medium mt-2"
              @click.prevent="() => handleSavedRecipeView(savedRecipe.slug)"
              >View Recipe</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const savedRecipes = useState<Recipe[]>("savedRecipes");
  const currentRecipe = useState<Recipe>("recipe");
  const router = useRouter();

  const handleSavedRecipeView = (slug: string) => {
    const selectedRecipe = savedRecipes.value.find((r) => r.slug === slug);
    if (selectedRecipe) {
      currentRecipe.value = selectedRecipe;
      router.push(`/${selectedRecipe.slug}`);
    }
  };

  const handleRemoveRecipe = (slug: string) => {
    console.log(slug);
    const updatedSavedRecipes = savedRecipes.value.filter(
      (r) => r.slug !== slug
    );
    console.log(updatedSavedRecipes);
    localStorage.setItem(
      "rs-saved-recipes",
      JSON.stringify(updatedSavedRecipes)
    );
    savedRecipes.value = updatedSavedRecipes;
  };
  onMounted(() => {
    if (window?.localStorage) {
      const localRecipes = JSON.parse(
        localStorage.getItem("rs-saved-recipes") || "[]"
      );
      savedRecipes.value = localRecipes;
    }
  });
</script>

<style scoped></style>
