function captureVideo() {
    return new Promise((resolve, reject) => {
      // Crear el elemento video
      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.zIndex = '9999';
  
      // Verificar el soporte de la cámara trasera
      const constraints = {
        video: { facingMode: { ideal: 'environment' } }
      };
  
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          video.srcObject = stream;
          document.body.appendChild(video);
          video.play();
  
          // Crear el recuadro centrado en pantalla
          const boxSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
          const boxLeft = (window.innerWidth - boxSize) / 2;
          const boxTop = (window.innerHeight - boxSize) / 2;
  
          const canvas = document.createElement('canvas');
          canvas.width = boxSize;
          canvas.height = boxSize;
          canvas.style.position = 'fixed';
          canvas.style.top = boxTop + 'px';
          canvas.style.left = boxLeft + 'px';
          canvas.style.zIndex = '9999';
  
          const ctx = canvas.getContext('2d');
  
          // Función para recortar el video al pulsar el botón
          const captureFrame = () => {
            ctx.drawImage(video, -boxLeft, -boxTop, window.innerWidth, window.innerHeight);
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            video.pause();
            video.srcObject = null;
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(video);
            canvas.remove();
            window.removeEventListener('click', captureFrame);
          };
  
          // Agregar el botón para recortar el video
          const button = document.createElement('button');
          button.textContent = 'Recortar Video';
          button.style.position = 'fixed';
          button.style.bottom = '20px';
          button.style.left = '50%';
          button.style.transform = 'translateX(-50%)';
          button.style.zIndex = '9999';
  
          // Capturar el evento de clic para recortar el video
          button.addEventListener('click', captureFrame);
  
          // Agregar el botón al documento
          document.body.appendChild(button);
        })
        .catch(error => reject(error));
    });
  }

  captureVideo().then(console.log).catch(alert);