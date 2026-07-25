---
title: "Ví dụ: Ứng dụng thực tế của các khái niệm SDV"
description: "Hai use case thực tế — sửa chữa lưu động và chuỗi chào đón hành khách — cùng tái sử dụng một API mở cửa xe, minh họa SOA, container runtime và vehicle API trong SDV."
order: 29
part: "C"
depth: 3
origTitle: "Example: Real-World Application of SDV Concepts"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/example-real-world-application-of-sdv-concepts"
---

Vậy tất cả những điều này phối hợp với nhau như thế nào? **Container runtime** và **vehicle API** giúp chúng ta xây dựng **kiến trúc hướng dịch vụ (service-oriented architecture - SOA)** cho **Software-Defined Vehicle (SDV)** ra sao?

Tiếp theo đây, chúng ta sẽ xem xét hai use case: một ứng dụng dành cho thợ sửa chữa lưu động thực hiện sửa chữa tại chỗ, và một ứng dụng chào đón hành khách. Cả hai đều dùng chung một API để mở cửa xe, tức là trước tiên mở khóa cửa rồi mở cửa về mặt cơ khí thông qua một mô-tơ.

<figure><img src="/sdv101/Ejx1BtIfwcxSBgUiqJZ0.webp" alt=""><figcaption></figcaption></figure>

Hãy xem các thành phần tương tác với nhau như thế nào. Chúng ta có một **cloud runtime off-board**, một **edge container runtime on-board**, và các **môi trường hướng tín hiệu** nhúng sâu bên trong xe. Kết nối các thành phần này là hai lớp API then chốt: **vehicle-to-cloud API** cho giao tiếp với bên ngoài và **lớp trừu tượng phần cứng on-board (HAL)**, có thể tận dụng các chuẩn như **COVESA VSS**.

<figure><img src="/sdv101/7XJn7xZGImyarmDjlDqO.webp" alt=""><figcaption></figcaption></figure>

Bây giờ, hãy xét một use case thực tế liên quan đến dịch vụ bảo dưỡng hoặc sửa chữa lưu động, tương tự những gì Tesla và các startup xe điện khác cung cấp. Giả sử một kỹ thuật viên dịch vụ cần tiếp cận xe để bảo dưỡng ngay cả khi chủ xe không có mặt. Bằng một ứng dụng di động, kỹ thuật viên có thể gửi yêu cầu mở khóa xe từ xa. Cloud runtime xử lý yêu cầu thông qua **vehicle-to-cloud API**, API này chuyển tiếp lệnh tới **container runtime on-board**. Dịch vụ tương ứng được kích hoạt, và cửa xe được mở khóa rồi mở ra.

<figure><img src="/sdv101/yS4rGobGLOx6Ay0pTCR8.webp" alt=""><figcaption></figcaption></figure>

Tiếp theo, hãy xét một use case khác: **chuỗi chào đón hành khách** được thiết kế để tăng cường kết nối cảm xúc giữa chiếc xe và chủ nhân của nó. Khi người lái tiến lại gần xe, xe nhận diện chủ nhân thông qua một ứng dụng on-board. Dựa trên các tùy chọn ưa thích đã lưu của người lái, xe tự động điều chỉnh ghế ngồi, kích hoạt chuỗi hiệu ứng đèn và mở cửa — tất cả đều thông qua cùng một **API on-board**.

<figure><img src="/sdv101/2BDnOamAnhaAfTgpVvCW.webp" alt=""><figcaption></figcaption></figure>

Điều làm cho kiến trúc này hiệu quả là cả hai use case đều tái sử dụng chung một **API điều khiển cửa xe**. Ở kịch bản đầu tiên, API được truy cập từ bên ngoài bởi ứng dụng di động của kỹ thuật viên dịch vụ, còn ở kịch bản thứ hai, nó được kích hoạt từ bên trong bởi ứng dụng on-board chạy chuỗi chào đón. Điều này cho thấy sức mạnh của **tính module**, **khả năng tái sử dụng dịch vụ** và **phát triển hướng API** trong việc xây dựng các nền tảng SDV giàu feature và có khả năng mở rộng.
