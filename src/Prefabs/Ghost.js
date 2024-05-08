class Ghost extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);               // add to existing scene
        this.moveSpeed = 2.5;                     // pixels per frame
        this.clock = 0;
    }

    update() {
        this.clock += 0.1;
        this.y += this.moveSpeed;
        this.x += Math.sin(this.clock) * 40;

        if(this.y > 701){
            this.reset();
        }
    }

    // reset position
    reset(){
        this.setActive(true);
        this.y -= 701;
    }
} 