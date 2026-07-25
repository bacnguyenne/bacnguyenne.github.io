---
title: "DevOps và Continuous Delivery"
description: "Các nguyên lý cloud-native, văn hóa DevOps và continuous delivery pipeline: vòng lặp vô cực, công cụ CI/CD và bài học cho phát triển phần mềm ô tô."
order: 12
part: "B"
depth: 3
origTitle: "DevOps and Continuous Delivery"
origUrl: "https://www.sdv.guide/sdv101/part-b-lessons-learned/learnings-from-the-internet-folks/cloud-native-principles/devops-and-continuous-delivery"
---

**Các nguyên lý cloud-native** (điện toán đám mây nguyên bản) tạo nên nền tảng cho các phương pháp agile, DevOps và cải tiến liên tục. Với sự hỗ trợ của **các thực hành DevOps** như tự động hóa và cộng tác, cùng **các continuous delivery pipeline**, những nguyên lý cloud-native giúp đội ngũ thích ứng nhanh, giảm rủi ro và liên tục tạo ra giá trị.

## DevOps và Continuous Delivery: Hai mặt của cùng một vấn đề

**DevOps** cung cấp **khuôn khổ văn hóa**, trong khi **Continuous Delivery (CD — phân phối liên tục)** cung cấp **các thực hành kỹ thuật** để hiện thực hóa những hệ thống cloud-native.

<figure><img src="/sdv101/3IQzO0vWdIDBULgBKYOS.webp" alt=""><figcaption></figcaption></figure>

## DevOps: Phá bỏ các silo

DevOps là một cách tiếp cận về văn hóa và tổ chức nhằm xóa bỏ các silo giữa những đội phát triển, vận hành và kiểm thử, qua đó thúc đẩy sự cộng tác liền mạch. Một ví dụ cá nhân cho thấy rõ tầm quan trọng của điều này:

> "Nhiều năm trước, tôi làm việc trong một đội phát triển cho một hãng hàng không lớn, xây dựng một công cụ dựa trên công nghệ mới — một cơ sở dữ liệu NoSQL. Dù đã đạt được tiến độ nhất định, cuối cùng đội vận hành vẫn từ chối hỗ trợ nó vì quy trình của họ chỉ cho phép cơ sở dữ liệu quan hệ. Chúng tôi buộc phải thiết kế lại kiến trúc để đáp ứng yêu cầu vận hành, gây lãng phí thời gian và công sức" Dirk Slama, Tác giả chính

Câu chuyện này nhấn mạnh nguyên lý cốt lõi của DevOps: bảo đảm sự đồng thuận giữa các đội khác nhau như phát triển và vận hành ngay từ đầu.

## Continuous Delivery: Tự động hóa quy trình release

CD tự động hóa quy trình phát hành phần mềm, cho phép triển khai thường xuyên và tin cậy. Những công cụ như Jenkins, Docker và Selenium giúp tinh gọn pipeline này, khiến các việc sau trở nên khả thi:

* Commit mã nguồn.
* Build hệ thống.
* Kiểm thử, triển khai và vận hành hệ thống một cách hiệu quả.

Sự cộng hưởng giữa DevOps và CD mang lại tốc độ phân phối nhanh hơn, ít lỗi hơn và phản hồi liên tục — những yếu tố thiết yếu để đổi mới ở quy mô lớn.

## Vòng lặp vô cực DevOps và CI/CD

**Vòng lặp vô cực DevOps** minh họa vòng đời phân phối phần mềm:

1. **Plan (Lập kế hoạch)**: Xác định những thay đổi sắp tới.
2. **Develop (Phát triển)**: Viết và kiểm thử mã nguồn hoặc tạo các mô hình AI.
3. **Build (Dựng)**: Biên dịch và đóng gói mã nguồn hoặc mô hình AI thành phần mềm thực thi được, sẵn sàng triển khai.
4. **Test (Kiểm thử)**: Xác nhận tính năng và hiệu năng.
5. **Release (Phát hành)**: Triển khai phần mềm (bao gồm cả mô hình AI) lên môi trường production.
6. **Operate (Vận hành)**: Giám sát hệ thống theo thời gian thực.
7. **Learn (Học hỏi)**: Thu thập hiểu biết để cải thiện các vòng lặp tiếp theo.

Phát triển hiện đại vượt ra ngoài việc lập trình truyền thống, bao gồm cả huấn luyện và tinh chỉnh mô hình AI, tích hợp dữ liệu từ môi trường vận hành, và triển khai các tài nguyên không chỉ lên cloud mà còn lên các thiết bị edge như smartphone và thiết bị IoT.

<figure><img src="/sdv101/Qb2IXi3FsuGPFrjhfLgy.webp" alt=""><figcaption></figcaption></figure>

## Pipeline: Tự động hóa vòng đời phát triển

Pipeline tự động hóa và tinh gọn vòng đời phát triển, từ lúc commit mã nguồn đến khi triển khai. Các công cụ chính bao gồm:

* **GitHub**: Quản lý mã nguồn.
* **Maven**: Tự động hóa build.
* **Selenium**: Kiểm thử web.
* **Docker**: Đóng gói container.
* **Jenkins**: Điều phối và tự động hóa xuyên suốt mọi bước.

Những pipeline này bảo đảm phân phối nhanh hơn, chất lượng cao hơn và ít lỗi hơn. Tuy nhiên, trong ngành ô tô — đặc biệt với hệ thống nhúng — nhiều mục tiêu trong số đó vẫn chưa đạt được.

<figure><img src="/sdv101/s4gcaDknBVeZsoj83pBE.webp" alt=""><figcaption></figcaption></figure>

## Pipeline độc lập cho phát triển cộng tác

Hãy xét một ví dụ trong đó hai đội phát triển các thành phần một cách độc lập:

1. **Đội A** phát triển một ứng dụng smartphone.
2. **Đội B** xây dựng backend trên cloud cho ứng dụng đó.

Mỗi đội dùng pipeline riêng để kiểm thử và lặp cải tiến thành phần của mình một cách độc lập. Trong các giai đoạn đầu:

* Đội A dùng một dịch vụ backend giả lập (mock) để kiểm thử.
* Đội B dùng một ứng dụng smartphone giả lập (mock) để xác nhận.

Khi cả hai thành phần đã ổn định, chúng được hợp nhất trong một integration pipeline để:

* Kiểm thử hệ thống kết hợp.
* Triển khai giải pháp hoàn chỉnh.
* Giám sát hệ thống một cách tổng thể nhằm tìm ra điểm cần cải thiện.

Cách tiếp cận này bảo đảm sự linh hoạt trong phát triển đồng thời cho phép tích hợp và triển khai trơn tru.

<figure><img src="/sdv101/Pp6mj6GUkTuz0gfvmgZI.webp" alt=""><figcaption></figcaption></figure>

## Chặng đường phía trước của ngành ô tô

Trong khi các nguyên lý cloud-native này được áp dụng rộng rãi trong những hệ thống trên nền internet, ngành ô tô — nhất là với phần mềm nhúng — lại đối mặt với nhiều thách thức đáng kể. Tự động hóa, các thực hành agile và continuous delivery pipeline mang đến tiềm năng to lớn để chuyển đổi lĩnh vực này, nhờ khả năng:

* Phân phối nhanh hơn.
* Nâng cao chất lượng.
* Phản hồi và đổi mới liên tục.

Bằng cách học hỏi các thực hành tốt nhất của cloud-native, hoạt động phát triển ô tô có thể tiến hóa để đáp ứng đòi hỏi của những software-defined vehicle hiện đại.
