---
title: "Kiểm chứng chi tiết: SDV và mô phỏng"
description: "Vai trò của mô phỏng trong phát triển SDV: các lĩnh vực mô phỏng, phân tách bắc/nam VHAL, ví dụ Range Extension và chiến lược MIL, SIL, HIL."
order: 46
part: "D"
depth: 3
origTitle: "Detailed Validation: SDVs and Simulation"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/simulation-and-digital-prototyping/detailed-validation-sdvs-and-simulation"
---

Mô phỏng từ lâu đã là nền tảng của hoạt động phát triển xe, hỗ trợ mọi thứ từ mô phỏng vật lý cho thử nghiệm va chạm và khí động học đến quản lý năng lượng, mô hình hóa cảm biến và kiểm chứng hệ thống điều khiển. Những công cụ này là thiết yếu để nâng cao hiệu quả, an toàn và hiệu năng trong mọi giai đoạn thiết kế và thử nghiệm.

<figure><img src="/sdv101/VwPq1RjtLM91QhB9YqjS.webp" alt=""><figcaption></figcaption></figure>

Tuy nhiên, các hệ thống mô phỏng xe truyền thống rất phức tạp, đồ sộ và tốn nhiều thời gian để xây dựng. Để giải quyết thách thức này trong kỷ nguyên SDV, việc mô-đun hóa, phân lớp kiến trúc và cách tiếp cận *shift north* — với sự hỗ trợ của Vehicle Hardware Abstraction Layer (VHAL — lớp trừu tượng hóa phần cứng xe) — đóng vai trò then chốt. Nhờ đó, ta có được các môi trường mô phỏng nhanh hơn, linh hoạt hơn, tách rời phát triển phần cứng khỏi phát triển phần mềm, phù hợp với các chiến lược SDV hiện đại.

### Các lĩnh vực mô phỏng SDV

Mô phỏng giữ vai trò then chốt trong phát triển xe hiện đại, cho phép kiểm thử ảo toàn diện trên nhiều lĩnh vực nhằm giảm chi phí và thời gian. Các mảng chính bao gồm **Động lực học và hiệu năng xe (Vehicle Dynamics and Performance)**, nơi khả năng vận hành, phanh và khí động học được tối ưu, và **An toàn và khả năng chịu va chạm (Safety and Crashworthiness)**, kiểm thử các kịch bản va chạm để kiểm chứng hệ thống bảo vệ người ngồi trên xe. **Kiểm thử môi trường (Environmental Testing)** đánh giá hiệu năng xe trong các điều kiện thời tiết, địa hình và độ cao khác nhau, còn **Điện khí hóa và quản lý năng lượng (Electrification and Energy Management)** mô hình hóa quãng đường pin, quá trình sạc và mức tiêu thụ năng lượng.

Trong **ADAS và lái tự động**, mô phỏng kiểm chứng cảm biến, thuật toán ra quyết định và hành vi của xe. **Hệ thống E/E và phần mềm** hưởng lợi từ kiểm thử Hardware-in-the-Loop (HIL), Software-in-the-Loop (SIL) và Model-in-the-Loop (MIL) để bảo đảm tích hợp liền mạch. Computational Fluid Dynamics (CFD) nâng cao chất lượng của **Khí động học và quản lý nhiệt (Aerodynamics and Thermal Management)**, trong khi mô phỏng **Yếu tố con người và UX (Human Factors and UX)** tập trung vào công thái học, giao diện HMI và đặc tính NVH trong cabin. Ngoài ra, kiểm thử **Tuân thủ quy định (Regulatory Compliance)** trên môi trường ảo bảo đảm đáp ứng các tiêu chuẩn về khí thải, an toàn và chứng nhận kiểu loại.

Mô phỏng cũng phục vụ **Kiểm thử mô-đun và biến thể (Modular and Variant Testing)** nhằm bảo đảm tính linh hoạt của nền tảng và kiểm chứng cấu hình, cũng như **Phân tích tính bền vững và vòng đời (Sustainability and Lifecycle Analysis)** để mô hình hóa tác động môi trường. Cuối cùng, các quy trình **Sản xuất và lắp ráp (Manufacturing and Assembly)** được tối ưu trên môi trường ảo, cải thiện luồng công việc trong nhà máy và giảm thiểu sự cố sản xuất. Cùng nhau, những nỗ lực mô phỏng này tạo nên một quy trình phát triển vững chắc, hiệu quả và linh hoạt, hỗ trợ chiến lược "Shift Left" trong kỹ thuật ô tô.

### SDV và mô phỏng

Trong Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm), mô phỏng chủ yếu diễn ra ở **phía nam của Vehicle Hardware Abstraction Layer (VHAL)**, nơi nó tập trung vào các hệ thống vật lý và những thành phần trọng yếu về an toàn, tuân thủ ASIL. Các mô phỏng này tái tạo hành vi thực tế của xe cho những mảng như động lực học xe, quản lý pin và điều kiện môi trường, bảo đảm kết quả có độ trung thực cao, gần với thực tế vật lý.

Ngược lại, hoạt động phát triển ở **phía bắc của VHAL** đi theo cách tiếp cận **code-first**. Các thuật toán ở đây, thường được xếp loại QM hoặc ASIL thấp, được phát triển lặp bằng các phương pháp agile, MVP và cải tiến liên tục. Sự phân tách này cho phép đổi mới nhanh ở phía bắc VHAL trong khi vẫn duy trì tính ổn định và độ chính xác ở phía nam, thể hiện rõ lợi ích của việc mô-đun hóa và phát triển theo lớp.

Cách tiếp cận mô-đun này cho phép **tích hợp xuyên lĩnh vực (cross-domain integration)**, ngay cả khi các lĩnh vực khác nhau ở phía nam VHAL dựa trên những nền tảng mô phỏng riêng biệt, bảo đảm việc kiểm chứng đa lĩnh vực gắn kết đồng thời đẩy nhanh tốc độ đổi mới.

### Ví dụ: Mô phỏng cho use case SDV Range Extension

Ở bước tiếp theo của use case *Range Extension* (mở rộng quãng đường), dữ liệu mock-up cơ bản ở phía nam Vehicle Hardware Abstraction Layer (VHAL) được thay bằng một mô phỏng xe thực tế hơn. Bước tiến này giúp hành vi của xe bên dưới VHAL chính xác hơn nhiều, nhờ đó cho kết quả kiểm thử và kiểm chứng tốt hơn đối với thuật toán mở rộng quãng đường ở phía bắc VHAL.&#x20;

<figure><img src="/sdv101/JGfhji1agLnGZSGzsNMN.webp" alt=""><figcaption></figcaption></figure>

Điều quan trọng là thay đổi này không ảnh hưởng đến bản thân thuật toán, vì thuật toán tương tác với vehicle API nằm phía trên VHAL. Đây chính là minh chứng cho lợi ích của *loose coupling* (gắn kết lỏng) — cho phép cải tiến ở phía nam VHAL mà không tác động đến việc phát triển ở phía bắc.

### Chiến lược kiểm thử dựa trên mô phỏng

Để hiểu sâu hơn về các phương pháp mô phỏng trong phát triển SDV, chúng ta sẽ tìm hiểu các cách tiếp cận Model-in-the-Loop (MIL), Software-in-the-Loop (SIL) và Hardware-in-the-Loop (HIL), làm rõ vai trò, lợi ích và tầm quan trọng của chúng trong việc đạt được hoạt động kiểm thử hiệu quả và đáng tin cậy qua các giai đoạn khác nhau của chu trình phát triển.

<figure><img src="/sdv101/0RFQAOQQHZB0TftsrkM8.webp" alt=""><figcaption></figcaption></figure>

Sơ đồ minh họa ba cách tiếp cận mô phỏng chủ chốt trong bối cảnh Software-Defined Vehicle (SDV): Model-in-the-Loop (MIL), Software-in-the-Loop (SIL) và Hardware-in-the-Loop (HIL).

* **MIL**: Các đầu vào mô phỏng được kiểm thử với các mô hình toán học hoặc mô hình chức năng. Cách này cho phép kiểm thử sớm các thuật toán hoặc hành vi hệ thống trong môi trường ảo.
* **SIL**: Kiểm chứng các thành phần phần mềm bằng cách mô phỏng hoạt động của chúng với các đầu vào và đầu ra. Nhờ đó bảo đảm phần mềm hoạt động đúng như thiết kế trước khi tích hợp.
* **HIL**: Kết hợp phần cứng thật với môi trường mô phỏng để kiểm thử các thành phần vật lý trong điều kiện sát thực tế.

Những "vòng lặp" mô phỏng này cho phép kiểm thử lặp, đem lại phản hồi nhanh đồng thời giảm rủi ro và chi phí. Chúng cũng cho phép tích hợp xuyên lĩnh vực, bảo đảm các hệ thống tương tác liền mạch với nhau, qua đó hỗ trợ cách tiếp cận shift-left trong phát triển.
