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

// Rute bus UNDIP — waypoint tracing jalan kampus Tembalang
// Diperbarui: mengikuti jalan utama kampus sesuai referensi Google Maps
const ROUTE_1_PATH = [

    // ── JOGING TRACK → BASKORO ──
    // Jl. Prof. Soedarto, ke utara (lurus)
    [-7.0553551, 110.4392964], // Halte Joging Track
    [-7.0549800, 110.4393100],
    [-7.0546200, 110.4392800],
    [-7.0542100, 110.4392500],
    [-7.0538600, 110.4392200],
    [-7.0536302, 110.4391998], // Halte Baskoro

    // ── BASKORO → FISIP HUKUM ──
    // Lanjut utara ke pertigaan, belok kiri ke barat (Jl. Prof. Soedarto Timur → Barat)
    [-7.0533000, 110.4391700],
    [-7.0529500, 110.4391500],
    [-7.0526800, 110.4389800],
    [-7.0524200, 110.4387000],
    [-7.0521500, 110.4383800],
    [-7.0518800, 110.4380200],
    [-7.0515800, 110.4376800],
    [-7.0512700, 110.4374300],
    [-7.0509097, 110.4371935], // Halte FISIP Hukum

    // ── FISIP HUKUM → FIB VOKASI ──
    // Terus ke barat (Jl. Prof. Soedarto)
    [-7.0506800, 110.4368500],
    [-7.0505200, 110.4365200],
    [-7.0504200, 110.4360992], // Halte FIB Vokasi

    // ── FIB VOKASI → WIDPUR ──
    // Belok kanan ke utara, lalu belok kanan ke timur
    // Jl. Imam Bardjo (utara gedung rektorat) → ke timur
    [-7.0502500, 110.4361500],
    [-7.0500000, 110.4363000],
    [-7.0498200, 110.4367000],
    [-7.0497500, 110.4372000],
    [-7.0497800, 110.4377500],
    [-7.0498200, 110.4381500],
    [-7.0498503, 110.4384971], // Halte Widpur

    // ── WIDPUR → SAMWA ──
    // Jl. Prof. Soedarto sisi utara, ke timur
    [-7.0490500, 110.4391500],
    [-7.0489000, 110.4396000],
    [-7.0488200, 110.4399500],
    [-7.0487483, 110.4402190], // Halte Samwa

    // ── SAMWA → PSIKO ──
    // Belok kiri ke utara (Jl. Prof. Mr. Sunario), lalu ke barat
    [-7.0484500, 110.4401000],
    [-7.0481200, 110.4399500],
    [-7.0478000, 110.4396800],
    [-7.0475200, 110.4393500],
    [-7.0473200, 110.4390000],
    [-7.0471884, 110.4387009], // Halte Psiko

    // ── PSIKO → FEB ──
    // Balik ke timur, mengikuti Jl. Prof. Mr. Sunario ke timur
    [-7.0472500, 110.4390500],
    [-7.0473800, 110.4396000],
    [-7.0475000, 110.4401000],
    [-7.0475800, 110.4406000],
    [-7.0476915, 110.4410277], // Halte FEB

    // ── FEB → FKM ──
    // Lanjut ke timur laut, Jl. Prof. Jacub Rais
    [-7.0478500, 110.4413500],
    [-7.0481000, 110.4417000],
    [-7.0484500, 110.4420500],
    [-7.0487200, 110.4423000],
    [-7.0489452, 110.4425284], // Halte FKM

    // ── FKM → FPIK ──
    // Belok kanan ke selatan, Jl. Prof. Jacub Rais sisi timur
    [-7.0492000, 110.4425000],
    [-7.0496500, 110.4423500],
    [-7.0501500, 110.4422000],
    [-7.0507341, 110.4420429], // Halte FPIK

    // ── FPIK → FPP ──
    // Lanjut ke selatan (jalan sisi timur kampus)
    [-7.0512500, 110.4418500],
    [-7.0518000, 110.4417000],
    [-7.0523500, 110.4415500],
    [-7.0530393, 110.4412919], // Halte FPP

    // ── FPP → FPP AFTER SAPI ──
    // Belok kanan ke barat daya, kembali ke Jl. Prof. Soedarto
    [-7.0534000, 110.4410000],
    [-7.0537500, 110.4407000],
    [-7.0540000, 110.4404000],
    [-7.0542000, 110.4401000],
    [-7.0543800, 110.4398500],
    [-7.0545672, 110.4396236], // Halte FPP After Sapi

    // ── FPP AFTER SAPI → BUNDARAN UNDIP ──
    // Lurus ke selatan (Jl. Prof. Soedarto)
    [-7.0548500, 110.4395500],
    [-7.0552000, 110.4394800],
    [-7.0556000, 110.4394200],
    [-7.0560116, 110.4393959], // Halte Bundaran UNDIP

    // ── BUNDARAN UNDIP → RUSUNAWA ──
    // Belok kiri (timur), Jl. Stadion / sisi selatan kampus
    [-7.0561000, 110.4398000],
    [-7.0561500, 110.4403500],
    [-7.0561200, 110.4409000],
    [-7.0560000, 110.4415000],
    [-7.0558500, 110.4421000],
    [-7.0556500, 110.4426000],
    [-7.0554000, 110.4430500],
    [-7.0551500, 110.4434500],
    [-7.0549000, 110.4438000],
    [-7.0547200, 110.4440500],
    [-7.0545246, 110.4441404], // Halte Rusunawa

    // ── RUSUNAWA → JOGING TRACK ──
    // Balik ke barat, Jl. Prof. Soedarto (sisi selatan)
    [-7.0547500, 110.4437500],
    [-7.0549800, 110.4433000],
    [-7.0551500, 110.4428000],
    [-7.0552800, 110.4422000],
    [-7.0553500, 110.4416000],
    [-7.0554000, 110.4410000],
    [-7.0554000, 110.4404500],
    [-7.0553800, 110.4399500],
    [-7.0553551, 110.4392964], // Halte Joging Track

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

// State untuk highlight rute real-time
let approachPolyline = null;       // Garis animasi bus → halte berikutnya
const APPROACH_RADIUS_M = 150;     // Jarak (meter) = "bus dekat halte"
const halteLayerMap = {};          // Simpan reference layer halte per id

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
                updateRouteHighlight(bus);
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
async function initMap() {
    map = L.map('map', { center: [-7.0515, 110.4400], zoom: 15, zoomControl: false });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    setMapTiles();
    await drawRoutePolylines();
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

// ===================== OSRM ROUTING =====================
async function getRouteFromOSRM(waypoints) {
    // Batasi jumlah waypoint agar request tidak terlalu panjang
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
            // GeoJSON OSRM: [lng, lat] → balik jadi [lat, lng] untuk Leaflet
            return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        }
    } catch (e) {
        console.warn("OSRM gagal, fallback ke waypoint manual:", e);
    }
    return null;
}

async function drawRoutePolylines() {
    // Gambar marker halte (circleMarker agar bisa di-update style real-time)
    Object.keys(HALTE_UNDIP).forEach(key => {
        const stop = HALTE_UNDIP[key];
        const circle = L.circleMarker(stop.coords, {
            radius: 6,
            color: '#0072ce',
            fillColor: 'white',
            fillOpacity: 1,
            weight: 2,
            className: `halte-circle halte-${key}`
        }).addTo(map)
            .bindTooltip(`<b>${stop.name}</b>`, { permanent: false, direction: 'top', className: 'halte-tooltip' });
        halteLayerMap[key] = circle;
    });

    // Titik-titik halte sebagai waypoints ke OSRM (loop kembali ke JOGING)
    const stopCoords = [
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
        HALTE_UNDIP.JOGING.coords, // kembali ke awal (loop)
    ];

    const routeCoords = await getRouteFromOSRM(stopCoords);

    L.polyline(routeCoords || ROUTE_1_PATH, {
        color: '#3b82f6', weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round'
    }).addTo(map);
}

// ===================== REALTIME ROUTE HIGHLIGHT =====================
function updateRouteHighlight(bus) {
    // Hapus garis approach sebelumnya
    if (approachPolyline) {
        map.removeLayer(approachPolyline);
        approachPolyline = null;
    }

    // Reset semua halte ke style normal
    Object.keys(halteLayerMap).forEach(key => {
        halteLayerMap[key].setStyle({
            radius: 6,
            color: '#0072ce',
            fillColor: 'white',
            fillOpacity: 1,
            weight: 2
        });
    });

    if (bus.status !== "Beroperasi" || bus.speed < 1) return;

    // Cari key halte berikutnya berdasarkan nama
    const nextStopKey = Object.keys(HALTE_UNDIP).find(
        key => HALTE_UNDIP[key].name === bus.nextStop
    );
    if (!nextStopKey) return;

    const nextCoords = HALTE_UNDIP[nextStopKey].coords;
    const distToNext = getDistanceMeters(bus.lat, bus.lng, nextCoords[0], nextCoords[1]);
    const isApproaching = distToNext <= APPROACH_RADIUS_M;

    // Gambar garis dari posisi bus ke halte berikutnya
    approachPolyline = L.polyline(
        [[bus.lat, bus.lng], nextCoords],
        {
            color: isApproaching ? '#f59e0b' : '#60a5fa',
            weight: isApproaching ? 6 : 4,
            opacity: 0.9,
            dashArray: isApproaching ? null : '8, 6',
            lineCap: 'round',
            lineJoin: 'round'
        }
    ).addTo(map);

    // Jika bus dekat halte → animasikan halte target
    if (isApproaching) {
        const circle = halteLayerMap[nextStopKey];
        if (circle) {
            // Pulsing effect: radius besar + warna kuning oranye
            circle.setStyle({
                radius: 11,
                color: '#f59e0b',
                fillColor: '#fbbf24',
                fillOpacity: 0.6,
                weight: 3
            });

            // Toast notifikasi sekali saja per halte (hindari spam)
            if (bus._lastApproachToast !== nextStopKey) {
                bus._lastApproachToast = nextStopKey;
                showToast(
                    `🔔 Bus mendekati <b>${HALTE_UNDIP[nextStopKey].name}</b> (~${Math.round(distToNext)}m lagi)`,
                    "warning"
                );
            }
        }
    } else {
        // Bus belum dekat → reset flag toast agar bisa notif lagi nanti
        if (bus._lastApproachToast === nextStopKey) {
            bus._lastApproachToast = null;
        }

        // Halte berikutnya tetap diberi tanda biru terang (standby)
        const circle = halteLayerMap[nextStopKey];
        if (circle) {
            circle.setStyle({
                radius: 8,
                color: '#3b82f6',
                fillColor: '#93c5fd',
                fillOpacity: 0.5,
                weight: 2.5
            });
        }
    }
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

function calculateETAToStop(bus, stopId) {
    // Jika bus tidak beroperasi atau tidak bergerak, tidak bisa hitung ETA
    if (bus.status !== "Beroperasi" || bus.speed < 2) return null;

    const stops = ROUTE_STOPS_MAPPING[bus.routeId];
    if (!stops) return null;

    // Cari posisi bus saat ini di urutan rute
    const currentStopKey = Object.keys(HALTE_UNDIP).find(
        key => HALTE_UNDIP[key].name === bus.currentStop
    );
    const currentIdx  = stops.findIndex(s => s.id === currentStopKey);
    const targetIdx   = stops.findIndex(s => s.id === stopId);

    // Jika halte target sudah dilewati atau tidak ditemukan, skip
    if (targetIdx === -1) return null;
    if (currentIdx !== -1 && targetIdx <= currentIdx) return null;

    // Hitung jarak kumulatif dari posisi bus → halte berikutnya → ... → halte target
    // Titik awal: posisi bus aktual
    let totalDistM = 0;
    let prevCoords = [bus.lat, bus.lng];

    // Iterasi dari nextStop sampai stopId
    const nextStopKey = Object.keys(HALTE_UNDIP).find(
        key => HALTE_UNDIP[key].name === bus.nextStop
    );
    const nextIdx = stops.findIndex(s => s.id === nextStopKey);
    if (nextIdx === -1 || targetIdx < nextIdx) return null;

    for (let i = nextIdx; i <= targetIdx; i++) {
        const halteKey = stops[i].id;
        const halteCoords = HALTE_UNDIP[halteKey]?.coords;
        if (!halteCoords) continue;
        totalDistM += getDistanceMeters(prevCoords[0], prevCoords[1], halteCoords[0], halteCoords[1]);
        prevCoords = halteCoords;
    }

    const speedMps  = (bus.speed * 1000) / 3600;
    const etaMin    = Math.round((totalDistM / speedMps) / 60);
    return etaMin <= 0 ? "Tiba" : `~${etaMin} Menit`;
}

function renderRouteTimeline() {
    const container = document.getElementById("timeline-steps");
    container.innerHTML = "";
    const stops = ROUTE_STOPS_MAPPING[activeRouteTab];
    const busesOnRoute = BUS_FLEET.filter(b => b.routeId === activeRouteTab);

    stops.forEach((stop) => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        // Cek bus yang sedang berada di halte ini
        const busAtStop = busesOnRoute.find(b => {
            const closest = findClosestStop([b.lat, b.lng]);
            return closest && closest.id === stop.id;
        });

        // Cek bus yang sedang menuju halte ini
        const busHeading = busesOnRoute.find(
            b => b.nextStop.includes(stop.name) && b.status === "Beroperasi"
        );

        // Hitung ETA dinamis dari bus yang paling relevan
        const activeBus = busAtStop || busHeading || busesOnRoute[0];
        let etaText = stop.eta; // fallback ke nilai statis

        if (activeBus) {
            const isStandby = activeBus.speed < 2 || activeBus.status !== "Beroperasi";

            if (busAtStop && isStandby) {
                // Bus diam di halte ini (termasuk kasus posisi sama dengan user)
                etaText = "⏸️ Bus Standby";
            } else if (busAtStop) {
                // Bus aktif dan tepat di halte ini
                etaText = "🟢 Segera Berangkat";
            } else if (isStandby) {
                // Bus ada di rute tapi tidak bergerak
                etaText = "⏸️ Menunggu Jadwal";
            } else {
                const dynamicETA = calculateETAToStop(activeBus, stop.id);
                if (dynamicETA) etaText = dynamicETA;
            }
        }

        let stateClass = "";
        let badgeHtml  = "";

        if (busAtStop) {
            stateClass = "active-stop";
            badgeHtml  = `<div class="timeline-bus-badge"><i class="fa-solid fa-bus"></i><span>${busAtStop.name} (${busAtStop.passengers}/${busAtStop.maxCapacity})</span></div>`;
        } else if (busHeading) {
            stateClass = "passed";
            badgeHtml  = `<span style="font-size:10px;color:var(--accent-blue);font-weight:700;"><i class="fa-solid fa-chevron-right fa-fade"></i> Bus Mendekat</span>`;
        }

        if (stateClass) item.classList.add(stateClass);
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${stop.name}</h4>
                <p><i class="fa-regular fa-clock"></i> Estimasi Tunggu: ${etaText}</p>
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
