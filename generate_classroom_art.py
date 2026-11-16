import os

img_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "main", "resources", "static", "images")
os.makedirs(img_dir, exist_ok=True)

# 1. mentor-safe.png (Mentor cúi đầu vào laptop trên bàn giảng, bảng CodeGym phía sau)
svg_mentor_safe = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWall1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="boardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgWall1)"/>
  <rect x="30" y="25" width="340" height="130" rx="8" fill="url(#boardGrad1)" stroke="#b45309" stroke-width="6"/>
  
  <text x="50" y="58" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">CODEGYM CLASSROOM - MODULE 3</text>
  <text x="50" y="82" fill="#f8fafc" font-family="monospace" font-size="12">// Spring Boot MVC &amp; Thymeleaf</text>
  <text x="50" y="104" fill="#fbbf24" font-family="monospace" font-size="12">public class StudentPractice {</text>
  <text x="70" y="124" fill="#94a3b8" font-family="monospace" font-size="11">   System.out.println("Dang code...");</text>
  <text x="50" y="144" fill="#fbbf24" font-family="monospace" font-size="12">}</text>

  <rect x="110" y="165" width="180" height="26" rx="13" fill="#059669"/>
  <text x="200" y="182" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">MENTOR: CUI MAT CODE</text>

  <!-- Than Mentor cui mat -->
  <ellipse cx="200" cy="275" rx="70" ry="50" fill="#2563eb"/>
  <rect x="150" y="270" width="100" height="60" fill="#1d4ed8" rx="8"/>

  <!-- Dau Mentor guc xuong nhin laptop -->
  <circle cx="200" cy="225" r="38" fill="#fbcfe8"/>
  <path d="M 165 220 Q 200 185 235 220 Q 200 200 165 220 Z" fill="#1e293b"/>
  <line x1="185" y1="230" x2="195" y2="230" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="205" y1="230" x2="215" y2="230" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  
  <circle cx="190" cy="230" r="10" fill="none" stroke="#64748b" stroke-width="2"/>
  <circle cx="210" cy="230" r="10" fill="none" stroke="#64748b" stroke-width="2"/>
  <line x1="200" y1="230" x2="200" y2="230" stroke="#64748b" stroke-width="2"/>

  <!-- Ban lam viec giang vien -->
  <rect x="40" y="300" width="320" height="90" fill="#78350f" rx="6"/>
  <rect x="35" y="295" width="330" height="15" fill="#92400e" rx="3"/>

  <!-- Laptop cua Mentor -->
  <polygon points="140,290 260,290 240,225 160,225" fill="#94a3b8"/>
  <circle cx="200" cy="255" r="8" fill="#f8fafc"/>
  <polygon points="120,315 280,315 260,290 140,290" fill="#cbd5e1"/>
  <rect x="175" y="300" width="50" height="8" rx="2" fill="#64748b"/>

  <!-- Ly cafe CodeGym -->
  <rect x="80" y="275" width="22" height="30" rx="3" fill="#ea580c"/>
  <text x="91" y="295" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">CG</text>
  <path d="M 102 282 Q 112 288 102 296" fill="none" stroke="#ea580c" stroke-width="3"/>

  <circle cx="345" cy="55" r="22" fill="#10b981"/>
  <text x="345" y="62" fill="#fff" font-size="18" text-anchor="middle">SAFE</text>
</svg>'''

# 2. mentor-warning.png
svg_mentor_warning = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWarn2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="boardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgWarn2)"/>
  <rect x="30" y="25" width="340" height="130" rx="8" fill="url(#boardGrad2)" stroke="#b45309" stroke-width="6"/>
  <text x="50" y="60" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">CODEGYM CLASSROOM - MODULE 3</text>
  <text x="50" y="90" fill="#fbbf24" font-family="monospace" font-size="13">!! MENTOR DANG NGHI NGO...</text>

  <!-- Dau canh bao -->
  <g transform="translate(200, 150)">
    <polygon points="0,-35 -30,20 30,20" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
    <text x="0" y="14" fill="#000" font-family="sans-serif" font-size="32" font-weight="900" text-anchor="middle">!</text>
  </g>

  <rect x="90" y="170" width="220" height="26" rx="13" fill="#d97706"/>
  <text x="200" y="187" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">CANH BAO: CHUAN BI NGANG DAU</text>

  <!-- Than Mentor -->
  <ellipse cx="200" cy="270" rx="72" ry="52" fill="#2563eb"/>
  <rect x="145" y="260" width="110" height="65" fill="#1d4ed8" rx="8"/>

  <!-- Dau Mentor nguoc nhin -->
  <circle cx="200" cy="215" r="40" fill="#fbcfe8"/>
  <path d="M 160 210 Q 200 170 240 210 Q 200 190 160 210 Z" fill="#1e293b"/>
  
  <circle cx="188" cy="215" r="12" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="212" cy="215" r="12" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <line x1="200" y1="215" x2="200" y2="215" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="188" cy="211" r="5" fill="#1e293b"/>
  <circle cx="212" cy="211" r="5" fill="#1e293b"/>
  <line x1="178" y1="198" x2="195" y2="203" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <line x1="222" y1="198" x2="205" y2="203" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>

  <!-- Ban va Laptop -->
  <rect x="40" y="300" width="320" height="90" fill="#78350f" rx="6"/>
  <rect x="35" y="295" width="330" height="15" fill="#92400e" rx="3"/>
  <polygon points="140,290 260,290 245,230 155,230" fill="#94a3b8"/>
  <polygon points="120,315 280,315 260,290 140,290" fill="#cbd5e1"/>
</svg>'''

# 3. mentor-angry.png
svg_mentor_angry = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="alertBg3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </radialGradient>
  </defs>

  <rect width="400" height="400" fill="url(#alertBg3)"/>
  <polygon points="40,20 80,10 60,70 100,50 50,130" fill="#facc15" opacity="0.6"/>
  <polygon points="350,20 320,10 340,70 300,50 340,130" fill="#facc15" opacity="0.6"/>

  <!-- Than Mentor dung phat day -->
  <ellipse cx="200" cy="290" rx="80" ry="60" fill="#b91c1c"/>
  <rect x="135" y="270" width="130" height="75" fill="#991b1b" rx="10"/>

  <!-- Dau Mentor nhin cham cham -->
  <circle cx="200" cy="180" r="48" fill="#fbcfe8"/>
  <path d="M 152 170 Q 200 120 248 170 Q 200 150 152 170 Z" fill="#1e293b"/>

  <!-- Mat do gian du -->
  <circle cx="182" cy="180" r="14" fill="#ffffff" stroke="#ef4444" stroke-width="4"/>
  <circle cx="218" cy="180" r="14" fill="#ffffff" stroke="#ef4444" stroke-width="4"/>
  <circle cx="182" cy="180" r="6" fill="#dc2626"/>
  <circle cx="218" cy="180" r="6" fill="#dc2626"/>

  <line x1="170" y1="162" x2="194" y2="172" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <line x1="230" y1="162" x2="206" y2="172" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>

  <!-- Mieng quat to -->
  <ellipse cx="200" cy="208" rx="18" ry="12" fill="#7f1d1d"/>
  <path d="M 188 202 Q 200 206 212 202" stroke="#ffffff" stroke-width="3" fill="none"/>

  <!-- Ban va Laptop -->
  <rect x="40" y="320" width="320" height="80" fill="#78350f" rx="6"/>
  <rect x="35" y="315" width="330" height="15" fill="#92400e" rx="3"/>
  <polygon points="140,310 260,310 250,250 150,250" fill="#64748b"/>

  <rect x="100" y="30" width="200" height="36" rx="8" fill="#dc2626" stroke="#fff" stroke-width="2"/>
  <text x="200" y="54" fill="#fff" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">BAT QUA TANG! [!]</text>
</svg>'''

# 4. student-learning.png
svg_student_learning = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgStudLearn4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1e2f"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="screenCode4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e1e"/>
      <stop offset="100%" stop-color="#2d3748"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgStudLearn4)"/>

  <!-- Cua so lop hoc -->
  <rect x="20" y="30" width="70" height="120" rx="4" fill="#38bdf8" opacity="0.3" stroke="#64748b" stroke-width="4"/>
  <line x1="55" y1="30" x2="55" y2="150" stroke="#64748b" stroke-width="3"/>
  <line x1="20" y1="90" x2="90" y2="90" stroke="#64748b" stroke-width="3"/>

  <!-- Sinh vien ngoi hoc nghiem tuc tren laptop -->
  <ellipse cx="200" cy="220" rx="65" ry="50" fill="#0284c7"/>
  <rect x="155" y="210" width="90" height="60" fill="#0369a1" rx="8"/>
  <text x="200" y="235" fill="#e0f2fe" font-size="10" font-weight="bold" text-anchor="middle">CODEGYM</text>

  <!-- Tay sinh vien tren ban phim laptop -->
  <ellipse cx="140" cy="275" rx="18" ry="10" fill="#fbcfe8" transform="rotate(-20 140 275)"/>
  <ellipse cx="260" cy="275" rx="18" ry="10" fill="#fbcfe8" transform="rotate(20 260 275)"/>

  <!-- Dau sinh vien -->
  <circle cx="200" cy="155" r="36" fill="#fbcfe8"/>
  <path d="M 165 150 Q 200 115 235 150 Q 220 135 180 135 Z" fill="#334155"/>
  <ellipse cx="190" cy="160" rx="4" ry="5" fill="#1e293b"/>
  <ellipse cx="210" cy="160" rx="4" ry="5" fill="#1e293b"/>
  <line x1="185" y1="152" x2="195" y2="154" stroke="#1e293b" stroke-width="2"/>
  <line x1="215" y1="152" x2="205" y2="154" stroke="#1e293b" stroke-width="2"/>
  <path d="M 194 175 Q 200 180 206 175" stroke="#475569" stroke-width="2" fill="none"/>

  <!-- Ban hoc vien -->
  <rect x="30" y="280" width="340" height="110" fill="#52525b" rx="6"/>
  <rect x="25" y="275" width="350" height="15" fill="#71717a" rx="3"/>

  <!-- Laptop cua Sinh Vien (Man hinh quay ve nguoi xem) -->
  <rect x="120" y="195" width="160" height="100" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="4"/>
  <rect x="126" y="201" width="148" height="88" rx="3" fill="url(#screenCode4)"/>
  <rect x="126" y="201" width="148" height="14" fill="#3b82f6"/>
  <text x="132" y="211" fill="#fff" font-family="monospace" font-size="8">Main.java - IntelliJ IDEA</text>
  <text x="132" y="228" fill="#ec4899" font-family="monospace" font-size="9">import</text>
  <text x="172" y="228" fill="#f8fafc" font-family="monospace" font-size="9">java.util.*;</text>
  <text x="132" y="245" fill="#fbbf24" font-family="monospace" font-size="9">void codePractice() {</text>
  <text x="142" y="260" fill="#4ade80" font-family="monospace" font-size="8">// Hoc cham chi...</text>
  <text x="132" y="275" fill="#fbbf24" font-family="monospace" font-size="9">}</text>

  <!-- De laptop va Ban phim -->
  <polygon points="100,310 300,310 280,295 120,295" fill="#94a3b8"/>
  <rect x="175" y="300" width="50" height="6" rx="2" fill="#475569"/>

  <!-- Sach Java -->
  <rect x="50" y="295" width="40" height="50" rx="3" fill="#dc2626"/>
  <text x="70" y="325" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">JAVA</text>
</svg>'''

# 5. student-playing.png
svg_student_playing = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgStudPlay5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2e1065"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="screenGame5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgStudPlay5)"/>
  <circle cx="200" cy="240" r="130" fill="#a855f7" opacity="0.15"/>

  <!-- Sinh vien cuoi toe toet choi game -->
  <ellipse cx="200" cy="220" rx="65" ry="50" fill="#7c3aed"/>
  <rect x="155" y="210" width="90" height="60" fill="#6d28d9" rx="8"/>

  <!-- Tay go ban phim cuc nhanh -->
  <ellipse cx="135" cy="270" rx="20" ry="12" fill="#fbcfe8" transform="rotate(-30 135 270)"/>
  <ellipse cx="265" cy="270" rx="20" ry="12" fill="#fbcfe8" transform="rotate(30 265 270)"/>

  <!-- Dau sinh vien cuoi hon ho -->
  <circle cx="200" cy="155" r="36" fill="#fbcfe8"/>
  <path d="M 165 150 Q 200 115 235 150 Q 220 135 180 135 Z" fill="#334155"/>
  <path d="M 183 158 Q 190 152 197 158" stroke="#1e293b" stroke-width="3" fill="none"/>
  <path d="M 203 158 Q 210 152 217 158" stroke="#1e293b" stroke-width="3" fill="none"/>
  <path d="M 190 170 Q 200 186 210 170 Z" fill="#dc2626"/>

  <!-- Ban hoc -->
  <rect x="30" y="280" width="340" height="110" fill="#52525b" rx="6"/>
  <rect x="25" y="275" width="350" height="15" fill="#71717a" rx="3"/>

  <!-- Laptop dang choi game 8-bit -->
  <rect x="120" y="195" width="160" height="100" rx="6" fill="#0f172a" stroke="#a855f7" stroke-width="4"/>
  <rect x="126" y="201" width="148" height="88" rx="3" fill="url(#screenGame5)"/>
  <rect x="185" y="230" width="30" height="30" fill="#facc15" rx="4"/>
  <text x="200" y="250" fill="#000" font-size="16" text-anchor="middle">X</text>
  <text x="135" y="220" fill="#fff" font-family="monospace" font-size="10" font-weight="bold">SCORE: 99999</text>
  <text x="200" y="278" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">LEO RANK GAME</text>

  <polygon points="100,310 300,310 280,295 120,295" fill="#94a3b8"/>
  <rect x="175" y="300" width="50" height="6" rx="2" fill="#475569"/>

  <rect x="110" y="25" width="180" height="28" rx="14" fill="#a855f7"/>
  <text x="200" y="44" fill="#fff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">DANG LEN CHOI GAME!</text>
</svg>'''

# 6. student-cry.png
svg_student_cry = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgStudCry6" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgStudCry6)"/>

  <ellipse cx="200" cy="230" rx="65" ry="50" fill="#475569"/>
  <circle cx="200" cy="165" r="40" fill="#fbcfe8"/>
  <path d="M 160 160 Q 200 120 240 160 Q 220 145 180 145 Z" fill="#1e293b"/>

  <path d="M 180 168 Q 188 160 196 168" stroke="#1e293b" stroke-width="3" fill="none"/>
  <path d="M 204 168 Q 212 160 220 168" stroke="#1e293b" stroke-width="3" fill="none"/>
  
  <path d="M 175 168 C 150 175 140 220 145 250" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
  <path d="M 225 168 C 250 175 260 220 255 250" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>

  <path d="M 188 195 Q 200 182 212 195" stroke="#1e293b" stroke-width="4" fill="none"/>

  <rect x="30" y="280" width="340" height="110" fill="#52525b" rx="6"/>
  <rect x="25" y="275" width="350" height="15" fill="#71717a" rx="3"/>

  <!-- Laptop bi gap lai -->
  <polygon points="130,295 270,295 250,280 150,280" fill="#475569"/>
  <text x="200" y="335" fill="#fca5a5" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">BIEN BAN VI PHAM KY LUAT :((</text>
</svg>'''

# 7. student-win.png
svg_student_win = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWin7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#065f46"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>

  <rect width="400" height="400" fill="url(#bgWin7)"/>
  
  <!-- Phao hoa -->
  <circle cx="80" cy="60" r="8" fill="#facc15"/>
  <circle cx="320" cy="80" r="10" fill="#ec4899"/>
  <circle cx="100" cy="140" r="6" fill="#38bdf8"/>
  <circle cx="300" cy="150" r="7" fill="#4ade80"/>

  <!-- Cup vang -->
  <g transform="translate(200, 70)">
    <path d="M -25 -20 L 25 -20 L 20 15 Q 0 35 -20 15 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
    <rect x="-8" y="25" width="16" height="15" fill="#ca8a04"/>
    <rect x="-20" y="40" width="40" height="10" rx="3" fill="#a16207"/>
    <text x="0" y="10" fill="#854d0e" font-size="14" font-weight="bold" text-anchor="middle">*</text>
  </g>

  <!-- Sinh vien gio 2 tay chien thang -->
  <path d="M 155 200 L 110 130" stroke="#fbcfe8" stroke-width="16" stroke-linecap="round"/>
  <path d="M 245 200 L 290 130" stroke="#fbcfe8" stroke-width="16" stroke-linecap="round"/>
  <circle cx="105" cy="125" r="12" fill="#fbcfe8"/>
  <circle cx="295" cy="125" r="12" fill="#fbcfe8"/>

  <ellipse cx="200" cy="230" rx="60" ry="50" fill="#10b981"/>
  <rect x="160" y="220" width="80" height="60" fill="#059669" rx="8"/>

  <!-- Dau kinh ram cool ngau -->
  <circle cx="200" cy="170" r="38" fill="#fbcfe8"/>
  <path d="M 165 165 Q 200 130 235 165 Q 220 150 180 150 Z" fill="#1e293b"/>
  <polygon points="175,165 195,165 190,178 175,178" fill="#0f172a"/>
  <polygon points="205,165 225,165 225,178 210,178" fill="#0f172a"/>
  <line x1="195" y1="168" x2="205" y2="168" stroke="#0f172a" stroke-width="3"/>
  <path d="M 190 188 Q 200 198 210 188" stroke="#1e293b" stroke-width="3" fill="none"/>

  <!-- Ban va Laptop -->
  <rect x="30" y="300" width="340" height="90" fill="#52525b" rx="6"/>
  <rect x="25" y="295" width="350" height="15" fill="#71717a" rx="3"/>
  <rect x="140" y="255" width="120" height="60" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="3"/>
  <text x="200" y="290" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">PASS 100%!</text>
</svg>'''

svgs = [
    ('mentor-safe.svg', svg_mentor_safe),
    ('mentor-warning.svg', svg_mentor_warning),
    ('mentor-angry.svg', svg_mentor_angry),
    ('student-learning.svg', svg_student_learning),
    ('student-playing.svg', svg_student_playing),
    ('student-cry.svg', svg_student_cry),
    ('student-win.svg', svg_student_win)
]

for filename, content in svgs:
    with open(os.path.join(img_dir, filename), 'w', encoding='utf-8') as f:
        f.write(content)

print("ALL SVGS GENERATED SUCCESSFULLY")
