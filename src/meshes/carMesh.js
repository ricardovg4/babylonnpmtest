import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Scene } from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

// import digital assets
import remoteController from '../../3d/low-poly_truck_car_drifter/samsung-controller.glb';
import lowPolyCar from '../../3d/low-poly_truck_car_drifter/scene2.gltf';

// created as an object so it can be updated as the references are just pointers
export let carMeshAbsolutePosition = {};
export let carExport = { mesh: null };

export async function carMesh(scene) {
    // import remote controller
    const remoteControllerImport = await BABYLON.SceneLoader.ImportMeshAsync('', '', remoteController, scene, undefined);
    remoteControllerImport.meshes[0].scaling.scaleInPlace(50);
    remoteControllerImport.meshes[0].position.y = 15;

    // import car
    // BABYLON.SceneLoader.ImportMesh('', '../../3d/low-poly_truck_car_drifter/', 'scene.gltf', scene, (newMeshes, particlySystem, skeletons) => {
    const lowPolyCarImport = await BABYLON.SceneLoader.ImportMeshAsync('', '', lowPolyCar, scene, undefined);
    let car = lowPolyCarImport.meshes[0];
    car.scaling.scaleInPlace(0.01);

    // car's box object for collisions
    let boxCollider = BABYLON.MeshBuilder.CreateBox('boxCollider', { width: 6, depth: 4, height: 3 }, scene);
    boxCollider.position.set(0, 0, 0);
    boxCollider.position.y = 1.1;
    boxCollider.isVisible = false;
    boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

    // car parent containing the car mesh and the imposter
    let carParent = new BABYLON.Mesh('carParent', scene);
    carParent.addChild(car);
    carParent.addChild(boxCollider);
    carParent.position.set(0, 0, 0);
    carParent.physicsImpostor = new BABYLON.PhysicsImpostor(carParent, BABYLON.PhysicsImpostor.NoImpostor, { mass: 3 }, scene);

    let box3 = BABYLON.MeshBuilder.CreateBox('box3', { width: 2, depth: 4, height: 2 }, scene);
    box3.position.set(0, 10, 0);
    box3.physicsImpostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 50 }, scene);

    // object for multiple key presses
    let map = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        })
    );

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
        })
    );

    carExport.mesh = boxCollider;
    carExport.impostor = carParent.physicsImpostor;

    scene.registerBeforeRender(() => {
        carMeshAbsolutePosition.pos = car.getAbsolutePosition();
        box3.lookAt(car.getAbsolutePosition());
        if (map['w'] || map['W']) {
            carParent.translate(BABYLON.Axis.X, -0.4, BABYLON.Space.LOCAL);
        }
        if (map['s'] || map['S']) {
            carParent.translate(BABYLON.Axis.X, 0.4, BABYLON.Space.LOCAL);
        }
        if ((map['a'] || map['A']) && (map['s'] || map['S'])) {
            carParent.rotate(BABYLON.Axis.Y, Math.PI / 120, BABYLON.Space.LOCAL);
        } else if (map['a'] || map['A']) {
            carParent.rotate(BABYLON.Axis.Y, -Math.PI / 120, BABYLON.Space.LOCAL);
        }
        if ((map['d'] || map['D']) && (map['s'] || map['S'])) {
            carParent.rotate(BABYLON.Axis.Y, -Math.PI / 120, BABYLON.Space.LOCAL);
        } else if (map['d'] || map['D']) {
            carParent.rotate(BABYLON.Axis.Y, Math.PI / 120, BABYLON.Space.LOCAL);
        }
        if (map[' ']) {
            console.log('space pressed');
            carParent.translate(BABYLON.Axis.Y, 0.4, BABYLON.Space.LOCAL);
        }
    });
    return scene;
}
