class Acorn {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.width = 32;  // Adjust size as needed
        this.height = 32;
        this.image = new Image();
        this.image.src = imageSrc;
        this.collected = false;  // Track if the acorn is collected

        // Ensure the image is loaded before drawing it
        this.image.onload = () => {
            console.log('Acorn image loaded:', this.image.src);
        };
    }

    // Draw the acorn if it hasn't been collected
    draw(c) {
        if (!this.collected) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    // Check if player has collected the acorn
    checkCollision(player) {
        // Ensure the player hitbox exists
        if (!player.hitbox) return false;

        return (
            player.hitbox.position.x < this.position.x + this.width &&
            player.hitbox.position.x + player.hitbox.width > this.position.x &&
            player.hitbox.position.y < this.position.y + this.height &&
            player.hitbox.position.y + player.hitbox.height > this.position.y
        );
    }
}