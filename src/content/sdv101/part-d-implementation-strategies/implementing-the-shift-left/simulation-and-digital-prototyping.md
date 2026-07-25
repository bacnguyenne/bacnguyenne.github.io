---
title: "Mô phỏng và tạo nguyên mẫu số"
description: "Vai trò của tạo nguyên mẫu và mô phỏng trong Shift Left: giảm rủi ro dự án, dự đoán hiệu năng hệ thống, cùng ba đòn bẩy kiểm thử từ nghiên cứu tình huống của McKinsey."
order: 44
part: "D"
depth: 2
origTitle: "Simulation and Digital Prototyping"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/simulation-and-digital-prototyping"
---

Để triển khai thành công **Shift Left**, mô phỏng và tạo nguyên mẫu đóng vai trò then chốt trong việc rút ngắn chu kỳ phát triển và bảo đảm kết quả có chất lượng cao hơn. Như thể hiện trong sơ đồ, cả hai cách tiếp cận đều giải quyết những thách thức chính ở các giai đoạn đầu của quy trình phát triển.

## Giới thiệu

**Tạo nguyên mẫu (prototyping)** tập trung vào việc **giảm rủi ro dự án** bằng cách xác nhận ý tưởng từ sớm và khẳng định rằng các đội ngũ đang xây dựng *đúng* sản phẩm cần xây dựng. Bằng cách kiểm thử và đánh giá ý tưởng cùng người dùng cuối ngay từ những giai đoạn sớm nhất, việc tạo nguyên mẫu bảo đảm sự thống nhất giữa mục tiêu phát triển và kỳ vọng của người dùng, tránh những lần điều chỉnh hướng đi tốn kém về sau.

<figure><img src="/sdv101/7iDaeVq8wglhpbuVbWe5.webp" alt=""><figcaption></figcaption></figure>

Ở chiều ngược lại, **mô phỏng (simulation)** là yếu tố thiết yếu để **dự đoán hiệu năng hệ thống** và bảo đảm sản phẩm đang được xây dựng *đúng cách*. Mô phỏng cho phép các đội ngũ đánh giá hệ thống hiện có, kiểm thử những thay đổi dự kiến và cân nhắc các giải pháp thay thế trong môi trường ảo trước khi có bất kỳ triển khai vật lý nào. Điều này giảm đáng kể sự phụ thuộc vào những nguyên mẫu vật lý tốn thời gian và cho phép lặp cũng như tối ưu hóa nhanh chóng.

Trong bối cảnh Shift Left, việc kết hợp **tạo nguyên mẫu** để xác nhận và **mô phỏng** để dự đoán hiệu năng giúp phát hiện và giải quyết vấn đề sớm nhất có thể, giảm thiểu rủi ro ở các khâu phía sau và thúc đẩy hiệu quả trong suốt vòng đời phát triển. Cùng nhau, chúng bảo đảm các đội ngũ có thể đi nhanh hơn, nâng cao chất lượng và mang lại kết quả tốt hơn với ít bất ngờ hơn.

## Nghiên cứu tình huống của McKinsey

Một nghiên cứu tình huống gần đây của McKinsey chỉ ra **ba đòn bẩy then chốt** để cải thiện hiệu quả kiểm thử và xác nhận trong các giai đoạn phát triển sản phẩm và tăng tốc sản xuất:

1. **Đẩy mạnh ảo hóa**: Bằng cách tận dụng mô phỏng ảo và mô hình số, các đội ngũ có thể kiểm thử và xác nhận thiết kế từ sớm, giảm rủi ro và tối ưu hóa quyết định với những công cụ như mô hình hóa 3D.
2. **Tối ưu việc sử dụng nguyên mẫu**: Nguyên mẫu vật lý vẫn cần thiết, nhưng cách sử dụng chúng được tinh gọn thông qua tạo nguyên mẫu nhanh, đưa các bài kiểm thử lên sớm và phối hợp tốt hơn. Điều này giảm đáng kể chi phí và công sức kiểm thử.
3. **Chuyển các bài kiểm thử sang giai đoạn tiền loạt (preseries)**: Việc xác nhận cuối cùng được thực hiện trên xe tiền loạt bằng công cụ dùng cho sản xuất loạt, cho phép phát hiện sớm hơn các vấn đề liên quan đến sản xuất và bảo đảm kết quả chất lượng cao.

Mức độ tác động trải dài từ **cách mạng** — thông qua ảo hóa — đến **tiến hóa** khi các quy trình dần hoàn thiện.

<figure><img src="/sdv101/h3bP1Qgdq8Di6vE9sDVz.webp" alt=""><figcaption><p>Nguồn: McKinsey</p></figcaption></figure>

Để nhấn mạnh tầm quan trọng của việc tạo nguyên mẫu, McKinsey dẫn lại một nghiên cứu tình huống từ một **nhà sản xuất máy bay** đã triển khai nền tảng phát triển ảo dùng chung với 27 đối tác. Cách tiếp cận hợp tác này mang lại mức **giảm 50% thời gian lắp ráp** và **giảm 66% chi phí đồ gá, dụng cụ**, cho thấy giá trị to lớn của công cụ ảo và việc tối ưu hóa tạo nguyên mẫu. Ví dụ này nhấn mạnh cách kết hợp kiểm thử ảo và kiểm thử vật lý giúp đẩy nhanh phát triển mà vẫn duy trì chất lượng và hiệu quả chi phí.

{% embed url="<https://www.mckinsey.com/capabilities/operations/our-insights/testing-and-validation-from-hardware-focus-to-full-virtualization>" %}
