let user1 = "12"
let user2 = "21"
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

console.log(user1 + "_" + getRandomInt(1, 100000) + "_" + user2)