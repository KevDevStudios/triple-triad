# Triple Triad - Enhanced Edition 🎮

A beautiful, feature-rich implementation of the classic Triple Triad card game with stunning visuals, background music, and strategic gameplay.

![Triple Triad Start Screen](https://github.com/user-attachments/assets/187b7be3-0364-4818-90dd-d7aefe23860d)

## 🎯 New Features

### 🃏 Expanded Card Collection (30 Monsters!)
- **30 unique monster cards** featuring iconic creatures:
  - Legendary: Bahamut, Phoenix, Alexander, Ultima, Eden
  - Epic: Odin, Leviathan, Titan, Gilgamesh, Behemoth, Adamantoise, Tiamat, Doomtrain
  - Rare: Ifrit, Shiva, Quetzalcoatl, Diabolos, Ramuh, Cerberus, Pandemona, Fenrir, Malboro
  - Uncommon: Cactuar, Selphie, Carbuncle, Siren
  - Common: Tonberry, Chocobo, Bomb, Geezard

### 🎨 Beautiful Card Graphics
- **Element-based color schemes**: Each card has a unique gradient based on its element
  - Fire 🔥, Ice ❄️, Thunder ⚡, Water 💧
  - Earth 🌍, Wind 🌪️, Dark 🌑, Holy ✨
  - Dragon 🐉, Poison ☠️
- **Rarity color coding**: Cards display their rarity with distinctive colors
  - Common (Gray), Uncommon (Green), Rare (Blue)
  - Epic (Purple), Legendary (Orange)
- **Enhanced card design**: Cards feature beautiful gradients, borders, and shadows
- **Hover effects**: Cards scale up when hovered over for better interactivity

### 🎵 Background Music & Sound System
- **Background music** that loops continuously during gameplay
- **Music controls** in the top-right corner:
  - 🔊/🔇 Toggle button to turn music on/off
  - Volume slider for precise control
  - Settings persist across sessions using localStorage
- **Multiple sound effects**:
  - Card placement sound
  - Card flip/capture sound
  - Victory sound when game ends

### 🎥 Gameplay Recording
- **Record gameplay videos** to watch later or share with friends
- **Recording controls** in the top-left corner:
  - 🎥 Record button to start capturing gameplay
  - ⏹️ Stop button to end recording (with pulsing animation)
  - 💾 Download button to save your recorded video
- **Browser-based recording** using the MediaRecorder API
  - No external software required
  - Records at high quality (up to 1080p)
  - Saves as WebM format for wide compatibility
  - Option to record just the game window or entire screen

### 🎮 Enhanced User Interface
- **Stunning start screen** with:
  - Animated gradient background with pulsing orbs
  - Beautiful title with gradient text
  - Feature highlights showcasing the game's capabilities
  - Polished difficulty selector with icons
- **Improved game screen**:
  - Gradient score display with player indicators (🔵 & 🔴)
  - Enhanced game board with backdrop blur and shadows
  - Player hand display showing remaining cards
  - Active player indicator with glowing effect
- **Beautiful game over modal**:
  - Victory emojis (🏆, 🎖️, 🤝)
  - Final score display
  - Polished "Play Again" button

### ✨ Visual Effects & Animations
- **Enhanced card flip animations** with 3D effects
- **Glow animation** for active player's hand
- **Improved flip animations** with scale effects for more dramatic captures
- **Gradient backgrounds** throughout the entire app
- **Smooth transitions** on all interactive elements

### 🎯 Player Hand Display
- Shows cards remaining in each player's hand
- Visual indicators with element colors
- Active player highlighting
- Positioned at bottom-left (Player 1) and bottom-right (Player 2/AI)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Runs the app at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```

## 🎲 How to Play

1. **Select Difficulty**: Choose from Easy, Medium, or Hard
2. **Start Game**: Click the "Start Game" button
3. **Coin Flip**: A coin flip determines who goes first
4. **Record Gameplay** (Optional): Click the 🎥 Record button to start recording your game
5. **Place Cards**: Click an empty cell to place your card
6. **Capture Cards**: If your card's value beats an adjacent opponent card, you capture it!
7. **Win Condition**: The player with the most cards at the end wins
8. **Save Recording**: Click the ⏹️ button to stop recording, then 💾 to download your gameplay video

## 🎨 Card Elements

Each card belongs to one of 10 elements, affecting its visual appearance:
- 🔥 Fire (Red-Orange)
- ❄️ Ice (Blue-Cyan)
- ⚡ Thunder (Gold-Yellow)
- 💧 Water (Deep Blue)
- 🌍 Earth (Brown)
- 🌪️ Wind (Light Green)
- 🌑 Dark (Purple-Indigo)
- ✨ Holy (Gold-White)
- 🐉 Dragon (Purple)
- ☠️ Poison (Dark Purple)

## 🏆 Card Rarity System

Cards are categorized by rarity, which affects their visual appearance:
- **Common**: Basic cards with balanced stats
- **Uncommon**: Slightly better than common cards
- **Rare**: Strong cards with good synergy
- **Epic**: Very powerful cards
- **Legendary**: The strongest cards in the game

## 🎵 Audio Features

### Background Music
- Continuous looping background music
- Volume control with slider
- Mute/unmute toggle
- Preferences saved to localStorage

### Sound Effects
- **Card Placement**: Plays when placing a card
- **Card Flip**: Plays when capturing opponent cards
- **Victory**: Plays when the game ends

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Animations** - CSS animations for card flips and effects
- **LocalStorage** - Persistent music preferences
- **HTML5 Audio** - Background music and sound effects

## 📱 Responsive Design

The game features a responsive design that works on various screen sizes, with optimized layouts for desktop and mobile devices.

## 🎯 Future Enhancements

Potential future additions:
- PvP (Player vs Player) mode
- Card collection system
- Deck building
- More card artwork
- Additional sound effects
- Tournament mode
- Online multiplayer

## 📄 License

This is a fan project inspired by the classic Triple Triad card game.

## 🙏 Acknowledgments

Triple Triad is originally from Final Fantasy VIII by Square Enix. This is a non-commercial fan project created for educational and entertainment purposes.

---

**© 2025 Triple Triad Fan Project - Enhanced Edition**
