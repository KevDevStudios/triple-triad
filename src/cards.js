export const sampleCards = [
  { id: 1, name: "Ifrit", values: { top: 5, right: 7, bottom: 3, left: 2 } },
  { id: 2, name: "Shiva", values: { top: 2, right: 6, bottom: 5, left: 4 } },
  { id: 3, name: "Odin", values: { top: 8, right: 3, bottom: 6, left: 5 } },
  { id: 4, name: "Bahamut", values: { top: 9, right: 4, bottom: 7, left: 6 } },
  { id: 5, name: "Tonberry", values: { top: 1, right: 1, bottom: 1, left: 1 } },
  { id: 6, name: "Chocobo", values: { top: 3, right: 5, bottom: 4, left: 2 } },
  { id: 7, name: "Quetzalcoatl", values: { top: 4, right: 6, bottom: 6, left: 3 } },
  { id: 8, name: "Diabolos", values: { top: 6, right: 2, bottom: 5, left: 7 } },
  { id: 9, name: "Cactuar", values: { top: 7, right: 2, bottom: 2, left: 4 } },
  { id: 10, name: "Selphie", values: { top: 3, right: 4, bottom: 2, left: 5 } }
];

export function getRandomCards(count = 5) {
  const shuffled = [...sampleCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
