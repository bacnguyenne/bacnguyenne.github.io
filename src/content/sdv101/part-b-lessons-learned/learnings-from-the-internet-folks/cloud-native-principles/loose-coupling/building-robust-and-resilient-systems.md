---
title: "Xây dựng hệ thống bền bỉ và có khả năng chống chịu"
description: "Chaos Monkey của Netflix và kỹ thuật tiêm lỗi có kiểm soát: các loại sự cố được mô phỏng và lợi ích cho hệ thống phân tán kết nối lỏng."
order: 16
part: "B"
depth: 4
origTitle: "Building Robust and Resilient Systems"
origUrl: "https://www.sdv.guide/sdv101/part-b-lessons-learned/learnings-from-the-internet-folks/cloud-native-principles/loose-coupling/building-robust-and-resilient-systems"
---

Khi Netflix bắt đầu di chuyển các hệ thống phân tán khổng lồ của mình sang một nhà cung cấp dịch vụ cloud, họ đối mặt với thách thức bảo đảm độ tin cậy ở một quy mô chưa từng có. Để chuẩn bị cho những sự cố phần cứng và dịch vụ tất yếu sẽ xảy ra, Netflix đã phát triển **Chaos Monkey**, một công cụ được thiết kế để ngẫu nhiên phá vỡ các service ngay trong môi trường production. Bằng cách mô phỏng các sự cố thực tế, Chaos Monkey buộc Netflix phải thiết kế theo hướng **loose coupling** (kết nối lỏng), cho phép từng thành phần riêng lẻ có thể hỏng mà không kéo đổ cả hệ thống.

<figure><img src="/sdv101/roEuTbaiyIPRDoZZ1BHG.webp" alt=""><figcaption></figcaption></figure>

{% embed url="<https://sharpend.io/chaos-monkey-for-fun-and-profit/>" %}

### Mô phỏng sự cố để tăng khả năng chống chịu

Trong bối cảnh số hoá kết nối chằng chịt ngày nay, việc bảo đảm **khả năng chống chịu (resilience)** và **độ bền bỉ (robustness)** là điều thiết yếu để duy trì việc cung cấp dịch vụ liền mạch. Khi hỏng hóc phần cứng khó lường, sự cố mạng và các vụ xâm phạm bảo mật là điều không thể tránh khỏi, hệ thống phải được thiết kế để thích nghi, phục hồi và tiếp tục vận hành bất chấp gián đoạn.

Cách tiếp cận chủ động của Netflix là cố ý tiêm lỗi vào môi trường production hoặc pre-production. Chiến lược này bảo đảm hệ thống của họ có thể xử lý các gián đoạn một cách nhẹ nhàng và tiếp tục hoạt động. Dưới đây là cách những sự cố mô phỏng đó được đưa vào:

Cách tiếp cận chủ động của Netflix là cố ý tiêm lỗi vào môi trường production hoặc pre-production. Chiến lược này bảo đảm hệ thống của họ có thể xử lý các gián đoạn một cách nhẹ nhàng và tiếp tục hoạt động. Dưới đây là cách những sự cố mô phỏng đó được đưa vào:

* **Sự cố server**: Mô phỏng tình huống server không khả dụng hoặc không phản hồi, qua đó kiểm tra các service phụ thuộc xử lý gián đoạn ra sao và cơ chế failover có hoạt động đúng như thiết kế hay không.
* **Sự cố microservice**: Gây lỗi dịch vụ bằng cách làm cho các microservice trọng yếu không khả dụng hoặc giới hạn khả năng phản hồi của API, nhằm bảo đảm giao tiếp giữa các service có thể thích ứng với những gián đoạn cục bộ.
* **Gián đoạn mạng**: Đưa vào độ trễ mạng nhân tạo, mất gói tin hoặc kết nối chậm để kiểm tra mức độ chịu đựng của nền tảng trước điều kiện mạng suy giảm.
* **Suy giảm dịch vụ**: Cố tình làm quá tải các service để xem chúng xử lý lưu lượng cao hoặc năng lực bị thu hẹp một cách nhẹ nhàng đến đâu, qua đó phát lộ các điểm nghẽn tiềm ẩn.
* **Sự cố cấp vùng**: Đưa toàn bộ một cloud region ra khỏi hoạt động để mô phỏng gián đoạn quy mô lớn, kiểm tra khả năng dịch chuyển khối lượng công việc và duy trì tính sẵn sàng của dịch vụ.
* **Lỗ hổng bảo mật**: Mô phỏng các cuộc tấn công và rò rỉ dữ liệu để đánh giá cách các service phát hiện và phản ứng trước mối đe doạ bảo mật.
* **Hỏng trạng thái**: Tiêm dữ liệu không hợp lệ hoặc bị hỏng vào các service để kiểm tra xem chúng có giữ được tính toàn vẹn dữ liệu và phục hồi êm thấm hay không.

### Những lợi ích chính của việc tiêm lỗi

Nhờ áp dụng việc tiêm lỗi có kiểm soát, Netflix đã đạt được một số lợi thế then chốt:

* **Nâng cao khả năng chống chịu của hệ thống**: Hệ thống có thể chịu đựng các sự cố bất ngờ và tiếp tục vận hành.
* **Phục hồi nhanh hơn**: Việc phát hiện và xử lý sự cố nhanh hơn giúp giảm thời gian ngừng hoạt động.
* **Kỹ sư tự tin hơn**: Các lập trình viên và kỹ sư tin tưởng vào service của mình hơn, vì biết chúng đã được kiểm thử trong điều kiện sự cố như ngoài đời thực.

Mô phỏng sự cố một cách chủ động đã được chứng minh là một thực hành mang tính cách mạng, giúp bảo đảm các hệ thống phân tán kết nối lỏng luôn bền bỉ, có khả năng mở rộng và đáng tin cậy trong mọi hoàn cảnh.
