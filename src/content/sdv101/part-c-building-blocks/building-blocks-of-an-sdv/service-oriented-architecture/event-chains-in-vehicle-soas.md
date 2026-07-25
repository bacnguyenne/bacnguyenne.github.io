---
title: "Chuỗi sự kiện trong SOA của xe"
description: "Cách chuỗi sự kiện và chuỗi lời gọi vận hành trong SOA của xe: các mô hình hệ thống cho microservices, ánh xạ sang môi trường thực thi và ví dụ mở cửa xe end-to-end từ cloud tới ECU."
order: 31
part: "C"
depth: 3
origTitle: "Event Chains in Vehicle SOAs"
origUrl: "https://www.sdv.guide/sdv101/part-c-building-blocks/building-blocks-of-an-sdv/service-oriented-architecture/event-chains-in-vehicle-soas"
---

## Chuỗi sự kiện trong SOA của xe

Trong các hệ thống ô tô truyền thống, chuỗi sự kiện (event chain) thường được nhìn nhận từ góc độ nhúng, chỉ tập trung vào các hệ thống on-board gắn chặt với những thành phần phần cứng. Các chuỗi sự kiện này liên quan đến những ECU (Electronic Control Unit) ghép nối chặt với nhau, thực thi các chức năng dựa trên tín hiệu đầu vào từ cảm biến và lệnh điều khiển cơ cấu chấp hành, trong phạm vi ranh giới phần cứng của xe.

Ngược lại, Service-Oriented Architecture (SOA — kiến trúc hướng dịch vụ) trong Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm) mở rộng khái niệm chuỗi sự kiện ra ngoài phạm vi chiếc xe, bao gồm cả thành phần on-board lẫn off-board. Điều này tạo nên một khung xử lý sự kiện end-to-end, trong đó các microservices trên cloud tương tác với các microservices trên xe, cho phép triển khai những tính năng như chẩn đoán từ xa, cập nhật over-the-air và các chức năng được tăng cường bằng cloud. Những chuỗi sự kiện liên kết với nhau này giữ vai trò then chốt để hiện thực hóa các dịch vụ xe mang tính động, có khả năng mở rộng và linh hoạt.

## Mô hình hệ thống trong microservices ô tô

Vậy các microservices trong một SOA của xe xử lý sự kiện như thế nào? Microservices trong ô tô có thể được xây dựng bằng nhiều mô hình hệ thống khác nhau, bao gồm:

* **Mô hình toán học:** Các mô hình này mô phỏng những hệ thống phức tạp và được chuyển thành mã thực thi được.
* **Mô hình trạng thái:** Chúng mô tả các chuyển trạng thái bằng những công cụ có cấu trúc, rất phù hợp cho các hệ thống như cửa xe hay quản lý nguồn điện.
* **Mã viết tay:** Lập trình viên tự viết mã riêng để hiện thực hóa các tính năng cụ thể.
* **Mô hình AI:** Các mô hình này thực hiện tác vụ suy luận, cho phép những tính năng cao cấp như nhận dạng hình ảnh và bảo trì dự đoán.

<figure><img src="/sdv101/j1tEMW0jL3D0PKX1LH8C.webp" alt=""><figcaption></figcaption></figure>

## Chuỗi sự kiện và chuỗi lời gọi

Tương tác giữa các microservices trong môi trường SOA diễn ra thông qua chuỗi sự kiện (event chain) hoặc chuỗi lời gọi (call chain):

* **Chuỗi sự kiện:** Các microservices tương tác bất đồng bộ, kích hoạt sự kiện mà không chờ phản hồi.
* **Chuỗi lời gọi:** Các microservices gọi lẫn nhau một cách đồng bộ, chờ phản hồi rồi mới tiếp tục.

Những chuỗi này cho phép xây dựng các chức năng phức tạp — chẳng hạn chuỗi chào đón hành khách — bằng cách điều phối nhiều microservices với nhau.

<figure><img src="/sdv101/q2YanK3Ryea5rQeTrh7H.webp" alt=""><figcaption></figcaption></figure>

## Ánh xạ mô hình sang môi trường thực thi

Microservices trong SDV dựa trên nhiều môi trường thực thi khác nhau, chẳng hạn:

* **Vi điều khiển (Microcontroller):** Bộ xử lý thời gian thực, chi phí thấp, dùng cho các tác vụ trọng yếu về an toàn như phanh và bung túi khí.
* **Vi xử lý (Microprocessor):** CPU hiệu năng cao, dùng cho tác vụ AI, xử lý ảnh và infotainment.
* **FPGA:** Mảng logic lập trình được, dùng cho các tác vụ chuyên biệt đòi hỏi tốc độ xử lý cao.

Mỗi môi trường thực thi có thể có hệ điều hành và middleware riêng, chuyên dụng — ví dụ hệ điều hành thời gian thực cho vi điều khiển và các hệ thống nền Linux cho vi xử lý.

<figure><img src="/sdv101/jqzAILTincJso6UM5Rhv.webp" alt=""><figcaption></figcaption></figure>

## Ví dụ hiện thực cụ thể: Mở cửa xe

Microservices trong SOA của xe có thể được hiện thực bằng nhiều mô hình khác nhau, tùy vào bản chất của chức năng cần có. Một cách tiếp cận đơn giản là dùng mã viết tay, trong đó lập trình viên tự viết mã riêng để hiện thực dịch vụ mong muốn. Chẳng hạn, một microservice có thể truy cập cơ sở dữ liệu nội bộ của xe, thực hiện tính toán dựa trên dữ liệu lấy được, rồi trả về kết quả — ví dụ xử lý tín hiệu cảm biến hoặc quản lý tùy chọn của người dùng.

Một mô hình hiện thực khác là microservices dựa trên AI. Trong trường hợp này, một mô hình AI đã huấn luyện được tích hợp vào microservice để thực hiện suy luận trên dữ liệu thực tế. Hãy xét chuỗi chào đón hành khách: hệ thống có thể dùng một microservice dựa trên AI để phân tích dữ liệu video từ camera phía sau, phát hiện xe đạp đang tới gần và nhận diện các mối nguy tiềm ẩn.

Mô hình toán học là một phương thức hiện thực nữa. Các mô hình này đảm nhiệm những tính toán phức tạp, chẳng hạn dự đoán quỹ đạo của chiếc xe đạp dựa trên dữ liệu phân tích hình ảnh. Trước tiên, một mô hình AI sẽ phát hiện và bám theo chuyển động của xe đạp qua một chuỗi khung hình video. Sau đó, mô hình toán học tương ứng sẽ tính toán quỹ đạo tương lai, giúp xác định xem việc mở cửa xe có an toàn hay không.

Mô hình trạng thái đặc biệt hữu ích để quản lý các chuyển trạng thái hữu hạn bên trong xe. Ví dụ, một microservice có thể quản lý các trạng thái khác nhau của cửa xe, bao gồm khóa, mở khóa, mở và đóng. Việc quản lý trạng thái này bảo đảm rằng các tổ hợp logic giữa vị trí cửa và cửa sổ luôn nhất quán và an toàn trong quá trình vận hành xe.

Bằng cách kết hợp các mô hình này — mã viết tay, suy luận AI, tính toán toán học và quản lý trạng thái — các hệ thống SOA của xe có thể hỗ trợ những chức năng phức tạp như chuỗi chào đón hành khách. Mỗi kiểu hiện thực đảm nhận một vai trò riêng, tạo nên một hệ thống bền vững, mô-đun hóa và có khả năng mở rộng, đủ sức xử lý các tác vụ ô tô tinh vi.

### Phần nhúng

Để hiểu chức năng mở cửa được hiện thực ra sao trong môi trường nhúng, hãy xem xét một kiến trúc dựa trên Autosar Classic. Ở trung tâm là vi điều khiển, một thành phần phần cứng gồm CPU, bộ nhớ và các ngoại vi cần thiết để chạy phần mềm nhúng của xe. Vi điều khiển này đóng vai trò nền tảng thực thi cho hệ thống nhúng.

<figure><img src="/sdv101/RCKiHGFewYrt7cvNuIvy.webp" alt=""><figcaption></figcaption></figure>

Để phần mềm giữ được tính khả chuyển và dễ thích ứng trên các vi điều khiển khác nhau, lớp Microcontroller Abstraction Layer (MCAL) chuẩn hóa giao diện giữa phần cứng và các lớp phần mềm cấp cao hơn. Lớp trừu tượng này đơn giản hóa việc truy cập phần cứng bằng cách đóng gói các chi tiết phần cứng cấp thấp, nhờ đó phần mềm có thể chuyển đổi giữa các nền tảng.

Nằm trên MCAL là ECU Abstraction Layer, cung cấp một giao diện thống nhất tới các thành phần phần cứng đặc thù của ECU như cảm biến cửa và cơ cấu chấp hành. Lớp này trừu tượng hóa các hiện thực phụ thuộc phần cứng, giúp các lớp phần mềm cấp cao hơn dễ dàng tương tác với nhiều thành phần khác nhau bất kể chi tiết kỹ thuật riêng của chúng.

Phía trên ECU Abstraction Layer là Service Layer, cung cấp các dịch vụ ở phạm vi toàn hệ thống như giao thức truyền thông, chẩn đoán và quản lý bộ nhớ. Lớp này bảo đảm sự tương tác liền mạch giữa các chức năng ECU khác nhau, độc lập với phần cứng cụ thể.

Những thành phần phần cứng chuyên biệt như LiDAR hay hệ thống quản lý pin có thể cần các driver riêng, gọi là complex device drivers. Chúng mở rộng framework Autosar tiêu chuẩn bằng cách hỗ trợ các chức năng phần cứng chuyên biệt vượt ra ngoài những gì Autosar hỗ trợ sẵn.

Trên cùng của ngăn xếp phần mềm là Runtime Environment và Application Layer. Runtime Environment đóng vai trò middleware, hỗ trợ giao tiếp giữa các ứng dụng do người dùng định nghĩa và các thành phần phần mềm bên dưới. Application Layer chứa các chức năng đặc thù của xe, chẳng hạn quản lý khóa cửa, cửa sổ và gương.

Với ví dụ mở cửa, một mô hình trạng thái trong Application Layer có thể quản lý các trạng thái cửa khác nhau như khóa, mở khóa, mở và đóng. Mô hình này sẽ điều phối tương tác với các lớp phần mềm bên dưới, bảo đảm các thao tác cửa tuân thủ những quy tắc an toàn và vận hành đã định. Cách tiếp cận có cấu trúc này, được hậu thuẫn bởi kiến trúc mô-đun của Autosar Classic, giúp việc quản lý các chức năng xe phức tạp vừa có khả năng mở rộng vừa dễ bảo trì.

### Góc nhìn end-to-end

Để minh họa kiến trúc end-to-end của một hệ thống xe, hãy xét một tình huống sử dụng điển hình: một ứng dụng trên smartphone kích hoạt sự kiện mở cửa xe.

<figure><img src="/sdv101/D96LhB6nDz4m17KkJDoI.webp" alt=""><figcaption></figcaption></figure>

Quy trình bắt đầu từ smartphone, nơi ứng dụng chạy trên một hệ điều hành và ngăn xếp ứng dụng tiêu chuẩn. Khi người dùng khởi phát lệnh mở cửa, ứng dụng sẽ giao tiếp với một microservice trên cloud, thường được vận hành trong một môi trường runtime trên cloud cũng dựa trên hệ điều hành và ngăn xếp ứng dụng tiêu chuẩn.

Từ cloud, lệnh được chuyển tiếp xuống hệ thống on-board của xe, nơi có sẵn một môi trường tính toán hiệu năng cao. Môi trường này thường chạy một hệ điều hành ảo hóa, có khả năng vận hành các microservices đóng gói trong container. Trong thiết lập này, microservices thực thi bên trong một container runtime do các nền tảng điều phối kiểu Kubernetes quản lý.

Bước tiếp theo là xử lý bản tin thông qua một dịch vụ middleware, chẳng hạn message broker KUKSA. Broker này bảo đảm giao tiếp an toàn và tin cậy giữa cloud và các hệ thống on-board.

<figure><img src="/sdv101/7ql1hcxKI4qnDYa17WSp.webp" alt=""><figcaption></figcaption></figure>

Sau khi lệnh được xác thực, hệ thống on-board của xe thực hiện một loạt kiểm tra an toàn trước khi mở khóa hay mở cửa. Các kiểm tra an toàn bắt đầu bằng việc xác minh xe có đang đứng yên hay không — yêu cầu này được thực thi thông qua tích hợp với nền tảng Autosar. Nếu xe không di chuyển, hệ thống kích hoạt camera phía sau, dùng nhận dạng hình ảnh bằng AI để phát hiện những vật thể hay người đi bộ đang tới gần có thể gặp rủi ro trong quá trình mở cửa.

Tiếp theo, camera bên hông quét các chướng ngại vật sát hai bên xe, bảo đảm cửa sẽ không va phải vật gì khi mở. Nếu mọi kiểm tra đều đạt, hệ thống sẽ giao tiếp với ECU phụ trách thông qua lớp truyền thông tuân thủ Autosar. ECU gửi lệnh cuối cùng tới cơ cấu chấp hành của cửa, mở khóa và mở cửa theo yêu cầu.

Trong các kiến trúc tiên tiến, những chuỗi sự kiện này kết hợp liền mạch các thao tác trên cloud và on-board, tận dụng cả vi điều khiển lẫn vi xử lý. Với các tác vụ trọng yếu về an toàn như phanh khẩn cấp hay điều khiển cơ cấu chấp hành, các vi điều khiển được chứng nhận cho chức năng mức ASIL D bảo đảm độ tin cậy tối đa. Trong khi đó, vi xử lý đảm nhận các tác vụ phức tạp có AI như nhận thức môi trường, hợp nhất cảm biến và hoạch định đường đi, dù những thành phần này thường vận hành ở mức đánh giá ít nghiêm ngặt hơn là QM hoặc ASIL A.

Kiến trúc này cho thấy rõ mức độ phức tạp của các SOA xe hiện đại, nơi cloud, edge và hệ thống nhúng phải phối hợp với nhau để bảo đảm an toàn, chức năng và trải nghiệm người dùng nhạy bén.
