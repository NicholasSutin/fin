// Function to create and initialize the first WebGL tile with light effect
function initFirstTile() {
  // Initialize WebGL
  const canvas = document.getElementById('firstTile');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return null;
  }

  // Vertex shader program - specific to firstTile
  const firstTileVsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program - specific to firstTile
  const firstTileFsSource = `
    precision mediump float;
    varying highp vec2 vTextureCoord;
    
    uniform vec3 uLightColor1;
    uniform vec3 uLightColor2;
    uniform vec3 uLightColor3;
    
    uniform float uLightIntensity1;
    uniform float uLightIntensity2;
    uniform float uLightIntensity3;
    
    uniform vec2 uLightPosition1;
    uniform vec2 uLightPosition2;
    uniform vec2 uLightPosition3;
    
    uniform float uSeed;
    
    // Pseudo-random function for noise generation
    float random(vec2 st) {
      return fract(sin(dot(st.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main(void) {
      // Calculate distance from each light
      float dist1 = distance(vTextureCoord, uLightPosition1);
      float dist2 = distance(vTextureCoord, uLightPosition2);
      float dist3 = distance(vTextureCoord, uLightPosition3);
      
      // Calculate falloff for each light
      float falloff1 = 1.0 / (1.0 + 5.0 * dist1 * dist1);
      float falloff2 = 1.0 / (1.0 + 5.0 * dist2 * dist2);
      float falloff3 = 1.0 / (1.0 + 5.0 * dist3 * dist3);
      
      // Apply intensity
      vec3 light1 = uLightColor1 * falloff1 * uLightIntensity1;
      vec3 light2 = uLightColor2 * falloff2 * uLightIntensity2;
      vec3 light3 = uLightColor3 * falloff3 * uLightIntensity3;
      
      // Combine lights
      vec3 finalColor = light1 + light2 + light3;
      
      // Generate static grainy noise
      float noise = random(vTextureCoord * 500.0);
      
      // Apply grain to final color with reduced intensity
      float grainAmount = 0.04; // Reduced from 0.1 to 0.04 for subtler grain
      finalColor = finalColor * (1.0 - grainAmount) + noise * grainAmount;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Initialize a shader program - using unique function name for first tile
  function initFirstTileShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadFirstTileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadFirstTileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  // Create a shader - using unique function name for first tile
  function loadFirstTileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Initialize buffers - using unique function name for first tile
  function initFirstTileBuffers(gl) {
    // Create a buffer for the square's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions for a full-screen quad
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coordinates
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
    };
  }

  // Initialize shader program
  const firstTileShaderProgram = initFirstTileShaderProgram(gl, firstTileVsSource, firstTileFsSource);

  // Collect all the info needed to use the shader program
  const firstTileProgramInfo = {
    program: firstTileShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(firstTileShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(firstTileShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      lightColor1: gl.getUniformLocation(firstTileShaderProgram, 'uLightColor1'),
      lightColor2: gl.getUniformLocation(firstTileShaderProgram, 'uLightColor2'),
      lightColor3: gl.getUniformLocation(firstTileShaderProgram, 'uLightColor3'),
      lightIntensity1: gl.getUniformLocation(firstTileShaderProgram, 'uLightIntensity1'),
      lightIntensity2: gl.getUniformLocation(firstTileShaderProgram, 'uLightIntensity2'),
      lightIntensity3: gl.getUniformLocation(firstTileShaderProgram, 'uLightIntensity3'),
      lightPosition1: gl.getUniformLocation(firstTileShaderProgram, 'uLightPosition1'),
      lightPosition2: gl.getUniformLocation(firstTileShaderProgram, 'uLightPosition2'),
      lightPosition3: gl.getUniformLocation(firstTileShaderProgram, 'uLightPosition3'),
      seed: gl.getUniformLocation(firstTileShaderProgram, 'uSeed'),
    },
  };

  // Initialize buffers
  const firstTileBuffers = initFirstTileBuffers(gl);

  // Generate a random seed once for the noise pattern
  const firstTileRandomSeed = Math.random() * 100;

  // Original light positions and colors
  // Light 1
  const originalColor1 = { r: 0/255, g: 255/255, b: 110/255 };
  const originalIntensity1 = 0.1;
  const originalPosX1 = 0.3;
  const originalPosY1 = 0.18;

  // Light 2
  const originalColor2 = { r: 12/255, g: 227/255, b: 255/255 };
  const originalIntensity2 = 0.05;
  const originalPosX2 = 0.1;
  const originalPosY2 = 0.89;

  // Light 3
  const originalColor3 = { r: 0/255, g: 117/255, b: 35/255 };
  const originalIntensity3 = 0.05;  
  const originalPosX3 = 0.9;
  const originalPosY3 = 0.55;
  
  // Current values that will be animated
  let color1 = { ...originalColor1 };
  let color2 = { ...originalColor2 };
  let color3 = { ...originalColor3 };
  let intensity1 = originalIntensity1;
  let intensity2 = originalIntensity2;
  let intensity3 = originalIntensity3;
  let posX1 = originalPosX1;
  let posY1 = originalPosY1;
  let posX2 = originalPosX2;
  let posY2 = originalPosY2;
  let posX3 = originalPosX3;
  let posY3 = originalPosY3;
  
  // Target values for animation
  let targetColor1 = { ...originalColor1 };
  let targetColor2 = { ...originalColor2 };
  let targetColor3 = { ...originalColor3 };
  let targetIntensity1 = originalIntensity1;
  let targetIntensity2 = originalIntensity2;
  let targetIntensity3 = originalIntensity3;
  let targetPosX1 = originalPosX1;
  let targetPosY1 = originalPosY1;
  let targetPosX2 = originalPosX2;
  let targetPosY2 = originalPosY2;
  let targetPosX3 = originalPosX3;
  let targetPosY3 = originalPosY3;
  
  // Animation variables
  let isHovering = false;
  let animationFrameId = null;
  const animationSpeed = 0.05; // How quickly to move toward target values
  
  // Configuration for hover effect
  const hoverConfig = {
    // Target position coordinates when hovering (directly set coordinates)
    targetPositions: {
      light1: { x: 0.37, y: 0.14 },
      light2: { x: 0.03, y: 0.92 },
      light3: { x: 0.85, y: 0.48 }
    },
    // Target colors when hovering (RGB values from 0-1)
    targetColors: {
      light1: { r: 0/255, g: 255/255, b: 170/255 }, // Shifted more towards cyan
      light2: { r: 50/255, g: 200/255, b: 255/255 }, // More vibrant blue
      light3: { r: 20/255, g: 150/255, b: 50/255 }  // Brighter green
    },
    // Target intensities when hovering
    targetIntensities: {
      light1: 0.15,
      light2: 0.08,
      light3: 0.07
    }
  };
  
  // Helper function to interpolate between two colors
  function interpolateColor(color1, color2, factor) {
    return {
      r: color1.r + (color2.r - color1.r) * factor,
      g: color1.g + (color2.g - color1.g) * factor,
      b: color1.b + (color2.b - color1.b) * factor
    };
  }
  
  // Draw the scene - using unique function name for first tile
  function drawFirstTileScene() {
    resizeFirstTileCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell WebGL to use our program when drawing
    gl.useProgram(firstTileProgramInfo.program);

    // Set up position attribute
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, firstTileBuffers.position);
      gl.vertexAttribPointer(
        firstTileProgramInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(firstTileProgramInfo.attribLocations.vertexPosition);
    }

    // Set up texture coordinates attribute
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, firstTileBuffers.textureCoord);
      gl.vertexAttribPointer(
        firstTileProgramInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(firstTileProgramInfo.attribLocations.textureCoord);
    }

    // Set uniforms
    gl.uniform3f(firstTileProgramInfo.uniformLocations.lightColor1, color1.r, color1.g, color1.b);
    gl.uniform3f(firstTileProgramInfo.uniformLocations.lightColor2, color2.r, color2.g, color2.b);
    gl.uniform3f(firstTileProgramInfo.uniformLocations.lightColor3, color3.r, color3.g, color3.b);

    gl.uniform1f(firstTileProgramInfo.uniformLocations.lightIntensity1, intensity1);
    gl.uniform1f(firstTileProgramInfo.uniformLocations.lightIntensity2, intensity2);
    gl.uniform1f(firstTileProgramInfo.uniformLocations.lightIntensity3, intensity3);

    gl.uniform2f(firstTileProgramInfo.uniformLocations.lightPosition1, posX1, posY1);
    gl.uniform2f(firstTileProgramInfo.uniformLocations.lightPosition2, posX2, posY2);
    gl.uniform2f(firstTileProgramInfo.uniformLocations.lightPosition3, posX3, posY3);
    
    // Send the fixed random seed to shader
    gl.uniform1f(firstTileProgramInfo.uniformLocations.seed, firstTileRandomSeed);

    // Draw
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }

  // Animation function to smoothly update light positions and colors
  function animateShader() {
    // Smoothly interpolate positions
    posX1 += (targetPosX1 - posX1) * animationSpeed;
    posY1 += (targetPosY1 - posY1) * animationSpeed;
    posX2 += (targetPosX2 - posX2) * animationSpeed;
    posY2 += (targetPosY2 - posY2) * animationSpeed;
    posX3 += (targetPosX3 - posX3) * animationSpeed;
    posY3 += (targetPosY3 - posY3) * animationSpeed;
    
    // Smoothly interpolate colors
    color1 = interpolateColor(color1, targetColor1, animationSpeed);
    color2 = interpolateColor(color2, targetColor2, animationSpeed);
    color3 = interpolateColor(color3, targetColor3, animationSpeed);
    
    // Smoothly interpolate intensities
    intensity1 += (targetIntensity1 - intensity1) * animationSpeed;
    intensity2 += (targetIntensity2 - intensity2) * animationSpeed;
    intensity3 += (targetIntensity3 - intensity3) * animationSpeed;
    
    // Redraw with new values
    drawFirstTileScene();
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(animateShader);
  }
  
  // Function to update the hover configuration
  function updateHoverConfig(newConfig) {
    if (newConfig.targetPositions) {
      if (newConfig.targetPositions.light1) {
        hoverConfig.targetPositions.light1 = { ...newConfig.targetPositions.light1 };
      }
      if (newConfig.targetPositions.light2) {
        hoverConfig.targetPositions.light2 = { ...newConfig.targetPositions.light2 };
      }
      if (newConfig.targetPositions.light3) {
        hoverConfig.targetPositions.light3 = { ...newConfig.targetPositions.light3 };
      }
    }
    
    if (newConfig.targetColors) {
      if (newConfig.targetColors.light1) {
        hoverConfig.targetColors.light1 = { ...newConfig.targetColors.light1 };
      }
      if (newConfig.targetColors.light2) {
        hoverConfig.targetColors.light2 = { ...newConfig.targetColors.light2 };
      }
      if (newConfig.targetColors.light3) {
        hoverConfig.targetColors.light3 = { ...newConfig.targetColors.light3 };
      }
    }
    
    if (newConfig.targetIntensities) {
      if (newConfig.targetIntensities.light1 !== undefined) {
        hoverConfig.targetIntensities.light1 = newConfig.targetIntensities.light1;
      }
      if (newConfig.targetIntensities.light2 !== undefined) {
        hoverConfig.targetIntensities.light2 = newConfig.targetIntensities.light2;
      }
      if (newConfig.targetIntensities.light3 !== undefined) {
        hoverConfig.targetIntensities.light3 = newConfig.targetIntensities.light3;
      }
    }
    
    // If currently hovering, update the target values immediately
    if (isHovering) {
      applyHoverEffect();
    }
  }
  
  // Function to apply hover effect based on current config
  function applyHoverEffect() {
    // Apply position changes from configuration
    targetPosX1 = hoverConfig.targetPositions.light1.x;
    targetPosY1 = hoverConfig.targetPositions.light1.y;
    targetPosX2 = hoverConfig.targetPositions.light2.x;
    targetPosY2 = hoverConfig.targetPositions.light2.y;
    targetPosX3 = hoverConfig.targetPositions.light3.x;
    targetPosY3 = hoverConfig.targetPositions.light3.y;
    
    // Apply color changes from configuration
    targetColor1 = { ...hoverConfig.targetColors.light1 };
    targetColor2 = { ...hoverConfig.targetColors.light2 };
    targetColor3 = { ...hoverConfig.targetColors.light3 };
    
    // Apply intensity changes from configuration
    targetIntensity1 = hoverConfig.targetIntensities.light1;
    targetIntensity2 = hoverConfig.targetIntensities.light2;
    targetIntensity3 = hoverConfig.targetIntensities.light3;
  }
  
  // Function to reset to original values
  function resetToOriginal() {
    targetPosX1 = originalPosX1;
    targetPosY1 = originalPosY1;
    targetPosX2 = originalPosX2;
    targetPosY2 = originalPosY2;
    targetPosX3 = originalPosX3;
    targetPosY3 = originalPosY3;
    
    targetColor1 = { ...originalColor1 };
    targetColor2 = { ...originalColor2 };
    targetColor3 = { ...originalColor3 };
    
    targetIntensity1 = originalIntensity1;
    targetIntensity2 = originalIntensity2;
    targetIntensity3 = originalIntensity3;
  }
  
  // Ensure the canvas is sized properly - unique function name for first tile
  function resizeFirstTileCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      drawFirstTileScene(); // Redraw when resizing
    }

    return needResize;
  }

  // Handle window resize - with unique handler name for first tile
  const firstTileResizeHandler = function() {
    resizeFirstTileCanvasToDisplaySize(gl.canvas);
  };
  
  window.addEventListener('resize', firstTileResizeHandler);
  
  // Set up hover interactions with the investing button
  const investingBtn = document.getElementById('investing-btn');
  
  if (investingBtn) {
    // Hover start - apply effect
    investingBtn.addEventListener('mouseenter', function() {
      isHovering = true;
      applyHoverEffect();
    });
    
    // Hover end - reset to original
    investingBtn.addEventListener('mouseleave', function() {
      isHovering = false;
      resetToOriginal();
    });
  } else {
    console.warn("Element with ID 'investing-btn' not found. Hover animation won't work.");
  }

  // Initial setup
  resizeFirstTileCanvasToDisplaySize(gl.canvas);
  drawFirstTileScene();
  
  // Start the animation loop
  animationFrameId = requestAnimationFrame(animateShader);

  // Return the controller object with methods to modify behavior
  return {
    // Update hover configuration dynamically
    updateHoverConfig: updateHoverConfig,
    
    // Force apply hover effect (useful for testing)
    applyHoverEffect: function() {
      isHovering = true;
      applyHoverEffect();
    },
    
    // Force reset to original state
    resetToOriginal: function() {
      isHovering = false;
      resetToOriginal();
    },
    
    // Cleanup function
    cleanup: function() {
      window.removeEventListener('resize', firstTileResizeHandler);
      if (investingBtn) {
        const mouseEnterHandler = investingBtn.onmouseenter;
        const mouseLeaveHandler = investingBtn.onmouseleave;
        
        if (mouseEnterHandler) investingBtn.removeEventListener('mouseenter', mouseEnterHandler);
        if (mouseLeaveHandler) investingBtn.removeEventListener('mouseleave', mouseLeaveHandler);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }
  };
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', function() {
  const firstTileController = initFirstTile();
  
  // Example of how to update hover configuration after initialization
  // Uncomment to test or modify according to your needs
  
  firstTileController.updateHoverConfig({
    targetPositions: {
      light1: { x: 0.5, y: 0.5 },
      light2: { x: 0.5, y: 0.5 },
      light3: { x: 0.5, y: 0.5 }
    },
    targetColors: {
      light1: { r: 50/255, g: 255/255, b: 150/255 },
      light2: { r: 0/255, g: 180/255, b: 255/255 },
      light3: { r: 20/255, g: 200/255, b: 50/255 }
    },
    targetIntensities: {
      light1: 0.05,
      light2: 0.1,
      light3: 0.08
    }
  });
  
  
  // Make the controller accessible globally (for testing/debugging only)
  window.firstTileController = firstTileController;
});
 //==============================================================================================================================================================================================
 // Function to create and initialize the second WebGL tile with just noise
function initSecondTile() {
    // Initialize WebGL
    const canvas = document.getElementById('secondTile');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
    if (!gl) {
      return null;
    }
  
    // Vertex shader program - specific to secondTile
    const secondTileVsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
  
      varying highp vec2 vTextureCoord;
  
      void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
  
    // Fragment shader program - specific to secondTile - just noise on #1a1a1a background
    const secondTileFsSource = `
      precision mediump float;
      varying highp vec2 vTextureCoord;
      
      uniform float uSeed;
      
      // Pseudo-random function for noise generation - same as firstTile
      float random(vec2 st) {
        return fract(sin(dot(st.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main(void) {
        // Base color - #1a1a1a in RGB (26/255 = ~0.102)
        vec3 baseColor = vec3(0.102, 0.102, 0.102);
        
        // Generate static grainy noise (same approach as firstTile)
        float noise = random(vTextureCoord * 500.0);
        
        // Apply grain to base color
        float grainAmount = 0.04; // Same subtle grain amount as firstTile
        vec3 finalColor = baseColor * (1.0 - grainAmount) + noise * grainAmount;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  
    // Initialize a shader program - using unique function name for second tile
    function initSecondTileShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadSecondTileShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadSecondTileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
      // Create the shader program
      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
  
      // If creating the shader program failed, alert
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
  
      return shaderProgram;
    }
  
    // Create a shader - using unique function name for second tile
    function loadSecondTileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
  
      // Check if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
  
      return shader;
    }
  
    // Initialize buffers - using unique function name for second tile
    function initSecondTileBuffers(gl) {
      // Create a buffer for the square's positions
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Positions for a full-screen quad
      const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
      // Create a buffer for texture coordinates
      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
      const textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  
      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
      };
    }
  
    // Initialize shader program
    const secondTileShaderProgram = initSecondTileShaderProgram(gl, secondTileVsSource, secondTileFsSource);
  
    // Collect all the info needed to use the shader program
    const secondTileProgramInfo = {
      program: secondTileShaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(secondTileShaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(secondTileShaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        seed: gl.getUniformLocation(secondTileShaderProgram, 'uSeed'),
      },
    };
  
    // Initialize buffers
    const secondTileBuffers = initSecondTileBuffers(gl);
  
    // Generate a random seed once for the noise pattern
    const secondTileRandomSeed = Math.random() * 100;
  
    // Draw the scene - using unique function name for second tile
    function drawSecondTileScene() {
      resizeSecondTileCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      // Tell WebGL to use our program when drawing
      gl.useProgram(secondTileProgramInfo.program);
  
      // Set up position attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, secondTileBuffers.position);
        gl.vertexAttribPointer(
          secondTileProgramInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(secondTileProgramInfo.attribLocations.vertexPosition);
      }
  
      // Set up texture coordinates attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, secondTileBuffers.textureCoord);
        gl.vertexAttribPointer(
          secondTileProgramInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(secondTileProgramInfo.attribLocations.textureCoord);
      }
  
      // Send the fixed random seed to shader
      gl.uniform1f(secondTileProgramInfo.uniformLocations.seed, secondTileRandomSeed);
  
      // Draw
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  
    // Ensure the canvas is sized properly - unique function name for second tile
    function resizeSecondTileCanvasToDisplaySize(canvas) {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
  
      const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  
      if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        drawSecondTileScene(); // Redraw when resizing
      }
  
      return needResize;
    }
  
    // Handle window resize - with unique handler name for second tile
    const secondTileResizeHandler = function() {
      resizeSecondTileCanvasToDisplaySize(gl.canvas);
    };
    
    window.addEventListener('resize', secondTileResizeHandler);
  
    // Initial setup
    resizeSecondTileCanvasToDisplaySize(gl.canvas);
    drawSecondTileScene();
  
    // Return cleanup function to remove event listener if needed
    return {
      cleanup: function() {
        window.removeEventListener('resize', secondTileResizeHandler);
      }
    };
}

// Usage:
const secondTile = initSecondTile();
//============================================================================================================================================================================================
// Function to create and initialize the third WebGL tile with noise and subtle limited gradient
function initThirdTile() {
    // Initialize WebGL
    const canvas = document.getElementById('thirdTile');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
    if (!gl) {

      return null;
    }
  
    // Vertex shader program - specific to thirdTile
    const thirdTileVsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
  
      varying highp vec2 vTextureCoord;
  
      void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
  
    // Fragment shader program - specific to thirdTile
    // Combines noise with a very subtle, limited gradient from top-left
    const thirdTileFsSource = `
      precision mediump float;
      varying highp vec2 vTextureCoord;
      
      uniform float uSeed;
      
      // Pseudo-random function for noise generation
      float random(vec2 st) {
        return fract(sin(dot(st.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main(void) {
        // Base color - #1a1a1a in RGB (26/255 = ~0.102)
        vec3 baseColor = vec3(0.102, 0.102, 0.102);
        
        // Generate static grainy noise
        float noise = random(vTextureCoord * 500.0);
        
        // Apply grain to base color
        float grainAmount = 0.04;
        vec3 noisyColor = baseColor * (1.0 - grainAmount) + noise * grainAmount;
        
        // Define the gradient boundaries (50% horizontally, 60% vertically)
        vec2 maxGradientExtent = vec2(0.5, 0.6);
        
        // Calculate how far we are from the top-left corner in relation to our max gradient extent
        // This creates a normalized position within our gradient boundaries
        vec2 normalizedPos = vTextureCoord / maxGradientExtent;
        
        // Calculate the distance from origin within our normalized space
        // Clamp to ensure values don't exceed 1.0 outside our gradient boundaries
        float gradientDistance = clamp(length(normalizedPos) / sqrt(2.0), 0.0, 1.0);
        
        // Calculate gradient strength - apply a sharper falloff
        // Power function creates a faster falloff curve
        float gradientStrength = pow(1.0 - gradientDistance, 2.0);
        
        // Make gradient only affect areas within our defined boundaries
        // If outside max extent, gradient strength is zero
        if (vTextureCoord.x > maxGradientExtent.x || vTextureCoord.y > maxGradientExtent.y) {
            gradientStrength = 0.0;
        }
        
        // The tint color rgb(0, 255, 110) normalized to 0-1 range
        vec3 tintColor = vec3(0.0, 1.0, 0.43);
        
        // Make the gradient very subtle
        float gradientOpacity = 0.1;
        
        // Mix the noisy base color with the tint based on gradient strength
        vec3 finalColor = mix(noisyColor, tintColor, gradientStrength * gradientOpacity);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  
    // Initialize a shader program - using unique function name for third tile
    function initThirdTileShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadThirdTileShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadThirdTileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
      // Create the shader program
      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
  
      // If creating the shader program failed, alert
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
  
      return shaderProgram;
    }
  
    // Create a shader - using unique function name for third tile
    function loadThirdTileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
  
      // Check if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
  
      return shader;
    }
  
    // Initialize buffers - using unique function name for third tile
    function initThirdTileBuffers(gl) {
      // Create a buffer for the square's positions
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Positions for a full-screen quad
      const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
      // Create a buffer for texture coordinates
      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
      const textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  
      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
      };
    }
  
    // Initialize shader program
    const thirdTileShaderProgram = initThirdTileShaderProgram(gl, thirdTileVsSource, thirdTileFsSource);
  
    // Collect all the info needed to use the shader program
    const thirdTileProgramInfo = {
      program: thirdTileShaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(thirdTileShaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(thirdTileShaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        seed: gl.getUniformLocation(thirdTileShaderProgram, 'uSeed'),
      },
    };
  
    // Initialize buffers
    const thirdTileBuffers = initThirdTileBuffers(gl);
  
    // Generate a random seed once for the noise pattern
    const thirdTileRandomSeed = Math.random() * 100;
  
    // Draw the scene - using unique function name for third tile
    function drawThirdTileScene() {
      resizeThirdTileCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      // Tell WebGL to use our program when drawing
      gl.useProgram(thirdTileProgramInfo.program);
  
      // Set up position attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, thirdTileBuffers.position);
        gl.vertexAttribPointer(
          thirdTileProgramInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(thirdTileProgramInfo.attribLocations.vertexPosition);
      }
  
      // Set up texture coordinates attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, thirdTileBuffers.textureCoord);
        gl.vertexAttribPointer(
          thirdTileProgramInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(thirdTileProgramInfo.attribLocations.textureCoord);
      }
  
      // Send the fixed random seed to shader
      gl.uniform1f(thirdTileProgramInfo.uniformLocations.seed, thirdTileRandomSeed);
  
      // Draw
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  
    // Ensure the canvas is sized properly - unique function name for third tile
    function resizeThirdTileCanvasToDisplaySize(canvas) {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
  
      const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  
      if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        drawThirdTileScene(); // Redraw when resizing
      }
  
      return needResize;
    }
  
    // Handle window resize - with unique handler name for third tile
    const thirdTileResizeHandler = function() {
      resizeThirdTileCanvasToDisplaySize(gl.canvas);
    };
    
    window.addEventListener('resize', thirdTileResizeHandler);
  
    // Initial setup
    resizeThirdTileCanvasToDisplaySize(gl.canvas);
    drawThirdTileScene();
  
    // Return cleanup function to remove event listener if needed
    return {
      cleanup: function() {
        window.removeEventListener('resize', thirdTileResizeHandler);
      }
    };
}

// Usage:
const thirdTile = initThirdTile();

//-=========================================================================================================================================================================================================
//=====================================================================================================================
// Function to create and initialize the seventh WebGL tile with noise + shapes + WebGL lines
//=====================================================================================================================
// Function to create and initialize the seventh WebGL tile with noise + per‐shape custom gradients + lines
function initSeventhTile() {
    const canvas = document.getElementById('seventhTile');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;
  
    // ——— SHADERS ——————————————————————————————————————————————————————————————————————————————
    const noiseVsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      varying highp vec2 vTextureCoord;
      void main(void) {
        gl_Position   = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
    const noiseFsSource = `
      precision mediump float;
      varying highp vec2 vTextureCoord;
      uniform float uSeed;
      float random(vec2 st) {
        return fract(sin(dot(st + uSeed, vec2(12.9898,78.233))) * 43758.5453123);
      }
      void main(void) {
        vec3 base = vec3(0.102);
        float noise = random(vTextureCoord * 500.0);
        float ga    = 0.04;
        vec3 col    = base*(1.0-ga) + noise*ga;
        gl_FragColor = vec4(col,1.0);
      }
    `;
  
    const shapeVsSource = `
      attribute vec2 aShapePosition;
      varying highp vec2 vPos;
      void main(void) {
        gl_Position = vec4(aShapePosition, 0.0, 1.0);
        vPos        = aShapePosition;
      }
    `;
    const shapeFsSource = `
      precision mediump float;
      varying highp vec2 vPos;
      uniform vec2 uGradStart;
      uniform vec2 uGradEnd;
      uniform vec3 uColorStart;
      uniform vec3 uColorEnd;
      void main(void) {
        vec2 dir = uGradEnd - uGradStart;
        float len2 = dot(dir, dir);
        float t = (len2 > 0.0)
          ? clamp(dot(vPos - uGradStart, dir) / len2, 0.0, 1.0)
          : 0.0;
        vec3 c = mix(uColorStart, uColorEnd, t);
        gl_FragColor = vec4(c, 1.0);
      }
    `;
  
    const lineVsSource = `
      attribute vec2 aLinePosition;
      void main(void) {
        gl_Position = vec4(aLinePosition, 0.0, 1.0);
      }
    `;
    const lineFsSource = `
      precision mediump float;
      void main(void) {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
      }
    `;
  
    // ——— SHADER HELPERS —————————————————————————————————————————————————————————————————————
    function loadShader(gl, type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }
    function initProgram(gl, vsSrc, fsSrc) {
      const vs = loadShader(gl, gl.VERTEX_SHADER,   vsSrc);
      const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSrc);
      const p  = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    }
  
    // ——— COMPILE & LINK —————————————————————————————————————————————————————————————————
    const noiseP = initProgram(gl, noiseVsSource, noiseFsSource);
    const shapeP = initProgram(gl, shapeVsSource, shapeFsSource);
    const lineP  = initProgram(gl, lineVsSource,   lineFsSource);
  
    // ——— BUFFERS & DATA ——————————————————————————————————————————————————————————————————————
    // Full-screen quad for noise
    const quadPos   = new Float32Array([-1,1, 1,1, -1,-1, 1,-1]);
    const quadTC    = new Float32Array([ 0,0, 1,0,  0,1, 1,1 ]);
    const quadPosBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadPos, gl.STATIC_DRAW);
    const quadTCBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadTCBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadTC, gl.STATIC_DRAW);
  
    // Per-shape definitions
    const shapes = [
      {
        coords:             [[22,23],[48,23],[48,40],[22,40]],//
        gradientStartCoord: [22,23],
        gradientEndCoord:   [48,47],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[22,40],[22,47],[40,47],[48,40]],//
        gradientStartCoord: [22,23],
        gradientEndCoord:   [50,50],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[52,23],[74,23],[57,40],[52,40]],
        gradientStartCoord: [74,23],
        gradientEndCoord:   [52,40],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[60,43],[60,57],[78,69],[78,26]],
        gradientStartCoord: [78,50],
        gradientEndCoord:   [60,50],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[60,57],[78,69],[75,72],[60,57]],
        gradientStartCoord: [78,50],
        gradientEndCoord:   [60,50],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[43,60],[57,60],[70,77],[26,77]],
        gradientStartCoord: [50,77],
        gradientEndCoord:   [50,60],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[57,60],[70,77],[72,75],[57,60]],
        gradientStartCoord: [50,77],
        gradientEndCoord:   [50,60],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      },
      {
        coords:             [[22,53],[40,53],[40,56],[22,75]],
        gradientStartCoord: [22,75],
        gradientEndCoord:   [40,53],
        gradientColor:      { start: [0.1137, 0.2745, 0.1961], end: [0.102, 0.102, 0.102] }
      }
    ];
  
    // Flatten shape coords into clip-space
    const shapeVerts = new Float32Array(shapes.flatMap(s =>
      s.coords.flatMap(([x,y]) => [ x/50 - 1, 1 - y/50 ])
    ));
    const shapeBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, shapeVerts, gl.STATIC_DRAW);
  
    // Precompute gradient uniforms
    const gradStarts  = shapes.map(s => { const [x,y] = s.gradientStartCoord; return [ x/50 - 1, 1 - y/50 ]; });
    const gradEnds    = shapes.map(s => { const [x,y] = s.gradientEndCoord;   return [ x/50 - 1, 1 - y/50 ]; });
    const colorStarts = shapes.map(s => s.gradientColor.start);
    const colorEnds   = shapes.map(s => s.gradientColor.end);
  
    // Lines for stroke
    const lines = [
        { start: [20,20], end: [80,20] },
        { start: [20,20], end: [20,80] },
        { start: [20,80], end: [70,80] },
        { start: [80,20], end: [80,70] },
        { start: [80,70], end: [70,80] },
        { start: [20,50], end: [40,50] },
        { start: [50,20], end: [50,40] },
        { start: [72,78], end: [78,78] },
        { start: [78,78], end: [78,72] },
        { start: [78,78], end: [60,60] },
        { start: [80,20], end: [60,40] },
        { start: [20,80], end: [40,60] }
    ];
    const lineVerts = new Float32Array(lines.flatMap(l => {
      const sx = l.start[0]/50 - 1, sy = 1 - l.start[1]/50;
      const ex = l.end[0]/50   - 1, ey = 1 - l.end[1]/50;
      return [ sx, sy, ex, ey ];
    }));
    const lineBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, lineVerts, gl.STATIC_DRAW);
  
    // ——— LOCATIONS —————————————————————————————————————————————————————————————————————
    const noiseInfo = {
      program: noiseP,
      posLoc:  gl.getAttribLocation(noiseP, 'aVertexPosition'),
      texLoc:  gl.getAttribLocation(noiseP, 'aTextureCoord'),
      seedLoc: gl.getUniformLocation(noiseP, 'uSeed'),
    };
    const shapeInfo = {
      program:    shapeP,
      posLoc:     gl.getAttribLocation(shapeP, 'aShapePosition'),
      gradStart:  gl.getUniformLocation(shapeP, 'uGradStart'),
      gradEnd:    gl.getUniformLocation(shapeP, 'uGradEnd'),
      colorStart: gl.getUniformLocation(shapeP, 'uColorStart'),
      colorEnd:   gl.getUniformLocation(shapeP, 'uColorEnd'),
    };
    const lineInfo = {
      program: lineP,
      posLoc:  gl.getAttribLocation(lineP, 'aLinePosition'),
    };
  
    const seed = Math.random() * 100;
  
    // ——— DRAW LOOP —————————————————————————————————————————————————————————————————————
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
  
    function draw() {
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      // 1) Noise
      gl.useProgram(noiseInfo.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf);
      gl.enableVertexAttribArray(noiseInfo.posLoc);
      gl.vertexAttribPointer(noiseInfo.posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadTCBuf);
      gl.enableVertexAttribArray(noiseInfo.texLoc);
      gl.vertexAttribPointer(noiseInfo.texLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(noiseInfo.seedLoc, seed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
      // 2) Shapes with per-shape custom gradient
      gl.useProgram(shapeInfo.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuf);
      gl.enableVertexAttribArray(shapeInfo.posLoc);
      gl.vertexAttribPointer(shapeInfo.posLoc, 2, gl.FLOAT, false, 0, 0);
      for (let i = 0; i < shapes.length; i++) {
        gl.uniform2fv(shapeInfo.gradStart,  gradStarts[i]);
        gl.uniform2fv(shapeInfo.gradEnd,    gradEnds[i]);
        gl.uniform3fv(shapeInfo.colorStart, colorStarts[i]);
        gl.uniform3fv(shapeInfo.colorEnd,   colorEnds[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
      }
  
      // 3) Gray lines
      gl.useProgram(lineInfo.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      gl.enableVertexAttribArray(lineInfo.posLoc);
      gl.vertexAttribPointer(lineInfo.posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.LINES, 0, lineVerts.length / 2);
    }
  
    window.addEventListener('resize', draw);
    draw();
  
    return {
      lines,
      shapes,
      cleanup() { window.removeEventListener('resize', draw); }
    };
  }
  
  // Usage:
  const seventhTile = initSeventhTile();
  //======================================================================================================================================================================================
// WebGL Eighth Tile with Adjustable Bezier Curves and Green Gradient
// ----------------------------------------------
// Main configuration options - adjust these as needed
const eighthTileConfig = {
  // Background settings
  baseColor: [0.1176, 0.1412, 0.1216], // Dark grey background
  grainAmount: 0.03, // Subtle grain effect
  
  // Gradient settings
  gradientEnabled: true,
  gradientStartColor: [0.2, 0.3, 0.4], // Dark green //NSUTIN
  gradientEndColor: [0.1020, 0.1020, 0.1020],   // Darker green
  gradientStartCoord: [1.0, 0.0], // Top-right (x, y)
  gradientEndCoord: [0.5, 0.5],   // Bottom-left (x, y)
  gradientStrength: 0.3, // How strong the gradient effect is (0-1)
  
  // Curve settings
  curveColor: [0.6, 0.6, 0.6], // Gray lines (RGB values from 0-1)
  curveThickness: 0.004, // Line thickness (normalized 0-1)
  
  // Maximum curves to support
  maxCurves: 16, // Increased from the original 4
  
  // Bezier curve definitions - keeping the original curves
  curves: [
    // Curve 1: S-curve example
    [
      [0.0, 0.9],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0]   
    ],
    // Curve 2: Arc example
    [
      [0.0, 0.7],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0]    
    ],
    [
      [0.0, 0.5],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0]  
    ],
    [
      [0.0, 0.3],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0]  
    ],
    // Add more curves as needed - now you can add up to maxCurves
    [
      [0.0, 0.1],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0] 
    ],
    [
      [0.0, 1.1],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0] 
    ],
    [
      [0.0, -0.1],  
      [0.4, 0.1],   
      [0.6, 0.9], 
      [1.0, 0.0] 
    ],
    [
      [1, 0],  
      [0.6, 0.9],   
      [0.4, 0.1], 
      [1, 1] 
    ],
    [
      [0, 1],  
      [0.6, 0.9],   
      [0.4, 0.1], 
      [1, 1] 
    ],
    [
      [0, 1],  
      [0.6, 0.5],   
      [0.4, 0.2], 
      [1, 1] 
    ],
    [
      [0, 1],  
      [0.6, 0.5],   
      [0.4, 0.3], 
      [1, 1] 
    ]
  ]
};

// Function to create and initialize the eighth WebGL tile with noise and adjustable bezier curves
function initEighthTile() {
    // Initialize WebGL
    const canvas = document.getElementById('eighthTile');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }
  
    // Vertex shader program
    const eighthTileVsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
  
      varying highp vec2 vTextureCoord;
  
      void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
  
    // Generate the dynamic part of the fragment shader that handles multiple curves
    function generateCurveShaderCode(maxCurves) {
      let uniformDeclarations = '';
      let curveProcessingCode = '';
      
      // Generate uniform declarations for each curve
      for (let i = 0; i < maxCurves; i++) {
        uniformDeclarations += `
          uniform vec2 uC${i}P0; // Curve ${i}, Point 0
          uniform vec2 uC${i}P1; // Curve ${i}, Point 1
          uniform vec2 uC${i}P2; // Curve ${i}, Point 2
          uniform vec2 uC${i}P3; // Curve ${i}, Point 3
        `;
        
        // Generate the curve processing code
        curveProcessingCode += `
          if (uNumCurves > ${i}) {
            float dist${i} = distToBezier(vTextureCoord, uC${i}P0, uC${i}P1, uC${i}P2, uC${i}P3, uCurveThickness);
            curveInfluence = max(curveInfluence, dist${i});
          }
        `;
      }
      
      return { uniformDeclarations, curveProcessingCode };
    }
    
    // Generate the dynamic shader code
    const dynamicShaderCode = generateCurveShaderCode(eighthTileConfig.maxCurves);
    
    // Fragment shader program with noise, bezier curves, and gradient
    const eighthTileFsSource = `
      precision highp float;
      varying highp vec2 vTextureCoord;
      
      uniform float uSeed;
      uniform vec3 uBaseColor;
      uniform float uGrainAmount;
      
      // Gradient settings
      uniform bool uGradientEnabled;
      uniform vec3 uGradientStartColor;
      uniform vec3 uGradientEndColor;
      uniform vec2 uGradientStartCoord;
      uniform vec2 uGradientEndCoord;
      uniform float uGradientStrength;
      
      uniform int uNumCurves; // Number of active curves
      uniform float uCurveThickness;
      uniform vec3 uCurveColor;
      
      // Dynamic curve control points uniform declarations
      ${dynamicShaderCode.uniformDeclarations}
      
      // Pseudo-random function for noise generation
      float random(vec2 st) {
        return fract(sin(dot(st.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Calculate distance to a cubic bezier curve segment
      float distToBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2, vec2 p3, float thickness) {
        // Simple approximation by sampling points along the curve
        float minDist = 1.0;
        const int steps = 30;
        
        for (int i = 0; i <= steps; i++) {
          float t = float(i) / float(steps);
          float mt = 1.0 - t;
          
          // Cubic bezier formula
          vec2 bp = mt*mt*mt*p0 + 3.0*mt*mt*t*p1 + 3.0*mt*t*t*p2 + t*t*t*p3;
          
          float dist = length(p - bp);
          minDist = min(minDist, dist);
        }
        
        return minDist < thickness ? 1.0 - smoothstep(thickness * 0.7, thickness, minDist) : 0.0;
      }
      
      // Calculate gradient based on point between start and end coordinates
      float calculateGradientFactor(vec2 point, vec2 startCoord, vec2 endCoord) {
        // Calculate the vector from end to start
        vec2 gradientVector = startCoord - endCoord;
        
        // Calculate the vector from end to current point
        vec2 pointVector = point - endCoord;
        
        // Project pointVector onto gradientVector to get position along gradient
        float projection = dot(pointVector, gradientVector) / dot(gradientVector, gradientVector);
        
        // Clamp to [0,1] range
        return clamp(projection, 0.0, 1.0);
      }
      
      void main(void) {
        // Generate static grainy noise
        float noise = random(vTextureCoord * 500.0);
        
        // Calculate gradient position
        float gradientFactor = calculateGradientFactor(vTextureCoord, uGradientStartCoord, uGradientEndCoord);
        
        // Mix gradient colors
        vec3 gradientColor = mix(uGradientEndColor, uGradientStartColor, gradientFactor);
        
        // Apply gradient if enabled
        vec3 baseWithGradient = uGradientEnabled ? 
                               mix(uBaseColor, gradientColor, uGradientStrength) : 
                               uBaseColor;
        
        // Apply grain to base color
        vec3 finalColor = baseWithGradient * (1.0 - uGrainAmount) + vec3(noise) * uGrainAmount;
        
        // Drawing bezier curves
        float curveInfluence = 0.0;
        
        // Process each curve with dynamic code
        ${dynamicShaderCode.curveProcessingCode}
        
        // Mix base color with curve color
        finalColor = mix(finalColor, uCurveColor, curveInfluence);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  
    // Initialize a shader program
    function initEighthTileShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadEighthTileShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadEighthTileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
      // Check if shaders compiled successfully before proceeding
      if (!vertexShader || !fragmentShader) {
        console.error("Failed to compile shaders");
        return null;
      }

      // Create the shader program
      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
  
      // If creating the shader program failed, alert
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
  
      return shaderProgram;
    }
  
    // Create a shader
    function loadEighthTileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
  
      // Check if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
  
      return shader;
    }
  
    // Initialize buffers
    function initEighthTileBuffers(gl) {
      // Create a buffer for the square's positions
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Positions for a full-screen quad
      const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
      // Create a buffer for texture coordinates
      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
      const textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
      ];
  
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  
      return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
      };
    }
  
    // Initialize shader program
    const eighthTileShaderProgram = initEighthTileShaderProgram(gl, eighthTileVsSource, eighthTileFsSource);
    
    // Exit if shader program failed to initialize
    if (!eighthTileShaderProgram) {
      return null;
    }
  
    // Build uniform locations dynamically for all possible curves
    const uniformLocations = {
      seed: gl.getUniformLocation(eighthTileShaderProgram, 'uSeed'),
      baseColor: gl.getUniformLocation(eighthTileShaderProgram, 'uBaseColor'),
      grainAmount: gl.getUniformLocation(eighthTileShaderProgram, 'uGrainAmount'),
      numCurves: gl.getUniformLocation(eighthTileShaderProgram, 'uNumCurves'),
      curveThickness: gl.getUniformLocation(eighthTileShaderProgram, 'uCurveThickness'),
      curveColor: gl.getUniformLocation(eighthTileShaderProgram, 'uCurveColor'),
      gradientEnabled: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientEnabled'),
      gradientStartColor: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientStartColor'),
      gradientEndColor: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientEndColor'),
      gradientStartCoord: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientStartCoord'),
      gradientEndCoord: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientEndCoord'),
      gradientStrength: gl.getUniformLocation(eighthTileShaderProgram, 'uGradientStrength')
    };
    
    // Add curve control point uniform locations dynamically
    for (let i = 0; i < eighthTileConfig.maxCurves; i++) {
      uniformLocations[`c${i}p0`] = gl.getUniformLocation(eighthTileShaderProgram, `uC${i}P0`);
      uniformLocations[`c${i}p1`] = gl.getUniformLocation(eighthTileShaderProgram, `uC${i}P1`);
      uniformLocations[`c${i}p2`] = gl.getUniformLocation(eighthTileShaderProgram, `uC${i}P2`);
      uniformLocations[`c${i}p3`] = gl.getUniformLocation(eighthTileShaderProgram, `uC${i}P3`);
    }
    
    // Collect all the info needed to use the shader program
    const eighthTileProgramInfo = {
      program: eighthTileShaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(eighthTileShaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(eighthTileShaderProgram, 'aTextureCoord'),
      },
      uniformLocations: uniformLocations
    };
  
    // Initialize buffers
    const eighthTileBuffers = initEighthTileBuffers(gl);
  
    // Generate a random seed for the noise pattern
    const eighthTileRandomSeed = Math.random() * 100;
    
    // Use the config defined at the top of the file
    const config = { ...eighthTileConfig };
    
    // Function to update the configuration (if needed)
    function updateEighthTileConfig(newConfig) {
      // Update only the provided properties
      if (newConfig.baseColor) config.baseColor = newConfig.baseColor;
      if (newConfig.grainAmount !== undefined) config.grainAmount = newConfig.grainAmount;
      if (newConfig.curveThickness !== undefined) config.curveThickness = newConfig.curveThickness;
      if (newConfig.curveColor) config.curveColor = newConfig.curveColor;
      if (newConfig.curves) config.curves = newConfig.curves;
      if (newConfig.gradientEnabled !== undefined) config.gradientEnabled = newConfig.gradientEnabled;
      if (newConfig.gradientStartColor) config.gradientStartColor = newConfig.gradientStartColor;
      if (newConfig.gradientEndColor) config.gradientEndColor = newConfig.gradientEndColor;
      if (newConfig.gradientStartCoord) config.gradientStartCoord = newConfig.gradientStartCoord;
      if (newConfig.gradientEndCoord) config.gradientEndCoord = newConfig.gradientEndCoord;
      if (newConfig.gradientStrength !== undefined) config.gradientStrength = newConfig.gradientStrength;
      
      // Redraw with new config
      drawEighthTileScene();
    }
  
    // Draw the scene
    function drawEighthTileScene() {
      resizeEighthTileCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      // Tell WebGL to use our program
      gl.useProgram(eighthTileProgramInfo.program);
  
      // Set up position attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, eighthTileBuffers.position);
        gl.vertexAttribPointer(
          eighthTileProgramInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(eighthTileProgramInfo.attribLocations.vertexPosition);
      }
  
      // Set up texture coordinates attribute
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, eighthTileBuffers.textureCoord);
        gl.vertexAttribPointer(
          eighthTileProgramInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(eighthTileProgramInfo.attribLocations.textureCoord);
      }
  
      // Set uniform values for basic properties
      gl.uniform1f(eighthTileProgramInfo.uniformLocations.seed, eighthTileRandomSeed);
      gl.uniform3fv(eighthTileProgramInfo.uniformLocations.baseColor, new Float32Array(config.baseColor));
      gl.uniform1f(eighthTileProgramInfo.uniformLocations.grainAmount, config.grainAmount);
      gl.uniform1f(eighthTileProgramInfo.uniformLocations.curveThickness, config.curveThickness);
      gl.uniform3fv(eighthTileProgramInfo.uniformLocations.curveColor, new Float32Array(config.curveColor));
      
      // Set gradient uniforms
      gl.uniform1i(eighthTileProgramInfo.uniformLocations.gradientEnabled, config.gradientEnabled);
      gl.uniform3fv(eighthTileProgramInfo.uniformLocations.gradientStartColor, new Float32Array(config.gradientStartColor));
      gl.uniform3fv(eighthTileProgramInfo.uniformLocations.gradientEndColor, new Float32Array(config.gradientEndColor));
      gl.uniform2fv(eighthTileProgramInfo.uniformLocations.gradientStartCoord, new Float32Array(config.gradientStartCoord));
      gl.uniform2fv(eighthTileProgramInfo.uniformLocations.gradientEndCoord, new Float32Array(config.gradientEndCoord));
      gl.uniform1f(eighthTileProgramInfo.uniformLocations.gradientStrength, config.gradientStrength);
      
      // Set the number of curves
      gl.uniform1i(eighthTileProgramInfo.uniformLocations.numCurves, Math.min(config.curves.length, config.maxCurves));
      
      // Set individual curve points dynamically
      for (let i = 0; i < Math.min(config.curves.length, config.maxCurves); i++) {
        gl.uniform2fv(eighthTileProgramInfo.uniformLocations[`c${i}p0`], new Float32Array(config.curves[i][0]));
        gl.uniform2fv(eighthTileProgramInfo.uniformLocations[`c${i}p1`], new Float32Array(config.curves[i][1]));
        gl.uniform2fv(eighthTileProgramInfo.uniformLocations[`c${i}p2`], new Float32Array(config.curves[i][2]));
        gl.uniform2fv(eighthTileProgramInfo.uniformLocations[`c${i}p3`], new Float32Array(config.curves[i][3]));
      }
  
      // Draw
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  
    // Ensure the canvas is sized properly
    function resizeEighthTileCanvasToDisplaySize(canvas) {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
  
      const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  
      if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
  
      return needResize;
    }
  
    // Handle window resize
    const eighthTileResizeHandler = function() {
      resizeEighthTileCanvasToDisplaySize(gl.canvas);
      drawEighthTileScene();
    };
    
    window.addEventListener('resize', eighthTileResizeHandler);
  
    // Initial setup
    resizeEighthTileCanvasToDisplaySize(gl.canvas);
    drawEighthTileScene();
  
    // Return API for interaction and cleanup
    return {
      updateConfig: updateEighthTileConfig,
      getConfig: () => ({ ...config }),
      redraw: drawEighthTileScene,
      cleanup: function() {
        window.removeEventListener('resize', eighthTileResizeHandler);
      }
    };
}

// Initialize the tile when window loads
window.addEventListener('load', function() {
  // Make sure the canvas element exists in the HTML
  if (document.getElementById('eighthTile')) {
    const eighthTile = initEighthTile();
    
    // Optional: Make it accessible globally for console debugging
    window.eighthTile = eighthTile;
  }
});
  //============================================================================================================================================================================================
  // Function to create and initialize the ninth WebGL tile with customizable circles and gradient
function initNinthTile() {
  // Initialize WebGL
  const canvas = document.getElementById('ninthTile');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return null;
  }

  // Default settings for circles and gradient
  let settings = {
    circles: [
      { x: 0.1, y: 0.9 }
    ],
    circleRadius: 4.0, // in pixels
    gradient: {
      startCoord: { x: 0.0, y: 0.0 },
      endCoord: { x: 1.0, y: 1.0 },
      startColor: [0.2, 0.3, 0.4], // RGB //NSUTIN
      endColor: [0.6, 0.7, 0.8]    // RGB
    },
    noiseIntensity: 0.04
  };

  // Vertex shader program
  const ninthTileVsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program with circles, exponential gradient and noise
  const ninthTileFsSource = `
    precision mediump float;
    varying highp vec2 vTextureCoord;
    
    uniform float uSeed;
    uniform vec2 uCirclePositions[10]; // Support up to 10 circles
    uniform int uCircleCount;
    uniform float uCircleRadius;
    uniform vec2 uResolution;
    uniform vec2 uGradientStart;
    uniform vec2 uGradientEnd;
    uniform vec3 uGradientStartColor;
    uniform vec3 uGradientEndColor;
    uniform float uNoiseIntensity;
    
    // Pseudo-random function for noise generation
    float random(vec2 st) {
      return fract(sin(dot(st.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main(void) {
      // Calculate distance from each circle
      float minCircleDist = 1.0;
      
      for (int i = 0; i < 10; i++) {
        if (i >= uCircleCount) break;
        
        vec2 circlePos = uCirclePositions[i];
        
        // Calculate pixel positions
        vec2 pixelCoord = vTextureCoord * uResolution;
        vec2 circlePixelPos = circlePos * uResolution;
        
        // Calculate distance in pixels
        float pixelDist = distance(pixelCoord, circlePixelPos);
        
        // Check if within circle radius (in pixels)
        float circleEdge = smoothstep(uCircleRadius - 0.5, uCircleRadius + 0.5, pixelDist);
        minCircleDist = min(minCircleDist, circleEdge);
      }
      
      // Calculate gradient position
      vec2 gradientVector = uGradientEnd - uGradientStart;
      float gradientLength = length(gradientVector);
      vec2 normalizedGradient = gradientVector / gradientLength;
      
      // Project current point onto gradient line
      vec2 pointVector = vTextureCoord - uGradientStart;
      float projection = dot(pointVector, normalizedGradient);
      
      // Normalize and clamp projection
      float gradientPosition = clamp(projection / gradientLength, 0.0, 1.0);
      
      // Apply exponential curve to gradient (ease-in-out)
      gradientPosition = gradientPosition < 0.5 
        ? 2.0 * gradientPosition * gradientPosition 
        : 1.0 - pow(-2.0 * gradientPosition + 2.0, 2.0) / 2.0;
      
      // Mix colors based on gradient position
      vec3 gradientColor = mix(uGradientStartColor, uGradientEndColor, gradientPosition);
      
      // Generate noise
      float noise = random(vTextureCoord * 500.0);
      
      // Circle color (gray)
      vec3 circleColor = vec3(0.5, 0.5, 0.5);
      
      // Combine gradient and circles
      vec3 baseColor = mix(gradientColor, circleColor, 1.0 - minCircleDist);
      
      // Apply noise
      vec3 finalColor = baseColor * (1.0 - uNoiseIntensity) + noise * uNoiseIntensity;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Initialize a shader program
  function initNinthTileShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadNinthTileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadNinthTileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  // Create a shader
  function loadNinthTileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Initialize buffers
  function initNinthTileBuffers(gl) {
    // Create a buffer for the square's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions for a full-screen quad
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coordinates
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
    };
  }

  // Initialize shader program
  const ninthTileShaderProgram = initNinthTileShaderProgram(gl, ninthTileVsSource, ninthTileFsSource);

  // Collect all the info needed to use the shader program
  const ninthTileProgramInfo = {
    program: ninthTileShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(ninthTileShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(ninthTileShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      seed: gl.getUniformLocation(ninthTileShaderProgram, 'uSeed'),
      circlePositions: gl.getUniformLocation(ninthTileShaderProgram, 'uCirclePositions'),
      circleCount: gl.getUniformLocation(ninthTileShaderProgram, 'uCircleCount'),
      circleRadius: gl.getUniformLocation(ninthTileShaderProgram, 'uCircleRadius'),
      resolution: gl.getUniformLocation(ninthTileShaderProgram, 'uResolution'),
      gradientStart: gl.getUniformLocation(ninthTileShaderProgram, 'uGradientStart'),
      gradientEnd: gl.getUniformLocation(ninthTileShaderProgram, 'uGradientEnd'),
      gradientStartColor: gl.getUniformLocation(ninthTileShaderProgram, 'uGradientStartColor'),
      gradientEndColor: gl.getUniformLocation(ninthTileShaderProgram, 'uGradientEndColor'),
      noiseIntensity: gl.getUniformLocation(ninthTileShaderProgram, 'uNoiseIntensity'),
    },
  };

  // Initialize buffers
  const ninthTileBuffers = initNinthTileBuffers(gl);

  // Generate a random seed for the noise pattern
  const ninthTileRandomSeed = Math.random() * 100;

  // Draw the scene
  function drawNinthTileScene() {
    resizeNinthTileCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell WebGL to use our program when drawing
    gl.useProgram(ninthTileProgramInfo.program);

    // Set up position attribute
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, ninthTileBuffers.position);
      gl.vertexAttribPointer(
        ninthTileProgramInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(ninthTileProgramInfo.attribLocations.vertexPosition);
    }

    // Set up texture coordinates attribute
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, ninthTileBuffers.textureCoord);
      gl.vertexAttribPointer(
        ninthTileProgramInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(ninthTileProgramInfo.attribLocations.textureCoord);
    }

    // Set uniforms
    gl.uniform1f(ninthTileProgramInfo.uniformLocations.seed, ninthTileRandomSeed);
    
    // Pass canvas resolution for proper pixel calculations
    gl.uniform2f(ninthTileProgramInfo.uniformLocations.resolution, 
                 gl.canvas.width, gl.canvas.height);
    
    // Set circle positions
    const circlePositions = new Float32Array(settings.circles.length * 2);
    for (let i = 0; i < settings.circles.length; i++) {
      circlePositions[i*2] = settings.circles[i].x;
      circlePositions[i*2+1] = settings.circles[i].y;
    }
    gl.uniform2fv(ninthTileProgramInfo.uniformLocations.circlePositions, circlePositions);
    gl.uniform1i(ninthTileProgramInfo.uniformLocations.circleCount, settings.circles.length);
    gl.uniform1f(ninthTileProgramInfo.uniformLocations.circleRadius, settings.circleRadius);
    
    // Set gradient
    gl.uniform2f(ninthTileProgramInfo.uniformLocations.gradientStart, 
      settings.gradient.startCoord.x, settings.gradient.startCoord.y);
    gl.uniform2f(ninthTileProgramInfo.uniformLocations.gradientEnd, 
      settings.gradient.endCoord.x, settings.gradient.endCoord.y);
    gl.uniform3fv(ninthTileProgramInfo.uniformLocations.gradientStartColor, 
      new Float32Array(settings.gradient.startColor));
    gl.uniform3fv(ninthTileProgramInfo.uniformLocations.gradientEndColor, 
      new Float32Array(settings.gradient.endColor));
    
    // Set noise intensity
    gl.uniform1f(ninthTileProgramInfo.uniformLocations.noiseIntensity, settings.noiseIntensity);

    // Draw
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }

  // Ensure the canvas is sized properly
  function resizeNinthTileCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      drawNinthTileScene(); // Redraw when resizing
    }

    return needResize;
  }

  // Handle window resize
  const ninthTileResizeHandler = function() {
    resizeNinthTileCanvasToDisplaySize(gl.canvas);
  };
  
  window.addEventListener('resize', ninthTileResizeHandler);

  // Initial setup
  resizeNinthTileCanvasToDisplaySize(gl.canvas);
  drawNinthTileScene();

  // Public API for updating settings
  function updateSettings(newSettings) {
    // Deep merge new settings with existing settings
    if (newSettings.circles) {
      settings.circles = newSettings.circles;
    }
    
    if (newSettings.circleRadius !== undefined) {
      settings.circleRadius = newSettings.circleRadius;
    }
    
    if (newSettings.gradient) {
      if (newSettings.gradient.startCoord) {
        settings.gradient.startCoord = newSettings.gradient.startCoord;
      }
      if (newSettings.gradient.endCoord) {
        settings.gradient.endCoord = newSettings.gradient.endCoord;
      }
      if (newSettings.gradient.startColor) {
        settings.gradient.startColor = newSettings.gradient.startColor;
      }
      if (newSettings.gradient.endColor) {
        settings.gradient.endColor = newSettings.gradient.endColor;
      }
    }
    
    if (newSettings.noiseIntensity !== undefined) {
      settings.noiseIntensity = newSettings.noiseIntensity;
    }
    
    // Redraw with new settings
    drawNinthTileScene();
  }

  // Return public API and cleanup function
  return {
    updateSettings: updateSettings,
    cleanup: function() {
      window.removeEventListener('resize', ninthTileResizeHandler);
    }
  };
}

// Usage:
const ninthTile = initNinthTile();

// Example updating settings:
ninthTile.updateSettings({
circles: [
  { x: 0.09, y: 0.16 },
  { x: 0.15, y: 0.25 },
  { x: 0.50, y: 0.25 },
  { x: 0.85, y: 0.25 },
  { x: 0.91, y: 0.16 },//
  { x: 0.09, y: 0.84 },
  { x: 0.15, y: 0.75 },
  { x: 0.50, y: 0.75 },
  { x: 0.85, y: 0.75 },
  { x: 0.91, y: 0.84 }
],
circleRadius: 4.0,
gradient: {
  startCoord: { x: 1.5, y: 1.5 },
  endCoord: { x: 0.4, y: 0.4 },
  startColor: [0.1, 0.5, 0.3],
  endColor: [0.1, 0.1, 0.1]
},
noiseIntensity: 0.06
});