//pokemon constructor takes a hash full of poke-data
class Pokemon {
  constructor(args) {
    this.name = args.name
    this.image = args.image
    this.pokeNum = args.pokeNum
    this.types = args.types
    this.height = args.height
    this.weight = args.weight
    this.abilities = args.abilities
    this.stats = args.stats
  }
}

//trainer constructor take a name and an array of pokemon objects
class Trainer {
  constructor(name, minions){
    this.name = name
    this.minions = minions || []
  }

  //returns the array of pokemon
  all(){
    return this.minions
  }

  //takes a string (pokemon name) and returns the data about that dude
  get(pokemon){
    let collection = this.minions.filter(function(monster){return monster.name === pokemon})
    return collection.length === 1 ? collection[0] : collection
  }
}

//will be populated with the ajax response data then passed to pokemon constructor
let pokeHash = {
  name: "",
  image: "",
  pokeNum: 0,
  types: [],
  height: 0,
  weight: 0,
  abilities: [],
  stats: []
}

//takes a pokemon name or id number and uses that parameter as the tail of the api call
function catchPokemon(pokeNameOrIdNumber){
  //must return the result of the ajax call
  return $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/" + pokeNameOrIdNumber,
    success: function(response){
      //populate the pokeHash with the ajax response
      pokeHash.name = response.name
      pokeHash.image = response.sprites.front_default
      pokeHash.pokeNum = response.id
      pokeHash.types = response.types.map(function(type){return type.type.name})
      pokeHash.height = response.height
      pokeHash.weight = response.weight
      //map through the abilities array and create a hash out of each ability - contains its name and if it is hidden
      response.abilities.map(function(power){pokeHash.abilities.push({name: power.ability.name, isHidden: power.is_hidden})})
      //pass each statistic into the setStats function
      response.stats.map(function(statistic){pokeHash.stats.push(setStats(statistic))})
      //create a new pokemon
      let pokemon = new Pokemon(pokeHash)
      //clear the array of stats so that it's specific to the pokemon (REFACTOR?)
      pokeHash.stats = []
      pokeHash.abilities = []
      //return the pokemon
      pokeArray.push(pokemon)
      console.log(pokemon)
    },
    error: function(error){
      console.log(error)
    }
  })
}

//create a key value pair for each stat and it's base value, then push into the stat array contained within the pokeHash
function setStats(statistic) {
  let obj = {}
  let name = statistic.stat.name
  let baseValue = statistic.base_stat
  obj[name] = baseValue
  return obj
  // pokeHash.stats.push(obj)
}

let charmander = {}
let raichu = {}
let jolteon = {}
let pokeArray = []
let trainer = undefined

pokeContainer = (pokemon) => {
  let name = pokemon.name

  //create encompassing div for all individual pokemon data
  let pokeDivContainer = $("<div/>").addClass(`single-pokemon-div ${name} hidden`)

  //create a container div for permanent stats
  let permanentStats = $("<div/>").addClass(`permanent-stats ${name} hidden`)

  //put perm stats in respective html elements
  let nameEl = $("<h3/>").text(name).addClass("name")
  let idNum = $("<h5/>").text("ID: " + pokemon.pokeNum.toString())
  idNum.addClass("poke-num")


  //fix elementType.. maybe set it to a <p> and iterate so the text is equal to += each element? (or just a ul)
  let elementType = []
  pokemon.types.forEach((type) => {elementType.push($("<p/>").text(type).addClass(type))})
  let height = $("<p/>").text("Height: " + (pokemon.height * 10) + "cm.").addClass("height")
  let weight = $("<p/>").text("Weight: " + ((pokemon.weight / 10).toFixed(2)) + "kg").addClass("weight")

  //create a list of abilities
  let abilitiesList = $("<ul/>").addClass("ability-list")
  pokemon.abilities.forEach((ability) => {
    if (ability.isHidden) {
      $("<li/>").text(ability.name).addClass("hidden-ability ability").appendTo(abilitiesList)
    } else {
      $("<li/>").text(ability.name).addClass("ability").appendTo(abilitiesList)
    }
  })

  //append each of these elements to the permanent stats div and then perm stats to container
  let pokeInfo = [nameEl,idNum,elementType,height,weight,abilitiesList]
  pokeInfo.forEach((e) => {$(e[0]).appendTo(permanentStats)})
  $(permanentStats).appendTo(pokeDivContainer)

  //create separate div container for image and append it
  let imageCont = $("<div/>").addClass("pokemon-image-container")
  // image: "",
  let pic = $("<img/>").attr("src", pokemon.image).addClass(name)
  let thumbnail = $("<img/>").attr("src", pokemon.image).addClass(`thumbnail thumb ${name} hidden`)
  $(pic).appendTo(imageCont)
  $(thumbnail).appendTo("#pokeball-container")
  $(imageCont).appendTo(pokeDivContainer)

  //currentstats
  //create a container div for current stats
  let currentStats = $("<div/>").addClass(`current-stats hidden ${name}`)
  let healthList = $("<ul/>").addClass("stat-list")
  pokemon.stats.forEach((stat) => {$("<li/>").text(Object.keys(stat)[0] + ": " + Object.values(stat)[0]).addClass("stat").appendTo(healthList)})
  $(healthList).appendTo(currentStats)
  $(currentStats).appendTo(pokeDivContainer)
  return pokeDivContainer
}

createContainer = (pokemon) => {
  let newDiv = pokeContainer(trainer.get(pokemon))
  $(newDiv).appendTo("#window-screen")
}


//each function call will create a new pokemon. must use the .done() callback in order to only push the pokemon into the slave array once the ajax call has completed and the pokemon has been initialized (then the next pokemon, and the next)
catchPokemon("4").done(catchPokemon("26")).done(catchPokemon("135")).done(function(result){
  //once you have all of your pokemon, you can initialize a new trainer with your pokemon array
  trainer = new Trainer("trainer", pokeArray)
  }).done(function(trainer){
    createContainer("charmander")
    createContainer("raichu")
    createContainer("jolteon")
  })

let pokemonDivName
let pokeballDiv = $("#pokeball-container")

$("#pokeball1").hover(function(){
  $(this).attr("src", trainer.minions[0].image)
}, function(){
  $(this).attr("src", "poke-ball.jpeg")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer.minions[0].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})
//You can probably use a filter to find the right name.. later

$("#pokeball2").hover(function(){
  $(this).attr("src", trainer.minions[1].image)
}, function(){
  $(this).attr("src", "poke-ball.jpeg")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer.minions[1].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

$("#pokeball3").hover(function(){
  $(this).attr("src", trainer.minions[2].image)
}, function(){
  $(this).attr("src", "poke-ball.jpeg")
}).on("click", function(){
  $(pokeballDiv).addClass("hidden")
  pokemonDivName = ".single-pokemon-div." + trainer.minions[2].name
  $(pokemonDivName).removeClass("hidden") //switch to remove class once buttons
})

//Make pokeinfo disappear
$("#middle").on("click", function(){
  $(pokeballDiv).removeClass("hidden")
  $(pokemonDivName).addClass("hidden")
})

// $("#left").on("click", function(){
//   let children = $(pokemonDivName).children()
//   // console.log($(pokemonDivName).children())
//   if ($(children)[0].hasClass("hidden")) {
//     $(children)[0].removeClass("hidden")
//     $(children)[1].addClass("hidden")
//   }
//   if ($(children)[1].hasClass("hidden") && $(children)[0].hasClass("hidden")) {
//     $(children)[1].removeClass("hidden")
//     $(children)[2].addClass("hidden")
//   }
// })

// $("#left").on("click", function(){
//   let children = $(pokemonDivName).children()
//   // console.log($(pokemonDivName).children())
//   if ($(children).index(0).hasClass("hidden")) {
//     $(children).index(0).removeClass("hidden")
//     $(children).index(1).addClass("hidden")
//   }
//   if ($(children).index(1).hasClass("hidden") && $(children)[0].hasClass("hidden")) {
//     $(children).index(1).removeClass("hidden")
//     $(children).index(2).addClass("hidden")
//   }
// })

//My Pokemon:
//Charmander #5
//Raichu #27
//Jolteon #136

//Perm Stats:
//Name
//Image
//Poke Number
//Type
//Height
//Weight
//Abilities
//Evolution Chain (nice to have) (https://pokeapi.co/api/v2/evolution-chain/2/ === Charmander)

//Base Stats: {statName: numValue}
// HP
// Attack
// Defense
// Special Attack 
// Special Defense
// Speed