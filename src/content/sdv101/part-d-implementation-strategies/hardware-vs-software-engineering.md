---
title: "Kỹ thuật phần cứng và kỹ thuật phần mềm"
description: "Sự hội tụ giữa kỹ thuật phần cứng và phần mềm trong SDV: vai trò mô hình chữ V, phát triển đa tốc độ, tách rời qua VHAL và tự động hoá CI/CD."
order: 38
part: "D"
depth: 1
origTitle: "Hardware vs Software Engineering"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/hardware-vs-software-engineering"
---

Trong thế giới software-defined vehicles (SDV — xe được định nghĩa bằng phần mềm), sự hội tụ giữa kỹ thuật phần cứng và kỹ thuật phần mềm đặt ra những thách thức và cơ hội rất đặc thù. Phát triển phần cứng theo lối truyền thống từ lâu vẫn được dẫn dắt bởi **mô hình chữ V (V-Model)** — một cách tiếp cận đã được kiểm chứng để quản lý việc thiết kế, tích hợp và kiểm định các hệ thống cơ khí và điện/điện tử (E/E). Tuy nhiên, khi ngành ô tô chuyển dịch sang những kiến trúc lấy phần mềm làm trung tâm nhiều hơn, nhu cầu về tính linh hoạt và phát triển đa tốc độ trở nên thiết yếu.

<figure><img src="/sdv101/X7SC1FqQgnuB26rf4LiR.webp" alt=""><figcaption></figcaption></figure>

Trong khi các luồng công việc phần cứng thường đòi hỏi lập kế hoạch dài hạn và sự ổn định, **kỹ thuật phần mềm** lại đòi hỏi lặp liên tục và cập nhật nhanh. Cách tiếp cận đa tốc độ này yêu cầu phải **tách rời (decoupling)** các quy trình phát triển phần cứng, E/E và phần mềm thông qua những giao diện kỹ thuật rõ ràng như VHAL, cùng với sự đồng bộ về mặt tổ chức. Để hiện thực hoá trọn vẹn việc tách rời đó, cần đưa vào các **CI/CD pipeline tự động** và ánh xạ chúng một cách hiệu quả lên mô hình chữ V, qua đó cho phép tích hợp và kiểm định liền mạch xuyên suốt các luồng công việc số, E/E và cơ khí.

Trong chương này, chúng ta tìm hiểu cách các nguyên tắc kỹ thuật phần cứng và phần mềm tương tác với nhau, vai trò của mô hình chữ V trong việc quản lý những độ phức tạp này, cũng như những cách mà tự động hoá CI/CD và các phương pháp agile có thể dung hoà các tốc độ phát triển khác nhau.
