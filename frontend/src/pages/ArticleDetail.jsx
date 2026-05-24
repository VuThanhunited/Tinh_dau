import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoArticles = [
    {
      _id: 'da1',
      title: 'Tinh dầu oải hương có tác dụng gì? Lợi ích và cách sử dụng',
      image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
      date: '15/03/2026',
      description: 'Tìm hiểu các tác dụng của tinh dầu oải hương đối với sức khỏe và giấc ngủ ngon sâu.',
      badge: '100% NGUYÊN CHẤT',
      badgeIcon: '🌿',
      author: 'Dược sĩ Thanh Thảo',
      content: `Tinh dầu oải hương (Lavender Essential Oil) là một trong những loại tinh dầu thiên nhiên được yêu thích và sử dụng phổ biến nhất trên toàn thế giới nhờ mùi hương ngọt ngào, thư thái cùng vô vàn lợi ích tuyệt vời cho cả sức khỏe lẫn sắc đẹp.

### 1. Giải tỏa căng thẳng, mệt mỏi và cải thiện giấc ngủ
Tác dụng nổi bật nhất của tinh dầu oải hương là khả năng làm dịu hệ thần kinh trung ương. Các nghiên cứu khoa học đã chỉ ra rằng việc ngửi tinh dầu oải hương giúp làm giảm nhịp tim, hạ huyết áp nhẹ và đưa cơ thể vào trạng thái thư giãn sâu. Nhờ vậy, đây được coi là liều thuốc tự nhiên hỗ trợ hiệu quả cho những người bị mất ngủ kinh niên hoặc khó ngủ do áp lực công việc.

### 2. Hỗ trợ chăm sóc và làm dịu làn da nhạy cảm
Tinh dầu oải hương nguyên chất có tính kháng khuẩn và chống oxy hóa mạnh mẽ. Khi thoa lên da (đã pha loãng với dầu dẫn như dầu dừa, dầu jojoba), tinh dầu giúp làm dịu nhanh chóng các vết côn trùng cắn, vết bỏng nhẹ hoặc các vùng da bị viêm đỏ do dị ứng thời tiết. Đặc biệt, hoạt chất linalool tự nhiên trong oải hương hỗ trợ làm mờ thâm mụn và kích thích tái tạo tế bào da mới khỏe mạnh.

### 3. Cách sử dụng tinh dầu oải hương đơn giản tại nhà
- **Xông phòng tạo hương thơm:** Nhỏ 3-5 giọt tinh dầu oải hương vào máy khuếch tán phun sương siêu âm để thanh lọc không gian ngủ 30 phút trước khi đi ngủ.
- **Tắm thư giãn:** Nhỏ 5 giọt tinh dầu vào bồn nước ấm cùng một chút muối Epsom, ngâm mình xoa dịu cơ khớp toàn thân.
- **Xịt gối thơm:** Pha tinh dầu với nước cất và cồn y tế theo tỷ lệ nhẹ để xịt trực tiếp lên vỏ gối trước khi nằm ngủ.`
    },
    {
      _id: 'da2',
      title: 'Tinh dầu tràm trà – "Kháng sinh tự nhiên" cho sức khỏe và làn da',
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      date: '10/06/2026',
      description: 'Tinh dầu tràm trà nổi tiếng với đặc tính kháng khuẩn vượt trội giúp hỗ trợ trị mụn.',
      badge: 'NGUỒN GỐC RÕ RÀNG',
      badgeIcon: '📦',
      author: 'Chuyên gia Da liễu Khánh An',
      content: `Tràm trà (Tea Tree) từ lâu đã được xem là báu vật y học dân gian của thổ dân Úc nhờ khả năng sát trùng và phục hồi vết thương vô cùng hiệu quả. Ngày nay, tinh dầu tràm trà đã trở thành thành phần không thể thiếu trong các sản phẩm chăm sóc da mụn cao cấp.

### 1. Khả năng tiêu diệt vi khuẩn mụn P. acnes vượt trội
Tinh dầu tràm trà chứa hàm lượng lớn hoạt chất Terpinen-4-ol có đặc tính kháng viêm, kháng khuẩn tự nhiên rất mạnh. Khi tiếp xúc với các ổ mụn viêm, tinh dầu nhanh chóng thẩm thấu sâu xuống lỗ chân lông, tiêu diệt vi khuẩn gây mụn, làm giảm tình trạng sưng tấy đỏ và gom cồi mụn nhanh chóng mà không gây chai sần bề mặt da như các hoạt chất hóa học thông thường.

### 2. Khử mùi và làm sạch sâu da đầu, ngăn ngừa gàu nấm
Bên cạnh khả năng trị mụn cho da mặt, tinh dầu tràm trà còn cực kỳ hữu ích trong việc loại bỏ gàu bám trên da đầu và kiểm soát dầu thừa hiệu quả. Đặc tính kháng nấm của sản phẩm giúp làm dịu cơn ngứa ngáy da đầu do nấm gàu gây ra.

### 3. Hướng dẫn sử dụng tinh dầu tràm trà an toàn đúng cách
- **Chấm trị mụn trực tiếp:** Nhúng tăm bông sạch vào tinh dầu tràm trà nguyên chất, chấm nhẹ nhàng lên đầu mụn bọc sưng đỏ. Sử dụng 1-2 lần mỗi ngày sau bước dưỡng ẩm.
- **Xông hơi thải độc:** Nhỏ 2 giọt tinh dầu vào tô nước nóng bốc hơi, trùm khăn kín đầu xông mặt trong 5 phút để làm thông thoáng hoàn toàn lỗ chân lông.
- **Trộn vào dầu gội:** Thêm 1 giọt tràm trà vào lượng dầu gội mỗi lần sử dụng để massage da đầu nhẹ nhàng rồi xả sạch với nước.`
    },
    {
      _id: 'da3',
      title: '7 cách sử dụng tinh dầu giúp giảm căng thẳng, ngủ ngon hơn',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      date: '05/08/2026',
      description: 'Hướng dẫn các phương pháp khuếch tán, massage tinh dầu xua tan mọi mệt mỏi.',
      badge: 'THÂN THIỆN MÔI TRƯỜNG',
      badgeIcon: '🌎',
      author: 'HLV Yoga Minh Trí',
      content: `Trong nhịp sống hiện đại hối hả đầy áp lực, việc tìm kiếm những giây phút bình yên để thư giãn tinh thần là vô cùng quý giá. Liệu pháp hương thơm (Aromatherapy) sử dụng tinh dầu thiên nhiên nguyên chất chính là một giải pháp đơn giản nhưng mang lại hiệu quả kỳ diệu giúp giải tỏa stress và mang lại giấc ngủ ngon sâu giấc.

### 1. Khuếch tán hương thơm bằng máy xông siêu âm
Đây là phương pháp phổ biến và dễ dàng nhất. Chỉ cần nhỏ 4-6 giọt tinh dầu yêu thích (như Oải hương, Cam ngọt, Sả chanh) vào khay chứa nước sạch của máy khuếch tán. Hơi nước chứa tinh thể dầu siêu mịn sẽ nhanh chóng lan tỏa khắp căn phòng, tạo nên bầu không khí êm dịu thanh lọc tinh thần.

### 2. Liệu pháp massage thư giãn cơ bắp toàn thân
Massage kết hợp tinh dầu không chỉ giúp giảm đau mỏi các bó cơ sau vận động mà mùi hương bay lên từ làn da còn giúp xoa dịu hệ thần kinh trung ương cực tốt. Hãy luôn nhớ pha loãng tinh dầu nguyên chất với dầu nền lành tính (như dầu hạnh nhân, dầu hạt nho) trước khi xoa bóp lên da cơ thể.

### 3. Ngâm chân thư giãn giải độc cơ thể trước khi ngủ
Ngâm chân bằng nước ấm pha muối hồng Hymalaya cùng 3 giọt tinh dầu sả chanh hoặc gừng ấm là một bí quyết cổ truyền tuyệt vời. Việc này giúp kích thích các huyệt đạo dưới lòng bàn chân, thúc đẩy tuần hoàn máu và đem lại cảm giác ấm áp dễ chịu, giúp bạn dễ dàng đi vào giấc ngủ ngon lành.`
    },
    {
      _id: 'da4',
      title: 'Tinh dầu chanh – Bí quyết làm sạch và khử mùi tự nhiên cho ngôi nhà',
      image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=800&q=80',
      date: '20/09/2026',
      description: 'Tinh dầu vỏ chanh vàng tươi mát giúp thanh lọc không khí và dọn dẹp nhà cửa tối ưu.',
      badge: 'HÀNG NGÀN KHÁCH TIN DÙNG',
      badgeIcon: '⭐',
      author: 'Chuyên gia Organics Mai Vy',
      content: `Ngôi nhà sạch sẽ, thơm mát là chìa khóa bảo vệ sức khỏe cho cả gia đình. Nếu bạn đang muốn giảm thiểu tối đa việc sử dụng các hóa chất tẩy rửa công nghiệp độc hại trong nhà, thì tinh dầu Chanh vàng (Lemon) chính là trợ thủ đắc lực hàng đầu dành cho bạn.

### 1. Sức mạnh khử mùi hôi mốc, thanh lọc bầu không khí sống
Hương thơm tươi mát, tràn đầy năng lượng từ vỏ chanh ép lạnh có khả năng trung hòa và tiêu diệt các phân tử gây mùi ẩm mốc khó chịu trong tủ quần áo, phòng bếp hay nhà vệ sinh rất nhanh. Xông tinh dầu chanh mang lại cảm giác sạch sẽ, mát mẻ sảng khoái tức thì.

### 2. Tự chế dung dịch vệ sinh đa năng an toàn từ tinh dầu chanh
Axit citric tự nhiên kết hợp cùng các hợp chất terpenoid kháng khuẩn trong tinh dầu chanh giúp đánh bay các vết dầu mỡ cứng đầu và khử trùng các bề mặt bàn bếp cực kỳ hiệu quả.
- **Công thức:** Pha 10 giọt tinh dầu chanh + 1/2 chén giấm trắng + 1 chén nước ấm vào bình xịt. Lắc đều trước khi xịt lau các bề mặt kính, bàn ăn hoặc tủ gỗ.

### 3. Giúp tăng cường năng lượng tích cực và sự tập trung cao độ
Hít ngửi tinh dầu chanh giúp kích thích sản sinh serotonin trong não bộ, giảm cảm giác lo âu bồn chồn, tăng cường sự lạc quan phấn chấn và hỗ trợ tập trung làm việc hiệu quả.`
    }
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetch(`${API_URL}/articles/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setArticle(data);
        fetchLatest(data._id);
      } catch {
        const local = localStorage.getItem('essential_local_articles');
        const list = local ? JSON.parse(local) : demoArticles;
        const found = list.find(a => a._id === id) || demoArticles.find(a => a._id === id) || demoArticles[0];
        // Enrich with full content fallback if not present
        const demoData = demoArticles.find(da => da.title === found.title) || {};
        const enriched = {
          ...found,
          content: found.content || demoData.content || 'Nội dung chi tiết của bài viết đang được cập nhật. Cảm ơn bạn đã quan tâm theo dõi các kiến thức bổ ích về tinh dầu thiên nhiên cao cấp từ Essential Oil.',
          author: found.author || demoData.author || 'Essential Oil Editor'
        };
        setArticle(enriched);
        fetchLatest(enriched._id, list);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatest = (currentId, customList = null) => {
      let list = [];
      if (customList) {
        list = customList;
      } else {
        const local = localStorage.getItem('essential_local_articles');
        list = local ? JSON.parse(local) : demoArticles;
      }
      const latest = list.filter(a => a._id !== currentId).slice(0, 4);
      setLatestArticles(latest.length > 0 ? latest : list.filter(a => a._id !== currentId).slice(0, 4));
    };

    fetchArticle();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="article-detail-loading-page">
        <Header />
        <div className="detail-loading-spinner-container">
          <div className="spinner"></div>
          <p>Đang tải kiến thức tinh dầu thiên nhiên...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-error-page">
        <Header />
        <div className="container error-container glass">
          <h2>Oops! Không tìm thấy bài viết</h2>
          <p>Bài viết bạn tìm kiếm có thể đã được gỡ bỏ hoặc đang cập nhật.</p>
          <Link to="/" className="btn btn-primary">Quay về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <Header />

      {/* Editor Banner Header */}
      <section className="article-editorial-header" style={{ backgroundImage: `linear-gradient(rgba(45, 55, 72, 0.4), rgba(45, 55, 72, 0.85)), url(${article.image})` }}>
        <div className="container header-editorial-content animate-fade-in">
          <div className="article-badge-row">
            <span className="badge-editorial">
              <span className="icon">{article.badgeIcon || '🌿'}</span>
              <span>{article.badge || 'KIẾN THỨC TINH DẦU'}</span>
            </span>
          </div>
          <h1 className="editorial-title">{article.title}</h1>
          <div className="editorial-meta-row">
            <span className="meta-item author-meta">✍️ Đăng bởi: <strong>{article.author}</strong></span>
            <span className="meta-divider">|</span>
            <span className="meta-item date-meta">📅 Ngày đăng: {article.date || '15/03/2026'}</span>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="article-body-layout container">
        <div className="article-layout-grid">
          
          {/* Left Side: Article Content */}
          <article className="article-main-content glass">
            <p className="article-excerpt">
              <em>{article.description}</em>
            </p>
            
            {/* Detailed Content render with paragraphs & markdown headings simulation */}
            <div className="article-rich-text">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="rich-heading">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="rich-bullet-list">
                      {paragraph.split('\n').map((li, i) => (
                        <li key={i}>{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index} className="rich-paragraph">{paragraph}</p>;
              })}
            </div>

            {/* Sharing widgets */}
            <div className="article-share-bar">
              <span className="share-label">Chia sẻ bài viết bổ ích này:</span>
              <div className="share-buttons">
                <button className="share-btn fb" onClick={() => alert('Chia sẻ lên Facebook!')}>f Facebook</button>
                <button className="share-btn zt" onClick={() => alert('Sao chép đường dẫn thành công!')}>🔗 Sao chép link</button>
              </div>
            </div>
          </article>

          {/* Right Side: Sidebar - Latest Articles */}
          <aside className="article-sidebar">
            <div className="sidebar-widget glass">
              <h3 className="widget-title">BÀI VIẾT MỚI NHẤT</h3>
              <div className="sidebar-latest-list">
                {latestArticles.map(la => (
                  <div className="sidebar-article-item" key={la._id} onClick={() => navigate(`/article/${la._id}`)}>
                    <div className="item-img-box">
                      <img src={la.image} alt={la.title} />
                    </div>
                    <div className="item-info-box">
                      <h4 className="item-title">{la.title}</h4>
                      <span className="item-date">📅 {la.date || '15/03/2026'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Ads widget */}
            <div className="sidebar-ad-widget glass" style={{ backgroundImage: 'linear-gradient(rgba(126, 87, 194, 0.85), rgba(94, 53, 177, 0.95)), url("https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80")' }}>
              <h3>Tinh Dầu Thiên Nhiên 100% Nguyên Chất</h3>
              <p>Thanh lọc không khí, nâng niu giấc ngủ và chăm sóc làn da trọn vẹn mỗi ngày.</p>
              <Link to="/" className="btn btn-ad-buy">MUA NGAY</Link>
            </div>
          </aside>

        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">VỀ CHÚNG TÔI</h4>
            <p className="footer-col-text">Mypham13.maugiaodien.com chuyên cung cấp các loại tinh dầu thiên nhiên nguyên chất, an toàn cho sức khỏe và thân thiện với môi trường.</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">THÔNG TIN LIÊN HỆ</h4>
            <ul className="footer-contact-list">
              <li><span>📞</span> Hotline: 0988.888.888</li>
              <li><span>✉️</span> Email: hello@maugiaodien.com</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">CHÍNH SÁCH</h4>
            <ul className="footer-links">
              <li><Link to="/">Chính sách bảo mật</Link></li>
              <li><Link to="/">Chính sách đổi trả</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">ĐĂNG KÝ NHẬN TIN</h4>
            <p className="footer-col-text">Nhận thông tin khuyến mãi mới nhất từ chúng tôi</p>
            <form className="footer-subscribe" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Nhập email..." className="footer-email-input" />
              <button type="submit" className="footer-subscribe-btn">→</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 mypham13.maugiaodien.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleDetail;
