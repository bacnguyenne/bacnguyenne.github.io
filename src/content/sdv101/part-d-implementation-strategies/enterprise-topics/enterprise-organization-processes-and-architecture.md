---
title: "Tổ chức, quy trình và kiến trúc ở cấp doanh nghiệp"
description: "Bốn trụ cột cho doanh nghiệp SDV: trách nhiệm end-to-end, shift-left để lấy phản hồi sớm và ổn định API, kết hợp MBSE với DevOps, và nền tảng SDV tái sử dụng."
order: 57
part: "D"
depth: 2
origTitle: "Enterprise Organization, Processes, and Architecture"
origUrl: "https://www.sdv.guide/sdv101/part-d-implementation-strategies/enterprise-topics/enterprise-organization-processes-and-architecture"
---

Độ phức tạp của Software-Defined Vehicle (SDV — xe được định nghĩa bằng phần mềm) đòi hỏi một sự thay đổi căn bản trong cách tổ chức doanh nghiệp, quy trình và kiến trúc hệ thống. Sự chuyển đổi này xuất phát từ nhu cầu phải đồng bộ các đội nhóm, công cụ và công nghệ để bàn giao các bản cập nhật phần mềm nhanh hơn, chất lượng cao hơn, đồng thời duy trì tính nhất quán end-to-end. Để đạt được điều đó, doanh nghiệp phải tập trung vào ba yếu tố then chốt: **trách nhiệm end-to-end**, tận dụng **cách tiếp cận shift-left** để có phản hồi sớm, và ổn định hóa các yêu cầu API cùng kiến trúc.

Bên cạnh đó, việc kết hợp **Model-Based Systems Engineering (MBSE)** với **DevOps** lấy mã nguồn làm trung tâm trở nên thiết yếu để cân bằng giữa góc nhìn tổng thể của tổ chức và quá trình phát triển agile, mang tính lặp.

## 1. Trách nhiệm end-to-end

Trong bối cảnh SDV, các đội nhóm đa kỹ năng phải đảm nhận **trách nhiệm end-to-end** đối với việc bàn giao các feature và chức năng. Những feature này được cấu thành từ các **artifact** do nhiều value stream đóng góp, mỗi value stream lại có delivery pipeline vận hành ở **tốc độ khác nhau**. Ví dụ, các thành phần phần mềm cho cloud backend, hệ thống nhúng và phần cứng trên xe tiến hóa độc lập với nhau nhưng vẫn phải tích hợp một cách liền mạch.

<figure><img src="/sdv101/P0h1O4LXSRJcYRB1kImn.webp" alt=""><figcaption></figcaption></figure>

Để thành công, các đội nhóm phải cộng tác xuyên suốt các lĩnh vực, đảm bảo quyền sở hữu trải dài từ lúc hình thành ý tưởng feature cho đến khi bàn giao và kiểm định. Bằng cách áp dụng trách nhiệm end-to-end, tổ chức có thể:

* Giảm số lần bàn giao trung gian và độ trễ giữa các đội nhóm.
* Cải thiện chất lượng và tính nhất quán của các feature được bàn giao.
* Nuôi dưỡng tư duy hệ thống, xét đến toàn bộ vòng đời của một chức năng.

## 2. Dùng shift-left để nhận phản hồi sớm từ người dùng cuối

**Cách tiếp cận shift-left** đề cao việc kiểm thử, kiểm định và thu thập phản hồi người dùng ở giai đoạn sớm hơn trong quá trình phát triển. Với SDV, các prototype ảo của **feature và chức năng end-to-end** cho phép hình thành vòng phản hồi từ rất lâu trước khi có prototype vật lý.

<figure><img src="/sdv101/GQtFuyxAMGfBKpFY4wFk.webp" alt=""><figcaption></figcaption></figure>

Bằng cách sử dụng môi trường ảo và công cụ mô phỏng, các đội nhóm có thể:

* Kiểm định hành vi của feature trong nhiều cấu hình khác nhau.
* Thu thập phản hồi sớm từ người dùng cuối để bám sát nhu cầu khách hàng.
* Phát hiện và xử lý vấn đề trước khi tích hợp vào xe thật.

Quy trình lặp này giúp tổ chức giảm rủi ro phát triển, rút ngắn thời gian đưa sản phẩm ra thị trường và đảm bảo các feature cuối cùng đáp ứng kỳ vọng của người dùng cuối.

## 3. Dùng shift-left để ổn định hóa yêu cầu API và kiến trúc end-to-end

Việc ổn định hóa **yêu cầu API** và **kiến trúc end-to-end** ngay từ sớm trong quá trình phát triển là yếu tố then chốt để quản lý độ phức tạp của SDV. API định nghĩa giao diện giữa các thành phần thuộc những hệ thống khác nhau (ví dụ: cloud, phần mềm nhúng và phần cứng trên xe), và bất kỳ sự thiếu ổn định nào cũng có thể dẫn tới lỗi tích hợp và chậm tiến độ.

<figure><img src="/sdv101/VtccvuqO7GfaLNP2ycpB.webp" alt=""><figcaption></figcaption></figure>

Nhờ shift-left, các đội nhóm có thể:

* Định nghĩa và kiểm định yêu cầu API từ sớm thông qua prototype ảo và các vòng phản hồi lặp.
* Đảm bảo tính nhất quán về kiến trúc giữa các value stream và delivery pipeline.
* Giảm thiểu những thay đổi ở giai đoạn muộn vốn gây gián đoạn cho phát triển và kiểm thử.

Một kiến trúc end-to-end ổn định tạo nền tảng vững chắc để tích hợp các delivery pipeline nhiều tốc độ, đảm bảo các feature và chức năng tiến hóa một cách gắn kết trong toàn hệ sinh thái SDV.

## 4. Kết hợp MBSE và DevOps lấy mã nguồn làm trung tâm

Việc tích hợp **Model-Based Systems Engineering (MBSE)** với **DevOps** lấy mã nguồn làm trung tâm giải quyết bài toán kép: vừa duy trì **góc nhìn tổng thể về tổ chức và kiến trúc**, vừa tuân thủ các nguyên tắc phát triển agile, mang tính lặp.

* **MBSE** tập trung vào việc xây dựng các mô hình hệ thống ở mức cao, định nghĩa yêu cầu, và đảm bảo các quyết định về kiến trúc cũng như ở cấp hệ thống được kiểm chứng đối chiếu với mục tiêu tổng thể. Nó cung cấp "bức tranh lớn" về cấu trúc, hành vi và các phụ thuộc của hệ thống — điều thiết yếu để quản lý độ phức tạp của SDV.
* **DevOps** đi theo nguyên tắc agile "**code first**", trong đó việc phát triển tiến triển theo vòng lặp với prototype, kiểm thử và tích hợp nhanh. Các thực hành lấy mã nguồn làm trung tâm ưu tiên bàn giao phần mềm chạy được và duy trì các vòng phản hồi liên tục.

<figure><img src="/sdv101/gcnics5dQRTHdG3w5Cqg.webp" alt=""><figcaption></figcaption></figure>

Kết hợp MBSE với DevOps cho phép tổ chức:

* Gắn kết các quyết định kiến trúc với việc hiện thực hóa phần mềm trong thực tế.
* Cân bằng giữa tư duy hệ thống dài hạn và khả năng phản ứng linh hoạt kiểu agile trước thay đổi.
* Liên tục kiểm chứng các mô hình hệ thống đối chiếu với mã nguồn đã bàn giao nhằm đảm bảo khả năng truy vết và tính nhất quán.

Cách tiếp cận này đảm bảo quá trình phát triển SDV vừa **có cấu trúc vừa linh hoạt**, giúp các đội nhóm bàn giao những hệ thống phức tạp một cách hiệu quả trong khi vẫn bám sát mục tiêu của tổ chức và yêu cầu của khách hàng.

#### 5. Xây dựng nền tảng SDV có thể tái sử dụng

Mục tiêu sau cùng của phát triển SDV là thiết lập được một **nền tảng có thể tái sử dụng**, cho phép phần mềm được chia sẻ, tùy biến và điều chỉnh một cách hiệu quả trên **nhiều dòng xe** và **nhiều thế hệ xe**.

<figure><img src="/sdv101/26elvYAT7COYjBY9BktY.webp" alt=""><figcaption></figcaption></figure>

Một nền tảng SDV tái sử dụng được sẽ mang lại:

* **Phần mềm lõi dùng chung** làm nền tảng cho tất cả các xe.
* **Các lớp tùy biến** giúp điều chỉnh phần mềm lõi cho từng dòng xe, feature hoặc yêu cầu khách hàng cụ thể, như minh họa bởi các thành phần tùy biến trong sơ đồ.
* **Giao diện và API** chuẩn hóa việc giao tiếp giữa các thành phần, đảm bảo tính module hóa và dễ tích hợp.

Bằng cách cho phép tái sử dụng và tùy biến phần mềm, tổ chức có thể:

* Giảm đáng kể chi phí và công sức phát triển cho các dòng xe mới.
* Rút ngắn thời gian đưa các feature và bản cập nhật phần mềm ra thị trường.
* Thúc đẩy cải tiến và đổi mới liên tục trên các nền tảng thông qua những thành phần phần mềm dùng chung.

Tóm lại, việc phát triển một nền tảng SDV có thể tái sử dụng là chìa khóa để đạt được khả năng mở rộng, hiệu quả chi phí và đổi mới sáng tạo. Bằng cách kết hợp trách nhiệm end-to-end, các cách tiếp cận shift-left, cùng việc tích hợp MBSE và DevOps, tổ chức có thể xây dựng một nền móng vững chắc, linh hoạt, tạo động lực cho thành công bền vững trong kỷ nguyên SDV.
