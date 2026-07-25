---
title: "Kiến trúc E/E ngày nay"
description: "Kiến trúc E/E hiện tại với hàng chục đến hàng trăm ECU, bó dây phức tạp, trao đổi thông điệp CAN, nhược điểm của gắn kết chặt và hệ quả tổ chức."
order: 20
part: "C"
depth: 2
origTitle: "Today\\`s E/E Architectures"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/foundation-e-e-architecture/today-s-e-e-architectures"
---

Hiện nay, trên hầu hết các xe hiện đại, kiến trúc Electrical/Electronic (E/E — điện/điện tử) có số lượng rất lớn các ECU chuyên biệt cao cùng những bó dây điện (wiring harness) cực kỳ phức tạp.&#x20;

<figure><img src="/sdv101/pLxeYnomXYy5Xvp8M8jm.webp" alt=""><figcaption></figcaption></figure>

Ví dụ, xe cỡ nhỏ ngày nay có thể chứa tới 70 ECU, còn xe hạng sang có thể lên đến 150 ECU. Tương tự, bó dây điện trên xe hạng sang có thể dài tới 5 kilômét và nặng tới 30 kilôgam.

## Thách thức trong các kiến trúc E/E ngày nay

Số lượng ECU lớn và độ phức tạp của bó dây điện đặt ra nhiều thách thức:

* **Độ phức tạp kỹ thuật**: Việc quản lý những hệ thống rắc rối như vậy ngày càng khó khăn, đặc biệt khi phải phối hợp nhiều bên liên quan, nhiều đội và nhiều nhà cung cấp.
* **Khó khăn khi kiểm thử**: Chính số lượng khổng lồ các thành phần và kết nối khiến việc kiểm thử toàn diện trở thành một thách thức lớn.
* **Khối lượng**: Trọng lượng của bó dây điện làm giảm hiệu quả tổng thể của xe.
* **Độ phức tạp trong sản xuất**: Việc chế tạo và kiểm thử những chiếc xe với kiến trúc cầu kỳ như vậy làm quy trình sản xuất thêm nhiều tầng khó khăn.
* **Bảo trì và sửa chữa**: Việc chẩn đoán và khắc phục sự cố trong các hệ thống gắn kết chặt chẽ này ngày càng trở nên phức tạp.

<figure><img src="/sdv101/DVCiQOxY8kZen1nJbbyM.webp" alt=""><figcaption></figcaption></figure>

## Trao đổi thông điệp trong kiến trúc E/E

Xe hiện đại có hàng chục ECU trao đổi hàng nghìn thông điệp, thường thông qua giao thức CAN. Ví dụ:

* **Điều khiển động cơ và chẩn đoán**: Bộ điều khiển động cơ chia sẻ dữ liệu tốc độ vòng tua với ECU hộp số để tối ưu việc chuyển số, và với bảng đồng hồ để hiển thị.
* **Ví dụ ASIL**: Hệ thống chống bó cứng phanh sử dụng dữ liệu từ các cảm biến tốc độ bánh xe.
* **Ví dụ QM**: Các cảm biến điều hòa thu thập dữ liệu khoang cabin và chia sẻ với ECU điều hòa không khí.

Trên một chiếc xe điển hình, có thể tồn tại từ 250 đến 2.500 loại thông điệp CAN khác nhau, với 500 đến 5.000 thông điệp được trao đổi mỗi giây khi xe đang hoạt động.

## Kiến trúc gắn kết chặt và các nhược điểm

Hệ thống bus CAN tạo ra một kiến trúc hệ thống vốn dĩ gắn kết chặt (tightly coupled), kéo theo một số giới hạn kỹ thuật:

1. **Định danh thông điệp trực tiếp**: Các message ID được mã hóa cứng tạo ra sự phụ thuộc trực tiếp giữa bên gửi và bên nhận.
2. **Cấu trúc mạng cố định**: Cấu trúc bus dùng chung đòi hỏi phải cấu hình lại mỗi khi có thay đổi, càng làm tăng mức độ gắn kết chặt.
3. **Phụ thuộc vào timing và băng thông**: Cơ chế phân xử thông điệp theo mức ưu tiên hạn chế tính linh hoạt và tạo ra những nút thắt cổ chai tiềm tàng.
4. **Khả năng mở rộng hạn chế**: Băng thông thấp và thiết kế tĩnh cản trở việc bổ sung ECU hay feature mới.
5. **Thiếu trừu tượng hóa mô-đun**: Việc không có định địa chỉ động hay các lớp trừu tượng làm giảm tính linh hoạt và cản trở nâng cấp trong tương lai.

<figure><img src="/sdv101/GCVrthRLaOVRLHtykdyk.webp" alt=""><figcaption></figcaption></figure>

## Hệ quả về mặt tổ chức

Sự gắn kết chặt mà CAN và các kiến trúc tương tự áp đặt ở tầng kỹ thuật gây ra những hệ quả nghiêm trọng ở tầng tổ chức. Chi phí gia tăng và thời gian ra mắt kéo dài đối với các feature mới hay cả một thế hệ xe mới đều bắt nguồn từ khối lượng công việc phụ trội cần thiết để đồng bộ nhiều đội và nhiều tổ chức. Những thách thức này khiến đổi mới chậm hơn và tốn kém hơn, cho thấy rõ nhu cầu phải chuyển dịch sang các kiến trúc mô-đun hơn và dễ mở rộng hơn.

<figure><img src="/sdv101/FguAg8itM4wnPaWL396Y.webp" alt=""><figcaption></figcaption></figure>
