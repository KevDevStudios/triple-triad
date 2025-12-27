export const sampleCards = [
  { id: 1, name: "Ifrit", values: { top: 5, right: 7, bottom: 3, left: 2 }, element: "fire", rarity: "rare", image: require('./assets/cards/ifrit.jpg') },
  { id: 2, name: "Shiva", values: { top: 2, right: 6, bottom: 5, left: 4 }, element: "ice", rarity: "rare", image: require('./assets/cards/shiva.jpg') },
  { id: 3, name: "Odin", values: { top: 8, right: 3, bottom: 6, left: 5 }, element: "thunder", rarity: "epic", image: require('./assets/cards/odin.jpg') },
  { id: 4, name: "Bahamut", values: { top: 9, right: 4, bottom: 7, left: 6 }, element: "dragon", rarity: "legendary", image: require('./assets/cards/bahamut.jpg') },
  { id: 5, name: "Tonberry", values: { top: 1, right: 1, bottom: 1, left: 1 }, element: "dark", rarity: "common", image: require('./assets/cards/tonberry.jpg') },
  { id: 6, name: "Chocobo", values: { top: 3, right: 5, bottom: 4, left: 2 }, element: "wind", rarity: "common", image: require('./assets/cards/chocobo.jpg') },
  { id: 7, name: "Quetzalcoatl", values: { top: 4, right: 6, bottom: 6, left: 3 }, element: "thunder", rarity: "rare", image: require('./assets/cards/quetzalcoatl.jpg') },
  { id: 8, name: "Diabolos", values: { top: 6, right: 2, bottom: 5, left: 7 }, element: "dark", rarity: "rare", image: require('./assets/cards/diabolos.jpg') },
  { id: 9, name: "Cactuar", values: { top: 7, right: 2, bottom: 2, left: 4 }, element: "earth", rarity: "uncommon", image: require('./assets/cards/cactuar.jpg') },
  { id: 10, name: "Selphie", values: { top: 3, right: 4, bottom: 2, left: 5 }, element: "holy", rarity: "uncommon", image: require('./assets/cards/selphie.jpg') },
  { id: 11, name: "Carbuncle", values: { top: 4, right: 3, bottom: 5, left: 2 }, element: "holy", rarity: "uncommon", image: require('./assets/cards/carbuncle.jpg') },
  { id: 12, name: "Leviathan", values: { top: 7, right: 7, bottom: 4, left: 6 }, element: "water", rarity: "epic", image: require('./assets/cards/leviathan.jpg') },
  { id: 13, name: "Phoenix", values: { top: 8, right: 5, bottom: 6, left: 7 }, element: "fire", rarity: "legendary", image: require('./assets/cards/phoenix.jpg') },
  { id: 14, name: "Ramuh", values: { top: 5, right: 8, bottom: 3, left: 4 }, element: "thunder", rarity: "rare", image: require('./assets/cards/ramuh.jpg') },
  { id: 15, name: "Titan", values: { top: 6, right: 4, bottom: 8, left: 5 }, element: "earth", rarity: "epic", image: require('./assets/cards/titan.jpg') },
  { id: 16, name: "Siren", values: { top: 3, right: 6, bottom: 4, left: 3 }, element: "water", rarity: "uncommon", image: require('./assets/cards/siren.jpg') },
  { id: 17, name: "Cerberus", values: { top: 7, right: 6, bottom: 5, left: 4 }, element: "fire", rarity: "rare", image: require('./assets/cards/cerberus.jpg') },
  { id: 18, name: "Alexander", values: { top: 9, right: 6, bottom: 8, left: 7 }, element: "holy", rarity: "legendary", image: require('./assets/cards/alexander.jpg') },
  { id: 19, name: "Gilgamesh", values: { top: 6, right: 7, bottom: 7, left: 5 }, element: "wind", rarity: "epic", image: require('./assets/cards/gilgamesh.jpg') },
  { id: 20, name: "Behemoth", values: { top: 8, right: 5, bottom: 7, left: 6 }, element: "dark", rarity: "epic", image: require('./assets/cards/behemoth.jpg') },
  { id: 21, name: "Malboro", values: { top: 5, right: 4, bottom: 6, left: 5 }, element: "poison", rarity: "rare", image: require('./assets/cards/malboro.jpg') },
  { id: 22, name: "Bomb", values: { top: 4, right: 3, bottom: 2, left: 3 }, element: "fire", rarity: "common", image: require('./assets/cards/bomb.jpg') },
  { id: 23, name: "Geezard", values: { top: 1, right: 4, bottom: 1, left: 5 }, element: "thunder", rarity: "common", image: require('./assets/cards/geezard.jpg') },
  { id: 24, name: "Adamantoise", values: { top: 6, right: 5, bottom: 9, left: 5 }, element: "earth", rarity: "epic", image: require('./assets/cards/adamantoise.jpg') },
  { id: 25, name: "Ultima", values: { top: 9, right: 8, bottom: 8, left: 9 }, element: "holy", rarity: "legendary", image: require('./assets/cards/ultima.jpg') },
  { id: 26, name: "Eden", values: { top: 8, right: 9, bottom: 7, left: 8 }, element: "holy", rarity: "legendary", image: require('./assets/cards/eden.jpg') },
  { id: 27, name: "Pandemona", values: { top: 7, right: 6, bottom: 5, left: 8 }, element: "wind", rarity: "rare", image: require('./assets/cards/pandemona.jpg') },
  { id: 28, name: "Doomtrain", values: { top: 6, right: 8, bottom: 7, left: 4 }, element: "poison", rarity: "epic", image: require('./assets/cards/doomtrain.jpg') },
  { id: 29, name: "Fenrir", values: { top: 8, right: 4, bottom: 6, left: 7 }, element: "ice", rarity: "rare", image: require('./assets/cards/fenrir.jpg') },
  { id: 30, name: "Tiamat", values: { top: 7, right: 8, bottom: 6, left: 6 }, element: "dragon", rarity: "epic", image: require('./assets/cards/tiamat.jpg') }
];

export function getRandomCards(count = 5) {
  const shuffled = [...sampleCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const elementColors = {
  fire: "#FF4500",
  ice: "#00BFFF",
  thunder: "#FFD700",
  water: "#1E90FF",
  earth: "#8B4513",
  wind: "#90EE90",
  dark: "#4B0082",
  holy: "#FFD700",
  dragon: "#9370DB",
  poison: "#8B008B"
};

export const elementSymbols = {
  fire: "🔥",
  ice: "❄️",
  thunder: "⚡",
  water: "💧",
  earth: "🌍",
  wind: "💨",
  dark: "🌑",
  holy: "✨",
  dragon: "🐉",
  poison: "☠️"
};

export const rarityColors = {
  common: "#808080",
  uncommon: "#00FF00",
  rare: "#0080FF",
  epic: "#A335EE",
  legendary: "#FF8000"
};
