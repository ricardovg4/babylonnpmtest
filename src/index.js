import createScene from './scenes/defaultScene';
// import './scenes/defaultScene';

const babylonInit = async () => {
    // get the canvas element
    const canvas = document.getElementById('renderCanvas');

    // create babylon 3D engine
    const engine = new BABYLON.Engine(canvas, true);
    // let scene = new BABYLON.Scene(engine);

    // must be await as the function in file awaits for ammo to load
    const scene = await createScene(engine, canvas);

    // run the engine
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Resize the engine
    window.addEventListener('resize', () => {
        engine.resize();
    });
};

// run babylon
babylonInit();
