---
title: "Container hóa"
description: "Container là nền tảng của điện toán đám mây: cách container hoạt động, microservices bên trong container, phân tầng hạ tầng, CI/CD pipeline và các lợi ích chính."
order: 15
part: "B"
depth: 4
origTitle: "Containerization"
origUrl: "https://www.sdv.guide/sdv101/part-b-lessons-learned/learnings-from-the-internet-folks/cloud-native-principles/loose-coupling/containerization"
---

**Container** là xương sống của điện toán đám mây, làm thay đổi căn bản cách các ứng dụng được xây dựng, triển khai và vận hành. Hoạt động ở quy mô cực lớn, container đang vận hành hàng trăm triệu, thậm chí hàng tỷ workload trên Internet, từ ứng dụng web và cơ sở dữ liệu cho tới huấn luyện và suy luận AI. Chúng được ứng dụng rộng rãi trong mọi ngành có sử dụng công nghệ Internet.

## Container hoạt động như thế nào

Container hoạt động như những môi trường cô lập, nhẹ, đóng gói phần mềm cùng toàn bộ các phụ thuộc của nó. Nhờ vậy, phần mềm cho hiệu năng nhất quán trên nhiều môi trường tính toán khác nhau. Container gắn bó chặt chẽ với **microservices** — mỗi microservice đảm nhiệm một chức năng nghiệp vụ cụ thể và cung cấp API để giao tiếp.

### Microservices bên trong container

Microservices nằm bên trong container và được quản lý bởi các container runtime. Những runtime này đảm nhiệm các thao tác thiết yếu trong vòng đời dịch vụ, bao gồm:

* **Triển khai và kích hoạt**: Khởi động dịch vụ mới khi cần.
* **Kết thúc dịch vụ**: Tắt các dịch vụ không còn hoạt động.
* **Mở rộng quy mô (scaling)**: Điều chỉnh số lượng thực thể dịch vụ đang chạy theo nhu cầu.
* **Giám sát dịch vụ và kiểm tra tình trạng (health check)**: Bảo đảm tính sẵn sàng và hiệu năng.
* **Chịu lỗi và phục hồi**: Tự động khởi động lại các dịch vụ bị lỗi.
* **Quản lý phiên bản**: Quản lý các phiên bản khác nhau của dịch vụ.
* **Hỗ trợ đa khách thuê (multi-tenancy)**: Chạy dịch vụ cho nhiều khách hàng một cách an toàn.

<figure><img src="/sdv101/7WMmnZRHlwgBbRGNebiG.webp" alt=""><figcaption></figcaption></figure>

### Phân tầng hạ tầng

Container chạy trên một lớp hạ tầng nhẹ, thường là các hệ điều hành ảo hóa được lưu trữ trên máy chủ vật lý. Kiến trúc phân tầng này tạo điều kiện cho khả năng mở rộng và tính linh hoạt.

<figure><img src="/sdv101/T0FPizZ0QYOnsLgGENez.webp" alt=""><figcaption></figcaption></figure>

### Container và pipeline tự động

Bên cạnh đó, **CI/CD pipeline** tự động hóa toàn bộ quy trình triển khai, cho phép phân phối liên tục các dịch vụ vào container runtime.

<figure><img src="/sdv101/ALSCEOAGqBjd5CArImmR.webp" alt=""><figcaption></figcaption></figure>

## Lợi ích của container

Container mang lại hàng loạt ưu điểm giúp cải thiện việc phát triển và vận hành ứng dụng:

* **Triển khai đơn giản hơn**: Đóng gói ứng dụng cùng mọi phụ thuộc giúp quá trình triển khai diễn ra trơn tru.
* **Tận dụng tài nguyên tốt hơn**: Container tối ưu việc sử dụng tài nguyên nhờ chạy nhiều dịch vụ trên cùng một hạ tầng.
* **Khả năng mở rộng**: Dịch vụ có thể dễ dàng tăng hoặc giảm quy mô theo nhu cầu.
* **Cô lập**: Container cô lập các ứng dụng, giảm xung đột và bảo đảm hành vi nhất quán.
* **Triển khai và kiểm thử nhanh hơn**: Ứng dụng có thể được triển khai và kiểm thử nhanh chóng trong môi trường container hóa.
* **Tính tương thích**: Container bảo đảm khả năng tương thích trên nhiều nền tảng khác nhau.
* **Hỗ trợ DevOps**: Container hỗ trợ các thực hành DevOps bằng cách tự động hóa các tác vụ triển khai và vận hành.
* **Dễ cộng tác**: Các nhà phát triển có thể làm việc độc lập và hợp nhất các cập nhật một cách suôn sẻ.
* **Bảo trì đơn giản hơn**: Container giúp việc cập nhật, vá lỗi và bảo trì ứng dụng trở nên dễ dàng hơn.

Container hóa đã trở thành công nghệ nền tảng cho các dịch vụ đám mây hiện đại, mang lại mức độ linh hoạt, hiệu quả và khả năng mở rộng vượt trội trong việc quản lý các ứng dụng phức tạp.
