let camera,scene,renderer;
let controls;

window.onload = ()=>{
    init();
    animate();
};

function init() {
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // 最外层元素
    const container = document.createElement('div');
    container.className = 'container';
    const objectContainer = new THREE.CSS3DObject(container);
    scene.add(objectContainer);

    objectData.forEach((cardItem,cardIndex)=>{
        // 卡片
        const cardContainer = document.createElement('div');
        cardContainer.style.width = 1448+'px';
        cardContainer.style.height = 750+'px';
        const objectCardContainer = new THREE.CSS3DObject(cardContainer);
        objectContainer.add(objectCardContainer);

        //竖直背景
        const card_bg_vertical = document.createElement('div');
        card_bg_vertical.style.width = cardItem.verticalBg.width+'px';
        card_bg_vertical.style.height = cardItem.verticalBg.height+'px';
        card_bg_vertical.style.background = 'url('+cardItem.verticalBg.url+') no-repeat';
        const objectCardBgVertical = new THREE.CSS3DObject(card_bg_vertical);
        objectCardBgVertical.position.y = 80;
        objectCardContainer.add(objectCardBgVertical);

        // 地面
        const card_groud = document.createElement('div');
        card_groud.style.width = cardItem.ground.width+'px';
        card_groud.style.height = cardItem.ground.height+'px';
        card_groud.style.transformOrigin = 'center top';
        card_groud.style.background = 'url('+cardItem.ground.url+') no-repeat';
        const objectCardGround = new THREE.CSS3DObject(card_groud);
        objectCardGround.position.y = 80;
        objectCardGround.rotation.x = cardItem.ground.rotation;
        objectCardContainer.add(objectCardGround);

        // 元素
        cardItem.things.forEach((item,index)=>{
           const thing = document.createElement('div');
           thing.style.width = item.width+'px';
           thing.style.height = item.height+'px';
           thing.style.background = 'url('+ item.url +') no-repeat';
           const objectThing = new THREE.CSS3DObject(thing);
            objectThing.rotation.x = cardItem.thingsRotation;
            objectThing.position.y = -(index+1)*68;
            objectThing.position.x = item.x;
            objectThing.position.z = -item.y-300;
            objectCardGround.add(objectThing);
        });
    });

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change',render);

    window.addEventListener('resize',onWindowResize,false);

    render();
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    render();
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
}

function render(){
    renderer.render(scene,camera);
}
