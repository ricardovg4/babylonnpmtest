import '@babylonjs/loaders/glTF';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

export function saloonMesh(scene) {
    BABYLON.SceneLoader.ImportMesh('', '../../3d/low-poly_saloon/', 'scene.gltf', scene, (newMeshes, particleSystems, skeletons) => {
        let saloon = newMeshes[0];
        saloon.scaling.scaleInPlace(0.01);
        let saloonPosition = [-40, 0.4, -40];
        saloon.position.set(...saloonPosition);
        saloon.rotationQuaternion = null;
        saloon.rotation.x = Math.PI * 2;

        // box impostor for collisions
        let boxCollider = BABYLON.MeshBuilder.CreateBox('boxCollider', { width: 8, depth: 7, height: 8 }, scene);
        boxCollider.position.set(...saloonPosition);
        boxCollider.position.y = 4.5;
        boxCollider.isVisible = false;
        boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);

        // saloon parent containing the saloon mesh and the imposter
        let saloonParent = new BABYLON.Mesh('saloonParent', scene);
        saloonParent.addChild(saloon);
        saloonParent.addChild(boxCollider);
        saloonParent.position.set(0, 0, 0);
        saloonParent.physicsImpostor = new BABYLON.PhysicsImpostor(saloonParent, BABYLON.PhysicsImpostor.NoImpostor, { mass: 0 }, scene);
    });
}
