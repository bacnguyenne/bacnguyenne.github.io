---
title: "Vehicle App Store: Chén Thánh của Software-Defined Vehicles"
description: "Các yếu tố nền tảng của Vehicle App Store, ví dụ ứng dụng mở cửa xe của thợ sửa xe, và độ phức tạp khi phối hợp giữa on-board, cloud và app store bên thứ ba."
order: 34
part: "C"
depth: 2
origTitle: "Vehicle App Store: The Holy Grail of Software-Defined Vehicles"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/vehicle-app-store-the-holy-grail-of-software-defined-vehicles"
---

Khái niệm **Vehicle App Store** (cửa hàng ứng dụng trên xe) là một bước nhảy mang tính đột phá đối với software-defined vehicles, khi nó tích hợp các dịch vụ cloud, smartphone và on-board để tạo ra những ứng dụng phong phú, linh hoạt. Về bản chất, hệ sinh thái này đòi hỏi một số yếu tố nền tảng.

### Các yếu tố nền tảng của Vehicle AppStore

Trước hết, cần có một môi trường thực thi ứng dụng on-board an toàn, sử dụng công nghệ container để tạo ra các sandbox cô lập nơi ứng dụng có thể chạy một cách an toàn. Môi trường này bảo đảm ứng dụng chỉ truy cập API trong phạm vi được kiểm soát, được tổ chức theo các mức tin cậy (trust level). Ví dụ, ứng dụng do OEM (nhà sản xuất thiết bị gốc) phát triển sẽ có mức tin cậy cao hơn, cho phép truy cập nhiều API hơn, trong khi ứng dụng của đối tác hoặc bên thứ ba có thể bị giới hạn quyền chặt chẽ hơn.

<figure><img src="/sdv101/5Q4PlYglePZsOysEd8wq.webp" alt=""><figcaption></figcaption></figure>

Bản thân Vehicle App Store đóng vai trò then chốt: nó cung cấp một nền tảng để phân phối ứng dụng tới xe qua các bản cập nhật over-the-air (OTA), dựa trên kết nối cloud vững chắc. Sự kết nối liền mạch giữa môi trường on-board và cloud cho phép cập nhật liên tục và tích hợp các dịch vụ mới.

### Ví dụ: Ứng dụng smartphone của thợ sửa xe dùng để mở cửa xe

Để hiểu hệ thống này vận hành ra sao trong thực tế, hãy quay lại một ví dụ cụ thể: một thợ sửa xe dùng ứng dụng trên smartphone để mở cửa xe của khách hàng. Ứng dụng này, được thiết kế cho smartphone, sẽ được tải về từ app store của nhà cung cấp smartphone (ví dụ Apple, Google). Để ứng dụng hoạt động được, trước tiên OEM phải gửi nó lên app store của hãng smartphone. Ngoài ra, OEM còn phải bảo đảm các microservices hỗ trợ được phân phối tới đúng các môi trường cần thiết.

Quá trình diễn ra như sau:

1. **Triển khai ứng dụng:** OEM cung cấp ứng dụng cho app store của hãng smartphone. Song song, các thành phần phần mềm và microservices cần thiết được triển khai xuống xe qua các bản cập nhật OTA. Những microservices này đóng vai trò là phía đối ứng on-board của ứng dụng trên smartphone.
2. **Dịch vụ backend:** OEM cũng thiết lập các dịch vụ cloud backend để hỗ trợ cả ứng dụng on-board lẫn ứng dụng trên smartphone.
3. **Thực thi hành động:** Thợ sửa xe nhấn một nút trong ứng dụng smartphone, kích hoạt một lời gọi tới API từ xa. Yêu cầu API này được xử lý bởi một microservice trên cloud, và microservice đó lại gọi một API từ xa do một microservice chạy on-board trên xe của khách hàng cung cấp.
4. **Vận hành on-board:** Microservice on-board giao tiếp với vehicle API để thực thi hành động được yêu cầu, chẳng hạn mở cửa xe. Việc này bao gồm thực hiện toàn bộ các kiểm tra an toàn cần thiết (ví dụ: bảo đảm xe đang đứng yên, kiểm tra tình hình giao thông xung quanh và xác nhận không có vật cản).
5. **Phối hợp liên hệ thống:** Để quy trình này chạy trơn tru, cả ba thành phần — ứng dụng smartphone, microservice trên cloud và microservice on-board — đều phải hoạt động đầy đủ và được tích hợp với nhau. Ngoài ra, xe phải đã triển khai API cần thiết (trong trường hợp này là API mở cửa).

Sơ đồ sau minh hoạ luồng đi của các thành phần ứng dụng xuyên suốt hệ thống:

<figure><img src="/sdv101/elZfyD10CKbNq9PdhTsO.webp" alt=""><figcaption></figcaption></figure>

Sơ đồ sau minh hoạ cách các thành phần ứng dụng phân tán tương tác với nhau sau khi đã được cài đặt vào những môi trường runtime khác nhau:

<figure><img src="/sdv101/u8Ve9UlQHOTnjiOSqeRk.webp" alt=""><figcaption></figcaption></figure>

## Độ phức tạp và sự phối hợp liên hệ thống

Mô hình Vehicle App Store làm nổi bật độ phức tạp của việc xây dựng Vehicle SOA như một hệ thống phân tán. OEM phải phối hợp trên nhiều lĩnh vực, bao gồm hệ thống on-board, dịch vụ cloud và các nền tảng bên thứ ba như app store của hãng smartphone. Mỗi thành phần đều phải phối hợp hoàn hảo với nhau, đòi hỏi rất nhiều bước kiểm tra chéo và kiểm định để bảo đảm tính tương thích và khả năng hoạt động.

Bất chấp những thách thức đó, Vehicle App Store vẫn được xem là "chén thánh" của software-defined vehicles. Bằng cách cho phép tích hợp liền mạch các ứng dụng kết hợp dịch vụ smartphone, cloud và on-board, nó hứa hẹn sẽ cách mạng hoá trải nghiệm trên xe, mang đến cho khách hàng những tính năng phong phú, sáng tạo và thiết lập một hệ sinh thái năng động cho tương lai của ngành di chuyển.
