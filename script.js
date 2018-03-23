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


$.ajax({
  url: "https://pokeapi.co/api/v2/pokemon/4",
  success: function(response){
    pokeHash.name = response.name
    pokeHash.image = response.sprites.front_default
    pokeHash.pokeNum = response.id
    pokeHash.types = response.types.map(function(type){return type.type.name})
    pokeHash.height = response.height
    pokeHash.weight = response.weight
    response.abilities.map(function(power){pokeHash.abilities.push({name: power.ability.name, isHidden: power.is_hidden})})
    response.stats.map(function(statistic){setStats(statistic)})
  },
  error: function(error){
    console.log(error)
  }
})

function setStats(statistic) {
  let obj = {}
  let name = statistic.stat.name
  let baseValue = statistic.base_stat
  obj[name] = baseValue
  pokeHash.stats.push(obj)
}

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