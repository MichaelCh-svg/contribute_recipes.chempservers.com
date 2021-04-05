<template>
<div>
  <div class="page_top">
  <br>
  <h1>{{recipe.title}}</h1>
  <img :src="recipe.path" />
  <p>{{recipe.description}}</p>
  <h2>instructions:</h2>
  </div>
  <ol>
    <!-- <li v-for="item in filteredTodos" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)"> -->
    <li v-for="instruction in instructions" :key="instruction.id">
      <label :class="{ instruction: true, completed: instruction.completed }">
        {{ instruction.text }}
        <input type="checkbox" v-model="instruction.completed" @click="completeInstruction(instruction)" />
        <span class="checkmark"></span>
      </label>
    </li>
  </ol>
  <!-- <div id="projects">
    <p>Select a recipe</p>
    <div class="image" v-for="item in items" :key="item.id" :to="'/recipe/' + item._id">
<button v-for="item in items" :key=item.id @click=selectItem(item)>{{item.title}}</button>
   
   <a href ="'/recipe/' + item._id"><button>
   {{item.title}}></button></a>
   
    </div>
  </div> -->
  <div class="info">
            <!-- <h1>{{ recipe.title }}</h1> -->
            <!-- <h1>"index" {{amount}}</h1>
            <h1>{{ this.$route.params.id }}</h1> -->
  </div>
  <div class="image">
       <!-- <router-link :key="item.id" :to="{ title: 'item', params: { id: item.id }}">> -->
        <!-- <h2>{{item.title}}</h2> -->
    
        
      
    </div>
  <!-- <div class="image">
    <img :src="'/images/'+ product.image">
  </div>
  <div class = "description">
    <p>Author's note: {{product.description}}</p>
  </div> -->
  <div class = 'comments'>
          <h2>visiter comments</h2>
          <form v-on:submit.prevent="addComment()">
            <input v-model="user" placeholder="Name">
            <textarea v-model="text"></textarea>
            <br />
            <button type="submit">Comment</button>
          </form>
          <br>
          <h3>Comments</h3>
          
          <ul>
  
    <!-- <li v-for="item in filteredTodos" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)"> -->
    <li v-for="comment in comments" :key="comment.id">
            <form v-on:submit.prevent="deleteComment(comment)">
            <p>{{comment.text}}</p>
            <p><i>-- {{comment.user}}</i></p>
            
            <button class="delete" type="submit"> delete</button>
            </form>
    </li>
  </ul>
          <!-- <div v-for="comment in product.comments" :key="comment.number">
            <hr>
            <p>{{comment.text}}</p>
            <p><i>-- {{comment.author}}</i></p>
            <form v-on:submit.prevent="settrue(comment)">
            <button type="submit"> edit</button>
            </form>
            <form v-on:submit.prevent="del(comment)">
            <button type="submit"> delete</button>
            </form>
            <div v-if='comment.editing===true'>
              <form v-on:submit.prevent="edit(comment)">
                <input v-model="comment.author">
                <textarea v-model="comment.text"></textarea>
                <br />
                <button type="submit">Finish edit</button>
              </form>
            </div> 
          </div> -->
    </div>
</div>
</template>

<script>
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
export default {
  name: 'Product',
  data() {
    return {
      random: 0,
      amount: 0,
      recipe: {},
      comments: [],
      number: 1,
      addedName: '',
      addedComment: '',
      items: [],
      instructions: [],
      instruction: {},
      drag: {},
      text: "",
      user: "",
      editing: false,
    }
  },
  created() {
    this.getItems();
    this.getItems();
    // console.log("created recipe", this.recipe.title);

    // this.recipe = this.items.find(item => item.id === this.$route.params.id);
    // myArray.filter(x => x.id === '45')
    // this.product = this.$root.$data.products.find(product => product.id === parseInt(this.$route.params.id));
    // this.random =
    //   Math.floor(Math.random() * 90) + 10;
    // // this.amount = this.random * parseFloat(this.product.price.replace(/\$|,/g, ''));
    // this.amount = this.amount.toFixed(2);
  },
  methods: {
    async completeInstruction(instruction) {
      try {
        axios.put(`/api/items/${this.recipe._id}/instructions/${instruction._id}`, {
          text: instruction.text,
          completed: !instruction.completed,
        });
        // this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = await response.data;
        // this.recipe=response.data[0];
        this.amount = response.data.indexOf(x => x.id ===parseInt(this.$route.params.id));
        // for(recipe of item)
        // this.recipe = response.data.reduce(item => item.id === parseInt(this.$route.params.id));
      //  console.log("items[0] ", this.items[0]);
       for (const x of this.items){
         if(x._id === this.$route.params.id){
           this.recipe = x;
           this.getInstructions();
           this.getComments();
          //  console.log("finished", this.recipe.title);
          //  console.log(x.title,"x",x._id, "params", this.$route.params.id );
         }
        //  console.log(x.title,"x",parseInt(x._id), "params", parseInt(this.$route.params.id) );
        //  console.log ("recipe", ":", this.recipe.title);
        //  console.log("params", parseInt(this.$route.params.id));
       }
       console.log("recipe ", this.recipe.title);
       
       
       return true;
      } catch (error) {
        console.log(error);
      }
    },
    
    async getInstructions() {
      try {
        const response = await axios.get(`/api/items/${this.recipe._id}/instructions`);
        this.instructions = response.data;
        console.log("instructions", this.instructions[0]);
      } catch (error) {
        console.log(error);
      }
    },

    //comments
    async deleteComment(comment) {
      try {
        await axios.delete(`/api/items/${this.recipe._id}/comments/${comment._id}`);
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },

    async editComment(comment) {
      try {
        // console.log("check_before ", instruction.completed);
        await axios.put(`/api/items/${this.recipe._id}/comments/${comment._id}`, {
          text: comment.text,
          user: comment.user,
        });
        // console.log("check ", instruction.completed);
        // this.getInstructions();
        // console.log("check_after ", instruction.completed);
        this.editing=false;
        
      } catch (error) {
        console.log(error);
      }
    },

    async addComment() {
      try {
        await axios.post(`/api/items/${this.recipe._id}/comments`, {
          user: this.user,
          text: this.text,
          
        });
        this.text = "";
        this.user = "";

        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },

    async getComments() {
      try {
        const response = await axios.get(`/api/items/${this.recipe._id}/comments`);
        this.comments = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  
    // addComment(product) {
    //     console.log("comment, method called");
    //     product.comments.push({
    //       author: this.addedName,
    //       text: this.addedComment,
    //       number: this.number,
    //       editing: false,
    //     });
    //     this.number += 1;
    //     this.addedComment = '';
    //     this.addedName = '';
    //   },
      settrue(comment){
        comment.editing = true;
      },
    //   edit(comment){
    //     comment.editing=false;
    //   },
    //   del(comment) {
    //     // let object = this.comments.reduce(erase=>erase.number=comment.number);
    //     let index = this.product.comments.indexOf(comment);
    //     this.product.comments.splice(index, 1);
    //   },
    
  }
}
</script>

<style scoped>
.page_top{
  background-color:sienna;
  padding:10px;
}
img{
  max-width:500px;
  max-width:90%;
  max-height: 500px;
}
ol{
  background-color:lightsteelblue;
  padding:5px;
  padding-left:13px;
  border-style:solid;
}
ol li{
  padding:6px;
  padding-left:12px;
}
ol, li{
  border-style:solid;
}
li{
  background-color:lightseagreen;
  margin-top:25px;
}
hr{
  background-color:black;
}
.comments{
  background-color:sienna;
  padding-top: 20px;
  padding-bottom: 20px;
}
.intro {
  font-style: italic;
}
.info {
  /* background: #000000; */
  color: #000;
  padding: 10px 30px;
  height: 40px;
  margin-bottom:10px;
}
.products {
  display: flex;
  flex-wrap: wrap;
}
.products img {
  border: 1px solid #333;
  height: 50px;
  width: 40px;
  margin-left: 10px;
  object-fit: cover;
}
textarea {
    width: 90%;
    max-width: 500px;
    height: 100px;
}
form{
  margin-top: 20px;
  display:flex;
  flex-wrap: wrap;
  flex-direction:column;
  align-items: center;
}
 input {
  width: 160px;
}
button{
  width:120px;
}
.delete{
  width:70px;
  background-color:cadetblue;
}
</style>