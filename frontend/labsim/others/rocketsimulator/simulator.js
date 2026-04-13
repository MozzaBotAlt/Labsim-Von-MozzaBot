// Rocket Simulator - Vanilla JavaScript
class RocketSimulator {
    constructor() {
        this.config = {
            noseType: 'conical',
            finType: 'delta',
            mass: 500,
            fuel: 50,
            kno3: 65,
            sugar: 35,
            temperature: 350,
            burnTime: 3
        };
        
        this.results = null;
        this.initializeEventListeners();
        this.updateProgressBars();
    }

    initializeEventListeners() {
        // Design controls
        document.getElementById('noseType').addEventListener('change', (e) => {
            this.config.noseType = e.target.value;
            this.updateVisualization();
        });

        document.getElementById('finType').addEventListener('change', (e) => {
            this.config.finType = e.target.value;
            this.updateVisualization();
        });

        document.getElementById('rocketMass').addEventListener('input', (e) => {
            this.config.mass = parseInt(e.target.value);
            document.getElementById('massValue').textContent = this.config.mass;
            this.updateProgressBars();
        });

        document.getElementById('fuelAmount').addEventListener('input', (e) => {
            this.config.fuel = parseInt(e.target.value);
            document.getElementById('fuelValue').textContent = this.config.fuel;
            this.updateProgressBars();
        });

        // Fuel mixture controls
        document.getElementById('knoPercentage').addEventListener('input', (e) => {
            this.config.kno3 = parseInt(e.target.value);
            this.config.sugar = 100 - this.config.kno3;
            document.getElementById('knoValue').textContent = this.config.kno3;
            document.getElementById('sugarPercentage').value = this.config.sugar;
            document.getElementById('sugarValue').textContent = this.config.sugar;
            this.checkMixture();
            this.updateProgressBars();
        });

        document.getElementById('sugarPercentage').addEventListener('input', (e) => {
            this.config.sugar = parseInt(e.target.value);
            this.config.kno3 = 100 - this.config.sugar;
            document.getElementById('sugarValue').textContent = this.config.sugar;
            document.getElementById('knoPercentage').value = this.config.kno3;
            document.getElementById('knoValue').textContent = this.config.kno3;
            this.checkMixture();
            this.updateProgressBars();
        });

        // Heating controls
        document.getElementById('temperature').addEventListener('input', (e) => {
            this.config.temperature = parseInt(e.target.value);
            document.getElementById('tempValue').textContent = this.config.temperature;
            this.updateProgressBars();
        });

        document.getElementById('burnTime').addEventListener('input', (e) => {
            this.config.burnTime = parseInt(e.target.value);
            document.getElementById('burnValue').textContent = this.config.burnTime;
            this.updateProgressBars();
        });
    }

    checkMixture() {
        const perfectKNO3 = 65;
        const perfectSugar = 35;
        const tolerance = 5;

        const knoDeviation = Math.abs(this.config.kno3 - perfectKNO3);
        const sugarDeviation = Math.abs(this.config.sugar - perfectSugar);

        const mixWarning = document.getElementById('mixWarning');
        const mixSuccess = document.getElementById('mixSuccess');
        const knoStatus = document.getElementById('knoStatus');
        const sugarStatus = document.getElementById('sugarStatus');

        if (knoDeviation <= tolerance && sugarDeviation <= tolerance) {
            mixWarning.classList.remove('active');
            mixSuccess.classList.add('active');
            knoStatus.textContent = '✓ Perfect!';
            knoStatus.style.color = '#86efac';
            sugarStatus.textContent = '✓ Perfect!';
            sugarStatus.style.color = '#86efac';
        } else if (knoDeviation <= 10 && sugarDeviation <= 10) {
            mixWarning.classList.add('active');
            mixSuccess.classList.remove('active');
            knoStatus.textContent = 'OK';
            knoStatus.style.color = '#fbbf24';
            sugarStatus.textContent = 'OK';
            sugarStatus.style.color = '#fbbf24';
        } else {
            mixWarning.classList.add('active');
            mixSuccess.classList.remove('active');
            knoStatus.textContent = 'Poor Mix';
            knoStatus.style.color = '#fca5a5';
            sugarStatus.textContent = 'Poor Mix';
            sugarStatus.style.color = '#fca5a5';
        }
    }

    updateProgressBars() {
        // Mass progress
        const massPercent = ((this.config.mass - 300) / (1000 - 300)) * 100;
        document.getElementById('massProgress').style.width = massPercent + '%';

        // Fuel progress
        const fuelPercent = ((this.config.fuel - 20) / (150 - 20)) * 100;
        document.getElementById('fuelProgress').style.width = fuelPercent + '%';

        // KNO3 progress
        const knoPercent = ((this.config.kno3 - 50) / (80 - 50)) * 100;
        document.getElementById('knoProgress').style.width = knoPercent + '%';

        // Sugar progress
        const sugarPercent = ((this.config.sugar - 20) / (50 - 20)) * 100;
        document.getElementById('sugarProgress').style.width = sugarPercent + '%';

        // Temperature progress
        const tempPercent = ((this.config.temperature - 200) / (450 - 200)) * 100;
        document.getElementById('tempProgress').style.width = tempPercent + '%';

        // Burn time progress
        const burnPercent = ((this.config.burnTime - 1) / (8 - 1)) * 100;
        document.getElementById('burnProgress').style.width = burnPercent + '%';
    }

    updateVisualization() {
        let noseEmoji = '▲'; // Default conical
        if (this.config.noseType === 'ogive') noseEmoji = '◮';
        else if (this.config.noseType === 'parabolic') noseEmoji = '◯';

        let finEmoji = '◀';
        if (this.config.finType === 'swept') finEmoji = '◁';
        else if (this.config.finType === 'trapezoidal') finEmoji = '◅';

        const designText = `
            ${this.config.noseType.charAt(0).toUpperCase() + this.config.noseType.slice(1)} nose | 
            ${this.config.finType.charAt(0).toUpperCase() + this.config.finType.slice(1)} fins | 
            ${this.config.mass}g
        `;
        document.getElementById('designText').textContent = designText;
    }

    calculateFlightData() {
        // Physics calculations for rocket flight
        const totalMass = this.config.mass + this.config.fuel;
        const thrustFactor = (this.config.fuel / 100) * (this.config.temperature / 350) * (this.config.burnTime / 5);
        const mixQuality = 1 - (Math.abs(this.config.kno3 - 65) / 100);
        
        const thrust = thrustFactor * mixQuality * 500; // Base thrust value
        const acceleration = (thrust / totalMass) * 9.8; // Convert to m/s² relative to gravity
        
        // Calculate flight parameters
        const maxVelocity = acceleration * this.config.burnTime;
        const maxAltitude = (this.config.burnTime * maxVelocity) / 2 - (9.8 * this.config.burnTime ** 2) / 2;
        
        // Flight time (time to apogee and back)
        const timeToApogee = maxVelocity / 9.8;
        const totalFlightTime = timeToApogee * 2;
        
        // Efficiency calculation (0-100%)
        const efficiency = Math.min(100, mixQuality * 100);

        return {
            maxAltitude: Math.max(0, maxAltitude),
            maxVelocity: Math.max(0, maxVelocity),
            flightTime: Math.max(0, totalFlightTime),
            efficiency: efficiency,
            thrust: thrust
        };
    }

    launch() {
        // Calculate flight data
        this.results = this.calculateFlightData();

        // Show launch animation
        const launchAnimation = document.getElementById('launchAnimation');
        launchAnimation.style.display = 'block';

        // Show results after animation
        setTimeout(() => {
            this.displayResults();
            launchAnimation.style.display = 'none';
        }, 3000);
    }

    displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        
        document.getElementById('maxAltitude').textContent = this.results.maxAltitude.toFixed(1) + ' m';
        document.getElementById('maxVelocity').textContent = this.results.maxVelocity.toFixed(1) + ' m/s';
        document.getElementById('flightTime').textContent = this.results.flightTime.toFixed(2) + ' s';
        document.getElementById('efficiency').textContent = this.results.efficiency.toFixed(1) + '%';
        
        resultsSection.style.display = 'grid';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    reset() {
        // Reset to defaults
        this.config = {
            noseType: 'conical',
            finType: 'delta',
            mass: 500,
            fuel: 50,
            kno3: 65,
            sugar: 35,
            temperature: 350,
            burnTime: 3
        };

        // Update UI
        document.getElementById('noseType').value = 'conical';
        document.getElementById('finType').value = 'delta';
        document.getElementById('rocketMass').value = 500;
        document.getElementById('massValue').textContent = '500';
        document.getElementById('fuelAmount').value = 50;
        document.getElementById('fuelValue').textContent = '50';
        document.getElementById('knoPercentage').value = 65;
        document.getElementById('knoValue').textContent = '65';
        document.getElementById('sugarPercentage').value = 35;
        document.getElementById('sugarValue').textContent = '35';
        document.getElementById('temperature').value = 350;
        document.getElementById('tempValue').textContent = '350';
        document.getElementById('burnTime').value = 3;
        document.getElementById('burnValue').textContent = '3';
        
        // Hide results
        document.getElementById('resultsSection').style.display = 'none';

        this.updateProgressBars();
        this.checkMixture();
        this.updateVisualization();
    }

    exportResults() {
        if (!this.results) {
            alert('Launch the rocket first to export results!');
            return;
        }

        const data = {
            timestamp: new Date().toISOString(),
            configuration: this.config,
            results: this.results
        };

        const csvContent = `
Rocket Launch Data Export
Date: ${data.timestamp}

CONFIGURATION:
Nose Type: ${data.configuration.noseType}
Fin Type: ${data.configuration.finType}
Rocket Mass (g): ${data.configuration.mass}
Fuel Amount (g): ${data.configuration.fuel}
KNO3 Percentage: ${data.configuration.kno3}%
Sugar Percentage: ${data.configuration.sugar}%
Temperature (°C): ${data.configuration.temperature}
Burn Time (s): ${data.configuration.burnTime}

RESULTS:
Max Altitude (m): ${data.results.maxAltitude.toFixed(2)}
Max Velocity (m/s): ${data.results.maxVelocity.toFixed(2)}
Flight Time (s): ${data.results.flightTime.toFixed(2)}
Efficiency (%): ${data.results.efficiency.toFixed(2)}
Thrust (N): ${data.results.thrust.toFixed(2)}
        `.trim();

        // Create download link
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
        element.setAttribute('download', `rocket_launch_${new Date().getTime()}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Initialize simulator when page loads
let simulator;
document.addEventListener('DOMContentLoaded', () => {
    simulator = new RocketSimulator();
    simulator.checkMixture();
    simulator.updateVisualization();
});

// Global functions for HTML onclick handlers
function launchRocket() {
    simulator.launch();
}

function resetSimulation() {
    simulator.reset();
}

function exportResults() {
    simulator.exportResults();
}
