---
title: "Kiểm chứng sớm: Tạo prototype SDV trên cloud"
description: "Tạo prototype SDV trên cloud để kiểm chứng ý tưởng sớm theo hướng shift-left, dùng digital.auto playground và ví dụ tối ưu quãng đường xe điện với COVESA VSS."
order: 45
part: "D"
depth: 3
origTitle: "Early Validation: Cloud-based SDV Prototyping"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/simulation-and-digital-prototyping/early-validation-cloud-based-sdv-prototyping"
---

Việc tạo prototype SDV trên cloud mang lại một cách thức nhẹ nhàng và tiết kiệm chi phí để kiểm chứng ý tưởng mới ngay từ giai đoạn đầu của quá trình phát triển. Bằng cách hiện thực hóa prototype trên cloud, các nhà phát triển có thể kiểm thử chức năng với API xe thật trong khi vẫn dùng dữ liệu mock-up hoặc dữ liệu mô phỏng. Cách tiếp cận này cho phép khám phá ý tưởng nhanh chóng và linh hoạt mà không cần thiết lập thử nghiệm vật lý, khiến nó trở thành điểm khởi đầu lý tưởng cho đổi mới sáng tạo.

Một ưu thế then chốt của việc tạo prototype trên cloud là khả năng hỗ trợ hiệu quả cho các chiến lược **shift left**. Nó đẩy nhanh quá trình kiểm chứng nhờ cho phép nhiều bên liên quan — từ đội ngũ sản phẩm cho tới người dùng cuối — tham gia sớm, qua đó tạo sự đồng thuận và thu nhận phản hồi với chi phí tối thiểu. Bằng cách kiểm chứng các giả định và tinh chỉnh yêu cầu trước khi bước vào giai đoạn phát triển nặng nề hơn, các nhóm giảm được rủi ro và nâng cao hiệu quả, bảo đảm rằng ngay từ đầu họ đang xây dựng **đúng sản phẩm**.

Phương pháp này không chỉ hỗ trợ các vòng lặp agile mà còn vạch ra lộ trình rõ ràng để đưa những ý tưởng đã được kiểm chứng sang các giai đoạn kiểm thử vững chắc hơn, qua đó tăng tốc độ và sự tự tin trong vòng đời phát triển xe được định nghĩa bằng phần mềm.

## Tạo prototype trên cloud với digital.auto playground

**Cách tiếp cận tạo prototype SDV trên cloud** được minh họa trong sơ đồ tận dụng **digital.auto playground** miễn phí và mở để hỗ trợ kiểm chứng ở giai đoạn sớm và lặp nhanh các feature của xe. Về bản chất, quy trình này kết nối **phản hồi của các bên liên quan** với **kiến trúc doanh nghiệp**, các yêu cầu và các thành phần (HW+SW), bảo đảm sự nhất quán giữa nỗ lực phát triển và mục tiêu kinh doanh.

<figure><img src="/sdv101/oxlx0GGrn25Bm3DSXsjs.webp" alt=""><figcaption></figcaption></figure>

Playground cho phép tạo ra các **prototype** nhằm kiểm chứng các yêu cầu và epic theo cách agile, lặp đi lặp lại. Các bên liên quan có thể tương tác với những phiên bản đầu của phần mềm hoặc chức năng, đưa ra phản hồi và phản hồi đó quay trở lại chu trình phát triển. Quá trình lặp này bảo đảm tính minh bạch, giúp cộng tác tốt hơn giữa bộ phận kinh doanh, IT và xuyên qua các ranh giới tổ chức.

Những lợi ích chính bao gồm:

1. **Nâng cao tính minh bạch**: Tạo tầm nhìn rõ ràng cho các nhóm ở nhiều khu vực, gắn kết mục tiêu kinh doanh với mục tiêu IT.
2. **Kiểm chứng sớm các thành phần**: Prototype giúp kiểm chứng các quyết định về kiến trúc doanh nghiệp và bảo đảm tính nhất quán.
3. **Xác định yêu cầu về API**: Các phụ thuộc API, đặc biệt với phần cứng và thành phần từ nhà cung cấp bên ngoài, được nhận diện sớm nhằm xử lý vấn đề thời gian chờ kéo dài.
4. **Phát triển agile với MVP**: Khuyến khích bàn giao tăng dần các sản phẩm khả dụng tối thiểu, đồng thời bảo đảm các thành phần vững chắc và đã được kiểm chứng theo nguyên tắc **First Time Right**.

Nhìn chung, cách tiếp cận tạo prototype trên cloud này giảm rủi ro, rút ngắn tiến độ phát triển và gắn kết liền mạch các thành phần phần cứng với phần mềm, qua đó cho phép bàn giao SDV hiệu quả và chất lượng cao.

## Ví dụ

Ví dụ về mở rộng quãng đường di chuyển cho thấy cách sử dụng nền tảng playground của digital.auto để hiện thực hóa một thuật toán SDV tối ưu quãng đường cho xe điện.&#x20;

<figure><img src="/sdv101/smdKSMKVXdbRehfTicDp.webp" alt=""><figcaption></figcaption></figure>

Tận dụng Vehicle Signal Specification (VSS) của COVESA, thuật toán tương tác với các tín hiệu xe dạng mock-up, ban đầu lấy từ một cơ sở dữ liệu thử nghiệm, để minh họa khả năng tiết kiệm quãng đường như tắt bớt các bộ tiêu thụ năng lượng không thiết yếu (ví dụ HVAC hoặc infotainment). Việc tạo prototype trên cloud này giúp kiểm chứng giải pháp một cách hiệu quả trước khi tích hợp phần cứng, phù hợp với triết lý *shift-left* nhằm kiểm thử nhanh hơn, tiết kiệm chi phí hơn và tạo sự đồng thuận giữa nhiều bên liên quan.

Xem chi tiết đầy đủ: [COVESA EV Power Optimization Whitepaper](https://wiki.covesa.global/download/attachments/37093447/2023%20Whitepaper%20EV%20Power%20Optimization%20202310.pdf?version=1\&modificationDate=1697035446299\&api=v2).
