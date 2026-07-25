---
title: "SOA Framework cho SDV"
description: "Cấu trúc SOA framework cho SDV: cloud runtime, vehicle-to-cloud API, container runtime, signal-to-service API và các chuỗi dịch vụ end-to-end."
order: 26
part: "C"
depth: 3
origTitle: "The SOA Framework for SDVs"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/the-soa-framework-for-sdvs"
---

SOA framework dành cho SDV bao trùm cả môi trường **on-board** (trên xe) lẫn **off-board** (ngoài xe), tích hợp các môi trường **QM** (Quality Management — quản lý chất lượng) phục vụ phát triển ứng dụng theo hướng agile và các môi trường **ASIL** (Automotive Safety Integrity Level — mức toàn vẹn an toàn ô tô) dành cho những ứng dụng an toàn trọng yếu phải đúng ngay từ lần đầu.

<figure><img src="/sdv101/s3NtyDyaHM4nwJQEbyNR.webp" alt=""><figcaption></figcaption></figure>

Dưới đây là cấu trúc của SOA Framework cho SDV:

**1. Cloud Runtime**

Nằm ở trung tâm của hệ thống off-board, **cloud runtime** cho phép phát triển microservices theo hướng linh hoạt và có khả năng mở rộng. Nó bảo đảm tích hợp liền mạch với các hệ thống on-board, cho phép cập nhật liên tục, xử lý dữ liệu và nâng cấp ứng dụng trong một môi trường tập trung.

**2. Vehicle-to-Cloud API**

**Vehicle-to-cloud API** đóng vai trò cầu nối giữa môi trường on-board và off-board. Nó tạo điều kiện cho giao tiếp giữa các hệ thống trên xe và các nền tảng cloud, bảo đảm dữ liệu và chức năng lưu chuyển theo cả hai chiều một cách an toàn và hiệu quả.

**3. Container Runtime**

Để thực thi các chức năng SDV ngay trên xe, một **container runtime** là điều thiết yếu. Nó cung cấp hạ tầng module hoá cần thiết để chạy các microservices một cách độc lập, bảo đảm khả năng mở rộng, khả năng chịu lỗi và sự nhanh nhạy. Container runtime hỗ trợ phát triển song song và triển khai hiệu quả, cho phép cập nhật và kiểm thử nhanh hơn.

**4. Signal-to-Service API**

Nằm ở lõi của SOA, các **signal-to-service API** chuyển đổi tín hiệu thô từ cảm biến, cơ cấu chấp hành và ECU thành những service ở mức cao hơn. Lớp trừu tượng này đơn giản hoá việc tương tác với các hệ thống phức tạp trên xe, giúp lập trình viên ứng dụng tập trung vào việc tạo ra chức năng mà không phải bận tâm đến độ phức tạp của phần cứng bên dưới.

**5. Embedded Runtime hướng tín hiệu**

Các embedded runtime tận dụng thiết kế hướng tín hiệu để tối ưu hiệu năng thời gian thực và bảo đảm các hệ thống on-board vận hành trơn tru. Những runtime này tương tác với các signal-to-service API và các microservices được đóng container, điều phối các tiến trình trọng yếu trong SDV với độ trễ tối thiểu và độ tin cậy cao.

## **Các khối xây dựng SOA on-board**

* **Endpoint ECU**: Đây là các bộ điều khiển ở tầng thấp, kết nối với cảm biến và cơ cấu chấp hành thông qua mạng bus cục bộ. Chúng truyền dữ liệu tới các zonal controller.
* **Zonal Controller**: Các ECU cấp cao hơn, nơi đặt các **signal-to-service API**, tạo cầu nối giữa phần cứng và các dịch vụ phần mềm.
* **Microservices**: SOA cho phép phát triển các microservices nhẹ:
  * **Basic Microservices**: Các service đơn giản, độc lập, thực hiện những tác vụ cụ thể.
  * **Composite Microservices**: Các service bậc cao hơn, kết hợp nhiều basic service thành những chức năng phức tạp hơn.

## **Chuỗi dịch vụ end-to-end**

SOA hỗ trợ việc tạo ra các **chuỗi dịch vụ end-to-end** trải dài qua cả môi trường on-board lẫn off-board:

* Trên **cloud**, các microservices có thể truy cập chức năng của xe thông qua vehicle-to-cloud API, và tương tác với cảm biến cũng như cơ cấu chấp hành ở mức tín hiệu thông qua signal-to-service API.
* Trên xe, các API này cho phép phát triển linh hoạt các chức năng QM, với kế hoạch trong tương lai sẽ hỗ trợ cả các chức năng ASIL A và B.

## **Tương lai của SOA**

SOA cho phép giao tiếp liền mạch giữa xe, cloud và các hệ sinh thái bên ngoài, thúc đẩy tính linh hoạt, khả năng mở rộng và độ an toàn. Khi kiến trúc tiếp tục tiến hoá, các signal-to-service API sẽ ngày càng hỗ trợ nhiều ứng dụng an toàn trọng yếu, mở rộng giới hạn của **software-defined vehicles**. Sự hội tụ giữa các dịch vụ on-board và off-board chính là yếu tố cốt lõi để xây dựng những SOA framework bền bỉ và sẵn sàng cho tương lai.
