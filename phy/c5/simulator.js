// Nuclear Power Simulator - Vanilla JavaScript

class NuclearSimulator {
  constructor() {
    // Simulation State
    this.isRunning = false;
    this.controlRods = 0; // 0 = fully inserted (safe), 100 = fully withdrawn (max power)

    // Physics States
    this.temperature = 25; // Celsius
    this.steamPressure = 0; // bar
    this.turbineSpeed = 0; // RPM
    this.powerOutput = 0; // MW
    this.activeTab = "plant";

    // DOM References
    this.startBtn = document.getElementById("startBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.scramBtn = document.getElementById("scramBtn");
    this.controlSlider = document.getElementById("controlSlider");
    this.tabButtons = document.querySelectorAll(".tab-btn");

    // Status displays
    this.tempBadge = document.getElementById("tempBadge");
    this.powerBadge = document.getElementById("powerBadge");
    this.tempDisplay = document.getElementById("tempDisplay");
    this.pressureDisplay = document.getElementById("pressureDisplay");
    this.speedDisplay = document.getElementById("turbineSpeed");
    this.powerDisplay = document.getElementById("powerDisplay");
    this.rodValue = document.getElementById("rodValue");
    this.reactorStatus = document.getElementById("reactorStatus");
    this.alertBox = document.getElementById("alertBox");
    this.reactorInterior = document.getElementById("reactorInterior");
    this.turbine = document.querySelector(".turbine");
    this.generator = document.getElementById("generator");
    this.steamParticles = document.getElementById("steamParticles");

    // Control Rods
    this.controlRods1 = document.getElementById("controlRod1");
    this.controlRods2 = document.getElementById("controlRod2");
    this.controlRods3 = document.getElementById("controlRod3");
    this.controlRods4 = document.getElementById("controlRod4");
    this.controlRods5 = document.getElementById("controlRod5");
    this.controlRodElements = [
      this.controlRods1,
      this.controlRods2,
      this.controlRods3,
      this.controlRods4,
      this.controlRods5,
    ];

    this.setupEventListeners();
    this.updateDisplay();
    this.startSimulationLoop();
  }

  setupEventListeners() {
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.scramBtn.addEventListener("click", () => this.scram());
    this.controlSlider.addEventListener("input", (e) =>
      this.setControlRods(e.target.value),
    );

    this.tabButtons.forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab),
      );
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startBtn.style.display = "none";
    this.stopBtn.style.display = "block";
    this.controlSlider.disabled = false;
    this.updateDisplay();
  }

  stop() {
    this.isRunning = false;
    this.startBtn.style.display = "block";
    this.stopBtn.style.display = "none";
    this.controlSlider.disabled = true;
    this.updateDisplay();
  }

  scram() {
    this.controlRods = 0;
    this.isRunning = false;
    this.controlSlider.value = 0;
    this.startBtn.style.display = "block";
    this.stopBtn.style.display = "none";
    this.controlSlider.disabled = true;
    this.showAlert("⚠️ SCRAM activated! Reactor shut down for safety.");
    this.updateDisplay();
  }

  setControlRods(value) {
    this.controlRods = parseFloat(value);
    this.updateDisplay();
  }

  switchTab(tab) {
    // Hide all views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    // Deactivate all tabs
    this.tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show selected view
    document.getElementById(tab).classList.add("active");

    // Activate selected tab
    event.target.classList.add("active");

    this.activeTab = tab;
  }

  updateControlRodVisuals() {
    this.controlRodElements.forEach((rod) => {
      // Position formula: 0% inserted (top at ~0%) to 100% withdrawn (top at ~80%)
      const topPosition = this.controlRods * 0.8;
      rod.style.top = `${topPosition}%`;
    });
  }

  updateReactorColor() {
    if (this.temperature > 300) {
      this.reactorInterior.style.backgroundColor = `rgba(239, 68, 68, ${Math.min((this.temperature - 100) / 200, 0.3)})`;
    } else if (this.temperature > 100) {
      const intensity = (this.temperature - 100) / 200;
      this.reactorInterior.style.backgroundColor = `rgba(245, 158, 11, ${intensity * 0.2})`;
    } else {
      this.reactorInterior.style.backgroundColor = `rgba(59, 130, 246, 0.1)`;
    }
  }

  updateTurbineVisuals() {
    if (this.turbineSpeed > 100) {
      this.turbine.classList.add("spinning");
      this.turbine.style.animationDuration = `${Math.max(0.5, 2 - this.steamPressure / 100)}s`;
    } else {
      this.turbine.classList.remove("spinning");
    }
  }

  updateSteamParticles() {
    // Clear existing particles
    this.steamParticles.innerHTML = "";

    if (this.isRunning && this.temperature > 100) {
      // Create animated particles
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div");
        particle.className = "steam-particle";
        particle.style.left = i * 10 + "%";
        particle.style.animation = `steamFlow ${Math.max(0.5, 2 - this.steamPressure / 100)}s linear infinite`;
        particle.style.animationDelay = i * 0.1 + "s";
        this.steamParticles.appendChild(particle);
      }
    }
  }

  updateDisplay() {
    // Update control rod percentage
    this.rodValue.textContent = Math.round(this.controlRods) + "%";

    // Update temperature badge
    this.tempBadge.textContent = `🌡️ ${Math.round(this.temperature)} °C`;
    this.tempBadge.classList.remove("hot", "warm");
    if (this.temperature > 300) {
      this.tempBadge.classList.add("hot");
    } else if (this.temperature > 100) {
      this.tempBadge.classList.add("warm");
    }

    // Update power badge
    this.powerBadge.textContent = `⚡ ${Math.round(this.powerOutput)} MW`;

    // Update status displays
    this.tempDisplay.textContent = Math.round(this.temperature) + " °C";
    this.pressureDisplay.textContent = Math.round(this.steamPressure) + " bar";
    this.speedDisplay.textContent = Math.round(this.turbineSpeed) + " RPM";
    this.powerDisplay.textContent = Math.round(this.powerOutput) + " MW";

    // Update reactor status
    this.reactorStatus.textContent = this.isRunning
      ? "🟢 Online"
      : "⭕ Offline";
    this.reactorStatus.style.color = this.isRunning
      ? "var(--accent-emerald)"
      : "var(--text-secondary)";

    // Update visuals
    this.updateControlRodVisuals();
    this.updateReactorColor();
    this.updateTurbineVisuals();
    this.updateSteamParticles();

    // Clear alerts if running normally
    if (this.temperature < 300 && this.powerOutput < 1200) {
      this.alertBox.style.display = "none";
    }
  }

  showAlert(message) {
    this.alertBox.textContent = message;
    this.alertBox.style.display = "block";
  }

  startSimulationLoop() {
    setInterval(() => {
      if (this.isRunning) {
        // Temperature logic: Heat increases if rods are withdrawn
        const targetTemp = 25 + this.controlRods * 3.5; // Max ~375°C
        const tempDiff = targetTemp - this.temperature;
        this.temperature += tempDiff * 0.05;

        // Steam Pressure logic: Builds up if Temp > 100°C
        const targetPressure =
          this.temperature > 100 ? (this.temperature - 100) * 0.8 : 0;
        const pressureDiff = targetPressure - this.steamPressure;
        this.steamPressure += pressureDiff * 0.1;

        // Turbine Speed: Driven by steam pressure
        const targetSpeed = this.steamPressure * 12; // Max ~3000 RPM
        const friction = this.turbineSpeed * 0.05;
        this.turbineSpeed += (targetSpeed - this.turbineSpeed) * 0.1 - friction;

        // Electrical Power: Generated by spinning turbine
        const targetPower = Math.max(0, (this.turbineSpeed / 3000) * 1200); // Max 1200 MW
        this.powerOutput += (targetPower - this.powerOutput) * 0.1;

        // Safety checks
        if (this.temperature > 350) {
          this.showAlert(
            "⚠️ CRITICAL: Temperature exceeding safe limits! Activate SCRAM!",
          );
        }
      } else {
        // Shutdown cooling logic
        this.temperature -= (this.temperature - 25) * 0.05;
        this.steamPressure -= this.steamPressure * 0.1;
        this.turbineSpeed -= this.turbineSpeed * 0.05;
        this.powerOutput -= this.powerOutput * 0.2;
      }

      this.updateDisplay();
    }, 100); // 10 ticks per second
  }
}

// Initialize simulator when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new NuclearSimulator();
});
