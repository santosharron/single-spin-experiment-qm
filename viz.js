var arrowHelper = null;

function viz_init() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8c8c8b );
    const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.5);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const sphereRadius = 3;
    const sphereXSegments = 20;
    const sphereYSegments = 20;
    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(
            sphereRadius,
            sphereXSegments,
            sphereYSegments
        ),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }) //0xffffff
    );
    //scene.add(sphereMesh);

    const arrowDirectionVector1 = new THREE.Vector3(0, 1, 0);
    arrowDirectionVector1.normalize();
    const arrowOrigin1 = new THREE.Vector3(0, 0, 0);
    const arrowLength1 = 3;
    const arrowColorHex1 = 0x000000; //0xffffff; //0xfafa07;//0x1100ff;
    const arrowHelper1 = new THREE.ArrowHelper(
    arrowDirectionVector1,
    arrowOrigin1,
    arrowLength1,
    arrowColorHex1
    );
    scene.add(arrowHelper1);
    
    const arrowDirectionVector2 = new THREE.Vector3(1, 0, 0);
    arrowDirectionVector2.normalize();
    const arrowOrigin2 = new THREE.Vector3(0, 0, 0);
    const arrowLength2 = 3;
    const arrowColorHex2 = 'green'; //0xffffff; //0xfafa07;//0x1100ff;
    const arrowHelper2 = new THREE.ArrowHelper(
    arrowDirectionVector2,
    arrowOrigin2,
    arrowLength2,
    arrowColorHex2
    );
    scene.add(arrowHelper2);

    const t_geometry1 = new THREE.TorusGeometry( 3, 0.05, 16, 100 ).translate(0, 0, 0);
    const t_material1 = new THREE.MeshBasicMaterial( { color: 'blue' } );
    const torus1 = new THREE.Mesh( t_geometry1, t_material1 );
    scene.add( torus1 );

    const t_geometry2 = new THREE.TorusGeometry( 3, 0.05, 16, 100 ).translate(0, 0, 0).rotateX(Math.PI/2);
    const t_material2 = new THREE.MeshBasicMaterial( { color: 'blue' } );
    const torus2 = new THREE.Mesh( t_geometry2, t_material2 );
    scene.add( torus2 );
    
    
    camera.position.z = 2;//5;
    camera.position.y = 3;//1;
    camera.rotation.x = (3.141 / 180) * -30; // 20 deg
    
    //console.log(TrackballControls);
    //const controls = new TrackballControls(camera, renderer.domElement);
    //controls.addEventListener('change', render);

    function animate() {
    requestAnimationFrame(animate);

    //sphereMesh.rotation.y += 0.001;
    //sphereMesh.rotation.x += 0.001;
    //sphereMesh.rotation.y += 0.001;
    //controls.update();
    renderer.render(scene, camera);
    }

    animate();

    return arrowHelper
}

function update_state_viz(state_vec) {
    console.log("Updating viz to " + state_vec);
    const newVec = new THREE.Vector3(state_vec[0], state_vec[2], state_vec[1]);
    arrowHelper.setDirection(newVec);
    console.log(arrowHelper.dir);
}

document.addEventListener("DOMContentLoaded", function(event) { 
    arrowHelper = viz_init();
  });