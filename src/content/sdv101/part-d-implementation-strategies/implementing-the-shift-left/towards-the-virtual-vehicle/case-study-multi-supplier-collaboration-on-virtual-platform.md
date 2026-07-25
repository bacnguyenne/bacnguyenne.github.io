---
title: "Nghiên cứu tình huống: Hợp tác nhiều nhà cung cấp trên nền tảng ảo"
description: "Ví dụ tích hợp ba thành phần phần mềm từ hai nhà cung cấp và OEM trên ECU ảo, qua các pipeline phát triển, tích hợp ảo và kiểm thử HIL."
order: 48
part: "D"
depth: 3
origTitle: "Case Study: Multi-Supplier Collaboration on Virtual Platform"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/towards-the-virtual-vehicle/case-study-multi-supplier-collaboration-on-virtual-platform"
---

Để giải quyết những thách thức đã nêu của **"integration hell"** (địa ngục tích hợp) trong phát triển ô tô, các nền tảng phát triển ảo có thể đóng vai trò then chốt trong tương lai. Chúng đơn giản hóa việc tích hợp các thành phần đến từ nhiều nhà cung cấp khác nhau bằng cách cung cấp một môi trường thống nhất cho kiểm thử và kiểm chứng.

## Tổng quan tình huống

Nghiên cứu tình huống này mô tả một kịch bản với hai bộ điều khiển điện tử (ECU) khác biệt: một ECU hiệu năng cao (ECU1) và một ECU đầu cuối cấp thấp hơn (ECU2). Thách thức bắt nguồn từ **quyết định của OEM tách rời nhà cung cấp phần cứng và phần mềm**, dẫn tới việc nhiều nhà cung cấp cùng đóng góp các thành phần phần mềm, kể cả trên cùng một ECU.

<figure><img src="/sdv101/nh1djcQ84leVtsm4CpfD.webp" alt=""><figcaption></figcaption></figure>

Trong ví dụ này:

* **Nhà cung cấp 1** và **Nhà cung cấp 2** bàn giao các thành phần phần mềm riêng biệt chạy trên ECU1.
* Đồng thời, OEM tự phát triển một thành phần phần mềm cho ECU2.
* Việc tích hợp hệ thống đòi hỏi **ba thành phần phần mềm** (hai từ nhà cung cấp, một từ OEM) phải phối hợp gắn kết với nhau như một phần của cùng một **chuỗi sự kiện (event chain)**.

## Quy trình phát triển và các pipeline

1. **Phát triển tách biệt**:
   * Nhà cung cấp 1 phát triển phần mềm cho ECU1, sử dụng một **môi trường mock-up**.
   * Nhà cung cấp 2 phát triển một thành phần service provider và kiểm thử nó với một service client giả lập.
   * OEM phát triển phần mềm cho ECU2 một cách độc lập trong môi trường riêng.
2. **Môi trường tích hợp ảo 1**:\
   Các thành phần phần mềm từ Nhà cung cấp 1 và Nhà cung cấp 2 được tích hợp lên **ECU1 ảo**. Song song đó, phần mềm của OEM được kiểm thử trên **ECU2 ảo**.
3. **Môi trường ảo tích hợp 2**:\
   Cả hai ECU ảo — ECU1 và ECU2 — được ghép lại với nhau, chạy đồng thời cả ba thành phần (Nhà cung cấp 1, Nhà cung cấp 2 và OEM) một cách tích hợp để kiểm chứng chuỗi sự kiện đầu-cuối.
4. **Kiểm thử HIL**:\
   Phần mềm đã được kiểm chứng sẽ chuyển sang **kiểm thử Hardware-in-the-Loop (HIL)**, nơi hệ thống trải qua kiểm chứng sâu hơn trong các môi trường vật lý và ảo sát với thực tế.

<figure><img src="/sdv101/O6HuQka1PMfg1WEc4pJl.webp" alt=""><figcaption></figcaption></figure>

## Những điểm rút ra

Tình huống này cho thấy khối lượng công việc cần bỏ ra không chỉ để phát triển **từng ECU ảo riêng lẻ**, mà còn để thiết lập các **pipeline phát triển, tích hợp và kiểm thử** vững chắc. Những pipeline này là yếu tố sống còn để bảo đảm luồng DevOps hiệu quả, tự động hóa kiểm thử và rút ngắn chu kỳ phát triển, đồng thời quản lý được phần đóng góp từ nhiều nhà cung cấp. Bằng cách tận dụng môi trường ảo từ sớm và tích hợp các thành phần theo từng bước, OEM có thể **giảm thiểu các thách thức tích hợp** và **tinh gọn việc kiểm chứng** trên toàn bộ các ECU.
