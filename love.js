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
    { id: "flower", name: "Hoa Hồng", icon: "🌸" },
    { id: "sphere", name: "Quả Cầu", icon: "🔮" },
    { id: "ribbon", name: "Lụa Vô Cực", icon: "♾️" },
    { id: "crystal", name: "Pha Lê", icon: "💎" }
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

function normalizeShapeId(id) {
    if (!id) return "galaxy";
    if (id === "rose") return "flower";
    if (id === "orb") return "sphere";
    if (id === "infinity") return "ribbon";
    if (id === "glass") return "crystal";
    return id;
}

function selectShape(shapeId) {
    const targetId = normalizeShapeId(shapeId);
    const idx = SHAPES.findIndex(s => s.id === targetId);
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
        const cShape = normalizeShapeId(chip.getAttribute("data-shape"));
        if (cShape === curShape.id) {
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

// Hệ thống 90 vì sao và dải xoắn ốc 3D toàn cảnh không gian mượt mà
const bgGalaxyStars = [];
for (let i = 0; i < 90; i++) {
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

    for (let i = 0; i < bgGalaxyStars.length; i++) {
        const s = bgGalaxyStars[i];
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

function stopAllVoicesAndDialogues(keepToast = false) {
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) { }
    }
    if (storyAudio) {
        try {
            storyAudio.pause();
            storyAudio.currentTime = 0;
        } catch (e) { }
    }
    if (tourVoiceAudio) {
        try {
            tourVoiceAudio.pause();
            tourVoiceAudio.currentTime = 0;
        } catch (e) { }
    }
    if (typeof catVoiceAudios === "object" && catVoiceAudios) {
        Object.values(catVoiceAudios).forEach(a => {
            if (a) {
                try {
                    a.pause();
                    a.currentTime = 0;
                } catch (e) { }
            }
        });
    }
    if (typeof gooseVoiceAudios === "object" && gooseVoiceAudios) {
        Object.values(gooseVoiceAudios).forEach(a => {
            if (a) {
                try {
                    a.pause();
                    a.currentTime = 0;
                } catch (e) { }
            }
        });
    }
    if (typeof genreAudio !== "undefined" && genreAudio) {
        try {
            genreAudio.pause();
            genreAudio.currentTime = 0;
        } catch (e) { }
    }
    clearTimeout(tourVoiceTimer);
    clearTimeout(toastBadgeTimeout);
    isVoiceSpeaking = false;

    if (!keepToast && comboBadge) {
        comboBadge.classList.remove("active");
    }
    document.querySelectorAll(".cat-bubble.active").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".goose-bubble.active").forEach(b => b.classList.remove("active"));
    resumeMusicAfterVoice(300);
}

function speakStoryVoice(text, audioFile = "") {
    if (!text && !audioFile) return;
    currentStoryVoiceText = text;
    currentStoryAudioFile = audioFile;

    // 1. Tắt nhạc nền ngay khi bắt đầu lời kể
    pauseMusicForVoice();

    // Dừng toàn bộ âm thanh giọng đọc trước đó để không bị chồng chéo dính chữ
    if (storyAudio) {
        try {
            storyAudio.pause();
            storyAudio.currentTime = 0;
        } catch (e) { }
    }
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) { }
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
    // Dừng toàn bộ âm thanh và bong bóng thoại trước đó để tránh chồng chéo / dính chữ
    stopAllVoicesAndDialogues(true);

    currentStoryVoiceText = voiceText || descHtml.replace(/<[^>]*>?/gm, '').replace(/["']/g, '');
    currentStoryAudioFile = audioFile;

    comboBadge.innerHTML = `
        <button class="combo-close-btn" id="closeStoryToastBtn" title="Đóng">&times;</button>
        <span class="combo-badge-title">${titleHtml}</span>
        <span class="combo-badge-quote">${descHtml}</span>
        ${audioFile ? `
        <div class="combo-badge-actions">
            <button class="combo-voice-btn" id="replayStoryVoiceBtn">🔊 Nghe Lời Kể</button>
            <button class="combo-voice-btn" id="stopStoryVoiceBtn" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);">⏹️ Tắt Tiếng</button>
        </div>` : ''}
    `;
    comboBadge.classList.add("active");

    const closeBtn = document.getElementById("closeStoryToastBtn");
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            stopAllVoicesAndDialogues(false);
        };
    }

    const stopBtn = document.getElementById("stopStoryVoiceBtn");
    if (stopBtn) {
        stopBtn.onclick = (e) => {
            e.stopPropagation();
            stopAllVoicesAndDialogues(true);
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
// 3. HỘP THƯ TÌNH YÊU & LƯU TRỮ LỊCH SỬ THƯ (Love Mailbox & History System)
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

// Romantic Preset Templates
const ROMANTIC_TEMPLATES = {
    morning: {
        title: "Chào buổi sáng rạng rỡ & ngọt ngào ☀️",
        mood: "💖",
        content: `Chào buổi sáng người anh/em yêu nhất! ☀️✨\n\nChúc em/anh một ngày mới thật nhiều năng lượng, làm việc hay học tập thật vui vẻ và luôn giữ nụ cười xinh trên môi nhé. Hãy nhớ là luôn có một người đang rất nhớ và thương em/anh ở đây nha! Yêu em/anh nhiều! 🌸🥰`
    },
    night: {
        title: "Nhớ người thương giữa đêm ngàn sao 🌙",
        mood: "🌙",
        content: `Đêm đã khuya rồi, ngoài trời gió mát và muôn ngàn vì sao đang lấp lánh... 🌌\n\nAnh/em chỉ muốn gửi một lời chúc ngủ ngon thật ấm áp đến em/anh. Hãy gạt bỏ hết mọi âu lo, mệt mỏi của ngày hôm nay và có một giấc ngủ thật ngon, mơ về những điều ngọt ngào nhất nhé! Yêu em/anh 3000! 💫❤️`
    },
    promise: {
        title: "Lời hứa & ước hẹn bên nhau trọn đời 💍",
        mood: "💍",
        content: `Gửi người đặc biệt nhất trong cuộc đời anh/em... 💖\n\nDù thời gian có trôi qua bao lâu, dù thế giới ngoài kia có đổi thay thế nào, anh/em vẫn luôn hứa sẽ nắm chặt tay em/anh, cùng nhau vượt qua mọi khó khăn và xây đắp một tương lai thật hạnh phúc. Mãi mãi bên nhau nhé! 💍✨`
    },
    thanks: {
        title: "Cảm ơn vì đã luôn ở bên cạnh 🌸",
        mood: "🌸",
        content: `Cảm ơn em/anh vì đã bước vào cuộc sống của anh/em, mang đến cho anh/em những nụ cười, sự ấm áp và bình yên.\n\nCó em/anh ở bên cạnh, mỗi ngày bình thường đều trở nên thật kỳ diệu. Cảm ơn em/anh vì tất cả những yêu thương và sự dịu dàng dành cho anh/em! 🌸💖`
    },
    sorry: {
        title: "Lời xin lỗi & dỗ dành người yêu 🥺",
        mood: "🥺",
        content: `Anh/em biết hôm nay mình đã làm em/anh buồn một chút rồi... 🥺🐾\n\nAnh/em xin lỗi người yêu nhiều lắm nha! Đừng giận anh/em nữa nhé, cho anh/em xin một cái ôm thật chặt để bù đắp nè. Anh/em thương em/anh nhất trên đời luôn á! Mau cười lên với anh/em nha! 🍓💖`
    },
    weekend: {
        title: "Hẹn hò cuối tuần lãng mạn ☕",
        mood: "☕",
        content: `Cuối tuần này mình cùng đi dạo phố, uống trà sữa/cà phê và ăn những món ngon em/anh thích nhé! ☕🍰\n\nChỉ cần được ở bên cạnh em/anh, ngồi ngắm nụ cười của em/anh là mọi muộn phiền đều tan biến hết. Hẹn gặp em/anh cuối tuần này nha! 🛵✨`
    }
};

function getDefaultLetters() {
    const sName = senderName || "Mai IT";
    const rName = recipientName || "Kim Thanh";
    const firstContent = customLoveLetter || `Giữa hơn 8 tỷ người trên trái đất và muôn ngàn vì sao trong vũ trụ bao la, gặp được em là điều kỳ diệu và may mắn nhất của ${sName}.\n\nCảm ơn em vì đã đến, mang theo nụ cười rạng rỡ và sưởi ấm thế giới này. Chúc em mỗi ngày đều tràn ngập niềm vui, tiếng cười và luôn luôn hạnh phúc nhé! ❤️`;

    return [
        {
            id: "letter_default_1",
            sender: sName,
            recipient: rName,
            title: "Gửi người đặc biệt nhất... ✨",
            mood: "💖",
            date: "2026-08-30T13:30",
            content: firstContent
        },
        {
            id: "letter_default_2",
            sender: rName,
            recipient: sName,
            title: "Hồi đáp: Trái tim em cũng vậy! 🌸",
            mood: "🌸",
            date: "2026-08-31T09:15",
            content: `Nhận được bức thư của anh làm em vui cả ngày luôn á! 🥰\n\nCảm ơn anh vì đã luôn kiên nhẫn, yêu thương và tạo nên những điều lãng mạn ngọt ngào dành riêng cho em. Em cũng mong chúng mình sẽ cùng nhau đi qua thật nhiều mùa hoa, cùng nhau cười và chia sẻ mọi khoảnh khắc trong cuộc sống nhé! 💖✨`
        },
        {
            id: "letter_default_3",
            sender: sName,
            recipient: rName,
            title: "Kỷ niệm ngày bên nhau & Lời hứa tương lai 💍",
            mood: "✨",
            date: "2026-09-01T20:00",
            content: `Mỗi ngày trôi qua có em bên cạnh đều là một ngày tuyệt vời. Dù ngoài kia thế giới có ồn ào hay vội vã thế nào, chỉ cần quay về bên em là bình yên lại ngập tràn.\n\nAnh hứa sẽ luôn là chỗ dựa vững chắc, luôn lắng nghe và yêu thương em hơn mỗi ngày! 🌟🥰`
        }
    ];
}

// Mailbox state
let loveLetters = [];
let currentLetterIdx = 0;
let currentMailboxTab = "read";
let historyFilterType = "all";
let historySearchQuery = "";
let currentComposeMood = "💖";

// DOM Elements
const letterModal = document.getElementById("letterModal");
const letterBtn = document.getElementById("letterBtn");
const topLetterBtn = document.getElementById("topLetterBtn");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const letterModalBackdrop = document.getElementById("letterModalBackdrop");

// Reader elements
const typewriterText = document.getElementById("typewriterText");
const readerSender = document.getElementById("readerSender");
const readerRecipient = document.getElementById("readerRecipient");
const readerMood = document.getElementById("readerMood");
const readerDate = document.getElementById("readerDate");
const readerTitle = document.getElementById("readerTitle");
const readerSignature = document.getElementById("readerSignature");
const btnVoiceLetter = document.getElementById("btnVoiceLetter");
const btnReplayTypewriter = document.getElementById("btnReplayTypewriter");
const btnReplyLetter = document.getElementById("btnReplyLetter");
const btnEditCurrentLetter = document.getElementById("btnEditCurrentLetter");
const btnPrevLetter = document.getElementById("btnPrevLetter");
const btnNextLetter = document.getElementById("btnNextLetter");
const letterPageIndicator = document.getElementById("letterPageIndicator");

// History elements
const letterHistoryList = document.getElementById("letterHistoryList");
const letterHistoryBadge = document.getElementById("letterHistoryBadge");
const letterSearchInput = document.getElementById("letterSearchInput");
const btnNewLetterFromHistory = document.getElementById("btnNewLetterFromHistory");
const filterAllLetters = document.getElementById("filterAllLetters");
const filterSenderLetters = document.getElementById("filterSenderLetters");
const filterRecipientLetters = document.getElementById("filterRecipientLetters");
const countAllLetters = document.getElementById("countAllLetters");
const countSenderLetters = document.getElementById("countSenderLetters");
const countRecipientLetters = document.getElementById("countRecipientLetters");
const filterSenderName = document.getElementById("filterSenderName");
const filterRecipientName = document.getElementById("filterRecipientName");

// Compose elements
const composeFormTitle = document.getElementById("composeFormTitle");
const inputLetterEditId = document.getElementById("inputLetterEditId");
const senderChoiceRow = document.getElementById("senderChoiceRow");
const recipientChoiceRow = document.getElementById("recipientChoiceRow");
const inputCustomSender = document.getElementById("inputCustomSender");
const inputCustomRecipient = document.getElementById("inputCustomRecipient");
const moodSelectorRow = document.getElementById("moodSelectorRow");
const letterTemplateSelect = document.getElementById("letterTemplateSelect");
const inputLetterTitle = document.getElementById("inputLetterTitle");
const inputLetterBody = document.getElementById("inputLetterBody");
const inputLetterDate = document.getElementById("inputLetterDate");
const letterCharCounter = document.getElementById("letterCharCounter");
const btnSaveLetter = document.getElementById("btnSaveLetter");
const saveLetterBtnIcon = document.getElementById("saveLetterBtnIcon");
const saveLetterBtnText = document.getElementById("saveLetterBtnText");
const btnCancelEditLetter = document.getElementById("btnCancelEditLetter");

// Guide & Sync elements
const btnCopySyncCode = document.getElementById("btnCopySyncCode");
const inputSyncCode = document.getElementById("inputSyncCode");
const btnImportSyncCode = document.getElementById("btnImportSyncCode");
const btnExportJson = document.getElementById("btnExportJson");
const btnTriggerImportJson = document.getElementById("btnTriggerImportJson");
const fileImportJson = document.getElementById("fileImportJson");
const btnResetDefaultLetters = document.getElementById("btnResetDefaultLetters");

let typewriterInterval = null;
let letterAudio = new Audio("love_letter.mp3");
let isVoiceReadingLetter = false;

function loadLoveLetters() {
    try {
        const raw = localStorage.getItem("love_letter_history");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                loveLetters = parsed;
                updateLetterHistoryBadge();
                return;
            }
        }
    } catch (e) { }

    loveLetters = getDefaultLetters();
    saveLoveLetters(loveLetters);
}

function saveLoveLetters(letters) {
    loveLetters = letters;
    try {
        localStorage.setItem("love_letter_history", JSON.stringify(letters));
    } catch (e) { }
    updateLetterHistoryBadge();
}

function updateLetterHistoryBadge() {
    if (letterHistoryBadge) {
        letterHistoryBadge.textContent = (loveLetters && loveLetters.length) || 0;
    }
}

function formatLetterDate(dateStr) {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${hours}:${mins} • ${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
}

function encodeSyncCode(data) {
    const jsonStr = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }));
}

function decodeSyncCode(code) {
    const decoded = decodeURIComponent(Array.prototype.map.call(atob(code.trim()), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(decoded);
}

function switchLetterTab(tabName) {
    currentMailboxTab = tabName;
    document.querySelectorAll(".letter-nav-tab").forEach(tab => {
        if (tab.getAttribute("data-tab") === tabName) {
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
        } else {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
        }
    });

    document.querySelectorAll(".letter-pane").forEach(pane => {
        pane.classList.remove("active");
    });

    const targetPane = document.getElementById("paneLetter" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (targetPane) {
        targetPane.classList.add("active");
    }

    if (tabName === "read") {
        displayLetter(currentLetterIdx, true);
    } else if (tabName === "history") {
        renderLetterHistory(historySearchQuery, historyFilterType);
    } else if (tabName === "compose") {
        if (!inputLetterEditId || !inputLetterEditId.value) {
            setupComposeFormDefaults();
        }
    }
}

function displayLetter(idxOrId, shouldTypewrite = true) {
    if (!loveLetters || loveLetters.length === 0) {
        loadLoveLetters();
    }
    let idx = 0;
    if (typeof idxOrId === "number") {
        idx = Math.max(0, Math.min(idxOrId, loveLetters.length - 1));
    } else if (typeof idxOrId === "string") {
        const found = loveLetters.findIndex(l => l.id === idxOrId);
        idx = found !== -1 ? found : 0;
    }
    currentLetterIdx = idx;
    const letter = loveLetters[idx];
    if (!letter) return;

    if (readerSender) readerSender.textContent = letter.sender || senderName;
    if (readerRecipient) readerRecipient.textContent = letter.recipient || recipientName;
    if (readerMood) readerMood.textContent = letter.mood || "💖";
    if (readerDate) readerDate.textContent = formatLetterDate(letter.date);
    if (readerTitle) readerTitle.textContent = letter.title || "Gửi Người Đặc Biệt Nhất... ✨";
    if (readerSignature) readerSignature.textContent = `Forever With Love ❤️ • ${letter.sender || senderName}`;

    if (letterPageIndicator) {
        letterPageIndicator.textContent = `Thư ${idx + 1} / ${loveLetters.length}`;
    }
    if (btnPrevLetter) btnPrevLetter.disabled = idx === 0;
    if (btnNextLetter) btnNextLetter.disabled = idx >= loveLetters.length - 1;

    const letterContent = letter.content || "";
    if (typewriterText) {
        typewriterText.textContent = "";
        clearInterval(typewriterInterval);

        if (shouldTypewrite) {
            let charIndex = 0;
            const speed = letterContent.length > 350 ? 18 : 28;
            typewriterInterval = setInterval(() => {
                if (charIndex < letterContent.length) {
                    typewriterText.textContent += letterContent[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typewriterInterval);
                }
            }, speed);
        } else {
            typewriterText.textContent = letterContent;
        }
    }
}

function openLoveLetter(letterIdOrTab) {
    if (!letterModal) return;
    loadLoveLetters();
    letterModal.classList.add("open");
    pauseMusicForVoice();

    if (letterIdOrTab === "history" || letterIdOrTab === "compose" || letterIdOrTab === "guide") {
        switchLetterTab(letterIdOrTab);
    } else if (typeof letterIdOrTab === "string" && letterIdOrTab.startsWith("letter_")) {
        const idx = loveLetters.findIndex(l => l.id === letterIdOrTab);
        if (idx !== -1) currentLetterIdx = idx;
        switchLetterTab("read");
    } else {
        switchLetterTab("read");
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
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    isVoiceReadingLetter = false;
    updateVoiceButtonState();
    resumeMusicAfterVoice(400);
}

function renderLetterHistory(query = "", filter = "all") {
    if (!letterHistoryList) return;
    historySearchQuery = (query || "").trim().toLowerCase();
    historyFilterType = filter || "all";

    const sName = (senderName || "Mai IT").toLowerCase();
    const rName = (recipientName || "Kim Thanh").toLowerCase();

    const filtered = loveLetters.filter(letter => {
        const matchesQuery = !historySearchQuery ||
            (letter.title && letter.title.toLowerCase().includes(historySearchQuery)) ||
            (letter.content && letter.content.toLowerCase().includes(historySearchQuery)) ||
            (letter.sender && letter.sender.toLowerCase().includes(historySearchQuery)) ||
            (letter.recipient && letter.recipient.toLowerCase().includes(historySearchQuery));

        if (!matchesQuery) return false;

        if (historyFilterType === "sender") {
            return (letter.sender || "").toLowerCase().includes(sName);
        } else if (historyFilterType === "recipient") {
            return (letter.sender || "").toLowerCase().includes(rName);
        }
        return true;
    });

    if (countAllLetters) countAllLetters.textContent = loveLetters.length;
    if (letterHistoryBadge) letterHistoryBadge.textContent = loveLetters.length;

    const senderCount = loveLetters.filter(l => (l.sender || "").toLowerCase().includes(sName)).length;
    const recipientCount = loveLetters.filter(l => (l.sender || "").toLowerCase().includes(rName)).length;
    if (countSenderLetters) countSenderLetters.textContent = senderCount;
    if (countRecipientLetters) countRecipientLetters.textContent = recipientCount;
    if (filterSenderName) filterSenderName.textContent = senderName || "Mai IT";
    if (filterRecipientName) filterRecipientName.textContent = recipientName || "Kim Thanh";

    if (filtered.length === 0) {
        letterHistoryList.innerHTML = `
            <div class="history-empty-state">
                <div class="empty-icon">💌</div>
                <p><b>Không tìm thấy bức thư nào!</b></p>
                <p style="font-size:0.8rem;opacity:0.8;">Hãy viết thêm một bức thư ngọt ngào gửi gắm tâm tư nhé 💕</p>
            </div>
        `;
        return;
    }

    letterHistoryList.innerHTML = filtered.map((item) => {
        const isFromSender = (item.sender || "").toLowerCase().includes(sName);
        const senderBadgeClass = isFromSender ? "sender-badge" : "recipient-badge";
        const senderIcon = isFromSender ? "👑" : "💖";
        const cleanSnippet = (item.content || "").replace(/\n+/g, " ");

        return `
            <div class="history-card-item" data-id="${item.id}">
                <div class="history-card-header">
                    <div class="history-card-routes">
                        <span class="${senderBadgeClass}">${senderIcon} <b>${item.sender || 'Người gửi'}</b></span>
                        <span class="route-arrow">➔</span>
                        <span><b>${item.recipient || 'Người nhận'}</b></span>
                    </div>
                    <span class="history-card-mood">${item.mood || '💖'}</span>
                </div>
                <h4 class="history-card-title">${item.title || 'Bức Thư Tình Yêu'}</h4>
                <p class="history-card-snippet">${cleanSnippet}</p>
                <div class="history-card-footer">
                    <span class="history-card-date">⏳ ${formatLetterDate(item.date)}</span>
                    <div class="history-card-actions">
                        <button class="history-icon-btn read-btn" data-id="${item.id}" title="Đọc thư">📖 Đọc</button>
                        <button class="history-icon-btn edit-btn" data-id="${item.id}" title="Sửa thư">✏️ Sửa</button>
                        <button class="history-icon-btn copy-btn" data-id="${item.id}" title="Sao chép nội dung">📋 Chép</button>
                        <button class="history-icon-btn delete-btn delete" data-id="${item.id}" title="Xóa thư">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    letterHistoryList.querySelectorAll(".history-card-item").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".history-card-actions")) return;
            const letterId = card.getAttribute("data-id");
            openLoveLetter(letterId);
        });
    });

    letterHistoryList.querySelectorAll(".read-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const letterId = btn.getAttribute("data-id");
            openLoveLetter(letterId);
        });
    });

    letterHistoryList.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const letterId = btn.getAttribute("data-id");
            startEditLetter(letterId);
        });
    });

    letterHistoryList.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const letterId = btn.getAttribute("data-id");
            copyLetterContent(letterId);
        });
    });

    letterHistoryList.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const letterId = btn.getAttribute("data-id");
            deleteLetter(letterId);
        });
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function copyLetterContent(letterId) {
    const targetLetter = loveLetters.find(l => l.id === letterId);
    if (targetLetter) {
        const fullText = `💌 [${targetLetter.title}]\nTừ: ${targetLetter.sender} ➔ Gửi: ${targetLetter.recipient}\nNgày: ${formatLetterDate(targetLetter.date)}\n\n${targetLetter.content}`;
        navigator.clipboard.writeText(fullText).then(() => {
            showToastCard("📋 Đã Sao Chép!", "Nội dung bức thư đã được sao chép vào clipboard! ✨", 3500);
        }).catch(() => { });
    }
}

function setupSenderRecipientChoices(currSender, currRecipient) {
    const sName = senderName || "Mai IT";
    const rName = recipientName || "Kim Thanh";

    const effectiveSender = currSender || sName;
    const effectiveRecipient = currRecipient || rName;

    if (senderChoiceRow) {
        senderChoiceRow.innerHTML = `
            <button type="button" class="choice-chip ${effectiveSender === sName ? 'active' : ''}" data-role="sender" data-val="${sName}">👑 ${sName}</button>
            <button type="button" class="choice-chip ${effectiveSender === rName ? 'active' : ''}" data-role="sender" data-val="${rName}">💖 ${rName}</button>
            <button type="button" class="choice-chip ${effectiveSender !== sName && effectiveSender !== rName ? 'active' : ''}" data-role="sender" data-val="__custom__">✍️ Tùy chọn...</button>
        `;

        senderChoiceRow.querySelectorAll(".choice-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                senderChoiceRow.querySelectorAll(".choice-chip").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                const val = chip.getAttribute("data-val");
                if (val === "__custom__") {
                    if (inputCustomSender) {
                        inputCustomSender.style.display = "block";
                        inputCustomSender.focus();
                    }
                } else {
                    if (inputCustomSender) inputCustomSender.style.display = "none";
                }
            });
        });
    }

    if (inputCustomSender) {
        if (effectiveSender !== sName && effectiveSender !== rName) {
            inputCustomSender.style.display = "block";
            inputCustomSender.value = effectiveSender;
        } else {
            inputCustomSender.style.display = "none";
            inputCustomSender.value = "";
        }
    }

    if (recipientChoiceRow) {
        recipientChoiceRow.innerHTML = `
            <button type="button" class="choice-chip ${effectiveRecipient === rName ? 'active' : ''}" data-role="recipient" data-val="${rName}">💖 ${rName}</button>
            <button type="button" class="choice-chip ${effectiveRecipient === sName ? 'active' : ''}" data-role="recipient" data-val="${sName}">👑 ${sName}</button>
            <button type="button" class="choice-chip ${effectiveRecipient !== sName && effectiveRecipient !== rName ? 'active' : ''}" data-role="recipient" data-val="__custom__">✍️ Tùy chọn...</button>
        `;

        recipientChoiceRow.querySelectorAll(".choice-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                recipientChoiceRow.querySelectorAll(".choice-chip").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                const val = chip.getAttribute("data-val");
                if (val === "__custom__") {
                    if (inputCustomRecipient) {
                        inputCustomRecipient.style.display = "block";
                        inputCustomRecipient.focus();
                    }
                } else {
                    if (inputCustomRecipient) inputCustomRecipient.style.display = "none";
                }
            });
        });
    }

    if (inputCustomRecipient) {
        if (effectiveRecipient !== sName && effectiveRecipient !== rName) {
            inputCustomRecipient.style.display = "block";
            inputCustomRecipient.value = effectiveRecipient;
        } else {
            inputCustomRecipient.style.display = "none";
            inputCustomRecipient.value = "";
        }
    }
}

function updateMoodSelectorUI() {
    if (!moodSelectorRow) return;
    moodSelectorRow.querySelectorAll(".mood-chip").forEach(chip => {
        if (chip.getAttribute("data-mood") === currentComposeMood) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });
}

function updateCharCounter() {
    if (letterCharCounter && inputLetterBody) {
        const count = inputLetterBody.value.length;
        letterCharCounter.textContent = `${count} ký tự`;
    }
}

function resetComposeForm() {
    if (inputLetterEditId) inputLetterEditId.value = "";
    if (composeFormTitle) composeFormTitle.textContent = "✍️ Viết Bức Thư Tình Mới";
    if (saveLetterBtnIcon) saveLetterBtnIcon.textContent = "💌";
    if (saveLetterBtnText) saveLetterBtnText.textContent = "Lưu & Gửi Vào Hộp Thư";
    if (inputLetterTitle) inputLetterTitle.value = "";
    if (inputLetterBody) inputLetterBody.value = "";
    if (letterTemplateSelect) letterTemplateSelect.value = "";
    currentComposeMood = "💖";
    updateMoodSelectorUI();
    updateCharCounter();
    setupSenderRecipientChoices(senderName, recipientName);
    if (inputLetterDate) {
        inputLetterDate.value = new Date().toISOString().slice(0, 16);
    }
}

function setupComposeFormDefaults() {
    resetComposeForm();
}

function startEditLetter(letterId) {
    const letter = loveLetters.find(l => l.id === letterId);
    if (!letter) return;

    if (inputLetterEditId) inputLetterEditId.value = letter.id;
    if (composeFormTitle) composeFormTitle.textContent = "✏️ Chỉnh Sửa Bức Thư";
    if (saveLetterBtnIcon) saveLetterBtnIcon.textContent = "💾";
    if (saveLetterBtnText) saveLetterBtnText.textContent = "Cập Nhật Bức Thư";

    if (inputLetterTitle) inputLetterTitle.value = letter.title || "";
    if (inputLetterBody) inputLetterBody.value = letter.content || "";
    if (inputLetterDate) inputLetterDate.value = letter.date || new Date().toISOString().slice(0, 16);
    updateCharCounter();

    currentComposeMood = letter.mood || "💖";
    updateMoodSelectorUI();
    setupSenderRecipientChoices(letter.sender, letter.recipient);

    switchLetterTab("compose");
}

function deleteLetter(letterId) {
    if (loveLetters.length <= 1) {
        showToastCard("⚠️ Không Thể Xóa", "Hộp thư cần giữ ít nhất 1 bức thư kỷ niệm nhé! 💕", 4000);
        return;
    }
    const idx = loveLetters.findIndex(l => l.id === letterId);
    if (idx === -1) return;

    const title = loveLetters[idx].title || "Bức thư";
    loveLetters.splice(idx, 1);
    saveLoveLetters(loveLetters);
    renderLetterHistory(historySearchQuery, historyFilterType);
    showToastCard("🗑️ Đã Xóa Bức Thư", `"${title}" đã được xóa khỏi hộp lưu trữ.`, 3500);
}

function handleReplyLetter() {
    const currentLetter = loveLetters[currentLetterIdx] || loveLetters[0];
    if (!currentLetter) return;

    resetComposeForm();

    if (composeFormTitle) composeFormTitle.textContent = "💬 Hồi Đáp Bức Thư";
    if (saveLetterBtnIcon) saveLetterBtnIcon.textContent = "💌";
    if (saveLetterBtnText) saveLetterBtnText.textContent = "Gửi Lời Hồi Đáp";

    const replySender = currentLetter.recipient || recipientName || "Kim Thanh";
    const replyRecipient = currentLetter.sender || senderName || "Mai IT";
    setupSenderRecipientChoices(replySender, replyRecipient);

    const prevTitle = currentLetter.title || "";
    if (inputLetterTitle) {
        inputLetterTitle.value = prevTitle.startsWith("Re:") ? prevTitle : `Re: ${prevTitle}`;
    }

    if (inputLetterDate) {
        inputLetterDate.value = new Date().toISOString().slice(0, 16);
    }

    switchLetterTab("compose");
    if (inputLetterBody) inputLetterBody.focus();
}

function saveLetterForm() {
    let chosenSender = senderName || "Mai IT";
    const activeSenderChip = senderChoiceRow ? senderChoiceRow.querySelector(".choice-chip.active") : null;
    if (activeSenderChip) {
        const val = activeSenderChip.getAttribute("data-val");
        if (val === "__custom__") {
            chosenSender = (inputCustomSender && inputCustomSender.value.trim()) || chosenSender;
        } else {
            chosenSender = val;
        }
    }

    let chosenRecipient = recipientName || "Kim Thanh";
    const activeRecipientChip = recipientChoiceRow ? recipientChoiceRow.querySelector(".choice-chip.active") : null;
    if (activeRecipientChip) {
        const val = activeRecipientChip.getAttribute("data-val");
        if (val === "__custom__") {
            chosenRecipient = (inputCustomRecipient && inputCustomRecipient.value.trim()) || chosenRecipient;
        } else {
            chosenRecipient = val;
        }
    }

    const title = (inputLetterTitle && inputLetterTitle.value.trim()) || "Bức Thư Tình Cảm ✨";
    const content = (inputLetterBody && inputLetterBody.value.trim()) || "";
    const dateVal = (inputLetterDate && inputLetterDate.value) || new Date().toISOString().slice(0, 16);

    if (!content) {
        showToastCard("✍️ Hãy Viết Tâm Tư", "Nội dung bức thư không được để trống nha! 💕", 3500);
        if (inputLetterBody) inputLetterBody.focus();
        return;
    }

    const editId = inputLetterEditId ? inputLetterEditId.value : "";
    if (editId) {
        const idx = loveLetters.findIndex(l => l.id === editId);
        if (idx !== -1) {
            loveLetters[idx].sender = chosenSender;
            loveLetters[idx].recipient = chosenRecipient;
            loveLetters[idx].title = title;
            loveLetters[idx].content = content;
            loveLetters[idx].mood = currentComposeMood;
            loveLetters[idx].date = dateVal;
            saveLoveLetters(loveLetters);
            currentLetterIdx = idx;
            showToastCard("✨ Đã Cập Nhật Thư!", `Bức thư "${title}" đã được lưu lại thành công! 💖`, 4500);
        }
    } else {
        const newLetter = {
            id: "letter_" + Date.now(),
            sender: chosenSender,
            recipient: chosenRecipient,
            title: title,
            content: content,
            mood: currentComposeMood,
            date: dateVal
        };
        loveLetters.unshift(newLetter);
        saveLoveLetters(loveLetters);
        currentLetterIdx = 0;
        showToastCard("💌 Đã Gửi Vào Hộp Thư!", `Bức thư gửi đến ${chosenRecipient} đã được lưu vào kỷ niệm! ✨`, 5000, "Đã gửi vào hộp thư tình yêu!");
        launchHeartFireworks();
    }

    resetComposeForm();
    switchLetterTab("read");
}

function speakLetterVoice() {
    if (isVoiceReadingLetter) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (letterAudio) {
            letterAudio.pause();
            letterAudio.currentTime = 0;
        }
        isVoiceReadingLetter = false;
        updateVoiceButtonState();
        resumeMusicAfterVoice(400);
        return;
    }

    const currentLetter = loveLetters[currentLetterIdx] || loveLetters[0];
    if (!currentLetter) return;

    pauseMusicForVoice();
    isVoiceReadingLetter = true;
    updateVoiceButtonState();

    const voiceText = `${currentLetter.title}. Từ ${currentLetter.sender} gửi ${currentLetter.recipient}. ${currentLetter.content}`;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voiceText);
        utterance.lang = "vi-VN";
        utterance.rate = 0.92;
        utterance.pitch = 1.05;

        utterance.onend = () => {
            isVoiceReadingLetter = false;
            updateVoiceButtonState();
            resumeMusicAfterVoice(600);
        };
        utterance.onerror = () => {
            isVoiceReadingLetter = false;
            updateVoiceButtonState();
            resumeMusicAfterVoice(400);
        };

        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes("vi"));
        if (viVoice) utterance.voice = viVoice;

        window.speechSynthesis.speak(utterance);
    } else {
        try {
            letterAudio.currentTime = 0;
            letterAudio.volume = 1.0;
            letterAudio.onended = () => {
                isVoiceReadingLetter = false;
                updateVoiceButtonState();
                resumeMusicAfterVoice(600);
            };
            letterAudio.play().catch(() => {
                isVoiceReadingLetter = false;
                updateVoiceButtonState();
                resumeMusicAfterVoice(400);
            });
        } catch (e) {
            isVoiceReadingLetter = false;
            updateVoiceButtonState();
            resumeMusicAfterVoice(400);
        }
    }
}

function updateVoiceButtonState() {
    if (!btnVoiceLetter) return;
    if (isVoiceReadingLetter) {
        btnVoiceLetter.innerHTML = `<span class="btn-icon">⏹</span> <span class="btn-text">Dừng Đọc</span>`;
        btnVoiceLetter.style.background = "rgba(244, 67, 54, 0.4)";
    } else {
        btnVoiceLetter.innerHTML = `<span class="btn-icon">🔊</span> <span class="btn-text">Nghe Đọc Thư</span>`;
        btnVoiceLetter.style.background = "";
    }
}

function copySyncCodeToClipboard() {
    try {
        const code = encodeSyncCode(loveLetters);
        navigator.clipboard.writeText(code).then(() => {
            showToastCard("📋 Đã Sao Chép Mã Đồng Bộ!", "Gửi chuỗi mã này cho người yêu qua Zalo/Messenger để đồng bộ lịch sử thư nhé! ✨", 5500);
        }).catch(() => {
            prompt("Sao chép mã đồng bộ thư dưới đây:", code);
        });
    } catch (e) {
        showToastCard("⚠️ Lỗi sao chép", "Không thể tạo mã: " + e.message, 4000);
    }
}

function importSyncCodeFromInput() {
    if (!inputSyncCode) return;
    const raw = inputSyncCode.value.trim();
    if (!raw) {
        showToastCard("⚠️ Chưa Nhập Mã", "Vui lòng dán chuỗi mã đồng bộ từ người yêu vào ô nhé! 💕", 3500);
        inputSyncCode.focus();
        return;
    }

    try {
        let imported = null;
        if (raw.startsWith("[") || raw.startsWith("{")) {
            imported = JSON.parse(raw);
        } else {
            imported = decodeSyncCode(raw);
        }

        if (Array.isArray(imported) && imported.length > 0) {
            loveLetters = imported;
            saveLoveLetters(loveLetters);
            inputSyncCode.value = "";
            renderLetterHistory(historySearchQuery, historyFilterType);
            displayLetter(0, true);
            showToastCard("🎉 Đồng Bộ Thành Công!", `Đã cập nhật ${loveLetters.length} bức thư từ người yêu vào hộp thư! 💖`, 6000, "Đồng bộ thư tình thành công!");
            launchHeartFireworks();
            switchLetterTab("history");
        } else {
            showToastCard("⚠️ Mã Không Hợp Lệ", "Dữ liệu mã đồng bộ không đúng định dạng thư tình.", 4000);
        }
    } catch (e) {
        showToastCard("⚠️ Lỗi Nhập Mã", "Mã đồng bộ bị lỗi: " + e.message, 4500);
    }
}

function exportJsonBackup() {
    try {
        const jsonStr = JSON.stringify(loveLetters, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hop_thu_tinh_yeu_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToastCard("📁 Đã Tải File Sao Lưu!", "File JSON chứa toàn bộ lịch sử thư đã được lưu về máy! ✨", 4500);
    } catch (e) {
        showToastCard("⚠️ Lỗi Xuất File", e.message, 3500);
    }
}

function importJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data) && data.length > 0) {
                loveLetters = data;
                saveLoveLetters(loveLetters);
                renderLetterHistory(historySearchQuery, historyFilterType);
                displayLetter(0, true);
                showToastCard("📂 Đã Khôi Phục File Thư!", `Đã tải thành công ${data.length} bức thư từ file sao lưu! 💖`, 5000);
                switchLetterTab("history");
            } else {
                showToastCard("⚠️ File Không Hợp Lệ", "File JSON không chứa danh sách thư hợp lệ.", 4000);
            }
        } catch (err) {
            showToastCard("⚠️ Lỗi Đọc File", "Không thể đọc file: " + err.message, 4000);
        }
    };
    reader.readAsText(file);
}

function resetDefaultLettersList() {
    if (confirm("Bạn có chắc chắn muốn khôi phục lại 3 bức thư mẫu ban đầu không? (Lịch sử hiện tại sẽ được nạp lại các thư mẫu gốc)")) {
        loveLetters = getDefaultLetters();
        saveLoveLetters(loveLetters);
        renderLetterHistory(historySearchQuery, historyFilterType);
        displayLetter(0, true);
        showToastCard("🔄 Đã Khôi Phục Thư Mẫu!", "Hộp thư đã được nạp lại 3 bức thư mẫu ban đầu. 🌸", 4000);
        switchLetterTab("read");
    }
}

function syncLoveLetterNames() {
    if (filterSenderName) filterSenderName.textContent = senderName || "Mai IT";
    if (filterRecipientName) filterRecipientName.textContent = recipientName || "Kim Thanh";
    setupSenderRecipientChoices(senderName, recipientName);
    renderLetterHistory(historySearchQuery, historyFilterType);
    if (loveLetters && loveLetters.length > 0) {
        displayLetter(currentLetterIdx, false);
    }
}

// Window attachments for inline event handlers
window.switchLetterTab = switchLetterTab;
window.startEditLetter = startEditLetter;
window.copyLetterContent = copyLetterContent;
window.deleteLetter = deleteLetter;
window.openLoveLetter = openLoveLetter;
window.closeLoveLetter = closeLoveLetter;

// Attach Event Listeners for Letter Modal
if (letterBtn) letterBtn.addEventListener("click", (e) => { e.stopPropagation(); openLoveLetter(); });
if (topLetterBtn) topLetterBtn.addEventListener("click", (e) => { e.stopPropagation(); closeHeartMenu(); openLoveLetter(); });
if (closeLetterBtn) closeLetterBtn.addEventListener("click", (e) => { e.stopPropagation(); closeLoveLetter(); });
if (letterModalBackdrop) letterModalBackdrop.addEventListener("click", (e) => { e.stopPropagation(); closeLoveLetter(); });
if (letterModal) {
    letterModal.addEventListener("click", (e) => {
        if (e.target === letterModal) closeLoveLetter();
    });
}

// Tab navigation listeners for Letter Modal
document.querySelectorAll("#letterModal .letter-nav-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetTab = tab.getAttribute("data-tab");
        switchLetterTab(targetTab);
    });
});

// Reader toolbar listeners
if (btnVoiceLetter) btnVoiceLetter.addEventListener("click", (e) => { e.stopPropagation(); speakLetterVoice(); });
if (btnReplayTypewriter) btnReplayTypewriter.addEventListener("click", (e) => { e.stopPropagation(); displayLetter(currentLetterIdx, true); });
if (btnReplyLetter) btnReplyLetter.addEventListener("click", (e) => { e.stopPropagation(); handleReplyLetter(); });
if (btnEditCurrentLetter) {
    btnEditCurrentLetter.addEventListener("click", (e) => {
        e.stopPropagation();
        const currentLetter = loveLetters[currentLetterIdx] || loveLetters[0];
        if (currentLetter) startEditLetter(currentLetter.id);
    });
}
if (btnPrevLetter) {
    btnPrevLetter.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentLetterIdx > 0) displayLetter(currentLetterIdx - 1, true);
    });
}
if (btnNextLetter) {
    btnNextLetter.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentLetterIdx < loveLetters.length - 1) displayLetter(currentLetterIdx + 1, true);
    });
}

// History controls listeners
if (letterSearchInput) {
    letterSearchInput.addEventListener("input", (e) => {
        renderLetterHistory(e.target.value, historyFilterType);
    });
}
if (btnNewLetterFromHistory) {
    btnNewLetterFromHistory.addEventListener("click", (e) => {
        e.stopPropagation();
        resetComposeForm();
        switchLetterTab("compose");
    });
}
if (filterAllLetters) {
    filterAllLetters.addEventListener("click", () => {
        document.querySelectorAll(".history-filter-chip").forEach(c => c.classList.remove("active"));
        filterAllLetters.classList.add("active");
        renderLetterHistory(historySearchQuery, "all");
    });
}
if (filterSenderLetters) {
    filterSenderLetters.addEventListener("click", () => {
        document.querySelectorAll(".history-filter-chip").forEach(c => c.classList.remove("active"));
        filterSenderLetters.classList.add("active");
        renderLetterHistory(historySearchQuery, "sender");
    });
}
if (filterRecipientLetters) {
    filterRecipientLetters.addEventListener("click", () => {
        document.querySelectorAll(".history-filter-chip").forEach(c => c.classList.remove("active"));
        filterRecipientLetters.classList.add("active");
        renderLetterHistory(historySearchQuery, "recipient");
    });
}

// Compose controls listeners
if (moodSelectorRow) {
    moodSelectorRow.querySelectorAll(".mood-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            currentComposeMood = chip.getAttribute("data-mood") || "💖";
            updateMoodSelectorUI();
        });
    });
}
if (inputLetterBody) {
    inputLetterBody.addEventListener("input", updateCharCounter);
}
if (letterTemplateSelect) {
    letterTemplateSelect.addEventListener("change", () => {
        const key = letterTemplateSelect.value;
        if (!key || !ROMANTIC_TEMPLATES[key]) return;
        const tmpl = ROMANTIC_TEMPLATES[key];

        const sName = senderName || "Mai IT";
        const rName = recipientName || "Kim Thanh";
        let filledContent = tmpl.content;
        filledContent = filledContent.replace(/em\/anh/g, rName).replace(/anh\/em/g, sName);

        if (inputLetterTitle && !inputLetterTitle.value.trim()) {
            inputLetterTitle.value = tmpl.title;
        }
        if (inputLetterBody) {
            inputLetterBody.value = filledContent;
            updateCharCounter();
        }
        currentComposeMood = tmpl.mood || "💖";
        updateMoodSelectorUI();
    });
}
if (btnSaveLetter) {
    btnSaveLetter.addEventListener("click", (e) => {
        e.stopPropagation();
        saveLetterForm();
    });
}
if (btnCancelEditLetter) {
    btnCancelEditLetter.addEventListener("click", (e) => {
        e.stopPropagation();
        resetComposeForm();
        switchLetterTab("history");
    });
}

// Guide & Sync listeners
if (btnCopySyncCode) {
    btnCopySyncCode.addEventListener("click", (e) => {
        e.stopPropagation();
        copySyncCodeToClipboard();
    });
}
if (btnImportSyncCode) {
    btnImportSyncCode.addEventListener("click", (e) => {
        e.stopPropagation();
        importSyncCodeFromInput();
    });
}
if (btnExportJson) {
    btnExportJson.addEventListener("click", (e) => {
        e.stopPropagation();
        exportJsonBackup();
    });
}
if (btnTriggerImportJson && fileImportJson) {
    btnTriggerImportJson.addEventListener("click", (e) => {
        e.stopPropagation();
        fileImportJson.click();
    });
    fileImportJson.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            importJsonFile(e.target.files[0]);
        }
    });
}
if (btnResetDefaultLetters) {
    btnResetDefaultLetters.addEventListener("click", (e) => {
        e.stopPropagation();
        resetDefaultLettersList();
    });
}

// Initial load of letters
loadLoveLetters();

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
    ensureAudioContext();
    if (!audioCtx || audioCtx.state !== "running") return;
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
let hasUserInteracted = false;

function ensureAudioContext() {
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => { });
        }
    } catch (e) { }
    return audioCtx;
}

function playChimeNote(freq, delay = 0, duration = 1.2, type = "sine") {
    if (!audioCtx || audioCtx.state !== "running") return;
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
    ensureAudioContext();
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
    ensureAudioContext();
    playRandomSong(true);
}

function toggleMusic() {
    ensureAudioContext();
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
    hasUserInteracted = true;
    userInteractionCount++;
    ensureAudioContext();
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
    if (typeof isDraggingTourCard !== "undefined" && isDraggingTourCard) return;
    targetTiltX = (e.clientX - width / 2) / (width / 2);
    targetTiltY = (e.clientY - height / 2) / (height / 2);
    addMouseTrailParticle(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
    if (typeof isDraggingTourCard !== "undefined" && isDraggingTourCard) return;
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

// Bảng Lookup Table (LUT) tính sẵn tọa độ & góc tiếp tuyến để tăng tốc CPU x10 lần
const LUT_SIZE = 360;
const HEART_LUT_X = new Float32Array(LUT_SIZE);
const HEART_LUT_Y = new Float32Array(LUT_SIZE);
const HEART_LUT_ANGLE = new Float32Array(LUT_SIZE);

for (let i = 0; i < LUT_SIZE; i++) {
    const t = (i / LUT_SIZE) * Math.PI * 2;
    HEART_LUT_X[i] = 16 * Math.pow(Math.sin(t), 3);
    HEART_LUT_Y[i] = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
    const dy = 13 * Math.sin(t) - 10 * Math.sin(2 * t) - 6 * Math.sin(3 * t) - 4 * Math.sin(4 * t);
    HEART_LUT_ANGLE[i] = Math.atan2(dy, dx);
}

function getHeartPoint(t) {
    let normalized = (t % (Math.PI * 2));
    if (normalized < 0) normalized += Math.PI * 2;
    const idx = Math.floor((normalized / (Math.PI * 2)) * LUT_SIZE) % LUT_SIZE;
    return { x: HEART_LUT_X[idx], y: HEART_LUT_Y[idx] };
}

function getTangentAngle(t) {
    let normalized = (t % (Math.PI * 2));
    if (normalized < 0) normalized += Math.PI * 2;
    const idx = Math.floor((normalized / (Math.PI * 2)) * LUT_SIZE) % LUT_SIZE;
    return HEART_LUT_ANGLE[idx];
}

// Bảng tọa độ mẫu tối ưu sẵn cho mini heart
const MINI_HEART_PATH = [];
for (let i = 0; i < LUT_SIZE; i += 8) {
    MINI_HEART_PATH.push({ x: HEART_LUT_X[i], y: HEART_LUT_Y[i] });
}

function drawMiniHeart(ctx, x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    ctx.beginPath();
    const s = size / 16;
    ctx.moveTo(MINI_HEART_PATH[0].x * s, MINI_HEART_PATH[0].y * s);
    for (let i = 1; i < MINI_HEART_PATH.length; i++) {
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
for (let i = 0; i < 16; i++) {
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
    for (let i = 0; i < sakuraPetals.length; i++) {
        const p = sakuraPetals[i];
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
for (let i = 0; i < 18; i++) {
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
    for (let i = 0; i < glitterParticles.length; i++) {
        const g = glitterParticles[i];
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
// 6.5. ĐỒNG HỒ ĐẾM NGÀY YÊU & HỆ THỐNG LƯU TRỮ DÒNG THỜI GIAN KỶ NIỆM (4 TABS)
// ==========================================
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

// Milestone Elements
const milestoneHistoryBadge = document.getElementById("milestoneHistoryBadge");
const milestoneSearchInput = document.getElementById("milestoneSearchInput");
const btnNewMilestoneFromTimeline = document.getElementById("btnNewMilestoneFromTimeline");
const milestoneTimelineList = document.getElementById("milestoneTimelineList");

const milestoneComposeTitle = document.getElementById("milestoneComposeTitle");
const inputMilestoneEditId = document.getElementById("inputMilestoneEditId");
const milestoneIconSelectorRow = document.getElementById("milestoneIconSelectorRow");
const milestoneTemplateSelect = document.getElementById("milestoneTemplateSelect");
const inputMilestoneTitle = document.getElementById("inputMilestoneTitle");
const inputMilestoneDate = document.getElementById("inputMilestoneDate");
const inputMilestoneDesc = document.getElementById("inputMilestoneDesc");
const btnSaveMilestone = document.getElementById("btnSaveMilestone");
const saveMilestoneBtnIcon = document.getElementById("saveMilestoneBtnIcon");
const saveMilestoneBtnText = document.getElementById("saveMilestoneBtnText");
const btnCancelEditMilestone = document.getElementById("btnCancelEditMilestone");

const btnCopyMilestoneSyncCode = document.getElementById("btnCopyMilestoneSyncCode");
const inputMilestoneSyncCode = document.getElementById("inputMilestoneSyncCode");
const btnImportMilestoneSyncCode = document.getElementById("btnImportMilestoneSyncCode");
const btnExportMilestoneJson = document.getElementById("btnExportMilestoneJson");
const btnTriggerImportMilestoneJson = document.getElementById("btnTriggerImportMilestoneJson");
const fileImportMilestoneJson = document.getElementById("fileImportMilestoneJson");
const btnResetDefaultMilestones = document.getElementById("btnResetDefaultMilestones");

let selectedMilestoneIcon = "💖";
let milestoneSearchQuery = "";

// Template Kỷ Niệm Gợi Ý
const MILESTONE_TEMPLATES = {
    first_meet: {
        icon: "☕",
        title: "Lần Đầu Tiên Gặp Gỡ & Trò Chuyện ☕",
        desc: "Buổi cà phê đầu tiên ngập tràn nụ cười, những ánh mắt ngại ngùng nhưng đong đầy cảm xúc ấm áp!"
    },
    first_confess: {
        icon: "💖",
        title: "Ngày Chính Thức Nói Lời Yêu Nhau 💕",
        desc: "Khoảnh khắc tuyệt vời nhất khi hai trái tim chính thức hòa chung một nhịp đập, hứa hẹn một tình yêu bền lâu!"
    },
    first_hold: {
        icon: "🌸",
        title: "Lần Đầu Tiên Nắm Tay & Dạo Phố 🌸",
        desc: "Bàn tay ấm áp nắm chặt lấy nhau giữa phố đông người, cảm giác bình yên và hạnh phúc ngập tràn."
    },
    first_movie: {
        icon: "🎬",
        title: "Buổi Hẹn Hò Xem Phim Đáng Nhớ 🎬",
        desc: "Cùng nhau chia sẻ từng khoảnh khắc cảm động trong rạp chiếu phim, tựa vai nhau ấm áp."
    },
    first_trip: {
        icon: "✈️",
        title: "Chuyến Du Lịch Đầu Tiên Cùng Nhau 🏖️",
        desc: "Hành trình khám phá những vùng đất mới, lưu giữ vô vàn bức ảnh kỷ niệm ngọt ngào và đáng yêu!"
    },
    first_bday: {
        icon: "🎁",
        title: "Sinh Nhật Đầu Tiên Được Ở Bên Người Ấy 🎂",
        desc: "Những ngọn nến lung linh và lời nguyện ước yêu thương, cảm ơn vì đã sinh ra và bước đến bên nhau!"
    },
    future_promise: {
        icon: "💍",
        title: "Lời Ước Hẹn Về Tương Lai Hai Đứa 💍",
        desc: "Cùng nhau vun đắp một mái ấm tràn ngập tiếng cười, đi qua mọi thăng trầm của cuộc đời!"
    }
};

function getDefaultMilestones() {
    return [
        {
            id: "ms_main",
            title: "Ngày Chính Thức Yêu Nhau 💕",
            icon: "💖",
            date: "2026-08-30T13:30",
            desc: `Khoảnh khắc ngọt ngào nhất khi ${senderName} & ${recipientName} chính thức nắm tay nhau và bắt đầu hành trình tình yêu đẹp đẽ!`,
            isMain: true
        },
        {
            id: "ms_meet",
            title: "Lần Đầu Tiên Gặp Gỡ & Trò Chuyện ☕",
            icon: "☕",
            date: "2026-08-15T09:00",
            desc: "Buổi cà phê đầu tiên ngập tràn nụ cười, những ánh mắt ngại ngùng nhưng đong đầy cảm xúc ấm áp!",
            isMain: false
        },
        {
            id: "ms_walk",
            title: "Buổi Hẹn Hò & Dạo Phố Dưới Ánh Hoàng Hôn 🌸",
            icon: "🌸",
            date: "2026-08-22T17:30",
            desc: "Cùng nhau đi dạo dưới làn gió mát, chia sẻ những ước mơ và niềm vui trong cuộc sống.",
            isMain: false
        },
        {
            id: "ms_promise",
            title: "Lời Ước Hẹn Bên Nhau Mãi Mãi 💍",
            icon: "💍",
            date: "2026-09-01T20:00",
            desc: "Hứa sẽ luôn yêu thương, che chở, thấu hiểu và cùng nhau vượt qua mọi thử thách trên đường đời.",
            isMain: false
        }
    ];
}

let loveMilestones = [];
try {
    const rawMilestones = localStorage.getItem("love_milestones_history");
    if (rawMilestones) {
        loveMilestones = JSON.parse(rawMilestones);
    }
} catch (e) {
    console.error("Lỗi đọc love_milestones_history:", e);
}

if (!Array.isArray(loveMilestones) || loveMilestones.length === 0) {
    loveMilestones = getDefaultMilestones();
    localStorage.setItem("love_milestones_history", JSON.stringify(loveMilestones));
}

function saveMilestonesToStorage() {
    try {
        localStorage.setItem("love_milestones_history", JSON.stringify(loveMilestones));
    } catch (e) {
        console.error("Lỗi lưu love_milestones_history:", e);
    }
    renderMilestonesTimeline(milestoneSearchQuery);
}

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
    renderMilestonesTimeline(milestoneSearchQuery);
}

function switchMilestoneTab(tabName) {
    const validTabs = ["settings", "timeline", "compose", "guide"];
    if (!validTabs.includes(tabName)) tabName = "settings";

    document.querySelectorAll("#nameEditorModal .letter-nav-tab").forEach(btn => {
        const isActive = btn.getAttribute("data-tab") === tabName;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const panes = {
        settings: document.getElementById("paneMilestoneSettings"),
        timeline: document.getElementById("paneMilestoneTimeline"),
        compose: document.getElementById("paneMilestoneCompose"),
        guide: document.getElementById("paneMilestoneGuide")
    };

    Object.keys(panes).forEach(k => {
        if (panes[k]) panes[k].classList.toggle("active", k === tabName);
    });

    if (tabName === "timeline") {
        renderMilestonesTimeline(milestoneSearchQuery);
    } else if (tabName === "compose" && (!inputMilestoneEditId || !inputMilestoneEditId.value)) {
        resetMilestoneComposeForm();
    }
}

function formatMilestoneDateTime(dtStr) {
    if (!dtStr) return "";
    try {
        const d = new Date(dtStr);
        if (isNaN(d.getTime())) return dtStr;
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(d.getHours())}:${pad(d.getMinutes())} ngày ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    } catch (e) {
        return dtStr;
    }
}

function renderMilestonesTimeline(query = "") {
    if (!milestoneTimelineList) return;
    milestoneTimelineList.innerHTML = "";

    const q = (query || "").trim().toLowerCase();
    const filtered = loveMilestones.filter(m => {
        if (!q) return true;
        const matchTitle = (m.title || "").toLowerCase().includes(q);
        const matchDesc = (m.desc || "").toLowerCase().includes(q);
        const matchDate = (m.date || "").toLowerCase().includes(q);
        return matchTitle || matchDesc || matchDate;
    });

    if (milestoneHistoryBadge) {
        milestoneHistoryBadge.textContent = loveMilestones.length;
    }

    if (filtered.length === 0) {
        milestoneTimelineList.innerHTML = `
            <div class="empty-history-state">
                <span class="empty-icon">🌸</span>
                <p>Chưa có cột mốc kỷ niệm nào phù hợp.</p>
                <button type="button" class="history-new-btn" onclick="switchMilestoneTab('compose')">
                    <span>✨</span> Thêm Kỷ Niệm Đầu Tiên
                </button>
            </div>
        `;
        return;
    }

    const now = Date.now();

    filtered.forEach(m => {
        const card = document.createElement("div");
        card.className = `milestone-card-item ${m.isMain ? 'is-main' : ''}`;
        card.setAttribute("data-id", m.id);

        const mTime = new Date(m.date).getTime();
        let daysBadgeHtml = "";

        if (!isNaN(mTime)) {
            if (mTime <= now) {
                const diffDays = Math.floor((now - mTime) / (1000 * 60 * 60 * 24));
                daysBadgeHtml = `<span class="milestone-days-badge past">Đã qua ${diffDays} ngày</span>`;
            } else {
                const diffDays = Math.ceil((mTime - now) / (1000 * 60 * 60 * 24));
                daysBadgeHtml = `<span class="milestone-days-badge future">Còn ${diffDays} ngày nữa</span>`;
            }
        }

        card.innerHTML = `
            <div class="milestone-card-header">
                <div class="milestone-card-title-row">
                    <span class="milestone-card-icon">${m.icon || '💖'}</span>
                    <h3 class="milestone-card-title">${escapeHtml(m.title || 'Kỷ Niệm Yêu')}</h3>
                </div>
                ${daysBadgeHtml}
            </div>
            <p class="milestone-card-desc">${escapeHtml(m.desc || '')}</p>
            <div class="milestone-card-footer">
                <span class="milestone-card-date">⏳ ${formatMilestoneDateTime(m.date)}</span>
                <div class="milestone-card-actions">
                    <button type="button" class="history-card-btn" title="Chỉnh sửa cột mốc này" onclick="startEditMilestone('${m.id}')">
                        ✏️ Sửa
                    </button>
                    <button type="button" class="history-card-btn" title="Sao chép nội dung kỷ niệm" onclick="copyMilestoneContent('${m.id}')">
                        📋 Chép
                    </button>
                    <button type="button" class="history-card-btn delete" title="Xóa cột mốc này" onclick="deleteMilestone('${m.id}')">
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        `;

        milestoneTimelineList.appendChild(card);
    });
}

function resetMilestoneComposeForm() {
    if (inputMilestoneEditId) inputMilestoneEditId.value = "";
    if (inputMilestoneTitle) inputMilestoneTitle.value = "";
    if (inputMilestoneDate) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        inputMilestoneDate.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    if (inputMilestoneDesc) inputMilestoneDesc.value = "";
    if (milestoneTemplateSelect) milestoneTemplateSelect.value = "";

    selectedMilestoneIcon = "💖";
    if (milestoneIconSelectorRow) {
        milestoneIconSelectorRow.querySelectorAll(".mood-chip").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-icon") === "💖");
        });
    }

    if (milestoneComposeTitle) milestoneComposeTitle.textContent = "✨ Thêm Cột Mốc Kỷ Niệm Mới";
    if (saveMilestoneBtnIcon) saveMilestoneBtnIcon.textContent = "✨";
    if (saveMilestoneBtnText) saveMilestoneBtnText.textContent = "Lưu Vào Dòng Kỷ Niệm";
}

function startEditMilestone(id) {
    const item = loveMilestones.find(m => m.id === id);
    if (!item) return;

    if (inputMilestoneEditId) inputMilestoneEditId.value = item.id;
    if (inputMilestoneTitle) inputMilestoneTitle.value = item.title || "";
    if (inputMilestoneDate) inputMilestoneDate.value = item.date || "";
    if (inputMilestoneDesc) inputMilestoneDesc.value = item.desc || "";

    selectedMilestoneIcon = item.icon || "💖";
    if (milestoneIconSelectorRow) {
        milestoneIconSelectorRow.querySelectorAll(".mood-chip").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-icon") === selectedMilestoneIcon);
        });
    }

    if (milestoneComposeTitle) milestoneComposeTitle.textContent = "✏️ Chỉnh Sửa Cột Mốc Kỷ Niệm";
    if (saveMilestoneBtnIcon) saveMilestoneBtnIcon.textContent = "💾";
    if (saveMilestoneBtnText) saveMilestoneBtnText.textContent = "Cập Nhật Kỷ Niệm";

    switchMilestoneTab("compose");
}

function deleteMilestone(id) {
    const idx = loveMilestones.findIndex(m => m.id === id);
    if (idx === -1) return;

    const item = loveMilestones[idx];
    if (item.isMain) {
        showToastCard("⚠️ Lưu Ý", "Đây là cột mốc chính dùng để đếm ngày yêu. Bạn có thể sửa ngày tại Cài Đặt Chính!", 4500, "Đây là cột mốc chính dùng để đếm ngày yêu.");
        return;
    }

    loveMilestones.splice(idx, 1);
    saveMilestonesToStorage();
    showToastCard("🗑️ Đã Xóa Kỷ Niệm!", "Cột mốc đã được xóa khỏi dòng thời gian.", 3000, "Đã xóa kỷ niệm.");
}

function copyMilestoneContent(id) {
    const item = loveMilestones.find(m => m.id === id);
    if (!item) return;

    const textToCopy = `✨ [${item.icon || '💖'} ${item.title}]\n⏳ Thời gian: ${formatMilestoneDateTime(item.date)}\n📝 ${item.desc}\n💕 Tình yêu của ${senderName} & ${recipientName}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToastCard("📋 Đã Sao Chép!", "Nội dung kỷ niệm đã được sao chép vào bộ nhớ đệm.", 3000, "Đã sao chép nội dung kỷ niệm.");
    }).catch(() => {
        showToastCard("📋 Thông Báo", "Vui lòng sao chép thủ công nội dung.", 3000);
    });
}

function handleSaveMilestone() {
    const title = (inputMilestoneTitle && inputMilestoneTitle.value.trim()) || "Khoảnh Khắc Kỷ Niệm";
    const date = (inputMilestoneDate && inputMilestoneDate.value) || new Date().toISOString().slice(0, 16);
    const desc = (inputMilestoneDesc && inputMilestoneDesc.value.trim()) || "";
    const editId = (inputMilestoneEditId && inputMilestoneEditId.value.trim()) || "";

    if (editId) {
        const item = loveMilestones.find(m => m.id === editId);
        if (item) {
            item.title = title;
            item.icon = selectedMilestoneIcon;
            item.date = date;
            item.desc = desc;
        }
        showToastCard("💾 Cập Nhật Thành Công!", `Cột mốc "${title}" đã được cập nhật lung linh! ✨`, 4500, "Cập nhật kỷ niệm thành công!");
    } else {
        const newMilestone = {
            id: "ms_" + Date.now(),
            title: title,
            icon: selectedMilestoneIcon,
            date: date,
            desc: desc,
            isMain: false
        };
        loveMilestones.unshift(newMilestone);
        showToastCard("✨ Thêm Kỷ Niệm Mới!", `Cột mốc "${title}" đã được lưu vào dòng thời gian! 💖`, 4500, "Thêm kỷ niệm mới thành công!");
    }

    saveMilestonesToStorage();
    resetMilestoneComposeForm();
    switchMilestoneTab("timeline");
    launchHeartFireworks();
}

// Milestone Sync Code Encode / Decode
function encodeMilestoneSyncCode() {
    try {
        const payload = {
            senderName,
            recipientName,
            loveStartDate,
            customLoveLetter,
            milestones: loveMilestones,
            timestamp: Date.now()
        };
        const jsonStr = JSON.stringify(payload);
        return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    } catch (e) {
        console.error("Lỗi mã hóa milestone sync code:", e);
        return null;
    }
}

function decodeMilestoneSyncCode(base64Str) {
    try {
        const binaryStr = atob(base64Str.trim());
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const decodedUri = new TextDecoder().decode(bytes);
        return JSON.parse(decodedUri);
    } catch (e) {
        try {
            return JSON.parse(decodeURIComponent(escape(atob(base64Str.trim()))));
        } catch (e2) {
            console.error("Lỗi giải mã milestone sync code:", e2);
            return null;
        }
    }
}

function exportMilestonesJson() {
    const payload = {
        senderName,
        recipientName,
        loveStartDate,
        customLoveLetter,
        milestones: loveMilestones,
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dong_thoi_gian_ky_niem_${senderName}_${recipientName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToastCard("📁 Đã Tải File!", "File sao lưu kỷ niệm đã được tải về máy của bạn.", 3500, "Đã tải file sao lưu kỷ niệm.");
}

function importMilestonesJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.senderName) senderName = data.senderName;
            if (data.recipientName) recipientName = data.recipientName;
            if (data.loveStartDate) loveStartDate = data.loveStartDate;
            if (data.customLoveLetter !== undefined) customLoveLetter = data.customLoveLetter;

            if (Array.isArray(data.milestones) && data.milestones.length > 0) {
                loveMilestones = data.milestones;
            }

            localStorage.setItem("love_sender_name", senderName);
            localStorage.setItem("love_recipient_name", recipientName);
            localStorage.setItem("love_start_date", loveStartDate);
            localStorage.setItem("love_custom_letter", customLoveLetter);

            saveMilestonesToStorage();
            applyCustomSettings();
            syncLoveLetterNames();

            showToastCard("📂 Nhập Kỷ Niệm Thành Công!", `Đã nạp đầy đủ dòng thời gian của ${senderName} & ${recipientName}! ✨`, 5000, "Nhập kỷ niệm thành công!");
            switchMilestoneTab("timeline");
        } catch (err) {
            showToastCard("❌ Lỗi Nhập File", "File không hợp lệ hoặc bị lỗi định dạng JSON.", 4000, "Lỗi nhập file.");
        }
    };
    reader.readAsText(file);
}

function openNameEditorModal(tab = "settings") {
    if (!nameEditorModal) return;
    applyCustomSettings();
    switchMilestoneTab(tab);
    nameEditorModal.classList.add("open");
}

function closeNameEditorModal() {
    if (!nameEditorModal) return;
    nameEditorModal.classList.remove("open");
}

setInterval(updateLoveDays, 1000);
updateLoveDays();

// Event listeners for Name Editor & Milestones
if (loveDaysWidget) {
    loveDaysWidget.addEventListener("click", (e) => {
        e.stopPropagation();
        openNameEditorModal("settings");
    });
}

const topMilestoneBtn = document.getElementById("topMilestoneBtn");
if (topMilestoneBtn) {
    topMilestoneBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeHeartMenu();
        openNameEditorModal("settings");
    });
}

if (nameEditorBtn) {
    nameEditorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeControlHub();
        openNameEditorModal("settings");
    });
}

if (closeNameEditorBtn) {
    closeNameEditorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeNameEditorModal();
    });
}

if (nameEditorBackdrop) {
    nameEditorBackdrop.addEventListener("click", (e) => {
        e.stopPropagation();
        closeNameEditorModal();
    });
}

if (nameEditorModal) {
    nameEditorModal.addEventListener("click", (e) => {
        if (e.target === nameEditorModal) closeNameEditorModal();
    });
}

// Milestone Tab Navigation
document.querySelectorAll("#nameEditorModal .letter-nav-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetTab = tab.getAttribute("data-tab");
        switchMilestoneTab(targetTab);
    });
});

if (saveNameSettingsBtn) {
    saveNameSettingsBtn.addEventListener("click", () => {
        senderName = (inputSenderName && inputSenderName.value.trim()) || "Mai IT";
        recipientName = (inputRecipientName && inputRecipientName.value.trim()) || "Kim Thanh";
        loveStartDate = (inputLoveDate && inputLoveDate.value) || "2026-08-30T13:30";
        customLoveLetter = (inputCustomMessage && inputCustomMessage.value.trim()) || "";

        localStorage.setItem("love_sender_name", senderName);
        localStorage.setItem("love_recipient_name", recipientName);
        localStorage.setItem("love_start_date", loveStartDate);
        localStorage.setItem("love_custom_letter", customLoveLetter);

        // Cập nhật mốc chính trong loveMilestones nếu có
        const mainMilestone = loveMilestones.find(m => m.isMain || m.id === "ms_main");
        if (mainMilestone) {
            mainMilestone.date = loveStartDate;
            mainMilestone.desc = `Khoảnh khắc ngọt ngào nhất khi ${senderName} & ${recipientName} chính thức nắm tay nhau và bắt đầu hành trình tình yêu đẹp đẽ!`;
            saveMilestonesToStorage();
        }

        applyCustomSettings();
        syncLoveLetterNames();
        closeNameEditorModal();

        showToastCard("💖 Đã Lưu Kỷ Niệm!", `Tình yêu của ${senderName} & ${recipientName} đã được cập nhật lung linh! ✨`, 5000, `Tình yêu của ${senderName} & ${recipientName} đã được cập nhật lung linh!`, "save_settings.mp3");
        launchHeartFireworks();
    });
}

// Milestone Search & Filter
if (milestoneSearchInput) {
    milestoneSearchInput.addEventListener("input", (e) => {
        milestoneSearchQuery = e.target.value;
        renderMilestonesTimeline(milestoneSearchQuery);
    });
}

if (btnNewMilestoneFromTimeline) {
    btnNewMilestoneFromTimeline.addEventListener("click", (e) => {
        e.stopPropagation();
        resetMilestoneComposeForm();
        switchMilestoneTab("compose");
    });
}

// Icon Selector
if (milestoneIconSelectorRow) {
    milestoneIconSelectorRow.querySelectorAll(".mood-chip").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            milestoneIconSelectorRow.querySelectorAll(".mood-chip").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedMilestoneIcon = btn.getAttribute("data-icon") || "💖";
        });
    });
}

// Template Selector
if (milestoneTemplateSelect) {
    milestoneTemplateSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (!val || !MILESTONE_TEMPLATES[val]) return;

        const tmpl = MILESTONE_TEMPLATES[val];
        selectedMilestoneIcon = tmpl.icon;
        if (inputMilestoneTitle) inputMilestoneTitle.value = tmpl.title;
        if (inputMilestoneDesc) inputMilestoneDesc.value = tmpl.desc;

        if (milestoneIconSelectorRow) {
            milestoneIconSelectorRow.querySelectorAll(".mood-chip").forEach(btn => {
                btn.classList.toggle("active", btn.getAttribute("data-icon") === tmpl.icon);
            });
        }
    });
}

if (btnSaveMilestone) {
    btnSaveMilestone.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSaveMilestone();
    });
}

if (btnCancelEditMilestone) {
    btnCancelEditMilestone.addEventListener("click", (e) => {
        e.stopPropagation();
        resetMilestoneComposeForm();
    });
}

// Sync Code & Tools for Milestones
if (btnCopyMilestoneSyncCode) {
    btnCopyMilestoneSyncCode.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = encodeMilestoneSyncCode();
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                showToastCard("📋 Đã Sao Chép Mã Kỷ Niệm!", "Hãy gửi mã này qua Zalo/Messenger để người yêu đồng bộ nhé! 💖", 5000, "Đã sao chép mã đồng bộ kỷ niệm.");
            }).catch(() => {
                if (inputMilestoneSyncCode) {
                    inputMilestoneSyncCode.value = code;
                    inputMilestoneSyncCode.select();
                }
                showToastCard("📋 Mã Đồng Bộ", "Đã hiển thị mã kỷ niệm trong ô nhập bên dưới.", 4000);
            });
        }
    });
}

if (btnImportMilestoneSyncCode) {
    btnImportMilestoneSyncCode.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = inputMilestoneSyncCode ? inputMilestoneSyncCode.value.trim() : "";
        if (!code) {
            showToastCard("⚠️ Chưa Nhập Mã", "Vui lòng dán mã đồng bộ kỷ niệm vào ô nhập trước!", 3500);
            return;
        }

        const data = decodeMilestoneSyncCode(code);
        if (!data) {
            showToastCard("❌ Mã Không Hợp Lệ", "Mã kỷ niệm bị sai hoặc không đúng định dạng.", 4000);
            return;
        }

        if (data.senderName) senderName = data.senderName;
        if (data.recipientName) recipientName = data.recipientName;
        if (data.loveStartDate) loveStartDate = data.loveStartDate;
        if (data.customLoveLetter !== undefined) customLoveLetter = data.customLoveLetter;

        if (Array.isArray(data.milestones) && data.milestones.length > 0) {
            loveMilestones = data.milestones;
        }

        localStorage.setItem("love_sender_name", senderName);
        localStorage.setItem("love_recipient_name", recipientName);
        localStorage.setItem("love_start_date", loveStartDate);
        localStorage.setItem("love_custom_letter", customLoveLetter);

        saveMilestonesToStorage();
        applyCustomSettings();
        syncLoveLetterNames();

        if (inputMilestoneSyncCode) inputMilestoneSyncCode.value = "";
        showToastCard("🎉 Đồng Bộ Kỷ Niệm Thành Công!", `Đã cập nhật toàn bộ dòng thời gian của ${senderName} & ${recipientName}! ✨`, 5000, "Đồng bộ kỷ niệm thành công!");
        switchMilestoneTab("timeline");
        launchHeartFireworks();
    });
}

if (btnExportMilestoneJson) {
    btnExportMilestoneJson.addEventListener("click", (e) => {
        e.stopPropagation();
        exportMilestonesJson();
    });
}

if (btnTriggerImportMilestoneJson) {
    btnTriggerImportMilestoneJson.addEventListener("click", (e) => {
        e.stopPropagation();
        if (fileImportMilestoneJson) fileImportMilestoneJson.click();
    });
}

if (fileImportMilestoneJson) {
    fileImportMilestoneJson.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) importMilestonesJson(file);
    });
}

if (btnResetDefaultMilestones) {
    btnResetDefaultMilestones.addEventListener("click", (e) => {
        e.stopPropagation();
        loveMilestones = getDefaultMilestones();
        saveMilestonesToStorage();
        showToastCard("🔄 Đã Khôi Phục!", "Dòng thời gian đã được khôi phục về các cột mốc mẫu mặc định.", 3500, "Đã khôi phục mẫu kỷ niệm.");
        switchMilestoneTab("timeline");
    });
}

// Window attachments for Milestone functions
window.switchMilestoneTab = switchMilestoneTab;
window.startEditMilestone = startEditMilestone;
window.copyMilestoneContent = copyMilestoneContent;
window.deleteMilestone = deleteMilestone;
window.openNameEditorModal = openNameEditorModal;
window.closeNameEditorModal = closeNameEditorModal;

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
// 7. RENDER 5 KIỂU DÁNG NGHỆ THUẬT (Tối ưu hóa hiệu năng đỉnh cao)
// ==========================================

const GALAXY_HEART_COUNT = 110;
const galaxyParticles = [];
for (let i = 0; i < GALAXY_HEART_COUNT; i++) {
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
    // 1. Luôn hiển thị trái tim pha lê thuần khiết sắc nét, vừa vặn ở tâm
    drawShapePureGlassHeart(ctx, scale, now, isBeating, beatScale, theme);

    // 2. Dải ngân hà 3D gồm các vì sao ánh sáng xoay chuyển liên tục
    const rotY = now * 0.0009;
    const perspective = 220;

    for (let i = 0; i < GALAXY_HEART_COUNT; i++) {
        const p = galaxyParticles[i];
        p.phase += p.speed;
        const wiggleX = Math.sin(p.phase) * 1.2;
        const wiggleY = Math.cos(p.phase) * 1.2;

        const x = (p.baseX + wiggleX) * scale;
        const y = (p.baseY + wiggleY) * scale;
        const z = (p.baseZ + Math.sin(p.phase * 2) * 3) * scale;

        const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
        const rz = x * Math.sin(rotY) + z * Math.cos(rotY);
        const ry = y;

        const proj = perspective / (perspective + rz + 80);
        const px = rx * proj;
        const py = ry * proj;
        const size = p.size * proj * beatScale * 0.95;
        const alpha = Math.min(1.0, Math.max(0.25, (rz + 50) / 100));

        ctx.fillStyle = theme.textColor;
        ctx.globalAlpha = alpha * 0.95;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawShapeBloomingRose(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const bloom = Math.sin(now * 0.002) * 0.06 + (isBeating ? 0.2 : 0);
    const roseScale = scale * 0.88 * (1 + bloom);
    const petalLayers = 4;
    for (let layer = petalLayers; layer >= 1; layer--) {
        const petalsInLayer = layer * 3 + 2;
        const r = (layer / petalLayers) * 11 * roseScale;
        const rotOffset = layer * 0.4 + now * 0.0003;
        const pw = (r / petalLayers) * 1.35;
        const ph = (r / petalLayers) * 1.85;
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
    ctx.arc(0, 0, 3.2 * coreTwinkle * beatScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

const orbSnow = [];
for (let i = 0; i < 25; i++) {
    orbSnow.push({
        x: (Math.random() - 0.5) * 45,
        y: (Math.random() - 0.5) * 45,
        vy: -Math.random() * 0.35 - 0.08,
        size: Math.random() * 1.5 + 0.6,
        sway: Math.random() * Math.PI * 2
    });
}

function drawShapeMagicOrb(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const orbRadius = 9.8 * scale;
    const orbGrd = ctx.createRadialGradient(-orbRadius * 0.35, -orbRadius * 0.35, orbRadius * 0.1, 0, 0, orbRadius);
    orbGrd.addColorStop(0, "rgba(255, 255, 255, 0.65)");
    orbGrd.addColorStop(0.3, "rgba(255, 200, 230, 0.2)");
    orbGrd.addColorStop(0.8, "rgba(30, 10, 50, 0.4)");
    orbGrd.addColorStop(1, "rgba(255, 255, 255, 0.85)");
    ctx.fillStyle = orbGrd;
    ctx.beginPath();
    ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, orbRadius - 2, 0, Math.PI * 2);
    ctx.clip();
    for (let i = 0; i < orbSnow.length; i++) {
        const s = orbSnow[i];
        s.y += s.vy;
        s.sway += 0.02;
        const sx = s.x + Math.sin(s.sway) * 3;
        if (s.y < -orbRadius) { s.y = orbRadius; s.x = (Math.random() - 0.5) * orbRadius * 1.5; }
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(sx, s.y, s.size * 0.85, 0, Math.PI * 2);
        ctx.fill();
    }
    const miniScale = scale * 0.38 * beatScale;
    ctx.beginPath();
    for (let i = 0; i < LUT_SIZE; i += 6) {
        const px = HEART_LUT_X[i] * miniScale;
        const py = HEART_LUT_Y[i] * miniScale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    const miniGrd = ctx.createRadialGradient(0, -4 * miniScale, 0, 0, 0, 14 * miniScale);
    for (let g of theme.coreGrad) miniGrd.addColorStop(g[0], g[1]);
    ctx.fillStyle = miniGrd;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.ellipse(-orbRadius * 0.45, -orbRadius * 0.45, orbRadius * 0.25, orbRadius * 0.1, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawShapeInfinityRibbon(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const ribbonScale = scale * 0.9 * beatScale;
    const ribbonCount = 3;
    for (let r = 0; r < ribbonCount; r++) {
        const offsetPhase = (r / ribbonCount) * Math.PI * 2 + now * 0.002;
        ctx.beginPath();
        for (let i = 0; i < LUT_SIZE; i += 6) {
            const hx = HEART_LUT_X[i];
            const hy = HEART_LUT_Y[i];
            const t = (i / LUT_SIZE) * Math.PI * 2;
            const wave = Math.sin(t * 3 + offsetPhase) * 1.6;
            const px = (hx + Math.cos(t) * wave) * ribbonScale;
            const py = (hy + Math.sin(t) * wave) * ribbonScale;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        const ribbonGrd = ctx.createLinearGradient(-12 * ribbonScale, 0, 12 * ribbonScale, 0);
        ribbonGrd.addColorStop(0, theme.textColor);
        ribbonGrd.addColorStop(0.5, theme.butterflyColor);
        ribbonGrd.addColorStop(1, theme.textColor);
        ctx.strokeStyle = ribbonGrd;
        ctx.lineWidth = (2.6 - r * 0.6);
        ctx.stroke();
    }
    const starCount = 8;
    for (let i = 0; i < starCount; i++) {
        const st = ((now * 0.0004 + (i / starCount) * Math.PI * 2) % (Math.PI * 2));
        const hp = getHeartPoint(st);
        const px = hp.x * ribbonScale;
        const py = hp.y * ribbonScale;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawShapePureGlassHeart(ctx, scale, now, isBeating, beatScale, theme) {
    ctx.save();
    const glassScale = scale * 0.95 * beatScale;
    ctx.beginPath();
    for (let i = 0; i < LUT_SIZE; i += 4) {
        const px = HEART_LUT_X[i] * glassScale;
        const py = HEART_LUT_Y[i] * glassScale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    const glassGrd = ctx.createRadialGradient(0, -6 * glassScale, 0, 0, 0, 16 * glassScale);
    for (let g of theme.coreGrad) glassGrd.addColorStop(g[0], g[1]);
    ctx.fillStyle = glassGrd;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.stroke();
    ctx.beginPath();
    const startIdx = Math.floor(LUT_SIZE * 0.325);
    const endIdx = Math.floor(LUT_SIZE * 0.475);
    for (let i = startIdx; i <= endIdx; i += 4) {
        const px = HEART_LUT_X[i] * glassScale * 0.88;
        const py = HEART_LUT_Y[i] * glassScale * 0.88;
        if (i === startIdx) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.restore();
}

// ==========================================
// 8. BƯỚM DẠ QUANG & TƯƠNG TÁC CLICK
// ==========================================
const butterflies = [
    { t: 0, speed: 0.007, radiusX: 88, radiusY: 58, phase: 0 },
    { t: Math.PI, speed: 0.0055, radiusX: 112, radiusY: 72, phase: Math.PI / 2 }
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
for (let i = 0; i < 24; i++) {
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
for (let i = 0; i < 100; i++) {
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

const bgLayerElement = document.querySelector(".background");

function render(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    curTiltX += (targetTiltX - curTiltX) * 0.06;
    curTiltY += (targetTiltY - curTiltY) * 0.06;
    if (bgLayerElement) bgLayerElement.style.transform = `translate(${curTiltX * 12}px, ${curTiltY * 12}px) scale(1.06)`;

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
            clickBeatScale = 1.0 + p1 * 0.25 + p2 * 0.45;
        } else isBeating = false;
    }
    let introScale = Math.min(elapsed / 1500, 1.0);
    introScale = 1 - Math.pow(1 - introScale, 3);
    const baseScreenRatio = Math.min(1.0, Math.max(0.72, Math.min(width, height) / 720));
    const finalScale = currentScale * idleBreathing * introScale * baseScreenRatio;
    const outerOpacity = Math.max(0, Math.min((elapsed - 1200) / 1000, 1.0));

    curHeartVisAlpha += (curBgMode.heartTargetAlpha - curHeartVisAlpha) * 0.05;

    const scaleBase = finalScale * 3.4 * (isBeating ? clickBeatScale : 1.0);
    if (introScale > 0 && curHeartVisAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = curHeartVisAlpha;
        switch (curShape.id) {
            case "galaxy":
                drawShapeGalaxyHeart(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "flower":
            case "rose":
                drawShapeBloomingRose(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "sphere":
            case "orb":
                drawShapeMagicOrb(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "ribbon":
            case "infinity":
                drawShapeInfinityRibbon(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
            case "crystal":
            case "glass":
            default:
                drawShapePureGlassHeart(ctx, scaleBase, now, isBeating, clickBeatScale, curTheme);
                break;
        }
        ctx.restore();
    }

    const hasOuterLayers = (curShape.id === "crystal" || curShape.id === "glass" || curShape.id === "galaxy" || curShape.id === "ribbon" || curShape.id === "infinity");
    const scaleL2 = finalScale * 5.8 * (isBeating ? (1.0 + (clickBeatScale - 1.0) * 0.65) : 1.0);
    if (outerOpacity > 0 && curHeartVisAlpha > 0.01 && hasOuterLayers) {
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
                ctx.ellipse(px, py, p.size * 1.3 * finalScale, p.size * 0.85 * finalScale, p.t, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(px, py, p.size * 0.85 * finalScale, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    if (outerOpacity > 0 && curHeartVisAlpha > 0.01 && hasOuterLayers) {
        ctx.save();
        ctx.globalAlpha = outerOpacity * curHeartVisAlpha;
        const scaleL3 = finalScale * 7.4;
        const fontSize = Math.max(12, Math.round(14.5 * finalScale));
        ctx.font = `800 ${fontSize}px 'Dancing Script', cursive, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textString = "  I  L O V E  Y O U  ♥  ";
        const textArr = textString.split("");
        const totalChars = 36;
        const textOffsetT = (now * 0.00025) % (Math.PI * 2);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "#ffffff";

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

            const now = Date.now();
            if (now - (cat._lastClick || 0) < 300) return;
            cat._lastClick = now;

            ensureAudioContext();

            const catType = cat.getAttribute("data-cat") || "white";
            const quote = CAT_QUOTES[catType] || CAT_QUOTES.white;
            const bubble = cat.querySelector(".cat-bubble");

            // Nếu đang phát tiếng của bé mèo này -> Bấm để tắt ngay lập tức
            if (bubble && bubble.classList.contains("active") && isVoiceSpeaking) {
                stopAllVoicesAndDialogues(false);
                return;
            }

            // Dừng mọi âm thanh và lời thoại khác trước khi phát bé mèo này
            stopAllVoicesAndDialogues(true);

            // 1. Bé mèo nhún nhảy nhẹ trong khi vẫn quẩy vũ đạo liên tục
            cat.classList.remove("jump");
            void cat.offsetWidth;
            cat.classList.add("jump");

            // 2. Hiện bong bóng thoại khớp 100% từng từ với giọng đọc
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

            const now = Date.now();
            if (now - (goose._lastClick || 0) < 300) return;
            goose._lastClick = now;

            ensureAudioContext();

            const gooseType = goose.getAttribute("data-goose") || "white";
            const quote = GOOSE_QUOTES[gooseType] || GOOSE_QUOTES.white;
            const bubble = goose.querySelector(".goose-bubble");

            // Nếu đang phát tiếng của bé ngỗng này -> Bấm để tắt ngay lập tức
            if (bubble && bubble.classList.contains("active") && isVoiceSpeaking) {
                stopAllVoicesAndDialogues(false);
                return;
            }

            // Dừng mọi âm thanh và lời thoại khác trước khi phát bé ngỗng này
            stopAllVoicesAndDialogues(true);

            // 1. Bé ngỗng nhún nảy nhẹ
            goose.classList.remove("jump");
            void goose.offsetWidth;
            goose.classList.add("jump");

            // 2. Hiện bong bóng thoại khớp với giọng đọc
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
// 10.4 SINGLE TOP-RIGHT HEART MENU CONTROLLER (NÚT TRÁI TIM DUY NHẤT ❤️)
// ==========================================
const heartMenuWrapper = document.getElementById("heartMenuWrapper");
const heartMenuToggleBtn = document.getElementById("heartMenuToggleBtn");
const heartDropdownMenu = document.getElementById("heartDropdownMenu");

function toggleHeartMenu(forceState) {
    if (!heartMenuWrapper || !heartDropdownMenu) return;
    const shouldOpen = typeof forceState === "boolean" ? forceState : !heartDropdownMenu.classList.contains("open");

    if (shouldOpen) {
        heartDropdownMenu.classList.add("open");
        heartMenuWrapper.classList.add("open");
        if (heartMenuToggleBtn) heartMenuToggleBtn.setAttribute("aria-expanded", "true");
        heartDropdownMenu.setAttribute("aria-hidden", "false");
        if (audioCtx) playChimeNote(659.25, 0, 0.2);
    } else {
        heartDropdownMenu.classList.remove("open");
        heartMenuWrapper.classList.remove("open");
        if (heartMenuToggleBtn) heartMenuToggleBtn.setAttribute("aria-expanded", "false");
        heartDropdownMenu.setAttribute("aria-hidden", "true");
    }
}

function closeHeartMenu() {
    toggleHeartMenu(false);
}

if (heartMenuToggleBtn) {
    heartMenuToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleHeartMenu();
    });
}

// Click outside or press Escape to close Heart Menu
document.addEventListener("click", (e) => {
    if (heartMenuWrapper && !heartMenuWrapper.contains(e.target)) {
        closeHeartMenu();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeHeartMenu();
    }
});

// Tự động đóng Heart Menu khi click vào các nút chức năng bên trong
const dropdownItemBtns = document.querySelectorAll(".dropdown-item-btn");
dropdownItemBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        setTimeout(() => closeHeartMenu(), 180);
    });
});

// ==========================================
// 10.5 FLOATING CONTROL HUB CONTROLLER (TRUNG TÂM TIỆN ÍCH TINH GỌN)
// ==========================================
const controlHubModal = document.getElementById("controlHubModal");
const hubToggleBtn = document.getElementById("hubToggleBtn");
const closeHubBtn = document.getElementById("closeHubBtn");
const hubBackdrop = document.getElementById("hubBackdrop");

function openControlHub() {
    if (!controlHubModal) return;
    closeHeartMenu();
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
// 11. INTERACTIVE GUIDED TOUR
// ==========================================
const TOUR_STEPS = [
    {
        target: "#heartCanvas",
        targetId: "heartCanvas",
        title: "💖 Bước 1: Trái Tim 3D Tương Tác",
        desc: "Chạm vào trái tim để bùng nổ hiệu ứng nhịp đập & sóng ánh sáng lung linh!",
        voice: "Chạm vào trái tim để bùng nổ hiệu ứng nhịp đập và sóng ánh sáng lung linh!",
        audio: "tour_step_1.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#loveDaysWidget",
        targetId: "loveDaysWidget",
        title: "⏳ Bước 2: Đồng Hồ Đếm Ngày Yêu",
        desc: "Đồng hồ đếm từng giây phút bên nhau và ghi dấu tên kỷ niệm ngọt ngào của hai bạn!",
        voice: "Đồng hồ đếm từng giây phút bên nhau và ghi dấu tên kỷ niệm ngọt ngào của hai bạn!",
        audio: "tour_step_2.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#heartMenuToggleBtn",
        targetId: "heartMenuToggleBtn",
        title: "❤️ Bước 3: Nút Menu Trái Tim",
        desc: "Bấm vào nút Trái Tim ở góc trên bên phải để mở ngay Menu Tiện Ích Đa Năng!",
        voice: "Bấm vào nút Trái Tim ở góc trên bên phải để mở ngay Menu Tiện Ích Đa Năng!",
        audio: "tour_step_3.mp3",
        placement: "bottom",
        closeHub: true
    },
    {
        target: "#shapeToggle",
        targetId: "shapeToggle",
        title: "🌌 Bước 4: 5 Kiểu Dáng Trái Tim",
        desc: "Khám phá 5 kiểu dáng độc quyền: Thiên Hà 3D, Hoa Hồng, Quả Cầu, Lụa Vô Cực và Pha Lê!",
        voice: "Khám phá 5 kiểu dáng độc quyền: Thiên Hà 3D, Hoa Hồng, Quả Cầu, Lụa Vô Cực và Pha Lê!",
        audio: "tour_step_4.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#themeToggle",
        targetId: "themeToggle",
        title: "🎨 Bước 5: 10 Tông Màu Nghệ Thuật",
        desc: "Đổi màu sắc yêu thích với 10 chủ đề: Hồng Ngọt Ngào, Tím Vũ Trụ, Hoàng Gia, Băng Tuyết...",
        voice: "Đổi màu sắc yêu thích với 10 chủ đề: Hồng Ngọt Ngào, Tím Vũ Trụ, Hoàng Gia, Băng Tuyết...",
        audio: "tour_step_5.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#bgModeToggle",
        targetId: "bgModeToggle",
        title: "🖼️ Bước 6: 4 Chế Độ Nền Sống Động",
        desc: "Chuyển đổi linh hoạt giữa Nền Chuẩn, Nền Hoa Anh Đào, Nền Thiên Hà 3D và Nền Thuần Khiết!",
        voice: "Chuyển đổi linh hoạt giữa Nền Chuẩn, Nền Hoa Anh Đào, Nền Thiên Hà 3D và Nền Thuần Khiết!",
        audio: "tour_step_6.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#musicGenreToggle",
        targetId: "musicGenreToggle",
        title: "🎵 Bước 7: Đổi Ca Sĩ & Âm Nhạc",
        desc: "Chuyển đổi giữa dòng nhạc Acoustic trầm ấm của Vũ. và Pop R&B sôi động của Sơn Tùng M-TP!",
        voice: "Chuyển đổi giữa dòng nhạc Acoustic trầm ấm của Vũ và Pop R&B sôi động của Sơn Tùng M-TP!",
        audio: "tour_step_7.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#hubFireworksBtn",
        targetId: "hubFireworksBtn",
        title: "🎆 Bước 8: Bắn Pháo Hoa Trái Tim",
        desc: "Thắp sáng bầu trời tình yêu với pháo hoa trái tim rực rỡ lung linh muôn sắc màu!",
        voice: "Thắp sáng bầu trời tình yêu với pháo hoa trái tim rực rỡ lung linh muôn sắc màu!",
        audio: "tour_step_8.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#nameEditorBtn",
        targetId: "nameEditorBtn",
        title: "✨ Bước 9: Tùy Chỉnh Tên & Dòng Kỷ Niệm",
        desc: "Cá nhân hóa tên hai bạn, thiết lập ngày yêu và lưu trữ trọn vẹn toàn bộ dòng thời gian kỷ niệm ngọt ngào!",
        voice: "Cá nhân hóa tên hai bạn, thiết lập ngày yêu và lưu trữ trọn vẹn toàn bộ dòng thời gian kỷ niệm ngọt ngào!",
        audio: "tour_step_9.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#openPlaylistBtn",
        targetId: "openPlaylistBtn",
        title: "🎧 Bước 10: Kho Nhạc Tình Ca",
        desc: "Mở danh sách phát nhạc để chuyển bài hát yêu thích hoặc tải lên bài nhạc MP3 từ máy của bạn!",
        voice: "Mở danh sách phát nhạc để chuyển bài hát yêu thích hoặc tải lên bài nhạc MP3 từ máy của bạn!",
        audio: "tour_step_10.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#letterBtn",
        targetId: "letterBtn",
        title: "💌 Bước 11: Hộp Thư Đôi & Lưu Trữ Lịch Sử",
        desc: "Mở Hộp Thư Đôi để xem toàn bộ lịch sử thư tình, viết thư hồi đáp cho nhau và lưu giữ kỷ niệm ngọt ngào của hai bạn!",
        voice: "Mở Hộp Thư Đôi để xem toàn bộ lịch sử thư tình, viết thư hồi đáp cho nhau và lưu giữ kỷ niệm ngọt ngào của hai bạn!",
        audio: "tour_step_11.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#authorBtn",
        targetId: "authorBtn",
        title: "👨‍💻 Bước 12: Thông Tin Tác Giả",
        desc: "Khám phá profile của chàng lập trình viên Mai IT đã sáng tạo nên món quà tuyệt vời này!",
        voice: "Khám phá profile của chàng lập trình viên Mai IT đã sáng tạo nên món quà tuyệt vời này!",
        audio: "tour_step_12.mp3",
        placement: "bottom",
        openHub: true
    },
    {
        target: "#catSquad",
        targetId: "catSquad",
        title: "🐱 Bước 13: Hội Bé Mèo Siêu Quậy",
        desc: "Chạm vào các bé mèo đáng yêu ở góc phải dưới để xem vũ đạo vui nhộn và nghe lời chúc!",
        voice: "Chạm vào các bé mèo đáng yêu ở góc phải dưới để xem vũ đạo vui nhộn và nghe lời chúc!",
        audio: "tour_step_13.mp3",
        placement: "top",
        closeHub: true
    },
    {
        target: "#gooseSquad",
        targetId: "gooseSquad",
        title: "🪿 Bước 14: Đôi Bé Ngỗng Quẩy Cute",
        desc: "Chạm vào đôi bé ngỗng ở góc trái dưới để nghe tiếng cạp cạp và quẩy theo điệu nhạc!",
        voice: "Chạm vào đôi bé ngỗng ở góc trái dưới để nghe tiếng cạp cạp và quẩy theo điệu nhạc!",
        audio: "tour_step_14.mp3",
        placement: "top",
        closeHub: true
    },
    {
        target: "#heartMenuToggleBtn",
        targetId: "heartMenuToggleBtn",
        title: "✨ Bước 15: Bắt Đầu Khám Phá!",
        desc: "Bạn có thể bấm vào nút Trái Tim này bất kỳ lúc nào để xem lại hướng dẫn hoặc khám phá tiện ích!",
        voice: "Bạn có thể bấm vào nút Trái Tim này bất kỳ lúc nào để xem lại hướng dẫn hoặc khám phá tiện ích!",
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
    if (!hasUserInteracted) return;
    ensureAudioContext();
    if (!audioCtx || audioCtx.state !== "running") return;
    playChimeNote(659.25, 0, 0.25); // E5
    playChimeNote(880.00, 0.06, 0.35); // A5
    playChimeNote(1046.50, 0.12, 0.45); // C6
}

// Phát giọng nói hướng dẫn tiếng Việt 100% chuẩn xác qua file MP3 Studio hoặc Web Speech
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

        const voiceText = step.voice || step.desc;

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
                    // Fallback Web Speech Synthesis nếu audio bị chặn
                    if ('speechSynthesis' in window && voiceText) {
                        try {
                            window.speechSynthesis.cancel();
                            const utter = new SpeechSynthesisUtterance(voiceText);
                            utter.lang = 'vi-VN';
                            utter.rate = 1.0;
                            const voices = window.speechSynthesis.getVoices();
                            const viVoice = voices.find(v => (v.lang && (v.lang.startsWith("vi") || v.lang.includes("VN"))) || (v.name && (v.name.toLowerCase().includes("vietnam") || v.name.toLowerCase().includes("vietnamese"))));
                            if (viVoice) utter.voice = viVoice;
                            utter.onend = () => { isVoiceSpeaking = false; };
                            utter.onerror = () => { isVoiceSpeaking = false; };
                            window.speechSynthesis.speak(utter);
                        } catch (e) {
                            isVoiceSpeaking = false;
                        }
                    } else {
                        isVoiceSpeaking = false;
                    }
                });
            }
        } else if ('speechSynthesis' in window && voiceText) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(voiceText);
                utter.lang = 'vi-VN';
                utter.rate = 1.0;
                const voices = window.speechSynthesis.getVoices();
                const viVoice = voices.find(v => (v.lang && (v.lang.startsWith("vi") || v.lang.includes("VN"))) || (v.name && (v.name.toLowerCase().includes("vietnam") || v.name.toLowerCase().includes("vietnamese"))));
                if (viVoice) utter.voice = viVoice;
                utter.onend = () => { isVoiceSpeaking = false; };
                utter.onerror = () => { isVoiceSpeaking = false; };
                window.speechSynthesis.speak(utter);
            } catch (e) {
                isVoiceSpeaking = false;
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

    // Đảm bảo window không bao giờ bị scroll lệch ngang
    if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
    }
    if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
    if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;

    const el = document.querySelector(step.target);
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let targetRect;
    let isRoundTarget = false;
    let customRadius = "20px";

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
        isRoundTarget = true;
        customRadius = "50%";
    } else {
        let targetEl = el;
        if (step.target === "#shapeToggle" || step.target === "#themeToggle" || step.target === "#bgModeToggle" || step.target === "#musicGenreToggle") {
            targetEl = el.closest(".hub-item-group") || el;
        }

        let r = targetEl.getBoundingClientRect();
        if ((r.width === 0 || r.height === 0 || r.top < -500) && el.closest("#heartDropdownMenu")) {
            const fallback = document.getElementById("heartMenuToggleBtn");
            if (fallback) r = fallback.getBoundingClientRect();
        }

        // Tùy chỉnh padding và bo góc chính xác 100% theo từng phần tử
        if (el.classList.contains("heart-menu-btn") || step.target === "#heartMenuToggleBtn") {
            const pad = 4;
            targetRect = {
                left: r.left - pad,
                top: r.top - pad,
                width: r.width + pad * 2,
                height: r.height + pad * 2,
                right: r.right + pad,
                bottom: r.bottom + pad
            };
            isRoundTarget = true;
            customRadius = "50%";
        } else if (el.classList.contains("love-days-widget") || step.target === "#loveDaysWidget") {
            const padX = 6;
            const padY = 4;
            targetRect = {
                left: r.left - padX,
                top: r.top - padY,
                width: r.width + padX * 2,
                height: r.height + padY * 2,
                right: r.right + padX,
                bottom: r.bottom + padY
            };
            customRadius = "28px";
        } else if (step.target === "#catSquad" || step.target === "#gooseSquad") {
            const pad = 8;
            targetRect = {
                left: r.left - pad,
                top: r.top - pad,
                width: r.width + pad * 2,
                height: r.height + pad * 2,
                right: r.right + pad,
                bottom: r.bottom + pad
            };
            customRadius = "24px";
        } else {
            const padX = 6;
            const padY = 5;
            targetRect = {
                left: r.left - padX,
                top: r.top - padY,
                width: r.width + padX * 2,
                height: r.height + padY * 2,
                right: r.right + padX,
                bottom: r.bottom + padY
            };
            customRadius = "20px";
        }
    }

    // Cập nhật vị trí Spotlight chính xác pixel-perfect ngay lập tức (không trễ)
    tourSpotlight.style.left = `${Math.round(targetRect.left)}px`;
    tourSpotlight.style.top = `${Math.round(targetRect.top)}px`;
    tourSpotlight.style.width = `${Math.round(targetRect.width)}px`;
    tourSpotlight.style.height = `${Math.round(targetRect.height)}px`;
    tourSpotlight.style.borderRadius = customRadius;

    const tourSpotlightPulse = tourSpotlight.querySelector(".tour-spotlight-pulse");
    if (tourSpotlightPulse) {
        tourSpotlightPulse.style.borderRadius = isRoundTarget ? "50%" : customRadius;
    }

    const cardW = Math.min(380, winW * 0.92);
    const cardH = tourCard.offsetHeight || 185;

    let cardLeft;
    let cardTop;
    const hubCard = document.querySelector(".control-hub-card");
    const isHubOpen = controlHubModal && controlHubModal.classList.contains("open");

    const bottomNav = document.getElementById("mobileBottomBar");
    const isBottomNavVisible = bottomNav && window.getComputedStyle(bottomNav).display !== "none";
    const maxSafeBottom = isBottomNavVisible ? (winH - cardH - 74) : (winH - cardH - 14);

    if (winW <= 768) {
        // Màn hình Mobile: Căn giữa card theo chiều ngang
        cardLeft = Math.max(10, Math.min(winW - cardW - 10, (winW - cardW) / 2));

        if (step.target === "#catSquad" || step.target === "#gooseSquad") {
            // Đàn mèo / ngỗng ở dưới đáy màn hình -> Đặt card phía trên
            cardTop = Math.max(20, targetRect.top - cardH - 24);
        } else if (step.openHub && isHubOpen) {
            // Khi mở menu điều khiển trên mobile:
            // Luôn đặt card ở đáy màn hình để lộ hoàn toàn phần tử được highlight ở phía trên
            cardTop = maxSafeBottom;
        } else if (step.target === "#heartMenuToggleBtn" || step.target === "#loveDaysWidget") {
            // Nút ở đỉnh màn hình -> Card đặt bên dưới
            cardTop = targetRect.bottom + 14;
        } else if (step.placement === "top" || targetRect.bottom + cardH + 30 > winH) {
            cardTop = Math.max(16, targetRect.top - cardH - 20);
        } else {
            cardTop = Math.min(maxSafeBottom, targetRect.bottom + 14);
        }
    } else {
        // Màn hình Desktop
        cardLeft = targetRect.left + (targetRect.width / 2) - (cardW / 2);
        cardLeft = Math.max(16, Math.min(winW - cardW - 16, cardLeft));

        if (step.target === "#catSquad") {
            cardTop = Math.max(20, targetRect.top - cardH - 30);
            cardLeft = Math.max(16, winW - cardW - 20);
        } else if (step.target === "#gooseSquad") {
            cardTop = Math.max(20, targetRect.top - cardH - 30);
            cardLeft = 20;
        } else if (step.target === "#heartMenuToggleBtn") {
            cardTop = targetRect.bottom + 14;
            cardLeft = Math.max(16, winW - cardW - 20);
        } else if (step.target === "#loveDaysWidget") {
            cardTop = targetRect.bottom + 14;
            cardLeft = 20;
        } else if (step.openHub && isHubOpen && hubCard) {
            const hubRect = hubCard.getBoundingClientRect();
            if (winW - hubRect.right >= cardW + 24) {
                cardLeft = hubRect.right + 16;
                cardTop = Math.max(20, Math.min(winH - cardH - 20, targetRect.top - 10));
            } else if (hubRect.left >= cardW + 24) {
                cardLeft = hubRect.left - cardW - 16;
                cardTop = Math.max(20, Math.min(winH - cardH - 20, targetRect.top - 10));
            } else {
                cardTop = maxSafeBottom;
                cardLeft = (winW - cardW) / 2;
            }
        } else if (step.placement === "top" || targetRect.bottom + cardH + 40 > winH) {
            cardTop = Math.max(16, targetRect.top - cardH - 25);
        } else {
            cardTop = Math.min(maxSafeBottom, targetRect.bottom + 18);
        }
    }

    cardTop = Math.max(14, Math.min(maxSafeBottom, cardTop));

    if (hasUserMovedTourCard && userCustomCardLeft !== null && userCustomCardTop !== null) {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const cardW = tourCard.offsetWidth || 360;
        const cardH = tourCard.offsetHeight || 185;
        const safeLeft = Math.max(6, Math.min(winW - cardW - 6, userCustomCardLeft));
        const safeTop = Math.max(6, Math.min(winH - cardH - 6, userCustomCardTop));
        tourCard.style.left = `${Math.round(safeLeft)}px`;
        tourCard.style.top = `${Math.round(safeTop)}px`;
    } else {
        tourCard.style.left = `${Math.round(cardLeft)}px`;
        tourCard.style.top = `${Math.round(cardTop)}px`;
    }

    // Cập nhật vị trí Pointer bàn tay 👆
    if (tourPointer) {
        const pointerX = Math.max(16, Math.min(winW - 48, targetRect.left + (targetRect.width / 2) - 16));
        tourPointer.style.left = `${Math.round(pointerX)}px`;

        const effectiveCardTop = (hasUserMovedTourCard && userCustomCardTop !== null) ? userCustomCardTop : cardTop;
        if (effectiveCardTop < targetRect.top) {
            // Thẻ ở phía trên nút -> Bàn tay ở trên chỉ xuống phần tử
            tourPointer.style.top = `${Math.round(targetRect.top - 40)}px`;
            tourPointer.style.transform = "rotate(180deg)";
        } else {
            // Thẻ ở phía dưới nút -> Bàn tay ở dưới chỉ lên phần tử
            tourPointer.style.top = `${Math.round(targetRect.bottom + 6)}px`;
            tourPointer.style.transform = "rotate(0deg)";
        }
    }
}

// Tự động cuộn mượt mà đến đúng vị trí phần tử được highlight mà không bị lệch
function scrollToTourElement(el) {
    if (!el) return;
    try {
        let targetEl = el;
        if (el.id === "shapeToggle" || el.id === "themeToggle" || el.id === "bgModeToggle" || el.id === "musicGenreToggle") {
            targetEl = el.closest(".hub-item-group") || el;
        }

        const scrollParent = targetEl.closest(".control-hub-card, .music-card, .letter-card, .name-editor-card, .author-card");
        if (scrollParent) {
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const cardH = tourCard ? (tourCard.offsetHeight || 185) : 185;

            let visibleTargetY;
            if (winW <= 768) {
                const availableH = Math.max(140, winH - cardH - 50);
                visibleTargetY = availableH * 0.35;
            } else {
                visibleTargetY = Math.max(80, scrollParent.clientHeight * 0.3);
            }

            const currentRelativeTop = targetEl.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top;
            const targetScrollTop = Math.max(0, scrollParent.scrollTop + currentRelativeTop - visibleTargetY);

            scrollParent.scrollTo({
                top: targetScrollTop,
                behavior: "smooth"
            });
        } else {
            window.scrollTo({ left: 0, top: 0, behavior: "instant" });
            if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
            if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;
        }
    } catch (err) {
        // fallback
    }
}

// Theo dõi bám sát vị trí theo từng khung hình liên tục để khung dạ quang bám dính tuyệt đối
function syncTourTracking(duration = 850) {
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

    // Reset vị trí kéo tùy chỉnh khi đổi bước mới
    hasUserMovedTourCard = false;
    userCustomCardLeft = null;
    userCustomCardTop = null;

    // Khóa scroll horizontal window
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
    if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;

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
    updateTourPosition();

    // Tự động cuộn mượt mà đến đúng vị trí phần tử được highlight
    const el = document.querySelector(step.target);
    if (el) {
        scrollToTourElement(el);
    }

    // Đồng bộ bám sát vị trí liên tục trong 850ms để khung dạ quang không bao giờ bị lệch khi đang mở modal/cuộn
    syncTourTracking(850);

    // Tự động phát âm thanh giọng nói tiếng Việt vui tươi
    speakTourVoice(step);
}

function closeTour(startMusicAfter = true) {
    isTourActive = false;
    document.body.classList.remove("tour-active");
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
    document.body.classList.add("tour-active");
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    if (tourOverlay) tourOverlay.classList.add("active");
    goToTourStep(0);
}

let isStepChanging = false;

function handleTourNext(e) {
    if (e) {
        e.preventDefault();
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
        e.preventDefault();
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
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    closeTour(true);
}

if (tourNextBtn) tourNextBtn.addEventListener("click", handleTourNext);
if (tourPrevBtn) tourPrevBtn.addEventListener("click", handleTourPrev);
if (tourCloseBtn) tourCloseBtn.addEventListener("click", handleTourClose);
if (tourSkipBtn) tourSkipBtn.addEventListener("click", handleTourClose);
if (tourGuideBtn) tourGuideBtn.addEventListener("click", (e) => { if (e) e.stopPropagation(); startTour(); });
if (topTourGuideBtn) topTourGuideBtn.addEventListener("click", (e) => { if (e) e.stopPropagation(); startTour(); });

let isDraggingTourCard = false;
let tourDragStartX = 0;
let tourDragStartY = 0;
let tourCardInitialLeft = 0;
let tourCardInitialTop = 0;
let hasUserMovedTourCard = false;
let userCustomCardLeft = null;
let userCustomCardTop = null;
let tourDragMoved = false;

function initTourCardDraggable() {
    if (!tourCard) return;

    function startDrag(clientX, clientY) {
        isDraggingTourCard = true;
        tourDragMoved = false;
        tourDragStartX = clientX;
        tourDragStartY = clientY;
        const rect = tourCard.getBoundingClientRect();
        tourCardInitialLeft = rect.left;
        tourCardInitialTop = rect.top;
        tourCard.classList.add("dragging");
    }

    function moveDrag(clientX, clientY) {
        if (!isDraggingTourCard) return;
        const dx = clientX - tourDragStartX;
        const dy = clientY - tourDragStartY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            tourDragMoved = true;
        }
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const cardW = tourCard.offsetWidth || 360;
        const cardH = tourCard.offsetHeight || 185;

        let newLeft = tourCardInitialLeft + dx;
        let newTop = tourCardInitialTop + dy;

        newLeft = Math.max(6, Math.min(winW - cardW - 6, newLeft));
        newTop = Math.max(6, Math.min(winH - cardH - 6, newTop));

        tourCard.style.left = `${Math.round(newLeft)}px`;
        tourCard.style.top = `${Math.round(newTop)}px`;

        hasUserMovedTourCard = true;
        userCustomCardLeft = newLeft;
        userCustomCardTop = newTop;
    }

    function endDrag() {
        if (!isDraggingTourCard) return;
        isDraggingTourCard = false;
        tourCard.classList.remove("dragging");
    }

    tourCard.addEventListener("mousedown", (e) => {
        if (e.target.closest("button") || e.target.closest(".tour-dot")) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    window.addEventListener("mousemove", (e) => {
        if (isDraggingTourCard) {
            e.preventDefault();
            moveDrag(e.clientX, e.clientY);
        }
    });

    window.addEventListener("mouseup", () => {
        endDrag();
    });

    tourCard.addEventListener("touchstart", (e) => {
        if (e.target.closest("button") || e.target.closest(".tour-dot")) return;
        if (e.touches.length === 1) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        if (isDraggingTourCard && e.touches.length === 1) {
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener("touchend", () => {
        endDrag();
    });
}
initTourCardDraggable();

if (tourCard) {
    tourCard.addEventListener("click", (e) => {
        if (tourDragMoved) {
            tourDragMoved = false;
            return;
        }
        // Nếu không bấm vào nút đóng/bỏ qua/tiếp tục/kéo thì đọc lại lời thoại
        if (!e.target.closest("button") && !e.target.closest(".tour-dot") && !e.target.closest(".tour-drag-handle")) {
            const step = TOUR_STEPS[currentTourStep];
            if (step) speakTourVoice(step);
        }
    });
}

window.addEventListener("resize", () => {
    if (isTourActive) updateTourPosition();
});

window.addEventListener("scroll", () => {
    if (isTourActive) updateTourPosition();
}, { passive: true });

document.querySelectorAll(".control-hub-card, .music-card, .letter-card, .name-editor-card, .author-card, .hub-chips-row").forEach(container => {
    container.addEventListener("scroll", () => {
        if (isTourActive) updateTourPosition();
    }, { passive: true });
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


