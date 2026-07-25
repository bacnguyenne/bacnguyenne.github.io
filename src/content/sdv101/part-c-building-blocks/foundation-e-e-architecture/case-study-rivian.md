---
title: "Nghiên cứu tình huống: Rivian"
description: "Rivian giảm số ECU từ 17 xuống 7 với kiến trúc E/E zonal thế hệ 2, đạt mức giảm 60% ECU, 1,6 dặm dây dẫn, 44 pound trọng lượng và 40% chi phí BOM điện."
order: 22
part: "C"
depth: 2
origTitle: "Case Study: Rivian"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/foundation-e-e-architecture/case-study-rivian"
---

Rivian, một startup xe điện có trụ sở tại California chuyên về xe điện định hướng phiêu lưu, là một ví dụ đáng chú ý về đổi mới trong kiến trúc E/E. Với các quan hệ đối tác vững chắc, bao gồm Amazon và Volkswagen, Rivian đã đạt được tiến bộ đáng kể trong việc giảm độ phức tạp của kiến trúc xe, như đã chia sẻ tại Investor Day 2024 của hãng.

<figure><img src="/sdv101/NVy4gQ6G5aUi2KqZnP1e.webp" alt=""><figcaption></figcaption></figure>

Ở thế hệ xe đầu tiên, Rivian đã giảm số lượng ECU xuống chỉ còn 17, trái ngược hoàn toàn với con số hàng chục ECU mà các OEM lâu đời thường sử dụng. Hiện tại, Rivian đang phát triển thế hệ xe thứ hai, tinh gọn thiết kế hơn nữa xuống chỉ còn bảy ECU tự phát triển nội bộ.

<figure><img src="/sdv101/TqZhUlaoWIuby6kgl3fS.webp" alt=""><figcaption></figcaption></figure>

Kiến trúc này áp dụng thiết kế zonal theo vùng, gồm các zonal controller phía đông, phía tây và phía nam, được bổ sung bởi một số ECU chuyên biệt cho các chức năng then chốt như infotainment, AD và ADAS, kiểm soát truy cập xe, và quản lý pin.

<figure><img src="/sdv101/4STU8Y9P4ccYwlLK0Nf9.webp" alt=""><figcaption></figcaption></figure>

Những lợi ích mà Rivian báo cáo từ kiến trúc Gen 2 rất ấn tượng:

* Giảm 60% số lượng ECU so với thế hệ xe đầu tiên.
* Giảm 1,6 dặm chiều dài dây dẫn, qua đó giảm đáng kể độ phức tạp của xe.
* Giảm 44 pound trọng lượng trên mỗi xe.
* Giảm 40% chi phí Bill of Materials (BOM) phần điện.

Nghiên cứu tình huống này cho thấy Rivian và các startup xe điện khác đang đón nhận kiến trúc E/E zonal, điện toán tập trung và các nguyên lý software-defined vehicle như thế nào, đạt được những lợi ích hữu hình về chi phí, độ phức tạp và hiệu quả. Nó làm nổi bật lợi thế cạnh tranh mà các startup có thể giành được khi áp dụng những cách tiếp cận tiên tiến cho hệ thống E/E.
