# MeliOh Bistro Da Nang — Website

Website chính thức cho **MeliOh Bistro Da Nang** — nhà hàng fine dining lãng mạn
bên bờ sông Hàn. *The nest of love by Han River.*

- 🌐 **Website:** https://lemanhanhtu2208-web.github.io/melioh-bistro-remake/
- 🔐 **Trang quản lý (admin):** https://lemanhanhtu2208-web.github.io/melioh-bistro-remake/admin.html

---

## Tính năng

- Trang giới thiệu nhà hàng (story, trải nghiệm, proposal, menu, gallery, liên hệ, bản đồ).
- **Hệ thống đặt bàn online** lưu vào **Google Sheets** qua Google Apps Script.
- **Trang admin** quản lý đặt bàn: xem / lọc / tìm / đổi trạng thái / xóa / export CSV / thêm thủ công.
- Đăng nhập admin có mật khẩu, **kiểm tra phía server** (không lưu mật khẩu trong code).
- Responsive cho điện thoại / tablet / máy tính.

## Công nghệ

HTML + CSS + JavaScript thuần, **không cần build**. Backend là Google Apps Script
(miễn phí). Hosting trên GitHub Pages.

Chạy thử ở máy:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Cấu trúc thư mục

| File | Vai trò |
|------|---------|
| `index.html` | Trang chủ + form đặt bàn |
| `admin.html` | Trang quản lý đặt bàn |
| `main.js` | Logic form đặt bàn (validate, gửi backend) |
| `config.js` | **Cấu hình** — dán URL backend vào đây |
| `styles.css` | Toàn bộ giao diện trang chủ |
| `apps-script/Code.gs` | Code backend dán vào Google Apps Script |
| `assets/` | Ảnh nhà hàng |

## Hai chế độ hoạt động

1. **Demo mode** (mặc định, khi `config.js` chưa có URL): form đặt bàn **không**
   gửi đi đâu cả — sẽ hiện thông báo mời khách gọi điện. Dùng để xem thử giao diện.
2. **Live mode** (sau khi cấu hình theo `SETUP.md`): đặt bàn lưu vào Google Sheets,
   admin xem được từ mọi thiết bị.

## Tài liệu

- 📦 **[SETUP.md](SETUP.md)** — Cách deploy backend Google Apps Script + Google Sheets.
- 👤 **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** — Hướng dẫn chủ nhà hàng dùng trang admin.
- 🤝 **[CLIENT_HANDOFF.md](CLIENT_HANDOFF.md)** — Checklist bàn giao.
- ✅ **[TESTING.md](TESTING.md)** — Các test case đã kiểm tra.

## Thông tin nhà hàng

- **Địa chỉ:** Lot A1-04 The Villas of Green Islands, Hoa Cuong Bac, Hai Chau, Da Nang
- **Điện thoại:** +84 0918 204 008
- **Email:** melioh.bistrodn@gmail.com
- **Facebook:** https://www.facebook.com/melioh.bistrodn
- **Instagram:** https://www.instagram.com/melioh.bistrodn/
- **Giờ mở cửa:** Hằng ngày · 16:00 – 23:00
</content>
