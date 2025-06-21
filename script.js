
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

// View management
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
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
        // Update route summary
        document.getElementById('route-summary').textContent = `${fromInput} → ${toInput}`;
        
        showView('navigation-view');
        initializeNavigation();
    }
}

// Route planning functionality
function updateRouteButton() {
    const fromInput = document.getElementById('from-input').value;
    const toInput = document.getElementById('to-input').value;
    const generateBtn = document.getElementById('generate-route-btn');
    
    if (fromInput.trim() && toInput.trim()) {
        generateBtn.disabled = false;
    } else {
        generateBtn.disabled = true;
    }
}

// Navigation functionality
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
    
    // Update step counter and progress
    document.getElementById('step-counter').textContent = `Step ${currentStep + 1}/${totalSteps}`;
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    
    // Update current step content
    document.getElementById('step-image').src = step.image;
    document.getElementById('step-image').alt = step.instruction;
    document.getElementById('step-number').textContent = currentStep + 1;
    document.getElementById('step-instruction').textContent = step.instruction;
    document.getElementById('step-description').textContent = step.description;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (currentStep > 0) {
        prevBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
    }
    
    if (isLast) {
        nextBtn.innerHTML = `
            Arrived!
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
        `;
        nextBtn.onclick = () => {
            alert('Congratulations! You have arrived at your destination.');
            showHomeView();
        };
    } else {
        const isCompleted = completedSteps.includes(currentStep);
        nextBtn.innerHTML = `
            ${isCompleted ? 'Continue' : 'I see this landmark'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
            </svg>
        `;
        nextBtn.onclick = nextStep;
    }
    
    renderRouteSteps();
}

function nextStep() {
    const totalSteps = routeData.steps.length;
    
    if (currentStep < totalSteps - 1) {
        if (!completedSteps.includes(currentStep)) {
            completedSteps.push(currentStep);
        }
        currentStep++;
        updateNavigationView();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        // Remove from completed steps if going back
        completedSteps = completedSteps.filter(step => step !== currentStep);
        updateNavigationView();
    }
}

function renderRouteSteps() {
    const routeStepsContainer = document.getElementById('route-steps');
    routeStepsContainer.innerHTML = '';
    
    routeData.steps.forEach((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStep;
        
        let stepClass = 'pending';
        let titleClass = 'pending';
        let circleContent = index + 1;
        
        if (isCompleted) {
            stepClass = 'completed';
            titleClass = 'completed';
            circleContent = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>`;
        } else if (isCurrent) {
            stepClass = 'current';
            titleClass = 'current';
        }
        
        const stepElement = document.createElement('div');
        stepElement.className = 'route-step';
        stepElement.innerHTML = `
            <div class="step-circle ${stepClass}">
                ${typeof circleContent === 'string' ? circleContent : index + 1}
            </div>
            <div class="step-info">
                <div class="step-title ${titleClass}">${step.instruction}</div>
            </div>
            ${isCurrent ? '<div class="current-badge">Current</div>' : ''}
        `;
        
        routeStepsContainer.appendChild(stepElement);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show home view by default
    showView('home-view');
    
    // Add event listeners for popular route buttons
    document.querySelectorAll('.popular-route .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const routeElement = this.closest('.popular-route');
            const routeName = routeElement.querySelector('.route-name').textContent;
            const [from, to] = routeName.split(' → ');
            
            document.getElementById('from-input').value = from;
            document.getElementById('to-input').value = to;
            updateRouteButton();
        });
    });
});

// Request camera access and open camera stream
function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const videoElement = document.createElement("video");
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.style.width = "100%";
            videoElement.style.borderRadius = "0.75rem";
            videoElement.style.marginTop = "1rem";

            const container = document.createElement("div");
            container.className = "card";
            container.innerHTML = `
                <div class="card-header"><h3>Take a Picture</h3></div>
                <div class="card-content"></div>
            `;
            container.querySelector(".card-content").appendChild(videoElement);
            document.querySelector(".container").appendChild(container);
        })
        .catch(error => {
            alert("Camera access denied or unavailable.");
            console.error(error);
        });
}

let videoStream = null;

function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoStream = stream;
            const video = document.createElement("video");
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;
            video.style.width = "100%";
            video.style.borderRadius = "0.75rem";

            const canvas = document.createElement("canvas");
            canvas.style.display = "none";

            const captureButton = document.createElement("button");
            captureButton.textContent = "📸 Take Picture";
            captureButton.className = "btn btn-primary btn-full";
            captureButton.onclick = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d").drawImage(video, 0, 0);
                const imageDataUrl = canvas.toDataURL("image/png");
                alert("Image captured and location estimated!");
                stopCamera(); // stop video after capture
            };

            const container = document.createElement("div");
            container.className = "card";
            container.innerHTML = `
                <div class="card-header"><h3>Capture Landmark & Estimate Distance</h3></div>
                <div class="card-content"></div>
            `;
            container.querySelector(".card-content").appendChild(video);
            container.querySelector(".card-content").appendChild(canvas);
            container.querySelector(".card-content").appendChild(captureButton);
            document.querySelector(".container").appendChild(container);
        })
        .catch(error => {
            alert("Camera access denied or unavailable.");
            console.error(error);
        });
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}
