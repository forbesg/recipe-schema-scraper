<script lang="ts" setup>
  let urlInput = "";
  const router = useRouter();
  const url = ref("");
  const parseError = ref("");
  const loading = ref(false);
  const currentRecipe = useState<object | null>("recipe", () => null);

  async function handleFormSubmit() {
    if (!urlInput) return;
    loading.value = true;
    url.value = urlInput;
    try {
      const { data, pending, error } = await useFetch("/api/scraper", {
        key: "recipe",
        method: "post",
        body: { data: { url } },
        server: false,
        // immediate: false,
      });

      if (data?.value?.error) {
        parseError.value = data.value.error;
        return;
      }

      loading.value = pending.value;

      if (error.value) {
        parseError.value = error.value.message;
        return;
      }

      if (data && data.value && data.value.recipe) {
        const { recipe } = data.value;

        // useState<object>("recipe", () => recipe);
        currentRecipe.value = recipe;

        const { title } = recipe;

        const slug: String = title ? title : "";
        if (!slug) {
          parseError.value = "Unable to parse the recipe";
          return;
        }
        router.push(
          `/${encodeURIComponent(
            slug.toLowerCase().trim().replaceAll(" ", "-")
          )}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  onMounted(() => {
    currentRecipe.value = null;
  });
</script>

<template>
  <div class="grid gap-6 mx-auto">
    <div>
      <form
        action="/submit-form"
        id="form"
        class="bg-white self-baseline rounded-lg p-6 md:p-12 sticky top-6 max-w-screen-lg mx-auto"
        @submit.prevent="handleFormSubmit"
      >
        <label for="recipe-url" class="block text-lg font-medium mb-2"
          >Enter the url of recipe</label
        >
        <input
          type="text"
          id="recipe-url"
          class="block w-full border p-2 mb-4"
          v-model="urlInput"
        />
        <button type="submit" v-if="!loading" :class="[{ loading }]">
          Get Recipe
        </button>
        <button
          v-else
          disabled
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            role="status"
            class="inline mr-3 w-4 h-4 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      </form>
      <div v-if="parseError" class="bg-red-600 text-white p-6 lg:px-12 mt-6">
        <span>{{ parseError }}</span>
      </div>
    </div>
  </div>
</template>
