---
title: "Container Runtime"
description: "Container runtime trong SDV: yêu cầu khởi động nhanh và tất định, tối ưu tài nguyên, bảo mật cùng cập nhật OTA, và vị trí của chúng trong kiến trúc E/E ô tô."
order: 27
part: "C"
depth: 3
origTitle: "Container Runtimes"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/container-runtimes"
---

Container runtime là xương sống vận hành của **Software-Defined Vehicles (SDV — xe được định nghĩa bằng phần mềm)**, mở rộng các nguyên lý từ hạ tầng Internet sang lĩnh vực ô tô. Dù container đã vận hành các dịch vụ cloud hiện đại, việc điều chỉnh chúng cho ứng dụng ô tô lại đi kèm những thách thức và yêu cầu riêng.

## Các yêu cầu chính đối với container runtime dùng cho ô tô

Các yêu cầu chính đối với container runtime dùng cho ô tô bao gồm: thời gian khởi động nhanh và có tính tất định, tối ưu tài nguyên, cùng với bảo mật nâng cao và cập nhật hiệu quả:

1. **Thời gian khởi động nhanh và có tính tất định**: Trên xe, độ trễ khởi động là điều không thể chấp nhận. Hãy hình dung bạn mở khóa xe rồi phải chờ vài giây để những dịch vụ tối quan trọng như giao diện trải nghiệm trên xe khởi động xong. Container runtime đạt chuẩn ô tô phải bảo đảm phản hồi gần như tức thời, hỗ trợ các ứng dụng thời gian thực hoặc gần thời gian thực, kể cả trong môi trường QM.
2. **Tối ưu tài nguyên**: Hệ thống tính toán trên xe chịu ràng buộc phần cứng ngay cả khi dùng bộ xử lý hiệu năng cao. Khác với môi trường cloud, hệ thống trên xe không thể co giãn quy mô một cách đàn hồi. Do đó, việc phân bổ tài nguyên hiệu quả là thiết yếu, bảo đảm các dịch vụ container hóa chạy mượt mà trong giới hạn tài nguyên tính toán sẵn có.
3. **Bảo mật nâng cao và cập nhật hiệu quả**: Container trên ô tô đòi hỏi các biện pháp bảo mật vững chắc như cô lập giữa các dịch vụ, cơ chế secure boot và khả năng chống lại các mối đe dọa an ninh mạng. Cơ chế cập nhật hiệu quả phải hỗ trợ cập nhật over-the-air (OTA) liền mạch với thời gian gián đoạn tối thiểu.

## Container runtime trong kiến trúc E/E ô tô

Trong một **kiến trúc E/E** ô tô, container runtime nằm trong cấu trúc hệ thống tổng thể, cho phép triển khai dịch vụ một cách linh hoạt và có khả năng mở rộng:

* **Bộ tính toán trung tâm (Central Compute Unit)**: Đơn vị này lưu trữ nhiều thực thể hệ điều hành, thường sử dụng các công nghệ ảo hóa như hypervisor.
* **Các thực thể OS ảo**: Bên trong những máy ảo này, container runtime quản lý việc triển khai microservices.
* **Container runtime**: Nhẹ và có tính mô-đun, những môi trường này lưu trữ một hoặc nhiều microservices, tạo nên một kiến trúc hướng dịch vụ.
* **Microservices**: Mỗi microservice chạy độc lập, cung cấp các chức năng xe theo dạng mô-đun. Nhiều dịch vụ container hóa có thể chạy đồng thời, bảo đảm hiệu năng bền vững và có khả năng mở rộng.

<figure><img src="/sdv101/EmqWKLqukWM9mJdBPLhS.webp" alt=""><figcaption></figcaption></figure>

Nhờ tích hợp container runtime, **Software-Defined Vehicles** đạt được khả năng mở rộng, tính mô-đun và độ tin cậy cần thiết cho các chức năng ô tô hiện đại, đồng thời bảo đảm tương tác liền mạch với **các dịch vụ cloud off-board**. Sự kết hợp này cho phép triển khai **ứng dụng thời gian thực**, **cập nhật over-the-air** và **nâng cao khả năng cung cấp dịch vụ**, tạo thành xương sống công nghệ cho các nền tảng ô tô thế hệ tiếp theo.
