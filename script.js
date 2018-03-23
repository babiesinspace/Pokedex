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
class ImperialistOppressor {
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
    return this.minions.filter(function(monster){return monster.name === pokemon})
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
      response.stats.map(function(statistic){setStats(statistic)})
      //create a new pokemon
      let pokemon = new Pokemon(pokeHash)
      console.log(pokemon)
      //return the pokemon
      return pokemon
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
  pokeHash.stats.push(obj)
}

let charmander = {}
let raichu = {}
let jolteon = {}
let mySlaves = []
let despot = undefined

//each function call will create a new pokemon. must use the .done() callback in order to only push the pokemon into the slave array once the ajax call has completed and the pokemon has been initialized (then the next pokemon, and the next)
catchPokemon("4").done(function(result){
  charmander = result; 
  mySlaves.push(charmander)
}).done(catchPokemon("26").done(function(result){
  raichu = result; 
  mySlaves.push(raichu)
})).done(catchPokemon("135").done(function(result){
  jolteon = result; 
  mySlaves.push(jolteon)
})).done(function(result){
  //once you have all of your pokemon, you can initialize a new trainer with your pokemon array
  despot = new ImperialistOppressor("Despot", mySlaves)
}).done(function(result){alert("Loaded")})

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