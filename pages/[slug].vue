<template>
  <div class="container">
    <Recipe v-if="recipe" :recipe="recipe" :clearRecipe="clearRecipe" />
  </div>
</template>

<script setup lang="ts">
  const router = useRouter();
  const recipe = useState("recipe");

  if (!recipe.value) {
    router.push("/");
  }

  const clearRecipe = () => {
    router.push("/");
    recipe.value = null;
  };
</script>

<style scoped></style>
