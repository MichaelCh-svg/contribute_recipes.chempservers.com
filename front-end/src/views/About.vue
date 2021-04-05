<template>
<div class="admin">
  <h1>Contribute a recipe</h1>
  <div id="projects">
    <p>Edit the following recipes</p>
    <button v-for="item in items" :key=item.id @click=selectItem(item)>{{item.title}}</button>
  </div>
  
    <div class="add">
      <div class="form">
        <div class="heading" @click="selectContribute">
          <div class="circle">1</div>
          <h2>contribute</h2>
        </div>
        <input v-if="contribute" class="recipe_name" v-model="title" placeholder="Recipe name">
        <textarea v-if="contribute" v-model="text" placeholder="Short description"></textarea>
        <input v-if="contribute" type="file" name="photo" @change="fileChanged">
        <button class = "upload_button" v-if="contribute" @click="upload">Upload</button>
        <div class="upload" v-if="addItem">
        <h2>{{addItem.title}}</h2>
        <img :src="addItem.path" />
      </div>
      </div>
      
    </div>

    <div class="edit">
      <div class="upload" v-if="findItem">
        <div class ="recipe">
          <h2>Edit the {{findItem.title}} recipe</h2>
          <input class="recipe_name" v-model="findItem.title" placeholder="recipe name">
          <img :src="findItem.path" />
          <textarea v-model="text" placeholder="short description"></textarea>
          <div class="actions" v-if="findItem">
            <button @click="deleteItem(findItem)">Delete</button>
            <button @click="editItem(findItem)">Edit</button>
            <hr style = emphas>
            <br>
          </div>
        </div>
        
      
      
        <div class = "instructions" v-if="findItem">
          <h3>Edit {{findItem.title}}'s instructions</h3>
          <p>Drag and drop to change the order of instructions</p>
          <form @submit.prevent="addInstruction">
            <input type="text" v-model="instruction">
            <button type="submit">Add an instruction</button>
          </form>
          <ol>
            <!-- <li v-for="item in filteredTodos" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)"> -->
            <li v-for="instruction in instructions" :key="instruction.id" draggable="true" v-on:dragstart="dragInstruction(instruction)" v-on:dragover.prevent v-on:drop="dropInstruction(instruction)">
              <label :class="{ instruction: true, completed: instruction.completed }">
                {{ instruction.text }}
                <input type="checkbox" v-model="instruction.completed" @click="completeInstruction(instruction)" />
                <span class="checkmark"></span>
              </label>
              <button @click="deleteInstruction(instruction)" class="delete">X</button>
            </li>
          </ol>
        </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      title: "",
      file: null,
      addItem: null,
      item: null,
      items: [],
      findTitle: "",
      instructions: [],
      text: "",
      instruction: "",
      goner: "",
      findItem: null,
      drag: {},
      dragged: false,
      contribute: true,
    }
  },
  computed: {
    
  },
  created() {
    this.getItems();
    // this.setCurrentItem();
    this.findItem = this.$root.$data.currentRecipe;
  },
  methods: {
    async completeInstruction(instruction) {
      try {
        // console.log("check_before ", instruction.completed);
        await axios.put(`/api/items/${this.findItem._id}/instructions/${instruction._id}`, {
          text: instruction.text,
          completed: !instruction.completed,
        });
        // console.log("check ", instruction.completed);
        // this.getInstructions();
        // console.log("check_after ", instruction.completed);
        
      } catch (error) {
        console.log(error);
      }
    },
    async deleteInstruction(instruction) {
      try {
        await axios.delete(`/api/items/${this.findItem._id}/instructions/${instruction._id}`);
        this.getInstructions();
      } catch (error) {
        console.log(error);
      }
    },
    selectContribute(){
      if(this.contribute===false) this.contribute=true;
      else this.contribute=false;
    },
    dragInstruction(instruction) {
      this.drag = instruction;
    },
    async dropInstruction(instruction) {
      const indexInstruction = this.instructions.indexOf(this.drag);
      const indexTarget = this.instructions.indexOf(instruction);
      this.instructions.splice(indexInstruction,1);
      this.instructions.splice(indexTarget,0,this.drag);
      this.dragged = true;
    },
    
    // setCurrentItem() {
    //   this.findItem = this.$root.$data.currentRecipe;
    // },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
      this.contribute = false;
      this.getInstructions();
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/items', {
          title: this.title,
          text: this.text,
          path: r1.data.path
        });
        // this.addItem = r2.data;
        this.findTitle = "";
        this.findItem = r2.data;
        await this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.contribute = true;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        if(this.dragged){
          for(const element of this.instructions){
          await axios.delete(`/api/items/${this.findItem._id}/instructions/${element._id}`);
        }
        
        for(const element of this.instructions){
          this.addElement(element);
        }
        this.dragged=false;
        }
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          text: this.findItem.text,
        });
        this.findItem = null;
        this.contribute = true;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addInstruction() {
      try {
        await axios.post(`/api/items/${this.findItem._id}/instructions`, {
          text: this.instruction,
        });
        this.instruction = "";

        this.getInstructions();
      } catch (error) {
        console.log(error);
      }
    },
    async addElement(element) {
      try {
        await axios.post(`/api/items/${this.findItem._id}/instructions`, {
          text: element.text,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getInstructions() {
      try {
        const response = await axios.get(`/api/items/${this.findItem._id}/instructions`);
        this.instructions = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
}
</script>

  <style scoped>
  .upload_button{
    width:120px;
  }
  hr{
    height:6px;
    background-color:black;
  }
  #projects p{
    text-decoration: underline;
  }
  .recipe_name{
    max-width: 300px;
  }
  .recipe{
    display:flex;
    flex-wrap:wrap;
    flex-direction:column;
    justify-content:center;
  }
  .form{
    display:flex;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 15px;
    margin:0 auto;
    max-width:95%;
  }
  
  .form, .edit{
    border-style:solid;
    padding:20px;
    background-color:lavender;
  }
  .edit{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
  }
  .upload{
      max-width:90%;
    }
    /* .recipe, .upload{
      border-style:solid;
    } */
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}


.edit {
  display: flex;
  flex-wrap:wrap;
  flex-direction:column;
  max-width: 500 px;
  margin:10px auto;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}
input, textarea, hr{
  max-width:90%;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
  max-width:90%;
}
</style>




