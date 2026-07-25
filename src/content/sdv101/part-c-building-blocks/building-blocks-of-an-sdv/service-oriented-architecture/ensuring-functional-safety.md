---
title: "Bảo đảm an toàn chức năng"
description: "Các biện pháp an toàn cho API mở cửa xe trong kiến trúc SOA: kiểm tra trạng thái xe và camera, kiểm thử theo ISO 26262 và Chaos Monkeys, homologation."
order: 30
part: "C"
depth: 3
origTitle: "Ensuring Functional Safety"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/ensuring-functional-safety"
---

Câu hỏi lớn tiếp theo là: **Liệu mở cửa xe thông qua một API có thực sự an toàn không?** Câu trả lời là **không**, trừ khi có các biện pháp an toàn trọng yếu được đặt đúng chỗ. Trong kiến trúc SDV hướng dịch vụ, an toàn phụ thuộc vào việc triển khai các phép kiểm tra phù hợp bên trong **API điều khiển cửa xe**.

## Bảo đảm an toàn chức năng

Để API điều khiển cửa trở nên an toàn, cần tích hợp sẵn nhiều biện pháp phòng ngừa vào phần triển khai của nó:

1. **Kiểm tra trạng thái chuyển động của xe:** Trước khi khởi động trình tự mở cửa, API phải xác minh rằng xe đã đứng yên hoàn toàn. Mở cửa khi xe đang di chuyển có thể dẫn tới những tình huống nguy hiểm.
2. **Xác minh bằng camera sau:** API cũng phải kiểm tra **luồng hình ảnh từ camera sau** để phát hiện xe hoặc vật cản đang tiến lại trên đường đi của xe. Nếu phát hiện bất kỳ nguy hiểm nào, quá trình mở cửa phải bị chặn lại.
3. **Phát hiện vật cản bằng camera bên hông:** Sử dụng **camera bên hông**, hệ thống phải bảo đảm cửa xe có thể mở ra mà không va vào vật cản như tường, cột, hay một xe khác đang đỗ gần đó.
4. **Tuân thủ quy định:** Tất cả các phép kiểm tra này phải tuân thủ những tiêu chuẩn an toàn ô tô liên quan, chẳng hạn **ISO 26262** và các quy định **UNECE** áp dụng được, bảo đảm quá trình mở cửa tuân theo thông lệ tốt nhất của ngành.

Sơ đồ dưới đây cho thấy điều này được triển khai như thế nào trong kiến trúc SOA của chúng ta.

<figure><img src="/sdv101/alo480irjpPjQUYtOAe0.webp" alt=""><figcaption></figcaption></figure>

## Kiểm thử: bảo đảm an toàn và khả năng chống chịu

Cuối cùng, chúng ta quay lại chủ đề then chốt là **kiểm thử** trong bối cảnh **Software-Defined Vehicles (SDV)**. Hãy nhớ lại phần thảo luận trước đó về việc kiểm thử các hệ thống liên kết lỏng và **Simeon Army với Chaos Monkeys**. Với **API mở cửa** có nhiều tình huống sử dụng, việc kiểm thử cần cân bằng giữa các phương pháp có cấu trúc, mang tính tất định của **ISO 26262** với những phương pháp hỗn loạn hơn, thiên về khả năng chống chịu, lấy cảm hứng từ **Chaos Monkeys**.

### Kiểm thử có cấu trúc: cách tiếp cận ISO 26262

ISO 26262 yêu cầu **kiểm thử có cấu trúc chặt chẽ và mang tính tất định** nhằm bảo đảm **an toàn chức năng**, **độ tin cậy** và **tuân thủ quy định**. Cách tiếp cận này đòi hỏi tài liệu đầy đủ, khả năng tái lập nghiêm ngặt và một quy trình chứng nhận tốn nhiều thời gian. Các kỹ thuật kiểm thử thiết yếu bao gồm:

* **Kiểm thử tiêm lỗi (Fault Injection Testing):** Mô phỏng các lỗi phần cứng như hỏng cảm biến hoặc kết nối ECU chập chờn.
* **Tiêm lỗi phần mềm:** Đưa vào các sự cố như tràn bộ nhớ hoặc dữ liệu hỏng trong các giao thức truyền thông (ví dụ bus CAN).
* **Mô phỏng lỗi nguồn điện:** Kiểm thử độ ổn định nguồn bằng cách mô phỏng dao động điện áp hoặc gián đoạn cấp nguồn.

### Kiểm thử khả năng chống chịu: cách tiếp cận Chaos Monkeys

Để đánh giá hệ thống hoạt động ra sao trong những điều kiện bất ngờ, **kiểm thử khả năng chống chịu** đi theo một hướng hỗn loạn và thăm dò hơn:

* **Tiêm lỗi ở quy mô lớn:** Đưa vào các sự cố bất ngờ trên diện rộng, bao gồm mất kết nối mạng hoặc cấu hình sai hệ thống.
* **Kiểm thử biên:** Đẩy hệ thống tới giới hạn vận hành. Với API mở cửa, điều này có thể là mô phỏng 10.000 yêu cầu mở–đóng liên tiếp mỗi phút.
* **Kiểm thử dải tín hiệu:** Xác minh phản ứng của hệ thống khi giá trị đầu vào vượt quá đặc tả thiết kế, chẳng hạn áp suất phanh cực lớn hoặc tín hiệu đánh lái bất thường.

<figure><img src="/sdv101/oVBmo2zdIaWnwY1tIwaO.webp" alt=""><figcaption></figcaption></figure>

### Thẩm định hệ thống toàn diện

Cuối cùng, **thẩm định hệ thống (system validation)** bảo đảm rằng mọi thành phần liên kết với nhau — phần cứng, phần mềm và môi trường bên ngoài — vận hành trơn tru. Điều này bao gồm kiểm thử đầu-cuối về:

* **Tính đúng đắn chức năng:** Bảo đảm hệ thống hoạt động đúng như thiết kế trong các điều kiện dự kiến.
* **Kiểm thử tích hợp:** Xác nhận rằng các hệ thống con tương tác chính xác với nhau.
* **Mô phỏng môi trường:** Kiểm thử phản ứng của hệ thống trước các yếu tố bên ngoài như thời tiết, điều kiện mặt đường và hành vi của người lái.

Bằng cách kết hợp những cách tiếp cận kiểm thử đa dạng này, các nhà phát triển SDV có thể xây dựng hệ thống vững chắc, an toàn và có khả năng chống chịu, vừa tuân thủ các tiêu chuẩn ô tô vừa sẵn sàng cho những thách thức trong thực tế.

## Homologation cho API mở cửa

Bảo đảm **an toàn chức năng** cho mọi API được đưa vào một **Software-Defined Vehicle (SDV)** là điều then chốt. Yêu cầu này gắn trực tiếp với quy trình **homologation** (phê duyệt kiểu loại), trong đó các API phải tuân thủ những quy định kỹ thuật liên quan trước khi được triển khai.

### Vì sao homologation lại quan trọng

Homologation bảo đảm rằng **API mở cửa** đáp ứng các **tiêu chuẩn pháp lý** và **tiêu chuẩn an toàn** do các cơ quan quốc tế và khu vực quy định. Việc tuân thủ là bắt buộc để chứng nhận rằng xe an toàn, bảo mật và hợp pháp khi lưu hành ở các thị trường khác nhau.

### Cách thực hiện

Để đạt được homologation cho API mở cửa, nhà phát triển có thể truy vấn một **cơ sở dữ liệu quy định** như **Certivity**, nơi cung cấp các quy định kỹ thuật chi tiết liên quan tới hệ thống trên xe. Với các API liên quan tới cửa xe, một số tiêu chuẩn chính được áp dụng, bao gồm:

* **UNR 11**: Quy định về chốt và bản lề cửa, bảo đảm tính toàn vẹn cơ khí và khả năng đóng chặt.
* **UNR 97**: Tập trung vào hệ thống báo động trên xe, bảo đảm khả năng chống trộm và truy cập xe an toàn.

Bằng cách tham chiếu các tiêu chuẩn này, đội phát triển có thể điều chỉnh phần triển khai của API mở cửa cho phù hợp với quy định ngành, bảo đảm **tuân thủ kỹ thuật** ngay từ sớm trong quá trình phát triển. Cách tiếp cận này giảm **rủi ro pháp lý**, hỗ trợ **homologation liên tục** và đẩy nhanh việc chứng nhận sản phẩm cho các thị trường toàn cầu.

Phần dưới đây trình bày một ví dụ về nguyên mẫu kết hợp COVESA VSS trong trình duyệt VSS của digital.auto với Certivity RegDB.

<figure><img src="/sdv101/dEOO3BIWTjzrwmVY2rBh.webp" alt=""><figcaption></figcaption></figure>

## Kết luận

Bằng cách tích hợp những cơ chế an toàn này vào API, chúng ta bảo đảm rằng quá trình mở cửa trở nên an toàn, tuân thủ quy định và chống lỗi. Điều này cho thấy **an toàn chức năng** trong **kiến trúc SDV** không chỉ là một tính năng kỹ thuật mà là một yêu cầu hệ thống then chốt, hỗ trợ cho an toàn, độ tin cậy và sự tuân thủ quy định.
