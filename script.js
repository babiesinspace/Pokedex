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

class ImperialistOppressor {
  constructor(name, minions){
    this.name = name
    this.minions = minions || []
  }
  all(){
    return this.minions
  }
  get(pokemon){
    return this.minions.filter(function(monster){return monster.name === pokemon})
  }
}

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

function catchPokemon(pokeNameOrIdNumber){
  return $.ajax({
    url: "https://pokeapi.co/api/v2/pokemon/" + pokeNameOrIdNumber,
    success: function(response){
      pokeHash.name = response.name
      pokeHash.image = response.sprites.front_default
      pokeHash.pokeNum = response.id
      pokeHash.types = response.types.map(function(type){return type.type.name})
      pokeHash.height = response.height
      pokeHash.weight = response.weight
      response.abilities.map(function(power){pokeHash.abilities.push({name: power.ability.name, isHidden: power.is_hidden})})
      response.stats.map(function(statistic){setStats(statistic)})
      let pokemon = new Pokemon(pokeHash)
      console.log(pokemon)
      return pokemon
    },
    error: function(error){
      console.log(error)
    }
  })
}

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

catchPokemon("4").done(function(result){
  charmander = result; 
  mySlaves.push(charmander)
}).done(catchPokemon("26").done(function(result){
  raichu = result; 
  mySlaves.push(raichu)
})).done(catchPokemon("135").done(function(result){
  jolteon = result; 
  mySlaves.push(jolteon)
})).done(function(result){despot = new ImperialistOppressor("Despot", mySlaves)}).done(function(result){alert("Loaded")})

// console.log(mySlaves)

// console.log(mySlaves)

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