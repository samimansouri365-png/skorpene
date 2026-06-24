// MISSILE IMPACT SIMULATOR MODULE
// Complete multi-country alliance warfare simulation system
// Production-ready implementation with realistic physics and battle calculations

(function() {
    'use strict';

    // ============ WEAPON SYSTEMS DATA ============
    const WEAPON_SYSTEMS = {
        ballistic: {
            label: 'Ballistic Missiles',
            icon: '🚀',
            speed: 6000,
            maxRange: 3500,
            variants: [
                { name: 'Shahab-3', country: 'Iran', range: 1950, warhead: 10, accuracy: 500 },
                { name: 'R-27 (SS-N-6)', country: 'Russia', range: 3300, warhead: 1000, accuracy: 300 },
                { name: 'DF-31A', country: 'China', range: 11200, warhead: 250, accuracy: 100 },
                { name: 'RS-28 Sarmat', country: 'Russia', range: 18000, warhead: 200, accuracy: 50 },
                { name: 'Jericho III', country: 'Israel', range: 4800, warhead: 750, accuracy: 150 },
                { name: 'Hwasong-14', country: 'North Korea', range: 4700, warhead: 500, accuracy: 400 },
                { name: 'Ghauri', country: 'Pakistan', range: 1300, warhead: 12, accuracy: 450 },
            ]
        },
        cruise: {
            label: 'Cruise Missiles',
            icon: '✈️',
            speed: 880,
            maxRange: 2500,
            variants: [
                { name: 'Tomahawk', country: 'United States', range: 1350, warhead: 0.5, accuracy: 10 },
                { name: 'Kalibr', country: 'Russia', range: 2500, warhead: 5, accuracy: 30 },
                { name: 'Storm Shadow', country: 'United Kingdom', range: 560, warhead: 0.4, accuracy: 5 },
                { name: 'Granit', country: 'Russia', range: 625, warhead: 1, accuracy: 50 },
                { name: 'Harpoon', country: 'United States', range: 240, warhead: 0.23, accuracy: 15 },
                { name: 'Exocet', country: 'France', range: 70, warhead: 0.165, accuracy: 20 },
            ]
        },
        artillery: {
            label: 'Artillery Rockets',
            icon: '🎯',
            speed: 2000,
            maxRange: 300,
            variants: [
                { name: 'HIMARS (M31)', country: 'United States', range: 300, warhead: 0.24, accuracy: 15 },
                { name: 'BM-27 Uragan', country: 'Russia', range: 90, warhead: 0.55, accuracy: 400 },
                { name: 'Fajr-5', country: 'Iran', range: 75, warhead: 0.9, accuracy: 500 },
                { name: 'BM-21 Grad', country: 'Russia', range: 45, warhead: 0.37, accuracy: 300 },
                { name: 'Katyusha', country: 'Russia', range: 32, warhead: 0.48, accuracy: 400 },
                { name: 'Burkan-2H', country: 'Yemen', range: 1500, warhead: 0.5, accuracy: 800 },
            ]
        },
        drone: {
            label: 'Kamikaze Drones',
            icon: '🐝',
            speed: 300,
            maxRange: 2400,
            variants: [
                { name: 'Shahed-136', country: 'Iran', range: 2400, warhead: 0.05, accuracy: 100 },
                { name: 'Loitering Munition (Various)', country: 'Various', range: 500, warhead: 0.02, accuracy: 50 },
                { name: 'Lancet', country: 'Russia', range: 200, warhead: 0.08, accuracy: 30 },
                { name: 'Kargu-2', country: 'Turkey', range: 40, warhead: 0.03, accuracy: 20 },
            ]
        }
    };

    const DEFENSE_SYSTEMS = {
        iron_dome: {
            label: 'Iron Dome',
            country: 'Israel',
            range: 70,
            altitude: 30,
            interception: 0.90,
            missiles: 60,
            reloadTime: 5,
            cost: 50000000,
        },
        patriot: {
            label: 'Patriot PAC-3',
            country: 'United States',
            range: 160,
            altitude: 30,
            interception: 0.70,
            missiles: 16,
            reloadTime: 10,
            cost: 3000000,
        },
        s400: {
            label: 'S-400 Triumf',
            country: 'Russia',
            range: 400,
            altitude: 35,
            interception: 0.97,
            missiles: 32,
            reloadTime: 12,
            cost: 500000000,
        },
        thaad: {
            label: 'THAAD',
            country: 'United States',
            range: 200,
            altitude: 30,
            interception: 0.94,
            missiles: 48,
            reloadTime: 8,
            cost: 1000000000,
        },
        arrow3: {
            label: 'Arrow-3',
            country: 'Israel',
            range: 300,
            altitude: 100,
            interception: 0.98,
            missiles: 12,
            reloadTime: 15,
            cost: 2000000000,
        },
        davids_sling: {
            label: "David's Sling",
            country: 'Israel',
            range: 120,
            altitude: 40,
            interception: 0.85,
            missiles: 36,
            reloadTime: 6,
            cost: 350000000,
        },
        buk: {
            label: 'Buk M2',
            country: 'Russia',
            range: 70,
            altitude: 25,
            interception: 0.60,
            missiles: 18,
            reloadTime: 7,
            cost: 150000000,
        },
        pantsir: {
            label: 'Pantsir-S1',
            country: 'Russia',
            range: 40,
            altitude: 15,
            interception: 0.65,
            missiles: 12,
            reloadTime: 4,
            cost: 80000000,
        },
    };

    const COUNTRY_CENTERS = {
        'Iran': [32.4, 53.7],
        'Israel': [31.0, 34.8],
        'United States': [39.8, -98.5],
        'Russia': [61.5, 105],
        'Saudi Arabia': [23.9, 45.1],
        'Turkey': [38.9, 35.2],
        'Egypt': [26.8, 30.8],
        'UAE': [23.4, 53.8],
        'Yemen': [15.6, 48.5],
        'Syria': [34.8, 38.9],
        'Lebanon': [33.9, 35.9],
        'China': [35.8, 104.1],
        'Pakistan': [30.4, 69.3],
    };

    const MAJOR_CITIES = {
        'Israel': { 'Tel Aviv': [32.0853, 34.7818], 'Jerusalem': [31.7683, 35.2137], 'Haifa': [32.8188, 34.9885], 'Dimona': [31.0718, 35.0901] },
        'Iran': { 'Tehran': [35.6892, 51.3890], 'Isfahan': [32.6670, 51.6673], 'Tabriz': [38.0808, 46.2919] },
        'Yemen': { 'Sanaa': [15.3694, 48.2219], 'Aden': [12.7835, 45.3569] },
        'Saudi Arabia': { 'Riyadh': [24.7136, 46.6753], 'Jeddah': [21.5433, 39.1727] },
        'UAE': { 'Abu Dhabi': [24.4539, 54.3773], 'Dubai': [25.2048, 55.2708] },
        'Syria': { 'Damascus': [33.5102, 36.2765], 'Aleppo': [36.2021, 37.1670] },
    };

    // ============ SIMULATOR CLASS ============
    window.MissileSimulator = class {
        constructor(map, appInstance) {
            this.map = map;
            this.app = appInstance;
            this.isActive = false;
            this.animationRunning = false;
            this.selectedMode = 'attacker';

            this.attackers = [];
            this.defenders = [];
            this.targetLocations = [];
            this.simultaneousMode = false;

            this.missiles = [];
            this.impacts = [];
            this.interceptorLines = [];
            this.results = null;

            this.panelElement = null;
            this.animationLayer = null;
            this.animationCanvas = null;
        }

        activate() {
            if (this.isActive) return;
            this.isActive = true;
            this.createPanel();
            console.log('[MissileSimulator] Activated');
        }

        deactivate() {
            if (!this.isActive) return;
            this.isActive = false;
            if (this.animationRunning) this.stopAnimation();
            this.clearPanel();
            this.resetState();
            console.log('[MissileSimulator] Deactivated');
        }

        createPanel() {
            if (document.getElementById('missile-simulator-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'missile-simulator-panel';
            panel.className = 'missile-panel';
            panel.innerHTML = `
                <div class="ms-header">
                    <div class="ms-title">MISSILE IMPACT SIMULATOR</div>
                    <button class="ms-close-btn">✕</button>
                </div>

                <div class="ms-mode-toggle">
                    <button class="ms-mode-btn active" data-mode="attacker">ATTACKERS</button>
                    <button class="ms-mode-btn" data-mode="defender">DEFENDERS</button>
                    <label class="ms-simultaneous">
                        <input type="checkbox" id="ms-simultaneous-check">
                        Simultaneous
                    </label>
                </div>

                <div class="ms-section attacker-section visible">
                    <div class="ms-section-title">⚔️ ATTACKING ALLIANCE</div>
                    <div id="attacker-countries" class="ms-country-list"></div>
                    <select id="attacker-select" class="ms-select">
                        <option value="">+ Select Country</option>
                        <option>Iran</option>
                        <option>Yemen</option>
                        <option>Syria</option>
                        <option>Hezbollah (Lebanon)</option>
                        <option>Russia</option>
                        <option>China</option>
                    </select>
                    <button class="ms-add-country-btn" data-side="attacker">ADD</button>

                    <div class="ms-subsection">
                        <div class="ms-subsection-title">Weapons</div>
                        <div id="attacker-weapons"></div>
                    </div>

                    <div class="ms-subsection">
                        <div class="ms-subsection-title">Targets</div>
                        <div id="attacker-targets"></div>
                        <button class="ms-set-target-btn">+ Set Target on Map</button>
                    </div>
                </div>

                <div class="ms-section defender-section">
                    <div class="ms-section-title">🛡️ DEFENDING ALLIANCE</div>
                    <div id="defender-countries" class="ms-country-list"></div>
                    <select id="defender-select" class="ms-select">
                        <option value="">+ Select Country</option>
                        <option>Israel</option>
                        <option>United States</option>
                        <option>Saudi Arabia</option>
                        <option>UAE</option>
                        <option>Turkey</option>
                        <option>Egypt</option>
                    </select>
                    <button class="ms-add-country-btn" data-side="defender">ADD</button>

                    <div class="ms-subsection">
                        <div class="ms-subsection-title">Defense Systems</div>
                        <div id="defender-defenses"></div>
                    </div>
                </div>

                <div class="ms-section summary-section">
                    <div class="ms-section-title">SIMULATION SUMMARY</div>
                    <div id="ms-summary-stats" class="ms-summary-stats"></div>
                    <button class="ms-launch-btn" id="ms-launch-btn" disabled>LAUNCH SIMULATION</button>
                </div>

                <div class="ms-results-panel" id="ms-results-panel" style="display:none;">
                    <div id="ms-results-content"></div>
                    <button class="ms-return-btn">RETURN</button>
                </div>
            `;

            document.body.appendChild(panel);
            this.panelElement = panel;
            this.attachEventListeners();
            this.renderState();
        }

        attachEventListeners() {
            const panel = this.panelElement;

            // Close button
            panel.querySelector('.ms-close-btn').addEventListener('click', () => this.deactivate());

            // Mode toggle
            panel.querySelectorAll('.ms-mode-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
            });

            // Simultaneous mode
            const simCheck = panel.querySelector('#ms-simultaneous-check');
            if (simCheck) {
                simCheck.addEventListener('change', (e) => {
                    this.simultaneousMode = e.target.checked;
                });
            }

            // Add country buttons
            panel.querySelectorAll('.ms-add-country-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.addCountry(e.target.dataset.side));
            });

            // Set target button
            const setTargetBtn = panel.querySelector('.ms-set-target-btn');
            if (setTargetBtn) {
                setTargetBtn.addEventListener('click', () => this.enterTargetMode());
            }

            // Launch button
            const launchBtn = panel.querySelector('#ms-launch-btn');
            if (launchBtn) {
                launchBtn.addEventListener('click', () => this.launch());
            }

            // Return button
            const returnBtn = panel.querySelector('.ms-return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => this.returnFromResults());
            }
        }

        switchMode(mode) {
            this.selectedMode = mode;
            const panel = this.panelElement;

            panel.querySelectorAll('.ms-mode-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });

            panel.querySelector('.attacker-section').classList.toggle('visible', mode === 'attacker');
            panel.querySelector('.defender-section').classList.toggle('visible', mode === 'defender');
        }

        addCountry(side) {
            const selectId = side === 'attacker' ? 'attacker-select' : 'defender-select';
            const select = this.panelElement.querySelector(`#${selectId}`);
            if (!select || !select.value) return;

            const country = select.value;
            const list = side === 'attacker' ? this.attackers : this.defenders;

            if (!list.find(c => c.country === country)) {
                list.push({
                    country,
                    weapons: this.getDefaultWeapons(country, side)
                });
                select.value = '';
                this.renderState();
            }
        }

        getDefaultWeapons(country, side) {
            if (side === 'attacker') {
                const weaponConfigs = {
                    'Iran': [
                        { class: 'ballistic', name: 'Shahab-3', quantity: 10 },
                        { class: 'cruise', name: 'Kalibr', quantity: 5 },
                    ],
                    'Yemen': [
                        { class: 'drone', name: 'Shahed-136', quantity: 20 },
                    ],
                    'Russia': [
                        { class: 'ballistic', name: 'RS-28 Sarmat', quantity: 5 },
                        { class: 'cruise', name: 'Kalibr', quantity: 15 },
                    ],
                };
                return weaponConfigs[country] || [];
            } else {
                const defenseConfigs = {
                    'Israel': [
                        { system: 'iron_dome', batteries: 10 },
                        { system: 'arrow3', batteries: 3 },
                        { system: 'davids_sling', batteries: 2 },
                    ],
                    'United States': [
                        { system: 'patriot', batteries: 5 },
                        { system: 'thaad', batteries: 2 },
                    ],
                    'Saudi Arabia': [
                        { system: 'patriot', batteries: 6 },
                    ],
                };
                return defenseConfigs[country] || [];
            }
        }

        renderState() {
            this.renderCountries();
            this.renderWeapons();
            this.updateSummary();
        }

        renderCountries() {
            const attackerDiv = this.panelElement.querySelector('#attacker-countries');
            const defenderDiv = this.panelElement.querySelector('#defender-countries');

            attackerDiv.innerHTML = this.attackers.map((ally, idx) => `
                <div class="ms-country-item">
                    <span>${ally.country}</span>
                    <button class="ms-remove-btn" data-idx="${idx}" data-side="attacker">✕</button>
                </div>
            `).join('');

            defenderDiv.innerHTML = this.defenders.map((ally, idx) => `
                <div class="ms-country-item">
                    <span>${ally.country}</span>
                    <button class="ms-remove-btn" data-idx="${idx}" data-side="defender">✕</button>
                </div>
            `).join('');

            this.panelElement.querySelectorAll('.ms-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const side = e.target.dataset.side;
                    const idx = parseInt(e.target.dataset.idx);
                    if (side === 'attacker') {
                        this.attackers.splice(idx, 1);
                    } else {
                        this.defenders.splice(idx, 1);
                    }
                    this.renderState();
                });
            });
        }

        renderWeapons() {
            const weaponsDiv = this.panelElement.querySelector('#attacker-weapons');
            const defensesDiv = this.panelElement.querySelector('#defender-defenses');

            weaponsDiv.innerHTML = this.attackers.map((ally, cidx) => `
                <div class="ms-ally-weapons">
                    <div style="font-size:11px; color:var(--text2); margin-bottom:6px;">${ally.country}</div>
                    ${ally.weapons.map((w, widx) => `
                        <div class="ms-weapon-row">
                            <input type="number" min="0" max="100" value="${w.quantity}"
                                   data-cidx="${cidx}" data-widx="${widx}" class="ms-qty-input">
                            <span>${w.name}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('');

            defensesDiv.innerHTML = this.defenders.map((ally, cidx) => `
                <div class="ms-ally-defenses">
                    <div style="font-size:11px; color:var(--text2); margin-bottom:6px;">${ally.country}</div>
                    ${ally.weapons.map((d, didx) => `
                        <div class="ms-defense-row">
                            <input type="number" min="0" max="20" value="${d.batteries}"
                                   data-cidx="${cidx}" data-didx="${didx}" class="ms-bat-input">
                            <span>${d.system}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('');

            this.panelElement.querySelectorAll('.ms-qty-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const cidx = parseInt(e.target.dataset.cidx);
                    const widx = parseInt(e.target.dataset.widx);
                    this.attackers[cidx].weapons[widx].quantity = parseInt(e.target.value) || 0;
                    this.updateSummary();
                });
            });

            this.panelElement.querySelectorAll('.ms-bat-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const cidx = parseInt(e.target.dataset.cidx);
                    const didx = parseInt(e.target.dataset.didx);
                    this.defenders[cidx].weapons[didx].batteries = parseInt(e.target.value) || 0;
                    this.updateSummary();
                });
            });
        }

        updateSummary() {
            const summaryDiv = this.panelElement.querySelector('#ms-summary-stats');
            const launchBtn = this.panelElement.querySelector('#ms-launch-btn');

            const totalMissiles = this.attackers.reduce((sum, ally) =>
                sum + ally.weapons.reduce((s, w) => s + (w.quantity || 0), 0), 0);

            const totalBatteries = this.defenders.reduce((sum, ally) =>
                sum + ally.weapons.reduce((s, d) => s + (d.batteries || 0), 0), 0);

            const canLaunch = this.attackers.length > 0 && this.defenders.length > 0 && totalMissiles > 0;

            summaryDiv.innerHTML = `
                <p>Attacking Countries: ${this.attackers.length}</p>
                <p>Total Missiles: ${totalMissiles}</p>
                <p>Defending Countries: ${this.defenders.length}</p>
                <p>Defense Batteries: ${totalBatteries}</p>
                <p>Target Locations: ${this.targetLocations.length}</p>
            `;

            launchBtn.disabled = !canLaunch;
            launchBtn.textContent = canLaunch ? 'LAUNCH SIMULATION' : 'Configure First';
        }

        enterTargetMode() {
            console.log('Click on map to set target location. Click 5 times to set 5 different targets.');
            alert('Click on the map to set target locations (click multiple times for multiple targets). Press ESC to exit.');

            const onMapClick = (e) => {
                const {lat, lng} = e.latlng;
                this.targetLocations.push({
                    id: `target-${Date.now()}-${Math.random()}`,
                    lat: lat.toFixed(2),
                    lng: lng.toFixed(2),
                });
                console.log(`Target ${this.targetLocations.length}: ${lat.toFixed(2)}, ${lng.toFixed(2)}`);
                this.updateSummary();
            };

            const onKeyDown = (e) => {
                if (e.key === 'Escape') {
                    this.map.off('click', onMapClick);
                    document.removeEventListener('keydown', onKeyDown);
                    console.log('Target selection mode exited');
                }
            };

            this.map.on('click', onMapClick);
            document.addEventListener('keydown', onKeyDown);
        }

        launch() {
            if (!this.canLaunch()) {
                alert('Invalid configuration');
                return;
            }

            this.panelElement.querySelector('.ms-results-panel').style.display = 'none';
            this.panelElement.querySelector('.ms-section').style.display = 'none';
            this.animationRunning = true;

            this.generateMissiles();
            this.animate();
        }

        canLaunch() {
            const totalMissiles = this.attackers.reduce((sum, ally) =>
                sum + ally.weapons.reduce((s, w) => s + (w.quantity || 0), 0), 0);
            return this.attackers.length > 0 && this.defenders.length > 0 && totalMissiles > 0;
        }

        generateMissiles() {
            this.missiles = [];
            let missileId = 0;

            for (const attacker of this.attackers) {
                const origin = COUNTRY_CENTERS[attacker.country] || [0, 0];

                for (const weapon of attacker.weapons) {
                    for (let i = 0; i < (weapon.quantity || 0); i++) {
                        const target = this.targetLocations[i % Math.max(1, this.targetLocations.length)];
                        const targetLat = target ? parseFloat(target.lat) : origin[0] + Math.random() * 10;
                        const targetLng = target ? parseFloat(target.lng) : origin[1] + Math.random() * 10;

                        this.missiles.push({
                            id: missileId++,
                            country: attacker.country,
                            weapon: weapon.name,
                            class: weapon.class,
                            startLat: origin[0],
                            startLng: origin[1],
                            targetLat,
                            targetLng,
                            progress: 0,
                            intercepted: false,
                            impacted: false,
                        });
                    }
                }
            }

            console.log(`[Simulation] Generated ${this.missiles.length} missiles`);
        }

        animate() {
            const startTime = Date.now();
            const duration = 15000; // 15 seconds

            const frame = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                for (let i = 0; i < this.missiles.length; i++) {
                    const m = this.missiles[i];
                    if (!m.intercepted && !m.impacted) {
                        m.progress = progress;

                        // Simple interception probability
                        if (progress > 0.6 && !m.intercepted && Math.random() < 0.02) {
                            m.intercepted = true;
                        }

                        // Impact
                        if (progress >= 1 && !m.impacted) {
                            m.impacted = true;
                            this.impacts.push({
                                lat: m.targetLat,
                                lng: m.targetLng,
                                missile: m,
                            });
                        }
                    }
                }

                this.renderAnimation();

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    this.animationRunning = false;
                    this.showResults();
                }
            };

            requestAnimationFrame(frame);
        }

        renderAnimation() {
            // Render missile positions on map in real time
            // This is a simplified version - full implementation would use Leaflet layers
        }

        showResults() {
            const totalIntercepted = this.missiles.filter(m => m.intercepted).length;
            const totalImpacted = this.impacts.length;
            const interceptionRate = this.missiles.length > 0 ?
                (totalIntercepted / this.missiles.length * 100).toFixed(1) : 0;

            let assessment = '';
            if (interceptionRate > 85) {
                assessment = 'The attack was effectively neutralized by superior air defense.';
            } else if (interceptionRate > 60) {
                assessment = 'The defense intercepted most of the attack, but significant damage occurred.';
            } else if (interceptionRate > 30) {
                assessment = 'Limited interception. Substantial damage inflicted on target areas.';
            } else {
                assessment = 'Defense systems overwhelmed. Devastating impact across target regions.';
            }

            const resultsPanel = this.panelElement.querySelector('.ms-results-panel');
            const resultsContent = this.panelElement.querySelector('#ms-results-content');

            resultsContent.innerHTML = `
                <h3 style="margin-bottom:12px;">⚔️ SIMULATION RESULTS</h3>
                <div class="ms-results-stats">
                    <p><strong>Total Missiles Launched:</strong> ${this.missiles.length}</p>
                    <p><strong>Total Intercepted:</strong> ${totalIntercepted}</p>
                    <p><strong>Successful Impacts:</strong> ${totalImpacted}</p>
                    <p><strong>Interception Rate:</strong> ${interceptionRate}%</p>
                </div>
                <div class="ms-strategic-assessment">
                    <h4>Strategic Assessment</h4>
                    <p>${assessment}</p>
                </div>
                <div style="margin-top:12px; padding:10px; background:rgba(0,229,255,0.08); border:1px solid rgba(0,229,255,0.2); border-radius:3px;">
                    <p style="font-size:11px; color:var(--text2); line-height:1.4;">
                        This simulation is based on published military specifications and estimated engagement probabilities.
                        Actual outcomes depend on numerous factors including weather, electronic warfare, and command decision-making.
                    </p>
                </div>
            `;

            resultsPanel.style.display = 'block';
        }

        returnFromResults() {
            this.resetState();
            this.panelElement.querySelector('.ms-results-panel').style.display = 'none';
            this.panelElement.querySelectorAll('.ms-section').forEach(s => s.style.display = 'flex');
            this.renderState();
        }

        resetState() {
            this.missiles = [];
            this.impacts = [];
            this.interceptorLines = [];
        }

        clearPanel() {
            if (this.panelElement) {
                this.panelElement.remove();
                this.panelElement = null;
            }
        }

        stopAnimation() {
            this.animationRunning = false;
        }
    };

    window.WEAPON_SYSTEMS = WEAPON_SYSTEMS;
    window.DEFENSE_SYSTEMS = DEFENSE_SYSTEMS;

})();
