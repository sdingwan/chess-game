# ♛ Chess Game - Web Edition ♛

<div align="center">

![Chess Game Banner](https://img.shields.io/badge/Chess-Game-blue?style=for-the-badge&logo=chess.com)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A fully functional, beautiful web-based chess game built with pure JavaScript**

[🎮 Play Live Demo](https://sdingwan.github.io/chess-game)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#features)
- [🎮 Game Preview](#game-preview)
- [🚀 Quick Start](#quick-start)
- [🛠️ Technical Details](#technical-details)
- [🎪 Game Rules](#game-rules-implemented)
- [📱 Browser Compatibility](#browser-compatibility)
- [🤝 Contributing](#contributing)

---

## 🌟 Features

### ♟️ **Complete Chess Implementation**
- ✅ All standard chess piece movements and rules
- ✅ Check, checkmate, and stalemate detection
- ✅ Special moves: Castling, En passant, Pawn promotion
- ✅ Move validation and king safety enforcement
- ✅ Turn-based gameplay with proper alternation

### 🎨 **Beautiful User Interface**
- 🎯 Modern, responsive design that works on all devices
- 🌈 Smooth animations and visual feedback
- 💡 Intuitive piece selection and move highlighting
- 📱 Mobile-friendly touch controls
- 🎪 Professional gradient backgrounds and styling

### 🚀 **Advanced Features**
- 📝 Complete move history with chess notation
- 🔄 Undo/Redo functionality
- 👑 Pawn promotion modal with piece selection
- 📊 Captured pieces display
- ⚡ Real-time game status updates
- 🔔 Check/Checkmate visual indicators

## 🎮 Game Preview

The game features a beautiful, modern interface with:
- **Interactive Chess Board**: Click to select pieces, highlighted valid moves
- **Visual Feedback**: Green dots for valid moves, red circles for captures
- **Game Status Panel**: Current player, game state, captured pieces
- **Move History**: Complete notation of all moves played
- **Responsive Design**: Perfect on desktop, tablet, and mobile

## 🚀 Quick Start

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sdingwan/chess-game.git
   cd chess-game
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your preferred browser
   open index.html
   # or double-click the index.html file
   ```

3. **Start Playing!**
   - No installation required
   - No dependencies needed
   - Works offline

### 🎯 How to Play

1. **Select a Piece**: Click on any piece of your color (White starts first)
2. **See Valid Moves**: Available moves are highlighted in green
3. **Make Your Move**: Click on a highlighted square to move
4. **Special Moves**: 
   - **Castling**: Click king, then click two squares toward the rook
   - **En Passant**: Automatically available when conditions are met
   - **Pawn Promotion**: Choose your piece when pawn reaches the end

## 🛠️ Technical Details

### 📁 Project Structure
```
chess-game/
├── index.html          # Main game interface
├── styles.css          # Complete styling and animations
├── chess.js            # Full chess engine and game logic
└── README.md           # This documentation
```

### 🎯 Core Technologies
- **HTML5**: Semantic structure and game layout
- **CSS3**: Modern styling, animations, and responsive design
- **Vanilla JavaScript**: Complete chess engine with all rules
- **No Dependencies**: Pure web technologies, no frameworks needed

### ⚡ Performance Features
- Efficient move validation algorithms
- Optimized rendering for smooth gameplay
- Responsive design for all screen sizes
- Cross-browser compatibility

## 🎪 Game Rules Implemented

<details>
<summary><b>🔍 Click to see all implemented chess rules</b></summary>

### Standard Piece Movements
- **♟️ Pawns**: Forward movement, diagonal capture, two-square initial move
- **🏰 Rooks**: Horizontal and vertical movement
- **🐎 Knights**: L-shaped movement pattern
- **⛪ Bishops**: Diagonal movement
- **👸 Queen**: Combined rook and bishop movement
- **♔ King**: One square in any direction

### Special Rules
- **🏰 Castling**: Both kingside and queenside castling
- **👻 En Passant**: Special pawn capture rule
- **👑 Pawn Promotion**: Promote to Queen, Rook, Bishop, or Knight
- **⚠️ Check Detection**: Automatic check detection and highlighting
- **🏁 Checkmate**: Game end when king cannot escape check
- **🤝 Stalemate**: Draw when no legal moves available

</details>

## 📱 Browser Compatibility

| Browser | Status | Version |
|---------|--------|---------|
| Chrome | ✅ Fully Supported | 90+ |
| Firefox | ✅ Fully Supported | 88+ |
| Safari | ✅ Fully Supported | 14+ |
| Edge | ✅ Fully Supported | 90+ |
| Mobile | ✅ Responsive | iOS 14+, Android 10+ |

## 🎨 Customization

The game is built with modular CSS and JavaScript, making it easy to customize:

```css
/* Example: Change board colors */
.square.light { background: #f0d9b5; }
.square.dark { background: #b58863; }

/* Example: Modify piece size */
.piece { font-size: 45px; }
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌟 Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **💾 Commit your changes**: `git commit -m 'Add amazing feature'`
4. **📤 Push to the branch**: `git push origin feature/amazing-feature`
5. **🎉 Open a Pull Request**

### 🐛 Bug Reports
Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🎮 Live Demo**: [Play Now](https://sdingwan.github.io/chess-game)
- **📖 Documentation**: [GitHub Wiki](https://github.com/sdingwan/chess-game/wiki)
- **🐛 Bug Reports**: [Issues](https://github.com/sdingwan/chess-game/issues)
- **💡 Feature Requests**: [Discussions](https://github.com/sdingwan/chess-game/discussions)

