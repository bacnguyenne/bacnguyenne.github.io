---
title: "Phần C: Các khối xây dựng"
description: "Giới thiệu các khối xây dựng nền tảng của SDV: mối phụ thuộc giữa kiến trúc E/E hiện đại (domain, zonal HPC) và các công nghệ SOA, container, vehicle API, OTA."
order: 18
part: "C"
depth: 0
origTitle: "Part C: Building Blocks"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks"
---

Trong phần này, chúng ta tìm hiểu những thành phần nền tảng giúp Software-Defined Vehicles (SDV — xe được định nghĩa bằng phần mềm) làm thay đổi ngành công nghiệp ô tô. Cốt lõi của sự chuyển đổi này nằm ở mối phụ thuộc chặt chẽ giữa kiến trúc Điện/Điện tử (E/E) và SDV.

<figure><img src="/sdv101/rmk5AbVtVCpvFPfj8AjQ.webp" alt=""><figcaption></figcaption></figure>

Kiến trúc E/E đóng vai trò cầu nối giữa các hệ thống cơ khí của xe, mạng phân phối điện năng và hạ tầng kết nối với các lớp phần mềm. Nó bảo đảm rằng những lĩnh vực vốn do phần cứng chi phối này có thể đáp ứng các yêu cầu động, thời gian thực của những hệ thống phần mềm ô tô hiện đại.&#x20;

Trong khi đó, SDV dựa trên nền tảng ấy để mang lại các trải nghiệm trên xe do phần mềm tạo ra, tạo nên sự kết hợp liền mạch giữa năng lực phần cứng và các dịch vụ số tiên tiến. Cùng nhau, kiến trúc E/E và SDV tạo thành xương sống cho thế hệ xe kết nối, thông minh tiếp theo.

Trong chương này, chúng ta đi sâu vào các khối xây dựng then chốt của software-defined vehicles (SDV), tìm hiểu sự tích hợp thiết yếu giữa các kiến trúc E/E hiện đại — chẳng hạn hệ thống high-performance computing (HPC) tập trung theo domain và theo zone — với những công nghệ tạo nền cho SDV. Các công nghệ này bao gồm kiến trúc hướng dịch vụ (SOA), container runtime, vehicle API, các biện pháp an toàn chức năng, cập nhật over-the-air (OTA) và tiềm năng mang tính đột phá của vehicle app store — tất cả được xây dựng trên những tech stack hiện đại, vững chắc.

<figure><img src="/sdv101/x26loH3G2pzeCZ4SJApd.webp" alt=""><figcaption></figcaption></figure>
