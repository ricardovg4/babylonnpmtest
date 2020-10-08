import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

// created as an object so it can be updated as the references are just pointers
export let carMeshAbsolutePosition = {};
export let carExport = { mesh: null };

// import low poly car
export function carMesh(scene) {
    BABYLON.SceneLoader.ImportMesh('', '../../3d/low-poly_truck_car_drifter/', 'scene.gltf', scene, (newMeshes, particlySystem, skeletons) => {
        // BABYLON.SceneLoader.ImportMeshAsync('', '../../3d/low-poly_truck_car_drifter/', 'scene.gltf', scene).then((newMeshes) => {
        let car = newMeshes[0];
        car.scaling.scaleInPlace(0.01);
        // car.rotation.y = Math.PI;
        car.position.set(0, 0, 0);

        // was set as default and superseeded rotation
        car.rotationQuaternion = null;

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
        let box3 = BABYLON.MeshBuilder.CreateBox('box3', { width: 2, depth: 4, height: 2 }, scene);
        box3.position.set(0, 10, 0);
        box3.physicsImpostor = new BABYLON.PhysicsImpostor(box3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 50 }, scene);

        // let plane = new BABYLON.MeshBuilder.CreatePlane('plane', { size: 40 }, scene);
        // plane.position.set(25, 1, -25);
        // plane.rotation.x = Math.PI / 2;

        // let box4 = BABYLON.MeshBuilder.CreateBox('box4', { width: 2, depth: 4, height: 2 }, scene);
        // box4.position.set(5, 0, 5);

        //
        carExport.mesh = boxCollider;
        scene.registerBeforeRender(() => {
            carMeshAbsolutePosition.pos = car.getAbsolutePosition();
            box3.lookAt(car.getAbsolutePosition());
            if (map['w'] || map['W']) {
                carParent.translate(BABYLON.Axis.X, 0.4, BABYLON.Space.LOCAL);
            }
            if (map['s'] || map['S']) {
                carParent.translate(BABYLON.Axis.X, -0.4, BABYLON.Space.LOCAL);
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
            // if (boxCollider.intersectsMesh(plane, true)) {
            //     console.log('collision intersection!');
            // }
        });
    });
}
