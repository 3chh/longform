# Longform

Trang web tuyển tập các bài longform chuyên sâu. Trang chủ liệt kê các bài phỏng vấn, tin tức và eMagazine theo phong cách editorial.

## Cấu trúc

```
longform/                 Trang chủ (hub) — sẽ hiển thị tại /longform
  index.html              Trang chủ
  articles/
    hoc-cung-ai-lon-len-tu-trai-nghiem.html
    bi-thu-xu-muong-va-xung-luc-so.html
    tra-sang-va-co-phuc.html
    dua-ban-lang-len-khong-gian-so-dua-sinh-ke-ve-que-huong-van-son.html
  tin/
    gan-62-ty-dong-sau-3-ngay-ghi-hinh-mai-am-gia-dinh-viet.html
    khai-mac-trung-bay-but-thep-long-son.html
  assets/
    css/  home.css · story.css · article.css
    img/  ảnh bìa + ảnh từng bài
vercel.json               Redirect / → /longform/
```

## Chạy thử

Mở trực tiếp `longform/index.html` bằng trình duyệt, hoặc chạy một static server:

```bash
python -m http.server 8000   # rồi mở http://localhost:8000/longform/
```

## Triển khai Vercel

Khi deploy lên Vercel, trang chủ sẽ có dạng:

```
https://vudieuso.vercel.app/longform/
```

Và `https://vudieuso.vercel.app/` sẽ tự động chuyển hướng về `/longform/`.
