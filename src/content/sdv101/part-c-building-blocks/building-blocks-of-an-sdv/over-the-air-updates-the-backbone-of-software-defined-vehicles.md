---
title: "Cập nhật Over-the-Air: Xương sống của Software-Defined Vehicle"
description: "Cách cập nhật OTA vận hành từ backend tới update agent trên xe, hạn chế của kiến trúc ECU legacy dùng CAN/LIN, tương lai cá nhân hóa và nghiên cứu điển hình tại Rivian."
order: 33
part: "C"
depth: 2
origTitle: "Over-the-Air Updates: The Backbone of Software-Defined Vehicles"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/over-the-air-updates-the-backbone-of-software-defined-vehicles"
---

Cập nhật Over-the-Air (OTA — cập nhật qua sóng vô tuyến) là một trụ cột của Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm), cho phép bổ sung, sửa lỗi và cải tiến một cách linh hoạt mà không cần can thiệp vật lý. Cập nhật OTA ngày nay có thể phân phối nhiều loại artifact số khác nhau, bao gồm bản cập nhật phần mềm, cải tiến mô hình AI, dữ liệu cấu hình và dữ liệu media, cũng như các bản cập nhật hệ điều hành hoặc firmware. Mỗi bản cập nhật đều phải trải qua quá trình kiểm thử, tích hợp, kiểm định nghiêm ngặt và được phê duyệt về mặt pháp lý trước khi phân phối.

<figure><img src="/sdv101/38n6vi6Nx0f34V9aLGpo.webp" alt=""><figcaption></figcaption></figure>

Quá trình phân phối thường được quản lý thông qua một app store hoặc nền tảng tương tự, kết hợp với quản lý chiến dịch (campaign management) để bảo đảm tương thích với các phiên bản xe khác nhau và các yếu tố môi trường. Khi một bản cập nhật đã sẵn sàng, nó đến với xe thông qua cơ chế push hoặc cơ chế pull do người lái hoặc chủ xe khởi tạo. Trên xe, một update agent sẽ xử lý toàn bộ quy trình: thực hiện các kiểm tra về bảo mật và an toàn, xác định môi trường đích (ví dụ một ECU hoặc container cụ thể), rồi áp dụng bản cập nhật qua các bước cài đặt, cấu hình và kiểm định.

## Các hạn chế

Kiến trúc xe truyền thống với hàng chục, thậm chí hàng trăm ECU, thường được kết nối qua các mạng cấp thấp như CAN hoặc LIN, đặt ra những thách thức đáng kể. Các mạng này không đủ năng lực để hỗ trợ cập nhật OTA toàn diện, khiến nhiều ECU bị tách khỏi quy trình cập nhật.&#x20;

<figure><img src="/sdv101/rVn7ds5HaIob1FFxkEf5.webp" alt=""><figcaption></figcaption></figure>

Hệ quả là trong những kiến trúc legacy như vậy, việc cập nhật cho một số ECU nhất định vẫn có thể đòi hỏi triệu hồi thủ công. Hạn chế này nhấn mạnh tầm quan trọng của các kiến trúc central compute và zonal hiện đại, vốn được thiết kế để hỗ trợ đầy đủ năng lực OTA và giải phóng tiềm năng của xe được định nghĩa bằng phần mềm.

## Tương lai của OTA

Những hạn chế của xe thế hệ cũ khiến các chiến dịch cập nhật OTA thường chủ yếu tập trung vào xử lý các vấn đề liên quan đến chất lượng, thay vì tối ưu các feature sẵn có hay giới thiệu những chức năng hoàn toàn mới. Tuy nhiên, tương lai của OTA nằm ở việc cho phép cá biệt hóa và cá nhân hóa xe ở mức độ cao hơn trong suốt vòng đời của xe.

<figure><img src="/sdv101/qRvCz29stPhQlltji1f6.webp" alt=""><figcaption></figcaption></figure>

Sự chuyển dịch này sẽ hỗ trợ không chỉ việc sửa lỗi mà còn cả việc liên tục release các feature mới, các cải tiến và những chức năng đột phá. Việc quản lý độ phức tạp ngày càng tăng của các tổ hợp phần mềm và phần cứng sẽ là mấu chốt, nhằm bảo đảm tích hợp liền mạch và duy trì mức độ tin cậy cao mà ngành ô tô đòi hỏi. Tầm nhìn về những chiếc xe được định nghĩa bằng phần mềm liên tục tiến hóa này phù hợp với các xu hướng chuyển đổi số rộng lớn hơn trong lĩnh vực di chuyển.

## Nghiên cứu điển hình: OTA tại Rivian

Rivian là một ví dụ thuyết phục về tiềm năng của OTA trong xe được định nghĩa bằng phần mềm. Tại ngày hội nhà đầu tư, Rivian cho biết trong hai năm rưỡi trước đó, họ đã giới thiệu thành công khoảng 500 feature mới thông qua hơn 30 chiến dịch OTA. Thành tựu này cho thấy sức mạnh chuyển đổi của OTA trong việc liên tục mang lại giá trị cho khách hàng. Ấn tượng hơn, 96% khách hàng của Rivian đã cài đặt các bản cập nhật này trong vòng hai tuần kể từ khi phát hành, thể hiện mức độ gắn kết và niềm tin cao của khách hàng vào quy trình OTA. Ví dụ của Rivian nhấn mạnh tầm quan trọng của các hệ thống OTA vững chắc trong việc tạo ra những chiếc xe tiến hóa liên tục cùng phần mềm, luôn đi đầu về đổi mới và trải nghiệm người dùng.
