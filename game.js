
class SpellCasterEngine {
    constructor() {
        this.score = 0;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.currentTypedBuffer = "";
        this.wordBank = ["MAGIC", "SHIELD", "WIZARD", "FIREBALL", "POTION", "SHADOW", "BLITZ"];
        this.currentEnemyWord = "";
        this.spawnNewEnemy();
    }

    spawnNewEnemy() {
        const randomIndex = Math.floor(Math.random() * this.wordBank.length);
        this.currentEnemyWord = this.wordBank[randomIndex];
        this.currentTypedBuffer = ""; 
    }

    handleKeyPress(char) {
        if (char === "Backspace") {
            if (this.currentTypedBuffer.length > 0) {
                this.currentTypedBuffer = this.currentTypedBuffer.slice(0, -1);
            }
        } else {
            this.currentTypedBuffer += char.toUpperCase();
        }

       
        if (this.currentTypedBuffer === this.currentEnemyWord) {
            this.score += 100;
            this.spawnNewEnemy();
            return true; 
        }
        return false;
    }

    enemyReachedPlayer() {
        this.health--;
        if (this.score > 50) this.score -= 50; 
        this.spawnNewEnemy();
    }

    getScore() { return this.score; }
    getHealth() { return this.health; }
    getEnemyWord() { return this.currentEnemyWord; }
    getTypedBuffer() { return this.currentTypedBuffer; }
    isGameOver() { return this.health <= 0; }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const game = new SpellCasterEngine();
let enemyX = 750;
const enemySpeed = 1.5;

window.addEventListener("keydown", (event) => {
    if (game.isGameOver()) return;

    if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        const killed = game.handleKeyPress(event.key);
        if (killed) enemyX = 750; // Reset monster position on hit
    } else if (event.key === "Backspace") {
        game.handleKeyPress("Backspace");
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (game.isGameOver()) {
        drawGameOverScreen(game.getScore());
        return;
    }

    // --- GAME LOGIC UPDATES ---
    enemyX -= enemySpeed;
    
    // Check if monster reaches wizard bounds
    if (enemyX <= 180) {
        game.enemyReachedPlayer();
        enemyX = 750; 
    }

    // --- VISUAL RENDERING ---
    // Draw Wizard (Blue circle)
    ctx.beginPath();
    ctx.arc(150, canvas.height / 2, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();

    // Draw Monster (Red circle)
    ctx.beginPath();
    ctx.arc(enemyX, canvas.height / 2, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
    ctx.closePath();

    // Target Word floating above monster
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(game.getEnemyWord(), enemyX, canvas.height / 2 - 40);

    // Score & Health HUD
    ctx.textAlign = "left";
    ctx.fillStyle = "#e0a96d";
    ctx.font = "22px Arial";
    ctx.fillText(`SCORE: ${game.getScore()}`, 20, 40);
    
    let hearts = "❤️".repeat(game.getHealth());
    ctx.fillText(`HEALTH: ${hearts}`, 600, 40);

    // Typing Box Area
    ctx.fillStyle = "#000000";
    ctx.fillRect(200, 420, 400, 50);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(200, 420, 400, 50);

    // Display what the player has actively typed
    ctx.fillStyle = "#2ecc71";
    ctx.font = "24px Courier New";
    ctx.textAlign = "center";
    const buffer = game.getTypedBuffer();
    if (buffer.length > 0) {
        ctx.fillText(buffer, 400, 452);
    } else {
        ctx.fillStyle = "#7f8c8d";
        ctx.fillText("Start typing...", 400, 452);
    }

    requestAnimationFrame(gameLoop);
}

function drawGameOverScreen(finalScore) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("💀 GAME OVER 💀", canvas.width / 2, canvas.height / 2 - 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText(`Final Typing Score: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Start the game loop automatically
gameLoop();