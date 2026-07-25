---
title: "#DigitalFirst"
description: "Cách tiếp cận #DigitalFirst trong phát triển SDV: shift north tách kiến trúc và tổ chức, shift left đưa kiểm thử, mô phỏng và tuân thủ quy định lên sớm, tạo luồng giá trị đa tốc độ."
order: 37
part: "D"
depth: 1
origTitle: "#DigitalFirst"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/digitalfirst"
---

## Từ khối xây dựng đến luồng giá trị

Ở phần trước, chúng ta đã giới thiệu khái niệm loose coupling (liên kết lỏng) qua phép ẩn dụ hộp cơm bento nhằm làm nổi bật tầm quan trọng của tính mô-đun và tính độc lập trong kiến trúc hệ thống. Các ngăn của hộp bento tượng trưng cho cách chúng ta dùng mô-đun hóa và phân lớp hệ thống để tạo nên một hệ thống gắn kết — một nguyên tắc then chốt đối với các xe software-defined hiện đại.

<figure><img src="/sdv101/y87LH7CvosveT20o92ll.webp" alt=""><figcaption></figcaption></figure>

Giờ đây, khi chuyển sang chiến lược triển khai, chúng ta dịch chuyển trọng tâm từ kiến trúc hệ thống sang các luồng giá trị (value stream), thể hiện qua quy trình và tổ chức. Đây là lúc phép ẩn dụ nhà hàng phát huy tác dụng. Khác với các ngăn tĩnh của hộp bento, một nhà hàng vận hành như một quy trình động, kết hợp nguyên liệu thô thành những món ăn được tùy biến theo yêu cầu. Góc nhìn này phản ánh cách các tổ chức và đội ngũ cần phối hợp một cách linh hoạt và hiệu quả để liên tục tạo ra giá trị trong một môi trường thay đổi nhanh chóng.

Hai phép ẩn dụ hộp bento và nhà hàng đi liền với nhau: trong khi hộp bento cho thấy cách thiết kế kiến trúc đã được decoupling, nhà hàng làm nổi bật các quy trình và cấu trúc tổ chức cần thiết để thực thi kiến trúc đó một cách hiệu quả. Cùng nhau, chúng tạo nền tảng cho việc shift north trong kiến trúc và shift left trong quy trình phát triển — hai yếu tố then chốt để xây dựng những chiếc xe software-defined linh hoạt.

Trong một tổ chức phát triển software-defined vehicle (SDV — xe được định nghĩa bằng phần mềm), các luồng giá trị vận hành ở nhiều tốc độ khác nhau để đáp ứng hiệu quả những nhu cầu đa dạng. Như minh họa trong hình dưới đây, có hai luồng riêng biệt nhưng bổ trợ cho nhau:

1. **Agile Value Stream (luồng giá trị linh hoạt)**: Luồng này tập trung vào những cải tiến nhanh, liên tục cho các feature cần cập nhật thường xuyên và có yêu cầu an toàn thấp hơn. Các quy trình agile ở đây nhấn mạnh việc phát hành sản phẩm khả dụng tối thiểu, lặp nhanh và bổ sung cải tiến ở phía bắc của lớp trừu tượng hóa phần cứng. Những phát triển này lý tưởng cho các mảng không có ràng buộc thời gian thực cứng, cho phép linh hoạt và thử nghiệm.
2. **Safe Value Stream (luồng giá trị an toàn)**: Luồng này đề cao cách tiếp cận "đúng ngay từ lần đầu" đối với các hệ thống có yêu cầu an toàn cao hoặc yêu cầu thời gian thực cứng. Ở đây, trọng tâm là hoạch định dài hạn, tính ổn định và một môi trường đã được củng cố hoàn toàn, bởi các phát triển này thường liên quan đến những thành phần nằm ở phía nam của lớp trừu tượng hóa phần cứng. Luồng này hỗ trợ các hệ thống có mức ASIL cao, bảo đảm độ tin cậy và sự tuân thủ các tiêu chuẩn an toàn nghiêm ngặt.

Cùng nhau, hai luồng giá trị này giúp một tổ chức đa tốc độ cân bằng giữa tính linh hoạt và tính an toàn, bảo đảm phát triển hiệu quả cả những feature số mang tính thăm dò lẫn các hệ thống trọng yếu trong SDV.

<figure><img src="/sdv101/uKMynnKvYBM0vraxRgt3.webp" alt=""><figcaption></figcaption></figure>

## Hai dịch chuyển then chốt cho SDV: Shift-Left và Shift-North

Cách tiếp cận #digitalfirst dựa trên hai chiến lược nền tảng để đạt được hiệu quả và tính linh hoạt trong phát triển software-defined vehicle (SDV): **shift north** và **shift left**, như minh họa trong sơ đồ. Theo cách hiểu truyền thống, thuật ngữ "shift north" chỉ việc dịch chuyển chức năng lên phía trên trong ngăn xếp kiến trúc, tức là phía bắc của Vehicle Hardware Abstraction Layer (VHAL). Tuy nhiên, trong bối cảnh này, "shift north" còn nói về **decoupling ở cấp tổ chức**. Bằng cách tách các luồng giá trị nhanh, agile khỏi các quy trình chậm hơn, mang tính an toàn trọng yếu, tổ chức có thể triển khai mô hình phát triển đa tốc độ. Các luồng agile tập trung vào cải tiến liên tục, còn các luồng an toàn trọng yếu nhấn mạnh sự ổn định và độ tin cậy; cả hai cùng tồn tại nhưng tiến hóa độc lập ở phía trên và phía dưới VHAL.

Ngược lại, "shift left" nhấn mạnh việc **kiểm thử và xác nhận sớm trong môi trường số**, qua đó giảm đáng kể sự phụ thuộc vào nguyên mẫu vật lý và các thiết lập thử nghiệm vật lý. Bằng cách mô phỏng và xác nhận thiết kế sớm hơn trong quy trình phát triển, tổ chức có thể tránh những chậm trễ tốn kém và rút ngắn thời gian đưa sản phẩm ra thị trường.

<figure><img src="/sdv101/2jWR8gk6xRNMT5ZwFNsn.webp" alt=""><figcaption></figcaption></figure>

Cùng nhau, hai dịch chuyển này tạo nên tư duy digital-first, trong đó các quy trình đã được decoupling và việc kiểm thử sớm giúp các đội ngũ đi nhanh hơn và đổi mới trong khi vẫn duy trì chất lượng và an toàn.

## Shift North

Khái niệm **Shift North** nói về việc dịch chuyển chức năng từ các môi trường ASIL an toàn trọng yếu, nhúng sâu và lấy phần cứng làm trung tâm sang các môi trường QM linh hoạt hơn, hướng phần mềm.

<figure><img src="/sdv101/FW59gFBK2WqkqTp3mvy0.webp" alt=""><figcaption></figcaption></figure>

Như thể hiện trong sơ đồ, các môi trường ASIL dựa vào những cách tiếp cận có cấu trúc như V-Model, hệ thống thời gian thực và model-based systems engineering (MBSE) để đáp ứng các yêu cầu an toàn nghiêm ngặt. Bằng cách shift north, những thành phần không thuộc diện an toàn trọng yếu được decoupling và chuyển sang môi trường QM, mở đường cho các phương pháp agile, cập nhật nhanh hơn, tích hợp cloud và phát triển sản phẩm khả dụng tối thiểu (MVP). Dịch chuyển này được hỗ trợ bởi Vehicle Hardware Abstraction Layer (VHAL), vốn bảo đảm tính mô-đun đồng thời tạo điều kiện cho đổi mới nhanh ở phía trên lớp phần cứng.

Khái niệm "shift north" trong software-defined vehicle bao gồm ba cấp độ riêng biệt: kiến trúc E/E, môi trường phần mềm, và sự tích hợp giữa hệ thống on-board và off-board.&#x20;

<figure><img src="/sdv101/v7hVuuwCrbbPAzLPnW3t.webp" alt=""><figcaption></figcaption></figure>

Mỗi dạng shift north giải quyết những thách thức riêng, hướng tới một kiến trúc hệ thống xe tập trung hơn, linh hoạt hơn và hiệu quả hơn.

### **Shift North ở cấp E/E**

Ở cấp kiến trúc điện và điện tử (E/E), shift north là việc chuyển trách nhiệm từ các ECU chuyên dụng phân tán cùng những cảm biến hay cơ cấu chấp hành ngoại vi sang một kiến trúc tính toán tập trung. Cách làm này giảm sự phụ thuộc vào nhiều thiết bị có năng lực thấp, thay vào đó tận dụng một hệ thống tính toán hiệu năng cao mang tính tập trung. Bằng cách hợp nhất năng lực xử lý, cách tiếp cận này nâng cao khả năng mở rộng, đơn giản hóa kiến trúc và cho phép những năng lực xử lý tiên tiến hơn trong một khuôn khổ tập trung.

### **Shift North ở cấp phần mềm**

Về phía phần mềm, shift north là việc chuyển các chức năng từ môi trường ASIL an toàn trọng yếu sang môi trường QM linh hoạt hơn. Bằng cách decoupling các chuỗi sự kiện và cô lập những thành phần không thuộc diện an toàn trọng yếu, các chức năng này có thể được xử lý trong những môi trường tính toán ở tầng cao hơn. Việc decoupling này cho phép lặp nhanh hơn, cải tiến liên tục và cập nhật linh hoạt hơn cho các thành phần không thuộc ASIL. Các lớp trừu tượng hóa phần cứng (như VHAL) đóng vai trò then chốt trong việc hỗ trợ dịch chuyển này, bảo đảm các thành phần phần mềm có thể hoạt động độc lập với những ràng buộc của phần cứng bên dưới.

### **Shift North từ On-board sang Off-board**

Trong một số trường hợp, shift north vượt ra ngoài hệ thống on-board để bao gồm cả xử lý off-board trên cloud. Bằng cách đưa một số chức năng hoặc phép tính ra off-board, kiến trúc có thể tận dụng tài nguyên cloud cho khả năng mở rộng, cập nhật nhanh hơn và phân tích nâng cao. Cách tiếp cận này hỗ trợ một mô hình lai, trong đó hệ thống on-board quản lý các chức năng thời gian thực và an toàn trọng yếu, còn cloud đảm nhận những tác vụ phức tạp hơn nhưng không trọng yếu như suy luận AI, xử lý dữ liệu quy mô lớn hay cập nhật feature.

Cùng nhau, ba cấp độ shift north này — kiến trúc E/E, phần mềm, và on-board sang off-board — tạo nên một kiến trúc hệ thống mô-đun hơn, mềm dẻo hơn và linh hoạt hơn, cho phép đổi mới nhanh hơn và bám sát hơn nhu cầu của software-defined vehicle.

## Shift Left

Cách tiếp cận "shift left" nhấn mạnh tầm quan trọng của việc xử lý chất lượng ngay từ sớm trong quy trình phát triển, như minh họa trong sơ đồ. Các mô hình chất lượng truyền thống, thể hiện bằng đường cong màu đỏ, tập trung chủ yếu vào việc phát hiện và sửa lỗi ở những giai đoạn sau của triển khai và vận hành — vốn vừa tốn thời gian vừa tốn kém, đắt hơn tới 640 lần theo số liệu của NIST.

<figure><img src="/sdv101/eRpWm8EWVe4O2zTlO7tK.webp" alt=""><figcaption></figcaption></figure>

Ngược lại, mô hình shift-left ưu tiên đưa việc bảo đảm chất lượng vào các giai đoạn sớm hơn là hoạch định, thiết kế và xây dựng. Chiến lược chủ động này giảm rủi ro, rút ngắn tiến độ bàn giao và hạ đáng kể chi phí sửa lỗi nhờ bảo đảm các vấn đề được xử lý từ lâu trước khi chúng trở nên phức tạp.

### **Xác nhận trải nghiệm người dùng: tạo nguyên mẫu ở giai đoạn sớm**

Shift left bắt đầu bằng việc xác nhận trải nghiệm người dùng càng sớm càng tốt. Thay vì chờ đợi các nguyên mẫu vật lý vốn mất hàng tháng, thậm chí hàng năm, việc tạo nguyên mẫu ở giai đoạn sớm sử dụng các công cụ như mô phỏng nhanh trên cloud, thực tế ảo và digital twin để kiểm thử các ý tưởng UX. Điều này giúp các đội ngũ phát hiện vấn đề về khả năng sử dụng và tinh chỉnh trải nghiệm trên xe trong môi trường ảo, bảo đảm những thiết kế lấy khách hàng làm trung tâm được xác nhận từ rất lâu trước khi bắt đầu phát triển vật lý.

### **Xác nhận hệ thống: mô phỏng và ảo hóa**

Mô phỏng và ảo hóa đóng vai trò then chốt trong việc đưa hoạt động xác nhận hệ thống lên sớm hơn trong quy trình phát triển. Bằng cách tạo ra các mô hình số hết sức chi tiết của linh kiện và hệ thống, kỹ sư có thể tái hiện các kịch bản thực tế mà không cần dựa vào nguyên mẫu vật lý. Cách tiếp cận này rút ngắn chu kỳ kiểm thử, hỗ trợ phát triển song song và bảo đảm các yêu cầu chức năng được đáp ứng, đồng thời giảm cả thời gian lẫn chi phí vốn gắn liền với việc xác nhận dựa trên phần cứng.

### **Continuous Integration: tự động hóa từ ngày đầu tiên**

Continuous Integration (CI) đưa tự động hóa vào pipeline phát triển ngay từ đầu. Khi áp dụng các thực hành CI, lập trình viên có thể thường xuyên tích hợp thay đổi mã nguồn vào một repository dùng chung, kích hoạt ngay lập tức các bản build và bài kiểm thử tự động. Vòng phản hồi sớm này giúp phát hiện và xử lý lỗi nhanh chóng, ngăn những khoản chi phí sửa lỗi tốn kém ở giai đoạn muộn, đồng thời thúc đẩy sự phối hợp giữa các đội ngũ. Với CI, chất lượng phần mềm được cải thiện đều đặn trong suốt vòng đời dự án.

### **Continuous Homologation: kiểm thử ảo**

Shift left trong bối cảnh tuân thủ quy định được hỗ trợ bởi continuous homologation thông qua kiểm thử ảo. Bằng cách tận dụng các môi trường mô phỏng và công cụ ảo hóa, việc kiểm tra tuân thủ quy định có thể được thực hiện sớm hơn nhiều trong quy trình. Điều này giảm sự phụ thuộc vào xe thử nghiệm vật lý và cho phép lặp nhanh hơn để bảo đảm an toàn, tuân thủ và độ tin cậy. Continuous homologation bảo đảm các feature và bản cập nhật mới được xác nhận một cách hiệu quả, mở đường cho việc triển khai nhanh chóng mà vẫn giữ được các tiêu chuẩn nghiêm ngặt.

## Kết luận

Tóm lại, cách tiếp cận *#digitalfirst* kết hợp hai dịch chuyển về kiến trúc và tổ chức — *Shift North* và *Shift Left* — để thay đổi cách thức phát triển software-defined vehicle. Bằng cách decoupling các hệ thống, tận dụng việc xác nhận sớm thông qua mô phỏng và ảo hóa, cùng với việc áp dụng continuous integration và continuous homologation, các tổ chức có thể đạt được chu kỳ phát triển nhanh hơn, hiệu quả hơn và tiết kiệm chi phí hơn. Chiến lược này tạo điều kiện cho các luồng giá trị đa tốc độ, cân bằng giữa đổi mới linh hoạt với những đòi hỏi khắt khe về an toàn và độ tin cậy của hệ thống ô tô. Cùng nhau, các nguyên tắc này đặt nền móng cho tư duy digital-first, bảo đảm rằng việc phát triển SDV không chỉ được đẩy nhanh mà còn sẵn sàng cho tương lai.

<figure><img src="/sdv101/Vq99Oaz3kwFUmvDUq6xB.webp" alt=""><figcaption></figcaption></figure>
