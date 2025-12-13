export const sampleCards = [
  { id: 1, name: "Ifrit", values: { top: 5, right: 7, bottom: 3, left: 2 }, element: "fire", rarity: "rare" },
  { id: 2, name: "Shiva", values: { top: 2, right: 6, bottom: 5, left: 4 }, element: "ice", rarity: "rare" },
  { id: 3, name: "Odin", values: { top: 8, right: 3, bottom: 6, left: 5 }, element: "thunder", rarity: "epic" },
  { id: 4, name: "Bahamut", values: { top: 9, right: 4, bottom: 7, left: 6 }, element: "dragon", rarity: "legendary" },
  { id: 5, name: "Tonberry", values: { top: 1, right: 1, bottom: 1, left: 1 }, element: "dark", rarity: "common" },
  { id: 6, name: "Chocobo", values: { top: 3, right: 5, bottom: 4, left: 2 }, element: "wind", rarity: "common" },
  { id: 7, name: "Quetzalcoatl", values: { top: 4, right: 6, bottom: 6, left: 3 }, element: "thunder", rarity: "rare" },
  { id: 8, name: "Diabolos", values: { top: 6, right: 2, bottom: 5, left: 7 }, element: "dark", rarity: "rare" },
  { id: 9, name: "Cactuar", values: { top: 7, right: 2, bottom: 2, left: 4 }, element: "earth", rarity: "uncommon" },
  { id: 10, name: "Selphie", values: { top: 3, right: 4, bottom: 2, left: 5 }, element: "holy", rarity: "uncommon" },
  { id: 11, name: "Carbuncle", values: { top: 4, right: 3, bottom: 5, left: 2 }, element: "holy", rarity: "uncommon" },
  { id: 12, name: "Leviathan", values: { top: 7, right: 7, bottom: 4, left: 6 }, element: "water", rarity: "epic" },
  { id: 13, name: "Phoenix", values: { top: 8, right: 5, bottom: 6, left: 7 }, element: "fire", rarity: "legendary" },
  { id: 14, name: "Ramuh", values: { top: 5, right: 8, bottom: 3, left: 4 }, element: "thunder", rarity: "rare" },
  { id: 15, name: "Titan", values: { top: 6, right: 4, bottom: 8, left: 5 }, element: "earth", rarity: "epic" },
  { id: 16, name: "Siren", values: { top: 3, right: 6, bottom: 4, left: 3 }, element: "water", rarity: "uncommon" },
  { id: 17, name: "Cerberus", values: { top: 7, right: 6, bottom: 5, left: 4 }, element: "fire", rarity: "rare" },
  { id: 18, name: "Alexander", values: { top: 9, right: 6, bottom: 8, left: 7 }, element: "holy", rarity: "legendary" },
  { id: 19, name: "Gilgamesh", values: { top: 6, right: 7, bottom: 7, left: 5 }, element: "wind", rarity: "epic" },
  { id: 20, name: "Behemoth", values: { top: 8, right: 5, bottom: 7, left: 6 }, element: "dark", rarity: "epic" },
  { id: 21, name: "Malboro", values: { top: 5, right: 4, bottom: 6, left: 5 }, element: "poison", rarity: "rare" },
  { id: 22, name: "Bomb", values: { top: 4, right: 3, bottom: 2, left: 3 }, element: "fire", rarity: "common" },
  { id: 23, name: "Geezard", values: { top: 1, right: 4, bottom: 1, left: 5 }, element: "thunder", rarity: "common" },
  { id: 24, name: "Adamantoise", values: { top: 6, right: 5, bottom: 9, left: 5 }, element: "earth", rarity: "epic" },
  { id: 25, name: "Ultima", values: { top: 9, right: 8, bottom: 8, left: 9 }, element: "holy", rarity: "legendary" },
  { id: 26, name: "Eden", values: { top: 8, right: 9, bottom: 7, left: 8 }, element: "holy", rarity: "legendary" },
  { id: 27, name: "Pandemona", values: { top: 7, right: 6, bottom: 5, left: 8 }, element: "wind", rarity: "rare" },
  { id: 28, name: "Doomtrain", values: { top: 6, right: 8, bottom: 7, left: 4 }, element: "poison", rarity: "epic" },
  { id: 29, name: "Fenrir", values: { top: 8, right: 4, bottom: 6, left: 7 }, element: "ice", rarity: "rare" },
  { id: 30, name: "Tiamat", values: { top: 7, right: 8, bottom: 6, left: 6 }, element: "dragon", rarity: "epic" }
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

export const rarityColors = {
  common: "#808080",
  uncommon: "#00FF00",
  rare: "#0080FF",
  epic: "#A335EE",
  legendary: "#FF8000"
};
