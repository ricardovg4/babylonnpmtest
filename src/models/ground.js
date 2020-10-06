// import * as BABYLON from '@babylonjs/core/Legacy/legacy';

export function ground(scene) {
    // let ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 1, scene, false);
    let ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 60, height: 60 }, scene);

    let groundMaterial = new BABYLON.StandardMaterial('ground', scene);
    groundMaterial.specularColor = BABYLON.Color3.Black();
    ground.material = groundMaterial;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
}
