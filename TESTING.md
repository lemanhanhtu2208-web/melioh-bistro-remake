# Testing — MeliOh Bistro Website

Tổng hợp các test case đã kiểm tra trước khi bàn giao. Các flow được kiểm bằng
**Chromium thật** (Playwright) chạy trên bản web local, cộng với unit test cho
phần validate.

> Cập nhật gần nhất: 2026-06-25 · Kết quả: **29/29 passed** · 0 lỗi console JS.

---

## 1. Cách tự chạy lại test

```bash
# 1) Chạy web local
python3 -m http.server 8123

# 2) Mở http://localhost:8123/index.html và admin.html để test tay
```

Các kịch bản tự động (Playwright) dùng để kiểm hồi quy; xem mục 2–4 cho từng case.

---

## 2. Form đặt bàn (index.html)

| # | Test case | Kết quả mong đợi | Trạng thái |
|---|-----------|------------------|:---------:|
| 1 | Submit khi để trống | Báo lỗi "complete the highlighted fields", tô đỏ ô thiếu | ✅ |
| 2 | Số điện thoại sai (`123`) | Báo "valid Vietnamese phone number" | ✅ |
| 3 | SĐT hợp lệ `0918204008` / `+8491...` | Qua bước kiểm SĐT | ✅ |
| 4 | Chọn ngày quá khứ | Bị chặn (input `min` = hôm nay, `rangeUnderflow`) | ✅ |
| 5 | Chọn giờ đã qua trong hôm nay | Báo "at least 30 minutes ahead" | ✅ |
| 6 | Số khách ngoài 1–40 | Báo lỗi range | ✅ |
| 7 | **Demo mode** + dữ liệu hợp lệ | **KHÔNG** báo "đã nhận"; mời gọi điện; style lỗi; giữ dữ liệu khách | ✅ |
| 8 | **Live mode** + dữ liệu hợp lệ | Báo "we have received…", chào theo tên, style OK, reset form | ✅ |
| 9 | Live mode backend lỗi/mạng | Báo lỗi thân thiện, **không** reset form (không mất dữ liệu) | ✅ |
| 10 | Timezone | Dùng giờ Việt Nam (`Asia/Ho_Chi_Minh`) để tính "hôm nay" | ✅ |

**Unit test validate** (`vnTodayStr`, `isValidVNPhone`, `dateTimeError`): 13/13 pass —
gồm các SĐT hợp lệ/không hợp lệ và ngày quá khứ/tương lai/hôm nay.

---

## 3. Trang admin (admin.html)

| # | Test case | Kết quả mong đợi | Trạng thái |
|---|-----------|------------------|:---------:|
| 1 | Đăng nhập sai mật khẩu | Báo "Mật khẩu không đúng" | ✅ |
| 2 | Đăng nhập đúng (demo) | Vào được dashboard | ✅ |
| 3 | Đăng nhập đúng (live, server kiểm tra) | Vào được, tải booking từ backend | ✅ |
| 4 | Đăng nhập sai (live) | Server từ chối, báo lỗi | ✅ |
| 5 | Xem danh sách booking | Hiện đủ các dòng + 4 ô thống kê | ✅ |
| 6 | Đọc dữ liệu từ Google Sheets (live) | Hiện đơn từ backend + đơn mới từ web | ✅ |
| 7 | Đổi trạng thái → Hoàn thành | Badge đổi "Hoàn thành", lưu ngay | ✅ |
| 8 | Đổi trạng thái (live) | POST lên backend, còn sau khi refresh | ✅ |
| 9 | Lọc theo trạng thái | Chỉ hiện đúng nhóm | ✅ |
| 10 | Tìm theo tên | Thu hẹp kết quả đúng | ✅ |
| 11 | Tìm theo ngày (`/2026`) | Hiện đúng đơn theo ngày | ✅ |
| 12 | Thêm booking thủ công | Danh sách tăng thêm 1 | ✅ |
| 13 | Export CSV | Tải file `.csv` (kiểm tra tay) | ✅ |
| 14 | Responsive mobile (390px) | Hiện nút ☰, bấm mở được sidebar | ✅ |

---

## 4. Backend (apps-script/Code.gs)

| # | Test case | Kết quả mong đợi | Trạng thái |
|---|-----------|------------------|:---------:|
| 1 | `doGet ?action=list` đúng mật khẩu | Trả JSON danh sách | ✅ (mock) |
| 2 | `doGet ?action=list` sai mật khẩu | `{ok:false, unauthorized}` | ✅ (mock) |
| 3 | `doPost action=add` | Thêm dòng, không cần mật khẩu (khách đặt) | ✅ (mock) |
| 4 | `doPost action=update/delete` | Cần mật khẩu hợp lệ | ✅ (mock) |
| 5 | Status không hợp lệ | Bị từ chối (whitelist) | ✅ (code) |
| 6 | Giới hạn độ dài field | Cắt bớt (`cap`) chống bloat | ✅ (code) |

> Mục 4 test bằng **mock backend** mô phỏng đúng hành vi CORS của Apps Script
> (header `Access-Control-Allow-Origin`, POST `text/plain` không preflight).
> Sau khi khách deploy thật theo SETUP.md, nên chạy lại mục B6–B7 trong CLIENT_HANDOFF.md.

---

## 5. Kiểm tra khác

- ✅ `node --check` pass cho `main.js`, `config.js`, `admin.html` (inline), `Code.gs`.
- ✅ Không có `console.*` lộ dữ liệu nhạy cảm trong frontend.
- ✅ Không còn ảnh external (Unsplash), không còn `your-form-id`, không link chết.
- ✅ Tất cả ảnh `<img>` đều trỏ tới file có thật trong repo.
- ✅ Ảnh dưới màn hình đầu dùng `loading="lazy"`.
- ✅ 0 lỗi console JavaScript trong toàn bộ các flow đã chạy.

---

## 6. Việc cần test SAU khi khách deploy backend thật

Mock backend không thay được Google thật. Sau khi làm xong SETUP.md, kiểm:

1. Đặt thử 1 bàn trên web → mở Google Sheet xem có dòng mới.
2. Đăng nhập admin bằng mật khẩu thật → thấy đơn đó.
3. Đổi trạng thái trong admin → Google Sheet cập nhật theo.
4. Thử trên điện thoại (cả khách đặt và admin).
</content>
