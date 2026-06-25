# Hướng dẫn dùng Trang Quản Lý (Admin)

Dành cho chủ / quản lý MeliOh Bistro. Không cần biết kỹ thuật.

> **Link admin:** https://lemanhanhtu2208-web.github.io/melioh-bistro-remake/admin.html

---

## 1. Đăng nhập

1. Mở link admin ở trên (dùng được trên điện thoại hoặc máy tính).
2. Nhập **mật khẩu** → bấm **Đăng nhập**.
3. Mật khẩu do bên kỹ thuật cung cấp khi bàn giao. Đổi mật khẩu xem mục 7.

> Mẹo: Lưu link admin vào màn hình chính điện thoại để mở nhanh như một app.

---

## 2. Xem danh sách đặt bàn

Sau khi đăng nhập, trang **Đặt bàn** hiện ngay. Phía trên có 4 ô thống kê:

- **Tổng đặt bàn** — tất cả yêu cầu đã nhận.
- **Hôm nay** — số bàn đặt cho ngày hôm nay.
- **Chờ xác nhận** — khách mới đặt, bạn chưa gọi lại.
- **Đã xác nhận** — bạn đã gọi và chốt.

Mỗi dòng là một khách: tên, điện thoại, ngày giờ, số người, dịp, ghi chú, trạng thái.

---

## 3. Tìm và lọc

- **Ô tìm kiếm:** gõ tên, số điện thoại, hoặc ngày (vd `25/06/2026`).
- **Lọc trạng thái:** chọn Chờ xác nhận / Đã xác nhận / Hoàn thành / Đã huỷ / Không đến.
- **Lọc dịp:** Date Night, Anniversary, Birthday, Proposal, Private Event...

---

## 4. Xem chi tiết & đổi trạng thái

Bấm vào một dòng để mở chi tiết. Tại đây bạn có thể đổi trạng thái:

| Nút | Khi nào dùng |
|-----|--------------|
| ✓ **Xác nhận** | Đã gọi khách và chốt bàn |
| ⏳ **Chờ** | Quay lại trạng thái chờ |
| ★ **Hoàn thành** | Khách đã đến và dùng bữa xong |
| ✗ **Không đến** | Khách đặt nhưng không tới (no-show) |
| **Huỷ đặt bàn** | Khách huỷ |
| 🗑 **Xóa** | Xóa hẳn (đặt trùng, spam, đặt thử) |

Đổi trạng thái xong sẽ tự lưu lên Google Sheets ngay.

**Quy trình gợi ý:** Khách đặt → *Chờ xác nhận* → gọi điện chốt → *Đã xác nhận*
→ khách đến ăn xong → *Hoàn thành*. Nếu khách không tới → *Không đến*.

---

## 5. Thêm đặt bàn thủ công (khách gọi điện / Zalo)

Khi khách đặt qua điện thoại hoặc Zalo:

1. Vào **Cài đặt** (menu trái) → **+ Thêm thủ công**.
2. Điền tên, SĐT, ngày, giờ, số khách, dịp, ghi chú.
3. Bấm **Thêm đặt bàn**. Đơn này được đánh dấu "Thêm thủ công".

---

## 6. Xuất file Excel/CSV

Bấm **⬇ Xuất CSV** ở góc phải. File `.csv` tải về mở được bằng Excel / Google Sheets —
dùng để in danh sách bàn trong ngày, lưu trữ, hoặc gửi cho nhân viên.

Trang **Khách hàng** cũng có nút xuất riêng (danh sách khách + số lần đặt).

---

## 7. Đổi mật khẩu admin

Mật khẩu được lưu **trên máy chủ Google** (an toàn, không nằm trong website).
Để đổi:

1. Mở Google Sheet đặt bàn → menu **Tiện ích mở rộng → Apps Script**.
2. Tìm hàm `setAdminPassword()`, sửa mật khẩu mới trong dấu nháy.
3. Chọn hàm `setAdminPassword` → bấm **Run (▶)**.
4. Xóa lại mật khẩu vừa gõ trong code (để không lưu lại) → **Lưu**.

> Chi tiết có ảnh minh họa trong **SETUP.md** (Bước 3).

---

## 8. Lưu ý quan trọng

- **Dữ liệu thật nằm ở Google Sheets.** Trang admin chỉ là cửa sổ xem/sửa.
  Bạn cũng có thể mở thẳng Google Sheet để xem.
- **Đừng chia sẻ link admin + mật khẩu** cho người ngoài.
- Nếu quên mật khẩu: làm lại mục 7 để đặt mật khẩu mới.
- Nếu trang admin báo "Không kết nối được máy chủ": kiểm tra mạng, hoặc liên hệ
  bên kỹ thuật (có thể URL backend trong `config.js` bị sai/đổi).
</content>
