const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
const comboBadge = document.getElementById("comboBadge");
let width = window.innerWidth;
let height = window.innerHeight;
const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

let toastBadgeTimeout = null;
function showToastBadge(text, duration = 2400) {
    if (!comboBadge) return;
    comboBadge.textContent = text;
    comboBadge.classList.add("active");
    clearTimeout(toastBadgeTimeout);
    toastBadgeTimeout = setTimeout(() => {
        comboBadge.classList.remove("active");
    }, duration);
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==========================================
// 1. 5 KIỂU DÁNG NGHỆ THUẬT (Artistic Shapes)
// ==========================================
const SHAPES = [
    { id: "galaxy", name: "Thiên Hà 3D", icon: "🌌" },
    { id: "rose", name: "Hoa Hồng", icon: "🌹" },
    { id: "orb", name: "Quả Cầu", icon: "🔮" },
    { id: "infinity", name: "Lụa Vô Cực", icon: "♾️" },
    { id: "glass", name: "Thủy Tinh", icon: "💎" }
];
let currentShapeIdx = 0;
let curShape = SHAPES[currentShapeIdx];
let galaxyEnergy = 1.0;
let galaxyActiveUntil = performance.now() + 4500;

const shapeToggle = document.getElementById("shapeToggle");
const shapeIcon = document.getElementById("shapeIcon");
const shapeName = document.getElementById("shapeName");

const SHAPE_STORIES = {
    galaxy: { text: "Trái tim xoay chuyển cùng dải ngân hà lung linh lấp lánh giữa vũ trụ bao la!", audio: "shape_galaxy.mp3" },
    flower: { text: "Bông hồng tình yêu nở rộ, từng cánh hoa mang theo sự ngọt ngào dành riêng cho bạn!", audio: "shape_flower.mp3" },
    sphere: { text: "Quả cầu năng lượng ánh sáng phản chiếu ngàn tia lung linh ấm áp!", audio: "shape_sphere.mp3" },
    ribbon: { text: "Dải ruy băng 3D uốn lượn tượng trưng cho tình cảm vĩnh cửu không phai!", audio: "shape_ribbon.mp3" },
    crystal: { text: "Khối pha lê trong suốt tỏa sáng tinh khiết và sưởi ấm trái tim bạn!", audio: "shape_crystal.mp3" }
};

function selectShape(shapeId) {
    const idx = SHAPES.findIndex(s => s.id === shapeId);
    if (idx !== -1) {
        currentShapeIdx = idx;
    } else {
        currentShapeIdx = (currentShapeIdx + 1) % SHAPES.length;
    }
    curShape = SHAPES[currentShapeIdx];
    if (shapeIcon) shapeIcon.textContent = curShape.icon;
    if (shapeName) shapeName.textContent = curShape.name;

    const mobShapeIcon = document.getElementById("mobShapeIcon");
    if (mobShapeIcon) mobShapeIcon.textContent = curShape.icon;

    document.querySelectorAll("#shapeChips .hub-chip").forEach(chip => {
        if (chip.getAttribute("data-shape") === curShape.id) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    if (curShape.id === "galaxy") {
        galaxyActiveUntil = performance.now() + 4500;
    }
    closeControlHub();
    const storyItem = SHAPE_STORIES[curShape.id] || { text: "Kiểu dáng trái tim mới đã được kích hoạt!", audio: "shape_galaxy.mp3" };
    showToastCard(`${curShape.icon} Kiểu Dáng: ${curShape.name} ✨`, `"${storyItem.text}"`, 9000, storyItem.text, storyItem.audio);
}

if (shapeToggle) {
    shapeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        selectShape();
    });
}

document.querySelectorAll(".hub-chip[data-shape]").forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const sId = chip.getAttribute("data-shape");
        selectShape(sId);
    });
});

// ==========================================
// 1.5. CHẾ ĐỘ KIỂM SOÁT HÌNH NỀN (Background Visibility Control)
// ==========================================
const BG_MODES = [
    { id: "default", name: "Nền: Chuẩn", icon: "🖼️", heartTargetAlpha: 1.0, bodyClass: "", isGalaxyBg: false },
    { id: "art", name: "Nền: Nghệ Thuật", icon: "🌸", heartTargetAlpha: 0.25, bodyClass: "bg-mode-art", isGalaxyBg: false },
    { id: "galaxy_bg", name: "Nền: Thiên Hà 3D", icon: "🌌", heartTargetAlpha: 0.88, bodyClass: "bg-mode-galaxy", isGalaxyBg: true },
    { id: "pure", name: "Nền: Thuần Khiết", icon: "🌄", heartTargetAlpha: 0.0, bodyClass: "bg-mode-pure", isGalaxyBg: false }
];

const BG_STORIES = {
    default: { text: "Không gian Nền Chuẩn: Trái tim tỏa sáng rạng ngời trên bầu trời đêm lung linh huyền ảo!", audio: "bg_default.mp3" },
    art: { text: "Không gian Nghệ Thuật: Cánh hoa anh đào rơi dịu dàng giữa khung cảnh lãng mạn nên thơ!", audio: "bg_art.mp3" },
    galaxy_bg: { text: "Không gian Thiên Hà 3D: Hãy di chuyển chuột để cảm nhận chiều sâu vũ trụ vô tận!", audio: "bg_galaxy.mp3" },
    pure: { text: "Không gian Thuần Khiết: Khung cảnh tối giản tĩnh lặng và bình yên nhất dành cho bạn!", audio: "bg_pure.mp3" }
};

let currentBgModeIdx = 0;
let curBgMode = BG_MODES[currentBgModeIdx];
let curHeartVisAlpha = 1.0;
let curGalaxyBgAlpha = 0.0;
let curSakuraAlpha = 0.0;
let curGlitterAlpha = 1.0;

const bgModeToggle = document.getElementById("bgModeToggle");
const bgModeIcon = document.getElementById("bgModeIcon");
const bgModeName = document.getElementById("bgModeName");

function selectBgMode(bgId) {
    const idx = BG_MODES.findIndex(b => b.id === bgId);
    if (idx !== -1) {
        currentBgModeIdx = idx;
    } else {
        currentBgModeIdx = (currentBgModeIdx + 1) % BG_MODES.length;
    }
    curBgMode = BG_MODES[currentBgModeIdx];
    if (bgModeIcon) bgModeIcon.textContent = curBgMode.icon;
    if (bgModeName) bgModeName.textContent = curBgMode.name;

    document.querySelectorAll("#bgChips .hub-chip").forEach(chip => {
        if (chip.getAttribute("data-bg") === curBgMode.id) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    document.body.classList.remove("bg-mode-art", "bg-mode-galaxy", "bg-mode-pure");
    if (curBgMode.bodyClass) {
        document.body.classList.add(curBgMode.bodyClass);
    }
    closeControlHub();
    const storyItem = BG_STORIES[curBgMode.id] || { text: "Không gian nền mới đã được cập nhật!", audio: "bg_default.mp3" };
    showToastCard(`${curBgMode.icon} ${curBgMode.name} ✨`, `"${storyItem.text}"`, 9000, storyItem.text, storyItem.audio);
}

if (bgModeToggle) {
    bgModeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        selectBgMode();
    });
}

document.querySelectorAll(".hub-chip[data-bg]").forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const bId = chip.getAttribute("data-bg");
        selectBgMode(bId);
    });
});

// Hệ thống 160 vì sao và dải xoắn ốc 3D toàn cảnh không gian mượt mà
const bgGalaxyStars = [];
for (let i = 0; i < 160; i++) {
    const arm = i % 3;
    const armAngle = (arm * (Math.PI * 2 / 3));
    const dist = Math.pow(Math.random(), 0.55) * 580 + 25;
    const spiralAngle = dist * 0.0055 + armAngle + (Math.random() - 0.5) * 0.45;
    bgGalaxyStars.push({
        dist: dist,
        baseAngle: spiralAngle,
        z: (Math.random() - 0.5) * 380,
        speed: (0.00028 + 14 / (dist + 50) * 0.0005),
        size: Math.random() * 2.2 + 0.8,
        color: ["#ffffff", "#c4b5fd", "#93c5fd", "#f472b6", "#fef08a", "#e0e7ff"][Math.floor(Math.random() * 6)],
        twinklePhase: Math.random() * Math.PI * 2
    });
}

function draw3DGalaxyBackground(ctx, now, tiltX, tiltY) {
    if (curGalaxyBgAlpha < 0.01) return;

    ctx.save();
    const cx = width / 2 + tiltX * 30;
    const cy = height / 2 + tiltY * 30;
    const rotSpeed = now * 0.00028;
    const perspective = 380;

    // Nebula Center Glow
    const nebGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.6);
    nebGrd.addColorStop(0, `rgba(168, 85, 247, ${0.45 * curGalaxyBgAlpha})`);
    nebGrd.addColorStop(0.35, `rgba(99, 102, 241, ${0.25 * curGalaxyBgAlpha})`);
    nebGrd.addColorStop(0.7, `rgba(236, 72, 153, ${0.12 * curGalaxyBgAlpha})`);
    nebGrd.addColorStop(1, "transparent");

    ctx.fillStyle = nebGrd;
    ctx.fillRect(0, 0, width, height);

    for (let s of bgGalaxyStars) {
        const curAngle = s.baseAngle + rotSpeed * (s.speed * 800);
        const x = Math.cos(curAngle) * s.dist;
        const y = Math.sin(curAngle) * s.dist * 0.52; // Tilted spiral plane
        const z = s.z + Math.sin(curAngle * 2 + now * 0.001) * 35;

        // 3D Pitch tilt with mouse
        const pz = z + tiltY * 80;
        const proj = perspective / (perspective + pz + 300);
        const sx = cx + x * proj;
        const sy = cy + y * proj;

        if (sx >= -20 && sx <= width + 20 && sy >= -20 && sy <= height + 20) {
            const twinkle = 0.4 + Math.sin(now * 0.004 + s.twinklePhase) * 0.6;
            ctx.globalAlpha = curGalaxyBgAlpha * Math.min(1.0, Math.max(0.1, (pz + 250) / 400)) * twinkle;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(sx, sy, s.size * proj * 1.35, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.globalAlpha = 1.0;
    ctx.restore();
}

// ==========================================
// 2. 10 TÔNG MÀU SẮC NGHỆ THUẬT & TRỌN BỘ CÂU THÍNH SIÊU CUỐN
// ==========================================
const THEMES = {
    pink: {
        name: "Hồng Ngọt Ngào",
        icon: "💖",
        shapeTitle: "Đám Mây Kẹo Bông Gòn",
        effectTitle: "Làn khói hồng & Hạt đường tuyết ngọt",
        quote: "Trần đời ai lại nêm đường vào cà phê khi có em đứng cạnh? Em chỉ cần cười một cái là ly đen đá tự động chuyển thành trà sữa full topping 100% đường rồi! 🍬🥤",
        audio: "theme_pink.mp3",
        coreGrad: [
            [0, "rgba(255, 235, 170, 0.95)"],
            [0.3, "rgba(255, 120, 60, 0.85)"],
            [0.7, "rgba(255, 40, 100, 0.75)"],
            [1, "rgba(200, 0, 70, 0.3)"]
        ],
        coreShadow: "rgba(255, 60, 110, 0.9)",
        facetColor: "rgba(255, 240, 200, 0.45)",
        textColor: "#ffe4f0",
        textShadow: "rgba(255, 105, 180, 1)",
        burstColors: ["#ff4081", "#ff79b0", "#ffb6c1", "#ffd700", "#ffffff"],
        shockwaveColor: "rgba(255, 105, 180,",
        butterflyColor: "#ff94c2",
        particleColor: "#ffb7c5"
    },
    galaxy: {
        name: "Tím Vũ Trụ",
        icon: "🌌",
        shapeTitle: "Vòng Xoáy Ốc Ngân Hà",
        effectTitle: "Sắc tím dạ quang, Bùng nổ tinh vân & Sao băng",
        quote: "Phi hành gia lạc lối ngoài không gian thì dùng định vị tàu mẹ, còn tôi lỡ nhìn vào mắt em là mất luôn phương hướng. Lực hấp dẫn ở đây mạnh gấp mười lần hố đen vũ trụ! 🚀🌌",
        audio: "theme_galaxy.mp3",
        coreGrad: [
            [0, "rgba(220, 240, 255, 0.95)"],
            [0.3, "rgba(160, 100, 255, 0.85)"],
            [0.7, "rgba(120, 30, 220, 0.75)"],
            [1, "rgba(60, 0, 150, 0.3)"]
        ],
        coreShadow: "rgba(180, 80, 255, 0.9)",
        facetColor: "rgba(220, 200, 255, 0.45)",
        textColor: "#e8d5ff",
        textShadow: "rgba(160, 80, 255, 1)",
        burstColors: ["#b388ff", "#ea80fc", "#8c9eff", "#e040fb", "#ffffff"],
        shockwaveColor: "rgba(180, 80, 255,",
        butterflyColor: "#d8b4fe",
        particleColor: "#c084fc"
    },
    gold: {
        name: "Hoàng Gia",
        icon: "👑",
        shapeTitle: "Lăng Trụ Lục Giác Vương Miện",
        effectTitle: "Vàng 24k dát bóng loáng, Tia lửa & Bụi vàng rơi",
        quote: "Nhà vua hỏi châu báu ngọc ngà trong ngân khố đâu hết rồi? Bẩm thần lỡ đem đổi hết lấy một nụ cười của nàng, giờ xin phép được làm thường dân chở nàng đi ăn ốc. 👑🐌",
        audio: "theme_gold.mp3",
        coreGrad: [
            [0, "rgba(255, 255, 220, 0.95)"],
            [0.3, "rgba(255, 200, 60, 0.85)"],
            [0.7, "rgba(230, 130, 20, 0.75)"],
            [1, "rgba(180, 70, 0, 0.3)"]
        ],
        coreShadow: "rgba(255, 180, 0, 0.9)",
        facetColor: "rgba(255, 250, 200, 0.45)",
        textColor: "#fff4d0",
        textShadow: "rgba(255, 200, 50, 1)",
        burstColors: ["#ffd700", "#ffea00", "#ffb300", "#ffe57f", "#ffffff"],
        shockwaveColor: "rgba(255, 215, 0,",
        butterflyColor: "#fde047",
        particleColor: "#fbbf24"
    },
    aurora: {
        name: "Băng Tuyết",
        icon: "❄️",
        shapeTitle: "Bông Tuyết Pha Lê 6 Cánh",
        effectTitle: "Sương mù xanh neon & Gai băng lạnh buốt",
        quote: "Mặt em lạnh lùng như băng đá Bắc Cực, vậy mà sao tôi cứ lại gần 3 bước là tim gan phèo phổi đều tự động tan chảy như que kem giữa trưa hè? 🍦❄️",
        audio: "theme_aurora.mp3",
        coreGrad: [
            [0, "rgba(220, 255, 255, 0.95)"],
            [0.3, "rgba(64, 224, 208, 0.85)"],
            [0.7, "rgba(0, 180, 216, 0.75)"],
            [1, "rgba(0, 119, 182, 0.3)"]
        ],
        coreShadow: "rgba(0, 230, 255, 0.9)",
        facetColor: "rgba(200, 255, 255, 0.45)",
        textColor: "#d0f4ff",
        textShadow: "rgba(0, 210, 255, 1)",
        burstColors: ["#00e5ff", "#18ffff", "#64ffda", "#80d8ff", "#ffffff"],
        shockwaveColor: "rgba(0, 229, 255,",
        butterflyColor: "#67e8f9",
        particleColor: "#38bdf8"
    },
    emerald: {
        name: "Ngọc Lục Bảo",
        icon: "💚",
        shapeTitle: "Lá Cỏ Bốn Lá Cách Điệu",
        effectTitle: "Sóng huỳnh quang xanh mint & Bào tử ngọc bích",
        quote: "Nhìn màn hình máy tính 8 tiếng một ngày thì hỏng mắt, quay sang nhìn tôi đi: vừa xanh mát chữa lành thị lực, vừa khuyến mãi thêm chức năng làm tim bạn đập loạn xạ! 🍀👀",
        audio: "theme_emerald.mp3",
        coreGrad: [
            [0, "rgba(230, 255, 245, 0.95)"],
            [0.3, "rgba(52, 211, 153, 0.85)"],
            [0.7, "rgba(16, 185, 129, 0.75)"],
            [1, "rgba(5, 150, 105, 0.3)"]
        ],
        coreShadow: "rgba(52, 211, 153, 0.9)",
        facetColor: "rgba(209, 250, 229, 0.45)",
        textColor: "#d1fae5",
        textShadow: "rgba(16, 185, 129, 1)",
        burstColors: ["#34d399", "#10b981", "#6ee7b7", "#a7f3d0", "#ffffff"],
        shockwaveColor: "rgba(52, 211, 153,",
        butterflyColor: "#6ee7b7",
        particleColor: "#34d399"
    },
    sunset: {
        name: "Hoàng Hôn",
        icon: "🧡",
        shapeTitle: "Vầng Mặt Trời Bán Nguyệt",
        effectTitle: "Chuyển sắc cam đào - than hồng, Đom đóm bập bùng",
        quote: "Hoàng hôn buông xuống thì trời tắt nắng, còn em đi ngang qua lại làm ửng đỏ cả hai bên má tôi. Bắt đền em đấy, tính tiền kem chống nắng mau! 🌅☀️",
        audio: "theme_sunset.mp3",
        coreGrad: [
            [0, "rgba(255, 250, 220, 0.95)"],
            [0.3, "rgba(251, 146, 60, 0.85)"],
            [0.7, "rgba(249, 115, 22, 0.75)"],
            [1, "rgba(234, 88, 12, 0.3)"]
        ],
        coreShadow: "rgba(251, 146, 60, 0.9)",
        facetColor: "rgba(254, 215, 170, 0.45)",
        textColor: "#ffedd5",
        textShadow: "rgba(249, 115, 22, 1)",
        burstColors: ["#fb923c", "#f97316", "#fdba74", "#fed7aa", "#ffffff"],
        shockwaveColor: "rgba(251, 146, 60,",
        butterflyColor: "#fdba74",
        particleColor: "#fb923c"
    },
    sakura: {
        name: "Hoa Anh Đào",
        icon: "🌸",
        shapeTitle: "Cánh Hoa Anh Đào Nghiêng",
        effectTitle: "Cơn lốc xoáy hồng magenta & Phấn hoa phát sáng",
        quote: "Gió thổi hoa rơi thì tạo thành cảnh phim anime lãng mạn, còn em liếc mắt một cái làm tôi vấp té cái oạch vào lưới tình, tới giờ vẫn chưa thèm đứng dậy. 🌸🎬",
        audio: "theme_sakura.mp3",
        coreGrad: [
            [0, "rgba(255, 240, 248, 0.95)"],
            [0.3, "rgba(244, 114, 182, 0.85)"],
            [0.7, "rgba(236, 72, 153, 0.75)"],
            [1, "rgba(219, 39, 119, 0.3)"]
        ],
        coreShadow: "rgba(236, 72, 153, 0.9)",
        facetColor: "rgba(251, 207, 232, 0.45)",
        textColor: "#fce7f3",
        textShadow: "rgba(236, 72, 153, 1)",
        burstColors: ["#f472b6", "#ec4899", "#fbcfe8", "#fda4af", "#ffffff"],
        shockwaveColor: "rgba(236, 72, 153,",
        butterflyColor: "#f472b6",
        particleColor: "#fbcfe8"
    },
    ocean: {
        name: "Đại Dương",
        icon: "💙",
        shapeTitle: "Giọt Nước Sapphire Sóng Cuộn",
        effectTitle: "Ánh xanh vệt nắng đáy biển & Bọt khí lung linh",
        quote: "Người ta học bơi để không bị chìm dưới nước, còn tôi ôm phao bơi mười năm vẫn tự nguyện nhảy tùm vào ánh mắt sâu thẳm không đáy của em. 🌊🏊",
        audio: "theme_ocean.mp3",
        coreGrad: [
            [0, "rgba(224, 242, 254, 0.95)"],
            [0.3, "rgba(56, 189, 248, 0.85)"],
            [0.7, "rgba(14, 165, 233, 0.75)"],
            [1, "rgba(2, 132, 199, 0.3)"]
        ],
        coreShadow: "rgba(56, 189, 248, 0.9)",
        facetColor: "rgba(186, 230, 253, 0.45)",
        textColor: "#e0f2fe",
        textShadow: "rgba(14, 165, 233, 1)",
        burstColors: ["#38bdf8", "#0ea5e9", "#7dd3fc", "#bae6fd", "#ffffff"],
        shockwaveColor: "rgba(56, 189, 248,",
        butterflyColor: "#7dd3fc",
        particleColor: "#38bdf8"
    },
    diamond: {
        name: "Bạch Kim",
        icon: "💎",
        shapeTitle: "Kim Cương Bát Diện Cắt Vát",
        effectTitle: "Tán sắc ánh sáng & Hào quang xà cừ ngọc trai",
        quote: "Các nhà khoa học bảo kim cương là thứ cứng nhất trên đời, nhưng chắc họ chưa thấy độ \"cứng đầu\" của em khi nhất quyết không chịu thừa nhận là thích tôi rồi! 💎💍",
        audio: "theme_diamond.mp3",
        coreGrad: [
            [0, "rgba(255, 255, 255, 1.0)"],
            [0.3, "rgba(224, 231, 255, 0.9)"],
            [0.7, "rgba(199, 210, 254, 0.8)"],
            [1, "rgba(165, 180, 252, 0.35)"]
        ],
        coreShadow: "rgba(224, 231, 255, 0.95)",
        facetColor: "rgba(241, 245, 249, 0.6)",
        textColor: "#ffffff",
        textShadow: "rgba(255, 255, 255, 1)",
        burstColors: ["#ffffff", "#e0e7ff", "#c7d2fe", "#fdf4ff", "#ffd700"],
        shockwaveColor: "rgba(255, 255, 255,",
        butterflyColor: "#ffffff",
        particleColor: "#e0e7ff"
    },
    rainbow: {
        name: "Cầu Vồng",
        icon: "🌈",
        shapeTitle: "Dải Ruy Băng Vô Cực 3D",
        effectTitle: "7 tầng quang phổ liên tục & Pháo hoa thu nhỏ",
        quote: "Người ta phải đợi mưa tạnh mới thấy cầu vồng, còn tôi chỉ cần em xuất hiện là cuộc đời đang đen trắng bỗng chuyển thẳng sang chế độ Full HD ngập tràn màu sắc. 🌈📺",
        audio: "theme_rainbow.mp3",
        coreGrad: [
            [0, "rgba(255, 255, 255, 0.98)"],
            [0.25, "rgba(244, 114, 182, 0.85)"],
            [0.5, "rgba(251, 191, 36, 0.85)"],
            [0.75, "rgba(56, 189, 248, 0.85)"],
            [1, "rgba(168, 85, 247, 0.35)"]
        ],
        coreShadow: "rgba(244, 114, 182, 0.9)",
        facetColor: "rgba(255, 228, 230, 0.55)",
        textColor: "#fff1f2",
        textShadow: "rgba(244, 114, 182, 1)",
        burstColors: ["#ff4081", "#ffd700", "#00e5ff", "#a78bfa", "#34d399", "#ffffff"],
        shockwaveColor: "rgba(255, 105, 180,",
        butterflyColor: "#f472b6",
        particleColor: "#ffd700"
    }
};

const themeKeys = ["pink", "galaxy", "gold", "aurora", "emerald", "sunset", "sakura", "ocean", "diamond", "rainbow"];
let currentThemeIdx = 0;
let curTheme = THEMES[themeKeys[currentThemeIdx]];

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeName = document.getElementById("themeName");

let storyAudio = null;
let currentStoryVoiceText = "";
let currentStoryAudioFile = "";

let isVoiceSpeaking = false;
let musicWasPlayingBeforeVoice = false;
let voiceResumeTimeout = null;

// Tắt nhạc nền ngay lập tức khi có bất kỳ giọng nói/lời kể nào phát ra
function pauseMusicForVoice() {
    clearTimeout(voiceResumeTimeout);
    if (isMusicPlaying) {
        musicWasPlayingBeforeVoice = true;
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
        }
        stopSynthMusic();
        isMusicPlaying = false;
        if (musicToggle) musicToggle.classList.remove("playing");
    }
}

// Bật lại nhạc nền sau khi lời kể đọc xong
function resumeMusicAfterVoice(delay = 600) {
    clearTimeout(voiceResumeTimeout);
    voiceResumeTimeout = setTimeout(() => {
        if (musicWasPlayingBeforeVoice && !isVoiceSpeaking && !isTourActive) {
            if (bgMusic && bgMusic.src) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    if (musicToggle) musicToggle.classList.add("playing");
                }).catch(() => {
                    startAudio();
                });
            } else {
                startAudio();
            }
        }
    }, delay);
}

function speakStoryVoice(text, audioFile = "") {
    if (!text && !audioFile) return;
    currentStoryVoiceText = text;
    currentStoryAudioFile = audioFile;

    // 1. Tắt nhạc nền ngay khi bắt đầu lời kể
    pauseMusicForVoice();

    // Dừng âm thanh giọng đọc trước đó nếu có
    if (storyAudio) {
        storyAudio.pause();
        storyAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    // 2. Phát file âm thanh MP3 phòng thu Tiếng Việt chuẩn 100%
    if (audioFile) {
        try {
            isVoiceSpeaking = true;
            storyAudio = new Audio(audioFile);
            storyAudio.volume = 1.0;

            storyAudio.onended = () => {
                isVoiceSpeaking = false;
                resumeMusicAfterVoice(600);
            };
            storyAudio.onpause = () => {
                isVoiceSpeaking = false;
                resumeMusicAfterVoice(600);
            };

            storyAudio.play().catch(e => {
                console.log("Audio playback notice:", e);
                isVoiceSpeaking = false;
                resumeMusicAfterVoice(300);
            });
            return;
        } catch (err) {
            console.log("Error loading audio file:", err);
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(300);
        }
    }

    // 3. Dự phòng WebSpeech nếu có voice Tiếng Việt
    if (text) {
        speakFallbackWebSpeech(text);
    }
}

function speakFallbackWebSpeech(text) {
    if (!text || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => (v.lang && (v.lang.startsWith("vi") || v.lang.includes("VN"))) || (v.name && (v.name.toLowerCase().includes("vietnam") || v.name.toLowerCase().includes("vietnamese"))));
    if (viVoice) {
        isVoiceSpeaking = true;
        const utt = new SpeechSynthesisUtterance(text);
        utt.voice = viVoice;
        utt.lang = 'vi-VN';
        utt.rate = 0.96;
        utt.pitch = 1.05;
        utt.onend = () => {
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(600);
        };
        utt.onerror = () => {
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(300);
        };
        window.speechSynthesis.speak(utt);
    }
}

function showToastCard(titleHtml, descHtml, duration = 9500, voiceText = "", audioFile = "") {
    if (!comboBadge) return;
    currentStoryVoiceText = voiceText || descHtml.replace(/<[^>]*>?/gm, '').replace(/["']/g, '');
    currentStoryAudioFile = audioFile;

    comboBadge.innerHTML = `
        <button class="combo-close-btn" id="closeStoryToastBtn" title="Đóng">&times;</button>
        <span class="combo-badge-title">${titleHtml}</span>
        <span class="combo-badge-quote">${descHtml}</span>
        ${audioFile ? `
        <div class="combo-badge-actions">
            <button class="combo-voice-btn" id="replayStoryVoiceBtn">🔊 Nghe Lời Kể</button>
        </div>` : ''}
    `;
    comboBadge.classList.add("active");

    const closeBtn = document.getElementById("closeStoryToastBtn");
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            comboBadge.classList.remove("active");
            if (storyAudio) storyAudio.pause();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }

    const voiceBtn = document.getElementById("replayStoryVoiceBtn");
    if (voiceBtn) {
        voiceBtn.onclick = (e) => {
            e.stopPropagation();
            speakStoryVoice(currentStoryVoiceText, currentStoryAudioFile);
        };
    }

    clearTimeout(toastBadgeTimeout);
    toastBadgeTimeout = setTimeout(() => {
        comboBadge.classList.remove("active");
    }, duration);

    if (audioFile) {
        speakStoryVoice(voiceText || descHtml, audioFile);
    }
}

function selectTheme(themeId) {
    const idx = themeKeys.indexOf(themeId);
    if (idx !== -1) {
        currentThemeIdx = idx;
    } else {
        currentThemeIdx = (currentThemeIdx + 1) % themeKeys.length;
    }
    curTheme = THEMES[themeKeys[currentThemeIdx]];
    if (themeIcon) themeIcon.textContent = curTheme.icon;
    if (themeName) themeName.textContent = curTheme.name;

    const mobThemeIcon = document.getElementById("mobThemeIcon");
    if (mobThemeIcon) mobThemeIcon.textContent = curTheme.icon;

    document.querySelectorAll("#themeChips .hub-chip").forEach(chip => {
        if (chip.getAttribute("data-theme") === themeKeys[currentThemeIdx]) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    closeControlHub();
    const center = getHeartCenter();
    createBurst(center.x, center.y, 45);
    showToastCard(
        `${curTheme.icon} ${curTheme.name} • ${curTheme.shapeTitle}`,
        `"${curTheme.quote}"`,
        9500,
        curTheme.quote,
        curTheme.audio
    );
}

if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        selectTheme();
    });
}

document.querySelectorAll(".hub-chip[data-theme]").forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const tId = chip.getAttribute("data-theme");
        selectTheme(tId);
    });
});

// ==========================================
// 3. BỨC THƯ TÌNH BÍ MẬT (Love Letter Typewriter)
// ==========================================
const letterBtn = document.getElementById("letterBtn");
const letterModal = document.getElementById("letterModal");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const typewriterText = document.getElementById("typewriterText");

const LOVE_LETTER_CONTENT = `Gửi người đặc biệt nhất... ✨

Giữa hơn 8 tỷ người trên trái đất và muôn ngàn vì sao trong vũ trụ bao la, gặp được em là điều kỳ diệu và may mắn nhất của tôi.

Cảm ơn em vì đã đến, mang theo nụ cười rạng rỡ và sưởi ấm thế giới này. Chúc em mỗi ngày đều tràn ngập niềm vui, tiếng cười và luôn luôn hạnh phúc nhé! ❤️`;

let typewriterInterval = null;
let letterAudio = new Audio("love_letter.mp3");

function openLoveLetter() {
    if (!letterModal) return;
    letterModal.classList.add("open");

    // Tắt nhạc nền khi mở thư tình có lời kể
    pauseMusicForVoice();
    isVoiceSpeaking = true;

    try {
        letterAudio.currentTime = 0;
        letterAudio.volume = 1.0;
        letterAudio.onended = () => {
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(600);
        };
        letterAudio.play().catch(() => { });
    } catch (e) { }

    const letterContent = customLoveLetter || `Gửi ${recipientName}, người đặc biệt nhất... ✨

Giữa hơn 8 tỷ người trên trái đất và muôn ngàn vì sao trong vũ trụ bao la, gặp được em là điều kỳ diệu và may mắn nhất của ${senderName}.

Cảm ơn em vì đã đến, mang theo nụ cười rạng rỡ và sưởi ấm thế giới này. Chúc em mỗi ngày đều tràn ngập niềm vui, tiếng cười và luôn luôn hạnh phúc nhé! ❤️`;

    if (typewriterText) {
        typewriterText.textContent = "";
        let charIndex = 0;
        clearInterval(typewriterInterval);
        typewriterInterval = setInterval(() => {
            if (charIndex < letterContent.length) {
                typewriterText.textContent += letterContent[charIndex];
                charIndex++;
            } else {
                clearInterval(typewriterInterval);
            }
        }, 32);
    }
}

function closeLoveLetter() {
    if (!letterModal) return;
    letterModal.classList.remove("open");
    clearInterval(typewriterInterval);
    if (letterAudio) {
        letterAudio.pause();
        letterAudio.currentTime = 0;
    }
    isVoiceSpeaking = false;
    resumeMusicAfterVoice(400);
}

if (letterBtn) letterBtn.addEventListener("click", (e) => { e.stopPropagation(); openLoveLetter(); });
if (closeLetterBtn) closeLetterBtn.addEventListener("click", (e) => { e.stopPropagation(); closeLoveLetter(); });
if (letterModal) {
    letterModal.addEventListener("click", (e) => {
        if (e.target === letterModal) closeLoveLetter();
    });
}
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLoveLetter();
        closeAuthorModal();
    }
});

// ==========================================
// 3.1 THÔNG TIN TÁC GIẢ (Author Profile Modal)
// ==========================================
const authorBtn = document.getElementById("authorBtn");
const authorModal = document.getElementById("authorModal");
const closeAuthorBtn = document.getElementById("closeAuthorBtn");

function openAuthorModal() {
    if (!authorModal) return;
    authorModal.classList.add("open");
    if (audioCtx) {
        playChimeNote(659.25, 0, 0.8);
        playChimeNote(880.00, 0.12, 1.2);
    }
}

function closeAuthorModal() {
    if (!authorModal) return;
    authorModal.classList.remove("open");
}

if (authorBtn) authorBtn.addEventListener("click", (e) => { e.stopPropagation(); openAuthorModal(); });
if (closeAuthorBtn) closeAuthorBtn.addEventListener("click", (e) => { e.stopPropagation(); closeAuthorModal(); });
if (authorModal) {
    authorModal.addEventListener("click", (e) => {
        if (e.target === authorModal) closeAuthorModal();
    });
}

// ==========================================
// 3.5 BÉ MÈO TÌNH YÊU TƯƠNG TÁC (Cute Interactive Cat Companion)
// ==========================================
const catCompanion = document.getElementById("catCompanion");
const catBubble = document.getElementById("catBubble");

const CAT_LOVE_QUOTES = [
    "Meow~ Yêu em nhiều nhắm! 🐾❤️",
    "Purrr... Hôm nay em cười xinh lắm á! ✨🐱",
    "Meow~ Gửi ngàn cái ôm ấm áp nè! 🐾💖",
    "Em là điều ngọt ngào nhất thế gian! 🌸",
    "Cho bé mèo xin một cái ôm nha! 🥺🐾",
    "Meow~ Đừng thức khuya nha công chúa! 🌙💤",
    "Mãi mãi bên nhau hạnh phúc nhé! 💍❤️",
    "Meow meow~ Trái tim này thuộc về em! 💘",
    "Purrr... Em là cả vũ trụ của tôi! 🌌🐾"
];

let catBubbleTimeout = null;

function playMeowSound() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Âm thanh mèo kêu 'Meoow' ngọt ngào với đường cong tần số
        osc.type = "sine";
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.42);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.42);

        // Hòa âm tiếng chuông nhỏ leng keng
        playChimeNote(1318.51, 0.06, 0.5);
    } catch (e) { }
}

function triggerCatInteraction(e) {
    if (e) e.stopPropagation();
    handleFirstInteraction();
    playMeowSound();

    if (catCompanion) {
        catCompanion.classList.remove("jump");
        void catCompanion.offsetWidth; // Reflow
        catCompanion.classList.add("jump");

        // Bắn tim nhỏ quanh bé mèo
        const rect = catCompanion.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }

    if (catBubble) {
        const randomQuote = CAT_LOVE_QUOTES[Math.floor(Math.random() * CAT_LOVE_QUOTES.length)];
        catBubble.textContent = randomQuote;
        catBubble.classList.add("active");
        clearTimeout(catBubbleTimeout);
        catBubbleTimeout = setTimeout(() => {
            catBubble.classList.remove("active");
        }, 3600);
    }
}

if (catCompanion) {
    catCompanion.addEventListener("click", triggerCatInteraction);
    catCompanion.addEventListener("touchstart", (e) => {
        triggerCatInteraction(e);
    }, { passive: true });
}

// Bé mèo tự động hiện lời nhắn chào đón đáng yêu
setTimeout(() => {
    if (catBubble) {
        catBubble.classList.add("active");
        setTimeout(() => catBubble.classList.remove("active"), 4000);
    }
}, 2200);

setInterval(() => {
    if (catBubble && !catBubble.classList.contains("active") && Math.random() > 0.45) {
        const randomQuote = CAT_LOVE_QUOTES[Math.floor(Math.random() * CAT_LOVE_QUOTES.length)];
        catBubble.textContent = randomQuote;
        catBubble.classList.add("active");
        setTimeout(() => catBubble.classList.remove("active"), 3600);
    }
}, 13000);

// ==========================================
// 4. HỆ THỐNG ÂM NHẠC: VŨ. vs SƠN TÙNG M-TP
// ==========================================
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicFileInput = document.getElementById("musicFileInput");
const startHintBanner = document.getElementById("startHintBanner");
const musicGenreToggle = document.getElementById("musicGenreToggle");
const genreIcon = document.getElementById("genreIcon");
const genreName = document.getElementById("genreName");

const MUSIC_GENRES = [
    {
        id: "vu",
        name: "Vũ.",
        icon: "🎸",
        title: "Dòng Nhạc Vũ. (Indie Acoustic)",
        songs: {
            "la-lung": {
                title: "Lạ Lùng",
                artist: "Vũ.",
                chords: [
                    [293.66, 369.99, 440.00], // D (D4, F#4, A4)
                    [440.00, 554.37, 659.25], // A
                    [493.88, 587.33, 739.99], // Bm
                    [369.99, 440.00, 554.37], // F#m
                    [392.00, 493.88, 587.33], // G
                    [293.66, 369.99, 440.00], // D
                    [392.00, 493.88, 587.33], // G
                    [440.00, 554.37, 659.25]  // A
                ],
                tempo: 1200,
                oscType: "sine"
            },
            "buoc-qua-nhau": {
                title: "Bước Qua Nhau",
                artist: "Vũ.",
                chords: [
                    [392.00, 493.88, 587.33], // G
                    [369.99, 440.00, 554.37], // F#m
                    [329.63, 392.00, 493.88], // Em
                    [493.88, 587.33, 739.99], // Bm
                    [261.63, 329.63, 392.00], // C
                    [392.00, 493.88, 587.33], // G
                    [440.00, 523.25, 659.25], // Am
                    [293.66, 369.99, 440.00]  // D
                ],
                tempo: 1150,
                oscType: "triangle"
            },
            "dong-kiem-em": {
                title: "Đông Kiếm Em",
                artist: "Vũ.",
                chords: [
                    [261.63, 329.63, 392.00], // C
                    [493.88, 587.33, 739.99], // Bm
                    [440.00, 523.25, 659.25], // Am
                    [329.63, 392.00, 493.88], // Em
                    [349.23, 440.00, 523.25], // F
                    [261.63, 329.63, 392.00], // C
                    [293.66, 349.23, 440.00], // Dm
                    [392.00, 493.88, 587.33]  // G
                ],
                tempo: 1100,
                oscType: "sine"
            },
            "loi-yeu-em": {
                title: "Lời Yêu Em",
                artist: "Vũ.",
                chords: [
                    [440.00, 554.37, 659.25], // A
                    [329.63, 415.30, 493.88], // E
                    [369.99, 440.00, 554.37], // F#m
                    [277.18, 329.63, 415.30], // C#m
                    [293.66, 369.99, 440.00], // D
                    [440.00, 554.37, 659.25], // A
                    [493.88, 587.33, 739.99], // Bm
                    [329.63, 415.30, 493.88]  // E
                ],
                tempo: 1250,
                oscType: "sine"
            }
        }
    },
    {
        id: "mtp",
        name: "M-TP",
        icon: "🔥",
        title: "Dòng Nhạc Sơn Tùng M-TP (Pop R&B)",
        songs: {
            "noi-nay-co-anh": {
                title: "Nơi Này Có Anh",
                artist: "Sơn Tùng M-TP",
                chords: [
                    [523.25, 659.25, 783.99], // C (C5, E5, G5)
                    [392.00, 493.88, 587.33], // G
                    [440.00, 523.25, 659.25], // Am
                    [329.63, 392.00, 493.88], // Em
                    [349.23, 440.00, 523.25], // F
                    [523.25, 659.25, 783.99], // C
                    [349.23, 440.00, 523.25], // F
                    [392.00, 493.88, 587.33]  // G
                ],
                tempo: 820,
                oscType: "triangle"
            },
            "co-chac-yeu-la-day": {
                title: "Có Chắc Yêu Là Đây",
                artist: "Sơn Tùng M-TP",
                chords: [
                    [349.23, 440.00, 523.25], // F
                    [392.00, 493.88, 587.33], // G
                    [329.63, 392.00, 493.88], // Em
                    [440.00, 523.25, 659.25], // Am
                    [293.66, 349.23, 440.00], // Dm
                    [392.00, 493.88, 587.33], // G
                    [261.63, 329.63, 392.00], // C
                    [523.25, 659.25, 783.99]  // C
                ],
                tempo: 780,
                oscType: "sine"
            },
            "muon-roi-ma-sao-con": {
                title: "Muộn Rồi Mà Sao Còn",
                artist: "Sơn Tùng M-TP",
                chords: [
                    [415.30, 523.25, 622.25], // Ab
                    [466.16, 587.33, 698.46], // Bb
                    [392.00, 466.16, 587.33], // Gm
                    [523.25, 622.25, 783.99], // Cm
                    [349.23, 415.30, 523.25], // Fm
                    [466.16, 587.33, 698.46], // Bb
                    [311.13, 392.00, 466.16], // Eb
                    [415.30, 523.25, 622.25]  // Ab
                ],
                tempo: 820,
                oscType: "triangle"
            },
            "am-tham-ben-em": {
                title: "Âm Thầm Bên Em",
                artist: "Sơn Tùng M-TP",
                chords: [
                    [261.63, 329.63, 392.00], // C
                    [493.88, 587.33, 739.99], // Bm
                    [440.00, 523.25, 659.25], // Am
                    [329.63, 392.00, 493.88], // Em
                    [349.23, 440.00, 523.25], // F
                    [261.63, 329.63, 392.00], // C
                    [293.66, 349.23, 440.00], // Dm
                    [392.00, 493.88, 587.33]  // G
                ],
                tempo: 980,
                oscType: "sine"
            }
        }
    }
];

let currentGenreIdx = 0;
let curGenre = MUSIC_GENRES[currentGenreIdx];
let currentSongKey = "la-lung";
let currentSongData = curGenre.songs[currentSongKey];

const musicModal = document.getElementById("musicModal");
const closeMusicBtn = document.getElementById("closeMusicBtn");
const openPlaylistBtn = document.getElementById("openPlaylistBtn");
const tabVu = document.getElementById("tabVu");
const tabMtp = document.getElementById("tabMtp");
const listVu = document.getElementById("listVu");
const listMtp = document.getElementById("listMtp");
const uploadMusicBtn = document.getElementById("uploadMusicBtn");

function openMusicModal() {
    if (!musicModal) return;
    musicModal.classList.add("open");
}

function closeMusicModal() {
    if (!musicModal) return;
    musicModal.classList.remove("open");
}

if (openPlaylistBtn) openPlaylistBtn.addEventListener("click", (e) => { e.stopPropagation(); openMusicModal(); });
if (closeMusicBtn) closeMusicBtn.addEventListener("click", (e) => { e.stopPropagation(); closeMusicModal(); });
if (musicModal) {
    musicModal.addEventListener("click", (e) => {
        if (e.target === musicModal) closeMusicModal();
    });
}
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMusicModal();
});

// Danh sách kho nhạc bản gốc có lời phong phú để tự động random liên tục
const MASTER_PLAYLIST = [
    { title: "Hãy Trao Cho Anh", artist: "Sơn Tùng M-TP ft. Snoop Dogg", file: "mtp_haytraochoanh.mp3", genre: "mtp" },
    { title: "Lạ Lùng", artist: "Vũ.", file: "vu_lalung.mp3", genre: "vu" },
    { title: "Bước Qua Nhau", artist: "Vũ.", file: "vu_buocquanhau.mp3", genre: "vu" },
    { title: "Cơn Mưa Ngang Qua", artist: "Sơn Tùng M-TP", file: "mtp_conmuangangqua.mp3", genre: "mtp" },
    { title: "Cơn Mưa Xa Dần", artist: "Sơn Tùng M-TP", file: "mtp_conmuaxadan.mp3", genre: "mtp" },
    { title: "Thanh Xuân", artist: "Da LAB", file: "vpop_thanhxuan.mp3", genre: "vu" }
];
let currentSongIndex = -1;

// Hàm phát bài hát ngẫu nhiên liên tục
function playRandomSong(notify = true) {
    let nextIndex;
    if (MASTER_PLAYLIST.length <= 1) {
        nextIndex = 0;
    } else {
        do {
            nextIndex = Math.floor(Math.random() * MASTER_PLAYLIST.length);
        } while (nextIndex === currentSongIndex);
    }
    currentSongIndex = nextIndex;
    const song = MASTER_PLAYLIST[currentSongIndex];

    // Cập nhật tab & biểu tượng dòng nhạc tương ứng
    if (song.genre === "mtp") {
        if (genreIcon) genreIcon.textContent = "🔥";
        if (genreName) genreName.textContent = "M-TP";
    } else {
        if (genreIcon) genreIcon.textContent = "🎸";
        if (genreName) genreName.textContent = "Vũ.";
    }

    if (bgMusic) {
        stopSynthMusic();
        bgMusic.src = song.file;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            usingSynthMusic = false;
            if (musicToggle) musicToggle.classList.add("playing");
        }).catch(() => {
            stopSynthMusic();
            noteStep = 0;
            startSynthMusic();
        });
    }

    if (notify) {
        showToastCard(
            `🎶 Tự Động Phát: ${song.title}`,
            `Ca sĩ: ${song.artist} 🎙️ (Bản Gốc Có Lời) • Tự đổi ngẫu nhiên liên tục ✨`,
            4800
        );
    }
}

// Hàm phát bài hát có giọng ca sĩ thật và hiển thị thông báo
function playVocalSong(songFile, songTitle, artistName) {
    if (bgMusic) {
        stopSynthMusic();
        bgMusic.src = songFile;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            usingSynthMusic = false;
            if (musicToggle) musicToggle.classList.add("playing");
        }).catch(() => {
            stopSynthMusic();
            noteStep = 0;
            startSynthMusic();
        });
    }

    showToastCard(`🎶 Đang phát: ${songTitle}`, `Ca sĩ: ${artistName} 🎙️ (Bản Gốc Có Lời) ✨`, 4200);
}

// Tự động chuyển bài ngẫu nhiên liên tục khi hết bài hoặc gặp lỗi
if (bgMusic) {
    bgMusic.addEventListener("ended", () => {
        playRandomSong(true);
    });
    bgMusic.addEventListener("error", () => {
        setTimeout(() => playRandomSong(false), 1200);
    });
}

// Chuyển Tab Vũ vs MTP
function switchGenreTab(genreId, autoPlay = true) {
    currentGenreIdx = MUSIC_GENRES.findIndex(g => g.id === genreId);
    if (currentGenreIdx === -1) currentGenreIdx = 0;
    curGenre = MUSIC_GENRES[currentGenreIdx];

    if (genreIcon) genreIcon.textContent = curGenre.icon;
    if (genreName) genreName.textContent = curGenre.name;

    document.querySelectorAll("#genreChips .hub-chip").forEach(chip => {
        if (chip.getAttribute("data-genre") === curGenre.id) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    if (genreId === "vu") {
        if (tabVu) tabVu.classList.add("active");
        if (tabMtp) tabMtp.classList.remove("active");
        if (listVu) listVu.classList.add("active");
        if (listMtp) listMtp.classList.remove("active");
    } else {
        if (tabVu) tabVu.classList.remove("active");
        if (tabMtp) tabMtp.classList.add("active");
        if (listVu) listVu.classList.remove("active");
        if (listMtp) listMtp.classList.add("active");
    }

    if (autoPlay) {
        const filteredSongs = MASTER_PLAYLIST.filter(s => s.genre === genreId);
        if (filteredSongs.length > 0) {
            const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
            currentSongIndex = MASTER_PLAYLIST.indexOf(randomSong);
            playVocalSong(randomSong.file, randomSong.title, randomSong.artist);
        } else {
            playRandomSong(true);
        }
    }
}

if (tabVu) tabVu.addEventListener("click", (e) => { e.stopPropagation(); switchGenreTab("vu", true); });
if (tabMtp) tabMtp.addEventListener("click", (e) => { e.stopPropagation(); switchGenreTab("mtp", true); });

function selectGenre(genreId) {
    switchGenreTab(genreId, true);
    closeControlHub();
    const genreAudio = genreId === "vu" ? "genre_vu.mp3" : "genre_mtp.mp3";
    const genreVoice = genreId === "vu"
        ? "Đã chuyển sang dòng nhạc Acoustic của Hoàng tử Indie Vũ. Những giai điệu êm đềm chạm đến trái tim!"
        : "Đã chuyển sang dòng nhạc của Sơn Tùng M-TP. Những giai điệu tình yêu sôi động và rực cháy!";
    showToastCard(`${curGenre.icon} ${curGenre.name}`, `"${genreVoice}"`, 8000, genreVoice, genreAudio);
}

// Khi bấm vào nút Dòng nhạc trên thanh công cụ -> Đổi trực tiếp giữa Vũ. và Sơn Tùng M-TP
if (musicGenreToggle) {
    musicGenreToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const nextGenre = curGenre.id === "vu" ? "mtp" : "vu";
        selectGenre(nextGenre);
    });
}

document.querySelectorAll(".hub-chip[data-genre]").forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const gId = chip.getAttribute("data-genre");
        selectGenre(gId);
    });
});

// Bấm chọn bài hát cụ thể trong danh sách
document.querySelectorAll(".song-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();
        const parentList = item.closest(".song-list");
        if (parentList) {
            parentList.querySelectorAll(".song-item").forEach(si => si.classList.remove("active"));
        }
        item.classList.add("active");

        const songKey = item.getAttribute("data-song");
        const songFile = item.getAttribute("data-file");
        currentSongKey = songKey;

        // Xác định ca khúc và dòng nhạc
        if (curGenre.songs && curGenre.songs[songKey]) {
            currentSongData = curGenre.songs[songKey];
        } else {
            for (let g of MUSIC_GENRES) {
                if (g.songs && g.songs[songKey]) {
                    curGenre = g;
                    currentSongData = g.songs[songKey];
                    break;
                }
            }
        }

        const title = currentSongData ? currentSongData.title : (curGenre.id === "mtp" ? "Hãy Trao Cho Anh" : "Lạ Lùng");
        const artist = currentSongData ? currentSongData.artist : (curGenre.id === "mtp" ? "Sơn Tùng M-TP" : "Vũ.");
        const actualFile = songFile || (curGenre.id === "mtp" ? "mtp_haytraochoanh.mp3" : "vu_lalung.mp3");

        // Tìm index trong MASTER_PLAYLIST
        const matchIdx = MASTER_PLAYLIST.findIndex(s => s.file === actualFile);
        if (matchIdx !== -1) currentSongIndex = matchIdx;

        playVocalSong(actualFile, title, artist);
        closeMusicModal();
    });
});

// Nút Tải file MP3 tùy chọn
if (uploadMusicBtn && musicFileInput) {
    uploadMusicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        musicFileInput.click();
    });
}

if (musicFileInput) {
    musicFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && bgMusic) {
            const url = URL.createObjectURL(file);
            stopSynthMusic();
            bgMusic.src = url;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                usingSynthMusic = false;
                if (musicToggle) musicToggle.classList.add("playing");
                closeMusicModal();
                showToastBadge(`🎶 Đang phát file: ${file.name.slice(0, 25)}... ✨`, 3000);
            }).catch(() => { });
        }
    });
}

let isMusicPlaying = false;
let userInteractionCount = 0;
let usingSynthMusic = false;
let noteStep = 0;

let audioCtx = null;
let synthInterval = null;

function playChimeNote(freq, delay = 0, duration = 1.2, type = "sine") {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) { }
}

function startSynthMusic() {
    if (synthInterval) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    usingSynthMusic = true;
    isMusicPlaying = true;
    if (musicToggle) musicToggle.classList.add("playing");

    function playChordStep() {
        if (!isMusicPlaying || !usingSynthMusic) return;
        const songData = currentSongData || (curGenre.songs && curGenre.songs[currentSongKey]) || (curGenre.songs && curGenre.songs["la-lung"]);
        if (!songData) return;
        const chords = songData.chords;
        const chord = chords[noteStep % chords.length];
        const oscType = songData.oscType || "sine";
        playChimeNote(chord[0], 0, 1.4, oscType);
        playChimeNote(chord[1], 0.16, 1.2, oscType);
        playChimeNote(chord[2], 0.32, 1.2, oscType);
        noteStep++;
    }
    playChordStep();
    const songData = currentSongData || (curGenre.songs && curGenre.songs[currentSongKey]) || (curGenre.songs && curGenre.songs["la-lung"]);
    synthInterval = setInterval(playChordStep, (songData && songData.tempo) || 1100);
}

function stopSynthMusic() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
    usingSynthMusic = false;
}

function startAudio() {
    if (isMusicPlaying) return;
    playRandomSong(true);
}

function toggleMusic() {
    if (isMusicPlaying) {
        if (bgMusic && !bgMusic.paused) bgMusic.pause();
        stopSynthMusic();
        isMusicPlaying = false;
        if (musicToggle) musicToggle.classList.remove("playing");
    } else {
        startAudio();
    }
}

function handleFirstInteraction() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    userInteractionCount++;
    if (startHintBanner) {
        startHintBanner.classList.add("hidden");
    }
    // Chỉ tự phát nhạc nếu không ở trong chế độ xem hướng dẫn
    if (!isTourActive && !isMusicPlaying) {
        startAudio();
    }
}

if (startHintBanner) {
    startHintBanner.addEventListener("click", (e) => {
        e.stopPropagation();
        handleFirstInteraction();
        triggerHeartbeat();
    });
}

window.addEventListener("click", handleFirstInteraction, { once: true });
window.addEventListener("touchstart", handleFirstInteraction, { once: true });
window.addEventListener("pointerdown", handleFirstInteraction, { once: true });

if (musicToggle) {
    musicToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMusic();
    });
}

if (musicFileInput) {
    musicFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && bgMusic) {
            const fileUrl = URL.createObjectURL(file);
            bgMusic.src = fileUrl;
            stopSynthMusic();
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicToggle) musicToggle.classList.add("playing");
            });
        }
    });
}

// ==========================================
// 5. 3D PARALLAX & MOUSE SETUP
// ==========================================
const bgLayer = document.getElementById("bgLayer");
let targetTiltX = 0, targetTiltY = 0;
let curTiltX = 0, curTiltY = 0;

// Bụi Tiên Đa Sắc Khi Rê Chuột (Magical Rainbow Cursor Dust)
const trailParticles = [];
const TRAIL_PALETTES = [
    "#ff69b4", "#ffd700", "#00f2fe", "#a78bfa", "#ff80ab", "#ffffff", "#f43f5e", "#38bdf8", "#ec4899", "#facc15"
];

function addMouseTrailParticle(x, y) {
    for (let k = 0; k < 2; k++) {
        const color = TRAIL_PALETTES[Math.floor(Math.random() * TRAIL_PALETTES.length)];
        const shapeType = Math.random() > 0.45 ? (Math.random() > 0.5 ? "star" : "heart") : "sparkle";
        trailParticles.push({
            x: x + (Math.random() - 0.5) * 12,
            y: y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6 - 0.6,
            size: Math.random() * 5 + 3,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
            alpha: 1.0,
            fadeSpeed: Math.random() * 0.025 + 0.02,
            color: color,
            shapeType: shapeType
        });
    }
    if (trailParticles.length > 35) trailParticles.splice(0, trailParticles.length - 35);
}

function triggerHaptic(pattern = 25) {
    if ("vibrate" in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) { }
    }
}

window.addEventListener("mousemove", (e) => {
    targetTiltX = (e.clientX - width / 2) / (width / 2);
    targetTiltY = (e.clientY - height / 2) / (height / 2);
    addMouseTrailParticle(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0) {
        targetTiltX = (e.touches[0].clientX - width / 2) / (width / 2);
        targetTiltY = (e.touches[0].clientY - height / 2) / (height / 2);
        addMouseTrailParticle(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// Cảm biến nghiêng điện thoại (Gyroscope 3D Parallax trên Mobile)
window.addEventListener("deviceorientation", (e) => {
    if (e.gamma !== null && e.beta !== null) {
        targetTiltX = Math.max(-1, Math.min(1, e.gamma / 28));
        targetTiltY = Math.max(-1, Math.min(1, (e.beta - 40) / 28));
    }
}, { passive: true });

let currentScale = 1.0;
let targetScale = 1.0;

function getHeartCenter() {
    return { x: width * 0.5, y: height * 0.46 };
}

window.addEventListener("wheel", (e) => {
    targetScale -= e.deltaY * 0.0015;
    targetScale = Math.max(0.4, Math.min(targetScale, 3.0));
}, { passive: true });

let initialPinchDistance = null;
window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
    }
}, { passive: true });

window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && initialPinchDistance) {
        const currentDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
        targetScale *= (currentDistance / initialPinchDistance);
        targetScale = Math.max(0.35, Math.min(targetScale, 3.0));
        initialPinchDistance = currentDistance;
    }
}, { passive: true });
window.addEventListener("touchend", () => { initialPinchDistance = null; });

function getHeartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

function getTangentAngle(t) {
    const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
    const dy = 13 * Math.sin(t) - 10 * Math.sin(2 * t) - 6 * Math.sin(3 * t) - 4 * Math.sin(4 * t);
    return Math.atan2(dy, dx);
}

// Bảng tọa độ mẫu tối ưu sẵn cho mini heart
const MINI_HEART_PATH = [];
for (let t = 0; t <= Math.PI * 2; t += 0.15) {
    MINI_HEART_PATH.push(getHeartPoint(t));
}

function drawMiniHeart(ctx, x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    ctx.beginPath();
    const s = size / 16;
    ctx.moveTo(0, 0);
    for (let i = 0; i < MINI_HEART_PATH.length; i++) {
        const p = MINI_HEART_PATH[i];
        ctx.lineTo(p.x * s, p.y * s);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// ==========================================
// 6. HIỆU ỨNG THIÊN NHIÊN ĐẶC BIỆT THEO TỪNG NỀN
// ==========================================

// 6.1 MƯA SAO BĂNG (Shooting Stars - Êm dịu & Thanh lịch)
const shootingStars = [];
function spawnShootingStar(customX, customY, isGalaxyMode = false) {
    const startX = customX !== undefined ? customX : Math.random() * (width * 1.15) - width * 0.05;
    const startY = customY !== undefined ? customY : Math.random() * (height * 0.35) - 30;
    const isBig = isGalaxyMode && Math.random() > 0.7;
    const starColors = isGalaxyMode ? ["#ffffff", "#b388ff", "#80d8ff", "#ffd54f", "#f472b6"] : ["#ffffff", curTheme.textColor];
    shootingStars.push({
        x: startX,
        y: startY,
        len: isBig ? Math.random() * 150 + 130 : Math.random() * 110 + 100,
        speed: isBig ? Math.random() * 15 + 14 : Math.random() * 13 + 12,
        width: isBig ? Math.random() * 2.5 + 2.0 : Math.random() * 1.8 + 1.2,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.18,
        alpha: 1.0,
        fadeSpeed: isBig ? Math.random() * 0.012 + 0.01 : Math.random() * 0.015 + 0.012,
        color: starColors[Math.floor(Math.random() * starColors.length)]
    });
}

// Nhịp độ sao băng êm ái, thanh thoát
setInterval(() => {
    const isGalaxy = curBgMode && curBgMode.isGalaxyBg;
    if (isGalaxy) {
        // Nền Thiên Hà: 1 vệt sao băng thanh thoát mỗi ~950ms, thỉnh thoảng thêm vệt thứ 2
        spawnShootingStar(undefined, undefined, true);
        if (Math.random() > 0.65) {
            setTimeout(() => spawnShootingStar(undefined, undefined, true), 320);
        }
    } else {
        // Nền Khác: Thỉnh thoảng có 1 vệt sao băng lướt nhẹ
        if (Math.random() > 0.45) {
            spawnShootingStar();
        }
    }
}, 950);

// 6.2 CÁNH HOA ANH ĐÀO RƠI (Sakura Blossom Petals - Dành cho Nền Nghệ Thuật)
const sakuraPetals = [];
for (let i = 0; i < 28; i++) {
    sakuraPetals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 1.1 + 0.5,
        vy: Math.random() * 1.3 + 0.8,
        size: Math.random() * 8 + 6,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        vFlip: Math.random() * 0.04 + 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        color: ["rgba(255, 182, 193, 0.9)", "rgba(255, 192, 203, 0.85)", "rgba(255, 218, 224, 0.95)", "rgba(255, 105, 180, 0.75)"][Math.floor(Math.random() * 4)]
    });
}

function drawFallingSakura(ctx, now, alpha) {
    if (alpha < 0.01) return;
    ctx.save();
    for (let p of sakuraPetals) {
        p.y += p.vy;
        p.x += Math.sin(now * 0.002 + p.swayPhase) * 1.2 + p.vx * 0.35;
        p.rot += p.vRot;
        p.flip += p.vFlip;

        if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
        if (p.x > width + 20) p.x = -20;

        const scaleX = Math.cos(p.flip);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = alpha * 0.9;

        // Vẽ cánh hoa đào 3D mềm mại
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.7, p.size * 0.6, 0, p.size * 0.8);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.4, 0, -p.size * 0.6);
        ctx.fill();

        ctx.restore();
    }
    ctx.restore();
}

// 6.3 KIM TUYẾN LẤP LÁNH (Sparkling Glitter & Diamond Confetti - Dành cho Nền Chuẩn & Thuần Khiết)
const glitterParticles = [];
for (let i = 0; i < 30; i++) {
    glitterParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 0.9 + 0.6,
        size: Math.random() * 4.5 + 2.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.06 + 0.03,
        color: ["#ffd700", "#ffffff", "#ffe4e1", "#ffb6c1", "#e0e7ff", "#fff3b0"][Math.floor(Math.random() * 6)],
        shapeType: Math.random() > 0.45 ? "star" : "diamond"
    });
}

function drawFallingGlitter(ctx, now, alpha) {
    if (alpha < 0.01) return;
    ctx.save();
    for (let g of glitterParticles) {
        g.y += g.vy;
        g.x += g.vx + Math.sin(now * 0.0015 + g.twinklePhase) * 0.6;
        g.rot += g.vRot;

        if (g.y > height + 20) { g.y = -20; g.x = Math.random() * width; }
        if (g.x < -20) g.x = width + 20;
        if (g.x > width + 20) g.x = -20;

        const twinkle = Math.sin(now * g.twinkleSpeed + g.twinklePhase) * 0.5 + 0.5;
        const gAlpha = alpha * Math.max(0.15, twinkle);
        const s = g.size * (0.6 + twinkle * 0.6);

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rot);
        ctx.globalAlpha = gAlpha;
        ctx.fillStyle = g.color;

        if (g.shapeType === "star") {
            ctx.beginPath();
            ctx.moveTo(0, -s * 1.5);
            ctx.quadraticCurveTo(0, 0, s * 1.5, 0);
            ctx.quadraticCurveTo(0, 0, 0, s * 1.5);
            ctx.quadraticCurveTo(0, 0, -s * 1.5, 0);
            ctx.quadraticCurveTo(0, 0, 0, -s * 1.5);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.7, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.7, 0);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    ctx.restore();
}

// ==========================================
// 6.4. HỆ THỐNG BẮN PHÁO HOA TRÁI TIM (Heart Fireworks Engine)
// ==========================================
const fireworksRockets = [];
const fireworksParticles = [];

function launchHeartFireworks(burstX, burstY, colors = null) {
    if (!burstX || !burstY) {
        burstX = width * 0.2 + Math.random() * width * 0.6;
        burstY = height * 0.18 + Math.random() * height * 0.35;
    }
    const startX = width * 0.3 + Math.random() * width * 0.4;
    const startY = height + 10;

    fireworksRockets.push({
        x: startX,
        y: startY,
        targetX: burstX,
        targetY: burstY,
        vx: (burstX - startX) / 38,
        vy: (burstY - startY) / 38,
        color: colors ? colors[0] : "#ffd700",
        trail: [],
        colors: colors || ["#ff4081", "#ffd700", "#ff79b0", "#00f2fe", "#ffffff", "#ea80fc", "#fb923c"]
    });

    if (audioCtx) {
        try {
            playChimeNote(523.25, 0, 0.3, "triangle");
            playChimeNote(659.25, 0.08, 0.4, "triangle");
        } catch (e) { }
    }
}

function explodeHeartRocket(rx, ry, colors) {
    if (audioCtx) {
        try {
            playChimeNote(783.99, 0, 0.6, "sine");
            playChimeNote(1046.50, 0.06, 0.8, "triangle");
        } catch (e) { }
    }
    addShockwave(rx, ry, "rgba(255, 215, 0,");

    const particleCount = 75;
    const scale = Math.random() * 5 + 6.5;

    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const hp = getHeartPoint(t);
        const speedMult = Math.random() * 0.35 + 0.85;
        const color = colors[Math.floor(Math.random() * colors.length)];

        fireworksParticles.push({
            x: rx,
            y: ry,
            vx: hp.x * 0.12 * scale * speedMult + (Math.random() - 0.5) * 0.8,
            vy: hp.y * 0.12 * scale * speedMult + (Math.random() - 0.5) * 0.8,
            friction: 0.955,
            gravity: 0.045,
            size: Math.random() * 3.5 + 2.5,
            alpha: 1.0,
            fadeSpeed: Math.random() * 0.012 + 0.012,
            color: color,
            isHeart: Math.random() > 0.55,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.1
        });
    }
}

function updateAndDrawFireworks(ctx) {
    // 1. Cập nhật Rockets
    for (let i = fireworksRockets.length - 1; i >= 0; i--) {
        const r = fireworksRockets[i];
        r.x += r.vx;
        r.y += r.vy;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();

        ctx.save();
        for (let j = 0; j < r.trail.length; j++) {
            const tr = r.trail[j];
            ctx.fillStyle = r.color;
            ctx.globalAlpha = (j / r.trail.length) * 0.7;
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, (j / r.trail.length) * 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        if (r.y <= r.targetY || (r.vy >= 0 && r.y >= r.targetY)) {
            explodeHeartRocket(r.targetX, r.targetY, r.colors);
            fireworksRockets.splice(i, 1);
        }
    }

    // 2. Cập nhật Hạt pháo hoa
    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
        const p = fireworksParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.alpha -= p.fadeSpeed;
        p.rotation += p.vRot;

        if (p.alpha <= 0) {
            fireworksParticles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.isHeart) {
            drawMiniHeart(ctx, p.x, p.y, p.size * 1.6, p.rotation, p.color);
        } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// ==========================================
// 6.5. ĐỒNG HỒ ĐẾM NGÀY YÊU & TÙY CHỈNH TÊN KỶ NIỆM
// ==========================================
let senderName = localStorage.getItem("love_sender_name") || "Mai IT";
let recipientName = localStorage.getItem("love_recipient_name") || "Kim Thanh";

let storedDate = localStorage.getItem("love_start_date");
if (!storedDate || storedDate === "2024-01-01" || storedDate === "2026-08-30") {
    storedDate = "2026-08-30T13:30";
    localStorage.setItem("love_start_date", storedDate);
}
let loveStartDate = storedDate;
let customLoveLetter = localStorage.getItem("love_custom_letter") || "";

const loveDaysWidget = document.getElementById("loveDaysWidget");
const widgetNames = document.getElementById("widgetNames");
const widgetDaysText = document.getElementById("widgetDaysText");

const nameEditorModal = document.getElementById("nameEditorModal");
const nameEditorBtn = document.getElementById("nameEditorBtn");
const closeNameEditorBtn = document.getElementById("closeNameEditorBtn");
const nameEditorBackdrop = document.getElementById("nameEditorBackdrop");
const saveNameSettingsBtn = document.getElementById("saveNameSettingsBtn");

const inputSenderName = document.getElementById("inputSenderName");
const inputRecipientName = document.getElementById("inputRecipientName");
const inputLoveDate = document.getElementById("inputLoveDate");
const inputCustomMessage = document.getElementById("inputCustomMessage");

function updateLoveDays() {
    const start = new Date(loveStartDate).getTime();
    const now = new Date().getTime();
    const diffMs = Math.max(0, now - start);

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
    const diffSecs = Math.floor((diffMs / 1000) % 60);

    if (widgetNames) widgetNames.textContent = `${senderName} & ${recipientName}`;
    if (widgetDaysText) widgetDaysText.textContent = `Đã yêu: ${diffDays} ngày ${diffHours}h ${diffMins}p ${diffSecs}s`;
}

function applyCustomSettings() {
    updateLoveDays();
    if (inputSenderName) inputSenderName.value = senderName;
    if (inputRecipientName) inputRecipientName.value = recipientName;
    if (inputLoveDate) inputLoveDate.value = loveStartDate;
    if (inputCustomMessage) inputCustomMessage.value = customLoveLetter;

    if (typeof TOUR_STEPS !== "undefined" && TOUR_STEPS[0]) {
        TOUR_STEPS[0].desc = `Xin chào ${recipientName}! Chạm vào tim để bùng nổ vũ trụ lung linh nha! ✨`;
    }
}

setInterval(updateLoveDays, 1000);
updateLoveDays();

if (loveDaysWidget) {
    loveDaysWidget.addEventListener("click", (e) => {
        e.stopPropagation();
        if (nameEditorModal) {
            applyCustomSettings();
            nameEditorModal.classList.add("open");
        }
    });
}

if (nameEditorBtn) {
    nameEditorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeControlHub();
        if (nameEditorModal) {
            applyCustomSettings();
            nameEditorModal.classList.add("open");
        }
    });
}

if (closeNameEditorBtn) {
    closeNameEditorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (nameEditorModal) nameEditorModal.classList.remove("open");
    });
}

if (nameEditorBackdrop) {
    nameEditorBackdrop.addEventListener("click", (e) => {
        e.stopPropagation();
        if (nameEditorModal) nameEditorModal.classList.remove("open");
    });
}

if (saveNameSettingsBtn) {
    saveNameSettingsBtn.addEventListener("click", () => {
        senderName = (inputSenderName && inputSenderName.value.trim()) || "Mai IT";
        recipientName = (inputRecipientName && inputRecipientName.value.trim()) || "Kim Thanh";
        loveStartDate = (inputLoveDate && inputLoveDate.value) || "2024-01-01";
        customLoveLetter = (inputCustomMessage && inputCustomMessage.value.trim()) || "";

        localStorage.setItem("love_sender_name", senderName);
        localStorage.setItem("love_recipient_name", recipientName);
        localStorage.setItem("love_start_date", loveStartDate);
        localStorage.setItem("love_custom_letter", customLoveLetter);

        applyCustomSettings();
        if (nameEditorModal) nameEditorModal.classList.remove("open");

        showToastCard("💖 Đã Lưu Kỷ Niệm!", `Tình yêu của ${senderName} & ${recipientName} đã được cập nhật lung linh! ✨`, 5000, `Tình yêu của ${senderName} & ${recipientName} đã được cập nhật lung linh!`, "save_settings.mp3");
        launchHeartFireworks();
    });
}

// Bắn pháo hoa nút trên thanh công cụ và trong hub
const fireworksBtn = document.getElementById("fireworksBtn");
const hubFireworksBtn = document.getElementById("hubFireworksBtn");

if (fireworksBtn) {
    fireworksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        launchHeartFireworks();
        setTimeout(() => launchHeartFireworks(), 260);
        setTimeout(() => launchHeartFireworks(), 520);
        showToastCard("🎆 Bùng Nổ Pháo Hoa Trái Tim!", "Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao! ✨💖", 6000, "Bùng nổ pháo hoa trái tim! Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao!", "fireworks_story.mp3");
    });
}

if (hubFireworksBtn) {
    hubFireworksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeControlHub();
        launchHeartFireworks();
        setTimeout(() => launchHeartFireworks(), 260);
        setTimeout(() => launchHeartFireworks(), 520);
        showToastCard("🎆 Bùng Nổ Pháo Hoa Trái Tim!", "Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao! ✨💖", 6000, "Bùng nổ pháo hoa trái tim! Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao!", "fireworks_story.mp3");
    });
}

// Click đúp vào canvas để bắn pháo hoa
const heartCanvas = document.getElementById("heartCanvas");
if (heartCanvas) {
    heartCanvas.addEventListener("dblclick", (e) => {
        launchHeartFireworks(e.clientX, e.clientY);
        setTimeout(() => launchHeartFireworks(), 300);
    });
}

// ==========================================
// 7. RENDER 5 KIỂU DÁNG NGHỆ THUẬT
// ==========================================

const galaxyParticles = [];
for (let i = 0; i < 180; i++) {
    const t = Math.random() * Math.PI * 2;
    const hp = getHeartPoint(t);
    const spread = Math.pow(Math.random(), 0.7);
    galaxyParticles.push({
        baseX: hp.x * spread,
        baseY: hp.y * spread,
        baseZ: (Math.random() - 0.5) * 16 * spread,
        size: Math.random() * 2.2 + 0.8,
        speed: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
        t: t
    });
}

function drawShapeGalaxyHeart(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    // 1. Luôn hiển thị trái tim pha lê thuần khiết sắc nét, vững vàng ở tâm
    drawShapePureGlassHeart(ctx, scale, now, isBeating, beatScale, theme);

    // 2. Dải ngân hà 3D gồm các vì sao ánh sáng xoay chuyển liên tục
    const rotY = now * 0.0009;
    const perspective = 260;

    const projected = [];
    for (let p of galaxyParticles) {
        p.phase += p.speed;
        const wiggleX = Math.sin(p.phase) * 1.5;
        const wiggleY = Math.cos(p.phase) * 1.5;

        const x = (p.baseX + wiggleX) * scale;
        const y = (p.baseY + wiggleY) * scale;
        const z = (p.baseZ + Math.sin(p.phase * 2) * 4) * scale;

        const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
        const rz = x * Math.sin(rotY) + z * Math.cos(rotY);
        const ry = y;

        const proj = perspective / (perspective + rz + 100);
        projected.push({
            x: rx * proj,
            y: ry * proj,
            z: rz,
            size: p.size * proj * beatScale * 1.15,
            alpha: Math.min(1.0, Math.max(0.3, (rz + 60) / 120))
        });
    }

    projected.sort((a, b) => a.z - b.z);

    for (let p of projected) {
        ctx.fillStyle = theme.textColor;
        ctx.globalAlpha = p.alpha * 0.95;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawShapeBloomingRose(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const bloom = Math.sin(now * 0.002) * 0.08 + (isBeating ? 0.25 : 0);
    const roseScale = scale * 1.35 * (1 + bloom);
    const petalLayers = 4;
    for (let layer = petalLayers; layer >= 1; layer--) {
        const petalsInLayer = layer * 3 + 2;
        const r = (layer / petalLayers) * 14 * roseScale;
        const rotOffset = layer * 0.4 + now * 0.0003;
        const pw = (r / petalLayers) * 1.8;
        const ph = (r / petalLayers) * 2.4;
        for (let i = 0; i < petalsInLayer; i++) {
            const angle = (i / petalsInLayer) * Math.PI * 2 + rotOffset;
            const px = Math.cos(angle) * r * 0.6;
            const py = Math.sin(angle) * r * 0.6;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle + Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(0, -ph * 0.5, pw, ph, 0, 0, Math.PI * 2);
            ctx.fillStyle = theme.butterflyColor;
            ctx.globalAlpha = 0.75 + (layer / petalLayers) * 0.22;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }
    const coreTwinkle = Math.sin(now * 0.006) * 0.3 + 0.7;
    ctx.fillStyle = "#fff7a0";
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5 * coreTwinkle * beatScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

const orbSnow = [];
for (let i = 0; i < 35; i++) {
    orbSnow.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 1.8 + 0.8,
        sway: Math.random() * Math.PI * 2
    });
}

function drawShapeMagicOrb(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const orbRadius = 14 * scale;
    const orbGrd = ctx.createRadialGradient(-orbRadius * 0.35, -orbRadius * 0.35, orbRadius * 0.1, 0, 0, orbRadius);
    orbGrd.addColorStop(0, "rgba(255, 255, 255, 0.65)");
    orbGrd.addColorStop(0.3, "rgba(255, 200, 230, 0.2)");
    orbGrd.addColorStop(0.8, "rgba(30, 10, 50, 0.4)");
    orbGrd.addColorStop(1, "rgba(255, 255, 255, 0.85)");
    ctx.fillStyle = orbGrd;
    ctx.shadowColor = theme.coreShadow;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, orbRadius - 2, 0, Math.PI * 2);
    ctx.clip();
    for (let s of orbSnow) {
        s.y += s.vy;
        s.sway += 0.02;
        const sx = s.x + Math.sin(s.sway) * 4;
        if (s.y < -orbRadius) { s.y = orbRadius; s.x = (Math.random() - 0.5) * orbRadius * 1.5; }
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(sx, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    }
    const miniScale = scale * 0.48 * beatScale;
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        const hp = getHeartPoint(t);
        ctx.lineTo(hp.x * miniScale, hp.y * miniScale);
    }
    ctx.closePath();
    const miniGrd = ctx.createRadialGradient(0, -5 * miniScale, 0, 0, 0, 16 * miniScale);
    for (let g of theme.coreGrad) miniGrd.addColorStop(g[0], g[1]);
    ctx.fillStyle = miniGrd;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.ellipse(-orbRadius * 0.45, -orbRadius * 0.45, orbRadius * 0.28, orbRadius * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawShapeInfinityRibbon(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const ribbonScale = scale * 1.15 * beatScale;
    const ribbonCount = 3;
    for (let r = 0; r < ribbonCount; r++) {
        const offsetPhase = (r / ribbonCount) * Math.PI * 2 + now * 0.002;
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
            const hp = getHeartPoint(t);
            const wave = Math.sin(t * 3 + offsetPhase) * 2.2;
            const px = (hp.x + Math.cos(t) * wave) * ribbonScale;
            const py = (hp.y + Math.sin(t) * wave) * ribbonScale;
            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        const ribbonGrd = ctx.createLinearGradient(-15 * ribbonScale, 0, 15 * ribbonScale, 0);
        ribbonGrd.addColorStop(0, theme.textColor);
        ribbonGrd.addColorStop(0.5, theme.butterflyColor);
        ribbonGrd.addColorStop(1, theme.textColor);
        ctx.strokeStyle = ribbonGrd;
        ctx.lineWidth = (3.5 - r * 0.8);
        ctx.stroke();
    }
    const starCount = 12;
    for (let i = 0; i < starCount; i++) {
        const st = ((now * 0.0004 + (i / starCount) * Math.PI * 2) % (Math.PI * 2));
        const hp = getHeartPoint(st);
        const px = hp.x * ribbonScale;
        const py = hp.y * ribbonScale;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawShapePureGlassHeart(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const glassScale = scale * 1.05 * beatScale;
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.04) {
        const hp = getHeartPoint(t);
        ctx.lineTo(hp.x * glassScale, hp.y * glassScale);
    }
    ctx.closePath();
    const glassGrd = ctx.createRadialGradient(0, -8 * glassScale, 0, 0, 0, 18 * glassScale);
    for (let g of theme.coreGrad) glassGrd.addColorStop(g[0], g[1]);
    ctx.fillStyle = glassGrd;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.stroke();
    ctx.beginPath();
    for (let t = Math.PI * 0.65; t <= Math.PI * 0.95; t += 0.04) {
        const hp = getHeartPoint(t);
        const px = hp.x * glassScale * 0.88;
        const py = hp.y * glassScale * 0.88;
        if (t === Math.PI * 0.65) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();
}

// ==========================================
// 8. BƯỚM DẠ QUANG & TƯƠNG TÁC CLICK
// ==========================================
const butterflies = [
    { t: 0, speed: 0.007, radiusX: 130, radiusY: 85, phase: 0 },
    { t: Math.PI, speed: 0.0055, radiusX: 165, radiusY: 105, phase: Math.PI / 2 }
];

function drawButterfly(ctx, cx, cy, b, now) {
    b.t += b.speed;
    const bx = cx + Math.cos(b.t) * b.radiusX;
    const by = cy + Math.sin(b.t * 2) * (b.radiusY * 0.5);
    const wingFlap = Math.sin(now * 0.02 + b.phase);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(Math.atan2(Math.cos(b.t * 2) * b.radiusY, -Math.sin(b.t) * b.radiusX));
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = curTheme.butterflyColor;
    ctx.globalAlpha = 0.85;
    const wingW = Math.abs(wingFlap) * 7 + 2;
    ctx.beginPath();
    ctx.ellipse(-wingW / 2, -2, wingW / 2, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(wingW / 2, -2, wingW / 2, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

const shockwaves = [];
function addShockwave(x, y, color = null) {
    shockwaves.push({
        x: x,
        y: y,
        r: 10,
        maxR: Math.min(width, height) * 0.45,
        alpha: 0.85,
        color: color || curTheme.shockwaveColor || "rgba(255, 105, 180,"
    });
}

let comboCount = 0;
let lastClickTime = 0;
let comboTimeout = null;

function handleCombo(x, y) {
    const nowTime = performance.now();
    if (nowTime - lastClickTime < 1100) {
        comboCount++;
    } else {
        comboCount = 1;
    }
    lastClickTime = nowTime;
    if (comboCount >= 2) {
        showToastBadge(`Combo x${comboCount} ❤️`, 900);
    }
}

const ambientParticles = [];
for (let i = 0; i < 45; i++) {
    ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        radius: Math.random() * 2.2 + 0.8,
        color: Math.random() > 0.4 ? "rgba(255, 182, 193," : "rgba(255, 230, 150,",
        alphaOffset: Math.random() * Math.PI * 2,
        alphaSpeed: Math.random() * 0.02 + 0.01
    });
}

const layer2Particles = [];
for (let i = 0; i < 220; i++) {
    layer2Particles.push({
        t: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.004 + 0.002,
        size: Math.random() * 2 + 0.8,
        offset: Math.random() * 0.14 + 0.95,
        isPetal: Math.random() > 0.75
    });
}

const burstParticles = [];
let heartbeatStartTime = 0;
let isBeating = false;

function createBurst(cx, cy, count = 40) {
    const colors = curTheme.burstColors;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        burstParticles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 4,
            alpha: 1.0,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            isHeart: Math.random() > 0.4,
            gravity: 0.08,
            friction: 0.96
        });
    }
}

function triggerHeartbeat(clientX, clientY) {
    handleFirstInteraction();
    isBeating = true;
    heartbeatStartTime = performance.now();
    const center = getHeartCenter();
    const triggerX = clientX || center.x;
    const triggerY = clientY || center.y;
    handleCombo(triggerX, triggerY);
    addShockwave(center.x, center.y);
    createBurst(triggerX, triggerY, 45);
    spawnShootingStar();
    triggerHaptic(25);
    if (audioCtx) {
        playChimeNote(880.00, 0, 1.0);
        playChimeNote(1174.66, 0.1, 1.2);
    }
}

canvas.addEventListener("click", (e) => { triggerHeartbeat(e.clientX, e.clientY); });
canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        triggerHeartbeat(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

let lastTap = 0;
canvas.addEventListener("touchend", (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 320 && tapLength > 0) {
        // Chạm 2 lần (Double Tap) trên Mobile: Bắn pháo hoa rực rỡ
        triggerHaptic([35, 50, 35]);
        const changedTouch = e.changedTouches && e.changedTouches[0];
        const tx = changedTouch ? changedTouch.clientX : width / 2;
        const ty = changedTouch ? changedTouch.clientY : height / 3;
        launchHeartFireworks(tx, ty);
        setTimeout(() => launchHeartFireworks(), 260);
        showToastCard("🎆 Pháo Hoa Trái Tim Bùng Nổ!", "Chạm đúp màn hình tạo nên ngàn vì sao sáng rực rỡ! ✨💖", 5000, "Pháo hoa trái tim bùng nổ! Chạm đúp màn hình tạo nên ngàn vì sao sáng rực rỡ!", "fireworks_story.mp3");
    }
    lastTap = currentTime;
});
canvas.addEventListener("dblclick", (e) => {
    triggerHaptic([35, 50, 35]);
    launchHeartFireworks(e.clientX, e.clientY);
    setTimeout(() => launchHeartFireworks(), 260);
});

// ==========================================
// 8.8 HỆ THỐNG HIỆU ỨNG KHÍ QUYỂN RIÊNG CHO 10 TÔNG MÀU (Theme Atmosphere)
// ==========================================
const themeAtmosphereParticles = [];
function updateAndDrawThemeAtmosphere(ctx, now, cx, cy) {
    if (themeAtmosphereParticles.length < 28 && Math.random() < 0.45) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 240;
        themeAtmosphereParticles.push({
            themeId: curTheme.id || "pink",
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 1.1,
            vy: curTheme.id === "ocean" ? -(Math.random() * 1.6 + 0.8) : (Math.random() - 0.5) * 1.1,
            size: Math.random() * 4 + 2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            life: 1.0,
            fadeSpeed: Math.random() * 0.012 + 0.007,
            color: curTheme.burstColors[Math.floor(Math.random() * curTheme.burstColors.length)]
        });
    }

    for (let i = themeAtmosphereParticles.length - 1; i >= 0; i--) {
        const p = themeAtmosphereParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.life -= p.fadeSpeed;

        if (p.life <= 0) {
            themeAtmosphereParticles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.85;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (curTheme.id === "pink") {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
            ctx.fill();
        } else if (curTheme.id === "gold") {
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.5);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(0, p.size * 1.5);
            ctx.lineTo(-p.size, 0);
            ctx.closePath();
            ctx.fill();
        } else if (curTheme.id === "aurora") {
            ctx.strokeStyle = "#a5f3fc";
            ctx.lineWidth = 1.5;
            for (let a = 0; a < 3; a++) {
                ctx.beginPath();
                ctx.moveTo(-p.size * 1.3, 0);
                ctx.lineTo(p.size * 1.3, 0);
                ctx.stroke();
                ctx.rotate(Math.PI / 3);
            }
        } else if (curTheme.id === "emerald") {
            ctx.fillStyle = "#34d399";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (curTheme.id === "sunset") {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else if (curTheme.id === "sakura") {
            ctx.fillStyle = "#f472b6";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (curTheme.id === "ocean") {
            ctx.strokeStyle = "#38bdf8";
            ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (curTheme.id === "diamond") {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 2);
            ctx.lineTo(p.size * 0.6, 0);
            ctx.lineTo(0, p.size * 2);
            ctx.lineTo(-p.size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
        } else if (curTheme.id === "rainbow") {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// ==========================================
// 9. MAIN RENDER LOOP
// ==========================================
const startTime = performance.now();

function render(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    curTiltX += (targetTiltX - curTiltX) * 0.06;
    curTiltY += (targetTiltY - curTiltY) * 0.06;
    if (bgLayer) bgLayer.style.transform = `translate(${curTiltX * 12}px, ${curTiltY * 12}px) scale(1.06)`;

    // 0. Hiệu ứng môi trường riêng biệt theo từng loại nền:
    const targetGalaxyBgAlpha = curBgMode.isGalaxyBg ? 1.0 : 0.0;
    const targetSakuraAlpha = curBgMode.id === "art" ? 1.0 : 0.0;
    const targetGlitterAlpha = (curBgMode.id === "default" || curBgMode.id === "pure") ? 1.0 : 0.0;

    curGalaxyBgAlpha += (targetGalaxyBgAlpha - curGalaxyBgAlpha) * 0.06;
    curSakuraAlpha += (targetSakuraAlpha - curSakuraAlpha) * 0.06;
    curGlitterAlpha += (targetGlitterAlpha - curGlitterAlpha) * 0.06;

    // 0.1 Nền Dải Thiên Hà 3D Toàn Cảnh
    draw3DGalaxyBackground(ctx, now, curTiltX, curTiltY);

    // 0.2 Cánh Hoa Anh Đào Rơi Lả Tả (Nền Nghệ Thuật)
    drawFallingSakura(ctx, now, curSakuraAlpha);

    // 0.3 Kim Tuyến & Ánh Sao Pha Lê Lấp Lánh (Nền Chuẩn & Thuần Khiết)
    drawFallingGlitter(ctx, now, curGlitterAlpha);

    // 0.4 Hạt Khí Quyển Đặc Biệt Riêng Biệt Cho Từng Màu Sắc (Theme Atmosphere Particles)
    const heartCenterAtm = getHeartCenter();
    updateAndDrawThemeAtmosphere(ctx, now, heartCenterAtm.x, heartCenterAtm.y);

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x -= Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= s.fadeSpeed || 0.015;
        if (s.alpha <= 0 || s.y > height || s.x < -100) { shootingStars.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = s.alpha;
        const tailX = s.x + Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const starGrd = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        starGrd.addColorStop(0, "#ffffff");
        starGrd.addColorStop(0.25, s.color || curTheme.textColor);
        starGrd.addColorStop(1, "transparent");
        ctx.strokeStyle = starGrd;
        ctx.lineWidth = s.width || 2.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, (s.width || 2.2) * 1.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 6.5;
        sw.alpha -= 0.022;
        if (sw.alpha <= 0 || sw.r >= sw.maxR) { shockwaves.splice(i, 1); continue; }
        ctx.save();
        ctx.strokeStyle = `${sw.color} ${sw.alpha})`;
        ctx.lineWidth = 3.5 * sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx + Math.sin(now * 0.001 + i) * 0.3;
        p.y += p.vy;
        if (p.y < -20) { p.y = height + 20; p.x = Math.random() * width; }
        const alpha = 0.3 + Math.sin(now * p.alphaSpeed + p.alphaOffset) * 0.3;
        ctx.fillStyle = `${p.color} ${Math.max(0.05, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.rot += tp.vRot;
        tp.alpha -= tp.fadeSpeed;
        if (tp.alpha <= 0) { trailParticles.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(tp.x, tp.y);
        ctx.rotate(tp.rot);
        ctx.globalAlpha = tp.alpha;
        ctx.fillStyle = tp.color;

        const s = tp.size * tp.alpha;
        if (tp.shapeType === "star") {
            ctx.beginPath();
            ctx.moveTo(0, -s * 1.4);
            ctx.quadraticCurveTo(0, 0, s * 1.4, 0);
            ctx.quadraticCurveTo(0, 0, 0, s * 1.4);
            ctx.quadraticCurveTo(0, 0, -s * 1.4, 0);
            ctx.quadraticCurveTo(0, 0, 0, -s * 1.4);
            ctx.fill();
        } else if (tp.shapeType === "heart") {
            drawMiniHeart(ctx, 0, 0, s * 1.5, 0, tp.color);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.75, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    ctx.globalAlpha = 1.0;

    const heartCenter = getHeartCenter();
    const finalHeartX = heartCenter.x + curTiltX * 8;
    const finalHeartY = heartCenter.y + curTiltY * 8;

    // Vẽ Bướm Dạ Quang
    if (curHeartVisAlpha > 0.05) {
        ctx.save();
        ctx.globalAlpha = curHeartVisAlpha;
        for (let b of butterflies) drawButterfly(ctx, finalHeartX, finalHeartY, b, now);
        ctx.restore();
    }

    ctx.save();
    ctx.translate(finalHeartX, finalHeartY);
    currentScale += (targetScale - currentScale) * 0.1;
    const idleBreathing = 1.0 + Math.sin(now * 0.0022) * 0.035;
    let clickBeatScale = 1.0;
    if (isBeating) {
        const beatElapsed = now - heartbeatStartTime;
        const duration = 650;
        if (beatElapsed < duration) {
            const beatProgress = beatElapsed / duration;
            const p1 = Math.sin(Math.min(1, beatProgress * 2.8) * Math.PI);
            const p2 = Math.sin(Math.max(0, Math.min(1, (beatProgress - 0.28) * 2.8)) * Math.PI);
            clickBeatScale = 1.0 + p1 * 0.18 + p2 * 0.32;
        } else isBeating = false;
    }
    let introScale = Math.min(elapsed / 1500, 1.0);
    introScale = 1 - Math.pow(1 - introScale, 3);
    const finalScale = currentScale * idleBreathing * introScale;
    const outerOpacity = Math.max(0, Math.min((elapsed - 1200) / 1000, 1.0));

    curHeartVisAlpha += (curBgMode.heartTargetAlpha - curHeartVisAlpha) * 0.05;

    const scaleBase = finalScale * 5.2;
    if (introScale > 0 && curHeartVisAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = curHeartVisAlpha;
        switch (curShape.id) {
            case "galaxy":
                drawShapeGalaxyHeart(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "rose":
                drawShapeBloomingRose(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "orb":
                drawShapeMagicOrb(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "infinity":
                drawShapeInfinityRibbon(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "glass":
            default:
                drawShapePureGlassHeart(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
        }
        ctx.restore();
    }

    const scaleL2 = finalScale * 9.2;
    if (outerOpacity > 0 && curHeartVisAlpha > 0.01 && (curShape.id === "glass" || curShape.id === "galaxy" || curShape.id === "infinity")) {
        for (let i = 0; i < layer2Particles.length; i++) {
            const p = layer2Particles[i];
            p.t += p.speed;
            if (p.t > Math.PI * 2) p.t = 0;
            const pos = getHeartPoint(p.t);
            const px = pos.x * scaleL2 * p.offset;
            const py = pos.y * scaleL2 * p.offset;
            const twinkle = 0.4 + Math.sin(now * 0.006 + i) * 0.6;
            ctx.globalAlpha = outerOpacity * curHeartVisAlpha * Math.max(0.1, twinkle);
            ctx.fillStyle = curTheme.particleColor;
            if (p.isPetal) {
                ctx.beginPath();
                ctx.ellipse(px, py, p.size * 1.6 * finalScale, p.size * finalScale, p.t, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(px, py, p.size * finalScale, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    if (outerOpacity > 0 && curHeartVisAlpha > 0.01 && (curShape.id === "glass" || curShape.id === "infinity" || curShape.id === "galaxy")) {
        ctx.save();
        ctx.globalAlpha = outerOpacity * curHeartVisAlpha;
        const scaleL3 = finalScale * 11.6;
        const fontSize = Math.max(18, Math.round(23 * finalScale));
        ctx.font = `800 ${fontSize}px 'Dancing Script', cursive, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textString = "  I  L O V E  Y O U  ♥  ";
        const textArr = textString.split("");
        const totalChars = 56;
        const textOffsetT = (now * 0.00025) % (Math.PI * 2);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.8 * finalScale;

        for (let i = 0; i < totalChars; i++) {
            let t = (i / totalChars) * Math.PI * 2 + textOffsetT;
            if (t > Math.PI * 2) t -= Math.PI * 2;
            const pos = getHeartPoint(t);
            const angle = getTangentAngle(t);
            const char = textArr[i % textArr.length];

            ctx.save();
            ctx.translate(pos.x * scaleL3, pos.y * scaleL3);
            ctx.rotate(angle);
            ctx.fillText(char, 0, 0);
            ctx.strokeText(char, 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }
    ctx.restore();

    // 6. Bùng nổ hạt khi click
    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= bp.friction;
        bp.vy *= bp.friction;
        bp.vy += bp.gravity;
        bp.rotation += bp.vRot;
        bp.alpha -= 0.016;
        if (bp.alpha <= 0) { burstParticles.splice(i, 1); continue; }
        ctx.globalAlpha = bp.alpha;
        if (bp.isHeart) {
            drawMiniHeart(ctx, bp.x, bp.y, bp.size * 2, bp.rotation, bp.color);
        } else {
            ctx.fillStyle = bp.color;
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 7. Cập nhật và vẽ Pháo hoa trái tim
    updateAndDrawFireworks(ctx);

    ctx.globalAlpha = 1.0;
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

// ==========================================
// 10. CUTE INTERACTIVE CAT SQUAD (Hội Bé Mèo Đa Sắc)
// ==========================================
const CAT_QUOTES = {
    white: "Em là điều ngọt ngào nhất thế gian! Công chúa tuyết gửi bạn một ngàn cái ôm ấm áp nè! 🌸✨",
    ginger: "Mèo cam béo bụng nhưng tim chứa đầy tình cảm chân thành á! Meow meow! 🐱🧡",
    black: "Tôi là mèo phép thuật mang lại may mắn! Tôi ở đây để bảo vệ nụ cười của bạn! 🪄🌙✨",
    pink: "Yêu bạn 3000 lần luôn á! Bé mèo dâu tây chúc bạn một ngày ngập tràn kẹo ngọt! 🍓💖"
};

// Khởi tạo trước các file âm thanh giọng nói tiếng Việt cho 4 bé mèo
const catVoiceAudios = {
    white: new Audio("cat_white.mp3"),
    ginger: new Audio("cat_ginger.mp3"),
    black: new Audio("cat_black.mp3"),
    pink: new Audio("cat_pink.mp3")
};

function playCatVoiceAndStory(catType) {
    // 1. Tắt nhạc nền ngay khi bé mèo cất tiếng nói
    pauseMusicForVoice();
    isVoiceSpeaking = true;

    // Dừng âm thanh của các bé mèo khác nếu đang phát
    Object.values(catVoiceAudios).forEach(a => {
        if (a) {
            a.pause();
            a.currentTime = 0;
        }
    });

    const audio = catVoiceAudios[catType] || catVoiceAudios.white;
    audio.currentTime = 0;
    audio.volume = 1.0;

    audio.onended = () => {
        isVoiceSpeaking = false;
        resumeMusicAfterVoice(600);
    };
    audio.onpause = () => {
        isVoiceSpeaking = false;
        resumeMusicAfterVoice(600);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.log("Cat audio playback notice:", err);
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(300);
        });
    }
}

function initCatSquad() {
    const catItems = document.querySelectorAll(".cat-companion");
    catItems.forEach(cat => {
        function handleCatClick(e) {
            if (e) {
                e.stopPropagation();
            }

            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx && audioCtx.state === "suspended") {
                audioCtx.resume();
            }

            const catType = cat.getAttribute("data-cat") || "white";
            const quote = CAT_QUOTES[catType] || CAT_QUOTES.white;

            // 1. Bé mèo nhún nhảy nhẹ trong khi vẫn quẩy vũ đạo liên tục
            cat.classList.remove("jump");
            void cat.offsetWidth;
            cat.classList.add("jump");

            // 2. Hiện bong bóng thoại khớp 100% từng từ với giọng đọc
            const bubble = cat.querySelector(".cat-bubble");
            if (bubble) {
                bubble.textContent = quote;
                bubble.classList.add("active");
                clearTimeout(cat._bubbleTimer);
                cat._bubbleTimer = setTimeout(() => {
                    bubble.classList.remove("active");
                }, 5500);
            }

            // 3. Phát giọng nói tiếng Việt ngọt ngào (Tắt nhạc nền, nói xong tự bật lại)
            playCatVoiceAndStory(catType);
        }

        cat.addEventListener("click", handleCatClick);
        cat.addEventListener("touchstart", handleCatClick, { passive: true });
    });
}
initCatSquad();

// ==========================================
// 10.3 CUTE INTERACTIVE GOOSE DUO (Đôi Bé Ngỗng Quẩy Dễ Thương)
// ==========================================
const GOOSE_QUOTES = {
    white: "Cạp cạp! Hôm nay Kim Thanh có nhớ người ta không đấy? Tui là ngỗng tình yêu mang ngàn điều may mắn đến cho bạn nè! 🪿💖",
    gold: "Honk honk! Đố bạn biết ai yêu bạn nhất trên đời? Là người gửi món quà này cho bạn đấy nhé! 🪿👑✨"
};

const gooseVoiceAudios = {
    white: new Audio("goose_white.mp3"),
    gold: new Audio("goose_gold.mp3")
};

function playGooseVoiceAndStory(gooseType) {
    // 1. Tắt nhạc nền ngay khi bé ngỗng cất tiếng nói
    pauseMusicForVoice();
    isVoiceSpeaking = true;

    // Dừng âm thanh của các bé ngỗng và bé mèo khác nếu đang phát
    Object.values(gooseVoiceAudios).forEach(a => {
        if (a) {
            a.pause();
            a.currentTime = 0;
        }
    });
    Object.values(catVoiceAudios).forEach(a => {
        if (a) {
            a.pause();
            a.currentTime = 0;
        }
    });

    const audio = gooseVoiceAudios[gooseType] || gooseVoiceAudios.white;
    audio.currentTime = 0;
    audio.volume = 1.0;

    audio.onended = () => {
        isVoiceSpeaking = false;
        resumeMusicAfterVoice(600);
    };
    audio.onpause = () => {
        isVoiceSpeaking = false;
        resumeMusicAfterVoice(600);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.log("Goose audio playback notice:", err);
            isVoiceSpeaking = false;
            resumeMusicAfterVoice(300);
        });
    }
}

function initGooseSquad() {
    const gooseItems = document.querySelectorAll(".goose-companion");
    gooseItems.forEach(goose => {
        function handleGooseClick(e) {
            if (e) {
                e.stopPropagation();
            }

            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx && audioCtx.state === "suspended") {
                audioCtx.resume();
            }

            const gooseType = goose.getAttribute("data-goose") || "white";
            const quote = GOOSE_QUOTES[gooseType] || GOOSE_QUOTES.white;

            // 1. Bé ngỗng nhún nảy nhẹ
            goose.classList.remove("jump");
            void goose.offsetWidth;
            goose.classList.add("jump");

            // 2. Hiện bong bóng thoại khớp với giọng đọc
            const bubble = goose.querySelector(".goose-bubble");
            if (bubble) {
                bubble.textContent = quote;
                bubble.classList.add("active");
                clearTimeout(goose._bubbleTimer);
                goose._bubbleTimer = setTimeout(() => {
                    bubble.classList.remove("active");
                }, 5500);
            }

            // 3. Phát giọng nói tiếng Việt đáng yêu của bé ngỗng (Tắt nhạc nền, đọc xong tự bật lại)
            playGooseVoiceAndStory(gooseType);
        }

        goose.addEventListener("click", handleGooseClick);
        goose.addEventListener("touchstart", handleGooseClick, { passive: true });
    });
}
initGooseSquad();

// ==========================================
// 10.5 FLOATING CONTROL HUB CONTROLLER (TRUNG TÂM TIỆN ÍCH TINH GỌN)
// ==========================================
const controlHubModal = document.getElementById("controlHubModal");
const hubToggleBtn = document.getElementById("hubToggleBtn");
const closeHubBtn = document.getElementById("closeHubBtn");
const hubBackdrop = document.getElementById("hubBackdrop");

function openControlHub() {
    if (!controlHubModal) return;
    controlHubModal.classList.add("open");
    if (audioCtx) {
        playChimeNote(659.25, 0, 0.4);
        playChimeNote(880.00, 0.08, 0.5);
    }
}

function closeControlHub() {
    if (!controlHubModal) return;
    controlHubModal.classList.remove("open");
}

if (hubToggleBtn) hubToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openControlHub();
});

if (closeHubBtn) closeHubBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeControlHub();
});

if (hubBackdrop) hubBackdrop.addEventListener("click", (e) => {
    e.stopPropagation();
    closeControlHub();
});

// Tự động đóng Control Hub khi người dùng bấm vào các nút chức năng mở popup khác
const hubItemBtns = document.querySelectorAll(".hub-item-btn");
hubItemBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.id;
        if (id === "openPlaylistBtn" || id === "letterBtn" || id === "authorBtn" || id === "tourGuideBtn") {
            closeControlHub();
        }
    });
});

// ==========================================
// 11. COMPLETE STEP-BY-STEP GUIDED TOUR SYSTEM (HƯỚNG DẪN TỪ ĐẦU ĐẾN CUỐI)
// ==========================================
const TOUR_STEPS = [
    {
        target: "#heartCanvas",
        title: "💖 Bước 1: Trái Tim 3D",
        desc: "Xin chào Kim Thanh! Chạm vào tim để bùng nổ vũ trụ lung linh nha! ✨",
        voice: "Xin chào Kim Thanh! Chạm vào tim để bùng nổ vũ trụ lung linh nha!",
        audio: "tour_step_1.mp3",
        placement: "center",
        closeHub: true
    },
    {
        target: "#hubToggleBtn",
        title: "✨ Bước 2: Menu Tiện Ích",
        desc: "Menu Điều Khiển mở ra toàn bộ tính năng tùy biến không gian tình yêu! ⚙️",
        voice: "Menu Điều Khiển mở ra toàn bộ tính năng tùy biến không gian tình yêu!",
        audio: "tour_step_2.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#shapeToggle",
        title: "🌌 Bước 3: Đổi Kiểu Dáng Tim",
        desc: "Chọn 5 kiểu dáng độc đáo: Thiên Hà, Hoa Hồng, Quả Cầu, Vô Cực hoặc Pha Lê! 🌸",
        voice: "Chọn năm kiểu dáng độc đáo: Thiên Hà, Hoa Hồng, Quả Cầu, Vô Cực hoặc Pha Lê!",
        audio: "tour_step_3.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#themeToggle",
        title: "👑 Bước 4: 10 Sắc Màu & Thính",
        desc: "Tùy chọn 10 tông màu lung linh kèm cốt truyện và giọng kể riêng biệt! 🎨",
        voice: "Tùy chọn mười tông màu lung linh kèm cốt truyện và giọng kể riêng biệt!",
        audio: "tour_step_4.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#bgModeToggle",
        title: "🖼️ Bước 5: Không Gian Hình Nền",
        desc: "Đổi chế độ nền: Nền Chuẩn, Hoa Anh Đào, Thiên Hà 3D hoặc Thuần Khiết! 🌌",
        voice: "Đổi chế độ nền: Nền Chuẩn, Hoa Anh Đào, Thiên Hà Ba Đê hoặc Thuần Khiết!",
        audio: "tour_step_5.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#fireworksBtn",
        title: "🎆 Bước 6: Bắn Pháo Hoa Trái Tim",
        desc: "Bắn những chùm pháo hoa trái tim rực rỡ bùng nổ khắp bầu trời đêm! ✨",
        voice: "Bắn những chùm pháo hoa trái tim rực rỡ bùng nổ khắp bầu trời đêm!",
        audio: "tour_step_6.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#loveDaysWidget",
        title: "⏳ Bước 7: Đồng Hồ Đếm Ngày Yêu",
        desc: "Đồng hồ tình yêu đếm từng giây từng phút kỷ niệm bên nhau ngọt ngào! 💕",
        voice: "Đồng hồ tình yêu đếm từng giây từng phút kỷ niệm bên nhau ngọt ngào!",
        audio: "tour_step_7.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#nameEditorBtn",
        title: "✍️ Bước 8: Đổi Tên & Lời Chúc",
        desc: "Tùy chỉnh tên người thương, ngày kỷ niệm và bức thư tình theo ý bạn! 💌",
        voice: "Tùy chỉnh tên người thương, ngày kỷ niệm và bức thư tình theo ý bạn!",
        audio: "tour_step_8.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#musicGenreToggle",
        title: "🎸 Bước 9: Đổi Ca Sĩ Thần Tượng",
        desc: "Chuyển đổi giữa dòng nhạc Acoustic của Vũ và Sơn Tùng M-TP sôi động! 🔥",
        voice: "Chuyển đổi giữa dòng nhạc Acoustic của Vũ và Sơn Tùng M-TP sôi động!",
        audio: "tour_step_9.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#openPlaylistBtn",
        title: "🎵 Bước 10: Kho Nhạc Bản Gốc",
        desc: "Chọn bài hát yêu thích hoặc tải lên file nhạc MP3 từ máy của bạn! 🎧",
        voice: "Chọn bài hát yêu thích hoặc tải lên file nhạc MP3 từ máy của bạn!",
        audio: "tour_step_10.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#letterBtn",
        title: "💌 Bước 11: Bức Thư Tình Bí Mật",
        desc: "Mở phong thư tình lãng mạn với hiệu ứng gõ chữ tự động ấm áp! 📜",
        voice: "Mở phong thư tình lãng mạn với hiệu ứng gõ chữ tự động ấm áp!",
        audio: "tour_step_11.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#authorBtn",
        title: "👑 Bước 12: Tác Giả Mai IT",
        desc: "Thông tin tác giả Mai IT, người sáng tạo không gian vũ trụ trái tim này! 💻",
        voice: "Thông tin tác giả Mai IT, người sáng tạo không gian vũ trụ trái tim này!",
        audio: "tour_step_12.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#catSquad",
        title: "🐾 Bước 13: Hội Bé Mèo Nhảy Múa",
        desc: "Bấm vào 4 bé mèo đang quẩy TikTok, Vinahouse và Hiphop siêu đáng yêu! 🐱",
        voice: "Bấm vào bốn bé mèo đang quẩy TikTok, Vinahouse và Hiphop siêu đáng yêu!",
        audio: "tour_step_13.mp3",
        placement: "top",
        closeHub: true
    },
    {
        target: "#gooseSquad",
        title: "🪿 Bước 14: Đôi Bé Ngỗng Quẩy Dễ Thương",
        desc: "Bấm vào đôi bé ngỗng ở góc trái đang quẩy Disco Waddle và Honk Honk siêu hài hước! 🪿✨",
        voice: "Bước mười bốn. Bấm vào đôi bé ngỗng ở góc trái đang quẩy đít co và hông hông siêu hài hước nhé!",
        audio: "tour_step_14.mp3",
        placement: "top",
        closeHub: true
    },
    {
        target: "#musicToggle",
        title: "💿 Bước 15: Đĩa Nhạc & Bụi Tiên",
        desc: "Bật tắt nhạc nền và di chuột để trải nghiệm vệt bụi tiên diệu kỳ nhé! Chúc bạn luôn hạnh phúc! 🪄✨",
        voice: "Bước mười lăm. Bật tắt nhạc nền và di chuột để trải nghiệm vệt bụi tiên diệu kỳ nhé! Chúc hai bạn luôn hạnh phúc bên nhau!",
        audio: "tour_step_15.mp3",
        placement: "bottom",
        closeHub: true
    }
];

let currentTourStep = 0;
let isTourActive = false;

const tourOverlay = document.getElementById("tourOverlay");
const tourSpotlight = document.getElementById("tourSpotlight");
const tourPointer = document.getElementById("tourPointer");
const tourCard = document.getElementById("tourCard");
const tourStepBadge = document.getElementById("tourStepBadge");
const tourTitle = document.getElementById("tourTitle");
const tourDesc = document.getElementById("tourDesc");
const tourDots = document.getElementById("tourDots");
const tourNextBtn = document.getElementById("tourNextBtn");
const tourPrevBtn = document.getElementById("tourPrevBtn");
const tourSkipBtn = document.getElementById("tourSkipBtn");
const tourCloseBtn = document.getElementById("tourCloseBtn");
const tourGuideBtn = document.getElementById("tourGuideBtn");
const topTourGuideBtn = document.getElementById("topTourGuideBtn");
const tourVoiceBtn = document.getElementById("tourVoiceBtn");

let tourVoiceAudio = new Audio();
let tourVoiceTimer = null;

// Phát chuông phép thuật nhẹ nhàng vui tươi
function playTourMagicChime() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    playChimeNote(659.25, 0, 0.25); // E5
    playChimeNote(880.00, 0.06, 0.35); // A5
    playChimeNote(1046.50, 0.12, 0.45); // C6
}

// Phát giọng nói hướng dẫn tiếng Việt 100% chuẩn xác qua file MP3 Studio
function speakTourVoice(step) {
    if (!step) return;
    pauseMusicForVoice();
    isVoiceSpeaking = true;
    playTourMagicChime();

    clearTimeout(tourVoiceTimer);
    tourVoiceTimer = setTimeout(() => {
        if (!tourVoiceAudio) tourVoiceAudio = new Audio();
        tourVoiceAudio.pause();
        tourVoiceAudio.currentTime = 0;

        if (step.audio) {
            tourVoiceAudio.src = step.audio;
            tourVoiceAudio.onended = () => {
                isVoiceSpeaking = false;
            };
            tourVoiceAudio.onpause = () => {
                isVoiceSpeaking = false;
            };
            const playPromise = tourVoiceAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    isVoiceSpeaking = false;
                    // Khi vừa tải trang chưa chạm màn hình, trình duyệt sẽ chờ lượt click đầu tiên
                });
            }
        }
    }, 80);
}

if (tourVoiceBtn) {
    tourVoiceBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const step = TOUR_STEPS[currentTourStep];
        if (step) {
            speakTourVoice(step);
        }
    });
}

function renderTourDots() {
    if (!tourDots) return;
    tourDots.innerHTML = "";
    TOUR_STEPS.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = `tour-dot ${idx === currentTourStep ? "active" : ""}`;
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            goToTourStep(idx);
        });
        tourDots.appendChild(dot);
    });
}

function updateTourPosition() {
    if (!isTourActive || !tourOverlay || !tourSpotlight || !tourCard) return;
    const step = TOUR_STEPS[currentTourStep];
    if (!step) return;

    const el = document.querySelector(step.target);
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let targetRect;
    if (step.target === "#heartCanvas" || !el) {
        const size = Math.min(260, winW * 0.65);
        targetRect = {
            left: (winW - size) / 2,
            top: (winH - size) / 2 - 20,
            width: size,
            height: size,
            right: (winW + size) / 2,
            bottom: (winH + size) / 2 - 20
        };
    } else {
        const r = el.getBoundingClientRect();
        targetRect = {
            left: r.left - 4,
            top: r.top - 4,
            width: r.width + 8,
            height: r.height + 8,
            right: r.right + 4,
            bottom: r.bottom + 4
        };
    }

    // Cập nhật vị trí Spotlight chính xác theo tọa độ pixel thực tế
    tourSpotlight.style.left = `${Math.round(targetRect.left)}px`;
    tourSpotlight.style.top = `${Math.round(targetRect.top)}px`;
    tourSpotlight.style.width = `${Math.round(targetRect.width)}px`;
    tourSpotlight.style.height = `${Math.round(targetRect.height)}px`;

    const cardW = Math.min(380, winW * 0.92);
    const cardH = tourCard.offsetHeight || 185;

    let cardLeft = targetRect.left + (targetRect.width / 2) - (cardW / 2);
    cardLeft = Math.max(14, Math.min(winW - cardW - 14, cardLeft));

    let cardTop;
    const hubCard = document.querySelector(".control-hub-card");

    if (step.target === "#catSquad") {
        // Đặt thẻ cao hơn hẳn đàn mèo
        cardTop = Math.max(20, targetRect.top - cardH - 65);
        cardLeft = Math.max(14, Math.min(winW - cardW - 20, targetRect.right - cardW));
    } else if (step.openHub && hubCard) {
        const hubRect = hubCard.getBoundingClientRect();

        // Vị trí tối ưu khi mở menu: Đặt ra ngoài modal để không bao giờ che nút
        if (winH - hubRect.bottom >= cardH + 12) {
            // Đặt ngay bên dưới khung menu
            cardTop = hubRect.bottom + 10;
            cardLeft = (winW - cardW) / 2;
        } else if (hubRect.top >= cardH + 12) {
            // Đặt ngay bên trên khung menu
            cardTop = hubRect.top - cardH - 10;
            cardLeft = (winW - cardW) / 2;
        } else if (hubRect.left >= cardW + 16) {
            // Đặt bên trái khung menu
            cardLeft = hubRect.left - cardW - 12;
            cardTop = Math.max(16, Math.min(winH - cardH - 16, targetRect.top - 20));
        } else if (winW - hubRect.right >= cardW + 16) {
            // Đặt bên phải khung menu
            cardLeft = hubRect.right + 12;
            cardTop = Math.max(16, Math.min(winH - cardH - 16, targetRect.top - 20));
        } else {
            // Màn hình nhỏ: tránh đè lên nút đang highlight
            if (targetRect.top > winH / 2) {
                cardTop = Math.max(12, hubRect.top + 8);
            } else {
                cardTop = Math.min(winH - cardH - 12, hubRect.bottom - cardH - 8);
            }
            if (targetRect.left < winW / 2) {
                cardLeft = Math.min(winW - cardW - 12, targetRect.right + 12);
            } else {
                cardLeft = Math.max(12, targetRect.left - cardW - 12);
            }
        }
    } else if (step.placement === "top" || targetRect.bottom + cardH + 40 > winH) {
        cardTop = Math.max(16, targetRect.top - cardH - 30);
    } else {
        cardTop = Math.min(winH - cardH - 16, targetRect.bottom + 24);
    }

    const bottomNav = document.getElementById("mobileBottomBar");
    const isBottomNavVisible = bottomNav && window.getComputedStyle(bottomNav).display !== "none";
    const maxSafeBottom = isBottomNavVisible ? (winH - cardH - 74) : (winH - cardH - 16);
    cardTop = Math.max(16, Math.min(maxSafeBottom, cardTop));

    tourCard.style.left = `${Math.round(cardLeft)}px`;
    tourCard.style.top = `${Math.round(cardTop)}px`;

    // Cập nhật vị trí Pointer bàn tay 👆
    if (tourPointer) {
        if (cardTop < targetRect.top) {
            // Thẻ ở phía trên nút -> bàn tay ở giữa chỉ xuống
            tourPointer.style.left = `${Math.round(targetRect.left + targetRect.width / 2 - 16)}px`;
            tourPointer.style.top = `${Math.round(targetRect.top - 46)}px`;
            tourPointer.style.transform = "rotate(180deg)";
        } else {
            // Thẻ ở phía dưới nút -> bàn tay ở giữa chỉ lên
            tourPointer.style.left = `${Math.round(targetRect.left + targetRect.width / 2 - 16)}px`;
            tourPointer.style.top = `${Math.round(targetRect.bottom + 8)}px`;
            tourPointer.style.transform = "rotate(0deg)";
        }
    }
}

// Theo dõi bám sát vị trí theo từng khung hình để không bị lệch khi modal đang chuyển động
function syncTourTracking(duration = 500) {
    const startTime = performance.now();
    function trackFrame(now) {
        if (!isTourActive) return;
        updateTourPosition();
        if (now - startTime < duration) {
            requestAnimationFrame(trackFrame);
        }
    }
    requestAnimationFrame(trackFrame);
}

function goToTourStep(stepIdx) {
    if (stepIdx < 0 || stepIdx >= TOUR_STEPS.length) return;
    currentTourStep = stepIdx;
    const step = TOUR_STEPS[currentTourStep];

    if (step.openHub) {
        openControlHub();
    } else if (step.closeHub) {
        closeControlHub();
    }

    if (tourStepBadge) tourStepBadge.textContent = `BƯỚC ${currentTourStep + 1} / ${TOUR_STEPS.length}`;
    if (tourTitle) tourTitle.textContent = step.title;
    if (tourDesc) tourDesc.textContent = step.desc;

    if (tourPrevBtn) {
        tourPrevBtn.style.display = currentTourStep === 0 ? "none" : "block";
    }

    if (tourNextBtn) {
        if (currentTourStep === TOUR_STEPS.length - 1) {
            tourNextBtn.textContent = "Hoàn tất & Bắt đầu ✨";
        } else {
            tourNextBtn.textContent = "Tiếp tục →";
        }
    }

    renderTourDots();
    syncTourTracking(500);

    // Tự động phát âm thanh giọng nói tiếng Việt vui tươi
    speakTourVoice(step);
}

function closeTour(startMusicAfter = true) {
    isTourActive = false;
    clearTimeout(tourVoiceTimer);
    if (tourVoiceAudio) {
        tourVoiceAudio.pause();
        tourVoiceAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (tourOverlay) tourOverlay.classList.remove("active");
    closeControlHub();
    if (startMusicAfter && !isMusicPlaying) {
        startAudio();
    }
}

function startTour() {
    isTourActive = true;
    if (tourOverlay) tourOverlay.classList.add("active");
    goToTourStep(0);
}

let isStepChanging = false;

function handleTourNext(e) {
    if (e) {
        e.stopPropagation();
    }
    if (isStepChanging) return;
    isStepChanging = true;
    setTimeout(() => { isStepChanging = false; }, 280);

    if (currentTourStep < TOUR_STEPS.length - 1) {
        goToTourStep(currentTourStep + 1);
    } else {
        // Chỉ phát nhạc khi đã hoàn thành bước cuối cùng của hướng dẫn
        closeTour(true);
    }
}

function handleTourPrev(e) {
    if (e) {
        e.stopPropagation();
    }
    if (isStepChanging) return;
    isStepChanging = true;
    setTimeout(() => { isStepChanging = false; }, 280);

    if (currentTourStep > 0) {
        goToTourStep(currentTourStep - 1);
    }
}

function handleTourClose(e) {
    if (e) e.stopPropagation();
    closeTour(true);
}

if (tourNextBtn) tourNextBtn.addEventListener("click", handleTourNext);
if (tourPrevBtn) tourPrevBtn.addEventListener("click", handleTourPrev);
if (tourCloseBtn) tourCloseBtn.addEventListener("click", handleTourClose);
if (tourSkipBtn) tourSkipBtn.addEventListener("click", handleTourClose);
if (tourGuideBtn) tourGuideBtn.addEventListener("click", (e) => { if (e) e.stopPropagation(); startTour(); });
if (topTourGuideBtn) topTourGuideBtn.addEventListener("click", (e) => { if (e) e.stopPropagation(); startTour(); });

if (tourCard) {
    tourCard.addEventListener("click", (e) => {
        // Nếu không bấm vào nút đóng/bỏ qua/tiếp tục thì đọc lại lời thoại
        if (!e.target.closest("button")) {
            const step = TOUR_STEPS[currentTourStep];
            if (step) speakTourVoice(step);
        }
    });
}

window.addEventListener("resize", () => {
    if (isTourActive) updateTourPosition();
});

// Tự động khởi chạy tour hướng dẫn ngay khi mở trang
setTimeout(() => {
    startTour();
}, 350);

// ==========================================
// 12. MOBILE BOTTOM NAVIGATION DOCK CONTROLLER
// ==========================================
const mobShapeBtn = document.getElementById("mobShapeBtn");
const mobThemeBtn = document.getElementById("mobThemeBtn");
const mobFireworksBtn = document.getElementById("mobFireworksBtn");
const mobLetterBtn = document.getElementById("mobLetterBtn");
const mobHubBtn = document.getElementById("mobHubBtn");

function updateMobileDockIcons() {
    const mobShapeIcon = document.getElementById("mobShapeIcon");
    const mobThemeIcon = document.getElementById("mobThemeIcon");
    if (mobShapeIcon && curShape) mobShapeIcon.textContent = curShape.icon;
    if (mobThemeIcon && curTheme) mobThemeIcon.textContent = curTheme.icon;
}
updateMobileDockIcons();

if (mobShapeBtn) {
    mobShapeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic(30);
        selectShape();
        updateMobileDockIcons();
    });
}

if (mobThemeBtn) {
    mobThemeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic(30);
        selectTheme();
        updateMobileDockIcons();
    });
}

if (mobFireworksBtn) {
    mobFireworksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic([40, 60, 40]);
        launchHeartFireworks();
        setTimeout(() => launchHeartFireworks(), 260);
        setTimeout(() => launchHeartFireworks(), 520);
        showToastCard("🎆 Bùng Nổ Pháo Hoa Trái Tim!", "Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao! ✨💖", 6000, "Bùng nổ pháo hoa trái tim! Chúc cho tình cảm của hai bạn mãi rực rỡ và lấp lánh như ngàn vì sao!", "fireworks_story.mp3");
    });
}

if (mobLetterBtn) {
    mobLetterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic(35);
        openLoveLetter();
    });
}

if (mobHubBtn) {
    mobHubBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic(35);
        if (controlHubModal && controlHubModal.classList.contains("open")) {
            closeControlHub();
        } else {
            openControlHub();
        }
    });
}


