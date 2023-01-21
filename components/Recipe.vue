<script lang="ts" setup>
  const props = defineProps({
    recipe: {
      type: [Object],
      required: true,
    },
    clearRecipe: {
      type: Function,
      required: true,
    },
  });
  const currentRecipe = useState("recipe");
  const saveRecipe = () => {
    if (window?.localStorage) {
      const localSavedRecipes = JSON.parse(
        localStorage.getItem("rs-saved-recipes") || "[]"
      );

      const savedRecipe = { ...props.recipe };
      savedRecipe.saved = true;
      localSavedRecipes.push(savedRecipe);

      localStorage.setItem(
        "rs-saved-recipes",
        JSON.stringify(localSavedRecipes)
      );
      currentRecipe.value = savedRecipe;
    }
  };
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-6">
    <Head>
      <Title>{{ recipe.title }} | Your Recipe</Title>
    </Head>

    <div
      class="self-baseline lg:sticky top-6 bg-cover bg-center meta text-sm md:text-base lg:p-12"
    >
      <h2
        v-html="recipe.title"
        class="text-3xl mb-8 col-span-2 font-medium lg:text-4xl"
      ></h2>
      <div class="flex flex-wrap justify-between mb-8">
        <div class="recipe-meta text-xs font-medium text-gray-600 mb-4">
          <div v-if="recipe.serves">
            Serves:
            {{
              Array.isArray(recipe.serves) ? recipe.serves[0] : recipe.serves
            }}
          </div>
          <div v-if="recipe.time" class="">
            <div v-if="recipe.time.prep">Prep Time: {{ recipe.time.prep }}</div>
            <div v-if="recipe.time.cook">Cook Time: {{ recipe.time.cook }}</div>
            <div v-if="recipe.time.total">Time: {{ recipe.time.total }}</div>
          </div>
        </div>
        <button v-if="!recipe.saved" class="h-fit" @click="() => saveRecipe()">
          Save Recipe
        </button>
      </div>

      <div class="description my-4 text-sm md:text-base mb-8">
        <p v-html="recipe.description"></p>
      </div>
      <div
        v-if="recipe.image"
        class="image-container aspect-[8/5] overflow-hidden rounded-lg"
      >
        <img
          v-if="recipe.image.url"
          :src="recipe.image.url"
          :alt="recipe.title"
          :width="recipe.image.width"
          :height="recipe.image.height"
          class="w-full h-full object-cover"
        />
        <img
          v-else
          :src="recipe.image"
          :alt="recipe.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="bg-white rounded-lg p-8 mb-16 md:mb-6 md:p-12">
      <div>
        <div class="mb-12">
          <h3 class="text-lg lg:text-xl font-medium mb-4">Ingredients</h3>

          <ul>
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <span v-html="ingredient"></span>
            </li>
          </ul>
        </div>
        <div class="mb-12">
          <h3 class="text-lg lg:text-xl font-medium mb-4">Method</h3>
          <div
            v-if="recipe.method.type === 'String'"
            v-html="recipe.method.content"
            class="sting-interpolated-method"
          ></div>
          <ol v-else>
            <li v-for="(step, index) in recipe.method" :key="`step-${index}`">
              <span v-html="step"></span>
            </li>
          </ol>
        </div>
        <div
          class="bg-white fixed bottom-0 left-0 w-full py-4 px-6 md:px-0 flex items-center justify-center text-center md:static"
        >
          <button
            class="flex-1 flex justify-center"
            @click="() => clearRecipe()"
          >
            Clear
          </button>
          <a
            :href="recipe.self_url"
            target="_blank"
            rel="noopener"
            class="button text-center ext_link flex-1 flex justify-center"
            >View Original
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                fill="currentColor"
                class="w-4 h-4 ml-1"
              >
                <path
                  d="M9.45 43.25q-1.95 0-3.325-1.375Q4.75 40.5 4.75 38.55V9.45q0-1.95 1.375-3.35Q7.5 4.7 9.45 4.7h13.5v4.75H9.45v29.1h29.1v-13.5h4.75v13.5q0 1.95-1.4 3.325-1.4 1.375-3.35 1.375Zm10.8-12.2L17 27.75l18.3-18.3h-9.35V4.7H43.3v17.35h-4.75v-9.3Z"
                />
              </svg>
            </i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  ol {
    @apply pl-4 list-decimal;
  }
  li {
    @apply mb-2;
  }
</style>
