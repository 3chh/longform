# Longform

Trang web tuyển tập các bài longform chuyên sâu. Trang chủ (kiểu tienphong.vn/longform) liệt kê 4 bài; mỗi bài là một trang đọc dài theo phong cách editorial (tham khảo ELLE).

## Cấu trúc

```
index.html              Trang chủ (hub)
articles/
  bai-1.html            Bài 1 — "Học cùng AI, lớn lên từ trải nghiệm" (hoàn thành)
  bai-2.html … bai-4.html   Template, chờ nội dung
assets/
  css/  home.css · story.css · article.css
  img/  ảnh bìa + ảnh từng bài
```

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server:

```bash
python -m http.server 8000   # rồi mở http://localhost:8000
```
