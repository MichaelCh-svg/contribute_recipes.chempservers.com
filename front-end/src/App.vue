<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Collection</router-link> |
      <router-link to="/about">Contribute your recipe</router-link> 
      <!-- <router-link to="/portfolio">Portfolio</router-link> | -->
      <div class = "title">Healthy Recipe Collections</div>
    </div>
    
    <router-view/>
    <div class='footer'>
      <a class = 'footer-item' href='https://github.com/MichaelCh-svg/contribute_recipes.chempservers.com.git'> Git Code</a>
    </div>
  </div>
</template>

<style>
*{
    margin: 10px;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
*{
  padding: 50 px;
}
template{
  background-color:gainsboro;
}
.title {
  margin-top: 10px;
}
.title h1 {
  font-size: 30px;
}
p{
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
h1{
  font-family:cursive;
}
h2{
  font-family:Verdana, Geneva, Tahoma, sans-serif;
}
.footer{
    display:flex;
    justify-content: center;
    height: 100px;
    background-color:olive;
}
.footer-item{
    align-self:center;
}
#nav {
  padding: 30px;
  border-style:solid;
  border-width: 3px;
  background-color:olive;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
