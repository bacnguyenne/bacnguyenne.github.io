---
title: "Các miền SDV và mô hình bàn giao hai tốc độ"
description: "Tổng quan các miền SDV (AD/ADAS, Motion, Energy, Body & Comfort, Vehicle Experience, Infotainment, Value-Added Services) theo phân loại ASIL/QM và mô hình bàn giao hai tốc độ."
order: 7
part: "A"
depth: 1
origTitle: "SDV Domains and Two-Speed Delivery"
origUrl: "https://www.sdv.guide/sdv101/part-a-essentials/sdv-domains-and-two-speed-delivery"
---

## Các miền SDV

Bây giờ chúng ta hãy tìm hiểu các miền (domain) khác nhau của **Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm)**, và cách chúng được hỗ trợ tốt nhất bằng mô hình bàn giao hai tốc độ (Two-Speed Delivery Model). Các miền chính trên xe bao gồm **AD ADAS**, **Motion**, **Energy**, **Body & Comfort** và **Vehicle Experience**, trong đó Vehicle Experience bao trùm cả **Infotainment** và **Value-Added Services**.&#x20;

<figure><img src="/sdv101/utDVorkpEyswGeyMdirE.webp" alt=""><figcaption></figcaption></figure>

Mỗi miền đóng góp những chức năng riêng và mang những mức yêu cầu an toàn khác nhau, được phân loại theo các mức **ASIL** và **QM**.

<figure><img src="/sdv101/Jnb4UR7LFMsYDe3JOZ2z.webp" alt=""><figcaption></figcaption></figure>

## AD/ADAS

Miền **AD/ADAS (Automated Driving / Advanced Driver Assistance Systems — lái tự động / hệ thống hỗ trợ người lái nâng cao)** bao gồm các hệ thống như:

#### Chức năng ASIL:

* **Lane Keeping Assist**: Giữ xe nằm trong ranh giới làn đường.
* **Adaptive Cruise Control**: Duy trì tốc độ và khoảng cách so với các xe khác.
* **Fully Automated Driving**: Khả năng tự lái hoàn toàn, đòi hỏi mức an toàn chức năng rất cao.
* **Electric Power Steering**: Thiết yếu cho việc điều khiển chính xác và bảo đảm an toàn.

#### Chức năng QM hoặc ASIL-A:

* **Camera Display Systems**: Cung cấp cảnh báo trực quan về các xe nằm trong điểm mù. Chúng được xếp mức QM hoặc ASIL-A vì chỉ thông báo cho người lái mà không tự thực hiện hành động can thiệp.
* **Traffic Sign Recognition**: Nhận diện và hiển thị các biển báo như giới hạn tốc độ để người lái nắm được, thường ở mức QM hoặc ASIL-A do tác động tới an toàn là hạn chế.
* **Basic Parking Assist**: Cảnh báo người lái về vật cản ở gần nhưng không can thiệp vào lái hay phanh, nên thuộc mức QM hoặc ASIL-A.

<figure><img src="/sdv101/Vds4KdoDYTzYhbBKBs5q.webp" alt=""><figcaption></figcaption></figure>

## Motion

Miền **Motion** tập trung vào các chức năng cốt lõi về vận hành và điều khiển xe.

#### Chức năng ASIL:

* **Anti-Lock Braking Systems (ABS)**: Ngăn bánh xe bị bó cứng khi phanh.
* **Electronic Stability Control (ESC)**: Duy trì ổn định thân xe trong các thao tác lái.
* **Brake-by-Wire Systems**: Thay thế cơ cấu phanh cơ khí bằng hệ thống điện tử.
* **Electronic Power Steering (EPS)**: Bảo đảm điều khiển lái chính xác.

#### Chức năng QM hoặc ASIL-A:

* **Powertrain Modes**: Các chế độ lái Eco hoặc Sport giúp nâng cao trải nghiệm người dùng mà không ảnh hưởng đến các hệ thống trọng yếu về an toàn.
* **Non-Critical Drivetrain Adjustments**: Phân bổ mô-men xoắn hoặc kiểu chuyển số nhằm cải thiện cảm giác lái.
* **Suspension Settings for Comfort**: Các chế độ điều chỉnh như mềm hoặc cứng giúp cải thiện độ êm ái.
* **Cosmetic Bumpers**: Cung cấp mức bảo vệ nhỏ và giá trị thẩm mỹ, nhưng không trọng yếu về an toàn.

<figure><img src="/sdv101/5TQMKcIxbuAYEsU62NJ7.webp" alt=""><figcaption></figcaption></figure>

## Energy

Miền **Energy** khác biệt đáng kể giữa xe điện, xe hybrid và xe động cơ đốt trong.

#### Chức năng ASIL:

* **Battery Management Systems (BMS)**: Giám sát và điều khiển hiệu năng của pin.
* **High Voltage Distribution Systems**: Bảo đảm phân phối điện an toàn.
* **Thermal Management Systems**: Điều tiết nhiệt độ vận hành.
* **Regenerative Braking**: Thu hồi năng lượng trong quá trình phanh.
* **Onboard Charging Control**: Quản lý quá trình sạc của xe điện.

#### Chức năng QM hoặc ASIL-A:

* **Battery Charge Level Display**: Hiển thị trạng thái mà không ảnh hưởng đến an toàn.
* **Auxiliary Power Management**: Điều khiển các hệ thống điện không trọng yếu.
* **Solar Panel Integration**: Nâng cao hiệu quả năng lượng nhưng không trọng yếu về an toàn.

<figure><img src="/sdv101/sAnzneDjITpqGfERCuM5.webp" alt=""><figcaption></figcaption></figure>

## Body & Comfort

Miền **Body & Comfort** trải rộng từ các tính năng kết cấu tới các tiện nghi, bao gồm cả thành phần trọng yếu và không trọng yếu về an toàn.

#### Chức năng ASIL:

* **Seat Belt Pre-Tensioners**: Siết chặt dây an toàn khi va chạm để bảo vệ người ngồi trên xe.
* **Airbag Systems**: Bung ra để bảo vệ người ngồi trên xe khi xảy ra va chạm.
* **Door Locking Systems**: Duy trì an ninh và an toàn.
* **Active Head Restraints**: Giảm thiểu chấn thương cổ do giật (whiplash).
* **Pedestrian Protection Systems**: Giảm nguy cơ chấn thương khi va chạm.

#### Chức năng QM:

* **HVAC (Heating, Ventilation, and Air Conditioning)**: Duy trì sự thoải mái trong khoang cabin.
* **Power Seat Adjustments**: Tùy chỉnh vị trí ghế ngồi.
* **Sunroof Operations**: Tăng tiện lợi mà không ảnh hưởng đến an toàn.
* **Power Windows and Mirrors**: Nâng cao khả năng sử dụng.

<figure><img src="/sdv101/qmLIGNJy8LBXXmV52h2v.webp" alt=""><figcaption></figcaption></figure>

## Vehicle Experience

Miền **Vehicle Experience** tập trung vào trải nghiệm tổng thể của người dùng, chủ yếu được xếp mức QM.

#### Chức năng QM:

* **Personalized Settings**: Hồ sơ người dùng được cá nhân hóa để tăng sự thoải mái và tiện lợi.
* **Passenger Welcome Sequences**: Các thuật toán điều chỉnh ghế ngồi và mở cửa dựa trên sở thích của người dùng.

Các thuật toán QM này thường tương tác với các hệ thống mức ASIL thông qua những API an toàn. Ví dụ, thuật toán chuỗi chào đón có thể mở cửa xe (chức năng mức ASIL) nhưng bản thân nó vẫn là chức năng không trọng yếu.

<figure><img src="/sdv101/iYHVbTQly4S0r8rYCxm2.webp" alt=""><figcaption></figcaption></figure>

## Infotainment

Miền **Infotainment** nâng cao trải nghiệm lái xe thông qua các tính năng kết nối và giải trí, nhìn chung được xếp mức QM.

#### Chức năng QM:

* **Audio Systems**: Quản lý giải trí âm thanh.
* **Navigation Systems**: Cung cấp dẫn đường và thông tin giao thông theo thời gian thực.
* **Media Controls and Displays**: Cung cấp giao diện thân thiện để điều khiển nội dung đa phương tiện.
* **Smartphone Integration**: Kết nối thiết bị di động với xe.

Các cảnh báo từ hệ thống infotainment (ví dụ nhắc nhở tập trung) chỉ thông báo cho người lái chứ không điều khiển các hệ thống trọng yếu về an toàn, nhờ vậy chúng nằm ngoài phạm vi ASIL.

<figure><img src="/sdv101/ebNrPHUGOvlYrD8WhbCM.webp" alt=""><figcaption></figcaption></figure>

## Value-Added Services

Miền **Value-Added Services** tập trung vào sự tiện lợi và đổi mới, cũng chủ yếu được xếp mức QM.

#### Chức năng QM:

* **Subscription-Based Features**: Các dịch vụ số có thể mở khóa theo thuê bao.
* **Non-Critical Predictive Maintenance**: Đưa ra thông báo chủ động mà không ảnh hưởng đến an toàn.
* **Smart Home Integration**: Kết nối xe với các hệ thống tự động hóa gia đình.
* **E-Commerce and Sustainability Services**: Bổ sung chức năng mà không ảnh hưởng đến an toàn.

<figure><img src="/sdv101/ADFaLWg9Vd1ZF9ihuzTM.webp" alt=""><figcaption></figcaption></figure>

## Các miền SDV: Tóm tắt

Mỗi miền ánh xạ khác nhau vào khung phân loại ASIL và QM:

* **Chủ yếu ASIL**: AD ADAS, Motion, Energy.
* **Chủ yếu QM**: Vehicle Experience, Infotainment, Value-Added Services.
* **Hỗn hợp**: Body & Comfort.

<figure><img src="/sdv101/H07EzVhTpDIEWJtZ5brS.webp" alt=""><figcaption></figcaption></figure>

## Mô hình bàn giao hai tốc độ

Việc triển khai **mô hình bàn giao hai tốc độ** cho Software-Defined Vehicle (SDV) đòi hỏi phải hiểu rõ các mức **QM** và **ASIL** để cân bằng hiệu quả giữa tốc độ đổi mới và việc tuân thủ yêu cầu an toàn. Cách tiếp cận này bảo đảm tích hợp trơn tru và phân bổ nguồn lực hiệu quả, đồng thời đáp ứng được cả các miền trọng yếu lẫn không trọng yếu về an toàn.

<figure><img src="/sdv101/5a3PZl5Ty9V0IpQdt5zI.webp" alt=""><figcaption></figcaption></figure>

### Gắn tốc độ phát triển với yêu cầu an toàn

* **Hệ thống QM**: Cho phép lặp nhanh và phát triển agile cho các tính năng không trọng yếu.
* **Hệ thống ASIL**: Đòi hỏi quy trình kiểm định nghiêm ngặt và chậm hơn để đáp ứng các tiêu chuẩn an toàn chức năng.

### Tối ưu hóa phân bổ nguồn lực

* **Đội agile**: Tập trung vào các miền QM để rút ngắn chu kỳ phát triển.
* **Đội chuyên trách**: Đảm nhận các hệ thống ASIL trọng yếu về an toàn, bảo đảm tuân thủ và độ tin cậy.

### Bảo đảm tích hợp trơn tru

Việc phân biệt rạch ròi giữa mức QM và ASIL giúp tránh xung đột giữa các miền trọng yếu và không trọng yếu về an toàn, nhờ đó:

* Tách bạch rõ ràng các luồng công việc phát triển.
* Hài hòa các tương tác xuyên miền.

### Cân bằng giữa đổi mới và tuân thủ

Khuyến khích phát triển nhanh ở các mảng QM trong khi vẫn duy trì tiêu chuẩn an toàn nghiêm ngặt cho các chức năng mức ASIL. Cách tiếp cận kép này thúc đẩy:

* Đổi mới liên tục.
* Tuân thủ quy định.

### Giảm thiểu rủi ro một cách hiệu quả

Các bản cập nhật nhanh ở miền QM được quản lý cẩn trọng để bảo đảm chúng không làm suy giảm độ tin cậy của các hệ thống ASIL. Điều này giảm thiểu rủi ro trong khi tối đa hóa tính linh hoạt.

Mô hình bàn giao hai tốc độ giúp các nhà phát triển SDV đáp ứng những yêu cầu đa dạng của xe hiện đại, kết hợp sự nhanh nhạy với tính an toàn để thúc đẩy đổi mới mà không phải hy sinh độ tin cậy.

Bằng cách gắn chiến lược phát triển với các yêu cầu đặc thù của từng miền, các OEM có thể tối ưu đồng thời cả trải nghiệm người dùng lẫn an toàn chức năng.
