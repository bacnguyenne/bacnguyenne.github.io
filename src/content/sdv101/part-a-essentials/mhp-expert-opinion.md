---
title: "MHP: Ý kiến chuyên gia"
description: "Góc nhìn chuyên gia của MHP về SDV: phân lớp phần cứng/phần mềm, dịch chuyển kiến trúc E/E sang zonal, API chuẩn hóa, ba cấp độ SDV và mô hình phân phối hai tốc độ."
order: 5
part: "A"
depth: 1
origTitle: "MHP: Expert Opinion"
origUrl: "https://www.sdv.guide/sdv101/part-a-essentials/mhp-expert-opinion"
---

Quá trình chuyển đổi sang SDV không chỉ đòi hỏi sự tiến hóa về công nghệ mà còn cả sự linh hoạt trong tổ chức và tầm nhìn chiến lược. **Augustin Friedel** (Senior Manager tại MHP - A Porsche Company) đã đóng góp nội dung cho chương này nhằm giúp các OEM vượt qua thách thức và khai mở tiềm năng của mô hình mang tính thay đổi cuộc chơi này.

## Software-defined Vehicle

Software-Defined Vehicle (SDV - xe được định nghĩa bằng phần mềm) được xem là yếu tố thay đổi cuộc chơi trong ngành ô tô. Mục tiêu của nó là đáp ứng kỳ vọng ngày càng cao của khách hàng về các feature và chức năng. Bản thân thuật ngữ "Software-Defined Vehicle" (SDV) do ngành ô tô đặt ra và thường không được dùng trong hoạt động marketing hướng tới khách hàng.

<figure><img src="/sdv101/aOybqlV5OFRshGeb98a3.webp" alt=""><figcaption></figcaption></figure>

Nguyên lý cốt lõi của SDV là chuyển từ phần mềm nhúng chặt vào phần cứng sang một mô hình trong đó phần mềm được tách rời hoàn toàn khỏi phần cứng. Điều này tạo ra một lớp trừu tượng phục vụ việc điều khiển và quản lý. Giống như điện thoại thông minh, máy tính cá nhân hay máy tính bảng, SDV có một lớp phần cứng nền tảng, bên trên đó là một hệ điều hành (OS) vận hành, cho phép quản lý phần mềm và feature một cách linh hoạt. Các hệ điều hành như iOS, Android, Linux hoặc các nền tảng độc quyền khác chính là nền móng cho sự đổi mới này trên xe.

Để tiến về phía trước, SDV được hình dung theo các lớp. **Lớp nền tảng** gồm phần cứng của xe (ví dụ: cảm biến, máy tính hiệu năng cao, cơ cấu chấp hành, pin và hệ thống dây dẫn), cùng với phần mềm cốt lõi của xe như hệ điều hành. Bên trên đó, **các lớp hướng khách hàng** bao gồm các thành phần UX/UI gắn với cockpit thông minh, phần mềm trên xe, trí tuệ theo ngữ cảnh và trí tuệ nhân tạo.

Một yếu tố hỗ trợ then chốt cho SDV là **tích hợp cloud**, giúp kết nối xe với các thiết bị bên ngoài như điện thoại thông minh và cho phép xây dựng digital twin. Sự tích hợp này bảo đảm việc phân phối feature cho cockpit diễn ra trơn tru, quản lý hệ sinh thái của xe và tăng cường khả năng kết nối với môi trường bên ngoài.

## Sự dịch chuyển trong E/E-Architecture

Quá trình tiến hóa hướng tới SDV gắn liền với sự dịch chuyển trong kiến trúc Điện/Điện tử (E/E). Trước đây, xe sử dụng kiến trúc phân tán với hơn 150 ECU trải rộng trên nhiều vùng khác nhau của xe. Tuy nhiên, các thiết kế hiện đại hướng tới việc hợp nhất năng lực tính toán vào **kiến trúc zonal hoặc tập trung**.

<figure><img src="/sdv101/XWHbh56YeO6YHIgdlWlj.webp" alt=""><figcaption></figcaption></figure>

Kiến trúc zonal giảm số lượng ECU bằng cách nhóm chúng theo từng vùng, giúp tinh gọn quá trình truyền thông và tính toán. Sự dịch chuyển này nâng cao hiệu quả chi phí, đơn giản hóa việc tích hợp và hỗ trợ mức độ chuẩn hóa cao hơn. Mặc dù kiến trúc tập trung là đích đến cuối cùng của nhiều OEM, các mô hình chuyển tiếp như kiến trúc domain hiện đại vẫn đóng vai trò là bước trung gian. Việc lựa chọn giữa các hướng tiếp cận này phụ thuộc vào ưu tiên chiến lược, ngân sách và năng lực của từng OEM.

Quản trị đóng vai trò then chốt trong việc điều hành quá trình chuyển đổi này. Các OEM phải tổ chức bộ máy của mình một cách hiệu quả để giải quyết các thách thức khi chuyển sang kiến trúc E/E hiện đại, đồng thời bảo đảm lộ trình phát triển phù hợp với nhu cầu thị trường.

## E/E + SDV

Việc kết hợp kiến trúc E/E với các nguyên lý SDV tạo điều kiện cho một cách tiếp cận thống nhất trong thiết kế xe. **API chuẩn hóa** là yếu tố hỗ trợ then chốt cho sự tích hợp này, thu hẹp khoảng cách giữa phần cứng và phần mềm. Các API này đơn giản hóa quá trình tích hợp, giảm chi phí và tạo ra một hệ thống module có thể thích ứng với yêu cầu của khách hàng theo thời gian.

<figure><img src="/sdv101/NtA86VeoPwijME1RW1nh.webp" alt=""><figcaption></figcaption></figure>

Bằng cách tách rời lớp phần cứng nền tảng khỏi các feature và chức năng hướng người dùng, nhà sản xuất có thể đạt được mức linh hoạt cao hơn. Chẳng hạn, các feature như cockpit số và cá nhân hóa dựa trên AI có thể được cập nhật độc lập với việc nâng cấp phần cứng, giúp xe duy trì tính cạnh tranh trong suốt vòng đời của mình.

## Mỗi OEM có nhịp thay đổi khác nhau

Ngành ô tô đang chứng kiến mức độ tiến triển khác nhau giữa các OEM trong việc áp dụng các nguyên lý SDV. Dựa trên **Gartner Digital Automaker Index 2024**, các OEM được phân thành ba nhóm:

1. **Leaders**: Các công ty, đặc biệt tại Trung Quốc, đang dẫn đầu về công nghệ SDV nhập vai (immersive), tận dụng AI và tích hợp cloud.
2. **Middle Field**: Chủ yếu là các OEM từ Nhật Bản, Hàn Quốc và một phần châu Âu, đang chuyển dịch từ các feature xe thông minh sang tích hợp SDV đầy đủ.
3. **Challengers**: Các OEM vẫn đang tập trung vào những năng lực xe thông minh cơ bản, chẳng hạn cập nhật OTA và app store thế hệ đầu.

Trung Quốc, với các thương hiệu như Huawei, Xiaomi và JiYue, đã vượt Tesla ở nhiều mảng phát triển SDV, đặc biệt là không gian sống số nhập vai. Lợi thế khu vực này bắt nguồn từ việc tập trung vào các feature dựa trên AI, cockpit thông minh và chu kỳ phát triển phần mềm nhanh.

<figure><img src="/sdv101/ug1d0pAH56fSWbUymTSs.webp" alt=""><figcaption></figcaption></figure>

## Các cấp độ của SDV

SDV có thể được phân thành ba cấp độ tăng dần:

1. **Smart Cars**: Xe cung cấp cập nhật OTA cơ bản, app store và khả năng tùy biến hạn chế.
2. **Software-Defined Vehicles**: Loại xe này có các bản phát hành OS kiểu điện thoại thông minh, khả năng tương thích ngược rộng và năng lực tính toán linh hoạt.
3. **Immersive SDVs**: Được tích hợp trọn vẹn với AI và trí tuệ theo ngữ cảnh, những chiếc xe này mang lại kết nối cloud liền mạch và các feature tiên tiến nhất. Immersive SDV chủ yếu xuất hiện ở các thị trường tiên tiến như Trung Quốc, trong khi châu Âu và Mỹ vẫn đang trong giai đoạn chuyển tiếp.

## Mô hình phân phối hai tốc độ

Để quản lý độ phức tạp của quá trình phát triển SDV, các OEM áp dụng **mô hình phân phối hai tốc độ**: Fast Cycle và Slower Cycle. Cách tiếp cận này cho phép nhà sản xuất vừa đáp ứng nhu cầu đổi mới nhanh, vừa bảo đảm yêu cầu phát triển nền tảng vững chắc.

<figure><img src="/sdv101/sZmFDk7U5Gk2ImueoM2J.webp" alt=""><figcaption></figcaption></figure>

### **Fast Cycle**

Chu kỳ nhanh tập trung vào phát triển feature, tận dụng **DevOps** và **các phương pháp agile**. Cách tiếp cận này cho phép lặp nhanh và đưa feature mới ra thị trường nhanh hơn. Các yếu tố chính gồm:

* CI/CD pipeline để tinh gọn quá trình phát triển và tích hợp.
* Chiến lược Shift-North nhằm tăng tốc đổi mới và triển khai feature.

### **Slower Cycle**

Chu kỳ chậm liên quan đến phát triển ở cấp nền tảng, sử dụng các mô hình kỹ thuật hệ thống như **mô hình chữ V (V-model)**. Cách tiếp cận **shift-left** bảo đảm phát hiện và xử lý vấn đề sớm trong quá trình phát triển, giảm thiểu các chi phí khắc phục tốn kém về sau. Khung hai tốc độ này giúp các OEM cân bằng giữa việc phân phối feature nhanh và phát triển nền tảng vững chắc.
