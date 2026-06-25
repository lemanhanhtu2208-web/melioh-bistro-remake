# Checklist Bàn Giao — MeliOh Bistro Website

Tài liệu này dành cho buổi bàn giao website cho nhà hàng. Đi theo từng mục.

---

## A. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|----------|-----------|
| Giao diện website | ✅ Hoàn tất |
| Form đặt bàn + validate | ✅ Hoàn tất |
| Trang admin (xem/lọc/đổi trạng thái/CSV/thêm thủ công) | ✅ Hoàn tất |
| Code backend Google Apps Script | ✅ Đã viết sẵn (`apps-script/Code.gs`) |
| **Deploy backend + dán URL vào `config.js`** | ⛔ **Khách/kỹ thuật cần làm** (xem mục B) |
| Mật khẩu admin | ⛔ Khách tự đặt khi deploy |

> ⚠️ **Quan trọng:** Khi `config.js` chưa có URL backend, website chạy **demo mode** —
> form đặt bàn KHÔNG gửi cho ai, chỉ mời khách gọi điện. Phải hoàn tất mục B thì
> đặt bàn online mới hoạt động thật.

---

## B. Việc BẮT BUỘC phải làm để chạy thật

Làm theo **[SETUP.md](SETUP.md)** (có hướng dẫn từng bước kèm ảnh):

- [ ] **B1.** Tạo Google Sheet trên tài khoản Google của nhà hàng.
- [ ] **B2.** Dán code `apps-script/Code.gs` vào Apps Script.
- [ ] **B3.** Đặt mật khẩu admin bằng `setAdminPassword()` (mật khẩu mạnh).
- [ ] **B4.** Deploy thành Web App (quyền **Anyone**), copy URL `…/exec`.
- [ ] **B5.** Dán URL vào `config.js` → commit & push.
- [ ] **B6.** Test: đặt thử 1 bàn trên web → kiểm tra Google Sheet có dòng mới.
- [ ] **B7.** Đăng nhập admin bằng mật khẩu ở B3 → thấy đơn vừa đặt.

---

## C. Thông tin / tài khoản khách cần TỰ LƯU GIỮ

Hãy lưu ở nơi an toàn (không chia sẻ ra ngoài):

- [ ] **Tài khoản Google** chứa Google Sheet đặt bàn (email + mật khẩu).
- [ ] **Link Google Sheet** đặt bàn.
- [ ] **URL Web App** (`…/exec`) — đã dán trong `config.js`.
- [ ] **Mật khẩu admin** (đặt ở bước B3).
- [ ] **Tài khoản GitHub** chứa source website (để cập nhật nội dung sau này).
- [ ] **Link admin:** `…/admin.html`

---

## D. Thông tin nội dung cần khách xác nhận

Kiểm tra các thông tin sau trên website có đúng không, báo nếu cần sửa:

- [ ] Địa chỉ: *Lot A1-04 The Villas of Green Islands, Hoa Cuong Bac, Hai Chau, Da Nang*
- [ ] Điện thoại: *+84 0918 204 008*
- [ ] Email: *melioh.bistrodn@gmail.com*
- [ ] Giờ mở cửa: *Hằng ngày 16:00 – 23:00*
- [ ] Facebook / Instagram links
- [ ] Giá menu (Combo 1: 799K · Combo 2: 899K · Combo 3: 1.200K)
- [ ] Vị trí ghim trên Google Maps (hiện đang dò theo khu vực, nên ghim chính xác)

---

## E. Giới hạn cần biết (quan trọng về bảo mật)

Website dùng **GitHub Pages + Google Apps Script** (giải pháp miễn phí). Cần hiểu:

1. **Mã nguồn website là công khai** (HTML/CSS/JS ai cũng xem được). Vì vậy **không**
   để mật khẩu hay khóa bí mật trong code. Hệ thống đã thiết kế đúng: mật khẩu admin
   nằm trên máy chủ Google, không trong website.
2. **Trang admin bảo vệ bằng 1 mật khẩu**, hợp với nhà hàng nhỏ. Đây không phải hệ
   thống bảo mật cấp ngân hàng — đừng lưu dữ liệu cực kỳ nhạy cảm. Dữ liệu khách chỉ
   gồm: tên, SĐT, ngày giờ đặt, ghi chú.
3. **Ai có URL Web App có thể gửi đơn đặt bàn** (giống ai có số điện thoại đều gọi
   được). Việc xem/sửa/xóa danh sách thì cần mật khẩu admin.
4. **Apps Script miễn phí có giới hạn** dung lượng/lượt gọi mỗi ngày — thừa sức cho
   một nhà hàng, nhưng không dành cho lượng truy cập cực lớn.
5. Nên **đổi mật khẩu admin định kỳ** và sau khi nhân viên nghỉ việc.

---

## F. Bảo trì sau bàn giao

- **Sửa nội dung/ảnh:** chỉnh file tương ứng trong repo GitHub rồi push; GitHub Pages
  tự cập nhật sau 1–2 phút.
- **Xem đặt bàn:** mở trang admin, hoặc mở thẳng Google Sheet.
- **Sao lưu:** Google Sheet tự lưu trên Google Drive. Có thể tải bản `.csv` định kỳ
  từ admin để lưu thêm.
</content>
