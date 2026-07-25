---
title: "Bài học từ giới điện thoại thông minh"
description: "Điện thoại thông minh làm hình mẫu cho SDV: API, app store, hardware abstraction layer, cảm biến và cách áp dụng các nguyên lý đó vào ngành ô tô."
order: 17
part: "B"
depth: 1
origTitle: "Learnings from the Smart Phone Folks"
origUrl: "https://www.sdv.guide/sdv101/part-b-lessons-learned/learnings-from-the-smart-phone-folks"
---

Sau khi khai thác các bài học từ internet, giờ chúng ta chuyển sang **điện thoại thông minh**, những thiết bị đã cách mạng hóa công nghệ cá nhân bằng cách tích hợp truyền thông, tính toán và kết nối. Điện thoại thông minh được xây dựng trên nền tảng của internet, cho phép truy cập liền mạch tới thông tin, ứng dụng và dịch vụ ở bất cứ đâu, bất cứ lúc nào. Với giao diện cảm ứng, hệ sinh thái ứng dụng và phần cứng mạnh mẽ, chúng đã thiết lập những chuẩn mực mới về khả năng sử dụng, khả năng mở rộng và đổi mới sáng tạo.

## Cuộc cách mạng điện thoại thông minh

Hãy nhớ lại những thiết bị như Apple Newton, Palm Treo, BlackBerry và Nokia Communicator. Đó là những tiền thân của kỷ nguyên điện thoại thông minh hiện đại. Tuy nhiên, cuộc cách mạng điện thoại thông minh thực sự chỉ bắt đầu vào tháng 1 năm 2007, khi **Steve Jobs công bố iPhone**, làm thay đổi hoàn toàn cách công nghệ và thiết bị cá nhân tương tác với nhau.

Điện thoại thông minh vẫn tiếp tục đóng vai trò hình mẫu tham chiếu cho **Software-Defined Vehicles (SDV — xe được định nghĩa bằng phần mềm)**. Hãy cùng xem các nguyên lý cốt lõi của chúng được áp dụng ra sao.

## API và hệ sinh thái nhà phát triển

Hãy xét một ví dụ đơn giản nhưng giàu tính minh họa từ văn hóa đại chúng: một ứng dụng điện thoại phát ra tiếng roi quất, như trong phim *The Big Bang Theory*. Với vai trò nhà phát triển ứng dụng, bạn không cần hiểu vật lý đằng sau việc đo gia tốc. Bạn chỉ cần truy cập một **API** cung cấp dữ liệu gia tốc. Dựa trên đó, bạn lập trình ứng dụng phát tiếng roi quất khi điện thoại chuyển động đủ nhanh.

<figure><img src="/sdv101/NtF1fDOM2yyBSrM5Yoqw.webp" alt=""><figcaption></figcaption></figure>

Các nhà cung cấp điện thoại thông minh đã đầu tư rất mạnh vào việc xây dựng **API**, **lớp trừu tượng hóa** và **thư viện tái sử dụng được**, cùng với các marketplace như app store. Hạ tầng này cho phép các nhà phát triển tạo ra hàng triệu ứng dụng, sinh ra doanh thu hàng tỷ đô la. API đảm bảo các ứng dụng khác nhau có giao diện và hành vi nhất quán, đồng thời cho phép nhà phát triển bên thứ ba xây dựng những tính năng sáng tạo mà không cần hiểu sâu về phần cứng bên dưới.

## App store và sự gắn kết với nhà phát triển

**App store** cung cấp kênh phân phối tập trung cho ứng dụng. Chúng đảm bảo:

* **Kiểm soát chất lượng** thông qua quy trình duyệt chuẩn hóa.
* **Mô hình kiếm tiền** với mua hàng trong ứng dụng và thuê bao.
* **Gắn kết nhà phát triển** thông qua cổng thông tin, hackathon, cuộc thi và chương trình truy cập sớm.

Các công ty điện thoại thông minh liên tục đầu tư vào những hệ sinh thái này, giúp phát triển nhanh hơn và đổi mới liên tục.

## Trừu tượng hóa phần cứng và khả năng tương thích thiết bị

Điện thoại thông minh sử dụng **hardware abstraction layer (HAL — lớp trừu tượng hóa phần cứng)** để đảm bảo tương thích giữa các thiết bị. Nhờ đó, ứng dụng có thể chạy trên nhiều thiết bị khác nhau và trên cả các thế hệ phần cứng tương lai. Nhà phát triển không phải viết lại mã khi có điện thoại mới ra mắt. Thay vào đó, HAL thích ứng ứng dụng của họ với phần cứng mới, giúp đơn giản hóa việc phát triển và bảo đảm ứng dụng không bị lỗi thời.

## Cảm biến và cơ cấu chấp hành

Điện thoại thông minh hiện đại được trang bị dày đặc cảm biến, chẳng hạn:

* Cảm biến ánh sáng và cảm biến tiệm cận.
* Màn hình cảm ứng và bộ đọc vân tay.
* GPS và các module truyền thông.
* Gia tốc kế, con quay hồi chuyển và từ kế.

Các ứng dụng mặc định chỉ khai thác một phần nhỏ tiềm năng của những cảm biến này, phần còn lại được để dành cho sự sáng tạo của các nhà phát triển. Hệ sinh thái mở này khuyến khích những ứng dụng mới lạ, từ theo dõi thể chất đến thực tế tăng cường.

<figure><img src="/sdv101/WGmiRF7zRgrjRfszPXUs.webp" alt=""><figcaption></figcaption></figure>

## Sử dụng tài nguyên: điện thoại thông minh so với hệ thống ô tô

Điện thoại thông minh và hệ thống ô tô tiếp cận việc quản lý tài nguyên với những ưu tiên khác nhau về căn bản. Điện thoại thông minh nhấn mạnh tính linh hoạt và phần dư năng lực để hỗ trợ ứng dụng của bên thứ ba, tạo điều kiện cho đổi mới liên tục. Ngược lại, hệ thống ô tô tập trung vào việc sử dụng tài nguyên được tối ưu chặt chẽ, nhằm bảo đảm các hoạt động an toàn trọng yếu và độ tin cậy.

### Điện thoại thông minh: động và có thể mở rộng

Điện thoại thông minh được thiết kế với năng lực dư thừa, cho phép nhà phát triển đưa vào các tính năng và ứng dụng mới. Khả năng thích ứng này hỗ trợ nhiều loại tải công việc đa dạng, cập nhật thường xuyên và đổi mới từ bên thứ ba. Việc cấp phát tài nguyên co giãn động theo nhu cầu người dùng, cân bằng giữa hiệu năng và thời lượng pin.

### Hệ thống ô tô: kiểm soát chặt chẽ và hiệu quả

Hệ thống ô tô ưu tiên hiệu quả và tính ổn định, với tài nguyên được cấp phát chính xác cho các tác vụ định trước. Điều này bảo đảm hiệu năng đáng tin cậy cho các chức năng an toàn trọng yếu như phanh và lái. Bản chất được tối ưu cao độ của hệ thống nhúng để lại rất ít dư địa cho chức năng bổ sung hoặc cập nhật sau khi sản xuất.

### Thu hẹp khoảng cách

Bước chuyển sang software-defined vehicles (SDV) nhằm mang tính linh hoạt của điện thoại thông minh vào hệ thống ô tô. Bằng cách áp dụng các lớp trừu tượng hóa phần cứng và kiến trúc có khả năng mở rộng, SDV có thể cho phép quản lý tài nguyên động, thúc đẩy đổi mới trong khi vẫn duy trì an toàn và độ tin cậy

## Bài học cho ngành ô tô

Ngành điện thoại thông minh mang lại những bài học quan trọng cho phát triển ô tô:

* **Thiết kế lấy người dùng làm trung tâm**: Ưu tiên trải nghiệm người dùng và cá nhân hóa.
* **Tích hợp hệ sinh thái**: Xây dựng nền tảng hỗ trợ nhà phát triển bên ngoài.
* **Mô hình doanh thu mới**: Sử dụng app store, thuê bao và tính năng cao cấp.
* **Cách tiếp cận software-first**: Tập trung vào đổi mới do phần mềm dẫn dắt.
* **Cập nhật thường xuyên**: Cho phép cập nhật over-the-air (OTA).
* **Chu kỳ đổi mới nhanh**: Khuyến khích lặp và kiểm thử nhanh.
* **Thấu hiểu dựa trên dữ liệu**: Dùng dữ liệu vận hành để cải tiến liên tục.
* **Hỗ trợ cộng đồng nhà phát triển**: Đầu tư vào gắn kết và tài nguyên.
* **Tư duy nền tảng**: Tạo ra một platform linh hoạt, mở rộng được và an toàn.
* **Khả năng mở rộng toàn cầu và tính liên thông**: Bảo đảm tương thích trong nhiều môi trường khác nhau.
* **Cybersecurity**: Triển khai các tính năng bảo mật vững chắc ngay từ đầu.

## Áp dụng nguyên lý điện thoại thông minh vào SDV

Mô hình điện thoại thông minh gợi mở cách SDV có thể tiến hóa. Các ứng dụng không thuộc nhóm an toàn trọng yếu có thể chạy trên một software stack riêng nằm phía trên **hardware abstraction layer**, được cách ly khỏi các hệ thống trọng yếu như **ADAS**, **quản lý năng lượng** và **điều khiển chuyển động**. Cấu hình này sẽ cho phép phát triển tính năng nhanh chóng, phân phối theo kiểu app store và đổi mới do cộng đồng dẫn dắt.

<figure><img src="/sdv101/hSRquQaxSiQ9UZNP1mfg.webp" alt=""><figcaption></figcaption></figure>

**Cách tiếp cận digital-first** làm nền tảng cho những nguyên lý này, nhấn mạnh **shift-north** (đưa chức năng lên phía trên lớp phần cứng) và **shift-left** (cho phép phát triển và kiểm thử sớm). Chiến lược này hứa hẹn một kỷ nguyên mới của đổi mới trong ngành ô tô, mở ra những khả năng tương tự như cuộc cách mạng điện thoại thông minh.
