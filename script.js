// Navigation state
let currentStep = 0;
let completedSteps = [];

// Sample route data
const routeData = {
    from: "Library Entrance",
    to: "Computer Lab 201",
    steps: [
        {
            id: 1,
            instruction: "Start at Main Library Entrance",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
            description: "Begin your journey at the main entrance. Look for the large glass doors with the university logo."
        },
        {
            id: 2,
            instruction: "Walk through the main corridor",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
            description: "Continue straight down the main corridor. You'll see study areas on both sides."
        },
        {
            id: 3,
            instruction: "Turn right at the information desk",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
            description: "When you reach the circular information desk, turn right towards the cafeteria area."
        },
        {
            id: 4,
            instruction: "Arrive at Computer Lab 201",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
            description: "You've reached your destination! The computer lab is on your right with glass windows."
        }
    ],
    estimatedTime: "5 minutes",
    distance: "120 meters"
};

// Utility Functions
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// View Handling
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function showHomeView() {
    showView('home-view');
    resetNavigation();
}

function showRouteView() {
    showView('route-view');
}

function showNavigationView() {
    const fromInput = document.getElementById('from-input').value;
    const toInput = document.getElementById('to-input').value;

    if (fromInput && toInput) {
        document.getElementById('route-summary').textContent = `${fromInput} → ${toInput}`;
        showView('navigation-view');
        initializeNavigation();
    }
}

function updateRouteButton() {
    const fromInput = document.getElementById('from-input').value;
    const toInput = document.getElementById('to-input').value;
    const generateBtn = document.getElementById('generate-route-btn');
    generateBtn.disabled = !(fromInput.trim() && toInput.trim());
}

function initializeNavigation() {
    currentStep = 0;
    completedSteps = [];
    updateNavigationView();
    renderRouteSteps();
}

function resetNavigation() {
    currentStep = 0;
    completedSteps = [];
    document.getElementById('from-input').value = '';
    document.getElementById('to-input').value = '';
    updateRouteButton();
}

function updateNavigationView() {
    const step = routeData.steps[currentStep];
    const totalSteps = routeData.steps.length;
    const isLast = currentStep === totalSteps - 1;

    document.getElementById('step-counter').textContent = `Step ${currentStep + 1}/${totalSteps}`;
    document.getElementById('progress-fill').style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
    document.getElementById('step-image').src = step.image;
    document.getElementById('step-image').alt = step.instruction;
    document.getElementById('step-number').textContent = currentStep + 1;
    document.getElementById('step-instruction').textContent = step.instruction;
    document.getElementById('step-description').textContent = step.description;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    prevBtn.style.display = currentStep > 0 ? 'block' : 'none';

    if (isLast) {
        nextBtn.innerHTML = `Arrived! <svg width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`;
        nextBtn.onclick = () => {
            alert('Congratulations! You have arrived at your destination.');
            showHomeView();
        };
    } else {
        const isCompleted = completedSteps.includes(currentStep);
        nextBtn.innerHTML = `${isCompleted ? 'Continue' : 'I see this landmark'} <svg width="16" height="16"><path d="m9 18 6-6-6-6"/></svg>`;
        nextBtn.onclick = nextStep;
    }
    renderRouteSteps();
}

function nextStep() {
    if (currentStep < routeData.steps.length - 1) {
        if (!completedSteps.includes(currentStep)) completedSteps.push(currentStep);
        currentStep++;
        updateNavigationView();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        completedSteps = completedSteps.filter(step => step !== currentStep);
        updateNavigationView();
    }
}

function renderRouteSteps() {
    const container = document.getElementById('route-steps');
    container.innerHTML = '';
    routeData.steps.forEach((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStep;
        const stepClass = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';
        const icon = isCompleted ? '<svg width="16" height="16"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>' : index + 1;

        const stepEl = document.createElement('div');
        stepEl.className = 'route-step';
        stepEl.innerHTML = `
            <div class="step-circle ${stepClass}">${icon}</div>
            <div class="step-info">
                <div class="step-title ${stepClass}">${step.instruction}</div>
            </div>
            ${isCurrent ? '<div class="current-badge">Current</div>' : ''}
        `;
        container.appendChild(stepEl);
    });
}

// Camera and Landmark Capture
function openCameraCapture() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
    .then(stream => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = "100%";
        video.style.borderRadius = "0.75rem";
        video.style.marginTop = "1rem";

        const canvas = document.createElement("canvas");
        canvas.style.display = "none";

        const captureBtn = document.createElement("button");
        captureBtn.className = "btn btn-primary btn-full";
        captureBtn.textContent = "📸 Take a picture of your current location";
        captureBtn.style.marginTop = "1rem";

        captureBtn.onclick = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            const imgData = canvas.toDataURL("image/png");
            stream.getTracks().forEach(track => track.stop());

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const dist = getDistanceFromLatLon(pos.coords.latitude, pos.coords.longitude, 5.1035, -1.2818);
                    alert(`✅ Captured!\n📍 Approx. ${dist.toFixed(1)} meters from Admin Office.`);
                    video.style.display = "none";
                    const img = document.createElement("img");
                    img.src = imgData;
                    img.style.width = "100%";
                    img.style.borderRadius = "0.75rem";
                    canvas.parentNode.appendChild(img);
                }, err => alert("⚠️ Location error: " + err.message));
            } else {
                alert("📵 Geolocation not supported.");
            }
        };

        const container = document.createElement("div");
        container.className = "card";
        container.innerHTML = `
            <div class="card-header">
                <button class="btn-back" id="back-btn">
                    <svg width="16" height="16"><path d="m15 18-6-6 6-6"/></svg> Back
                </button>
                <h3 style="margin-top: 0.5rem;">Report New Landmark</h3>
            </div>
            <div class="card-content"></div>
        `;

        const content = container.querySelector(".card-content");
        content.appendChild(video);
        content.appendChild(canvas);
        content.appendChild(captureBtn);
        document.querySelector(".container").appendChild(container);

        document.getElementById("back-btn").onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            container.remove();
        };

    }).catch(err => {
        console.warn("Back camera not available. Falling back.", err);
        fallbackToDefaultCamera();
    });
}

function fallbackToDefaultCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(openCameraCaptureFromStream)
    .catch(err => {
        alert("🚫 Could not access any camera.");
        console.error(err);
    });
}

function openCameraCaptureFromStream(stream) {
    // You can refactor and reuse the openCameraCapture logic with this stream if needed
}

// Init
window.addEventListener("DOMContentLoaded", () => {
    showView('home-view');
    document.querySelectorAll('.popular-route .btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const route = btn.closest('.popular-route');
            const [from, to] = route.querySelector('.route-name').textContent.split(' → ');
            document.getElementById('from-input').value = from;
            document.getElementById('to-input').value = to;
            updateRouteButton();
        });
    });
});
