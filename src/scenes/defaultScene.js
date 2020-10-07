// module imports
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

// import ammoPromisified
import { ammoReadyPromise, ammoModule } from '../externals/ammoPromisified';

// import meshes
import { ground } from '../models/ground';

// main function
export default async function createScene(engine, canvas) {
    let preTasks = [ammoReadyPromise];
    await Promise.all(preTasks || []);

    // create the scene with the engine argument
    const scene = new BABYLON.Scene(engine);
    console.log('createscene');

    // create camera
    const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 3, 10, new BABYLON.Vector3(40, 60, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // Hemispheric light
    const light = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    // const light2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(2, -20, 0), scene);
    // light2.intensity = 0.8;

    // enable physics
    // scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin(true, ammoModule));

    // Ground import
    ground(scene);

    // test materials
    // purple
    let myMaterial = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    //
    let myMaterial2 = new BABYLON.StandardMaterial('myMaterial', scene);
    myMaterial2.diffuseColor = new BABYLON.Color3(1, 5, 1);

    // meshes
    let sphere = BABYLON.Mesh.CreateSphere('sphere', 8, 2, scene);
    sphere.position.y = 10;
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
    sphere.material = myMaterial;
    // sphere.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(1, 0, 1, 0));
    // sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 0), sphere.getAbsolutePosition());

    let box = BABYLON.MeshBuilder.CreateBox('box2', { width: 1, depth: 2, height: 10 }, scene);
    box.position.set(10, 0, 10);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.2, restitution: 0, friction: 0 }, scene);
    box.material = myMaterial2;

    // import low poly car
    let gltf = BABYLON.SceneLoader.ImportMesh('', '../models/low-poly_truck_car_drifter/', 'scene.gltf', scene, (model) => {
        let car = model[0];
        car.scaling.scaleInPlace(0.01);
        // car.rotation.y = Math.PI;
        car.position.set(0, 0, 0);

        // was set as default and superseeded rotation
        car.rotationQuaternion = null;

        // car's box object for collisions
        let boxCollider = BABYLON.MeshBuilder.CreateBox('box', { width: 6, depth: 4, height: 3 }, scene);
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

        //
        scene.registerBeforeRender(() => {
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
        });
    });
    return scene;
}
