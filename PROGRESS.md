# TIẾN TRÌNH DỰ ÁN: "SINH VIÊN LÉN LÚT" (SNEAKY STUDENT)

## 1. Giới thiệu dự án
- **Tên dự án:** Sinh Viên Lén Lút (Sneaky Student)
- **Thể loại:** Web Minigame 2D phản xạ / lén lút
- **Mục tiêu:** Học viên CodeGym lén chơi game trong giờ thực hành mà không bị Mentor phát hiện. Sống sót qua 3 phút (180 giây) để chiến thắng.
- **Stack công nghệ:** 
  - Backend: Java 17+, Spring Boot 3.2.x (Spring Web, Thymeleaf, Spring Boot DevTools)
  - Frontend: HTML5, CSS3, JavaScript Vanilla, Thymeleaf Template Engine
  - Build Tool: Maven (`pom.xml`)

---

## 2. Kế hoạch triển khai & Trạng thái các bước

- [x] **Bước 1:** Khởi tạo kiến trúc dự án, lên cấu trúc thư mục, lập file `PROGRESS.md` *(Hoàn thành)*
- [x] **Bước 2:** Xây dựng phần Backend: *(Hoàn thành)*
  - Khởi tạo file Maven `pom.xml` với đầy đủ dependencies: Spring Boot Web, Thymeleaf, DevTools.
  - Tạo file cấu hình `application.properties` (cấu hình port 8080, tắt Thymeleaf cache trong môi trường dev).
  - Tạo lớp ứng dụng chính `SneakyStudentApplication.java`.
  - Tạo Controller `GameController.java` xử lý mapping `/` và `/game`, truyền data model `targetTimeSeconds = 180` sang view Thymeleaf.
- [x] **Bước 3:** Viết code phần Frontend (giao diện, CSS timer bar, JS logic, popup Thắng/Thua, placeholder assets): *(Hoàn thành)*
  - `src/main/resources/templates/index.html`: Giao diện phòng học CodeGym, thanh Timer Bar sát mép trên, khung cảnh Mentor & Học viên, khu vực điều khiển, Modal Game Over với Khung thoại (Speech Bubble "Học bài đi!"), Modal Game Win.
  - `src/main/resources/static/css/style.css`: Tạo style hiện đại, responsive, hiệu ứng rung rinh khi Mentor cảnh báo, hiệu ứng active khi nhấn giữ nút, speech bubble chân thực.
  - `src/main/resources/static/js/game.js`: Đếm lùi 180s (3 phút), State machine của Mentor (`SAFE` -> `WARNING` 0.5-1s -> `WATCHING`), sự kiện đa nền tảng (`mousedown/mouseup`, `touchstart/touchend`, `Spacebar`), vòng lặp kiểm tra va chạm bắt quả tang (`WATCHING` + `PLAYING` => Game Over).
  - `src/main/resources/static/images/`: Đã khởi tạo đầy đủ 7 tệp ảnh placeholder PNG tương thích chuẩn:
    - `mentor-safe.png`
    - `mentor-warning.png`
    - `mentor-angry.png`
    - `student-learning.png`
    - `student-playing.png`
    - `student-cry.png`
    - `student-win.png`
- [x] **Bước 4:** Kiểm tra hoàn thiện và tài liệu hóa hướng dẫn chạy dự án.
- [x] **Bổ sung Màn hình Bắt Đầu (Start Screen):**
  - Giao diện khởi động game phong cách lớp học CodeGym, nút "BẮT ĐẦU CHƠI!" nổi bật, hỗ trợ phím Enter để vào game.
- [x] **Bổ sung Cơ chế Thanh Tập Trung (Focus Bar System):**
  - Người chơi nếu không bấm chơi game (chỉ ngồi học), thanh tập trung (100%) sẽ tự động tụt dần (~7%/s).
  - Bấm nút chơi game sẽ giúp xả stress, hồi phục độ tập trung (~10%/s).
  - Khi thanh tập trung tụt về 0%: Người chơi rơi vào trạng thái "Bị nghiện game", tự động chuyển sang chơi game vĩnh viễn và bị khoá hoàn toàn, không thể quay về học lại được dù có bấm hay thả nút!
- [x] **Tích hợp Hệ Thống Âm Thanh Đa Dạng (Sound Effects):**
  - Sử dụng Web Audio API tích hợp sẵn, không lo thiếu asset:
    - 🎵 Âm thanh khởi động trận đấu (Game Start chime).
    - ⌨️ Tiếng gõ phím lách cách khi đang chăm chỉ học code.
    - 🕹️ Tiếng 8-bit blip vui nhộn khi lén cày game.
    - ⚠️ Còi kép cảnh báo khi Mentor chuẩn bị ngước nhìn.
    - 🚨 Còi báo động khẩn cấp khi Mentor ngẩng đầu quan sát.
    - 😵 Âm thanh tụt nốt bi đát khi mất tập trung và rơi vào trạng thái nghiện game.
    - 💀 Đoạn nhạc thất bại Game Over bi tráng khi bị bắt bài.
    - 🏆 Đoạn nhạc kèn chiến thắng (Victory Fanfare) hào hùng khi sống sót trọn vẹn 3 phút.
    - 🔊 Nút bật/tắt âm thanh (Mute/Unmute) trên HUD góc phải.
- [x] **Cập nhật đồ họa nhân vật & lớp học (Graphics Upgrade):**
  - Đã thiết kế bộ Vector SVG sắc nét tái hiện đúng chuẩn 1 lớp học CodeGym với bục giảng, bảng xanh, bàn ghế và laptop:
    - `mentor-safe.svg`: Mentor cắm cúi code bên chiếc laptop trên bàn giảng, bảng xanh CodeGym phía sau.
    - `mentor-warning.svg`: Mentor hé mắt nghi ngờ trên gọng kính, có dấu chấm than cảnh báo chuẩn bị ngẩng lên.
    - `mentor-angry.svg`: Mentor đứng phắt dậy trừng mắt giận dữ trong popup Thua.
    - `student-learning.svg`: Sinh viên ngồi nghiêm túc gõ code Java trên IntelliJ IDEA trên laptop.
    - `student-playing.svg`: Màn hình laptop đổi sang game 8-bit, học sinh hí hửng bấm phím leo rank.
    - `student-cry.svg`: Học sinh khóc tuôn trào nước mắt khi bị bắt quả tang.
    - `student-win.svg`: Học sinh đeo kính râm cool ngầu giơ 2 tay chữ V ăn mừng chiến thắng.
- [x] **Xử lý sự cố môi trường (Fix Bug):**
  - *Lỗi:* `mvn : The term 'mvn' is not recognized` do máy tính chưa cấu hình biến môi trường Maven / JDK 17+.
  - *Giải pháp:*
    1. Tạo sẵn script `run_game_preview.py` để bạn có thể test và chơi game ngay lập tức ở cổng `8080` bằng Python.
    2. Hướng dẫn chạy chuẩn Spring Boot bằng IntelliJ IDEA hoặc cài đặt Maven.

---

## 3. Cấu trúc thư mục hiện tại

```text
sk/
│
├── pom.xml                                                 # [Đã tạo] Maven Spring Boot configuration
├── PROGRESS.md                                             # [Đã cập nhật] File theo dõi tiến độ
│
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── codegym/
        │           └── sneakystudent/
        │               ├── SneakyStudentApplication.java   # [Đã tạo] Main Application
        │               └── controller/
        │                   └── GameController.java        # [Đã tạo] Game Web Controller
        │
        └── resources/
            ├── application.properties                      # [Đã tạo] Cấu hình Spring Boot
            ├── static/
            │   ├── css/
            │   │   └── style.css                           # [Đã tạo] Giao diện, Timer bar mép trên, Speech bubble
            │   ├── js/
            │   │   └── game.js                             # [Đã tạo] Bộ đếm 180s, logic cảnh báo & bắt quả tang
            │   └── images/                                 # [Đã tạo] Bộ ảnh 7 asset PNG hoàn chỉnh
            │       ├── mentor-safe.png
            │       ├── mentor-warning.png
            │       ├── mentor-angry.png
            │       ├── student-learning.png
            │       ├── student-playing.png
            │       ├── student-cry.png
            │       └── student-win.png
            └── templates/
                └── index.html                              # [Đã tạo] Giao diện Thymeleaf hoàn chỉnh
```

---

## 4. Hướng dẫn thay thế ảnh thật (Assets Guide)
Khi bạn muốn cá nhân hóa mặt Mentor/Học viên của lớp bạn, chỉ cần chép đè ảnh của bạn vào thư mục:
`src/main/resources/static/images/` với các tên file tương ứng:
- `mentor-safe.png`: Mentor đang cắm cúi code.
- `mentor-warning.png`: Mentor ngước mắt lên 1 nửa (chuẩn bị bắt bài).
- `mentor-angry.png`: Mentor nhìn chằm chằm giận dữ (Dùng cho popup thua).
- `student-learning.png`: Học sinh đang nghiêm túc gõ phím.
- `student-playing.png`: Học sinh đang cười hí hửng.
- `student-cry.png`: Chế meme mặt khóc lóc (Dùng cho popup thua).
- `student-win.png`: Hình ảnh ăn mừng, quẩy tung nóc (Dùng cho popup thắng).

---

## 5. Hướng dẫn khởi chạy dự án
1. Đảm bảo máy bạn đã cài JDK 17+ và Maven.
2. Tại thư mục gốc `sk`:
   ```bash
   mvn clean spring-boot:run
   ```
   (Hoặc mở dự án trực tiếp bằng IntelliJ IDEA / Eclipse / VS Code và nhấn Run class `SneakyStudentApplication.java`).
3. Mở trình duyệt web truy cập: [http://localhost:8080](http://localhost:8080)
