# Audit chi tiết & đề xuất refactor — 6 bài longform

> Phương pháp: đối chiếu **ảnh chụp màn hình** (desktop 1920px + mobile 390px, cắt lát zoom 200–300%) với **mã nguồn CSS/HTML** thực tế. Mỗi lỗi ghi rõ vị trí (file:dòng + section), hiện trạng, vấn đề, đề xuất sửa.
>
> Bản đồ file (lưu ý `bai-3.css`/`bai-4.css` bị đánh số chéo):
> | # | Bài | HTML | CSS |
> |---|-----|------|-----|
> | 01 | Học cùng AI | `articles/hoc-cung-ai…` | `story.css` |
> | 02 | Bí thư xứ Mường | `articles/bi-thu-xu-muong…` | `story.css` + `bai-2.css` |
> | 03 | Đưa bản làng (xanh) | `articles/dua-ban-lang…` | `article.css` + **`bai-4.css`** |
> | 04 | Trà sáng & cổ phục (bè) | `articles/tra-sang-va-co-phuc` | `article.css` + **`bai-3.css`** |
> | 05 | Gần 6,2 tỷ (mái ấm) | `tin/gan-62-ty…` | `story.css` + `tin-1.css` |
> | 06 | Bút thép, lòng son | `tin/khai-mac-trung-bay…` | `story.css` + `tin-2.css` |

**Tổng đánh giá:** chất lượng base rất cao — chính tả sạch, hệ thống thiết kế phong phú, kiểm soát ngắt dòng/crop có chủ đích (`<span class="line">`, `.nowrap`, `object-position`). Vấn đề còn lại gom vào **4 nhóm gốc** (xem Phần A) lan ra nhiều bài; phần còn lại là tinh chỉnh.

---

## PHẦN A — 4 vấn đề HỆ THỐNG (sửa 1 lần, lợi cho cả 6 bài)

### A1. `text-align: justify` dùng tràn lan → "sông trắng" trong tiếng Việt
Tiếng Việt **không ngắt từ (no hyphenation)** + nhiều dấu phụ, nên justify dễ tạo khoảng cách từ giãn không đều, nhất là cột hẹp và chữ lớn.

Đang justify tại: `story.css:146` (.prose), `bai-2.css:262,545`, `bai-4.css:235`, `bai-3.css:339,420,702`, `tin-1.css:204,219`, `tin-2.css:246,339`, và đặc biệt **`tin-2.css:489` `.press-quote p`** (quote serif italic `clamp(28→62px)` mà vẫn justify — rủi ro cao nhất).

**Đề xuất:**
- Bỏ justify cho **mọi text lớn/quote** (pullquote, press-quote, lead) → `text-align: left` (hoặc `center` nếu đang center).
- Body cột ≥680px có thể giữ justify nhưng thêm chốt an toàn: `word-spacing: -0.01em; hanging-punctuation: allow-end;` và cân nhắc `text-align: left` cho mobile (`max-width:560px`) để tránh giãn chữ trên màn hẹp.

### A2. Caption/label co xuống 8–10px trên mobile/tablet → "chìm", khó đọc
Trong dải `@media (max-width:860–900px)` nhiều caption tụt dưới ngưỡng đọc thoải mái (~12px):

| File:dòng | Phần tử | Hiện tại | Đề xuất |
|---|---|---|---|
| `bai-3.css:816` | `.museum-spread figcaption` | **9px** | ≥12px |
| `bai-3.css:848` | `.youth-feature figcaption` | **10px** | ≥13px |
| `bai-3.css:871` | `.research-panel p` (body!) | **10px** | ≥15px |
| `bai-3.css:861` | `.research-panel span` | **8px** | ≥11px |
| `tin-1.css:458` | `.poster-copy span` | **8px** | ≥11px |
| `tin-1.css:480` | `.support-poster .pn-row span` | **8px** | ≥11px |
| `tin-2.css:611` | `.press-cover/.press-final figcaption` | **10px** | ≥12px |
| `tin-2.css:616` | `.archive-spread figcaption` | **10px** | ≥12px |
| `bai-2.css:761,782` | `.media/.media-2 figcaption` | **10px** | ≥12px |

> Lưu ý: các cụm dùng **artboard.js** (xem A3) được scale cả cụm nên 8–10px hiển thị to lên theo tỉ lệ — chấp nhận được. Nhưng `.research-panel`, `.youth-feature`, `.press-cover/.press-final/.archive-spread`, `.muong media` **KHÔNG** nằm trong khối khoá artboard → reflow thật và render đúng 9–10px. Đây là chỗ cần nâng size thật.

### A3. Hai cơ chế mobile khác nhau → bài 2 & 6 bị ép ảnh ngang quá nhỏ
- Bài 3, 4, 5 dùng kỹ thuật **"khoá bố cục desktop ở bề rộng cố định + scale cả cụm bằng JS"** (`bai-4.css:748`, `bai-3.css:878`, `tin-1.css:507`). → cụm stat/poster giữ nguyên tỉ lệ đẹp trên phone.
- Bài 2 (`bai-2.css`) và bài 6 (`tin-2.css`) **reflow tự nhiên**: cụm ảnh đôi co thành 2 cột tí hon (`tin-2.css:583` `.press-cover` → `minmax(112px,.36fr)`; `bai-2.css:756` `.media` → `minmax(112px,.36fr)`). Ảnh tư liệu (báo cũ, poster, ảnh chụp Facebook) **nhỏ đến mức không đọc nổi chữ trong ảnh** (xác nhận trên screenshot M02, M06).

**Đề xuất:** với 2 bài này, trên `≤640px` **xếp dọc** cụm ảnh thay vì 2 cột, hoặc thêm **lightbox/tap-to-zoom** cho ảnh dày chữ (giải quyết luôn nhóm "ảnh tư liệu nhỏ" ở mọi bài).

### A4. Lạm dụng UPPERCASE khối lớn (riêng bài 3)
Bài 3 (`bai-4.css`) dùng Barlow Condensed IN HOA cho gần như mọi heading lớn: `.cover-title h1`, `.poster-caption h2` (`clamp(48→128px`, `:341`), `.profile-text h2` (`clamp(58→126px`, `:402`), `.video-heading h2`, `.craft-poster span`, `.emag-toc`. Cả trang là một chuỗi chữ HOA khổng lồ → giảm nhịp, mỏi mắt, khó phân biệt cấp độ.

**Đề xuất:** giữ HOA cho 2–3 mốc mạnh nhất (cover + 1–2 poster); chuyển vài subhead sang **sentence case** (chữ thường có dấu) để tạo tương phản nhịp và tăng tốc độ đọc.

---

## PHẦN B — Theo 6 nhóm tiêu chí

### 1. Typography / hierarchy

**1.1 — Bài 02 hero: 3 màu chữ tranh nhau trong 1 tiêu đề.**
`bai-2.css:99–159`. `h1` ghép: `t-top` "BÍ THƯ" (trắng, Archivo HOA) + `t-and` "và" (nhạt thường) + `t-script` "xứ Mường" (**amber** Dancing Script `1.34em`) + `t-sub` "XUNG LỰC SỐ" (**xanh** accent). Cộng kicker + rubric + dek → quá nhiều điểm nhấn.
*Vấn đề:* amber + xanh + trắng cùng tranh "nốt nhấn", mắt không biết đâu là chính.
*Đề xuất:* giữ **một** điểm màu (script "xứ Mường" amber) làm pop; đổi "XUNG LỰC SỐ" về **trắng** như `t-top` (bỏ `color:var(--accent)` ở `:158`). Hierarchy: HOA trắng (chính) → script amber (nhấn) → còn lại trung tính.

**1.2 — Bài 04 spread-title: 4 kiểu chữ trong 1 `h2`.**
`bai-3.css:503–544`: "khi" (sans HOA nhỏ) / "Trang phục" (script silk `clamp64→94`) / "trở thành" (sans thường) / "TƯ LIỆU SỐNG" (Cormorant HOA). 4 font/style xếp dọc.
*Vấn đề:* đẹp kiểu poster nhưng ranh giới "1 tiêu đề" mờ, dễ đọc thành 4 mảnh.
*Đề xuất:* chấp nhận như "poster title" nhưng siết khoảng cách dọc giữa 4 dòng (giảm `margin-bottom` ở `:523,533`) để cụm dính lại thành 1 khối; hoặc bỏ 1 trong 2 dòng sans phụ.

**1.3 — Bài 04 mobile: body `.research-panel p = 10px` (`bai-3.css:871`).** Chữ thân bài 10px là quá nhỏ → nâng ≥15px (xem A2). Tương tự `.youth-feature figcaption 10px`.

**1.4 — Line-height: ĐẠT.** Body 1.78–1.86 (`story.css:35`=1.82; `bai-4.css:235`=1.86; `tin-1.css:219`=1.86) — thoáng, không chật. Drop-cap lead (`story.css:154`) đẹp. Không có lỗi đè dòng.

**1.5 — Label tracking rộng + nhỏ:** nhiều eyebrow/rubric 11–13px HOA `letter-spacing .18–.24em` (`bai-3.css:206`, `tin-2.css:423` `.chapter-copy span .24em`). Ở 11px, tracking .24em làm chữ rời rạc.
*Đề xuất:* khi `font-size ≤12px` giảm tracking về `.12–.14em`.

---

### 2. Xuống dòng / ngắt dòng

**2.1 — Số liệu giữ đơn vị: ĐẠT.** `.nowrap` bao "6,2 tỷ đồng", "1946–1954", "10–15 video/tháng", "Báo&nbsp;Cứu&nbsp;Quốc" (`tin-2.css` HTML). Tốt.

**2.2 — Hero dek chống "chữ mồ côi": ĐẠT.** `bai-2.css:789` và `tin-2.css:635` cho `.dek .line` về `inline` ở ≤560px để câu chảy mềm thay vì gãy cứng. Đây là chuẩn tốt — **nên áp dụng thêm** cho lead/sub các bài khác.

**2.3 — Bài 03 profile "Người trở về **mở lối**".**
`bai-4.css` `.profile-text > span` (HTML dòng 91) — cụm "mở lối" rớt xuống dòng riêng ("MỞ / LỐI"). Không sai nghĩa nhưng lẻ.
*Đề xuất:* bọc `<span class="nowrap">mở lối</span>` hoặc thêm `<br>` chủ động sau "về" để ngắt theo cụm nghĩa "Người trở về / mở lối".

**2.4 — Justify tạo dòng cuối giãn:** hệ quả của A1, gặp ở các đoạn body có dòng cuối ít chữ. Sửa theo A1.

---

### 3. Thiết kế / bố cục / nhịp longform

**3.1 — Bài 01 "mỏng chất longform" nhất bộ.**
`story.css` chỉ có section center + `.media-2/3` grid + 1 `.insight-card`. So với 5 bài kia (toc poster, chapter divider, stat board, full-bleed quote), bài 1 gần một bài báo thường. Điểm nhấn thị giác duy nhất lại là **ảnh collage game AI** (xem 6.1) — mảng yếu nhất.
*Tác động:* mở bài mạnh nhưng giữa bài thiếu "khoảnh khắc" để mắt nghỉ/wow.
*Cải tiến vừa đủ:* thêm **1 dải số liệu** hoặc **1 full-bleed pullquote** (tái dùng mẫu `.pullquote` đã có) ở khoảng giữa; thay collage AI bằng ảnh thật.

**3.2 — Bài 03 lặp công thức poster.**
`.poster-caption` (ảnh full-bleed + kicker vàng + h2 HOA khổng lồ + sub italic) lặp ở section 04, "Giữ chân du khách…", "Khi cả bản làng…" — 3 lần gần như y hệt (`bai-4.css:286–365`).
*Tác động:* "mỏi" công thức, các section khó phân biệt.
*Cải tiến:* biến tấu 1 trong 3 bằng device khác (stat poster / quote poster đã có sẵn class), hoặc đổi vị trí chữ (trái→phải) cho 1 cái.

**3.3 — Bài 03 box "Nghề truyền thống" lặp chữ.**
`bai-4.css:519 .craft-poster` + HTML:156–157: nhãn `<span>Nghề truyền thống</span>` ở đầu, rồi câu kết cũng "…làm **nghề truyền thống**" (`.nowrap`). Cụm xuất hiện 2 lần trong 1 khung.
*Đề xuất:* đổi nhãn đầu thành cụm khác ("Trải nghiệm" / "Bàn tay nghệ nhân") để không trùng từ kết.

**3.4 — Nhịp & khoảng thở: ĐẠT.** Margin section dùng `clamp(...10vw...)` rộng rãi (`bai-3.css:466`, `tin-2.css:347`…). Không có section trống kiểu placeholder (class `.placeholder` ở `article.css:173` không dùng trong bản cuối).

**3.5 — Card/stat/timeline đồng bộ trong từng bài: ĐẠT,** nhưng **khác nhau giữa các bài** (mỗi bài 1 ngôn ngữ) — đây là chủ ý eMagazine, giữ.

---

### 4. Màu sắc / contrast / chữ nuốt nền

**4.1 — ⚠️ LỖI NẶNG NHẤT: Bài 03 hero script "đưa sinh kế về quê hương Vân Sơn" chìm vào nền.**
`bai-4.css:196 .cover-script` `color: var(--emag-blue-deep)` = **#0066b9** đặt trên vùng ảnh chợ phiên ám xanh (overlay `::before` `bai-4.css:82` đã mỏng dần còn ~.34 ở 64%).
*Đo thực tế trên ảnh chụp:* dải chữ này có mean‑luminance **143 / stddev 37** (chữ và nền cùng vùng sáng xanh → tách biệt yếu) so với tiêu đề bài 06 (mean 54 / stddev 39, trắng trên nền tối). → xác nhận contrast thấp, mobile gần như không đọc.
*Đề xuất (chọn 1–2):*
- Tăng độ phủ overlay vùng giữa: ở `::before` (`:82`) nâng stop `.34` → ~`.6` để nền sau chữ đậm hơn.
- Tăng quầng trắng của chữ: `:204 text-shadow` thêm lớp `0 0 2px #fff` đậm + halo rộng hơn.
- Hoặc đổi chữ sang **trắng** (#fff) — vì nền sau nó là xanh trung-đậm, trắng sẽ nổi chắc.

**4.2 — Bài 03 bão hoà xanh toàn trang.** Navbar (`bai-4.css:29` rgba blue .92), footer (`:617`), toc (`:265` blue), nhiều poster blue/yellow. Mắt không có điểm nghỉ trung tính.
*Đề xuất:* chèn 1–2 block nền sáng (paper) giữa chuỗi poster; giảm `saturate` ảnh nền poster ~5–10%.

**4.3 — Sub nhỏ trên ảnh rối (borderline).** `bai-4.css:358 .poster-caption p` `rgba(255,255,255,.86)` italic trên ảnh — nhờ gradient đáy `.72` (`:311`) nên đọc được, nhưng sát ngưỡng. Tương tự `tin-1.css` poster-copy. *Đề xuất:* nâng lên `.92` hoặc thêm `text-shadow: 0 1px 6px rgba(0,0,0,.5)`.

**4.4 — Pullquote (trắng trên accent): ĐẠT mạnh.** `bai-2.css:640` (trên --ink), `tin-1.css:407` (trên đỏ), `tin-2.css:479` (trên đỏ), `bai-4.css:508` (trên xanh) — contrast cao, đẹp.

**4.5 — Hero scripts khác: ĐẠT.** Bài 04 "cổ phục" silk #ead5b5 trên nền tối (`bai-3.css:245`), bài 02 "xứ Mường" amber trên nền tối — đều nổi tốt. Chỉ bài 03 (script trên nền **sáng**) là hỏng.

---

### 5. Poster / cover — đánh giá từng bìa

**Bài 01 — ★★★★ (giữ gần nguyên).** Chân dung tư liệu, ánh mắt nhân vật hướng vào trong, title serif góc dưới-trái, gradient `story.css:100` đủ tối ở đáy. *Sửa:* không cần; nếu muốn mạnh hơn, đẩy title xuống sát đáy hơn 8–12px. Title 2 dòng cân.

**Bài 02 — ★★★ (sửa màu title + cân nhắc ảnh).** Bố cục split (chữ trái / chân dung khung phải) rất "magazine". *Giữ:* layout, khung kính mờ. *Sửa:* (a) 3-màu title → 2 màu (mục 1.1); (b) ảnh chân dung hiện là **ảnh chụp lại một tấm bìa in** (có chữ "PHÚ THỌ", "Trưng bày") → cảm giác "ảnh của ảnh"; nếu có, thay bằng chân dung chụp thẳng. Ngắt title giữ nguyên (đang tốt).

**Bài 03 — ★★ (cần can thiệp).** Concept bìa tạp chí tài chính (badge tròn, đường blueprint, title HOA + script) có ý tưởng, nhưng: (a) **script chìm** (4.1); (b) ảnh nền là cảnh chợ **quá rộng, không có chủ thể** → không "kể chuyện" ai. *Sửa:* fix contrast script; cân nhắc crop ảnh vào một nhóm/nhân vật cụ thể của chợ để có tiêu điểm; giảm 1 lớp chữ nếu thấy rối.

**Bài 04 — ★★★★★ (bìa mạnh nhất, giữ).** Ảnh 2 nhân vật điện ảnh, overlay trái-đậm (`bai-3.css:186`) đọc tốt, serif "Trà sáng" + script "cổ phục" silk thanh lịch. *Sửa nhẹ (tuỳ chọn):* có thể tăng `hero-line-tra` thêm chút và hạ cả cụm xuống thấp hơn để "ôm" mặt nhân vật.

**Bài 05 — ★★★★ (giữ).** Ảnh nhóm đông + số "6,2 tỷ" vàng là ngôi sao (`tin-1.css:101`), dải stat đè -62px (`:149`) tạo lớp. Title 3 tầng nhưng rõ trọng tâm (con số). *Sửa:* ảnh nền hơi rối (đám đông) — có thể tối thêm `brightness` (đang .76) xuống .70 để số vàng bật hơn.

**Bài 06 — ★★★ (cân nhắc full-bleed).** `tin-2.css:31` hero dùng `object-fit: contain` → banner "BÚT THÉP LÒNG SON" hiện trọn nhưng **letterbox** (viền nền tối 2 bên) → cảm giác "ảnh dán trong hộp" hơn là bìa ngập tràn. Title serif mạnh. *Sửa:* cân nhắc một ảnh tư liệu **full-bleed** (`cover`) làm nền, đặt banner thành lớp phụ; hoặc giữ contain nhưng thêm texture/grain lấp 2 dải tối cho có chủ đích.

---

### 6. Hình ảnh / crop / caption

**6.1 — ⚠️ Bài 01 ảnh collage "GAME ON" lạc mood.**
Ảnh ghép 3D (lính + điện thoại + mê cung) rõ chất **AI/illustration** giữa loạt ảnh phóng sự thật. CSS đã cố cứu bằng `story.css:125 .calm-illustration { filter: saturate(.58) }` nhưng vẫn lệch tông & lệch độ tin cậy.
*Đề xuất:* thay bằng ảnh thật (trẻ dùng thiết bị/hoạt động công nghệ); nếu buộc giữ, đóng khung + nhãn "Đồ hoạ minh hoạ" để phân biệt với ảnh tư liệu.

**6.2 — Kiểm soát crop: phần lớn ĐẠT (đáng khen).**
- Chân dung giữ đầu: `bai-2.css:188`, `bai-4.css:392`, `tin-1.css:309` đều `object-position: center top`.
- `tin-2.css:455 .archive-spread img:last-of-type { object-position: left }` — chủ động giữ nội dung trái, cắt phải. Tinh tế.
- `bai-3.css:559 .museum-spread img { object-fit: contain }` — tranh phục dựng **không bị cắt**. Đúng.
- `tin-2.css:34` hero `contain` — banner không mất chữ.
→ Không phát hiện ảnh cắt mất mặt/tay/nhân vật chính trên desktop.

**6.3 — Ảnh tư liệu dày chữ bị thu quá nhỏ (mobile).** Bài 02 (poster "Điển hình", ảnh Facebook), bài 06 (báo cũ xếp cạnh) → xem A3. *Đề xuất:* lightbox + xếp dọc ≤640px.

**6.4 — Caption mới "mô tả ảnh", chưa thêm nghĩa.** Nhiều figcaption kiểu "Không gian trưng bày chuyên đề…", "Du khách nước ngoài trải nghiệm…" chỉ thuật lại ảnh.
*Đề xuất:* thêm 1 dữ kiện/ý: con số, tên nhân vật, hoặc 1 trích dẫn ngắn — biến caption thành "lớp đọc thứ hai".

**6.5 — Ảnh chân dung bài 02 = ảnh chụp poster** (lặp ý 5/Bài 02): cân nhắc ảnh gốc.

---

## PHẦN C — Bảng ưu tiên refactor

| Ưu tiên | Hạng mục | Vị trí | Loại |
|---|---|---|---|
| 🔴 P0 | Script hero bài 03 chìm nền | `bai-4.css:196,82,204` | Contrast |
| 🔴 P0 | Body/caption 8–10px mobile | `bai-3.css:861,871,848,816`; `tin-1.css:458,480`; `tin-2.css:611,616`; `bai-2.css:761,782` | Typography |
| 🟠 P1 | Bỏ justify cho quote/lead (+mobile body) | A1 — toàn hệ | Typography |
| 🟠 P1 | Bài 2 & 6: ảnh ngang quá nhỏ trên phone | `tin-2.css:583`, `bai-2.css:756` | Layout/mobile |
| 🟠 P1 | Thay ảnh collage AI bài 01 | HTML bài 01 | Hình ảnh |
| 🟡 P2 | Title bài 02 giảm còn 2 màu | `bai-2.css:158` | Hierarchy |
| 🟡 P2 | Bài 03 giảm uppercase + bão hoà xanh | `bai-4.css` (A4, 4.2) | Màu/nhịp |
| 🟡 P2 | Bài 03 lặp poster + lặp "Nghề truyền thống" | `bai-4.css:286…`, HTML:156 | Nhịp |
| 🟡 P2 | Bài 01 thêm 1 điểm nhấn thị giác giữa bài | HTML bài 01 | Nhịp |
| 🟢 P3 | Tracking label ≤12px; sub trên ảnh +contrast; bài 06 cân nhắc full-bleed hero | nhiều | Tinh chỉnh |

> **Không phát hiện:** lỗi chính tả; chữ tràn sát viền; ảnh cắt mất nhân vật chính (desktop); section trống/placeholder. Đây là điểm mạnh nên giữ.

---

## PHẦN D — CHANGELOG (đã sửa trong code, **chưa push**)

Tất cả file CSS đã kiểm tra cân bằng dấu ngoặc (OK). Mỗi thay đổi map về mục audit ở trên.

### Đã sửa bằng code ✅
| Mục | File thay đổi | Nội dung |
|---|---|---|
| 4.1 (P0) | `bai-4.css` `.emag-cover::before`, `.cover-script` | Tăng độ phủ overlay vùng giữa hero (.74/.34 → .88/.6); đổi script sang navy đậm `#013a63` + viền chữ trắng 4 hướng → đọc rõ trên nền ảnh |
| 4.2 (P2) | `bai-4.css` `.emag-cover > img` | `filter: saturate(.9)` làm dịu mảng xanh |
| 4.3 (P3) | `bai-4.css` `.poster-caption p` | Opacity .86 → .94 + `text-shadow` → sub nổi khỏi ảnh |
| A2 (P0) | `bai-3.css` | `.museum-spread figcaption` 9→12px; `.youth-feature figcaption` 10→14px; `.research-panel p` 10→15px; `.research-panel span` 8→11px |
| A2 (P0) | `tin-1.css` | `.poster-copy span` 8→11px; `.support-poster .pn-row span` 8→11px |
| A2 (P0) | `tin-2.css` | `.press-cover/.press-final/.archive-spread figcaption` 10→12px |
| A2 (P0) | `bai-2.css` | `.media/.media-2 figcaption` 10→12px |
| A1 (P1) | `tin-2.css` `.press-quote p` | Bỏ `justify` → `left` (quote display không còn giãn chữ) |
| A1 (P1) | `story.css`, `bai-2.css`, `bai-3.css`, `bai-4.css`, `tin-1.css`, `tin-2.css` | Thêm `@media ≤560px` đưa thân bài về `text-align:left` (tránh "sông trắng" trên phone) |
| A3 (P1) | `bai-2.css`, `tin-2.css` | `@media ≤560px` xếp **dọc** cụm ảnh đôi (`.media/.media-2`, `.press-cover/.press-final/.archive-spread`) → ảnh tư liệu đủ to |
| A3 (P1) | `bai-3.css` | `@media ≤560px` xếp dọc `.youth-feature`, `.research-panel` → chữ về bề rộng đọc được |
| 1.1 (P2) | `bai-2.css` `.t-sub`, `:nth-child(3)` | "xung lực số" xanh → cream; chỉ còn 1 điểm màu (script "xứ Mường" amber). *(Đã kiểm tra: amber là `.t-script-inline`, không bị đụng.)* |
| 1.2 (P2) | `bai-3.css` `.line-trang-phuc` | Giảm `margin-bottom` 48→26px → cụm tiêu đề 4 dòng dính lại |
| 3.3 (P2) | HTML bài 03 | Nhãn box đổi "Nghề truyền thống" → **"Bàn tay giữ nghề"** (hết trùng với chữ kết câu) |
| 2.3 (P2) | HTML bài 03 | Bọc `<span class="nowrap">mở lối</span>` → không rớt "lối" mồ côi |
| 1.5/P3 | `bai-2.css`, `bai-3.css`, `tin-2.css` | Giảm `letter-spacing` các label 12px (.22–.24em → .16em) |

### Cần tài sản / quyết định — CHƯA làm (không sửa được bằng code) ⏳
| Mục | Lý do |
|---|---|
| 6.1 — thay ảnh collage AI bài 01 | Cần **ảnh thật**; CSS đã có `.calm-illustration` hạ bão hoà nhưng không thay được nội dung ảnh |
| 5/Bài 02 — ảnh chân dung là "ảnh chụp lại bìa in" | Cần **ảnh chân dung gốc** |
| 3.1 — bài 01 thêm 1 điểm nhấn thị giác giữa bài | Cần quyết định nội dung (dải số liệu / pullquote) trước khi dựng |
| 3.2 — bài 03 lặp công thức poster | Cần chọn section nào đổi device + nội dung |
| 5/Bài 06 — hero `contain` → cân nhắc full-bleed | Cần ảnh tư liệu full-bleed thay banner letterbox |
| 4.2 — chèn block nền trung tính giữa chuỗi poster bài 03 | Thay đổi cấu trúc, nên thống nhất nội dung trước |

> **Khuyến nghị kiểm thử:** mở 6 bài ở **375–414px** (phone) và **640–860px** (tablet) để xác nhận các khối vừa xếp dọc/đổi size hiển thị đúng, trước khi push.
