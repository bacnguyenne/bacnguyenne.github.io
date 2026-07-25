---
title: "Microservices & APIs"
description: "API và microservices trong kiến trúc hiện đại: từ giai thoại Amazon tới ví dụ ô tô, cùng hai mẫu giao tiếp Request-Response và Publish-Subscribe."
order: 14
part: "B"
depth: 4
origTitle: "Microservices & APIs"
origUrl: "https://www.sdv.guide/sdv101/part-b-lessons-learned/learnings-from-the-internet-folks/cloud-native-principles/loose-coupling/microservices-and-apis"
---

Một giai thoại nổi tiếng trong giới công nghệ kể rằng CEO khi đó của Amazon là Jeff Bezos đã ra chỉ thị buộc mọi nhóm trong công ty phải phơi bày dữ liệu và chức năng của mình thông qua **Application Programming Interfaces (API — giao diện lập trình ứng dụng)**. Theo câu chuyện này, ông yêu cầu tất cả các nhóm chỉ được giao tiếp với nhau qua các service interface, và phải thiết kế những interface đó sao cho có thể mở ra bên ngoài để hỗ trợ các hệ sinh thái trong tương lai. Dù các chi tiết chính xác của chỉ thị này vẫn chưa được kiểm chứng, tác động của nó lên ngành phát triển phần mềm hiện đại là không thể phủ nhận, khi nhấn mạnh vào **tính module hoá**, **khả năng mở rộng** và **sự cộng tác**.

<figure><img src="/sdv101/TskHiMHvKzjRyQ1cnEs6.webp" alt=""><figcaption></figcaption></figure>

## API: Xương sống của giao tiếp

API đóng vai trò là các interface có cấu trúc cho phép những thành phần phần mềm khác nhau tương tác với nhau, giúp trao đổi dữ liệu và chức năng một cách liền mạch. Hãy hình dung một nền tảng thương mại điện tử trực tuyến lớn cần chia sẻ **dữ liệu khách hàng** cho nhiều nhóm khác nhau. Thay vì cấp quyền truy cập trực tiếp vào cơ sở dữ liệu, có thể xây dựng một **Customer Data Service** chuyên biệt bao quanh cơ sở dữ liệu khách hàng, chỉ phơi bày những dữ liệu thiết yếu thông qua API.

<figure><img src="/sdv101/spdd7Xkv222BYnjjJuuO.webp" alt=""><figcaption></figcaption></figure>

Ví dụ, front-end của một web shop có thể gọi một phương thức API như **getPurchaseHistory()** để lấy về các đơn hàng gần đây của khách hàng, chẳng hạn một chiếc xe Lego, một đôi giày thể thao và một chai nước hoa. Nhờ vậy, nhóm phát triển front-end truy cập được dữ liệu cần thiết mà không cần biết cấu trúc bên trong của cơ sở dữ liệu.

<figure><img src="/sdv101/FbSRSaEXpId6oydaBPJT.webp" alt=""><figcaption></figcaption></figure>

## Ứng dụng thực tế trong ngành ô tô

Cách tiếp cận hướng API vượt xa phạm vi thương mại điện tử. Trong bối cảnh ô tô, API có thể hỗ trợ các chức năng như lấy dữ liệu xe hoặc điều khiển các bộ phận. Một API như **getVehicleSpeed()** có thể trả về tốc độ hiện tại của xe.&#x20;

<figure><img src="/sdv101/VLMTF55KSgTgozZyNYq4.webp" alt=""><figcaption></figcaption></figure>

Tương tự, một API như **openFrontLeftDoor()** có thể được dùng để mở khoá rồi mở cửa xe. API này bắt buộc phải kiểm tra xem xe đã đứng yên hay chưa trước khi thực hiện, nhằm bảo đảm an toàn chức năng.

<figure><img src="/sdv101/mMCYCL6d8UxzfqKBH4cG.webp" alt=""><figcaption></figcaption></figure>

## Các mẫu giao tiếp API

Hiểu rõ các mẫu giao tiếp API là điều thiết yếu, bởi chúng quy định cách các service tương tác với nhau, bảo đảm việc trao đổi dữ liệu hiệu quả và khả năng mở rộng của hệ thống. Hai mẫu quan trọng nhất là Request / Response và Pub / Sub, sẽ được trình bày dưới đây.

<figure><img src="/sdv101/jiikW27W0R0pDvSUi5rD.webp" alt=""><figcaption></figcaption></figure>

### Request-Response

Mẫu **Request-Response** là phương thức giao tiếp API quen thuộc nhất. Một **service consumer** (bên tiêu thụ dịch vụ) gửi yêu cầu đến một **service provider** (bên cung cấp dịch vụ); bên này xử lý yêu cầu rồi gửi lại phản hồi. Kiểu tương tác đồng bộ này được sử dụng rộng rãi trong các web service truyền thống.

### Publish-Subscribe (PubSub)

Một cách tiếp cận còn tách rời hơn nữa là mẫu **Publish-Subscribe (PubSub)**. Ở đây, các **publisher** phát các sự kiện liên quan lên những **topic** hoặc **channel** cụ thể mà không cần biết ai đang lắng nghe. Các **subscriber** quan tâm đến những topic đó sẽ tự động nhận được cập nhật mỗi khi có sự kiện mới. Kiến trúc này hỗ trợ các tương tác linh động và có khả năng mở rộng cao.

## Lợi ích của microservices và API

Microservices và API mang lại sự nhanh nhạy, linh hoạt và khả năng mở rộng ở cả cấp độ kỹ thuật lẫn tổ chức. Chúng tăng cường **khả năng chống chịu** bằng cách cô lập lỗi, tạo điều kiện **tái sử dụng** các thành phần, đồng thời tinh gọn quy trình **phát triển và bảo trì**, qua đó giảm chi phí. Khi API được mở ra bên ngoài, chúng còn cho phép hình thành những **hệ sinh thái** rộng lớn hơn, thúc đẩy đổi mới và cộng tác vượt ra ngoài ranh giới của tổ chức.

<figure><img src="/sdv101/DR8R7lW9pAp6trGIWb2c.webp" alt=""><figcaption></figcaption></figure>

Bằng cách cấu trúc những hệ thống phức tạp thành các service module hoá với API được định nghĩa rõ ràng, các tổ chức có thể đạt được mức độ nhanh nhạy và khả năng mở rộng mà kiến trúc monolithic không bao giờ với tới được. Đây chính là cách tiếp cận nền tảng để xây dựng các hệ thống phần mềm bền bỉ và sẵn sàng cho tương lai.
