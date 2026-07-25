---
title: "Tiến hóa hệ thống tách rời, đa tốc độ"
description: "Kiểm thử tiến hóa độc lập ở phía bắc và phía nam VHAL, từ mô phỏng nhẹ tới HIL, mang lại phát triển nhanh, chi phí thấp và thẩm định vững chắc."
order: 51
part: "D"
depth: 2
origTitle: "De-Coupled, Multi-Speed System Evolution"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/de-coupled-multi-speed-system-evolution"
---

Quay trở lại mục tiêu thiết lập cách tiếp cận shift-left kết hợp với phát triển đa tốc độ, chúng ta vừa xem xét quá trình tiến hóa dọc theo V-Model. Trong bối cảnh này, điều quan trọng cần hiểu là việc kiểm thử tiến hóa một cách độc lập ở phía bắc và phía nam của Vehicle Hardware Abstraction Layer (VHAL — lớp trừu tượng hóa phần cứng xe). Ở phía bắc VHAL, các thuật toán và phần mềm được phát triển và thẩm định mà không phụ thuộc trực tiếp vào phần cứng bên dưới, cho phép tạo nguyên mẫu nhanh và kiểm thử theo vòng lặp. Ứng dụng ở đây không quan tâm chúng đang tương tác với mô phỏng nhẹ, ECU ảo hay phần cứng thử nghiệm thực, nhờ đó hỗ trợ cải tiến liên tục theo hướng agile.

<figure><img src="/sdv101/qpgHICPGkBdLJKI1Ss2y.webp" alt=""><figcaption></figcaption></figure>

Ở phía nam VHAL, các môi trường kiểm thử tăng dần về độ phức tạp – bắt đầu từ các mô hình cơ bản, chuyển sang mô phỏng có độ trung thực cao, ECU ảo, và cuối cùng là hardware-in-the-loop (HIL) cùng các hệ thống vật lý. Cách tiếp cận phân lớp này bảo đảm các hệ thống nhúng, vốn thường thuộc nhóm an toàn trọng yếu (ASIL), được thẩm định nghiêm ngặt trong điều kiện thực tế. Bằng cách tách rời tốc độ phát triển, kỹ sư có thể lặp nhanh trên phần mềm ở phía bắc VHAL trong khi dần tăng mức độ hiện thực của phần cứng ở phía nam VHAL. Chiến lược đa tốc độ này rút ngắn các chu kỳ kiểm thử và hỗ trợ việc thẩm định đầu-cuối vững chắc trên toàn bộ V-Model.

Cách tiếp cận đa tốc độ, shift-left kết hợp với sự phân tách theo VHAL mang lại một số lợi ích then chốt:

1. **Phát triển nhanh hơn**: Các thuật toán ở phía bắc VHAL lặp nhanh, tách rời khỏi mức độ sẵn sàng của phần cứng.
2. **Kiểm thử có khả năng mở rộng**: Cho phép kiểm thử tiến triển từ nguyên mẫu ảo nhẹ tới môi trường phần cứng thực tế.
3. **Hiệu quả chi phí**: Giảm sự phụ thuộc vào nguyên mẫu vật lý ở giai đoạn đầu của quá trình phát triển.
4. **Tăng tính linh hoạt**: Phần mềm không phụ thuộc vào môi trường kiểm thử, thúc đẩy khả năng tái sử dụng giữa mô phỏng và phần cứng.
5. **Thẩm định tốt hơn**: Độ phức tạp tăng dần ở phía nam VHAL bảo đảm việc thẩm định an toàn trọng yếu vững chắc mà không làm đình trệ quá trình phát triển phần mềm.

Những lợi ích này có được nhờ cách tiếp cận tiến hóa hệ thống tách rời, đa tốc độ.
