class Wave3 extends Phaser.Scene {
    constructor() {
        super("Wave3Scene");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 5;           // Don't create more than this many bullets

        this.my.sprite.slime = [];

        this.enemies = [];
        this.ghosts = [];

        this.ghostShotFrequency = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("ghost", "ghost.png");
        this.load.image("slime", "slimeBlock_dead.png");
    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(1.75);

        /*my.sprite.enemy1 = this.add.sprite(game.config.width/2, 80, "enemy1");
        my.sprite.enemy1.setScale(0.5);
        my.sprite.enemy1.scorePoints = 25;*/

        let x = 100;
        let y = 0;
        for(let i = 0; i < 8; i++){
            let enemyIt = new Enemy(this, x, y, "enemy1", 0);
            x += 200;
            if (x > 700) {
                x = 100;
                y -= 150;
            }
            enemyIt.setScale(0.5);
            this.enemies.push(enemyIt);
        }

        this.ghost = new Ghost(this, 0, -300, "ghost", 0);
        this.ghost.setScale(0.75);

        x = 0;
        for(let i = 0; i < 3; i++){
            let ghostIt = new Ghost(this, x, y, "ghost", 0);
            y -= 200;
            x += 100;
            ghostIt.setScale(0.75);
            this.ghosts.push(ghostIt);
        }

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 10;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + game.settings.score);

    }

    update() {

        this.ghostShotFrequency += 1
        if (this.ghostShotFrequency % 15 == 0){
            for(let ghost of this.ghosts){
                if (ghost.visible) {
                    let slimeToPush = this.add.sprite(ghost.x, ghost.y-(ghost.displayHeight/2), "slime");
                    slimeToPush.setScale(0.35);
        
                    this.my.sprite.slime.push(slimeToPush);
                }
            }
        }

        
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.slime = my.sprite.slime.filter((slime) => slime.y > -(slime.displayHeight/2));

        // Check for collision with the enemy
        for (let bullet of my.sprite.bullet) {
            for(let ghost of this.ghosts){
                if(this.collides(ghost, bullet)){
                    bullet.y = -100;
                    ghost.visible = false;
                    ghost.x = -100;
                    // Update score
                    game.settings.score += 10;
                    this.updateScore();
                    // Play sound
                    this.sound.play("dadada", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    }); 
                }
            }
            
            for(let enemy of this.enemies){
                if (this.collides(enemy, bullet)) {
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    enemy.visible = false;
                    enemy.x = -100;
                    // Update score
                    game.settings.score += 5;
                    this.updateScore();
                    // Play sound
                    this.sound.play("dadada", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    });
                }
            }
            
        }

        for (let slime of this.my.sprite.slime) {
            if (this.collides(slime, my.sprite.player)) {
                slime.y = -100;
                game.settings.score -= 5;
                this.updateScore();
            }
        }


        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // Make all of the slimes move
        for (let slime of my.sprite.slime) {
            slime.y += this.bulletSpeed;
        }

        let waveClear = true;

        for (let enemy of this.enemies) {
            if (enemy.visible) {
                waveClear = false;
            }
        }

        for (let ghost of this.ghosts) {
            if (ghost.visible) {
                waveClear = false;
            }
        }

        if (waveClear) {
            this.scene.start("GameOverScene");
        }

        if(!this.gameOver){
            for(let enemy of this.enemies){
                enemy.update();
            }
            for(let ghost of this.ghosts){
                ghost.update();
            }
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + game.settings.score);
    }

}
         