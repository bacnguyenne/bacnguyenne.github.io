---
title: "Hệ thống kiểm thử vật lý"
description: "Tổng quan các hệ thống kiểm thử vật lý trong ngành ô tô: component HIL, System HIL và House of HIL, engineering mule, xe mẫu A-D, Vehicle-in-the-Loop và kiểm thử đội xe."
order: 50
part: "D"
depth: 2
origTitle: "Physical test system"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/implementing-the-shift-left/physical-test-system"
---

Mặc dù **ảo hóa** và các **chiến lược shift-left** giúp giảm đáng kể chi phí và công sức cho kiểm thử vật lý, kiểm thử vật lý vẫn là thứ **không thể thay thế** để bảo đảm hiệu năng, an toàn và độ bền trong điều kiện thực tế. Môi trường thực tế đưa vào những biến số như rung động, hao mòn và các tình huống biên mà mô phỏng không thể tái tạo trọn vẹn. Kiểm thử vật lý cũng kiểm chứng các **tích hợp phức tạp** giữa phần cứng và phần mềm dưới áp lực vận hành thực. Bằng cách kết hợp kiểm thử ảo và kiểm thử vật lý, các nhà sản xuất không chỉ rút ngắn được chu kỳ phát triển mà còn đạt được độ bền vững và độ tin cậy cần thiết cho những **chiếc xe an toàn, chất lượng cao** lăn bánh trên đường.

Trong kiểm thử ô tô, các hệ thống kiểm thử vật lý bảo đảm việc kiểm chứng các cụm chi tiết và hệ thống của xe trong điều kiện thực tế. Các loại chính bao gồm:

1. **Component HIL (Hardware-in-the-Loop)**: Các thành phần phần cứng thật (ví dụ ECU, cảm biến, cơ cấu chấp hành) được kiểm thử trong môi trường ảo mô phỏng hành vi và điều kiện của xe.
2. **System HIL:** Tích hợp nhiều thành phần thành các hệ thống con (ví dụ powertrain hoặc ADAS) để kiểm chứng đầu-cuối.
3. **Xe phát triển (Development Vehicles)**: Các nguyên mẫu tiền sản xuất dùng để kiểm thử hiệu năng thực tế và mức độ tích hợp giữa các hệ thống.
4. **Engineering Mules**: Xe thử nghiệm được cải tạo, kết hợp các thành phần mới với nền tảng sẵn có để đánh giá tính khả thi.
5. **Kiểm thử theo đội xe (Fleet-Based Testing)**: Vận hành thực tế nhiều xe để thu thập dữ liệu theo thời gian, phục vụ phân tích độ tin cậy và hiệu năng.

Mỗi hệ thống nêu trên đóng một vai trò thiết yếu trong việc thu hẹp khoảng cách giữa mô phỏng và điều kiện thực tế, bảo đảm hiệu năng bền vững cho chiếc xe.

## Kiểm thử Hardware-in-the-Loop

**Hardware-in-the-Loop (HIL)** là phương pháp kiểm thử trong đó các thành phần phần cứng thật, chẳng hạn ECU và cảm biến, được tích hợp vào một môi trường ảo. Môi trường ảo này mô phỏng phần còn lại của chiếc xe, các hệ thống con của nó, hoặc các điều kiện vận hành thực tế như những kịch bản lái xe. Kiểm thử HIL cho phép kiểm chứng các hệ thống trong điều kiện gần với thực tế mà không cần một chiếc xe vật lý hoàn chỉnh. Điều này giúp tăng tốc đáng kể quá trình phát triển, giảm chi phí và bảo đảm các thành phần quan trọng về an toàn được kiểm thử kỹ lưỡng trước khi tích hợp vào nguyên mẫu vật lý.

<figure><img src="/sdv101/lVmaYnpu4wyPLdfSJ4TP.webp" alt=""><figcaption></figcaption></figure>

Sự xuất hiện của **High-Performance Computing (HPC)** và **Software-Defined Vehicles (SDV — xe được định nghĩa bằng phần mềm)** đang làm thay đổi kiểm thử HIL theo nhiều cách quan trọng:

1. **Độ phức tạp gia tăng**: HPC cho phép tính toán tập trung và tích hợp theo domain, nghĩa là các hệ thống HIL phải mô phỏng cả một zone hoặc cả một domain của xe, chứ không chỉ những ECU riêng lẻ. Điều này đòi hỏi nhiều năng lực xử lý hơn và các môi trường ảo tiên tiến hơn.
2. **Khả năng mở rộng**: Các thiết lập HIL giờ đây cần mở rộng được cho kiến trúc SDV, nơi phần mềm liên tục tiến hóa. Ảo hóa và hỗ trợ cloud cho phép tích hợp phần cứng với các thành phần ảo để kiểm thử theo hướng module hóa và linh hoạt.
3. **Yêu cầu thời gian thực**: Các hệ thống dùng HPC và SDV đòi hỏi kiểm thử đồng bộ giữa ECU ảo hóa, phần cứng thật và các hệ thống kết nối để bảo đảm an toàn chức năng (ASIL) và hiệu năng.
4. **Trọng tâm hướng phần mềm**: SDV dựa vào các bản cập nhật phần mềm thường xuyên. Các hệ thống HIL đang tiến hóa để kiểm chứng nhanh chóng các bản cập nhật over-the-air (OTA), các cấu hình phần mềm động và các kịch bản thực tế.
5. **Tích hợp mô phỏng nâng cao**: Kết hợp HIL với môi trường ảo cho phép **kiểm thử lai (hybrid testing)**, trong đó các thành phần ảo và vật lý tương tác liền mạch với nhau. Điều này rất quan trọng để kiểm chứng các feature dựa trên AI, ADAS và các chức năng lái tự hành.

Về bản chất, HIL đang chuyển từ những thiết lập tĩnh và tách biệt sang những nền tảng động, tích hợp, có khả năng đáp ứng các kiến trúc SDV đang tiến hóa, điện toán hiệu năng cao và quá trình phát triển phần mềm theo thời gian thực.

## Kiểm thử System HIL

**System-HIL** (System Hardware-in-the-Loop) đại diện cho một cấp độ nâng cao của kiểm thử HIL, trong đó **toàn bộ các hệ thống của xe** — trải rộng từ powertrain, infotainment, ADAS đến điều khiển thân xe — được tích hợp vào một môi trường kiểm thử duy nhất. Khác với HIL ở cấp thành phần, System-HIL tập trung vào các **tương tác ở cấp hệ thống** một cách thực tế nhằm mô phỏng hành vi của cả chiếc xe trong điều kiện gần với thực tế.

<figure><img src="/sdv101/XTasKFdcdJQfwYgSPdT9.webp" alt=""><figcaption></figcaption></figure>

### House of HIL

**House of HIL** là một môi trường kiểm thử tiên tiến, tích hợp rất nhiều hệ thống **Hardware-in-the-Loop (HIL)** để kiểm chứng toàn bộ chiếc xe. Nó bao gồm **nhiều component HIL**, mỗi cái dành riêng để kiểm thử một ECU, cảm biến hoặc cơ cấu chấp hành cụ thể, và kết hợp chúng lại thành một **thiết lập kiểm thử ở cấp hệ thống** hoàn chỉnh.

<figure><img src="/sdv101/SUm3qnSVrVv2CCdbIv2T.webp" alt=""><figcaption></figcaption></figure>

Đối với **một chiếc xe duy nhất**, một thiết lập House of HIL thường bao gồm:

* **Hàng chục component HIL**: Mỗi HIL kiểm thử những ECU cụ thể (ví dụ ADAS, infotainment, phanh). Một chiếc xe hiện đại có thể có **30-70 ECU**, đòi hỏi số hệ thống HIL tương ứng.
* **Không gian vật lý**: Các rack kiểm thử HIL, nguồn cấp điện và hạ tầng làm mát đòi hỏi những **phòng lab chuyên dụng**. Với một chiếc xe hoàn chỉnh, quy mô này có thể trải ra nhiều phòng, thường vượt quá **hàng trăm mét vuông**.

<figure><img src="/sdv101/3PGNJJXuMyCRpWgwaYOt.webp" alt=""><figcaption></figcaption></figure>

Số lượng **component HIL** phụ thuộc vào độ phức tạp của xe:

* **SDV hiện đại**: Lên tới **hơn 50 component HIL** cho các ECU riêng lẻ.
* Mỗi HIL kiểm thử độc lập những chức năng như **powertrain**, ADAS, điều hòa không khí và điện tử thân xe trước khi tích hợp vào hệ thống.

House of HIL kết hợp các hệ thống này lại, bảo đảm tính đồng bộ và cho phép kiểm chứng đầu-cuối đối với những chiếc xe phức tạp.

### Tác động của điện toán hiệu năng cao và SDV

Sự xuất hiện của điện toán hiệu năng cao (High-Performance Compute) và SDV sẽ tác động đáng kể đến System-HIL, bao gồm:

1. **Tích hợp hệ thống**\
   Với HPC và các kiến trúc SDV tập trung, nhiều domain (powertrain, ADAS, infotainment) cần được kiểm thử một cách tích hợp. System-HIL bảo đảm tương tác thực tế giữa các hệ thống liên kết với nhau, cho phép kiểm chứng những phụ thuộc phức tạp.
2. **Quản lý dữ liệu và năng lực xử lý**\
   SDV sinh ra khối lượng dữ liệu thời gian thực khổng lồ. System-HIL dựa vào HPC để quản lý, xử lý và mô phỏng dữ liệu này một cách hiệu quả, bảo đảm kiểm thử chính xác những hệ thống nhạy cảm về thời gian như phanh và lái.
3. **Đồng bộ phần cứng — phần mềm**\
   Điện toán hiệu năng cao cho phép đồng bộ tốt hơn giữa các thành phần phần cứng vật lý và các hệ thống ảo. Với SDV, điều này là then chốt để kiểm chứng các cấu hình phần mềm liên tục tiến hóa và các bản cập nhật over-the-air (OTA).
4. **Khả năng mở rộng và kiểm thử module hóa**\
   Việc kiểm thử module hóa các hệ thống con được tích hợp vào một thiết lập System-HIL có khả năng mở rộng. Chẳng hạn, một mô phỏng toàn xe có thể kiểm thử từng zone hoặc từng domain riêng lẻ mà vẫn duy trì khả năng mở rộng ở phạm vi toàn hệ thống.
5. **Mô phỏng cảm biến và cơ cấu chấp hành sát thực tế**\
   Các chức năng ADAS tiên tiến và lái tự hành phụ thuộc vào việc mô phỏng chính xác cảm biến và cơ cấu chấp hành. System-HIL tích hợp phần cứng thật với cảm biến ảo để bảo đảm kiểm chứng hệ thống một cách thực tế và đáp ứng yêu cầu an toàn.
6. **Tối ưu chi phí và không gian**\
   Dù System-HIL đòi hỏi nguồn lực đáng kể, ảo hóa và HPC giúp giảm hạ tầng vật lý nhờ tích hợp các môi trường ảo, qua đó giảm thiểu chi phí và diện tích cần thiết cho những rack phần cứng truyền thống.

Hình dưới đây minh họa cách thiết kế một System HIL để kiểm thử Open Door API — cái tên mà đến giờ đã trở nên quen thuộc với chúng ta.

<figure><img src="/sdv101/I19HHQZAFYkdSRfnkuBy.webp" alt=""><figcaption></figcaption></figure>

### Kết luận

System-HIL, khi tiến hóa cùng HPC và SDV, hỗ trợ **kiểm thử toàn xe** bằng cách kết hợp phần cứng thật với các mô phỏng tiên tiến. Nó bảo đảm việc kiểm chứng có khả năng mở rộng, module hóa và đồng bộ, đồng thời giải quyết được độ phức tạp ngày càng tăng của các hệ thống xe hướng phần mềm và hiệu năng cao.

## Engineering Mules

**Engineering Mules** là những chiếc xe thử nghiệm ở giai đoạn sớm, được tạo ra bằng cách ghép các thành phần đang phát triển vào một nền tảng xe sản xuất hàng loạt sẵn có. Chúng cho phép **kiểm thử trong điều kiện thực tế** những hệ thống như powertrain, hệ thống treo hay các kiến trúc điện tử mới, từ rất lâu trước khi thiết kế xe cuối cùng sẵn sàng. Mule giúp **kiểm chứng các chức năng quan trọng** trong điều kiện lái thực, thu hẹp khoảng cách giữa mô phỏng và nguyên mẫu xe hoàn chỉnh. Chúng làm giảm **rủi ro phát triển** nhờ phát hiện sớm các sai sót thiết kế, cho phép kỹ sư hoàn thiện hệ thống trước khi đầu tư vào những bộ khuôn gá sản xuất tốn kém.

<figure><img src="/sdv101/VRBOmpUlrr4WrwtYbGcO.webp" alt=""><figcaption></figcaption></figure>

## Xe mẫu

Các mẫu thử A-D đại diện cho những giai đoạn phát triển nguyên mẫu nối tiếp nhau trong kiểm thử ô tô:

1. **A-Sample**: Nguyên mẫu ban đầu, dùng để kiểm chứng các chức năng cơ bản và phát hiện vấn đề tích hợp.
2. **B-Sample**: Nguyên mẫu nâng cao, tinh chỉnh tương tác giữa các hệ thống con, tối ưu phần mềm và kiểm thử độ bền.
3. **C-Sample**: Nguyên mẫu tiền sản xuất, trải qua đầy đủ các bài kiểm thử về pháp lý, an toàn và triển khai thực tế.
4. **D-Sample**: Nguyên mẫu theo đúng cấu hình sản xuất, xác nhận mức độ sẵn sàng để sản xuất, đáp ứng mọi yêu cầu về chất lượng và tuân thủ.

Trước đây, những chiếc xe không kết nối ở các giai đoạn mẫu A-D hầu như không gặp vấn đề về tương thích phiên bản, vì các hệ thống đều khép kín. Tuy nhiên, trong **SDV**, các backend trên cloud và các API Vehicle-to-Cloud (V2C) là bộ phận không thể tách rời của hoạt động xe. Nếu những **API hoặc dịch vụ backend** này thay đổi trong quá trình phát triển, sẽ nảy sinh các thách thức về quản lý phiên bản. Các xe mẫu ở những giai đoạn khác nhau (A-D) cần giữ cho **phần mềm on-board** và các dịch vụ cloud luôn đồng bộ với nhau. Sự lệch pha có thể gây lỗi chức năng hoặc lỗi kiểm thử, đòi hỏi kiểm soát phiên bản chặt chẽ, khả năng tương thích ngược và cập nhật có phối hợp trên toàn bộ các hệ thống. Sự đồng bộ này là yếu tố then chốt để tích hợp và kiểm chứng một cách liền mạch.

<figure><img src="/sdv101/UW2TjjK1phvX0skoGbxI.webp" alt=""><figcaption></figcaption></figure>

## Vehicle-in-the-Loop

Kiểm thử Vehicle-in-the-Loop (ViL) là phương pháp kết hợp xe thật với một môi trường mô phỏng để kiểm chứng các hệ thống của xe trong điều kiện được kiểm soát nhưng vẫn sát thực tế. Chiếc xe vận hành trên các bệ thử, chẳng hạn băng thử động lực học (chassis dynamometer), trong khi các đầu vào ảo mô phỏng điều kiện mặt đường, giao thông và dữ liệu cảm biến.

ViL đặc biệt hữu ích để kiểm chứng các hệ thống hỗ trợ lái nâng cao (ADAS), lái tự hành và quản lý năng lượng. Nó cho phép kiểm thử lặp lại được những kịch bản phức tạp mà không cần chạy thử trên đường thật, qua đó cải thiện an toàn, hiệu quả chi phí và tốc độ phát triển. Cách tiếp cận này bắc cầu giữa mô phỏng và kiểm thử thực tế.

<figure><img src="/sdv101/3xe9hL3pHDyRfYoFLeLK.webp" alt=""><figcaption></figcaption></figure>

## Kiểm thử đội xe và dữ liệu đội xe

Các đội xe thử nghiệm là yếu tố thiết yếu để kiểm chứng xe trong điều kiện thực tế, và sẽ dần chuyển thành đội xe sản xuất khi quá trình phát triển tiến triển. Ban đầu, những đội xe nhỏ (5-20 xe) kiểm chứng các hệ thống cốt lõi, tập trung vào kiểm thử chức năng và hiệu năng. Khi các hệ thống trưởng thành hơn, những đội xe cỡ vừa (50-200 xe) thu thập dữ liệu đa dạng, kiểm thử trên nhiều môi trường, nhiều kiểu hành vi người lái và các tình huống biên.

Các đội xe thử nghiệm sinh ra **hàng terabyte dữ liệu** mỗi ngày, bao gồm log cảm biến, giao tiếp V2C và dữ liệu chẩn đoán. Đội xe sản xuất mở rộng quy mô lên hàng nghìn chiếc, theo dõi độ tin cậy dài hạn, các bản cập nhật OTA và phản hồi thực tế từ người dùng để bảo đảm sẵn sàng đưa ra thị trường.

Với những OEM đi đầu, ngày nay mỗi chiếc xe sản xuất hàng loạt cũng đồng thời đóng vai trò một chiếc xe thử nghiệm cho các bản cập nhật feature mới được phân phối qua **Over-the-Air (OTA)**. Dù các bản cập nhật đều phải trải qua kiểm chứng và chứng nhận nghiêm ngặt, chúng cho phép đổi mới liên tục ngay cả sau khi xe đã xuất xưởng. Cách tiếp cận này giúp OEM thử nghiệm linh hoạt hơn, từng bước giới thiệu các feature hoặc cải tiến mới. So với trước đây, khi chiếc xe trở nên bất biến ngay sau khi bán ra, những chiếc xe sản xuất ngày nay đóng vai trò nền tảng cho phát triển lặp, tận dụng dữ liệu và phản hồi thực tế để tinh chỉnh hiệu năng, an toàn và trải nghiệm người dùng.

<figure><img src="/sdv101/H6zSbP4cIAjtGYTj3SDr.webp" alt=""><figcaption></figcaption></figure>

Dữ liệu đội xe mở ra nhiều cơ hội cho OEM và các đơn vị vận hành trong việc tối ưu hóa phát triển và vận hành xe:

1. **Phát triển sản phẩm**: Bằng cách nhận diện các mẫu hình và cách sử dụng thực tế, dữ liệu đội xe giúp tinh chỉnh feature, cải thiện hiệu năng xe và đáp ứng nhu cầu khách hàng một cách linh hoạt.
2. **Chứng nhận liên tục**: Dữ liệu này hỗ trợ tuân thủ bằng cách kiểm chứng các bản cập nhật phần mềm, bảo đảm chúng vẫn phù hợp với quy định khi chiếc xe tiếp tục tiến hóa.
3. **Quản lý đội xe**: Dữ liệu thời gian thực giúp tối ưu vận hành, giảm chi phí bảo dưỡng và tăng thời gian sẵn sàng hoạt động.
4. **Nghiên cứu và đổi mới**: Các tập dữ liệu đã ẩn danh là nguồn nhiên liệu cho việc phát triển mô hình AI phục vụ lái tự hành và các công nghệ tiên tiến khác.
5. **Hỗ trợ khách hàng**: Phát hiện sự cố chủ động giúp nâng cao chất lượng hỗ trợ và giảm gián đoạn cho khách hàng.
6. **Nỗ lực phát triển bền vững**: Dữ liệu đội xe theo dõi lượng phát thải và thúc đẩy các sáng kiến xanh, góp phần vào các mục tiêu môi trường.

<figure><img src="/sdv101/VqbgCX2DovplBrknnH3Z.webp" alt=""><figcaption></figcaption></figure>
