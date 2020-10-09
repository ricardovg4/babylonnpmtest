import * as BABYLON from '@babylonjs/core/Legacy/legacy';

export let planeExport = {};

export function ground(scene) {
    // let ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 1, scene, false);
    let ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 120, height: 120 }, scene);

    let groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 0.2, 0.2);
    ground.material = groundMaterial;

    // box physics impostor
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 50, restitution: 0.7 }, scene);

    let plane = new BABYLON.MeshBuilder.CreatePlane('plane', { size: 40 }, scene);
    plane.rotation.x = Math.PI / 2;
    plane.physicsImpostor = new BABYLON.PhysicsImpostor(plane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    plane.position.set(25, 0.1, -25);
    planeExport.mesh = plane;
    planeExport.impostor = plane.physicsImpostor;

    let plane2 = new BABYLON.MeshBuilder.CreatePlane('plane2', { size: 40 }, scene);
    plane2.rotation.x = Math.PI / 2;
    plane2.visibility = false;
    plane2.position.set(25, 1, -25);
    planeExport.mesh2 = plane2;
}
