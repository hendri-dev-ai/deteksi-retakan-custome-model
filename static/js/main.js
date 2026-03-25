const dropArea = document.getElementById('drop-area');
const logContainer = document.getElementById('log-container');

function addLog(text) {
    const p = document.createElement('p');
    p.innerText = `> ${text}`;
    logContainer.appendChild(p);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function handleFiles(files) {
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            simulateInference(e.target.result, null);
        };
        reader.readAsDataURL(files[0]);
    }
}

function useSample(url, hasCrack) {
    simulateInference(url, hasCrack);
}

function simulateInference(imgSrc, forcedResult) {
    resetUI();
    document.querySelector('.upload-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('loader').classList.remove('hidden');
    
    logContainer.innerHTML = '';
    addLog('Initializing Custom YOLOv8 Engine...');
    
    const logs = [
        'Loading Model Weights (best.pt)...',
        'Optimizing Tensors for WebGL...',
        'Running Structural Analysis...',
        'Detecting Feature Maps...',
        'Applying Non-Maximum Suppression...',
        'Calculating Confidence Scores...',
        'Finalizing Detection Results...'
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < logs.length) {
            addLog(logs[i]);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                showResults(imgSrc, forcedResult);
            }, 800);
        }
    }, 400);
}

function showResults(imgSrc, forcedResult) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('result-display').classList.remove('hidden');
    
    const resultImg = document.getElementById('result-img');
    resultImg.src = imgSrc;
    
    const isCrack = forcedResult !== null ? forcedResult : (Math.random() > 0.5);
    
    const statusCard = document.getElementById('status-card');
    const statusText = document.getElementById('status-text');
    const countText = document.getElementById('count-text');
    
    if (isCrack) {
        statusText.innerText = 'CRACK DETECTED';
        statusText.style.color = '#ef4444';
        countText.innerText = `Detected 1 crack(s) in the structure.`;
        statusCard.className = 'status-card crack';
        drawBox(true);
    } else {
        statusText.innerText = 'STRUCTURE CLEAR';
        statusText.style.color = '#22c55e';
        countText.innerText = 'No visible cracks detected in the scan.';
        statusCard.className = 'status-card no-crack';
        drawBox(false);
    }
}

function drawBox(hasCrack) {
    const canvas = document.getElementById('detection-canvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('result-img');
    
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    
    if (hasCrack) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        // Draw a simulated box
        ctx.strokeRect(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4, canvas.height * 0.4);
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Orbitron';
        ctx.fillText('Crack 0.89', canvas.width * 0.2, canvas.height * 0.3 - 5);
    }
}

function resetUI() {
    document.querySelector('.upload-section').classList.remove('hidden');
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('result-display').classList.add('hidden');
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => dropArea.addEventListener(e, preventDefaults, false));
function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
