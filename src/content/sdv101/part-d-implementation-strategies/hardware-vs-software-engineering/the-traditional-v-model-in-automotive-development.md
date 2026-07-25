---
title: "Mô hình chữ V truyền thống trong phát triển ô tô"
description: "Mô hình chữ V mở rộng cho phần mềm, E/E và cơ khí: các giai đoạn thiết kế và kiểm thử, vai trò của MBSE và Automotive SPICE, cùng ưu nhược điểm của mô hình."
order: 39
part: "D"
depth: 2
origTitle: "The Traditional V-Model in Automotive Development"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/hardware-vs-software-engineering/the-traditional-v-model-in-automotive-development"
---

Mô hình chữ V (V-Model) từ lâu đã là khung chuẩn cho phát triển ô tô, dẫn dắt quá trình thiết kế, xác minh (verification) và kiểm định (validation) các hệ thống trên xe. Mô hình này nhấn mạnh một quy trình tuần tự nhưng liên kết chặt chẽ, trong đó mỗi giai đoạn thiết kế đều có một giai đoạn kiểm thử và kiểm định tương ứng.

<figure><img src="/sdv101/ZBlX7ySzXmO89npYsFJO.webp" alt=""><figcaption></figcaption></figure>

Sơ đồ trên minh họa một phiên bản mở rộng của mô hình chữ V, tích hợp không chỉ phát triển phần mềm mà còn cả phát triển hệ thống điện/điện tử (E/E) và hệ thống cơ khí, tạo nên một bức tranh thống nhất về kỹ thuật ô tô hiện đại.

Ở nhánh bên trái của chữ V là các giai đoạn thiết kế:

1. **Chiến lược, hình thành ý tưởng và concept**: Đây là nơi xác định tầm nhìn ban đầu, chiến lược và các yêu cầu ở mức cao cho xe hoặc hệ thống.
2. **Thiết kế hệ thống tổng thể**: Kiến trúc hệ thống được xây dựng, mô tả chi tiết các đặc tả chức năng và kỹ thuật.
3. **Thuộc tính và feature của xe**: Các feature chủ chốt của xe như hiệu năng, an toàn và tiện nghi được xác định.
4. **Thiết kế hệ thống con**: Các hệ thống con cụ thể như powertrain, hệ thống phanh hay hệ thống infotainment được phát triển cùng các thành phần phần cứng và phần mềm của chúng.

Nằm giữa các giai đoạn bên trái và bên phải là **Verification và Validation**, kết nối khâu thiết kế với các giai đoạn tích hợp và kiểm thử ở nhánh bên phải của chữ V.&#x20;

Các giai đoạn ở nhánh bên phải bao gồm:

1. **Tích hợp và kiểm thử hệ thống con**: Các hệ thống con được kết hợp và kiểm thử về chức năng, hiệu năng và khả năng tương thích.
2. **Tích hợp và kiểm thử chức năng cấp xe**: Tích hợp toàn bộ các hệ thống của xe để bảo đảm chúng phối hợp với nhau đúng như thiết kế.
3. **Tích hợp và kiểm thử sản phẩm tổng thể**: Kiểm định toàn hệ thống, bảo đảm sản phẩm cuối cùng đáp ứng mọi yêu cầu pháp lý và hiệu năng.
4. **Sản xuất (SOP)**: Standard Operating Procedure (SOP) đánh dấu thời điểm bắt đầu sản xuất.
5. **Sử dụng và dịch vụ**: Hỗ trợ sau sản xuất, bao gồm bảo dưỡng và cập nhật, bảo đảm một vòng đời thành công.

Ngoài ra, sơ đồ còn làm nổi bật **homologation** (chứng nhận hợp quy) để tuân thủ quy định và **giao hàng từ nhiều nhà cung cấp**, phản ánh bản chất cộng tác của phát triển ô tô. Việc lập kế hoạch chuỗi cung ứng và sản xuất được tích hợp từ sớm, bảo đảm sự đồng bộ giữa thiết kế, kiểm thử và sản xuất.

## Model-Based Systems Engineering (MBSE)

Model-Based Systems Engineering (MBSE — kỹ thuật hệ thống dựa trên mô hình) là một phương pháp luận hỗ trợ then chốt bên trong mô hình chữ V. Nó thay thế lối phát triển dựa trên tài liệu truyền thống bằng các quy trình dựa trên mô hình, sử dụng mô hình hệ thống để nắm bắt yêu cầu, thiết kế và các chi tiết xác minh. Trong MBSE, một mô hình trung tâm đóng vai trò “nguồn chân lý duy nhất” (single source of truth), cho phép cộng tác tốt hơn giữa các nhóm, công cụ và lĩnh vực chuyên môn. Cách tiếp cận này nâng cao khả năng truy vết, giảm sai sót và bảo đảm tính nhất quán, đặc biệt khi phải xử lý độ phức tạp của hệ thống E/E và xe được định nghĩa bằng phần mềm.

Nhờ áp dụng MBSE, kỹ sư có thể mô phỏng, kiểm định và tối ưu thiết kế ngay từ sớm trong quá trình phát triển, hỗ trợ khái niệm "Shift Left" và giảm các thay đổi ở giai đoạn muộn — vốn tốn kém và mất thời gian.

## Automotive SPICE (A-SPICE)

Automotive SPICE (A-SPICE) là một mô hình đánh giá quy trình được sử dụng rộng rãi trong ngành ô tô để đánh giá và cải thiện các quy trình phát triển phần mềm và hệ thống. Nó cung cấp một khung có cấu trúc để quản lý chất lượng và bảo đảm tuân thủ các tiêu chuẩn ô tô khắt khe. A-SPICE định nghĩa các quy trình trải dài toàn bộ vòng đời phát triển, bao gồm quản lý yêu cầu, thiết kế, tích hợp và kiểm thử, khiến nó trở thành một thành phần thiết yếu của mô hình chữ V.

Các OEM và nhà cung cấp sử dụng A-SPICE để bảo đảm quy trình phát triển của mình đạt mức độ trưởng thành và độ tin cậy cao — điều tối quan trọng khi cung cấp các hệ thống an toàn tới hạn như lái tự động và ADAS (Advanced Driver Assistance Systems).

## Ưu và nhược điểm của mô hình chữ V

Mô hình chữ V mang lại một số lợi thế:

* **Cấu trúc rõ ràng và khả năng truy vết**: Mỗi giai đoạn thiết kế đều có một giai đoạn kiểm thử tương ứng, bảo đảm sự đồng bộ và phát hiện sớm vấn đề.
* **Tập trung mạnh vào kiểm định**: Việc nhấn mạnh verification và validation giúp đáp ứng các yêu cầu chất lượng và pháp lý.
* **Cách tiếp cận có hệ thống**: Mô hình hỗ trợ phát triển phức tạp, đa lĩnh vực trên cả phần mềm, E/E và hệ thống cơ khí.

Tuy nhiên, mô hình chữ V cũng có những hạn chế:

* **Cứng nhắc**: Bản chất tuần tự khiến nó kém thích ứng với thay đổi, đặc biệt trong các môi trường phát triển agile và lặp.
* **Rủi ro tích hợp muộn**: Vấn đề có thể chỉ lộ ra trong các giai đoạn tích hợp và kiểm thử, làm tăng chi phí sửa chữa ở giai đoạn muộn.
* **Hỗ trợ hạn chế cho cải tiến liên tục**: Cấu trúc của mô hình chữ V tự thân không hỗ trợ các quy trình lặp và agile, vốn ngày càng quan trọng trong kỷ nguyên xe được định nghĩa bằng phần mềm.
* **Hỗ trợ hạn chế cho Multi-Speed Development:** Cấu trúc của mô hình chữ V cũng không tính đến việc các luồng giá trị (value stream) khác nhau cho ra kết quả ở những tốc độ khác nhau.&#x20;

Để giải quyết những thách thức này, mô hình chữ V thường được kết hợp với các thực hành hiện đại như MBSE, A-SPICE và continuous integration nhằm tạo ra một cách tiếp cận phát triển linh hoạt hơn, ưu tiên số hóa.
