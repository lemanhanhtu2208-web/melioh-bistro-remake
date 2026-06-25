# MeliOh Bistro — Kết nối hệ thống đặt bàn thật (Google Sheets)

Mặc định website chạy ở **chế độ demo** (lưu tạm trên trình duyệt — `localStorage`).
Để admin nhận được booking khách đặt từ **mọi thiết bị**, làm theo các bước sau.
Hoàn toàn **miễn phí**, chỉ cần một tài khoản Google.

---

## Bước 1 — Tạo Google Sheet
1. Vào [sheets.new](https://sheets.new) tạo một bảng tính mới.
2. Đặt tên, ví dụ: **MeliOh Reservations**.

## Bước 2 — Mở Apps Script
1. Trong Sheet: menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Xóa hết code mẫu trong `Code.gs`.
3. Mở file `apps-script/Code.gs` trong repo này, **copy toàn bộ** và dán vào.
4. Nhấn **Lưu** (biểu tượng đĩa).

## Bước 3 — Đặt mật khẩu admin (lưu trên server, KHÔNG nằm trong source web)
1. Trong code, tìm hàm `setAdminPassword()` ở cuối file.
2. Đổi `'CHANGE_ME_to_a_strong_password'` thành mật khẩu mạnh của bạn.
3. Ở thanh công cụ, chọn hàm **`setAdminPassword`** rồi nhấn **Run** (▶).
   - Lần đầu sẽ hỏi cấp quyền → **Review permissions** → chọn tài khoản → **Allow**.
4. Chạy xong, **xóa lại** mật khẩu trong hàm (để không lưu trong lịch sử code),
   nhấn Lưu. Mật khẩu đã được cất an toàn trong *Script Properties*.

## Bước 4 — Deploy thành Web App
1. Nhấn **Deploy → New deployment**.
2. Bánh răng ⚙ → chọn **Web app**.
3. Thiết lập:
   - **Execute as:** *Me* (chính bạn).
   - **Who has access:** *Anyone* (để website gửi dữ liệu vào được).
4. Nhấn **Deploy** → copy **Web app URL** (kết thúc bằng `/exec`).

## Bước 5 — Dán URL vào website
1. Mở file `config.js` trong repo.
2. Dán URL vào dòng `endpoint`:
   ```js
   window.MELIOH_CONFIG = {
     endpoint: "https://script.google.com/macros/s/AKfy.../exec",
     phone: "+84 0918 204 008"
   };
   ```
3. Commit & push. GitHub Pages sẽ tự cập nhật sau 1–2 phút.

---

## Xong! Kiểm tra
- Vào website, đặt thử một bàn → mở Google Sheet sẽ thấy dòng mới xuất hiện.
- Vào `admin.html`, đăng nhập bằng mật khẩu ở Bước 3 → thấy danh sách booking từ Sheet.
- Đổi trạng thái / xóa trong admin → Sheet cập nhật theo.

## Lưu ý bảo mật
- Mật khẩu admin **không** nằm trong file nào của website — chỉ ở Script Properties.
- `config.js` chỉ chứa URL công khai, an toàn để public.
- Khi đổi mật khẩu sau này: chạy lại `setAdminPassword()` với giá trị mới.
- Nếu sửa code Apps Script: **Deploy → Manage deployments → Edit → New version**
  (giữ nguyên URL cũ).

## Chế độ demo (chưa cấu hình backend)
Khi `endpoint` còn để trống `""`, website dùng `localStorage` để demo trên một
máy. Mật khẩu demo mặc định của admin là `melioh2024` (chỉ dùng để xem thử).
