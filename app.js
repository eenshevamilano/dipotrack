/**
 * -------------------------------------------------------------
 * APP.JS - DIPOTRACK (UNDIP BUS TRACKING SYSTEM)
 * Real-Time GPS Tracking via Firebase Realtime Database
 * -------------------------------------------------------------
 */

// ===================== FIREBASE CONFIG =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTWNRJapk7OCnqHmRragwYnSzLbm7XjUI",
    authDomain: "dipotrack-d060e.firebaseapp.com",
    databaseURL: "https://dipotrack-d060e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dipotrack-d060e",
    storageBucket: "dipotrack-d060e.firebasestorage.app",
    messagingSenderId: "353541198500",
    appId: "1:353541198500:web:b6f23404dac2d0ce91cc31",
    measurementId: "G-FNSB1RNWCE"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ===================== DATA KAMPUS UNDIP =====================
const HALTE_UNDIP = {
    JOGING:   { name: "Halte Joging Track",          coords: [-7.0553551, 110.4392964] },
    BASKORO:  { name: "Halte Baskoro",               coords: [-7.0536302, 110.4391998] },
    FISIP:    { name: "Halte FISIP Hukum",           coords: [-7.0509097, 110.4371935] },
    FIB:      { name: "Halte FIB Vokasi",            coords: [-7.0504200, 110.4360992] },
    WIDPUR:   { name: "Halte Widpur",                coords: [-7.0498503, 110.4384971] },
    SAMWA:    { name: "Halte Samwa",                 coords: [-7.0487483, 110.4402190] },
    PSIKO:    { name: "Halte Psiko",                 coords: [-7.0471884, 110.4387009] },
    FEB:      { name: "Halte FEB",                   coords: [-7.0476915, 110.4410277] },
    FKM:      { name: "Halte FKM",                   coords: [-7.0489452, 110.4425284] },
    FPIK:     { name: "Halte FPIK",                  coords: [-7.0507341, 110.4420429] },
    FPP:      { name: "Halte FPP",                   coords: [-7.0530393, 110.4412919] },
    FPP2:     { name: "Halte FPP After Sapi",        coords: [-7.0545672, 110.4396236] },
    BUNDARAN: { name: "Halte Bundaran UNDIP",        coords: [-7.0560116, 110.4393959] },
    RUSUNAWA: { name: "Halte Rusunawa",              coords: [-7.0545246, 110.4441404] },
};

const ROUTE_1_PATH = [
    HALTE_UNDIP.JOGING.coords,
    HALTE_UNDIP.BASKORO.coords,
    HALTE_UNDIP.FISIP.coords,
    HALTE_UNDIP.FIB.coords,
    HALTE_UNDIP.WIDPUR.coords,
    HALTE_UNDIP.SAMWA.coords,
    HALTE_UNDIP.PSIKO.coords,
    HALTE_UNDIP.FEB.coords,
    HALTE_UNDIP.FKM.coords,
    HALTE_UNDIP.FPIK.coords,
    HALTE_UNDIP.FPP.coords,
    HALTE_UNDIP.FPP2.coords,
    HALTE_UNDIP.BUNDARAN.coords,
    HALTE_UNDIP.RUSUNAWA.coords,
    HALTE_UNDIP.FPP.coords,
    HALTE_UNDIP.FPIK.coords,
    HALTE_UNDIP.FKM.coords,
    HALTE_UNDIP.FEB.coords,
    HALTE_UNDIP.PSIKO.coords,
    HALTE_UNDIP.SAMWA.coords,
    HALTE_UNDIP.WIDPUR.coords,
    HALTE_UNDIP.FIB.coords,
    HALTE_UNDIP.FISIP.coords,
    HALTE_UNDIP.BASKORO.coords,
    HALTE_UNDIP.JOGING.coords
];

const ROUTE_STOPS_MAPPING = {
    "1": [
        { id: "JOGING",   name: "Joging Track",       eta: "Tiba" },
        { id: "BASKORO",  name: "Baskoro",             eta: "2 Menit" },
        { id: "FISIP",    name: "FISIP Hukum",         eta: "4 Menit" },
        { id: "FIB",      name: "FIB Vokasi",          eta: "6 Menit" },
        { id: "WIDPUR",   name: "Widpur",              eta: "7 Menit" },
        { id: "SAMWA",    name: "Samwa",               eta: "9 Menit" },
        { id: "PSIKO",    name: "Psiko",               eta: "11 Menit" },
        { id: "FEB",      name: "FEB",                 eta: "12 Menit" },
        { id: "FKM",      name: "FKM",                 eta: "14 Menit" },
        { id: "FPIK",     name: "FPIK",                eta: "16 Menit" },
        { id: "FPP",      name: "FPP",                 eta: "18 Menit" },
        { id: "FPP2",     name: "FPP After Sapi",      eta: "20 Menit" },
        { id: "BUNDARAN", name: "Bundaran UNDIP",      eta: "22 Menit" },
        { id: "RUSUNAWA", name: "Rusunawa",            eta: "24 Menit" }
    ]
};

const JADWAL_DATABASE = [
    { koridor: "1", code: "K-1", halte: "Joging Track",     jam: "06:30, 07:00, 07:30, 08:00, 08:30", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Baskoro",          jam: "06:32, 07:02, 07:32, 08:02, 08:32", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FISIP Hukum",      jam: "06:34, 07:04, 07:34, 08:04, 08:34", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FIB Vokasi",       jam: "06:36, 07:06, 07:36, 08:06, 08:36", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Widpur",           jam: "06:37, 07:07, 07:37, 08:07, 08:37", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Samwa",            jam: "06:39, 07:09, 07:39, 08:09, 08:39", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Psiko",            jam: "06:41, 07:11, 07:41, 08:11, 08:41", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FEB",              jam: "06:42, 07:12, 07:42, 08:12, 08:42", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FKM",              jam: "06:44, 07:14, 07:44, 08:14, 08:44", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FPIK",             jam: "06:46, 07:16, 07:46, 08:16, 08:46", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "FPP",              jam: "06:48, 07:18, 07:48, 08:18, 08:48", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Bundaran UNDIP",   jam: "06:52, 07:22, 07:52, 08:22, 08:52", interval: "15-20 Min" },
    { koridor: "1", code: "K-1", halte: "Rusunawa",         jam: "06:54, 07:24, 07:54, 08:24, 08:54", interval: "15-20 Min" },
];

// ===================== STATE APLIKASI =====================
let map;
let activeRouteTab = "1";
let totalPassengersServed = 432;
let isThemeDark = true;
let selectedSimBusId = "dipo-01";

const BUS_FLEET = [
    {
        id: "dipo-01", name: "Bus Dipo 01", plate: "H 1092 AD",
        routeId: "1", routeName: "Koridor Tembalang (Outer)",
        passengers: 22, maxCapacity: 30, speed: 0,
        status: "Menunggu GPS", currentStop: "-", nextStop: "-",
        lat: -7.0553551, lng: 110.4392964, marker: null
    },
];

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    initMap();
    renderBusCards();
    initSimulatorDropdown();
    renderRouteTimeline();
    renderSchedulesTable();
    initEventListeners();
    listenFirebaseGPS();
    showToast("Selamat datang di DipoTrack! Menunggu data GPS bus...", "success");
});

function initClock() {
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB";
        document.getElementById("current-time").textContent = timeStr;
    }, 1000);
}

// ===================== FIREBASE GPS LISTENER =====================
function listenFirebaseGPS() {
    BUS_FLEET.forEach(bus => {
        const busRef = ref(db, `buses/${bus.id}`);
        onValue(busRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.lat && data.lng) {
                const prevLat = bus.lat;
                const prevLng = bus.lng;

                bus.lat = data.lat;
                bus.lng = data.lng;
                bus.speed = data.speed || 0;
                bus.status = "Beroperasi";

                // Hitung kecepatan estimasi dari perubahan koordinat
                if (prevLat && prevLng) {
                    const dist = getDistanceMeters(prevLat, prevLng, bus.lat, bus.lng);
                    if (dist > 2) bus.speed = Math.min(Math.round(dist * 2.4), 60);
                }

                // Update marker di peta
                if (bus.marker) {
                    bus.marker.setLatLng([bus.lat, bus.lng]);
                    bus.marker.setPopupContent(createPopupContent(bus));
                }

                // Cek halte terdekat
                const closest = findClosestStop([bus.lat, bus.lng]);
                if (closest) {
                    if (bus.currentStop !== closest.name) {
                        bus.currentStop = closest.name;
                        bus.nextStop = getNextStop(bus.routeId, closest.id);
                        showToast(`📍 ${bus.name} tiba di <b>${closest.name}</b>`, "info");
                    }
                }

                renderBusCards();
                renderRouteTimeline();
                updateQuickStats();
            }
        });
    });
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calculateETA(bus) {
    const nextStopKey = Object.keys(HALTE_UNDIP).find(
        key => HALTE_UNDIP[key].name === bus.nextStop
    );
    if (!nextStopKey || bus.speed < 2) return null;
    const nextCoords = HALTE_UNDIP[nextStopKey].coords;
    const distanceMeters = getDistanceMeters(bus.lat, bus.lng, nextCoords[0], nextCoords[1]);
    const speedMps = (bus.speed * 1000) / 3600;
    const etaSeconds = distanceMeters / speedMps;
    const etaMinutes = Math.round(etaSeconds / 60);
    return etaMinutes <= 0 ? "Tiba" : `~${etaMinutes} Menit`;
}

// ===================== MAP =====================
function initMap() {
    map = L.map('map', { center: [-7.0515, 110.4400], zoom: 15, zoomControl: false });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    setMapTiles();
    drawRoutePolylines();
    initBusMarkers();
}

function setMapTiles() {
    const tilesUrl = isThemeDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    map.eachLayer(layer => { if (layer instanceof L.TileLayer) map.removeLayer(layer); });
    L.tileLayer(tilesUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20
    }).addTo(map);
}

function drawRoutePolylines() {
    L.polyline(ROUTE_1_PATH, { color: '#3b82f6', weight: 4, opacity: 0.6, dashArray: '8,8', lineCap: 'round' }).addTo(map);

    Object.keys(HALTE_UNDIP).forEach(key => {
        const stop = HALTE_UNDIP[key];
        const stopIcon = L.divIcon({
            className: 'halte-map-node',
            html: `<div style="width:10px;height:10px;background:white;border:2px solid #0072ce;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.5);"></div>`,
            iconSize: [10, 10]
        });
        L.marker(stop.coords, { icon: stopIcon }).addTo(map)
            .bindTooltip(`<b>${stop.name}</b>`, { permanent: false, direction: 'top', className: 'halte-tooltip' });
    });
}

function initBusMarkers() {
    BUS_FLEET.forEach(bus => {
        const cap = getCapacityStatus(bus.passengers, bus.maxCapacity);
        const icon = L.divIcon({
            className: 'leaflet-bus-marker',
            html: `<div class="bus-marker-container ${cap.colorClass}" id="marker-container-${bus.id}">
                       <i class="fa-solid fa-bus"></i>
                       <div class="bus-marker-pulse"></div>
                   </div>`,
            iconSize: [38, 38], iconAnchor: [19, 19]
        });
        const marker = L.marker([bus.lat, bus.lng], { icon }).addTo(map);
        marker.bindPopup(createPopupContent(bus));
        bus.marker = marker;
    });
}

function getCapacityStatus(passengers, max) {
    const ratio = passengers / max;
    if (ratio >= 1.0) return { label: "Penuh",        class: "cap-red",    colorClass: "color-red" };
    if (ratio >= 0.7) return { label: "Hampir Penuh", class: "cap-yellow", colorClass: "color-yellow" };
    return                    { label: "Kursi Tersedia", class: "cap-green", colorClass: "color-green" };
}

function createPopupContent(bus) {
    const ratio = Math.round((bus.passengers / bus.maxCapacity) * 100);
    const cap = getCapacityStatus(bus.passengers, bus.maxCapacity);
    const colorClass = cap.class === 'cap-red' ? 'color-red' : cap.class === 'cap-yellow' ? 'color-yellow' : 'color-green';
    return `
        <div class="map-popup-bus">
            <h4>${bus.name} <span class="badge badge-accent" style="margin-left:auto">${bus.plate}</span></h4>
            <p>Rute: <span>${bus.routeName}</span></p>
            <p>Kecepatan: <span>${bus.speed} km/jam</span></p>

            <p>Halte Berikut: <span>${bus.nextStop}</span></p>
        </div>`;
}

// ===================== SIDEBAR =====================
function renderBusCards() {
    const container = document.getElementById("bus-cards-container");
    container.innerHTML = "";
    BUS_FLEET.forEach(bus => {
        const cap = getCapacityStatus(bus.passengers, bus.maxCapacity);
        const cardItem = document.createElement("div");
        cardItem.className = `bus-info-item ${bus.id === selectedSimBusId ? 'active-selection' : ''}`;
        cardItem.dataset.busId = bus.id;
        cardItem.innerHTML = `
            <div class="bus-card-top">
                <div class="bus-name-box">
                    <div class="bus-avatar"><i class="fa-solid fa-bus"></i></div>
                    <div>
                        <h3>${bus.name}</h3>
                        <p>${bus.plate} • Rute ${bus.routeId}</p>
                    </div>
                </div>

            </div>
            <div class="bus-card-details">
                <div class="detail-item"><i class="fa-solid fa-location-crosshairs"></i><span>${bus.currentStop}</span></div>
                <div class="detail-item"><i class="fa-solid fa-forward"></i><span>${bus.nextStop}</span></div>
                <div class="detail-item"><i class="fa-solid fa-gauge-high"></i><span>${bus.speed} km/j</span></div>
                <div class="detail-item">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span style="color:${bus.status === 'Macet' ? 'var(--color-danger)' : bus.status === 'Menunggu GPS' ? 'var(--color-warning)' : 'inherit'}">${bus.status}</span>
                </div>
            </div>`;
        cardItem.addEventListener("click", () => selectBus(bus.id));
        container.appendChild(cardItem);
    });
}

function selectBus(busId) {
    selectedSimBusId = busId;
    document.querySelectorAll(".bus-info-item").forEach(it => {
        it.classList.toggle("active-selection", it.dataset.busId === busId);
    });
    document.getElementById("select-bus-sim").value = busId;
    const bus = BUS_FLEET.find(b => b.id === busId);
    if (bus && bus.marker) {
        map.setView([bus.lat, bus.lng], 16, { animate: true, duration: 1.0 });
        bus.marker.openPopup();
        switchRouteTab(bus.routeId);
    }
}

// ===================== SIMULATOR CONTROLS =====================
function initSimulatorDropdown() {
    const select = document.getElementById("select-bus-sim");
    select.innerHTML = "";
    BUS_FLEET.forEach(bus => {
        const option = document.createElement("option");
        option.value = bus.id;
        option.textContent = `${bus.name} (${bus.plate})`;
        select.appendChild(option);
    });
    select.addEventListener("change", (e) => selectBus(e.target.value));
}

// ===================== HALTE & TIMELINE =====================
function findClosestStop(coords) {
    const threshold = 0.0003;
    let closest = null;
    Object.keys(HALTE_UNDIP).forEach(key => {
        const stop = HALTE_UNDIP[key];
        const dist = Math.sqrt(Math.pow(coords[0] - stop.coords[0], 2) + Math.pow(coords[1] - stop.coords[1], 2));
        if (dist < threshold) closest = { id: key, name: stop.name };
    });
    return closest;
}

function getNextStop(routeId, currentStopId) {
    const stops = ROUTE_STOPS_MAPPING[routeId];
    const idx = stops.findIndex(s => s.id === currentStopId);
    if (idx === -1 || idx === stops.length - 1) return stops[0].name;
    return stops[idx + 1].name;
}

function renderRouteTimeline() {
    const container = document.getElementById("timeline-steps");
    container.innerHTML = "";
    const stops = ROUTE_STOPS_MAPPING[activeRouteTab];
    const busesOnRoute = BUS_FLEET.filter(b => b.routeId === activeRouteTab);

    stops.forEach((stop, index) => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const busAtStop = busesOnRoute.find(b => {
            const closest = findClosestStop([b.lat, b.lng]);
            return closest && closest.id === stop.id;
        });
        const busHeading = busesOnRoute.find(b => b.nextStop.includes(stop.name) && b.status === "Beroperasi");

        let stateClass = index < 2 ? "passed" : "";
        let badgeHtml = "";

        if (busAtStop) {
            stateClass = "active-stop";
            badgeHtml = `<div class="timeline-bus-badge"><i class="fa-solid fa-bus"></i><span>${busAtStop.name} (${busAtStop.passengers}/${busAtStop.maxCapacity})</span></div>`;
        } else if (busHeading) {
            stateClass = "passed";
            badgeHtml = `<span style="font-size:10px;color:var(--accent-blue);font-weight:700;"><i class="fa-solid fa-chevron-right fa-fade"></i> Bus Mendekat</span>`;
        }

        if (stateClass) item.classList.add(stateClass);
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${stop.name}</h4>
                <p><i class="fa-regular fa-clock"></i> Estimasi Tunggu: ${stop.eta}</p>
            </div>
            ${badgeHtml}`;
        container.appendChild(item);
    });
}

function switchRouteTab(routeId) {
    activeRouteTab = routeId;
    document.querySelectorAll(".route-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.route === routeId);
    });
    renderRouteTimeline();
}

// ===================== STATS =====================
function updateQuickStats() {
    const running = BUS_FLEET.filter(b => b.speed > 0);
    const avg = running.length > 0 ? Math.round(running.reduce((s, b) => s + b.speed, 0) / running.length) : 0;
    document.getElementById("avg-speed").textContent = `${avg} km/jam`;

    const macet = BUS_FLEET.find(b => b.status === "Macet");
    const el = document.getElementById("avg-eta");

    if (macet) {
        el.textContent = "Terlambat";
        el.style.color = "var(--color-warning)";
    } else if (running.length > 0) {
        const eta = calculateETA(running[0]);
        el.textContent = eta || "Menghitung...";
        el.style.color = "white";
    } else {
        el.textContent = "Bus Standby";
        el.style.color = "var(--text-secondary)";
    }
}

// ===================== JADWAL =====================
function renderSchedulesTable(filterQuery = "") {
    const tbody = document.getElementById("schedule-table-body");
    tbody.innerHTML = "";
    const query = filterQuery.toLowerCase().trim();
    const filtered = JADWAL_DATABASE.filter(item =>
        item.halte.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        "tembalang".includes(query)
    );
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-secondary)">Tidak ada jadwal ditemukan</td></tr>`;
        return;
    }
    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const badgeClass = "blue-cor";
        const badgeLabel = "Tembalang";
        tr.innerHTML = `<td><span class="route-badge ${badgeClass}">${badgeLabel}</span></td><td>${item.halte}</td><td>${item.jam}</td><td>${item.interval}</td>`;
        tbody.appendChild(tr);
    });
}

// ===================== EVENT LISTENERS =====================
function initEventListeners() {
    document.getElementById("theme-toggle").addEventListener("click", () => {
        isThemeDark = !isThemeDark;
        document.body.classList.toggle("dark-theme", isThemeDark);
        document.body.classList.toggle("light-theme", !isThemeDark);
        document.getElementById("theme-toggle").innerHTML = `<i class="fa-solid ${isThemeDark ? 'fa-moon' : 'fa-sun'}"></i>`;
        setMapTiles();
        showToast(`Tema diubah ke mode ${isThemeDark ? 'Dark' : 'Light'}`, "success");
    });

    document.getElementById("sim-speed").addEventListener("input", (e) => {
        document.getElementById("speed-val").textContent = `${e.target.value}x`;
    });

    document.getElementById("btn-sim-alert").addEventListener("click", () => {
        const bus = BUS_FLEET.find(b => b.id === selectedSimBusId);
        if (!bus) return;
        const btn = document.getElementById("btn-sim-alert");
        if (bus.status === "Beroperasi") {
            bus.status = "Macet"; bus.speed = 0;
            const mc = document.getElementById(`marker-container-${bus.id}`);
            if (mc) mc.className = "bus-marker-container color-red";
            btn.innerHTML = `<i class="fa-solid fa-wrench"></i> Selesaikan Gangguan (Normal)`;
            btn.className = "btn btn-success btn-block";
            showToast(`🚨 PERINGATAN: ${bus.name} mengalami MACET TOTAL!`, "danger");
        } else {
            bus.status = "Beroperasi"; bus.speed = 25;
            btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Simulasi Gangguan (Macet)`;
            btn.className = "btn btn-danger btn-block";
            showToast(`✅ Insiden teratasi! ${bus.name} kembali beroperasi normal.`, "success");
        }
        renderBusCards(); updateQuickStats();
    });

    document.getElementById("tab-route-1").addEventListener("click", () => switchRouteTab("1"));
    document.getElementById("schedule-search").addEventListener("input", (e) => renderSchedulesTable(e.target.value));
}

// ===================== TOAST =====================
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icons = { success: "fa-circle-check", warning: "fa-triangle-exclamation", danger: "fa-circle-exclamation", info: "fa-circle-info" };
    toast.innerHTML = `
        <span class="toast-icon"><i class="fa-solid ${icons[type] || icons.info}"></i></span>
        <span class="toast-message">${message}</span>
        <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>`;
    toast.querySelector(".toast-close").addEventListener("click", () => toast.remove());
    setTimeout(() => {
        toast.style.animation = "toast-in 0.4s reverse forwards";
        setTimeout(() => toast.remove(), 400);
    }, 5000);
    container.appendChild(toast);
}
