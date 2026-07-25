---
title: "Vehicle API"
description: "Vai trò của Vehicle API trong SDV, các chuẩn chủ chốt như COVESA VSS, Android Automotive HAL, ISO 23150 và ví dụ digital.auto VSS Browser."
order: 28
part: "C"
depth: 3
origTitle: "Vehicle APIs"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/vehicle-apis"
---

**Vehicle API** giữ vai trò trung tâm trong các **Software-Defined Vehicles (SDV — xe được định nghĩa bằng phần mềm)** hiện đại nhờ cho phép truy cập dữ liệu và chức năng của xe theo cách chuẩn hoá. Chúng đơn giản hoá việc phát triển, nâng cao khả năng tương tác liên thông và hỗ trợ các dịch vụ mới, qua đó thúc đẩy đổi mới trong hệ sinh thái ô tô.

## Vì sao Vehicle API lại quan trọng

Vehicle API quan trọng bởi chúng mang lại khả năng truy cập dữ liệu và chức năng theo chuẩn, khả năng tích hợp liền mạch cho lập trình viên, cũng như khả năng kích hoạt dịch vụ và mô hình kinh doanh mới:

1. **Truy cập dữ liệu và chức năng theo chuẩn**: Vehicle API cho phép lập trình viên truy cập những dữ liệu thiết yếu của xe, chẳng hạn số đọc từ cảm biến (ví dụ tốc độ xe hay trạng thái sạc của pin) và điều khiển cơ cấu chấp hành (ví dụ chỉnh gương, hạ cửa kính) một cách nhất quán và chuẩn hoá.
2. **Tích hợp liền mạch cho lập trình viên**: API trừu tượng hoá sự phức tạp của **kiến trúc E/E** bên dưới và các mạng ô tô, giúp lập trình viên ứng dụng tập trung vào việc tạo ra feature mà không cần chuyên môn sâu về kỹ thuật ô tô.
3. **Kích hoạt dịch vụ và mô hình kinh doanh mới**: Bằng cách tạo điều kiện truy cập dễ dàng vào các chức năng của xe, API mở ra cơ hội cho những dịch vụ **on-board** và **off-board**, nâng cao trải nghiệm sử dụng xe và cho phép các mô hình kinh doanh dựa trên hệ sinh thái như ứng dụng cá nhân hoá, chẩn đoán từ xa và dịch vụ kết nối.

## Các chuẩn API chủ chốt trong lĩnh vực ô tô

Có một số chuẩn API chủ chốt đang hình thành trong lĩnh vực ô tô, bao gồm:

1. **COVESA VSS (Vehicle Signal Specification)**: Một chuẩn signal-to-service API định nghĩa cách cấu trúc các tín hiệu của xe, cho phép truy cập và điều khiển dữ liệu liền mạch thông qua mô hình cấu trúc cây.
2. **Android Automotive HAL (Hardware Abstraction Layer)**: Do Google phát triển, chuẩn API này định nghĩa lớp trừu tượng phần cứng cho các hệ thống infotainment nền Android, bảo đảm tích hợp nhất quán trên nhiều nền tảng phần cứng ô tô khác nhau.
3. **ISO 23150**: Một tiêu chuẩn quốc tế nhằm chuẩn hoá các interface cho **chức năng lái tự động**, bảo đảm giao tiếp tin cậy giữa các hệ thống trong bối cảnh phát triển xe tự hành.

Vehicle API là yếu tố then chốt cho **dịch vụ kết nối**, **nền tảng software-defined** và **đổi mới trong ngành ô tô**, thu hẹp khoảng cách giữa các hệ thống xe phức tạp và lập trình viên ứng dụng, đồng thời hỗ trợ những hệ sinh thái ô tô có khả năng mở rộng và tương tác liên thông.

## Ví dụ: digital.auto VSS Browser

digital.auto VSS Browser là một công cụ mã nguồn mở, miễn phí, dùng để khám phá danh mục API COVESA VSS. Chẳng hạn, dưới đây chúng tôi trình bày một phần của danh mục API ở cấu trúc cây nguyên bản của nó.

<figure><img src="/sdv101/7VEzJVz46BiRSNqShhDN.webp" alt=""><figcaption></figcaption></figure>

VSS browser cũng cho phép duyệt cây COVESA VSS theo cấu trúc danh mục VSS. Hình sau đây cho thấy gốc của danh mục:

<figure><img src="/sdv101/Vd2DWtZHm4xYCXYjMmhc.webp" alt=""><figcaption></figcaption></figure>

Khi chọn một tín hiệu VSS cụ thể, các thông tin chi tiết sẽ hiển thị như sau:

<figure><img src="/sdv101/A9XvePrQAEOPM3WquwVh.webp" alt=""><figcaption></figcaption></figure>

Hãy dùng liên kết sau để tự mình thử nghiệm:

{% embed url="<https://playground.digital.auto/>" %}
