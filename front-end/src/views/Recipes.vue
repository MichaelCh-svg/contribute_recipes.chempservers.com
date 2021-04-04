<template>
<div class="home">
  <h1>Recipe collection</h1>
  <p>Click on a recipe to view or comment.</p>
  <p>Consider contributing recipes that are healthy and 
    delicious at the same time. Dark chocolate is healthy.
  </p>
  <section class="image-gallery">
    <router-link class="image" v-for="item in items" :key="item.id" :to="'/recipe/' + item._id">
       <!-- <router-link :key="item.id" :to="{ title: 'item', params: { id: item.id }}">> -->
        <h2>{{item.title}}</h2>
        <!-- <div @click = "setCurrentRecipe(item)"> -->
        <img :src="item.path" />
        <!-- </div> -->
        <p class="description">{{item.description}}</p>
        <p>click recipe for instructions</p>
        <button>comments</button>
      <!-- </router-link> -->
    </router-link>
  </section>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'Home',
   data() {
    return {
     items: [],
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    // async setCurrentRecipe(item){
    //   try {
    //     let response = await axios.getOne("/api/items/"+item._id);
    //     this.$root.$data.currentRecipe = response.data;
    //     return true;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}
/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}
.image-gallery {
  column-gap: 1.5em;
}
.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}
.image img {
  width: 100%;
}
/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}
/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}
/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>