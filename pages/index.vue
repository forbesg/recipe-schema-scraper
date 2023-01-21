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
        class="grid grid-cols-1 sm:grid-cols-5 gap-4 shadow p-4 my-4 mb-4"
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
        <div class="sm:col-span-3">
          <h3 class="text-lg font-medium mb-2">{{ savedRecipe.title }}</h3>
          <p class="text-sm">{{ savedRecipe.description }}</p>
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
</template>

<script setup lang="ts">
  const savedRecipes = useState<[Recipe]>("savedRecipes");
  const currentRecipe = useState<Recipe>("recipe");
  const router = useRouter();

  const handleSavedRecipeView = (slug: string) => {
    const selectedRecipe = savedRecipes.value.find((r) => r.slug === slug);
    if (selectedRecipe) {
      currentRecipe.value = selectedRecipe;
      router.push(`/${selectedRecipe.slug}`);
    }
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
