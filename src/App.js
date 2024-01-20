import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const App = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, box, sprite;

    const init = () => {
      // Khởi tạo scene
      scene = new THREE.Scene();

      // Khởi tạo camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Khởi tạo renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Khởi tạo mũi tên
      const map = new THREE.TextureLoader().load("arrow.png");
      const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
      sprite = new THREE.Sprite(material);
      sprite.scale.set(2, 1, 1);
      scene.add(sprite);

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

      // Định nghĩa vị trí ban đầu của hộp
      var initialPosition = new THREE.Vector3(1.5, 0, 0); // Vị trí bên phải 1.5 đơn vị
      box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.copy(initialPosition);
      box.rotation.set(0.1 * Math.PI, 0.1 * Math.PI, 0);
      box.scale.set(2, 2, 2);
      scene.add(box);

      // wireframe
      const edges = new THREE.EdgesGeometry(scene.box);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      scene.add(line);

      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Di chuyển mũi tên đến hộp
      sprite.position.x = Math.sin(Date.now() * 0.003) * 1 - 2;

      // Mờ dần mũi tên
      const distanceToBox = sprite.position.distanceTo(box.position);
      const opacity = Math.max(0, -(1 - distanceToBox / 2));
      sprite.material.opacity = opacity;

      renderer.render(scene, camera);
    };

    init();

    return () => {
      // Xóa bộ nhớ khi component unmount
      containerRef.current.removeChild(renderer.domElement);
      scene.remove(sprite);
      scene.remove(box);
      sprite.geometry.dispose();
      sprite.material.dispose();
      box.geometry.dispose();
      box.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default App;
