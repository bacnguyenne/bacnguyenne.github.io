---
title: "Vehicle SOA Tech Stack"
description: "Kiến trúc phân lớp của tech stack SDV từ cloud tới ECU (QM, ASIL A/B, ASIL C/D), minh họa qua hai ứng dụng dùng chung door open API và nghiên cứu điển hình Rivian."
order: 32
part: "C"
depth: 3
origTitle: "Vehicle SOA Tech Stack"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/vehicle-soa-tech-stack"
---

Kiến trúc của một tech stack hiện đại dành cho software-defined vehicle (SDV) được xây dựng trên các nguyên lý của service-oriented architecture (SOA), phân tách môi trường một cách cẩn trọng thành các lớp an toàn tới hạn (safety-critical) và không an toàn tới hạn. Hình minh họa kèm theo mô tả sự tích hợp giữa môi trường cloud và môi trường on-board, được phân loại thành các lớp Quality Management (QM), ASIL A/B và ASIL C/D.

<figure><img src="/sdv101/OegwVJ9fpwBQd232BrxM.webp" alt=""><figcaption></figcaption></figure>

## Các lớp của tech stack cho vehicle SOA

Trên cùng của stack là **môi trường cloud**, nơi middleware và các ứng dụng được thực thi trong khuôn khổ Platform-as-a-Service (PaaS). Các lớp bên dưới của cloud tận dụng những nền tảng Infrastructure-as-a-Service (IaaS) chạy trên CPU và GPU hiệu năng cao. Cấu hình này cho phép tính toán ở quy mô co giãn và quản lý tập trung các dịch vụ tương tác với hệ thống on-board của xe.

Chuyển xuống **môi trường QM** trên xe, ta thấy việc sử dụng các container runtime để thực thi microservices một cách hiệu quả. Chúng chạy bên trong các thực thể hệ điều hành ảo do hypervisor quản lý, thường sử dụng các OS đa dụng như Linux. Lớp này dựa trên các môi trường compute hiệu năng cao chạy CPU và GPU, bảo đảm thực thi nhanh các chức năng không tới hạn của xe và các trải nghiệm nâng cao trên xe.

Đối với **môi trường ASIL A và B**, stack tích hợp các nền tảng chuyên biệt như Autosar Adaptive hoặc Robot Operating System (ROS). Chúng chạy trên các vi xử lý đa dụng để hỗ trợ những chức năng an toàn tới hạn, đồng thời vẫn duy trì đủ độ linh hoạt cho việc điều phối dịch vụ động.

**Môi trường ASIL C và D** đi sâu hơn vào các tác vụ thời gian thực, ở đó tech stack bao gồm các ECU cao cấp chạy hệ điều hành thời gian thực trên vi xử lý đa dụng dành cho zone controller. Tại các điểm cuối, stack sử dụng các ECU cấp thấp chạy trên vi điều khiển. Những ECU này thường chạy Autosar Classic hoặc các nền tảng micro-OS tương tự, bảo đảm việc thực thi an toàn và tin cậy cho các tác vụ đặc biệt tới hạn như phanh và điều khiển động cơ.

Cách tiếp cận phân lớp và mô-đun hóa này của SDV tech stack cho thấy các môi trường an toàn tới hạn và không tới hạn có thể cùng tồn tại như thế nào. Mỗi lớp được tối ưu cho vai trò riêng của nó, từ việc hỗ trợ tính toán co giãn trên cloud cho tới việc cho phép các tác vụ thời gian thực, an toàn tới hạn trên hệ thống nhúng. Sự tách biệt này bảo đảm khả năng mở rộng, an toàn chức năng và tính linh hoạt cần thiết cho các hệ sinh thái software-defined vehicle.

## Góc nhìn ứng dụng về SDV tech stack

Để hiểu rõ hơn về SDV tech stack hiện đại, hãy nhìn lại nó từ góc độ của các ứng dụng. Trước đó, chúng ta đã giới thiệu hai ứng dụng khác nhau: một dành cho thợ sửa xe lưu động và một cho chuỗi chào đón hành khách trên xe. Hai ứng dụng này minh họa cách tech stack cho phép tích hợp liền mạch giữa các thành phần khác nhau, đồng thời bảo đảm an toàn và chức năng.

<figure><img src="/sdv101/Sf9A4Qc4Tz4QB8IWtgUB.webp" alt=""><figcaption></figcaption></figure>

**Ứng dụng thứ nhất**, được thiết kế cho thợ sửa xe lưu động, chạy trên smartphone. Ứng dụng này cho phép người thợ mở cửa xe từ xa, sử dụng **vehicle-to-cloud API** để giao tiếp với chiếc xe. Ứng dụng gửi một lệnh lên cloud, nơi nó tương tác với một microservice hiện thực **door open API**. Microservice này chạy trong cloud runtime, xử lý yêu cầu và truyền nó xuống hệ thống on-board của xe thông qua **vehicle-to-cloud API**.

**Ứng dụng thứ hai**, chuỗi chào đón hành khách, chạy trực tiếp trên xe trong **môi trường QM container runtime**. Ứng dụng này chịu trách nhiệm tạo ra trải nghiệm người dùng hấp dẫn bằng cách điều chỉnh các thiết lập, chẳng hạn vị trí ghế, và mở cửa khi chủ xe tiến lại gần. Giống như ứng dụng cho thợ sửa xe lưu động, nó cũng tận dụng **door open API** để thực hiện chức năng của mình.

Trong cả hai kịch bản, **door open API** đóng vai trò là giao diện trung tâm, trừu tượng hóa sự phức tạp của việc tương tác với phần cứng của xe. Việc hiện thực API này bao gồm một quy trình nhiều bước nhằm bảo đảm an toàn chức năng. Khi có yêu cầu mở cửa, API trước hết phải đi qua **signal-to-service API**, thành phần kết nối nó với môi trường nhúng. Trong môi trường nhúng, các bước kiểm tra an toàn được thực hiện theo trình tự sau:

1. **Kiểm tra tốc độ xe**: Bảo đảm xe đang đứng yên trước khi tiếp tục.
2. **Giám sát giao thông phía sau**: Sử dụng camera sau và AI để phát hiện phương tiện đang tới gần.
3. **Kiểm tra khoảng trống hai bên**: Xác nhận không có vật cản hay người đi bộ gần cửa xe bằng các camera bên hông.
4. **Thực thi ở cấp ECU**: Sau khi tất cả các bước kiểm tra an toàn được xác nhận, signal-to-service API giao tiếp với ECU nhúng để mở khóa và mở cửa xe trên thực tế.

Cách tiếp cận phân lớp này cho thấy SDV tech stack hỗ trợ chức năng đầu-cuối như thế nào, bảo đảm các phép tính an toàn tới hạn được thực hiện trong những môi trường phù hợp, đồng thời phơi bày các API có thể tái sử dụng cho việc phát triển ứng dụng. Khả năng tái sử dụng **door open API** cho cả ứng dụng on-board lẫn off-board làm nổi bật tính mô-đun, khả năng mở rộng và khả năng tương tác mà service-oriented architecture mang lại cho software-defined vehicle.

## Nghiên cứu điển hình: Kiến trúc mô-đun và tầm nhìn chiến lược của Rivian

Để kết lại, hãy cùng nhìn lại cách tiếp cận đổi mới của Rivian đối với kiến trúc xe và những hàm ý rộng hơn của nó. Tầm nhìn của Rivian xoay quanh tính mô-đun, trong đó các phiên bản phần cứng điện khác nhau được trừu tượng hóa thông qua một lớp thích ứng phần cứng (hardware adaptation layer). Cách tiếp cận này cho phép Rivian xây dựng các lớp phần mềm đa dụng, linh hoạt bên trên, có thể tùy biến cho từng biến thể xe cụ thể.

Kiến trúc mô-đun này không chỉ then chốt đối với khả năng mở rộng trên toàn danh mục sản phẩm của Rivian, mà còn đối với hợp tác chiến lược của hãng với Volkswagen. Trong bối cảnh liên doanh Rivian-Volkswagen, kiến trúc này mở ra cơ hội để Volkswagen tận dụng nền tảng cốt lõi của Rivian trong khi vẫn đưa vào những tính năng số riêng biệt phù hợp với thương hiệu và yêu cầu thị trường của mình. Chẳng hạn, Volkswagen có thể tái sử dụng kiến trúc ở tầng cao của Rivian cho các hoạt động vận hành xe nhưng tùy biến nó bằng các trải nghiệm số độc quyền, qua đó nâng cao sự khác biệt cạnh tranh trong những lĩnh vực như infotainment, tương tác người dùng hay các hệ thống hỗ trợ lái nâng cao.

Quan hệ hợp tác này làm nổi bật tiềm năng chuyển đổi của những kiến trúc có khả năng mở rộng và linh hoạt trong ngành ô tô. Bằng cách trừu tượng hóa sự phức tạp của phần cứng và tập trung vào khác biệt hóa bằng phần mềm, cách tiếp cận của Rivian đặt ra một chuẩn mực cho việc phát triển hiệu quả và hợp tác đối với thế hệ software-defined vehicle tiếp theo.

<figure><img src="/sdv101/sVW3E7ksCFBmVw0BNJvr.webp" alt=""><figcaption></figcaption></figure>
