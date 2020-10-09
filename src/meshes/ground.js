import * as BABYLON from '@babylonjs/core/Legacy/legacy';

export let planeExport = {};
planeExport.cameraPlane = {};
planeExport.restartPlane = {};

export function ground(scene) {
    // let ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 1, scene, false);
    let ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 120, height: 120 }, scene);

    let groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 0.2, 0.2);
    ground.material = groundMaterial;
    // box physics impostor
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 50, restitution: 0.7 }, scene);

    // plane 1 and ground 1
    let plane = new BABYLON.MeshBuilder.CreatePlane('plane', { size: 40 }, scene);
    plane.rotation.x = Math.PI / 2;
    plane.physicsImpostor = new BABYLON.PhysicsImpostor(plane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    plane.position.set(25, 0.1, -25);
    planeExport.cameraPlane.mesh = plane;
    planeExport.cameraPlane.mesh.impostor = plane.physicsImpostor;

    let plane2 = new BABYLON.MeshBuilder.CreatePlane('plane2', { size: 40 }, scene);
    plane2.rotation.x = Math.PI / 2;
    plane2.visibility = false;
    plane2.position.set(25, 1, -25);
    planeExport.cameraPlane.mesh2 = plane2;

    // restart plane
    let text = 'restart';
    let dynamicTexture = new BABYLON.DynamicTexture('dtexture', { width: 10 * 60, height: 10 * 60 }, scene);
    dynamicTexture.drawText(text, null, null, '97px Arial', '#000000', '#ffffff', true);

    let restartPlane1 = new BABYLON.MeshBuilder.CreatePlane('restartPlane1', { size: 10 }, scene);
    restartPlane1.rotation.x = Math.PI / 2;
    restartPlane1.physicsImpostor = new BABYLON.PhysicsImpostor(plane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    restartPlane1.position.set(25, 0.1, 25);
    // restartPlane1.material = new BABYLON.StandardMaterial('s-mat', scene);
    // restartPlane1.material = new BABYLON.StandardMaterial('s-mat', scene);
    //create material
    var mat = new BABYLON.StandardMaterial('mat', scene);
    mat.diffuseTexture = dynamicTexture;

    //apply material
    restartPlane1.material = mat;
    planeExport.restartPlane.mesh = restartPlane1;
    planeExport.restartPlane.mesh.impostor = plane.physicsImpostor;

    let restartPlane2 = new BABYLON.MeshBuilder.CreatePlane('restartPlane2', { size: 10 }, scene);
    restartPlane2.rotation.x = Math.PI / 2;
    restartPlane2.visibility = false;
    restartPlane2.position.set(25, 1, 25);
    planeExport.restartPlane.mesh2 = restartPlane2;
}
