---
title: "Agile V-Model, có ai không?"
description: "Tách rời các luồng cơ khí, E/E và số để phát triển đa tốc độ, nhờ HAL/VHAL, Shift North và Shift Left trong kỷ nguyên software-defined vehicles."
order: 40
part: "D"
depth: 2
origTitle: "Agile V-Model, anybody?"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/hardware-vs-software-engineering/agile-v-model-anybody"
---

Trong kỷ nguyên software-defined vehicles, các OEM đang hướng tới việc tách rời các luồng công việc cơ khí, điện/điện tử (E/E) và số (phần mềm và AI) nhằm cho phép **phát triển đa tốc độ (multi-speed development)**. Như thể hiện trong sơ đồ, việc tách rời này bảo đảm mỗi luồng vận hành theo nhịp độ tối ưu của riêng nó. Các **luồng công việc số** phải hỗ trợ chu kỳ lặp nhanh, thường tính bằng giờ hoặc ngày, cho phép cập nhật thường xuyên, cải tiến tính năng và kiểm thử. Ngược lại, các **luồng công việc E/E** đòi hỏi tầm nhìn trung hạn, thường kéo dài vài tuần, để bảo đảm tích hợp và thẩm định hệ thống một cách vững chắc. Cuối cùng, các **luồng công việc cơ khí** theo nhịp phát triển dài hạn tính bằng tháng, bị chi phối bởi việc thử nghiệm vật lý sâu rộng, các yêu cầu an toàn và lịch trình sản xuất.

<figure><img src="/sdv101/G8JUTHf1z6cVT1OmyTK2.webp" alt=""><figcaption></figcaption></figure>

Để đạt được cách tiếp cận đa tốc độ này, các OEM phải thiết lập **các giao diện kỹ thuật và tổ chức được định nghĩa rõ ràng**. Về mặt kỹ thuật, các yếu tố hỗ trợ then chốt bao gồm **liên kết lỏng (loose coupling)** giữa các lớp phát triển, được hỗ trợ bởi **hardware abstraction layers (HAL)** và **vehicle hardware abstraction layers (VHAL)**. Sự trừu tượng hóa này cho phép phần mềm và đổi mới số tiến lên độc lập với những ràng buộc của phần cứng. Khái niệm **"Shift North"** củng cố thêm điều đó, cho phép các chức năng phần mềm không thuộc nhóm an toàn trọng yếu nằm ở các môi trường tính toán cấp cao hơn, nơi có thể thay đổi nhanh chóng mà không ảnh hưởng tới các hệ thống cấp thấp.

Về mặt tổ chức, việc tách rời này đòi hỏi các quy trình làm việc, công cụ và trách nhiệm được xác định rõ giữa các nhóm. Bằng cách tạo ra những giao diện giúp căn chỉnh các ưu tiên phát triển và quy trình kiểm thử, các OEM bảo đảm sự cộng tác liền mạch trong khi vẫn giữ được tính toàn vẹn của các hệ thống vật lý dài hạn lẫn nhịp đổi mới số nhanh chóng.

Ngoài ra, cách tiếp cận này phù hợp với chiến lược **Shift Left**, vốn nhấn mạnh việc thẩm định số ở giai đoạn sớm thông qua mô phỏng, ảo hóa và kiểm thử liên tục. Điều này giảm thiểu các lỗi tốn kém ở giai đoạn muộn và bảo đảm rằng các luồng số, E/E và cơ khí có thể hội tụ một cách hiệu quả trong quá trình tích hợp hệ thống, kiểm chứng và sản xuất.

Rốt cuộc, cách tiếp cận phát triển đa tốc độ, tách rời này mang lại cho các OEM sự linh hoạt để đổi mới nhanh trong không gian số, đồng thời vẫn duy trì độ tin cậy và an toàn của các hệ thống vật lý trên xe.
