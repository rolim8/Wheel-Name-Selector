// Array to store names
const names = [];
// Get canvas element and context
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
let spinning = false;

// Function to draw the wheel
function drawWheel() {
  const total = names.length;
  if (total === 0) {
    // Draw empty wheel with message if no names are added
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Add names to spin!", radius, radius);
    return;
  }

  const angleStep = (2 * Math.PI) / total;

  names.forEach((name, index) => {
    const startAngle = index * angleStep;
    const endAngle = startAngle + angleStep;

    // Draw each segment of the wheel
    ctx.fillStyle = `hsl(${(360 / total) * index}, 80%, 70%)`;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fill();

    // Draw the name on the segment
    ctx.fillStyle = "black";
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + angleStep / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 25px Arial";
    ctx.fillText(name, radius - 10, 5);
    ctx.restore();
  });
}

// Function to add a name to the wheel
function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();
  if (name && !spinning) {
    names.push(name);
    input.value = "";
    updateNameList();
    drawWheel();
  }
}

// Function to update the list of names displayed
function updateNameList() {
  const list = document.getElementById("nameList");
  list.innerHTML = names.join(", ");
}

// Function to display the winner
function displayWinner(winner) {
  const winnerDisplay = document.getElementById("winnerDisplay");
  const previousWinners = winnerDisplay.textContent
    ? winnerDisplay.textContent.split(", ").filter((w) => w)
    : [];
  previousWinners.push(winner);
  winnerDisplay.textContent = previousWinners.join(", ");
}

// Function to clear the wheel
function clearWheel() {
  names.length = 0;
  updateNameList();
  drawWheel();
  displayWinner("");
}

// Function to spin the wheel
function spinWheel() {
  if (names.length === 0 || spinning) return;
  spinning = true;

  // Clear previous winner
  displayWinner("");

  // Play spinning sound
  const spinSound = document.getElementById("spinSound");
  spinSound.volume = 0.2; // Set volume to 20%
  spinSound.play();

  const spinDuration = 5000; // 5 seconds
  const totalFrames = spinDuration / (1000 / 60); // 60 FPS
  let currentFrame = 0;
  let currentAngle = 0;
  const spinAngle = Math.random() * Math.PI * 4 + Math.PI * 8; // Random spins

  // Animation function for spinning the wheel
  function animateSpin() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentAngle);
    ctx.translate(-radius, -radius);
    drawWheel();
    ctx.restore();

    if (currentFrame < totalFrames) {
      const progress = currentFrame / totalFrames;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      currentAngle = easeOutQuad * spinAngle;
      currentFrame++;
      requestAnimationFrame(animateSpin);
    } else {
      spinning = false;
      spinSound.pause();
      spinSound.currentTime = 0;

      // Play end spin sound
      const endSpinSound = document.getElementById("endSpinSound");
      endSpinSound.volume = 0.2; // Set volume to 20%
      endSpinSound.play();

      const selectedIndex = Math.floor(
        (names.length - ((currentAngle / (Math.PI * 2)) % names.length)) %
          names.length
      );
      displayWinner(names[selectedIndex]);
    }
  }

  animateSpin();
}

// Initial draw of the wheel
drawWheel();
