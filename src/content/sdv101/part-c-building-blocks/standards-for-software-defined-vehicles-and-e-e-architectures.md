---
title: "Các tiêu chuẩn cho Software-Defined Vehicle và kiến trúc E/E"
description: "Tổng quan các tiêu chuẩn nền tảng của SDV và kiến trúc E/E: AUTOSAR, COVESA VSS, SOAFEE và liên minh mã nguồn mở Eclipse SDV, cùng ưu điểm và thách thức của từng tiêu chuẩn."
order: 23
part: "C"
depth: 1
origTitle: "Standards for Software-Defined Vehicles and E/E Architectures"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/standards-for-software-defined-vehicles-and-e-e-architectures"
---

Các tiêu chuẩn đóng vai trò then chốt trong việc định hình quá trình phát triển và khả năng tương tác của **Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm)** và **kiến trúc E/E**. Trong chương này, chúng ta sẽ tìm hiểu ba tiêu chuẩn chủ chốt: **AUTOSAR**, **COVESA** và **SOAFEE**, những tiêu chuẩn đã trở thành nền tảng của kỹ thuật ô tô hiện đại. Ngoài ra, chúng ta cũng sẽ xem xét Eclipse SDV với tư cách một liên minh mã nguồn mở được xây dựng trên các tiêu chuẩn mở.

## **AUTOSAR: Tiêu chuẩn công nghiệp trên thực tế**

Tiêu chuẩn **AUTOSAR (Automotive Open System Architecture)** là một kiến trúc được áp dụng rộng rãi, đã được nhiều OEM và nhà cung cấp triển khai trên hàng triệu xe. Được phát triển bởi **AUTOSAR partnership** — một liên minh gồm các OEM, nhà cung cấp Tier 1 và các bên tham gia khác trong ngành — tiêu chuẩn này hướng tới việc tách rời phần cứng và phần mềm thông qua một lớp trung gian được chuẩn hóa.

<figure><img src="/sdv101/qyUlQTuSOM8l7T5fptRE.webp" alt=""><figcaption></figcaption></figure>

Kiến trúc này hỗ trợ các chức năng quan trọng như **adaptive cruise control** và **cảnh báo chệch làn đường**, thường là trong các ứng dụng có mức **ASIL** cao. Nó cũng cung cấp sự chuẩn hóa cho truyền thông, chẩn đoán và tích hợp với các mạng trên xe.

* **Ưu điểm**:
  * Mức độ chuẩn hóa và khả năng tương tác cao.
  * Khả năng mở rộng để tích hợp nhiều hệ thống khác nhau.
  * Độ an toàn và độ tin cậy đã được kiểm chứng cho các ứng dụng quan trọng.
* **Thách thức**:
  * Độ phức tạp cao và đường cong học tập dốc.
  * Tính linh hoạt hạn chế đối với đổi mới nhanh.
  * Chi phí phát triển có thể cao hơn.

Bất chấp những hạn chế đó, AUTOSAR vẫn là nền tảng cốt lõi để bảo đảm các hệ thống ô tô đáng tin cậy và có khả năng mở rộng.

{% embed url="<https://medium.com/volvo-cars-engineering/the-reality-of-autosar-and-the-way-forward-36af39ec4099>" %}

<figure><img src="/sdv101/q4jkaaanLwsFt2GFniCw.webp" alt=""><figcaption></figcaption></figure>

## **COVESA: Vehicle Signal Specification (VSS)**

**COVESA (Connected Vehicle Systems Alliance)**, trước đây được biết đến với tên GENIVI, là một liên minh mở thúc đẩy khả năng tương tác trong các **giải pháp xe kết nối**. Một đóng góp quan trọng của COVESA là **Vehicle Signal Specification (VSS)**, một tiêu chuẩn để cấu trúc hóa và truy cập dữ liệu xe.

<figure><img src="/sdv101/leBx8vRVfn0ev7QwHUok.webp" alt=""><figcaption></figcaption></figure>

COVESA VSS cung cấp một **mô hình dữ liệu dạng cây** tổ chức các miền chức năng của xe cùng các cảm biến và cơ cấu chấp hành liên quan. Về bản chất, tiêu chuẩn này hiện thực hóa quá trình **chuyển đổi từ tín hiệu sang dịch vụ (signal-to-service)** đã được bàn đến trước đó trong phần **Service-Oriented Architecture (SOA)**.

* **Đặc điểm chính**:
  * Định nghĩa tín hiệu xe được chuẩn hóa.
  * Đơn giản hóa việc truy cập dữ liệu cho các ứng dụng.
  * Bám sát chặt chẽ các nguyên tắc SOA hiện đại.

Việc áp dụng COVESA VSS bảo đảm xử lý dữ liệu liền mạch và đẩy nhanh quá trình phát triển cho xe kết nối và xe được định nghĩa bằng phần mềm.

## **SOAFEE: Scalable Open Architecture for Embedded Edge**

Tiêu chuẩn **SOAFEE (Scalable Open Architecture for Embedded Edge)**, do **ARM** khởi xướng và được nhiều OEM, Tier 1, các hyperscaler cùng các bên tham gia khác trong ngành ủng hộ, đưa các **nguyên tắc cloud-native** vào ngành công nghiệp ô tô.

<figure><img src="/sdv101/ZlT3LMtcDDYz5FeKl7fl.webp" alt=""><figcaption></figcaption></figure>

SOAFEE tích hợp cả môi trường **on-board** (trên xe) và **off-board** (ngoài xe) để xử lý hiệu quả các dịch vụ có mức độ tới hạn khác nhau (mixed-criticality).

* **Kiến trúc on-board**:
  * Phân biệt giữa **CPU tính toán hiệu năng cao** phục vụ hiệu suất và **CPU an toàn cao** phục vụ các chức năng tới hạn.
  * Cung cấp các môi trường **QM** và **ASIL** tách biệt.
  * Có **lớp trừu tượng phần cứng (HAL)** để hỗ trợ cả dịch vụ mức an toàn cao lẫn mức an toàn thấp.
* **Kiến trúc off-board**:
  * Thực thi các microservices trên cloud trong môi trường mixed-criticality.
  * Bảo đảm tương tác liền mạch với các hệ thống trên xe thông qua các orchestrator.

Các **orchestrator mixed-criticality** cùng thiết kế mô-đun của SOAFEE mang lại tính linh hoạt và hiệu quả cao hơn trong việc quản lý các dịch vụ SDV. Nó thu hẹp khoảng cách giữa các yêu cầu an toàn đạt chuẩn ô tô và sự nhanh nhạy của các kiến trúc cloud-native.

## Eclipse SDV: Dẫn dắt đổi mới mã nguồn mở

**Eclipse SDV Working Group**, do **Eclipse Foundation** chủ trì, giữ vai trò then chốt trong việc thúc đẩy phát triển mã nguồn mở cho **Software-Defined Vehicle (SDV)**. Sứ mệnh của nhóm là xây dựng một nền tảng mã nguồn mở hỗ trợ các công cụ, framework và môi trường runtime phù hợp với các tiêu chuẩn hiện đại của ngành như **AUTOSAR**, **COVESA** và **SOAFEE**.

Những đóng góp chính của Eclipse SDV bao gồm các **triển khai tham chiếu**, **mô hình phát triển mở** và việc thúc đẩy các **API chuẩn hóa**. Điều này cho phép phát triển nhanh hơn theo hướng cộng tác và bảo đảm khả năng tương tác giữa các thành phần SDV khác nhau. Bằng cách theo đuổi hướng tiếp cận mã nguồn mở, Eclipse SDV đẩy nhanh việc triển khai các công nghệ ô tô tiên tiến, đồng thời nuôi dưỡng một cộng đồng lập trình viên toàn cầu tập trung vào tương lai của di chuyển.

## Tóm tắt: Các tiêu chuẩn và liên minh định hình SDV

Cùng nhau, **AUTOSAR**, **COVESA**, **SOAFEE** và **Eclipse SDV** đáp ứng những đòi hỏi không ngừng thay đổi của **Software-Defined Vehicle**, cân bằng giữa **an toàn**, **khả năng mở rộng** và **đổi mới**. Các tiêu chuẩn này giúp OEM và nhà cung cấp xây dựng những nền tảng xe **tương tác được** và **sẵn sàng cho tương lai** bằng cách chuẩn hóa việc tích hợp phần cứng — phần mềm và thúc đẩy các kiến trúc cloud-native, hướng dịch vụ.

Bổ trợ cho các tiêu chuẩn kỹ thuật này, **SDV Alliance** đóng vai trò một sáng kiến toàn cầu thúc đẩy hợp tác trong ngành. Bằng cách kết nối các nhà sản xuất ô tô, công ty công nghệ và nhà phát triển phần mềm, liên minh này xác định các **thực hành tốt nhất** và **tiêu chuẩn** cho hệ sinh thái SDV, bảo đảm một cách tiếp cận thống nhất và đổi mới trên toàn ngành công nghiệp ô tô.

Cùng nhau, các tiêu chuẩn và liên minh này tạo nên một nền móng vững chắc cho quá trình **chuyển đổi do phần mềm dẫn dắt** của ngành ô tô, hỗ trợ các công nghệ tiên tiến trong khi vẫn bảo đảm **an toàn chức năng**, **trí tuệ dựa trên dữ liệu** và **thiết kế hướng dịch vụ** — những yếu tố định hình tương lai của di chuyển.
