---
title: "Nền tảng: Kiến trúc E/E"
description: "Kiến trúc E/E — xương sống của xe hiện đại: thành phần điện và điện tử, ECU, cảm biến, cơ cấu chấp hành và các mạng CAN, LIN, FlexRay, Automotive Ethernet."
order: 19
part: "C"
depth: 1
origTitle: "Foundation: E/E Architecture"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/foundation-e-e-architecture"
---

E/E Architecture là viết tắt của Electrical and Electronic Architecture (kiến trúc điện và điện tử), đóng vai trò xương sống của xe hiện đại bằng cách tích hợp các hệ thống điện với năng lực tính toán tiên tiến.&#x20;

<figure><img src="/sdv101/0PbZJSs5W2P1cPHzYa7B.webp" alt=""><figcaption></figcaption></figure>

Các thành phần **điện** đảm nhiệm việc truyền tải và phân phối nguồn điện trên toàn xe, bao gồm bó dây điện (wiring harness), ắc-quy, các bộ phân phối nguồn, đầu nối điện và cầu chì. Ngược lại, các thành phần **điện tử** xử lý thông tin và thực thi chức năng thông qua các mạch điện và vi điều khiển, trải dài từ những ECU (Electronic Control Unit — bộ điều khiển điện tử) đầu cuối cấp thấp cho tới các ECU tính toán hiệu năng cao được thiết kế để chạy những thuật toán phức tạp phục vụ AD (Automated Driving — lái xe tự động), ADAS (Advanced Driver Assistance Systems — hệ thống hỗ trợ lái nâng cao), cảm biến và cơ cấu chấp hành.

## Các thành tố chính của kiến trúc E/E

Theo cách truyền thống, kiến trúc E/E được tổ chức theo thứ bậc:

1. **Cấp miền (Domain Level)**: Bao trùm các lĩnh vực chức năng như hệ truyền động, khung gầm và infotainment.
2. **Cấp hệ thống (System Level)**: Định nghĩa từng hệ thống riêng lẻ, ví dụ hệ thống quản lý động cơ và hệ thống điều khiển phanh.
3. **Cấp thành phần (Component Level)**: Chứa các thành phần phần cứng và phần mềm cụ thể hợp thành hệ thống hoàn chỉnh.

### Thành phần

Các thành phần chính của kiến trúc E/E bao gồm:

* **Bộ điều khiển (ECU)**: Quản lý những chức năng cụ thể của xe. Chúng xử lý dữ liệu và điều khiển các hệ thống khác nhau.
* **Cảm biến**: Thu thập dữ liệu thời gian thực từ môi trường xung quanh hoặc bên trong xe, cung cấp đầu vào thiết yếu cho hoạt động của hệ thống.
* **Cơ cấu chấp hành (Actuator)**: Chuyển tín hiệu điện thành tác động cơ khí, thực thi lệnh từ các bộ điều khiển.
* **Mạng truyền thông**: Cho phép các thành phần giao tiếp với nhau một cách liền mạch.

### Mạng truyền thông E/E

Các mạng như CAN, LIN và FlexRay giúp trao đổi dữ liệu và cho phép giao tiếp liền mạch giữa các thành phần như ECU, cảm biến và cơ cấu chấp hành.

* **CAN (Controller Area Network)**: Giao thức bền vững, đã được thiết lập rộng rãi cho truyền thông tốc độ cao, chủ yếu dùng trong các hệ thống hệ truyền động và khung gầm.
* **LIN (Local Interconnect Network)**: Giải pháp tiết kiệm chi phí và hiệu quả cho các ứng dụng không tới hạn, thường dùng trong điện tử thân xe.
* **FlexRay**: Giao thức tốc độ cao, có tính tất định, dùng trong các hệ thống tới hạn về an toàn như drive-by-wire và brake-by-wire.
* **Automotive Ethernet**: Được điều chỉnh từ công nghệ Ethernet của Internet, Ethernet ô tô ngày càng được sử dụng nhiều cho các ứng dụng đòi hỏi băng thông lớn trên xe hiện đại.

Bằng cách liên kết các thành phần và mạng truyền thông này lại với nhau, kiến trúc E/E cho phép các hệ thống cơ khí, điện và phần mềm tương tác liền mạch, đặt nền móng cho sự phát triển của Software-Defined Vehicles (xe được định nghĩa bằng phần mềm).

<figure><img src="/sdv101/9NmtKSHbpDUWdxmhCHBU.webp" alt=""><figcaption></figcaption></figure>
