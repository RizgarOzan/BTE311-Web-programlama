'use strict';

var gameStart = {},
  gameSpeed = {},
  gameArea = {},
  gameAreaContext = {},
  hunter = [],
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  cellWidth = 0,
  playerScore = 0,
  highScore = 0,
  comboCount = 0,
  flies = [],
  maxFlies = 3,
  hunterDirection = '',
  speedSize = 0,
  timer = {},
  gameOverMessage = {},
  level = 1;

// Farklı renk sinekler ve puanları - Vibrant ve ayırt edici renkler
var flyColors = [
  { color: '#757575', name: 'Gri', points: 5 },        // Gri (gözlerin görünmesi için)
  { color: '#C62828', name: 'Kırmızı', points: 10 },     // Koyu kırmızı
  { color: '#2196F3', name: 'Mavi', points: 15 },       // Gerçek mavi
  { color: '#4CAF50', name: 'Yeşil', points: 20 },      // Canlı yeşil
  { color: '#9C27B0', name: 'Mor', points: 25 },       // Mor
  { color: '#FFD700', name: 'Altın', points: 50, special: true }  // Gerçek altın rengi
];

function initElement() {
  gameStart = document.querySelector('#gameStart');
  gameSpeed = document.querySelector('#gameSpeed');
  gameArea = document.querySelector('#gameArea');
  gameOverMessage = document.querySelector('#gameOverMessage');

  gameAreaContext = gameArea.getContext('2d');
  gameAreaWidth = 400;
  gameAreaHeight = 600;
  cellWidth = 20;
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;

  // En yüksek skoru yükle
  highScore = parseInt(localStorage.getItem('highScore')) || 0;
  updateScoreDisplay();
  createPointsLegend();
}

function createPointsLegend() {
  var legendContainer = document.querySelector('#legendItems');
  legendContainer.innerHTML = '';
  
  for (var i = 0; i < flyColors.length; i++) {
    var fly = flyColors[i];
    var legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    
    var flyIcon = document.createElement('div');
    flyIcon.className = 'legend-fly';
    flyIcon.style.backgroundColor = fly.color;
    if (fly.special) {
      flyIcon.style.boxShadow = '0 0 10px ' + fly.color;
    }
    
    var flyText = document.createElement('span');
    flyText.className = 'legend-text';
    flyText.textContent = fly.name + ': ' + fly.points + ' puan';
    
    legendItem.appendChild(flyIcon);
    legendItem.appendChild(flyText);
    legendContainer.appendChild(legendItem);
  }
}

function createFly() {
  // Mevcut sineklerin pozisyonlarını kontrol et
  var occupiedPositions = [];
  for (var i = 0; i < flies.length; i++) {
    occupiedPositions.push({ x: flies[i].x, y: flies[i].y });
  }
  for (var j = 0; j < hunter.length; j++) {
    occupiedPositions.push({ x: hunter[j].x, y: hunter[j].y });
  }
  
  var attempts = 0;
  var newFly = null;
  
  while (attempts < 50) {
    var randomColorIndex = Math.floor(Math.random() * flyColors.length);
    // Özel sinekler daha nadir görünsün
    if (flyColors[randomColorIndex].special && Math.random() > 0.15) {
      randomColorIndex = Math.floor(Math.random() * (flyColors.length - 1));
    }
    
    var selectedFly = flyColors[randomColorIndex];
    var newX = Math.round(Math.random() * (gameAreaWidth - cellWidth) / cellWidth);
    var newY = Math.round(Math.random() * (gameAreaHeight - cellWidth) / cellWidth);
    
    var isOccupied = false;
    for (var k = 0; k < occupiedPositions.length; k++) {
      if (occupiedPositions[k].x == newX && occupiedPositions[k].y == newY) {
        isOccupied = true;
        break;
      }
    }
    
    if (!isOccupied) {
      newFly = {
        x: newX,
        y: newY,
        color: selectedFly.color,
        points: selectedFly.points,
        special: selectedFly.special || false
      };
      break;
    }
    attempts++;
  }
  
  if (newFly) {
    flies.push(newFly);
  }
}

function removeFly(index) {
  flies.splice(index, 1);
}

function control(x, y, array) {
  for (var index = 0, length = array.length; index < length; index++) {
    if (array[index].x == x && array[index].y == y) return true;
  }
  return false;
}

function updateScoreDisplay() {
  document.querySelector('#currentScore').textContent = playerScore;
  document.querySelector('#highScore').textContent = highScore;
  document.querySelector('#comboCount').textContent = comboCount;
  document.querySelector('#level').textContent = level;
}

function showGameOver() {
  document.querySelector('#finalScore').textContent = playerScore;
  gameOverMessage.classList.remove('hidden');
}

function createHunterSegment(x, y) {
  // Avcı karakteri için turuncu/kırmızı tonları
  var gradient = gameAreaContext.createLinearGradient(
    x * cellWidth, y * cellWidth,
    (x + 1) * cellWidth, (y + 1) * cellWidth
  );
  gradient.addColorStop(0, '#FF6B35');
  gradient.addColorStop(1, '#F7931E');
  
  gameAreaContext.fillStyle = gradient;
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  
  // Kenar çizgisi
  gameAreaContext.strokeStyle = '#C0392B';
  gameAreaContext.lineWidth = 1;
  gameAreaContext.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function createFlyShape(x, y, color, isSpecial) {
  // Sinek için yuvarlak şekil
  var centerX = x * cellWidth + cellWidth / 2;
  var centerY = y * cellWidth + cellWidth / 2;
  var radius = cellWidth / 2 - 2;
  
  // Özel sinekler için parıltı efekti
  if (isSpecial) {
    var glowGradient = gameAreaContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 3);
    glowGradient.addColorStop(0, color);
    glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    gameAreaContext.fillStyle = glowGradient;
    gameAreaContext.beginPath();
    gameAreaContext.arc(centerX, centerY, radius + 3, 0, 2 * Math.PI);
    gameAreaContext.fill();
  }
  
  gameAreaContext.beginPath();
  gameAreaContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  gameAreaContext.fillStyle = color;
  gameAreaContext.fill();
  
  // Sinek için küçük gözler
  gameAreaContext.fillStyle = '#000';
  gameAreaContext.beginPath();
  gameAreaContext.arc(centerX - 3, centerY - 2, 2, 0, 2 * Math.PI);
  gameAreaContext.arc(centerX + 3, centerY - 2, 2, 0, 2 * Math.PI);
  gameAreaContext.fill();
  
  // Özel sinekler için yıldız işareti
  if (isSpecial) {
    gameAreaContext.fillStyle = '#FFF';
    gameAreaContext.font = '10px Arial';
    gameAreaContext.textAlign = 'center';
    gameAreaContext.fillText('⭐', centerX, centerY + 3);
  }
}

function createGameArea() {
  var hunterX = hunter[0].x;
  var hunterY = hunter[0].y;

  // Arka plan - açık mavi/yeşil gradient
  var bgGradient = gameAreaContext.createLinearGradient(0, 0, gameAreaWidth, gameAreaHeight);
  bgGradient.addColorStop(0, '#E0F7FA');
  bgGradient.addColorStop(1, '#B2EBF2');
  gameAreaContext.fillStyle = bgGradient;
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);

  // Kenar çerçevesi
  gameAreaContext.strokeStyle = '#667eea';
  gameAreaContext.lineWidth = 3;
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);

  // Yön kontrolü
  if (hunterDirection == 'right') {
    hunterX++;
  } else if (hunterDirection == 'left') {
    hunterX--;
  } else if (hunterDirection == 'down') {
    hunterY++;
  } else if (hunterDirection == 'up') {
    hunterY--;
  }

  // Çarpışma kontrolü
  if ((hunterX == -1) || (hunterX == gameAreaWidth / cellWidth) || 
      (hunterY == -1) || (hunterY == gameAreaHeight / cellWidth) || 
      control(hunterX, hunterY, hunter)) {
    showGameOver();
    clearInterval(timer);
    gameStart.disabled = false;
    return;
  }

  // Sinek yakalama kontrolü
  var caughtFly = false;
  var caughtFlyIndex = -1;
  
  for (var i = 0; i < flies.length; i++) {
    if (hunterX == flies[i].x && hunterY == flies[i].y) {
      caughtFly = true;
      caughtFlyIndex = i;
      break;
    }
  }
  
  if (caughtFly) {
    var newHead = { x: hunterX, y: hunterY };
    var caughtFlyData = flies[caughtFlyIndex];
    
    // Combo sistemi - ardışık yakalamalar
    comboCount++;
    var comboBonus = Math.floor(comboCount / 3);
    var totalPoints = caughtFlyData.points + comboBonus;
    
    // Özel sinek bonusu
    if (caughtFlyData.special) {
      totalPoints *= 2;
    }
    
    playerScore += totalPoints;
    
    // Seviye artışı (her 100 puanda bir) - Seviye arttıkça oyun hızlanır
    var newLevel = Math.floor(playerScore / 100) + 1;
    if (newLevel > level) {
      level = newLevel;
      // Seviye arttıkça hız da artsın (maksimum 9)
      clearInterval(timer);
      speedSize = Math.min(9, speedSize + 0.5);
      timer = setInterval(createGameArea, 500 / speedSize);
    }
    
    // En yüksek skor kontrolü
    if (playerScore > highScore) {
      highScore = playerScore;
      localStorage.setItem('highScore', highScore);
    }
    
    removeFly(caughtFlyIndex);
    updateScoreDisplay();
    
    // Eksik sinekleri tamamla
    while (flies.length < maxFlies) {
      createFly();
    }
  } else {
    // Combo sıfırla
    comboCount = 0;
    updateScoreDisplay();
    
    var newHead = hunter.pop();
    newHead.x = hunterX;
    newHead.y = hunterY;
  }

  hunter.unshift(newHead);

  // Avcıyı çiz
  for (var index = 0, length = hunter.length; index < length; index++) {
    createHunterSegment(hunter[index].x, hunter[index].y);
  }

  // Tüm sinekleri çiz
  for (var flyIndex = 0; flyIndex < flies.length; flyIndex++) {
    createFlyShape(flies[flyIndex].x, flies[flyIndex].y, flies[flyIndex].color, flies[flyIndex].special);
  }
}

function startGame() {
  hunter = [];
  hunter.push({ x: 0, y: cellWidth / cellWidth });
  flies = [];
  level = 1;

  // Başlangıçta 3 sinek oluştur
  for (var i = 0; i < maxFlies; i++) {
    createFly();
  }

  clearInterval(timer);
  timer = setInterval(createGameArea, 500 / speedSize);
}

function onStartGame() {
  this.disabled = true;
  gameOverMessage.classList.add('hidden');

  playerScore = 0;
  comboCount = 0;
  level = 1;
  hunterDirection = 'right';
  speedSize = parseInt(gameSpeed.value);

  if (speedSize > 9) {
    speedSize = 9;
  } else if (speedSize < 1) {
    speedSize = 1;
  }

  startGame();
}

function changeDirection(e) {
  // Ok tuşlarında sayfa kaymasını önle
  var keys = e.which;
  if (keys == 37 || keys == 38 || keys == 39 || keys == 40) {
    e.preventDefault();
  }
  
  if (keys == '40' && hunterDirection != 'up') hunterDirection = 'down';
  else if (keys == '39' && hunterDirection != 'left') hunterDirection = 'right';
  else if (keys == '38' && hunterDirection != 'down') hunterDirection = 'up';
  else if (keys == '37' && hunterDirection != 'right') hunterDirection = 'left';
}

function initEvent() {
  gameStart.addEventListener('click', onStartGame);
  window.addEventListener('keydown', changeDirection);
}

function init() {
  initElement();
  initEvent();
}

window.addEventListener('DOMContentLoaded', init);

