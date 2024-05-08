class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }
    preload() {

    }

    create() {
        let menuConfig =
        {
            fontFamily: 'Verdana',
            fontSize: '32px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            padding:
            {
                top:10,
                bottom:10,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - 100, 'GAME OVER', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Press Space to return to Main Menu', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 100, 'SCORE: ' + game.settings.score, menuConfig).setOrigin(0.5);

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            game.settings = 
            {
                score: 0
            }
            this.scene.start("menuScene");
        }
    }
}